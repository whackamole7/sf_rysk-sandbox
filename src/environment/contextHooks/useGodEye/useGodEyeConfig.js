import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAddress } from "viem";

const GOD_EYE_CHEATCODE = "AEZAKMI=";

const useGodEyeConfig = () => {
	const [godEyeAddress, setGodEyeAddress] = useState();
	
	const loc = useLocation();

	const enableGodEyeMode = (address) => {
		setGodEyeAddress(address);
		console.log("GOD EYE MODE ENABLED:", address);
	}
	const disableGodEyeMode = (reasonStr) => {
		setGodEyeAddress(null);
		console.log(`GOD EYE MODE DISABLED${reasonStr ? ` (${reasonStr})` : ""}`);
	}

	useEffect(() => {
		const pathnameParts = loc.pathname.split('/');
		const lastPathnamePart = pathnameParts[pathnameParts.length - 1];
		if (lastPathnamePart.startsWith(GOD_EYE_CHEATCODE)) {
			const address = lastPathnamePart.split("=")[1];
			if (isAddress(address)) {
				enableGodEyeMode(address);
			} else {
				disableGodEyeMode("Invalid wallet address");
			}
		}
	}, [loc.pathname]);


	return { godEyeAddress };
}

export default useGodEyeConfig;