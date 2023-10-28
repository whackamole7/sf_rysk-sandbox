import MaxCostValue from './TradeCostValues/MaxCostValue';
import NetCostValue from './TradeCostValues/NetCostValue';
import MinReceivedValue from './TradeCostValues/MinReceivedValue';
import './TradeCostValue.scss';


const TradeCostItem = ({
	hasBuy,
	hasSell,
	getCostNode,
	maxCost,
	minReceived,
	netCost,
}) => {

	const helperNodes = {
		plus: 	<span className="helper-symbol mx-10 muted_light" style={{fontSize: 18}}>
							+
						</span>,
		equal: 	<span className="helper-symbol mx-10 muted_light" style={{fontSize: 17}}>
							=
						</span>
	}

	const hasBuyAndSell = hasBuy && hasSell;


	return (
		<div className="TradeCostItem BuilderCalculations__item">
			{hasBuy && (
				<MaxCostValue
					maxCost={maxCost}
					getCostNode={getCostNode}
				/>
			)}
			
			{hasBuyAndSell && (
				helperNodes.plus
			)}

			{hasSell && (
				<MinReceivedValue
					minReceived={minReceived}
					getCostNode={getCostNode}
				/>
			)}

			{hasBuyAndSell && (
				<>
					{helperNodes.equal}
					<NetCostValue
						netCost={netCost}
						getCostNode={getCostNode}
					/>
				</>
			)}
		</div>
	);
};

export default TradeCostItem;