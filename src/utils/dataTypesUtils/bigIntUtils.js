import { BASE_DISPLAY_DECIMALS, DEFAULT_DECIMALS, INPUT_MAX_DECIMALS, STABLE_DISPLAY_DECIMALS } from "../../environment/constants/tokensConstants";
import { deformatNumberFromInputString, formatNumberToInputString, limitDecimals, padDecimals, separateThousands, trimZeroDecimals, trimZeroFractionPart } from "./numberUtils";
import { checkBigIntType } from "../errorHandling";
import { isUndefined } from "swr/_internal";
import { BigNumber } from "ethers";


export const numberFromBigInt = (
	bigInt,
	reduceDecimalsNum = DEFAULT_DECIMALS,
	maxDecimalsNum,
) => {
	checkBigIntType(bigInt);

	let number = Number(bigInt) / 10**reduceDecimalsNum;
	if (typeof maxDecimalsNum !== "undefined") {
		number = Math.round(number * 10**maxDecimalsNum) / 10**maxDecimalsNum;
	}

	if (String(number).includes('e')) {
		return 0;
	}
	
	return number;
}

export const expandBigIntDecimals = (bigInt, expandDecimalsNum) => {
	checkBigIntType(bigInt);

	return bigInt * BigInt(10**expandDecimalsNum);
}

export const reduceBigIntDecimals = (bigInt, reduceDecimalsNum) => {
	checkBigIntType(bigInt);

	return bigInt / BigInt(10**reduceDecimalsNum);
}

export const bigIntFromNumber = (number, expandDecimalsNum = DEFAULT_DECIMALS) => {
	if (expandDecimalsNum < INPUT_MAX_DECIMALS) {
		throw new Error(`Converting number to BigInt without expanding decimals is not safe.`);
	}
	
	const roundedNumber = Math.floor(Number(number) * 10**INPUT_MAX_DECIMALS);

	const bigInt = expandBigIntDecimals(BigInt(roundedNumber), expandDecimalsNum - INPUT_MAX_DECIMALS);

	return bigInt;
}

export const formatBigInt = (
	bigInt,
	displayDecimalsNum = STABLE_DISPLAY_DECIMALS,
	reduceDecimalsNum = DEFAULT_DECIMALS,
	shouldSaveZeroFraction = false,
) => {
	checkBigIntType(bigInt);

	let result = numberFromBigInt(bigInt, reduceDecimalsNum);
	result = limitDecimals(result, displayDecimalsNum);
	result = padDecimals(result, displayDecimalsNum);
	
	if (!shouldSaveZeroFraction) {
		result = trimZeroFractionPart(result);
	}
	
	result = separateThousands(result);

	return String(result);
}

export const formatBigIntFree = (
	bigInt,
	displayDecimalsNum = BASE_DISPLAY_DECIMALS,
	reduceDecimalsNum = DEFAULT_DECIMALS,
	shouldUseSufficientDecimals
) => {
	checkBigIntType(bigInt);

	let result = numberFromBigInt(bigInt, reduceDecimalsNum);
	result = limitDecimals(result, displayDecimalsNum, shouldUseSufficientDecimals);
	result = trimZeroDecimals(result);
	result = separateThousands(result);

	return String(result);
}

export const formatTokenAmount = (
	tokenAmountBigInt,
	isStable,
	displayDecimalsNum,
	reduceDecimalsNum
) => {
	checkBigIntType(tokenAmountBigInt);

	const formatFn = isStable ? formatBigInt : formatBigIntFree;
	if (isUndefined(displayDecimalsNum)) {
		displayDecimalsNum = isStable ? STABLE_DISPLAY_DECIMALS : BASE_DISPLAY_DECIMALS;
	}
	const shouldUseSufficientDecimals = !isStable;
	
	return formatFn(
		tokenAmountBigInt,
		displayDecimalsNum,
		reduceDecimalsNum,
		shouldUseSufficientDecimals
	);
}


export const bringToDecimals = (bigInt, initDecimals, resultDecimals) => {
	checkBigIntType(bigInt);
	
	const decimalsDifference = resultDecimals - initDecimals;
	
	const editDecimals = decimalsDifference < 0 ? reduceBigIntDecimals : expandBigIntDecimals;
	const bigIntWithResultDecimals = editDecimals(bigInt, Math.abs(decimalsDifference));
	
	return bigIntWithResultDecimals;
}

export const bringToDefaultDecimals = (bigInt, initDecimals) => {
	return bringToDecimals(bigInt, initDecimals, DEFAULT_DECIMALS);
}

export const bringFromDefaultDecimals = (bigInt, resultDecimals) => {
	return bringToDecimals(bigInt, DEFAULT_DECIMALS, resultDecimals);
}


export const multiplyBigIntByNumber = (bigInt, number) => {
	checkBigIntType(bigInt);
	
	const multipliedNumber = numberFromBigInt(bigInt) * number;
	const multipliedBigInt = bigIntFromNumber(multipliedNumber);

	return multipliedBigInt;
}

export const divBigIntsSavingDecimals = (bigInt, divider, decimals = DEFAULT_DECIMALS) => {
	bigInt = expandBigIntDecimals(bigInt, decimals);

	return bigInt / divider;
}

export const multiplyBigIntsSavingDecimals = (bigInt, multiplier, decimals = DEFAULT_DECIMALS) => {
	const result = bigInt * multiplier;
	const resultSavedDecimals = reduceBigIntDecimals(result, DEFAULT_DECIMALS);

	return resultSavedDecimals
}


export const floorBigInt = (bigInt, toDecimal, currentDecimals = DEFAULT_DECIMALS) => {
	checkBigIntType(bigInt);
	
	const floorDecimalsNum = currentDecimals - toDecimal;

	const reducedBigInt = reduceBigIntDecimals(bigInt, floorDecimalsNum);
	const flooredBigInt = expandBigIntDecimals(reducedBigInt, floorDecimalsNum);

	return flooredBigInt;
}


export const absBigInt = (bigInt) => {
	checkBigIntType(bigInt);
	
	return (bigInt < 0n) ? -bigInt : bigInt;
}

export const negativeBigInt = (bigInt) => {
	return -absBigInt(bigInt);
}



export const convertDataToBigInt = (bigNumberData) => {
	if (typeof bigNumberData !== "object") {
		throw new Error(`Invalid bigNumberData: ${bigNumberData}`);
	}
	
	const bigIntData = {};
	
	for (const key in bigNumberData) {
		let element = bigNumberData[key];

		if (BigNumber.isBigNumber(element)) {
			element = element.toBigInt();
		}
		
		bigIntData[key] = element;
	}

	return bigIntData;
}

export const bigIntFromInputString = (inputStr) => {
	const num = deformatNumberFromInputString(inputStr);
	const bigInt = bigIntFromNumber(num);
	
	return bigInt;
}


export const inputStringFromBigInt = (bigInt) => {
	const num = numberFromBigInt(bigInt);
	const inputStr = formatNumberToInputString(num);

	return inputStr;
}