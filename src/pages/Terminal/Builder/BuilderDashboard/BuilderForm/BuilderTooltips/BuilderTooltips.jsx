
import StrikeTooltip from './StrikeTooltip/StrikeTooltip';
import WhenPurchaseTooltip from './WhenPurchaseTooltip/WhenPurchaseTooltip';
import CollateralTooltip from './CollateralTooltip/CollateralTooltip';
import MaxCostTooltip from './MaxCostTooltip/MaxCostTooltip';
import MinReceivedTooltip from './MinReceivedTooltip/MinReceivedTooltip';
import YouPayWarningTooltip from './YouPayWarningTooltip/YouPayWarningTooltip';
import PremiumTooltip from './PremiumTooltip/PremiumTooltip';

const BuilderTooltips = ({
	strategy
}) => {


	return (
		<div className="BuilderTooltips">
			<StrikeTooltip />
			<WhenPurchaseTooltip strategy={strategy} />
			<CollateralTooltip />
			<PremiumTooltip />
			
			<MaxCostTooltip />
			<MinReceivedTooltip />

			<YouPayWarningTooltip />
		</div>
	);
};

export default BuilderTooltips;