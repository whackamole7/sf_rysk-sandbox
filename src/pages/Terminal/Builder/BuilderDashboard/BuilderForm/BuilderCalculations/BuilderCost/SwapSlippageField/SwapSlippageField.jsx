import './SwapSlippageField.scss';
import SlippageInput from '../../../../../../../../components/UI/Input/SlippageInput/SlippageInput';


const SwapSlippageField = ({
	swapSlippageState
}) => {

	const [swapSlippage, setSwapSlippage] = swapSlippageState;

	return (
		<div className="SwapSlippageField info-row">
			<div className="info-row__title">
				Slippage
			</div>

			<div className="info-row__value">
				<SlippageInput
					slippage={swapSlippage}
					setSlippage={setSwapSlippage}
				/>
			</div>
		</div>
	);
};

export default SwapSlippageField;