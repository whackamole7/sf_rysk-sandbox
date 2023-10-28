import TooltipCustom from './../UI/TooltipCustom/TooltipCustom';


const Tooltips = () => {
	return (
		<div className="Tooltips">
			<TooltipCustom
				id ="Tooltip_default"
			/>
			<TooltipCustom
				place="bottom-end"
				id="Tooltip_bottom-end"
			/>
		</div>
	);
};

export default Tooltips;