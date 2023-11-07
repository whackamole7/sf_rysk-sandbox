import { BigNumber } from "ethers";
import { DEFAULT_DECIMALS } from "../../environment/constants/tokensConstants";
import { SF_WALLET } from "../../environment/constants/commonConstants";
import { LYRA_PREMIUM_SLIPPAGE, LYRA_TRADE_SLIPPAGE } from "../../environment/constants/optionsConstants";
import { bigIntFromNumber, floorBigInt, numberFromBigInt } from "../../utils/dataTypesUtils/bigIntUtils";
import { getBigIntWithSlippage, waitFormatCollateralFromLyra } from "../../utils/optionsUtils";
import { getSecondsFromMs } from "../../utils/dateUtils";
import { parseUnits } from "ethers/lib/utils";
import { getTokenBySymbol } from "../tokens";
import { swapToUSDC } from './../helpers/Swapper';
import { getEncodingContract } from "../../pages/Terminal/Builder/builderUtils";
import { getTokenAmountFromDefaultDecimals } from './../../utils/tokenUtils';


const PREFIX = "Lyra_";
const MARKET_TOKEN_SYMBOL = "USDC.e";

const ACCEPTABLE_DISABLED_REASONS = [
	"NotEnoughCollateral",
	"TooMuchCollateral",
	"EmptyCollateral",
	"InsufficientQuoteBalance",
	"InsufficientQuoteAllowance",
	"InsufficientBaseBalance",
	"InsufficientBaseAllowance",
	"IncorrectOwner",
]

const isDisabledReasonAcceptable = (disabledReason) => {
	const isReasonAcceptable = ACCEPTABLE_DISABLED_REASONS.find(reason => {
		return reason === disabledReason;
	});
	
	if (!disabledReason || isReasonAcceptable) {
		return true;
	}
}


const getBoard = (lyraMarket, expiry) => {
	const boardId = lyraMarket.liveBoards().find((bd) => {
		return bd.expiryTimestamp === getSecondsFromMs(expiry);
	})?.id;

	if (!boardId) {
		return;
	}

	const board = lyraMarket.liveBoardsMap[boardId];
	return board;
}

const validatePremium = (premium, trade) => {
	if (!premium || !isDisabledReasonAcceptable(trade.disabledReason)) {
		return false;
	}
	
	return true;
}

const getSoftMaxCollateral = (trade, collateral, isPosition) => {
	const toBigNumber = (number, decimals = 18) => {
		return parseUnits(number.toFixed(decimals).toString(), decimals);
	}
	
	const UNIT = BigNumber.from(10).pow(18);
	const CASH_SECURED_CALL_MAX_COLLATERAL_BUFFER = 2.5;
	const strikePrice = isPosition ? trade.strikePrice : trade.strike().strikePrice;
  const cashSecuredMax = (trade.newSize ?? trade.size)
    .mul(strikePrice)
    .div(UNIT)
    .mul(toBigNumber(CASH_SECURED_CALL_MAX_COLLATERAL_BUFFER))
    .div(UNIT)

  const max = collateral.max
    ? collateral.max
    : // For cash-secured calls, set max to 1.25 * size * strike
    cashSecuredMax.gt(collateral.min)
    ? cashSecuredMax
    : collateral.min

  return max;
}

const getStrikeUtils = (
	chainId,
	lyraMarket,
	strikeId,
	strikeParams,
	account
) => {
	const {
		asset,
		protocolName,
		isCall,
		isBuy
	} = strikeParams;

	const MARKET_TOKEN = getTokenBySymbol(chainId, MARKET_TOKEN_SYMBOL);
	
	const getTrade = (amountBigInt, options) => {
		const amountBigNum = BigNumber.from(amountBigInt);
		
		return lyraMarket.trade(
			account,
			strikeId,
			isCall,
			isBuy,
			amountBigNum,
			LYRA_TRADE_SLIPPAGE,
			options
		)
	}

	const calcPremiumWithGreeks = async (amountBigIntDefaultDecimals, shouldOmitGreeks) => {
		const amountBigInt = getTokenAmountFromDefaultDecimals(
			amountBigIntDefaultDecimals,
			asset,
		);

		return getTrade(amountBigInt).then(trade => {
			const totalCostParam = isBuy ? "maxTotalCost" : "minTotalCost";
			const premium = trade.params[0][totalCostParam].toBigInt();
			const premiumWithSlippage = getBigIntWithSlippage(premium, LYRA_PREMIUM_SLIPPAGE);

			
			if (!validatePremium(premiumWithSlippage, trade)) {
				return null;
			}

			return (
				swapToUSDC(chainId, MARKET_TOKEN.address, premiumWithSlippage)
					.then(premiumInUSDC => {
						const premiumData = {
							inUSDC: premiumInUSDC,
							inMarketToken: premiumWithSlippage,
							marketToken: MARKET_TOKEN,
						};
						
						return shouldOmitGreeks
							? premiumData
							: {
									premiumData,
									greeks: trade.greeks,
								};
					})
			)
		});
	}

	const calcPremium = async (amountBigIntDefaultDecimals) => {
		return calcPremiumWithGreeks(amountBigIntDefaultDecimals, true);
	}

	const getCollateralData = async (amountBigInt, options) => {
		const amountBigNum = BigNumber.from(amountBigInt);

		return getTrade(amountBigNum, options)
			.then(trade => {
				const { collateral } = trade;
				
				if (collateral && !collateral.max) {
					trade.collateral.max = getSoftMaxCollateral(trade, collateral);
				}

				const asset = trade.marketName.split("-")[0];
				
				return waitFormatCollateralFromLyra(chainId, collateral, asset);
			})
	}

	const getBuilderParams = async (amountBigInt, options, paymentTokenDecimals) => {
		const ParamsEncoder = getEncodingContract(chainId, protocolName);
		const amountBigNum = BigNumber.from(amountBigInt);
		const maxTotalCost = options.premiumInMarketToken;
		const flooredMaxTotalCost = floorBigInt(maxTotalCost, paymentTokenDecimals);
		const flooredMaxTotalCostBigNum = BigNumber.from(flooredMaxTotalCost);
		
		return getTrade(amountBigNum, options).then(trade => {
			const params = trade.params[0];
			
			return ParamsEncoder.encodeFromLyra([
				params.strikeId,
				params.positionId,
				params.iterations,
				params.optionType,
				params.amount,
				params.setCollateralTo,
				params.minTotalCost,
				flooredMaxTotalCostBigNum,
				SF_WALLET, // referrer
			]);
		})
	}

	return {
		calcPremium,
		calcPremiumWithGreeks,
		getCollateralData,
		getBuilderParams,
	}
}

