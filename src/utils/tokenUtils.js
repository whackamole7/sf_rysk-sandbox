import { BigNumber, ethers } from "ethers";
import { TOKENS_DECIMALS } from "../environment/constants/tokensConstants";
import { bringFromDefaultDecimals, bringToDefaultDecimals, numberFromBigInt } from "./dataTypesUtils/bigIntUtils";
import { sendTransaction } from "../network/contracts/contractsUtils";
import { checkBigIntType } from "./errorHandling";
import { getContractData } from "../network/contracts/contractsData";
import { getAlchemyProvider, getSigner } from "../network/providers";



export const approveToken = (
	chainId,
	token,
	spender,
	amountBigIntDefaultDecimals,
	setIsLoading,
	callback
) => {
	// todo: add approved amount from MetaMask input
	// const tokenAmountStr = formatTokenAmount(amountBigIntDefaultDecimals, token.isStable);

	const amountBigInt = bringFromDefaultDecimals(
		amountBigIntDefaultDecimals,
		token.decimals,
	);

	const tokenContract = new ethers.Contract(
		...getContractData(chainId, token.symbol),
		getSigner()
	);
	
	sendTransaction(
		chainId,
		tokenContract.approve,
		[spender, BigNumber.from(amountBigInt)],
		`${token.symbol} approved.`,
		setIsLoading,
		callback
	)
}

export const getIsTokenApproved = async (
	chainId,
	token,
	owner,
	spender,
	amountBigIntDefaultDecimals
) => {
	checkBigIntType(amountBigIntDefaultDecimals);

	const tokenContract = new ethers.Contract(
		...getContractData(chainId, token.symbol),
		getAlchemyProvider(chainId)
	);

	const amountBigInt = bringFromDefaultDecimals(
		amountBigIntDefaultDecimals,
		token.decimals
	);
	
	const allowance = await tokenContract.allowance(owner, spender);
	return allowance.toBigInt() >= amountBigInt;
}



export const getTokenAmountFromDefaultDecimals = (bigInt, tokenSymb) => {
	const tokenDecimals = TOKENS_DECIMALS[tokenSymb];
	const tokenAmount = bringFromDefaultDecimals(
		bigInt,
		tokenDecimals
	);

	return tokenAmount;
}

export const bringTokenAmountToDefaultDecimals = (bigInt, tokenSymb) => {
	const tokenDecimals = TOKENS_DECIMALS[tokenSymb];
	const tokenAmount = bringToDefaultDecimals(
		bigInt,
		tokenDecimals
	);

	return tokenAmount;
}

export const getNumberFromTokenAmount = (amountBigInt, tokenSymb) => {
  const tokenDecimals = TOKENS_DECIMALS[tokenSymb];
  const number = numberFromBigInt(amountBigInt, tokenDecimals);

  return number;
}


export const getIsWrapped = (tokenSymb) => {
	return tokenSymb.startsWith("W");
}