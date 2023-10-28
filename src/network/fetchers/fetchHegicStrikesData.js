import { getContractAbi, getHegicPriceCalculatorContract, getHegicStrategiesAddressesForPeriod } from "../contracts/contractsData";
import { waitTokenPriceFromChainlink } from '../networkUtils';
import { bigIntFromNumber, bringToDefaultDecimals, floorBigInt, numberFromBigInt } from '../../utils/dataTypesUtils/bigIntUtils';
import { getAlchemyProvider } from "../providers";
import { BigNumber, ethers } from "ethers";
import { getSecondsFromMs } from "../../utils/dateUtils";
import { DEFAULT_DECIMALS, TOKENS_DECIMALS, USDC_DECIMALS } from "../../environment/constants/tokensConstants";
import { swapToUSDC } from "../helpers/Swapper";
import { getTokenBySymbol } from "../tokens";
import { getEncodingContract } from "../../pages/Terminal/Builder/builderUtils";
import { getTokenAmountFromDefaultDecimals } from "../../utils/tokenUtils";
import { calcHegicDeltaByStrikeScale } from "../../utils/optionsUtils";


const PREFIX = "Hegic_";
const TOKEN_SYMBOL = "USDC.e";


const waitFormattedTokenPriceFromChainlink = async (chainId, tokenSymb) => {
	const tokenPriceFromChainlink = await waitTokenPriceFromChainlink(chainId, tokenSymb);
	const numberishTokenPriceFromChainlink = numberFromBigInt(tokenPriceFromChainlink);

	return numberishTokenPriceFromChainlink;
}

const getIsStrategyRelevant = (strategyKey, relevantAsset, shouldBeCall) => {
	const [strategyType, , strategyAsset] = strategyKey.split("_");
	const isSpread = strategyType.includes("SPREAD");
	if (isSpread) {
		return false;
	}

	const isStrategyCall = strategyType === "CALL";
	if (shouldBeCall !== isStrategyCall || strategyAsset !== relevantAsset) {
		return false;
	}

	return true;
}

const waitStrategyHasLiquidity = async (chainId, strategyAddress, strikeParams) => {
	const {
		asset,
		amount,
		period,
	} = strikeParams;
	
	let hasLiquidity;
	const strategyContract = new ethers.Contract(
		strategyAddress,
		getContractAbi(chainId, "Hegic_Strategy"),
		getAlchemyProvider(chainId)
	);
	const periodS = getSecondsFromMs(period);

	try {
		const liquidity = (await strategyContract.getAvailableContracts(periodS, [])).toBigInt(); 
		const liquidityDecimals = TOKENS_DECIMALS[asset];
		const amountBigInt = bigIntFromNumber(amount, liquidityDecimals);
		
		hasLiquidity = liquidity >= amountBigInt;
	} catch(e) {}
	
	return hasLiquidity;
}

const waitCalcPremium = async (chainId, strategyKey, strikeParams, amountBigIntDefaultDecimals) => {
	const {
		asset,
		period
	} = strikeParams;

	const amountBigInt = getTokenAmountFromDefaultDecimals(
		amountBigIntDefaultDecimals,
		asset
	);

	const priceContract = getHegicPriceCalculatorContract(chainId, strategyKey);
	const periodS = getSecondsFromMs(period);

	return (
		priceContract.calculatePremium(periodS, amountBigInt, 0)
			.then(premiumInUsdcDecimals => {
				const premium = bringToDefaultDecimals(
					premiumInUsdcDecimals.toBigInt(),
					USDC_DECIMALS
				);

				const TOKEN = getTokenBySymbol(chainId, TOKEN_SYMBOL);

				return (
					swapToUSDC(chainId, TOKEN.address, premium)
						.then(premiumInUSDC => {
							const premiumData = {
								inUSDC: premiumInUSDC,
								inMarketToken: premium,
								marketToken: TOKEN,
							};
							
							return premiumData;
						})
				)
			})
	)
}

const calcStrike = (strikeScale, tokenPriceFromChainlink) => {
	return Math.floor(tokenPriceFromChainlink * (strikeScale / 100));
}

const getStrikeData = (
	chainId,
	strategyData,
	strikeParams,
	tokenPriceFromChainlink
) => {
	const {
		protocolName,
		isCall
	} = strikeParams;
	
	const { strategyKey } = strategyData;
	const [, strikeScale, ] = strategyKey.split("_");
	const strike = calcStrike(strikeScale, tokenPriceFromChainlink);
	const strikeUtils = getStrikeUtils(chainId, strategyData, strikeParams);

	
	const delta = calcHegicDeltaByStrikeScale(isCall, strikeScale);
	
	return {
		market: "Hegic",
		protocolName,
		strike,
		isCall,
		isBuy: true,
		greeks: {
			delta,
			vega: 0,
			gamma: 0,
			theta: 0,
			rho: 0,
		},
		utils: strikeUtils
	}
}

