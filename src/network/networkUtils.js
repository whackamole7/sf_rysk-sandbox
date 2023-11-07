import { configureChains, createConfig } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { ARBITRUM, OPTIMISM, SUPPORTED_CHAINS } from "../environment/constants/networkConstants";
import { getContractData } from "./contracts/contractsData";
import { ethers } from "ethers";
import { getAlchemyProvider } from './providers';
import { bringToDefaultDecimals } from './../utils/dataTypesUtils/bigIntUtils';
import { CHAINLINK_DECIMALS } from "../environment/constants/tokensConstants";


export const getWagmiConfig = () => {
	const chainsFromWagmi = [arbitrum];
	if (chainsFromWagmi.length !== SUPPORTED_CHAINS.length) {
		throw new Error(`Invalid number of wagmi chains.`);
	}
	
	const { chains, publicClient, webSocketPublicClient } = configureChains(
		chainsFromWagmi,
		[publicProvider()]
	);

	const config = createConfig({
		autoConnect: true,
		publicClient,
		webSocketPublicClient,
		connectors: [
			new InjectedConnector({
				chains,
				options: {
					name: 'Injected',
					shimDisconnect: true,
				},
			}),
		]
	});
	return config;
}

export const getExplorerUrl = (chainId) => {
	switch(chainId) {
		case ARBITRUM: {
			return "https://arbiscan.io";
		}
		case OPTIMISM: {
			return "https://optimistic.etherscan.io";
		}
		default: {
			return "https://etherscan.io";
		}
	}
}


// todo: improve
export const waitTokenPriceFromChainlink = async (chainId, tokenSymbol) => {
	const chainlinkContractData = getContractData(chainId, `Chainlink_${tokenSymbol}`);
	const alchemyProvider = getAlchemyProvider(chainId);

	const chainlinkContract = new ethers.Contract(...chainlinkContractData, alchemyProvider);

	const tokenPrice = (await chainlinkContract.latestAnswer()).toBigInt();
	const tokenPriceDefaultDecimals = bringToDefaultDecimals(tokenPrice, CHAINLINK_DECIMALS);

	return tokenPriceDefaultDecimals;
}