
import { useSwitchNetwork } from 'wagmi';
import { popErrorToast, popSuccessToast } from '../../utils/toastsUtils';
import { CHAINS_DATA } from '../../environment/constants/networkConstants';

const useSwitchNetworkWithToast = () => {
	const { switchNetworkAsync } = useSwitchNetwork();
	
	return (chainId) => {
		if (typeof chainId !== "number" && typeof chainId !== "string") {
			throw new TypeError(`Invalid chainId type: ${chainId} (${typeof chainId})`);
		}
		
		const chainName = CHAINS_DATA[chainId].name;
		
		switchNetworkAsync(chainId)
			.then(() => {
				popSuccessToast(`Network switched to ${chainName} (${chainId})`);
			}, e => {
				popErrorToast(e);
			});
	}
}

export default useSwitchNetworkWithToast;