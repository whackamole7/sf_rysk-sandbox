import { isUndefined } from "swr/_internal";


export const compareNumeric = (prev, cur, direction = 1) => {
	const a = prev;
	const b = cur;
	
	if (a > b) return direction;
	if (a == b) return 0;
	if (a < b) return -direction;
}


export const getUniqueValuesFromArr = (arr) => {
	const result = arr.filter((val, index) => {
		return arr.indexOf(val) === index;
	});

	return result;
}

export const overlayArrays = (arr1, arr2) => {
	const [longestArr, shortestArr] = [arr1, arr2].sort((prev, cur) => {
		if (prev.length > cur.length) {
			return 1;
		} else {
			return -1;
		}
	});

	const overlayedArr = longestArr.map((item, i) => {
		if (isUndefined(item)) {
			return shortestArr[i];
		}

		return item;
	});

	return overlayedArr;
}


export const clearArray = (arr) => {
	arr.splice(0, arr.length);
}