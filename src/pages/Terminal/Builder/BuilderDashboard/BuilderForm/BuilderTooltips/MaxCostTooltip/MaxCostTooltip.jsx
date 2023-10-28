import TooltipCustom from '../../../../../../../components/UI/TooltipCustom/TooltipCustom';


const MaxCostTooltip = () => {
	return (
		<TooltipCustom id="BuilderForm_MaxCostTooltip">
			This is the highest amount <br/>you’ll pay for buying options. <br/>If the option price rises <br/>beyond this, your transaction <br/>will be reverted.
		</TooltipCustom>
	);
};

export default MaxCostTooltip;