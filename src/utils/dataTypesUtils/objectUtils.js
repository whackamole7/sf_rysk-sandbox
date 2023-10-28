import { compareNumeric } from "./arrayUtils";



export const compareObjectsByNumericValue = (prev, cur, valueName, direction) => {
	const [name, subname] = valueName.split(".");

	let a = prev[name];
	let b = cur[name];
	
	if (subname) {
		a = a && a[subname];
		b = b && b[subname];
	}
	
	return compareNumeric(a, b, direction);
}

export const getCompareObjectsByNumericValueFn = (valueName, direction) => {
	return (a, b) => {
		return compareObjectsByNumericValue(a, b, valueName, direction);
	}
}

export const sumObjectValues = (prevObject, curObject, keys) => {
	if (!prevObject || !Object.keys(prevObject).length) {
		return { ...curObject };
	}
	
	if (!curObject) {
		return;
	}
	
	const summedObject = { ...prevObject };

	if (!keys) {
		keys = Object.keys(prevObject);
	}

	for (let i = 0; i < keys.length; i++) {
		const [key, subkey] = keys[i].split(".");
		
		const prevObjectValue = subkey ? prevObject[key][subkey] : prevObject[key];
		const curObjectValue = subkey ? curObject[key][subkey] : curObject[key];
		
		const sum = prevObjectValue + curObjectValue;

		if (subkey) {
			if (!summedObject[key]) {
				summedObject[key] = {};
			}

			summedObject[key][subkey] = sum;
		} else {
			summedObject[key] = sum;		
		}
	}

	return summedObject;
}