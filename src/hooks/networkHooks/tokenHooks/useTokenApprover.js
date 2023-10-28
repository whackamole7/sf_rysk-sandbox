import { useChainId } from "wagmi";
import useGodEye from "../../../environment/contextHooks/useGodEye/useGodEye";
import { approveToken, getIsTokenApproved } from "../../../utils/tokenUtils";
import { getTokenBySymbol } from "../../../network/tokens";


const useTokenApprover = (
	tokenSymbol,
	spender,
	amountBigInt,
	setIsApproved = (isApproved) => {}
) => {
	const { account } = useGodEye();
	const chainId = useChainId();
	
	const token = getTokenBySymbol(chainId, tokenSymbol);

	const Approver = {
		check: async () => {
			if (token.isETH) {
				return new Promise(resolve => resolve(true))
					.then(setIsApproved);
			}
			
			return (
				getIsTokenApproved(
					chainId,
					token,
					account,
					spender,
					amountBigInt
				).then(setIsApproved)
			);
		},

		approve: async (setIsLoading, callback) => {
			if (token.isETH) {
				throw new Error(`Trying to approve ETH`);
			}
			
			return (
				approveToken(
					chainId,
					token,
					spender,
					amountBigInt,
					setIsLoading,
					callback,
				)
			)
		}
	}

	return Approver;
}

export default useTokenApprover;