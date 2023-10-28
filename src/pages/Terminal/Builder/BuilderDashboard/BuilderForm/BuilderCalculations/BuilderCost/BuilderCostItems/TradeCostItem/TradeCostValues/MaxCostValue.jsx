import cx from "classnames";


const MaxCostValue = ({
	maxCost,
	getCostNode,
}) => {


	return (
		<div className="TradeCostValue">
			<div
				className="BuilderCalculations__item-name tip"
				data-tooltip-id='BuilderForm_MaxCostTooltip'
			>
				Max. Cost
			</div>

			<div
				className={cx("BuilderCalculations__item-value", maxCost && "tip")}
				data-tooltip-id="BuilderForm__MaxCostDecompositionTooltip"
			>
				{getCostNode(maxCost, "-")}
			</div>
		</div>
	);
};

export default MaxCostValue;