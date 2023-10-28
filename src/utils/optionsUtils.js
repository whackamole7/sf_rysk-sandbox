import { EXPIRY_HOUR_UTC, EXPIRY_PERIODS_IN_MS } from "../environment/constants/optionsConstants";
import { swapToUSDC } from "../network/helpers/Swapper";
import { getTokenBySymbol } from "../network/tokens";
import { absBigInt, convertDataToBigInt, divBigIntsSavingDecimals, multiplyBigIntByNumber } from "./dataTypesUtils/bigIntUtils";
import { roundNumber } from "./dataTypesUtils/numberUtils";
import { sumObjectValues } from './dataTypesUtils/objectUtils';


export const checkIsOptionITM = (isCall, strike, currentPrice) => {
	if (isCall) {
		return currentPrice > strike;
	} else {
		return currentPrice < strike;
	}
}


export const checkIfStrikeCloseToCurrentPrice = (strike, currentPrice, range = 5) => {
	return Math.abs(strike - currentPrice) < range;
}


export const calcHegicDeltaByAssetPrice = (isCall, strike, assetPrice) => {
	const delta = isCall
		? strike < assetPrice
			? 1 : 0
		: strike > assetPrice
			? -1 : 0;

	return delta;
}

export const calcHegicDeltaByStrikeScale = (isCall, strikeScale) => {
	const delta = isCall
		? Number(strikeScale) < 100
			? 1: 0
		: Number(strikeScale) > 100
			? -1 : 0;

	return delta;
}



export const getExpiryDatesForOptions = () => {
	const expiryDates = EXPIRY_PERIODS_IN_MS.map((period, i) => {
		const expiryDate = new Date(Date.now() + period);

		const isFirst = i === 0;
		const isLast = i === (EXPIRY_PERIODS_IN_MS.length - 1);
		
		const isExpiryHourPassed = expiryDate.getUTCHours() >= EXPIRY_HOUR_UTC;
		const expiryUtcDate = expiryDate.getUTCDate();

		if (isFirst && isExpiryHourPassed) {
			expiryDate.setUTCDate(expiryUtcDate + 1);
		}
		if (isLast && !isExpiryHourPassed) {
			expiryDate.setUTCDate(expiryUtcDate - 1);
		}
		
		expiryDate.setUTCHours(EXPIRY_HOUR_UTC);
		expiryDate.setUTCMinutes(0);
		expiryDate.setUTCSeconds(0);
		expiryDate.setUTCMilliseconds(0);

		return expiryDate.getTime();
	})

	return expiryDates;
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