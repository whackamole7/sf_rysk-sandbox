import Selector from '../../../../../../../components/UI/Selector/Selector';
import icon_strategy_selector from '../../../../../../../img/UI/strategy-selector-icon.svg';
import { BUILDER_STRATEGIES } from '../../../../builderConstants';


const StrategyField = (props) => {
	const {
		strategyState,
		isDisabled
	} = props;

	const [strategy, setStrategy] = strategyState;

	const strategyOptions = BUILDER_STRATEGIES.map(strategy => {
		return {
			value: strategy,
			label: strategy,
		}
	});

	return (
		<div className="BuilderForm__field BuilderForm__field_strategy">
			<div className="BuilderForm__field-header">
				Strategy
				<div className="BuilderForm__field-tip tip" data-tooltip-id="BuilderForm_WhenPurchaseTooltip">
					When purchase
				</div>
			</div>
			<div className="BuilderForm__field-body">
				<Selector
					options={strategyOptions}
					defaultValue={strategy}
					onChange={option => {
						setStrategy(option.value);
					}}
					iconNode={
						<img src={icon_strategy_selector} alt="Strategy selector icon" />
					}
					className="Selector_thin-options"
					isDisabled={isDisabled}
				/>
			</div>
		</div>
	);
};

export default StrategyField;