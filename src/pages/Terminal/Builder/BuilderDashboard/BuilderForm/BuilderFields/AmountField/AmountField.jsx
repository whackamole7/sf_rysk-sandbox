import Input from '../../../../../../../components/UI/Input/Input';
import { BUILDER_STRATEGIES_CONFIG } from '../../../../builderConstants';

const AmountField = (props) => {
	const {
		amountStrState,
		strategy
	} = props;

	const [amountStr, setAmountStr] = amountStrState;

	const unitStr = BUILDER_STRATEGIES_CONFIG[strategy].plural ?? `${strategy}s`

	return (
		<div className="BuilderForm__field BuilderForm__field_amount">
			<div className="BuilderForm__field-header">
				Enter Amount
			</div>
			<div className="BuilderForm__field-body">
				<Input
					value={amountStr}
					setValue={setAmountStr}
					unitStr={unitStr}
				/>
			</div>
		</div>
	);
};

export default AmountField;