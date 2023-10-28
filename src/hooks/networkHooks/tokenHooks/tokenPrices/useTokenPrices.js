import useSWR from 'swr';
import { useChainId } from 'wagmi';
import { jsonFetcher } from './../../../../network/fetchers/jsonFetcher';
import { ARBITRUM, OPTIMISM } from '../../../../environment/constants/networkConstants';
import { bringToDefaultDecimals } from './../../../../utils/dataTypesUtils/bigIntUtils';
import { ASSETS, GMX_DECIMALS } from '../../../../environment/constants/tokensConstants';
import { getTokenBySymbol } from '../../../../network/tokens';


const getPriceRequestUrl = (chainId) => {
	switch(chainId) {
		case ARBITRUM: {
			return "https://gmx-server-mainnet.uw.r.appspot.com/prices";
		}
		case OPTIMISM: {
			throw new Error(`No url for Optimism`); // todo: add
		}
		default: {
			throw new Error(`Unknown chainId ${chainId}`);
		}
	}
}

const useTokenPrices = () => {
	const chainId = useChainId();
	const priceRequestUrl = getPriceRequestUrl(chainId);

	const { data: tokenPricesData, error: tokenPricesError } = useSWR(
		[priceRequestUrl], {
			fetcher: async (url) => {
				return jsonFetcher(url, (tokenPrices => {
					const tokenPricesWithSymbols = {};

					ASSETS.forEach(asset => {
						const address = getTokenBySymbol(chainId, asset).address;

						const priceStr = tokenPrices[address];
						const priceBigInt = bringToDefaultDecimals(
							BigInt(priceStr),
							GMX_DECIMALS
						);

						tokenPricesWithSymbols[asset] = priceBigInt;
					})

					return tokenPricesWithSymbols;
				}))
			},
			refreshInterval: 1000,
			shouldRetryOnError: false,
		}
	)
	
	if (tokenPricesError) {
		console.log(tokenPricesError);
		return null;
	}

	return tokenPricesData;
}

export default useTokenPrices;