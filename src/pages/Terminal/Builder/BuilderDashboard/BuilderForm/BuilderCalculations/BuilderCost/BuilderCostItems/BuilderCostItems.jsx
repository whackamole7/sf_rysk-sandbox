import { isUndefined } from 'swr/_internal';
import { awaitLoadingDynamic } from '../../../../../../../../utils/commonUtils';
import { formatBigInt } from '../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import CollateralCostItem from './CollateralCostItem/CollateralCostItem';
import TradeCostItem from './TradeCostItem/TradeCostItem';


const BuilderCostItems = ({
	hasBuy,
	hasSell,
	hasChosenStrike,
	maxCost,
	minReceived,
	netCost,
	collateralCost,
}) => {

	
	const getCostNode = (cost, sign) => {
		if  (
					!hasChosenStrike ||
					isUndefined(cost) ||
					cost?.inUSDC === 0n
				) {
			return "$0";
		}
		
		return (
			awaitLoadingDynamic(
				() => {
					return (
						`${sign ?? ""}$${formatBigInt(cost.inUSDC < 0 ? -cost.inUSDC : cost.inUSDC)}`
					);
				},
				!cost,
			)
		);
	}


	return (
		<div className="BuilderCostItems BuilderCalculations__items">
			<TradeCostItem
				hasBuy={hasBuy}
				hasSell={hasSell}
				getCostNode={getCostNode}
				maxCost={maxCost}
				minReceived={minReceived}
				netCost={netCost}
			/>
			
			{hasSell && (
				<CollateralCostItem
					collateralCost={collateralCost}
					getCostNode={getCostNode}
				/>
			)}
		</div>
	);
};

export default BuilderCostItems;