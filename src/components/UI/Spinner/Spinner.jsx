import { ImSpinner2 } from 'react-icons/im';
import './Spinner.scss';

const Spinner = (props) => {
	const {
		style,
		hasLeftMargin,
	} = props;

	return (
		<div className="Spinner">
			<ImSpinner2
				className="Spinner__icon"
				style={{marginLeft: hasLeftMargin ? 7 : 0, ...style}}
			/>
		</div>
	);
};

export default Spinner;