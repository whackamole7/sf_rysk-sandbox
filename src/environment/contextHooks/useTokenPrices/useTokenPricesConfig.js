import useSWR from 'swr';
import { useChainId } from 'wagmi';
import { waitTokenPriceFromChainlink } from '../../../network/networkUtils';
import { ASSETS } from '../../constants/tokensConstants';



const useTokenPricesConfig = () => {
	const chainId = useChainId();
	
	const { data: tokenPricesData, error: tokenPricesError } = useSWR(
		"useTokenPricesConfig", {
			fetcher: async () => {
				const tokenPrices = {};
				const tokenPricesPromises = [];

				ASSETS.forEach(asset => {
					tokenPricesPromises.push(
						waitTokenPriceFromChainlink(chainId, asset)
							.then(price => {
								tokenPrices[asset] = price;
							})
					);
				})
				
				await Promise.all(tokenPricesPromises);

				return tokenPrices;
			},
			refreshInterval: 60 * 1000,
			refreshWhenHidden: true,
			revalidateOnFocus: false,
		}
	)
	
	if (tokenPricesError) {
		console.log(tokenPricesError);
		return null;
	}

	return tokenPricesData;
}

export default useTokenPricesConfig;