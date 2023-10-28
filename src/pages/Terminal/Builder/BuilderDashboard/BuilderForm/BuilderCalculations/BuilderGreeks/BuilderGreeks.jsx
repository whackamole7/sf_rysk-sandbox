import { limitDecimals, separateThousands } from '../../../../../../../utils/dataTypesUtils/numberUtils';
import './BuilderGreeks.scss';
import cx from "classnames";
import { GREEKS } from './../../../../../../../environment/constants/optionsConstants';
import GreeksDecompositionTooltips from './GreeksDecompositionTooltips/GreeksDecompositionTooltips';
import StrikeBrief from './../../../../../../../components/common/StrikeBrief/StrikeBrief';
import { capitalizeFirstLetter } from '../../../../../../../utils/commonUtils';
import Accordion from './../../../../../../../components/UI/Accordion/Accordion';
import useIsMobile from './../../../../../../../hooks/windowDimensionsHooks/useIsMobile';


const BuilderGreeks = ({
	chosenStrikes
}) => {

	const decompositionData = {};
	GREEKS.forEach(greek => {
		decompositionData[greek] = [];
	});

	const addToDecompositionData = (chosenStrike, greek) => {
		const greekValue = chosenStrike.greeks[greek];
		
		const decompositionItem = {
			nameNode: <StrikeBrief
									strikeData={chosenStrike}
									priceNode={`$${separateThousands(chosenStrike.strike)}`}
								/>,
			valueNode: greekValue,
		};

		decompositionData[greek].push(decompositionItem);
	}

	const renderGreeks = () => {
		return (
			<div className="BuilderCalculations__items">
				{GREEKS.map(greek => {
					const greekTitle = capitalizeFirstLetter(greek);
					
					const greekSum = chosenStrikes.reduce((sum, strikeData) => {
						if (!strikeData) {
							return sum;
						}

						addToDecompositionData(strikeData, greek);
						
						const greekValue = strikeData.greeks[greek];
						return sum + greekValue;
					}, 0);

					
					return (
						<div className="BuilderCalculations__item" key={greek}>
							<div className="BuilderCalculations__item-name">
								{greekTitle}
							</div>

							<div
								className={cx("BuilderCalculations__item-value", chosenStrikes.length && "tip")}
								data-tooltip-id={`BuilderForm_${greekTitle}DecompositionTooltip`}
							>
								{limitDecimals(greekSum, 3)}
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	const renderGreeksInAccordion = () => {
		return (
			<Accordion
				renderHeader={
					({ state }) => `${state.isEnter ? "Hide" : "Show"} greeks`
				}
			>
				{renderGreeks()}
			</Accordion>
		)
	}

	const mobileFrontier = 576;
	const isMobile = useIsMobile(mobileFrontier);

	
	return (
		<div className="BuilderGreeks">
			{isMobile
				? renderGreeksInAccordion()
				: renderGreeks()}

			<GreeksDecompositionTooltips
				decompositionData={decompositionData}
			/>
		</div>
	);
};

export default BuilderGreeks;