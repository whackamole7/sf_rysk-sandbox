import { useBalance } from "wagmi";
import useGodEye from "../../../../environment/contextHooks/useGodEye/useGodEye";


const useTokenBalances = (tokens) => {
	const { account } = useGodEye();
	
	const tokenBalances = tokens.map(token => {
		let { data } = useBalance({
			address: account,
			token: token.isETH ? null : token.address,
			watch: true,
		});

		if (!data) {
			data = { value: 0n };
		}
		
		return {
			...data,
			address: token.address,
			symbol: token.symbol,
			isETH: token.isETH,
			isStable: token.isStable,
		};
	});
	
	return tokenBalances;
}

export default useTokenBalances;