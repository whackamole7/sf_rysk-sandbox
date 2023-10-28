import Currency from '../../../../../../../../components/common/Currency/Currency';
import './PaymentTokenSelector.scss';
import SelectorInline from '../../../../../../../../components/UI/Selector/SelectorInline/SelectorInline';
import { formatBigInt } from '../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import Spinner from '../../../../../../../../components/UI/Spinner/Spinner';
import { isUndefined } from 'swr/_internal';
import { useEffect } from 'react';
import useGodEye from '../../../../../../../../environment/contextHooks/useGodEye/useGodEye';
import { getMutedNode } from '../../../../../../../../utils/commonUtils';
import useTokenBalancesUSDC from '../../../../../../../../hooks/networkHooks/tokenHooks/tokenBalances/useTokenBalancesUSDC';


const PaymentTokenSelector = ({
	paymentTokens,
	paymentToken,
	setPaymentToken,
}) => {

	const { isConnected, account } = useGodEye();
	
	const tokenBalancesInUSDC = useTokenBalancesUSDC(paymentTokens);
	
	const updatePaymentTokenBalance = () => {
		const newPaymentTokenBalance = tokenBalancesInUSDC.find(
			token => token.symbol === paymentToken.symbol
		);
		
		if (newPaymentTokenBalance !== paymentToken.balance) {
			setPaymentToken({
				...paymentToken,
				balance: newPaymentTokenBalance,
			});
		}
	}
	
	useEffect(() => {
		updatePaymentTokenBalance();
	}, [tokenBalancesInUSDC, account]);


	const getFormattedTokenBalance = (balance) => {
		if (!isConnected) {
			return getMutedNode();
		}
		if (balance === null) {
			return getMutedNode("Error");
		}
		if (isUndefined(balance) || isUndefined(balance.inUSDC)) {
			return <Spinner />;
		}
		
		return `$${formatBigInt(balance.inUSDC, 0)}`;
	}
	
	const paymentTokenOptions = paymentTokens.map((token, i) => {
		const tokenBalanceInUSDC = tokenBalancesInUSDC[i];
		
		const formattedTokenBalanceInUSDC = getFormattedTokenBalance(tokenBalanceInUSDC);
		
		return {
			label: (
				<div className="PaymentTokenSelector__item">
					<div className="PaymentTokenSelector__item-name">
						<Currency symbol={token.symbol} isHlight={true}>
							{token.symbol}
						</Currency>
					</div>
					<div className="PaymentTokenSelector__item-value">
						{formattedTokenBalanceInUSDC}
					</div>
				</div>
			),
			value: token.symbol,
			balance: tokenBalanceInUSDC
		}
	});

	const paymentTokenOptionsGrouped = [
		{
			label: (
				<div className="PaymentTokenSelector__item">
					<div>
						Asset
					</div>
					<div>
						Balance, $
					</div>
				</div>
			),
			options: paymentTokenOptions
		}
	];
	
	return (
		<SelectorInline
			key={account}
			className={"PaymentTokenSelector"}
			options={paymentTokenOptionsGrouped}
			defaultValue={paymentToken.symbol}
			onChange={(opt) => {
				setPaymentToken({
					symbol: opt.value,
					balance: opt.balance
				});
			}}
		/>
	);
};

export default PaymentTokenSelector;