import icon_ETH from '../img/tokens/ETH.svg';
import icon_BTC from '../img/tokens/BTC.svg';
import icon_WETH from '../img/tokens/WETH.svg';
import icon_WBTC from '../img/tokens/WBTC.svg';
import icon_USDC from '../img/tokens/USDC.svg';
import icon_USDT from '../img/tokens/USDT.svg';
import icon_DAI from '../img/tokens/DAI.svg';
import { ARBITRUM } from '../environment/constants/networkConstants';


export const TOKENS = {
	[ARBITRUM]: [
		{
			name: "Ethereum",
			symbol: "ETH",
			decimals: 18,
			address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
			isETH: true,
			icon: icon_ETH,
			isSwappable: true,
		},
		{
			name: "Bitcoin",
			symbol: "BTC",
			decimals: 8,
			address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
			icon: icon_BTC,
		},
		{
			name: "Wrapped Ethereum",
			symbol: "WETH",
			decimals: 18,
			address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
			icon: icon_WETH,
			isSwappable: true,
		},
		{
			name: "Wrapped Bitcoin",
			symbol: "WBTC",
			decimals: 8,
			address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
			icon: icon_WBTC,
			isSwappable: true,
		},
		{
			name: "Dai",
			symbol: "DAI",
			decimals: 18,
			address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
			icon: icon_DAI,
			isSwappable: true,
			isStable: true,
		},
		{
			name: "USD Coin",
			symbol: "USDC",
			decimals: 6,
			address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
			icon: icon_USDC,
			isSwappable: true,
			isStable: true,
		},
		{
			name: "USDC.e",
			symbol: "USDC.e",
			decimals: 6,
			address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
			icon: icon_USDC,
			isSwappable: true,
			isStable: true,
		},
		{
			name: "Tether",
			symbol: "USDT",
			decimals: 6,
			address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
			icon: icon_USDT,
			isSwappable: true,
			isStable: true,
		},
	],
}

const TOKENS_BY_SYMBOL_MAP = {};
const TOKENS_BY_ADDRESS_MAP = {};
const CHAIN_IDS = Object.keys(TOKENS);

for (let j = 0; j < CHAIN_IDS.length; j++) {
	const chainId = CHAIN_IDS[j];
	TOKENS_BY_SYMBOL_MAP[chainId] = {};
	TOKENS_BY_ADDRESS_MAP[chainId] = {};
	let tokens = TOKENS[chainId];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		TOKENS_BY_SYMBOL_MAP[chainId][token.symbol] = token;
		TOKENS_BY_ADDRESS_MAP[chainId][token.address] = token;
	}
}

export const getTokenBySymbol = (chainId, symbol) => {
	const chainTokens = TOKENS_BY_SYMBOL_MAP[chainId];
	if (!chainTokens) {
		throw new Error(`No tokens found for chainId ${chainId}`);
	}
	
	const token = TOKENS_BY_SYMBOL_MAP[chainId][symbol];
	if (!token) {
		throw new Error(`Incorrect symbol "${symbol}" for chainId ${chainId}`);
	}
	
	return token;
}

export const getTokenByAddress = (chainId, address) => {
	const chainTokens = TOKENS_BY_ADDRESS_MAP[chainId];
	if (!chainTokens) {
		throw new Error(`No tokens found for chainId ${chainId}`);
	}
	
	const token = TOKENS_BY_ADDRESS_MAP[chainId][address];
	if (!token) {
		throw new Error(`Incorrect address "${address}" for chainId ${chainId}`);
	}
	return token;
}

export const getSwappableTokens = (chainId) => {
	const chainTokens = TOKENS[chainId];

	if (!chainTokens) {
		throw new Error(`No tokens found for chainId ${chainId}`);
	}
	
	const swappableTokens = chainTokens.filter(token => token.isSwappable);

	return swappableTokens;
}

export const getUsdcAddress = (chainId) => {
	const USDC = getTokenBySymbol(chainId, "USDC.e");

	return USDC.address;
}


export const getTokenIconBySymbol = (symbol) => {
	const token = getTokenBySymbol(ARBITRUM, symbol);

	return token.icon;
}