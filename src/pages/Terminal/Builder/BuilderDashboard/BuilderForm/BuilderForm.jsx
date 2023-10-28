import './BuilderForm.scss';
import BuilderFields from './BuilderFields/BuilderFields';
import BuilderTooltips from './BuilderTooltips/BuilderTooltips';
import BuilderCalculations from './BuilderCalculations/BuilderCalculations';
import { useState } from 'react';
import BuyBuildModal from './BuyBuildModal/BuyBuildModal';
import { BUILDER_SWAP_SLIPPAGE } from '../../builderConstants';
import { useLocalStorage } from 'react-use';


const validateSlippage = (slippage) => {
	if (typeof slippage !== "number" || slippage > 1 || slippage < 0) {
		return false;
	}

	return true;
}


const BuilderForm = ({
	assetState,
	strategyState,
	amountStrState,

	dateListState,
	chosenDateState,

	strikesDataArrState,
	chosenStrikesState,

	collateralDataArrState,
}) => {

	const youPayState = useState(null);
	const [youPay,] = youPayState;
	const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
	
	const swapSlippageState = useLocalStorage("Builder-swap-slippage", BUILDER_SWAP_SLIPPAGE);
	const [swapSlippage, setSwapSlippage] = swapSlippageState;
	if (!validateSlippage(swapSlippage)) {
		setSwapSlippage(BUILDER_SWAP_SLIPPAGE);
	}
	
	const [asset,] = assetState;
	const [strategy,] = strategyState;
	const [amountStr,] = amountStrState;

	const [chosenStrikes,] = chosenStrikesState;
	const [collateralDataArr,] = collateralDataArrState;

	const openBuyModal = () => {
		setIsBuyModalOpen(true);
	}
	

	return (
		<div className="BuilderForm App-box">
			<BuilderFields
				assetState={assetState}
				strategyState={strategyState}
				amountStrState={amountStrState}
		
				dateListState={dateListState}
				chosenDateState={chosenDateState}
		
				strikesDataArrState={strikesDataArrState}
				chosenStrikesState={chosenStrikesState}
		
				collateralDataArrState={collateralDataArrState}
			/>

			<BuilderCalculations
				strategy={strategy}
				amountStr={amountStr}
				youPayState={youPayState}
				chosenStrikesState={chosenStrikesState}
				collateralDataArrState={collateralDataArrState}
				openBuyModal={openBuyModal}
				swapSlippageState={swapSlippageState}
			/>

			{youPay?.inPaymentToken && (
				<BuyBuildModal
					isOpen={isBuyModalOpen}
					setIsOpen={setIsBuyModalOpen}
					asset={asset}
					strategy={strategy}
					amountStr={amountStr}
					chosenStrikes={chosenStrikes}
					collateralDataArr={collateralDataArr}
					youPay={youPay}
					swapSlippage={swapSlippage}
				/>
			)}
			
			
			<BuilderTooltips
				strategy={strategy}
			/>
		</div>
	);
};

export default BuilderForm;