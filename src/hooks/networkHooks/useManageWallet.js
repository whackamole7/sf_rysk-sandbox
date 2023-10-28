import { useConnect, useDisconnect } from "wagmi";
import { popErrorToast } from "../../utils/toastsUtils";


export default function useManageWallet() {
	const { connect, connectors } = useConnect({
		onError: (e) => {
			popErrorToast(e);
		}
	});
	const { disconnect } = useDisconnect();
	const injectedConnector = connectors[0];

	return {
		connectWallet: () => connect({ connector: injectedConnector }),
		disconnectWallet: disconnect,
	};
}