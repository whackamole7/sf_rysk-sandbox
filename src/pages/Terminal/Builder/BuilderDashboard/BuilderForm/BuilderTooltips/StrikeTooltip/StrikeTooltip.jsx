import TooltipCustom from './../../../../../../../components/UI/TooltipCustom/TooltipCustom';


const StrikeTooltip = () => {
	return (
		<TooltipCustom id="BuilderForm_StrikeTooltip">
			<h6>Hegic Options (American options)</h6>
			<p className='my-5'>
				They require manual exercise before <br/>the expiration date. <br/>There are no secondary markets; out-<br/>of-the-money options can't be sold.
			</p>
			<h6>Lyra (European options)</h6>
			<p className='my-5'>
				They are only exercised automatically <br/>at the expiration date. <br/>Secondary markets are available; out-<br/>of-the-money options can be sold.
			</p>
		</TooltipCustom>
	);
};

export default StrikeTooltip;