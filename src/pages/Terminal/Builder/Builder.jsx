import { useLocalStorage } from 'react-use';
import './Builder.scss';
import BuilderDashboard from './BuilderDashboard/BuilderDashboard';
import BuilderPositions from './BuilderPositions/BuilderPositions';
import { useEffect, useState } from 'react';
import PendingPositionsStateContext, { getEmptyPendingPositions } from './builderContext/PendingPositionsStateContext';

const Builder = () => {

	const assetState = useLocalStorage("asset", "ETH");

	const [pendingPositions, setPendingPositions] = useState({});
	useEffect(() => {
		setPendingPositions(getEmptyPendingPositions());
	}, []);
	
	return (
		<PendingPositionsStateContext.Provider value={[pendingPositions, setPendingPositions]}>
				<div className="Builder">
				<BuilderDashboard
					assetState={assetState}
				/>

				<BuilderPositions />
			</div>
		</PendingPositionsStateContext.Provider>
	);
};

export default Builder;