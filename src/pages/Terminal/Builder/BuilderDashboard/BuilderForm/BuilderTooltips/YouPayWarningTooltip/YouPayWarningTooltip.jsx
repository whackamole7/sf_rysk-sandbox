import TooltipCustom from "../../../../../../../components/UI/TooltipCustom/TooltipCustom";


const YouPayWarningTooltip = () => {
	return (
		<TooltipCustom id="BuilderForm_YouPayWarningTooltip">
			Apparently, the collateral you've set <br />is too small. This may result in instant <br />liquidation of the position.
		</TooltipCustom>
	);
};

export default YouPayWarningTooltip;