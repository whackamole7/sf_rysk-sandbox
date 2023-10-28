import './BuilderDashboard.scss';
import BuilderForm from './BuilderForm/BuilderForm';
import BuilderPositionChart from './BuilderPositionChart/BuilderPositionChart';
import { useState } from 'react';

const BuilderDashboard = (props) => {
	const {
		assetState
	} = props;
	
	const strategyState = useState("Long Call");
	
	const amountStrState = useState("1");

	const dateListState = useState([]);
	const chosenDateState = useState(null);

	const strikesDataArrState = useState([]);
	const chosenStrikesState = useState([]);

	const collateralDataArrState = useState([]);



	const [asset,] = assetState;
	const [strategy,] = strategyState;
	const [amountStr,] = amountStrState;

	const [chosenStrikes,] = chosenStrikesState;
	const [collateralDataArr,] = collateralDataArrState;
	
	return (
		<div className="BuilderDashboard">
			<BuilderForm
				assetState={assetState}
				strategyState={strategyState}
				amountStrState={amountStrState}
				dateListState={dateListState}
				chosenDateState={chosenDateState}
				strikesDataArrState={strikesDataArrState}
				chosenStrikesState={chosenStrikesState}
				collateralDataArrState={collateralDataArrState}
			/>
			<BuilderPositionChart
				asset={asset}
				strategy={strategy}
				amountStr={amountStr}
				chosenStrikes={chosenStrikes}
				collateralDataArr={collateralDataArr}
			/>
		</div>
	);
};

export default BuilderDashboard;