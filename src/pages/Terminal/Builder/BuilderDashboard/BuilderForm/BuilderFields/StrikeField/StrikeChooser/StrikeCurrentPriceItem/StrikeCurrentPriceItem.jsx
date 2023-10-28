import { separateThousands } from '../../../../../../../../../utils/dataTypesUtils/numberUtils';
import './StrikeCurrentPriceItem.scss';
import cx from "classnames";

const StrikeCurrentPriceItem = (props) => {
	const {
		currentPrice,
		isFirst,
	} = props;

	return (
		<div className={cx(
			"StrikeCurrentPriceItem",
			"StrikeChooser__item",
			isFirst && "StrikeCurrentPriceItem_first"
		)}>
			<span>
				${separateThousands(currentPrice)}
			</span>
		</div>
	);
};

export default StrikeCurrentPriceItem;