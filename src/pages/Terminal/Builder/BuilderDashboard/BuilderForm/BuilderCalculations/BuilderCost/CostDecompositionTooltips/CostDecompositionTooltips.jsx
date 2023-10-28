import TooltipPriceDecomposition from '../../../../../../../../components/UI/TooltipCustom/TooltipDecomposition/TooltipPriceDecomposition/TooltipPriceDecomposition';


const CostDecompositionTooltips = ({
	maxCost,
	minReceived,
	collateralCost,
}) => {

	const tooltipsData = [
		{
			id: "BuilderForm__MaxCostDecompositionTooltip",
			decomposition: maxCost?.decomposition,
			isZero: maxCost?.inUSDC === 0n
		},
		{
			id: "BuilderForm__MinReceivedDecompositionTooltip",
			decomposition: minReceived?.decomposition,
			isZero: minReceived?.inUSDC === 0n
		},
		{
			id: "BuilderForm__CollateralCostDecompositionTooltip",
			decomposition: collateralCost?.decomposition,
			isZero: collateralCost?.inUSDC === 0n
		}
	];


	return (
		<div className="CostDecompositionTooltips">
			{tooltipsData.map(data => {
				if (!data.decomposition || data.isZero) {
					return null;
				}

				return (
					<TooltipPriceDecomposition
						key={data.id}
						id={data.id}
						priceDecompositionArr={data.decomposition}
					/>
				)
			})}
		</div>
	);
};

export default CostDecompositionTooltips;