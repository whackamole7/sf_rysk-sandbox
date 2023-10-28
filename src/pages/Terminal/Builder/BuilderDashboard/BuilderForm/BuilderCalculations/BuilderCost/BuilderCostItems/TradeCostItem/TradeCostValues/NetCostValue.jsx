import { SENTIMENT_SIGNS } from '../../../../../../../../../../environment/constants/styleConstants';
import cx from "classnames";


const NetCostValue = ({
	netCost,
	getCostNode
}) => {

	const netCostSentiment =
		netCost?.inUSDC < 0
			? "negative"
			: netCost?.inUSDC > 0
				? "positive"
				: "neutral";

	const netCostSign = SENTIMENT_SIGNS[netCostSentiment];


	return (
		<div className="TradeCostValue">
			<div className="BuilderCalculations__item-name">
				Net. Cost
			</div>

			<div className={cx("BuilderCalculations__item-value", netCostSentiment)}>
				{getCostNode(netCost, netCostSign)}
			</div>
		</div>
	);
};

export default NetCostValue;