const getStrikeData = (
	chainId,
	lyraMarket,
	lyraStrike,
	strikeParams,
	account
) => {
	const {
		protocolName,
		isCall,
		isBuy
	} = strikeParams;
	
	const { strikeId: strikeIdBigNum, strikePrice: strikePriceBigNum } = lyraStrike;
	const strikeId = strikeIdBigNum.toNumber();
	const strikePrice = numberFromBigInt(strikePriceBigNum.toBigInt());

	const strikeUtils = getStrikeUtils(chainId, lyraMarket, strikeId, strikeParams, account);

	return {
		market: "Lyra",
		protocolName,
		strike: strikePrice,
		isCall,
		isBuy,
		utils: strikeUtils,
	}
}

const getPremiumWithGreeksPromise = (amount, strikeData) => {
	const tokenAmount = bigIntFromNumber(amount, DEFAULT_DECIMALS);
	const premiumWithGreeksPromise = strikeData.utils.calcPremiumWithGreeks(tokenAmount);

	return premiumWithGreeksPromise;
}

const getStrikesAndPremiumsWithGreeksPromises = (
	chainId,
	lyraMarket,
	strikeParams,
	board,
	account
) => {
	const {
		amount,
	} = strikeParams;

	const strikesData = {};
	const premiumsWithGreeksPromises = {};

	board.strikes.forEach(lyraStrike => {
		const strikeData = getStrikeData(
			chainId,
			lyraMarket,
			lyraStrike,
			strikeParams,
			account
		);
		
		const premiumWithGreeksPromise = getPremiumWithGreeksPromise(amount, strikeData);

		const { strike } = strikeData;
		premiumsWithGreeksPromises[strike] = premiumWithGreeksPromise;
		strikesData[`${PREFIX}${strike}`] = strikeData;
	});

	return {
		strikesData,
		premiumsWithGreeksPromises,
	}
}

const waitConcatStrikesAndPremiumsData = async (
	strikesData,
	premiumsWithGreeksPromises
) => {
	const strikes = Object.keys(premiumsWithGreeksPromises);
	const premiumWithGreeksPromises = Object.values(premiumsWithGreeksPromises);

	await Promise.all(premiumWithGreeksPromises)
		.then(premiumsWithGreeksDraft => {
			premiumsWithGreeksDraft.forEach((premiumWithGreeks, i) => {
				if (premiumWithGreeks) {
					const { premiumData, greeks } = premiumWithGreeks;
					for (const key in greeks) {
						const greek = greeks[key];
						greeks[key] = numberFromBigInt(greek.toBigInt(), DEFAULT_DECIMALS, 3);
					}
	
					const strike = strikes[i];
					strikesData[`${PREFIX}${strike}`].premiumData = premiumData;
					strikesData[`${PREFIX}${strike}`].greeks = greeks;
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


const fetchLyraStrikesData = async (
	chainId,
	lyraMarket,
	strikeParams,
	account
) => {

	if (!lyraMarket) {
		return {};
	}
	
	const {
		asset,
		expiry,
	} = strikeParams;

	strikeParams.protocolName = `Lyra_${asset}`;
	
	const board = getBoard(lyraMarket, expiry);

	if (!board) {
		return;
	}
	
	const {
		strikesData: strikesDataDraft,
		premiumsWithGreeksPromises,
	} = getStrikesAndPremiumsWithGreeksPromises(
		chainId,
		lyraMarket,
		strikeParams,
		board,
		account
	);

	await waitConcatStrikesAndPremiumsData(strikesDataDraft, premiumsWithGreeksPromises);
	const strikesData = filterSufficientStrikesData(strikesDataDraft);
	
	return strikesData;
}


export default fetchLyraStrikesData;