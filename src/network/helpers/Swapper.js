import { solidityPack } from 'ethers/lib/utils';
import { getContractData } from '../contracts/contractsData';
import { getSigner } from '../providers';
import { BigNumber, ethers } from 'ethers';
import { getTokenByAddress, getUsdcAddress } from '../tokens';
import { bringFromDefaultDecimals, bringToDefaultDecimals } from '../../utils/dataTypesUtils/bigIntUtils';


const SWAP_COMMISSION = 0.005 * 10**5; // 0.05% * 10**5


const Swapper = (chainId, tokenInAddress, tokenOutAddress, amountBigIntDefaultDecimals) => {
	const tokenIn = getTokenByAddress(chainId, tokenInAddress);
	const tokenOut = getTokenByAddress(chainId, tokenOutAddress);

	const amountBigInt = bringFromDefaultDecimals(
		amountBigIntDefaultDecimals,
		tokenIn.decimals
	);
	
	if (
			tokenInAddress === tokenOutAddress ||
			amountBigInt === 0n ||
			tokenIn.isStable && tokenOut.isStable
		) {
		return new Promise((resolve) => {
			resolve(
				amountBigIntDefaultDecimals
			);
		});
	}

	const amountBigNum = BigNumber.from(amountBigInt);

	const UniswapQuoter = new ethers.Contract(...getContractData(chainId, "Uniswap_Quoter"), getSigner());

	const swappedAmount = UniswapQuoter.callStatic.quoteExactInput(
		solidityPack(
			["address", "uint24", "address"],
			[tokenInAddress, SWAP_COMMISSION, tokenOutAddress]
		),
		amountBigNum,
	).then(dataBigNum => {
		const data = dataBigNum.toBigInt();
		const dataDefaultDecimals = bringToDefaultDecimals(data, tokenOut.decimals);

		return dataDefaultDecimals;
	}).catch(e => {
		console.log(`Swapping ${tokenIn.symbol} to ${tokenOut.symbol} error!\n\n`, e);
	})

	return swappedAmount;
}

export const swapToUSDC = (chainId, tokenInAddress, amountBigIntDefaultDecimals) => {
	const USDC_address = getUsdcAddress(chainId);

	return Swapper(chainId, tokenInAddress, USDC_address, amountBigIntDefaultDecimals);
}

export const swapFromUSDC = (chainId, tokenOutAddress, amountBigIntDefaultDecimals) => {
	const USDC_address = getUsdcAddress(chainId);

	return Swapper(chainId, USDC_address, tokenOutAddress, amountBigIntDefaultDecimals);
}

export const getSwapperPath = (tokenInAddress, tokenOutAddress) => {
	return solidityPack(
		["address", "uint24", "address"],
		[tokenInAddress, SWAP_COMMISSION, tokenOutAddress]
	);
}


export default Swapper;