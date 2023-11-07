import { EXPIRY_HOUR_UTC, EXPIRY_PERIODS_IN_MS } from "../environment/constants/optionsConstants";
import { swapToUSDC } from "../network/helpers/Swapper";
import { getTokenBySymbol } from "../network/tokens";
import { absBigInt, convertDataToBigInt, divBigIntsSavingDecimals, multiplyBigIntByNumber, numberFromBigInt } from "./dataTypesUtils/bigIntUtils";
import { roundNumber } from "./dataTypesUtils/numberUtils";
import { sumObjectValues } from './dataTypesUtils/objectUtils';


export const checkIsOptionITM = (isCall, strike, currentPrice) => {
	if (isCall) {
		return currentPrice > strike;
	} else {
		return currentPrice < strike;
	}
}


export const calcHegicDeltaByAssetPrice = (optionData, assetPrice) => {
	const { isCall, strike, amount } = optionData;
	const amountNum = numberFromBigInt(amount);
	
	const delta = isCall
		? strike < assetPrice
			? amountNum : 0
		: strike > assetPrice
			? -amountNum : 0;

	return delta;
}

export const calcHegicDeltaByStrikeScale = (strikeParams, strikeScale) => {
	const {
		isCall,
		amount
	} = strikeParams;

	
	const delta = isCall
		? Number(strikeScale) < 100
			? amount : 0
		: Number(strikeScale) > 100
			? -amount : 0;

	return delta;
}


export const getBigIntWithSlippage = (bigInt, slippage) => {
	const bigIntWithSlippage = multiplyBigIntByNumber(bigInt, 1 + slippage);

	return bigIntWithSlippage;
}


export const calcPnlPercentage = (profit, premium) => {
	const pnlPercentage = divBigIntsSavingDecimals(
		(profit + premium),
		absBigInt(premium)
	) * 100n;
	
	return pnlPercentage;
}

export const waitFormatCollateralFromLyra = (chainId, lyraCollateral, asset) => {
	if (!lyraCollateral) {
		return null;
	}
	
	lyraCollateral = convertDataToBigInt(lyraCollateral);
	const { isBase, liquidationPrice, max, min } = lyraCollateral;

	const baseTokenSymbol = `W${asset}`;
	
	const collateralToken =	getTokenBySymbol(
		chainId,
		isBase ? baseTokenSymbol : "USDC.e"
	);

	return(
		swapToUSDC(chainId, collateralToken.address, lyraCollateral.amount ?? 0n)
			.then(collateralInUSDC => {
				const collateralData = {
					inMarketToken: lyraCollateral.amount,
					marketToken: collateralToken,
					inUSDC: collateralInUSDC,
					isBase,
					liquidationPrice,
					min,
					max
				}

				return collateralData;
			})
		)
}

export const sumGreeks = (prevGreeks, curGreeks) => {
	const greeks = sumObjectValues(prevGreeks, curGreeks);

	for (const greek in greeks) {
		const greekValue = greeks[greek];
		greeks[greek] = roundNumber(greekValue, 3);	
	}

	return greeks;
}