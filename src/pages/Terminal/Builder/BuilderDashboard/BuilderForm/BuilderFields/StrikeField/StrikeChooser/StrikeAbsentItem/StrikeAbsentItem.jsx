import './StrikeAbsentItem.scss';
import icon_cross from '../../../../../../../../../img/UI/cross_grey.svg';
import cx from "classnames";


const StrikeAbsentItem = (props) => {
	const {
		isITM
	} = props;
	
	return (
		<div className={cx(
			"StrikeAbsentItem",
			"StrikeChooser__item",
			isITM && "StrikeChooser__item_ITM"
		)}>
			<img src={icon_cross} alt="Absent" />
		</div>
	);
};

export default StrikeAbsentItem;