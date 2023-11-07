import { BigNumber, ethers } from "ethers";
import { getContractData } from "../contracts/contractsData";
import { getAlchemyProvider } from "../providers";
import { bigIntFromNumber, bringToDefaultDecimals, convertDataToBigInt, numberFromBigInt } from "../../utils/dataTypesUtils/bigIntUtils";
import { MILISECONDS_IN_SECOND } from "../../environment/constants/dateConstants";
import { getTokenBySymbol } from "../tokens";
import { ADDRESS_ZERO } from "@uniswap/v3-sdk";
import { compareNumeric } from "../../utils/dataTypesUtils/arrayUtils";
import { swapToUSDC } from "../helpers/Swapper";
import { formatBigInt } from './../../utils/dataTypesUtils/bigIntUtils';



const PREFIX = "Rysk_";
const MARKET_TOKEN_SYMBOL = "USDC";


const validateStrikeParams = (strikeParams) => {
	const {
		asset,
	} = strikeParams;
	
	if (asset !== "ETH") {
		return;
	}

	return true;
}

const waitAmountBoundaries = async (chainId) => {
	const OptionExchange = new ethers.Contract(
		...getContractData(chainId, "Rysk_OptionExchange"),
		getAlchemyProvider(chainId)
	);

	const minAmountPromise = OptionExchange.minTradeSize();
	const maxAmountPromise = OptionExchange.maxTradeSize();

	return Promise.all([
		minAmountPromise,
		maxAmountPromise
	])
		.then(amounts => {
			const boundaries = {};

			amounts = amounts
				.map(amount => numberFromBigInt(BigInt(amount)))
				.sort(compareNumeric);

			boundaries.minAmount = amounts[0];
			boundaries.maxAmount = amounts[1];

			return boundaries;
		})
}

const validateAmount = async (chainId, amount) => {
	return waitAmountBoundaries(chainId)
		.then(({ minAmount, maxAmount }) => {
			if (amount >= minAmount && amount <= maxAmount) {
				return true;
			}
		})
}

const validateOptionSeries = async (chainId, strikeParams, optionSeries) => {
	const {
		isBuy,
	} = strikeParams;
	
	const OptionExchange = new ethers.Contract(
		...getContractData(chainId, "Rysk_OptionExchange"),
		getAlchemyProvider(chainId)
	);

	console.log(optionSeries);

	return OptionExchange.checkHash(
		optionSeries,
		optionSeries.strike,
		!isBuy,
	).then((oHash) => {
		console.log(oHash);
		return Boolean(oHash);
	}).catch((e) => {
		console.log('Strike:', formatBigInt(optionSeries.strike));
		console.log(e);
		return null;
	});
}

const validateStrike = async (chainId, strikeParams, amount, optionSeries) => {
	return Promise.all([
		validateAmount(chainId, amount),
		validateOptionSeries(chainId, strikeParams, optionSeries),
	]).then((([isAmountValidated, isTradeable]) => {
			return Boolean(isAmountValidated && isTradeable);
		}));
}

const waitDhvExposure = async (chainId, optionSeries) => {
	const AlphaPortfolioValuesFeed = new ethers.Contract(
		...getContractData(chainId, "Rysk_AlphaPortfolioValuesFeed"),
		getAlchemyProvider(chainId)
	);

	return AlphaPortfolioValuesFeed.netDhvExposure(
		ethers.utils.solidityKeccak256(
			["uint64", "uint128", "bool"],
			[optionSeries.expiration, optionSeries.strike, optionSeries.isPut]
		)
	).then(res => BigInt(res));
}

