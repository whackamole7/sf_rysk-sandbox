import useTokenPrices from "./useTokenPrices";


const useTokenPriceBySymbol = (tokenSymbol) => {
	const tokenPrices = useTokenPrices();
	
	if (!tokenPrices) {
		return 0n;
	}
	
	const tokenPrice = tokenPrices[tokenSymbol];
	
	return tokenPrice;
}

export default useTokenPriceBySymbol;