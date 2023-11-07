import { MILISECONDS_IN_SECOND } from "../../../../../../../../environment/constants/dateConstants";



const getLyraDates = (lyraMarket) => {
	if (!lyraMarket) {
		return;
	}
	
	const lyraDateList = lyraMarket.liveBoards().map(board => {
		return board.expiryTimestamp * MILISECONDS_IN_SECOND;
	});

	return lyraDateList;
}


export default getLyraDates;