import useTokenPricesConfig from './../../environment/contextHooks/useTokenPrices/useTokenPricesConfig';
import { TokenPricesContext } from '../../environment/contextHooks/useTokenPrices/useTokenPrices';


const TokenPricesConfig = ({ children }) => {
	const tokenPrices = useTokenPricesConfig();
	
	return (
		<TokenPricesContext.Provider value={tokenPrices}>
			{children}
		</TokenPricesContext.Provider>
	);
};

export default TokenPricesConfig;