import cx from "classnames";


const CollateralCostItem = ({
	collateralCost,
	getCostNode,
}) => {


	return (
		<div className="BuilderCalculations__item">
			<div
				className="BuilderCalculations__item-name tip"
				data-tooltip-id='BuilderForm_CollateralTooltip'
			>
				Collateral
			</div>

			<div
				className={cx(
					"BuilderCalculations__item-value",
					collateralCost && collateralCost.inUSDC !== 0n && "tip"
				)}
				data-tooltip-id="BuilderForm__CollateralCostDecompositionTooltip"
			>
				{getCostNode(collateralCost)}
			</div>
		</div>
	);
};

export default CollateralCostItem;