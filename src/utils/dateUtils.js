import { lastDayOfMonth } from 'date-fns';
import { HOURS_IN_DAY, MILISECONDS_IN_SECOND, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from './../environment/constants/dateConstants';


export const getMsInDays = (days) => {
	return days * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILISECONDS_IN_SECOND;
}

export const getDaysFromMs = (ms) => {
	return Math.floor(
		ms / MILISECONDS_IN_SECOND / SECONDS_IN_MINUTE / MINUTES_IN_HOUR / HOURS_IN_DAY
	);
}

export const getSecondsFromMs = (ms) => {
	return Math.floor(
		ms / MILISECONDS_IN_SECOND
	)
}

export const getTimeLeftString = (msLeft) => {
	const hours = msLeft / MILISECONDS_IN_SECOND / SECONDS_IN_MINUTE / MINUTES_IN_HOUR;
	const wholeHours = Math.floor(hours % HOURS_IN_DAY);
	const wholeDays = Math.floor(hours / HOURS_IN_DAY);
	const wholeMinutes = Math.floor(hours * MINUTES_IN_HOUR);

	if (wholeHours === 0 && wholeDays === 0) {
		return `${wholeMinutes}m`;
	}
	return `${wholeDays}d:${wholeHours}h`;
}

export function getMonthFromString(monthStr) {
	const dateStr = monthStr + "1, 2012";
	const ms = Date.parse(dateStr);
	if (isNaN(ms)) {
		throw new Error(`Couldn't parse date string: ${dateStr}`)
	}

	return new Date(ms).getMonth();
}

export function getLastDateOfMonth(month, year) {
	if (typeof month === "string") {
		month = getMonthFromString(month);
	}
	const tempDate = new Date();
	tempDate.setFullYear(year);
	tempDate.setMonth(month);
	return lastDayOfMonth(tempDate).getDate();
}