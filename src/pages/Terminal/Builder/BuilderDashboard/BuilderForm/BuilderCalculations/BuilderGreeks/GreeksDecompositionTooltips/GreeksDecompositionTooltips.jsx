import './GreeksDecompositionTooltips.scss';
import TooltipDecomposition from '../../../../../../../../components/UI/TooltipCustom/TooltipDecomposition/TooltipDecomposition';
import { capitalizeFirstLetter } from '../../../../../../../../utils/commonUtils';
import { GREEKS } from './../../../../../../../../environment/constants/optionsConstants';


const GreeksDecompositionTooltips = ({
	decompositionData
}) => {

	return (
		<div className="GreeksDecompositionTooltips">
			{GREEKS.map(greek => {
				const decompositionArr = decompositionData[greek];


				if (!decompositionArr || !decompositionArr.length) {
					return null;
				}
				
				const greekTitle = capitalizeFirstLetter(greek);
				const id = `BuilderForm_${greekTitle}DecompositionTooltip`;

				return (
					<TooltipDecomposition
						key={id}
						id={id}
						decompositionArr={decompositionArr}
					/>
				)
			})}
		</div>
	);
};

export default GreeksDecompositionTooltips;