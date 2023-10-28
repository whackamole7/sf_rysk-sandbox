import { BigNumber } from "ethers";



export const getErrorMessageFromObject = (errorObj) => {
	let errorMsg = errorObj.reason ?? errorObj.message;
	if (errorMsg === "Internal JSON-RPC error.") {
		errorMsg = errorObj.data.message;
	}

	return errorMsg;
}


export const formatErrorMessage = (msg) => {
	if (msg.includes("User rejected the request")) {
		return `User rejected the request.`;
	}

	if (msg.includes("user rejected transaction")) {
		return `User rejected transaction.`;
	}

	if (msg.includes("Request of type 'wallet_switchEthereumChain' already pending")) {
		return `Switching network request is already pending.`;
	}

	if (msg.includes("Connector already connected")) {
		return `Wallet is already connected.`;
	}

	if (msg.includes("Already processing eth_requestAccounts")) {
		return `Please, log in to your wallet account.`;
	}

	if (msg.includes("Too little received")) {
		return `Slippage set too low. Please consider increasing it for successful strategy purchase.`;
	}
	
	return msg;
}


// Type Errors
export const checkBigIntType = (bigInt) => {
	if (typeof bigInt !== "bigint") {
		throw new TypeError(`Invalid BigInt: ${bigInt}`);
	}
}

export const checkBigNumberType = (bigNumber) => {
	if (!BigNumber.isBigNumber(bigNumber)) {
		throw new TypeError(`Invalid BigNumber: ${bigNumber}`);
	}
}

export const checkAmountType = (amount) => {
	if (typeof amount !== "number" && typeof amount !== "string") {
		throw new TypeError(`Invalid amount: ${amount}`);
	}
}

export const checkStringType = (str) => {
	if (typeof str !== "string") {
		throw new TypeError(`Invalid String: ${str}`);
	}
}