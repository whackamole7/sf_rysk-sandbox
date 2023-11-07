import './BuilderCalculations.scss';
import BuilderCost from './BuilderCost/BuilderCost';
import BuilderGreeks from './BuilderGreeks/BuilderGreeks';
import BuilderSwap from './BuilderSwap/BuilderSwap';
import useBuilderFormButton from './../../../builderHooks/useBuilderFormButton';
import useGodEye from '../../../../../../environment/contextHooks/useGodEye/useGodEye';
import { useEffect, useState } from 'react';
import Button from './../../../../../../components/UI/Button/Button';
import { BUILDER_STRATEGIES_CONFIG } from '../../../builderConstants';
import { useLocalStorage } from 'react-use';
import { useChainId } from 'wagmi';
import { getTokenBySymbol } from '../../../../../../network/tokens';


const BuilderCalculations = ({
	strategy,
	amountStr,
	youPayState,
	chosenStrikesState,
	collateralDataArrState,
	openBuyModal,
	swapSlippageState
}) => {

	const chainId = useChainId();
	
	const [paymentTokenSymbol, setPaymentTokenSymbol] = useLocalStorage(
		"builder-payment-token",
		"ETH"
	);
	const [paymentToken, setPaymentToken] = useState({ symbol: paymentTokenSymbol });

	useEffect(() => {
		setPaymentTokenSymbol(paymentToken.symbol);
		
		if (!paymentToken.address) {
			const tokenInfo = getTokenBySymbol(chainId, paymentToken.symbol);

			setPaymentToken({
				...paymentToken,
				...tokenInfo
			});
		}
	}, [paymentToken]);

	const [chosenStrikes,] = chosenStrikesState;
	const [collateralDataArr,] = collateralDataArrState;
	
	const [youPay,] = youPayState;

	const strategyStructure = BUILDER_STRATEGIES_CONFIG[strategy].structure;
	const BuilderFormButton = useBuilderFormButton(
		amountStr,
		strategyStructure,
		chosenStrikes,
		collateralDataArr,
		youPay?.inPaymentToken,
		paymentToken.balance?.inDefaultDecimals,
		openBuyModal
	);

	return (
		<div className="BuilderCalculations">
			<BuilderGreeks
				chosenStrikes={chosenStrikes}
			/>
			<BuilderCost
				strategy={strategy}
				amountStr={amountStr}
				chosenStrikesState={chosenStrikesState}
				collateralDataArrState={collateralDataArrState}
				youPayState={youPayState}
				swapSlippageState={swapSlippageState}
			/>
			<BuilderSwap
				youPayState={youPayState}
				paymentToken={paymentToken}
				setPaymentToken={setPaymentToken}
				confirmButtonNode={BuilderFormButton}
			/>
		</div>
	);
};

export default BuilderCalculations;