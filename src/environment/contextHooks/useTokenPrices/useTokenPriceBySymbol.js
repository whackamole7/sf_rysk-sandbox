import useTokenPrices from "./useTokenPrices";


const useTokenPriceBySymbol = (symbol) => {
	const tokenPrices = useTokenPrices();

	return tokenPrices?.[symbol] ?? 0n;
}

export default useTokenPriceBySymbol;