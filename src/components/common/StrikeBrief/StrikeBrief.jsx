import './StrikeBrief.scss';
import { MARKETS_ICONS } from './../../../environment/constants/optionsConstants';
import cx from "classnames";


const StrikeBrief = ({
	strikeData,
	priceNode,
	isPriceHlight,
}) => {

	const {
		market,
		isCall,
		isBuy
	} = strikeData;
	
	const marketIcon = MARKETS_ICONS[market].circled;

	return (
		<div className="StrikeBrief">
			<div className="StrikeBrief__icon">
				<img src={marketIcon} alt={`${market}`} />
			</div>
			<div className={cx("StrikeBrief__info-card", {
				positive: isBuy,
				negative: !isBuy,
			}
			)}>
				{isBuy ? "Buy" : "Sell"} {isCall ? "Call" : "Put"}
			</div>
			<div className={cx("StrikeBrief__price", isPriceHlight && "hlight")}>
				{priceNode}
			</div>
		</div>
	);
};

export default StrikeBrief;