import cx from "classnames";


const MinReceivedValue = ({
	minReceived,
	getCostNode,
}) => {


	return (
		<div className="TradeCostValue">
			<div
				className="BuilderCalculations__item-name tip"
				data-tooltip-id='BuilderForm_MinReceivedTooltip'
			>
				Min. Received
			</div>

			<div
				className={cx("BuilderCalculations__item-value", minReceived && "tip")}
				data-tooltip-id="BuilderForm__MinReceivedDecompositionTooltip"
			>
				{getCostNode(minReceived, "+")}
			</div>
		</div>
	);
};

export default MinReceivedValue;