import { getUniqueValuesFromArr } from "../../../../../../../utils/dataTypesUtils/arrayUtils";
import { decodeStrikeKey } from "../../../../builderUtils";



export const getStrikesFromStrikesData = (strikesData) => {
	return Object.keys(strikesData).map(Number);
}

const uniteStrikesFromDifferentMarkets = (strikesData) => {
	const unitedStrikesData = {};

	const strikes = Object.keys(strikesData)
		.map(decodeStrikeKey);
	const uniqueStrikes = getUniqueValuesFromArr(strikes);

	const dataArr = Object.values(strikesData);
	
	uniqueStrikes.forEach(uniqueStrike => {
		const strikeMarketsDataArr = dataArr.filter(data => {
			return data.strike === uniqueStrike;
		});

		unitedStrikesData[uniqueStrike] = strikeMarketsDataArr;
	})

	return unitedStrikesData;
}

export const getUnitedStrikesDataArr = (strikesDataArr) => {
	return (
		strikesDataArr.map(uniteStrikesFromDifferentMarkets)
	);
}


const getAllStrikes = (strikesDataArr) => {
	const allStrikesDraft = [];

	strikesDataArr.forEach(strikesData => {
		const strikes = getStrikesFromStrikesData(strikesData);

		allStrikesDraft.push(...strikes);
	})

	const allStrikes = getUniqueValuesFromArr(allStrikesDraft);

	return allStrikes;
}



export const fillStrikesDataArrWithNullStrikes = (strikesDataArr) => {
	const allStrikes = getAllStrikes(strikesDataArr);

	const filledStrikesDataArr = strikesDataArr.map(strikesData => {
		const curStrikes = getStrikesFromStrikesData(strikesData);
		const filledStrikesData = { ...strikesData };

		allStrikes.forEach(strike => {
			const isStrikeAbsent = curStrikes.indexOf(strike) === -1;
			if (isStrikeAbsent) {
				filledStrikesData[strike] = [
					{ strike, isAbsent: true }
				]
			}
		})

		return filledStrikesData;
	});

	return filledStrikesDataArr;
}