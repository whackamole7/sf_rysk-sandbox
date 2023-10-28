
import { numberFromBigInt } from './dataTypesUtils/bigIntUtils';
import { padDecimals, roundNumber, separateThousands } from './dataTypesUtils/numberUtils';



export const formatBigIntToDollarStr = (bigInt, displayDecimalsNum, reduceDecimalsNum) => {
	const num = numberFromBigInt(bigInt, reduceDecimalsNum);

	const dollarStr = formatNumberToDollarStr(num, displayDecimalsNum);

	return dollarStr;
}

export const formatNumberToDollarStr = (num, decimals = 2) => {
	const sign = num < 0
		? "–"
		: (num > 0 ? "+" : "");

	num = Math.abs(num);
	num = roundNumber(num, decimals);
	num = padDecimals(num, decimals);

	const dollarStr = `${sign}$${separateThousands(num)}`;

	return dollarStr;
}