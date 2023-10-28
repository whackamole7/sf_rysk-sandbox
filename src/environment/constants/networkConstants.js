import icon_Arbitrum from "../../img/blockchains/Arbitrum.svg";
import icon_Optimism from "../../img/blockchains/Optimism.svg";

export const ARBITRUM = 42161;
export const OPTIMISM = 10;
export const SUPPORTED_CHAINS = [ARBITRUM];
export const CHAINS_DATA = {
	[ARBITRUM]: {
		name: "Arbitrum",
		icon: icon_Arbitrum,
	},
	[OPTIMISM]: {
		name: "Optimism",
		icon: icon_Optimism,
		isDisabled: true,
	},
}