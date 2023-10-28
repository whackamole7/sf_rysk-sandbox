import './BuilderPositionCloseBtn.scss';
import { awaitLoading } from '../../../../../../../utils/commonUtils';
import { useContext } from 'react';
import Button from '../../../../../../../components/UI/Button/Button';
import PendingPositionsStateContext from '../../../../builderContext/PendingPositionsStateContext';



const BuilderPositionCloseBtn = ({
	position,
	openCloseModal
}) => {
	
	const [pendingPositions,] = useContext(PendingPositionsStateContext);

	if (!position.actions) {
		return null;
	}
	
	const { isClosingDisabled } = position.actions;

	const isClosing = pendingPositions.closing.find(
		closingPosition => closingPosition.id === position.id
	);

	const handleClick = () => {
		openCloseModal(position);
	}
	
	return (
		<div className="BuilderPositionCloseBtn">
			{awaitLoading(
				<Button
					className="close-btn"
					type="micro"
					isDisabled={isClosingDisabled}
					onClick={handleClick}
				>
					Close
				</Button>,
				isClosing
			)}
		</div>
	)
	
	
};

export default BuilderPositionCloseBtn;