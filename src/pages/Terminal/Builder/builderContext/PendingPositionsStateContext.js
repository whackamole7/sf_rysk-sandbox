import { createContext } from "react";



export const getEmptyPendingPositions = () => {
	return {
		opening: [],
		closing: []
	}
}

const PendingPositionsStateContext = createContext(
	getEmptyPendingPositions()
);

export const resetPendingPositions = (pendingPositionsState) => {
	const [pendingPositions, setPendingPositions] = pendingPositionsState;

	for (const key in pendingPositions) {
		const positions = pendingPositions[key];
		if (positions.length) {
			setPendingPositions(getEmptyPendingPositions());
			break;
		}
	}
}

export const removeMarketPendingPositions = (pendingPositionsState, market) => {
	const [pendingPositions, setPendingPositions] = pendingPositionsState;

	for (const key in pendingPositions) {
		const positions = pendingPositions[key];

		if (positions.length) {
			const notMarketPositions = positions.filter(position => position.market !== market);
			pendingPositions[key] = notMarketPositions;
			setPendingPositions({ ...pendingPositions });
		}
	}
}


export default PendingPositionsStateContext;