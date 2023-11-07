import { EXPIRY_HOUR_UTC, EXPIRY_PERIODS_IN_MS } from "../../../../../../../../environment/constants/optionsConstants";



const getDefaultDates = () => {
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


export default getDefaultDates;