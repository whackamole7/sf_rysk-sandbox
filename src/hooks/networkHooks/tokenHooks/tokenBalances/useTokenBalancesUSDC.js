import { useChainId } from "wagmi";
import useTokenBalances from "./useTokenBalances";
import useSWR from "swr";
import useGodEye from "../../../../environment/contextHooks/useGodEye/useGodEye";
import { swapToUSDC } from "../../../../network/helpers/Swapper";
import { bringToDefaultDecimals } from "../../../../utils/dataTypesUtils/bigIntUtils";



// todo: refactor
const useTokenBalancesUSDC = (tokens) => {
	const { isConnected, account } = useGodEye();
	
	const chainId = useChainId();

	const tokenBalances = useTokenBalances(tokens);

	const { data: tokenBalancesUSDC } = useSWR(
		isConnected && [account, "useTokenBalancesUSDC", tokenBalances],
		async () => {
			const tokenBalancesUSDC = [];
			const swapPromises = [];

			tokenBalances.forEach((balance, i) => {
				if (!balance) {
					return;
				}
				
				balance.inTokenDecimals = balance.value;
				balance.inDefaultDecimals = bringToDefaultDecimals(balance.value, balance.decimals);
				
				swapPromises.push(
					swapToUSDC(chainId, balance.address, balance.inDefaultDecimals)
						.then(balanceUSDC => {
							tokenBalancesUSDC[i] = {
								...balance,
								inUSDC: balanceUSDC,
							};
						}).catch(e => {
							console.log(`Swapping ${balance.symbol} to USDC error.\n\n` + e);
							tokenBalancesUSDC[i] = null;
						})
				);
			});

			await Promise.all(swapPromises);

			return tokenBalancesUSDC;
		},
	)
	
	return tokenBalancesUSDC ?? [];
}

export default useTokenBalancesUSDC;