import { useChainId } from "wagmi";
import Currency from "../../../../../../../../components/common/Currency/Currency";
import { formatBigInt, formatTokenAmount } from "../../../../../../../../utils/dataTypesUtils/bigIntUtils";
import { getMutedNode } from './../../../../../../../../utils/commonUtils';
import { swapFromUSDC } from "../../../../../../../../network/helpers/Swapper";
import { useEffect } from "react";
import { APPROXIMATELY_SYMBOL } from './../../../../../../../../environment/constants/styleConstants';
import Spinner from "../../../../../../../../components/UI/Spinner/Spinner";
import { isUndefined } from "swr/_internal";
import { getShouldSwap } from "../../../../../builderUtils";



const YouPayValue = ({
	youPayState,
	paymentToken,
}) => {
	
	const chainId = useChainId();

	const [youPay, setYouPay] = youPayState;
	
	const swapToPaymentToken = () => {
		if (youPay.inUSDC < 0) {
			return new Promise((resolve) => {
				resolve(null);
			});
		}
		
		return swapFromUSDC(chainId, paymentToken.address, youPay.inUSDC);
	}

	const SwapUpdater = {
		triggers: [youPay],
		isAllowed: Boolean(
			youPay && paymentToken && isUndefined(youPay.inPaymentToken)
		),
		update: () => {
			const delayedUpdate = () => {
				setTimeout(() => {
					setYouPay({ ...youPay });
				}, 1000);
			}
			
			const shouldSwap = getShouldSwap(youPay, paymentToken);
			if (!shouldSwap) {
				youPay.inPaymentToken = youPay.decomposition.reduce((sum, decompositionItem) => {
					if (!decompositionItem) {
						return sum;
					}
					
					return sum + decompositionItem.inMarketToken;
				}, 0n);
				youPay.paymentToken = paymentToken;

				delayedUpdate();
				return;
			}
			
			swapToPaymentToken()
				.then(swappedAmount => {
					youPay.paymentToken = paymentToken;
					youPay.inPaymentToken = swappedAmount;

					delayedUpdate();
				});
		}
	}

	const SwapResetter = {
		triggers: [paymentToken.symbol],
		isAllowed: Boolean(youPay),
		reset: () => {
			youPay.inPaymentToken = undefined;
			setYouPay({ ...youPay });
		}
	}
	
	useEffect(() => {
		if (SwapUpdater.isAllowed) {
			SwapUpdater.update();
		}
	}, [...SwapUpdater.triggers]);
	
	useEffect(() => {
		if (SwapResetter.isAllowed) {
			SwapResetter.reset();
		}
	}, [...SwapResetter.triggers]);


	const nodeGetter = {
		getNegativeValueNode: () => {
			return (
				<Currency>
					<span
						className="negative tip"
						data-tooltip-id="BuilderForm_YouPayWarningTooltip"
					>
						{formatBigInt(youPay.inUSDC, 0)}
					</span>
				</Currency>
			)
		},

		getPaymentTokenNode: () => {
			const paymentTokenString = formatTokenAmount(
				youPay.inPaymentToken,
				youPay.paymentToken.isStable,
			);
	
			return paymentTokenString;
		},

		getUsdcNode: () => {
			const usdcString = `$${formatBigInt(youPay.inUSDC, 2)}`;
	
			return usdcString;
		},

		getApproximatelySymbolNode: () => {
			return (
				<span className="muted_light mx-5" style={{ fontSize: 16 }}>
					{APPROXIMATELY_SYMBOL}
				</span>
			);
		}
	}


	const createValueNode = () => {
		if (!youPay || !paymentToken) {
			return getMutedNode();
		}

		if (youPay.inPaymentToken === null) {
			return nodeGetter.getNegativeValueNode();
		}
		
		if (isUndefined(youPay.inPaymentToken)) {
			return <Spinner />;
		}
		
		return (
			<Currency isHlight={true} symbol={paymentToken.symbol}>
				{nodeGetter.getPaymentTokenNode()}
				{nodeGetter.getApproximatelySymbolNode()}
				{nodeGetter.getUsdcNode()}
			</Currency>
		)
	}
	
	return (
		createValueNode()
	);
};

export default YouPayValue;