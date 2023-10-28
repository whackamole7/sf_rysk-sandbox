import TooltipCustom from '../../../../../../../components/UI/TooltipCustom/TooltipCustom';


const MinReceivedTooltip = () => {
	return (
		<TooltipCustom id="BuilderForm_MinReceivedTooltip">
			This is the least amount you’re <br/>assured to receive when <br/>selling options. If the option <br/>price drops beyond this point, <br/>your transaction will <br/>be reverted.
		</TooltipCustom>
	);
};

export default MinReceivedTooltip;