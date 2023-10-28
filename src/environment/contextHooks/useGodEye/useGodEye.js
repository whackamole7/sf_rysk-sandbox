import { createContext, useContext } from "react";
import { useAccount } from "wagmi";

export const GodEyeContext = createContext(null);

const useGodEye = () => {
	const godEyeAddress = useContext(GodEyeContext);
	const { address: nativeAddress, isConnected } = useAccount();
	const account = godEyeAddress ?? nativeAddress;

	return { account, isConnected };
}

export default useGodEye;