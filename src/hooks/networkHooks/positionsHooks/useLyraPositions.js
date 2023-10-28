import { useChainId } from "wagmi";
import { getLyra, getSigner } from "../../../network/providers";
import useGodEye from './../../../environment/contextHooks/useGodEye/useGodEye';
import useSWR from "swr";
import { MILISECONDS_IN_SECOND } from './../../../environment/constants/dateConstants';
import { convertDataToBigInt, numberFromBigInt } from '../../../utils/dataTypesUtils/bigIntUtils';
import { useEffect, useState } from "react";
import { FETCH_POSITIONS_INTERVAL, LYRA_TRADE_SLIPPAGE } from './../../../environment/constants/optionsConstants';
import { DEFAULT_DECIMALS } from "../../../environment/constants/tokensConstants";
import { BigNumber } from "ethers";
import { popErrorToast } from "../../../utils/toastsUtils";
import { SF_WALLET } from "../../../environment/constants/commonConstants";
import { calcPnlPercentage, waitFormatCollateralFromLyra } from "../../../utils/optionsUtils";


const useLyraPositions = (callback) => {
	const { account, isConnected } = useGodEye();

	const [lyraPositions, setLyraPositions] = useState(undefined);

	const resetPositions = () => {
		if (lyraPositions) {
			setLyraPositions(undefined);
		}
	};
	
	const chainId = useChainId();
	const LYRA = getLyra(chainId);


	const { error: positionsDataError, mutate } = useSWR(
		isConnected && [account, "useLyraPositions"],
		async () => {
			const positions = await LYRA.positions(account);
			if (!positions) {
				setLyraPositions([]);
				return;
			}

			const activePositions = positions.filter(validatePosition);
			const formattedPositions = [];
			
			for (let i = 0; i < activePositions.length; i++) {
				const position = activePositions[i];
				
				formattedPositions.push(await formatPositionData(chainId, position));
			}
			
			setLyraPositions(formattedPositions);

			if (callback) {
				callback();
			}
			
			return formattedPositions;
		},
		{ refreshInterval: FETCH_POSITIONS_INTERVAL }
	)

	useEffect(() => {
		resetPositions();
		
		if (account) {
			mutate().then(setLyraPositions);
		}
	}, [account, isConnected]);

	if (positionsDataError) {
		console.log('Fetching Lyra positions error:\n', positionsDataError);
		return null;
	}
	
	return lyraPositions;
}


const formatPositionData = async (chainId, position) => {
	const {
		id,
		strikePrice: strike,
		isCall,
		isLong: isBuy,
		size: amount,
		expiryTimestamp,
	} = convertDataToBigInt(position);
	
	const expiry = expiryTimestamp * MILISECONDS_IN_SECOND;

	const {
		asset,
		premium,
		pnl,
		greeks,
		collateral,
	} = await waitPositionAdditionalData(chainId, position);

	const formattedPosition = {
		id,
		market: "Lyra",
		asset,
		amount,
		strike,
		isCall,
		isBuy,
		premium,
		collateral,
		pnl,
		expiry,
		greeks,
		utils: {
			calcPnl: async (amount = position.size) => {
				return (
					position.trade(
						!position.isLong,
						BigNumber.from(amount),
						LYRA_TRADE_SLIPPAGE
					).then(trade => {
						const pnlInUSDC = BigInt(trade.pnl());
						
						const pnlInPercentage = calcPnlPercentage(
							pnlInUSDC - premium,
							premium
						);

						return {
							inUSDC: pnlInUSDC,
							inPercentage: pnlInPercentage,
						}
					})
				)
			}
		},
		actions: {
			close: async (closeAmount) => {
				const closeAmountBigNum = BigNumber.from(closeAmount);
				const options = { referrer: SF_WALLET };

				return (
					position.close(closeAmountBigNum, LYRA_TRADE_SLIPPAGE, options)
						.then(trade => {
							if (trade.isDisabled) {
								popErrorToast(new Error(trade.disabledReason));
								return;
							}

							const signer = getSigner();
							return signer.sendTransaction(trade.tx);
					})
				)
			},
			addToCollateral: async (addedAmount) => {
				const newCollateral = collateral.inMarketToken + addedAmount;

				return (
					position.trade(
						isBuy,
						BigNumber.from(0),
						LYRA_TRADE_SLIPPAGE,
						{
							position,
							setToCollateral: BigNumber.from(newCollateral),
						}
					).then(trade => {
						if (trade.isDisabled) {
							popErrorToast(new Error(trade.disabledReason));
						}
						
						const signer = getSigner();
						return signer.sendTransaction(trade.tx);
					})
				)
			},
			isAddingToCollateralDisabled: !collateral?.liquidationPrice,
		},
	}

	return formattedPosition;
}

const waitPositionAdditionalData = async (chainId, position) => {
	const getAsset = () => {
		const asset = position.marketName.split("-USDC")[0];

		return asset;
	}

	const getPremium = () => {
		const trades = position.trades();
		const premium = trades.reduce((premium, trade) => {
			trade = convertDataToBigInt(trade);

			return trade.isBuy
				? premium - trade.premium
				: premium + trade.premium;
		}, 0n);

		return premium;
	}

	const getPnl = () => {
		const { unrealizedPnl, unrealizedPnlPercentage } = convertDataToBigInt(position.pnl());
		const pnl = {
			inUSDC: unrealizedPnl,
			inPercentage: unrealizedPnlPercentage * 100n,
		}
		
		return pnl;
	}

	const getGreeks = () => {
		const { delta, theta, rho } = position.liveOption();
		const { vega, gamma } = position.liveStrike();

		const greeks = { delta, vega, gamma, theta, rho };
		for (const greek in greeks) {
			const value = greeks[greek];
			greeks[greek] = numberFromBigInt(value.toBigInt(), DEFAULT_DECIMALS, 3);
		}

		return greeks;
	}
	
	const waitCollateral = async () => {
		const collateral = position.collateral
			&& convertDataToBigInt(position.collateral);

		if (!collateral) {
			return;
		}

		return waitFormatCollateralFromLyra(chainId, collateral, getAsset());
	}

	return {
		asset: getAsset(),
		premium: getPremium(),
		pnl: getPnl(),
		greeks: getGreeks(),
		collateral: await waitCollateral(),
	}
}

const validatePosition = (position) => {
	const {
		size,
		expiryTimestamp
	} = convertDataToBigInt(position);

	const isSizeEmpty = size === 0n;
	const isExpired = expiryTimestamp * MILISECONDS_IN_SECOND < Date.now();

	if (isSizeEmpty || isExpired) {
		return false;
	}

	return true;
}


export default useLyraPositions;