const getStrikeUtils = (chainId, strikeParams, strike) => {
	const {
		expiry,
		isCall,
		isBuy
	} = strikeParams;
	
	const BeyondPricer = new ethers.Contract(
		...getContractData(chainId, "Rysk_BeyondPricer"),
		getAlchemyProvider(chainId)
	);

	const USDC_address = getTokenBySymbol(chainId, "USDC").address;
	const WETH_address = getTokenBySymbol(chainId, "WETH").address;
	
	const calcPremium = async (amountBigInt) => {
		return calcPremiumWithGreeks(amountBigInt, true);
	}
	
	const calcPremiumWithGreeks = async (amountBigInt, shouldOmitGreeks) => {
		const optionSeries = {
			expiration: expiry / MILISECONDS_IN_SECOND,
			strike: bigIntFromNumber(strike),
			isPut: !isCall,
			strikeAsset: USDC_address,
			underlying: WETH_address,
			collateral: USDC_address,
		}
		
		const dynamicAmount = numberFromBigInt(amountBigInt);
		if (!(await validateStrike(chainId, strikeParams, dynamicAmount, optionSeries))) {
			return null;
		}

		const netDhvExposure = await waitDhvExposure(chainId, optionSeries);

		return BeyondPricer.quoteOptionPrice(
			optionSeries,
			amountBigInt,
			!isBuy,
			netDhvExposure
		).then(async (ryskPremium) => {
			ryskPremium = convertDataToBigInt(ryskPremium);

			const delta = numberFromBigInt(ryskPremium.totalDelta, undefined, 3);

			const marketToken = getTokenBySymbol(chainId, MARKET_TOKEN_SYMBOL);
			const premiumInMarketToken = bringToDefaultDecimals(
				ryskPremium.totalPremium,
				marketToken.decimals
			);

			return swapToUSDC(chainId, marketToken.address, premiumInMarketToken)
				.then(premiumInUSDC => {
					const premiumData = {
						marketToken,
						inMarketToken: premiumInMarketToken,
						inUSDC: premiumInUSDC,
					}

					return shouldOmitGreeks
						? premiumData
						:	{
								premiumData,
								greeks: {
									delta,
									vega: 0,
									gamma: 0,
									theta: 0,
									rho: 0,
								},
							};
				})
		})
	}
	

	return {
		calcPremium,
		calcPremiumWithGreeks,
	}
}

const waitStrikes = async (chainId, strikeParams) => {
	const {
		expiry,
		isCall
	} = strikeParams;
	
	const OptionCatalogue = new ethers.Contract(
		...getContractData(chainId, "Rysk_OptionCatalogue"),
		getAlchemyProvider(chainId)
	);

	return OptionCatalogue.getOptionDetails(
		expiry / MILISECONDS_IN_SECOND,
		!isCall
	).then(strikes => {
		return strikes.map(strikeBigNum => {
			const strike = BigInt(strikeBigNum);
			return numberFromBigInt(strike);
		})
	})
}

const waitStrikeData = async (chainId, strikeParams, strike) => {
	const {
		amount,
		isCall,
		isBuy,
	} = strikeParams;

	const amountBigInt = bigIntFromNumber(amount);
	const strikeUtils = getStrikeUtils(chainId, strikeParams, strike);

	const premiumPromise = strikeUtils.calcPremiumWithGreeks(amountBigInt);

	return premiumPromise.then(async (premiumWithGreeks) => {
		if (!premiumWithGreeks) {
			return null;
		}

		const {
			premiumData,
			greeks
		} = premiumWithGreeks;
		
		return {
			market: "Rysk",
			// protocolName,
			strike,
			isCall,
			isBuy,
			premiumData,
			greeks,
			utils: strikeUtils,
			isComingSoon: true,
			marketLink: "https://app.rysk.finance/",
		}
	})
}

const fetchRyskStrikesData = async (chainId, strikeParams) => {
	if (!validateStrikeParams(strikeParams)) {
		return {};
	}

	const strikesData = {};
	
	const strikes = await waitStrikes(chainId, strikeParams);

	const strikesDataPromises = [];

	strikes.forEach(strike => {
		strikesDataPromises.push(
			waitStrikeData(chainId, strikeParams, strike)
				.then(strikeData => {
					if (strikeData) {
						strikesData[`${PREFIX}${strike}`] = strikeData;
					}
				})
		)
	});

	await Promise.all(strikesDataPromises);

	return strikesData;
}


export default fetchRyskStrikesData;