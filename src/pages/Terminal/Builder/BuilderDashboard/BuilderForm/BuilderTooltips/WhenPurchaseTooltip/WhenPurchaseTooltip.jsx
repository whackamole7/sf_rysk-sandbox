import TooltipCustom from '../../../../../../../components/UI/TooltipCustom/TooltipCustom';
import { BUILDER_STRATEGIES_CONFIG, OUTLOOK_COLORS } from '../../../../builderConstants';
import './WhenPurchaseTooltip.scss';

const WhenPurchaseTooltip = ({
	strategy
}) => {

	const strategyConfig = BUILDER_STRATEGIES_CONFIG[strategy];

	const {
		outlooks,
		profit,
		loss,
		description,
	} = strategyConfig.stats;
	

	return (
		<TooltipCustom
			className="WhenPurchaseTooltip"
			id="BuilderForm_WhenPurchaseTooltip"
			place={"bottom-end"}
		>
			<div className="WhenPurchaseTooltip__header">
				<h2 className="WhenPurchaseTooltip__title">
					{strategy}
				</h2>
				
				<div className="WhenPurchaseTooltip__outlooks">
					{outlooks.map(outlook => {
						const outlookColor = OUTLOOK_COLORS[outlook];
						
						return (
							<div
								key={outlook}
								className="WhenPurchaseTooltip__outlook"
								style={{ color: outlookColor }}
							>
								{outlook}
							</div>
						)
					})}
				</div>
			</div>
			
			<div className="WhenPurchaseTooltip__body">
				<h3 className="WhenPurchaseTooltip__subtitle">
					When purchase
				</h3>

				<p className="WhenPurchaseTooltip__description">
					{description}
				</p>

				<div className="WhenPurchaseTooltip__stats">
					{[profit, loss].map((stat, i) => {
						const name = i === 0 ? "Profit" : "Loss";
						
						return (
							<div className="WhenPurchaseTooltip__stats-item" key={`${name}_${stat}`}>
								<div className="WhenPurchaseTooltip__stats-item-name">
									{name}
								</div>
								<div className="WhenPurchaseTooltip__stats-item-value">
									{stat}
								</div>
							</div>
						)
					})}
					
				</div>
			</div>
		</TooltipCustom>
	);
};

export default WhenPurchaseTooltip;