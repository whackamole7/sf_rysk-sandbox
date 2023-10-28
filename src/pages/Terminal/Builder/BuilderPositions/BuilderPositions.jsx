import { useContext, useEffect, useState } from 'react';
import { compareObjectsByNumericValue} from '../../../../utils/dataTypesUtils/objectUtils';
import useBuilderPositions from '../builderHooks/positionsHooks/useBuilderPositions';
import './BuilderPositions.scss';
import BuilderPositionsTable from './BuilderPositionsTable/BuilderPositionsTable';
import PendingPositionsStateContext from '../builderContext/PendingPositionsStateContext';
import PositionCollateralModal from './BuilderPositionsModals/PositionCollateralModal/PositionCollateralModal';
import ClosePositionModal from './BuilderPositionsModals/ClosePositionModal/ClosePositionModal';
import useGodEye from '../../../../environment/contextHooks/useGodEye/useGodEye';


const BuilderPositions = () => {
	const { account } = useGodEye();
	
	const [isLoadingComplete, setIsLoadingComplete] = useState(false);
	const completeLoadingCallback = () => {
		if (!isLoadingComplete) {
			setIsLoadingComplete(true);
		}
	}

	useEffect(() => {
		setIsLoadingComplete(false);
	}, [account]);
	
	const positions = useBuilderPositions(completeLoadingCallback);
	
	const sortedPositions = positions?.sort((prev, cur) => {
		if (cur.isTotal) return -1;
		if (prev.isTotal) return 1;

		return compareObjectsByNumericValue(prev, cur, "premium", -1);
	});

	const [chosenPosition, setChosenPosition] = useState(null);
	const [isCollateralModalOpen, setIsCollateralModalOpen] = useState(false);
	const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

	const openCollateralModal = (position) => {
		setChosenPosition(position);
		setIsCollateralModalOpen(true);
	}

	const openCloseModal = (position) => {
		setChosenPosition(position);
		setIsCloseModalOpen(true);
	}

	// todo: fix pending opening
	const [pendingPositions,] = useContext(PendingPositionsStateContext); 

	let positionsWithPending;
	if (pendingPositions.opening && sortedPositions) {
		positionsWithPending = [...pendingPositions.opening, ...sortedPositions];
	}


	return (
		<div className="BuilderPositions">
			<h1 className="BuilderPositions__title">
				My Positions
			</h1>
			
			<BuilderPositionsTable
				positions={sortedPositions}
				isLoadingComplete={isLoadingComplete}
				openCollateralModal={openCollateralModal}
				openCloseModal={openCloseModal}
			/>

			<PositionCollateralModal
				isOpen={isCollateralModalOpen}
				setIsOpen={setIsCollateralModalOpen}
				position={chosenPosition}
			/>

			<ClosePositionModal
				isOpen={isCloseModalOpen}
				setIsOpen={setIsCloseModalOpen}
				position={chosenPosition}
			/>
		</div>
	);
};

export default BuilderPositions;