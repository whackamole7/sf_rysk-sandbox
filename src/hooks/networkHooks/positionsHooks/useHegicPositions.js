import { useChainId } from "wagmi";
import { getAlchemyProvider, getSigner } from './../../../network/providers';
import { ethers } from "ethers";
import useGodEye from './../../../environment/contextHooks/useGodEye/useGodEye';
import useSWR from "swr";
import { getContractData, getHegicStrategiesAddresses, getHegicStrategiesAddressesArray, getHegicStrategyContract } from "../../../network/contracts/contractsData";
import { resolvePromisesPack } from './../../../utils/asyncUtils';
import { useEffect, useState } from "react";
import { FETCH_POSITIONS_INTERVAL } from './../../../environment/constants/optionsConstants';
import { bigIntFromNumber, bringToDefaultDecimals, convertDataToBigInt, negativeBigInt } from '../../../utils/dataTypesUtils/bigIntUtils';
import { MILISECONDS_IN_SECOND } from "../../../environment/constants/dateConstants";
import { bringTokenAmountToDefaultDecimals } from './../../../utils/tokenUtils';
import { HEGIC_DECIMALS, USDC_DECIMALS } from "../../../environment/constants/tokensConstants";
import { calcHegicDeltaByAssetPrice, calcPnlPercentage } from "../../../utils/optionsUtils";
import useTokenPrices from './../tokenHooks/tokenPrices/useTokenPrices';


const PROMISES_LIMIT = 13;


const useHegicPositions = (callback) => {
	const { isConnected, account } = useGodEye();
	const chainId = useChainId();

	const tokenPrices = useTokenPrices();

	const [hegicPositions, setHegicPositions] = useState(undefined);

	const resetPositions = () => {
		if (hegicPositions) {
			setHegicPositions(undefined);
		}
	};

	const Hegic_PositionManager = new ethers.Contract(
		...getContractData(chainId, "Hegic_PositionManager"),
		getAlchemyProvider(chainId)
	);

	const { error: positionsDataError, mutate } = useSWR(
		isConnected && tokenPrices && [account, "useHegicPositions"],
		async () => {
			const positions = [];

			const strategiesAddresses = getHegicStrategiesAddressesArray(chainId);
			
			const transferFilter = getTransferFilter(Hegic_PositionManager, account);
			const transferEvents = await Hegic_PositionManager.queryFilter(transferFilter);

			const optionsIds = transferEvents.map(event => event.args.tokenId);
			
			if (optionsIds.length) {
				const promisesPack = [];
			
				for (let i = 0; i < strategiesAddresses.length; i++) {
					const strategyAddress = strategiesAddresses[i];
					const strategyContract = getHegicStrategyContract(chainId, strategyAddress);

					const buyFilter = getBuyFilter(strategyAddress, optionsIds);
					const buyEvents = strategyContract.queryFilter(buyFilter)
						.then(events => {
							return Promise.all (
								events.map(event => {
									return (
										waitPositionFromEvent(chainId, event, account, tokenPrices)
											.then(position => {
												if (position) {
													positions.push(position);
												}
											})
									)
								})
							)
						})

					promisesPack.push(buyEvents);

					await resolvePromisesPack(
						promisesPack,
						PROMISES_LIMIT,
						strategiesAddresses.length,
						i
					);
				}
			}

			setHegicPositions(positions ?? []);

			if (callback) {
				callback();
			}
			
			return positions;
		},
		{ refreshInterval: FETCH_POSITIONS_INTERVAL }
	)

	useEffect(() => {
		resetPositions();
		
		if (account) {
			mutate().then(setHegicPositions);
		}
	}, [account, isConnected]);

	if (positionsDataError) {
		console.log('Fetching Hegic positions error:\n', positionsDataError);
		return;
	}

	return hegicPositions;
}


const getTransferFilter = (positionManager, account) => {
	return {
		address: positionManager.address,
		topics: [
			ethers.utils.id("Transfer(address,address,uint256)"),
			null,
			ethers.utils.hexZeroPad(account, 32),
		]
	}
}

