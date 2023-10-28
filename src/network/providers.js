import Lyra from '@lyrafinance/lyra-js';
import { ethers } from 'ethers';
import { ARBITRUM, OPTIMISM } from '../environment/constants/networkConstants';


const ALCHEMY_API_KEYS = {
	// todo: RyskSandbox
	[ARBITRUM]: "", // Put your api key here
	[OPTIMISM]: "",
}

export const getAlchemyProvider = (chainId) => {
	const alchemyApiKey = ALCHEMY_API_KEYS[chainId];
	if (!alchemyApiKey) {
		throw new Error(`No Alchemy api key found for chainId ${chainId}`);
	}

	return new ethers.providers.AlchemyProvider(chainId, alchemyApiKey);
}

export const getLyra = (chainId) => {
	return new Lyra({
		provider:  getAlchemyProvider(chainId)
	});
}

export const getSigner = () => {
	if (!window.ethereum) {
		throw new Error(`No Ethereum provider found`);
	}
	return new ethers.providers.Web3Provider(window.ethereum).getSigner();
}