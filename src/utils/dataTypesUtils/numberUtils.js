import { isUndefined } from "swr/_internal";
import { INPUT_MAX_DECIMALS } from "../../environment/constants/tokensConstants";
import { checkAmountType, checkStringType } from "./../errorHandling";


export const separateThousands = (amount, symb = ",") => {
	checkAmountType(amount);

	const parts = amount.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, symb);
	return parts.join(".");
}

const getSufficientDecimalsNum = (amount) => {
	checkAmountType(amount);
	
	const str = amount.toString();
	const dotIndex = str.indexOf('.');

	if (dotIndex !== -1) {
		const firstNonZeroEntry = str.match(/[1-9]/)[0];
		
		const firstDecimalIndex = str.indexOf(
			firstNonZeroEntry,
			dotIndex
		);

		return firstDecimalIndex - dotIndex;
	}

	return 0;
}

export const limitDecimals = (amount, maxDecimals, shouldUseSufficientDecimals) => {
	let amountStr = amount.toString();
	
	if (isUndefined(maxDecimals)) {
		return amountStr;
	}
	if (maxDecimals === 0) {
		return amountStr.split(".")[0];
	}
	const dotIndex = amountStr.indexOf(".");
	const hasDot = dotIndex !== -1;

	if (hasDot) {
		let decimals = amountStr.length - dotIndex - 1;
		if (decimals > maxDecimals) {
			const tempAmountStr = amountStr.substr(0, amountStr.length - (decimals - maxDecimals));

			if (shouldUseSufficientDecimals) {
				if (Number(tempAmountStr) === 0) {
					const sufficientDecimals = getSufficientDecimalsNum(amountStr);
					amountStr = amountStr.substr(0, amountStr.length - (decimals - sufficientDecimals));
				} else {
					amountStr = tempAmountStr;
				}
			} else {
				amountStr = tempAmountStr;
			}
		}
	}

	return amountStr;
};

export const padDecimals = (amount, minDecimals) => {
	let amountStr = amount.toString();
	const dotIndex = amountStr.indexOf(".");
	const hasDot = dotIndex !== -1;
	const decimals = hasDot ? (amountStr.length - dotIndex - 1) : 0;
	if (decimals < minDecimals) {
		amountStr+= + hasDot ? "" : ".";
		amountStr+= "0".repeat(minDecimals - decimals);
	}
	return amountStr;
};

export const trimZeroDecimals = (amount) => {
	const amountStr = amount.toString();
	const hasDot = amountStr.indexOf(".") !== -1;
	if (hasDot) {
		return parseFloat(amountStr);
	}
	return amount;
};

export const trimZeroFractionPart = (amount) => {
	const amountStr = amount.toString();

	const [intPart, fractionPart] = amountStr.split(".");
	if (fractionPart === "0".repeat(fractionPart?.length)) {
		return intPart;
	}

	return amountStr;
}

const removeNonNumeric = (str, shouldRemoveDecimals) => {
	let numericString = str.toString().replace(/^\./g, '').replace(/[^0-9.]/g, '').replace(/^0\d/, '');
	const hasSecondDot = numericString.match(/\./g)?.length > 1;
	if (hasSecondDot) {
		const trimLastDot = (str) => {
			return str.replace(/\.$/, '');
		}
		numericString = trimLastDot(numericString);
	}

	numericString = limitDecimals(numericString, shouldRemoveDecimals ? 0 : INPUT_MAX_DECIMALS);
	return numericString;
}

export const formatNumberToInputString = (num, symb, shouldRemoveDecimals) => {
	return separateThousands(removeNonNumeric(num, shouldRemoveDecimals), symb);
}

export const deformatNumberFromInputString = (str, symb = ",") => {
	checkStringType(str);

	return Number(str.split(symb).join(''));
}


export const roundNumber = (num, decimals) => {
	const roundedNum = Math.round(num * 10**decimals) / 10**decimals;

	return roundedNum;
}