const getBuyFilter = (strategyAddress, optionsIds) => {
	const buyTopics = [
		ethers.utils.id("Acquired(uint256,(uint128,uint128),uint256,uint256,uint256,bytes[])"),
		optionsIds.map(id => ethers.utils.hexZeroPad(id, 32))
	];

	const buyFilter = {
		address: strategyAddress,
		topics: buyTopics,
	};

	return buyFilter;
}

const waitPositionFromEvent = async (chainId, event, account, tokenPrices) => {
	const strategyAddress = event.address;
	const position = convertDataToBigInt(
		event.decode(event.data, event.topics)
	);
	position.data = convertDataToBigInt(position.data);

	const Hegic_OperationalTreasury = new ethers.Contract(
		...getContractData(chainId, "Hegic_OperationalTreasury"),
		getAlchemyProvider(chainId)
	);

	const additionalData = await Hegic_OperationalTreasury.lockedLiquidity(position.id);

	const isPositionActive = additionalData.state !== 0;
	if (!isPositionActive) {
		return;
	}

	const {
		asset,
		isCall,
		isSpread,
		strikeScale
	} = getDataFromStrategyAddress(chainId, strategyAddress);
	Object.assign(position, { asset, isCall, isSpread });

	const amount = bringTokenAmountToDefaultDecimals(position.data.amount, asset);

	const assetPrice = tokenPrices[asset];

	const strike = getStrike(position, strikeScale);
	Object.assign(position, { strike });

	const { premium, pnl } = await waitPremiumAndPnl(chainId, position, strategyAddress);
	const isZeroProfit = pnl.inPercentage === bigIntFromNumber(-100);

	const expiry = additionalData.expiration * MILISECONDS_IN_SECOND;

	const greeks = getGreeks(position, assetPrice);

	const formattedPosition = {
		id: Number(position.id),
		market: "Hegic",
		asset,
		amount,
		strike,
		isCall,
		isSpread,
		isBuy: true,
		premium,
		pnl,
		expiry,
		greeks,
		utils: {
			calcPnl: async () => {
				return new Promise(resolve => {
					resolve(pnl);
				})
			}
		},
		actions: {
			close: async () => {
				const signer = getSigner();

				return (
					Hegic_OperationalTreasury
						.connect(signer)
						.payOff(position.id, account)
				);
			},
			isClosingDisabled: isZeroProfit,
		}
	}
	
	return formattedPosition;
}

const getDataFromStrategyAddress = (chainId, strategyAddress) => {
	const strategies = getHegicStrategiesAddresses(chainId);
	const strategyKey = Object.keys(strategies).find(key => strategies[key] === strategyAddress);

	const [strategyType, strikeScale, asset] = strategyKey.split("_");

	const isCall = strategyType.includes("CALL");
	const isSpread = strategyType.includes("SPREAD");

	return {
		asset,
		isCall,
		isSpread,
		strikeScale,
	};
}

const getStrike = (position, strikeScale) => {
	const buyingPrice = bringToDefaultDecimals(position.data.strike, HEGIC_DECIMALS);

	let strike = buyingPrice / 100n * (BigInt(strikeScale));

	if (position.isSpread) {
		strike = buyingPrice;
	}

	return strike;
}

const waitPremiumAndPnl = async (chainId, position, strategyAddress) => {
	const strategyContract = getHegicStrategyContract(chainId, strategyAddress);

	const premium = negativeBigInt(
		bringToDefaultDecimals(position.positivepnl, USDC_DECIMALS)
	);
	const profit = bringToDefaultDecimals(
		BigInt(await strategyContract.payOffAmount(position.id)),
		USDC_DECIMALS
	);
	const pnlUSDC = profit + premium;

	const pnl = {
		inUSDC: pnlUSDC,
		inPercentage: calcPnlPercentage(profit, premium)
	};

	return {
		premium,
		pnl
	}
}

const getGreeks = (position, assetPrice) => {
	const { isCall, strike } = position;

	const delta = calcHegicDeltaByAssetPrice(isCall, strike, assetPrice);
	
	return {
		delta,
		vega: 0,
		gamma: 0,
		theta: 0,
		rho: 0,
	}
}


export default useHegicPositions;