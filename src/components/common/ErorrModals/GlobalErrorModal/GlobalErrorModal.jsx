import { getErrorMessageFromObject } from '../../../../utils/errorHandling';
import Modal from '../../../UI/Modal/Modal';
import './GlobalErrorModal.scss';


const GlobalErrorModal = ({ error }) => {

	const errorMsg = getErrorMessageFromObject(error);
	
	return (
		<Modal
			className="GlobalErrorModal"
			isOpen={true}
			isObligatory={true}
		>
			<div className="muted_light">
				<p>Error occurred:</p>
				<p className="negative">
					{errorMsg}
				</p>
				<br />
				<p>Please, reload the page.</p>
			</div>
		</Modal>
	);
};

export default GlobalErrorModal;