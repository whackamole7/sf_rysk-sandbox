import TooltipCustom from '../../../../../../../components/UI/TooltipCustom/TooltipCustom';


const PremiumTooltip = () => {
	return (
		<TooltipCustom id="Builder_PremiumTooltip">
			<h6>Negative Premium</h6>
			<div style={{margin: "3px 0 5px"}}>Indicates the amount of USDC you <br />have paid as an option buyer.</div>
			<h6>Positive Premium</h6>
			<div style={{margin: "3px 0"}}>Denotes the amount of USDC you <br />have received as an option seller.</div>
		</TooltipCustom>
	);
};

export default PremiumTooltip;