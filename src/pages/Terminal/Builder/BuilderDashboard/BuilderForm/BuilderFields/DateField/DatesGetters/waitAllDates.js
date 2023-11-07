import getDefaultDates from './getDefaultDates';
import getLyraDates from './getLyraDates';
import waitRyskDates from './waitRyskDates';


const waitAllDates = async (chainId, lyraMarket) => {
	let allDates;
	
	try {
		allDates = [
			...getDefaultDates(),
			...getLyraDates(lyraMarket),
			...(await waitRyskDates(chainId)),
		]
	} catch (e) {}

	return allDates;
}


export default waitAllDates;