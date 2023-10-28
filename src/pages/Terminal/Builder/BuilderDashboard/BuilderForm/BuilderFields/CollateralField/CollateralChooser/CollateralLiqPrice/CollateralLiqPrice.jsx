import { formatBigInt } from '../../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import './CollateralLiqPrice.scss';
import cx from "classnames";


const CollateralLiqPrice = (props) => {
	const {
		liqPrice,
		isLiqPriceLoading,
		isInLastHalf,
	} = props;


	const liqPriceLoadingNode =
		<span className='muted_light'>
			...
		</span>;

	const liqPriceNullNode =
		<span className='muted_light'>
			—
		</span>;

	const getLiqPriceFormattedNode = () => {
		return (
			`$${formatBigInt(liqPrice)}`
		);
	};

	return (
		<div className={cx(
			"CollateralLiqPrice",
			isInLastHalf && "CollateralLiqPrice_down"
		)}>
			Liq. Price:

			<span className="CollateralLiqPrice__val">
				{isLiqPriceLoading && liqPriceLoadingNode}

				{!isLiqPriceLoading && (
					liqPrice
						? getLiqPriceFormattedNode()
						: liqPriceNullNode
				)}
			</span>
		</div>
	);
};

export default CollateralLiqPrice;