const getPremiumPromise = (amount, strikeData) => {
	const tokenAmount = bigIntFromNumber(amount, DEFAULT_DECIMALS);
	const premiumPromise = strikeData.utils.calcPremium(tokenAmount);

	return premiumPromise;
}

const getStrikeUtils = (chainId, strategyData, strikeParams) => {
	const { strategyKey, strategyAddress } = strategyData;
	const {
		asset,
		protocolName,
		period
	} = strikeParams;

	const calcPremium = async (amountBigInt) => {
		return waitCalcPremium(chainId, strategyKey, strikeParams, amountBigInt);
	}

	const getBuilderParams = async (amountBigInt, options, paymentTokenDecimals) => {
		amountBigInt = getTokenAmountFromDefaultDecimals(amountBigInt, asset);
		const amountBigNum = BigNumber.from(amountBigInt);
		
		const maxTotalCost = options.premiumInMarketToken;
		const flooredMaxTotalCost = floorBigInt(maxTotalCost, paymentTokenDecimals);
		const flooredMaxTotalCostBigNum = BigNumber.from(flooredMaxTotalCost);

		const ParamsEncoder = getEncodingContract(chainId, protocolName);

		return ParamsEncoder.encodeFromHegic(
			strategyAddress,
			amountBigNum,
			getSecondsFromMs(period),
			flooredMaxTotalCostBigNum,
			[]
		);
	}

	return {
		calcPremium,
		getBuilderParams,
	}
}

const waitStrikesAndPremiumPromisesData = async (
	chainId,
	strategiesAddresses,
	strikeParams
) => {
	const {
		asset,
		amount,
		isCall,
	} = strikeParams;

	const strikesData = {};
	const premiumPromisesData = {};

	const tokenPriceFromChainlink = await waitFormattedTokenPriceFromChainlink(chainId, asset);

	const strategiesKeys = Object.keys(strategiesAddresses);
	for (let i = 0; i < strategiesKeys.length; i++) {
		const strategyKey = strategiesKeys[i];
		const strategyAddress = strategiesAddresses[strategyKey];
		const strategyData = { strategyKey, strategyAddress };
		
		if (!getIsStrategyRelevant(strategyKey, asset, isCall)) {
			continue;
		}
		if (!(await waitStrategyHasLiquidity(chainId, strategyAddress, strikeParams))) {
			continue;
		}

		const strikeData = getStrikeData(chainId, strategyData, strikeParams, tokenPriceFromChainlink);
		const premiumPromise = getPremiumPromise(amount, strikeData);

		const { strike } = strikeData;
		premiumPromisesData[strike] = premiumPromise;
		strikesData[`${PREFIX}${strike}`] = { ...strikeData };
	}
	
	return {
		strikesData,
		premiumPromisesData,
	};
}

const waitConcatStrikesAndPremiumsData = async (
	strikesData,
	premiumPromisesData
) => {
	const strikes = Object.keys(premiumPromisesData);
	const premiumPromises = Object.values(premiumPromisesData);

	await Promise.all(premiumPromises)
		.then(premiumsDraft => {
			premiumsDraft.forEach((premiumData, i) => {
				if (premiumData) {
					const strike = strikes[i];
					strikesData[`${PREFIX}${strike}`].premiumData = premiumData;
				}
			})
		});
}

const filterSufficientStrikesData = (strikesData) => {
	const sufficientStrikesData = {};

	for (const key in strikesData) {
		const data = strikesData[key];

		if (data.premiumData) {
			sufficientStrikesData[key] = data;
		}
	}

	return sufficientStrikesData;
}

const waitStrikesData = async (chainId, strategiesAddresses, strikeParams) => {
	const {
		strikesData,
		premiumPromisesData,
	} = await waitStrikesAndPremiumPromisesData(chainId, strategiesAddresses, strikeParams);

	await waitConcatStrikesAndPremiumsData(strikesData, premiumPromisesData);

	return strikesData;
}

export const fetchHegicStrikesData = async (chainId, strikeParams) => {
	const { expiry } = strikeParams;
	const period = expiry - Date.now();

	strikeParams.protocolName = "Hegic";
	strikeParams.period = period;

	const strategiesAddresses = getHegicStrategiesAddressesForPeriod(
		chainId, period
	);
	if (!strategiesAddresses) {
		return {};
	}
	
	const strikesData = filterSufficientStrikesData(
		await waitStrikesData(chainId, strategiesAddresses, strikeParams)
	);

	// todo: remove
	/* console.log({
		Rysk_1700: {
			greeks: { delta: 1, vega: 0, gamma: 0, theta: 0, rho: 0},
			isBuy: true,
			isCall: true,
			market: "Rysk",
			protocolName: "Rysk",
			premiumData: {
				inMarketToken: 66467073000000000000n,
				inUSDC: 66467073000000000000n,
				marketToken: getTokenBySymbol(chainId, "USDC"),
			},
			strike: 1700,
			utils: {
				calcPremium: async (amountBigInt) => {},
				getBuilderParams: undefined,
				getCollateralData: async (amountBigInt, options) => {}
			}
		}
	}); */

	return strikesData;
}