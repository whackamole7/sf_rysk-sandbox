import { createContext, useContext } from "react";


export const TokenPricesContext = createContext(null);


const useTokenPrices = () => {
	const tokenPrices = useContext(TokenPricesContext);

	return tokenPrices;
}

export default useTokenPrices;