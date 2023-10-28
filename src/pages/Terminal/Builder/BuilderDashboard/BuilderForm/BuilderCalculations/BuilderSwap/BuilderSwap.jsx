import './BuilderSwap.scss';
import Currency from './../../../../../../../components/common/Currency/Currency';
import { getSwappableTokens } from '../../../../../../../network/tokens';
import { useChainId } from 'wagmi';
import { formatTokenAmount } from './../../../../../../../utils/dataTypesUtils/bigIntUtils';
import { getMutedNode } from './../../../../../../../utils/commonUtils';
import useGodEye from '../../../../../../../environment/contextHooks/useGodEye/useGodEye';
import YouPayValue from './YouPayValue/YouPayValue';
import Spinner from '../../../../../../../components/UI/Spinner/Spinner';
import PaymentTokenSelector from './PaymentMethodSelector/PaymentTokenSelector';
import { isUndefined } from 'swr/_internal';

const BuilderSwap = ({
	paymentToken,
	setPaymentToken,
	youPayState,
	confirmButtonNode,
}) => {

	const { isConnected } = useGodEye();
	const chainId = useChainId();

	const swappableTokens = getSwappableTokens(chainId);
	
	const getTokenBalanceNode = () => {
		if (!isConnected) {
			return getMutedNode();
		}
		if (paymentToken.balance === null) {
			return getMutedNode("Error");
		}
		if (isUndefined(paymentToken.balance)) {
			return <Spinner />
		}

		const displayDecimals = paymentToken.balance.value === 0n ? 0 : undefined;

		return (
			<Currency symbol={paymentToken.symbol} isHlight={true}>
				{formatTokenAmount(
					paymentToken.balance.inDefaultDecimals,
					paymentToken.isStable,
					displayDecimals,
				)}
			</Currency>
		)
	}


	return (
		<div className="BuilderSwap">
			<div className="BuilderCalculations__items">
				<div className="BuilderCalculations__item">
					<div className="BuilderCalculations__item-name">
						Select Payment method
					</div>

					<div className="BuilderCalculations__item-value">
						<PaymentTokenSelector
							paymentTokens={swappableTokens}
							paymentToken={paymentToken}
							setPaymentToken={setPaymentToken}
						/>
					</div>
				</div>

				<div className="BuilderCalculations__item">
					<div className="BuilderCalculations__item-name">
						You pay
					</div>

					<div className="BuilderCalculations__item-value">
						<YouPayValue
							youPayState={youPayState}
							paymentToken={paymentToken}
						/>
					</div>
				</div>

				<div className="BuilderCalculations__item">
					<div className="BuilderCalculations__item-name">
						Balance
					</div>

					<div className="BuilderCalculations__item-value">
						{getTokenBalanceNode()}
					</div>
				</div>
				
			</div>
			
			{confirmButtonNode}
		</div>
	);
};

export default BuilderSwap;