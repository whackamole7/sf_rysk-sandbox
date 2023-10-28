import './Divider.scss';
import cx from "classnames";


const Divider = ({
	isVertical
}) => {


	return (
		<div className={cx("Divider", isVertical && "vertical")} />
	);
};

export default Divider;