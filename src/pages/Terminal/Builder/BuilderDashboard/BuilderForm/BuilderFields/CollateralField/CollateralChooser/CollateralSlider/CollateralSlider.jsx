import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './CollateralSlider.scss';
import { numberFromBigInt } from '../../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import { DEFAULT_DECIMALS } from '../../../../../../../../../environment/constants/tokensConstants';
import { deformatNumberFromInputString } from '../../../../../../../../../utils/dataTypesUtils/numberUtils';

const CollateralSlider = ({
	collateralData,
	collateralAmountStr,
	onChange
}) => {

	const { isBase } = collateralData;

	const valueDecimals = isBase ? 1 : 0;
	const minValue = numberFromBigInt(collateralData.min, DEFAULT_DECIMALS, valueDecimals);
	const maxValue = numberFromBigInt(collateralData.max, DEFAULT_DECIMALS, valueDecimals);

	const value = deformatNumberFromInputString(collateralAmountStr);

	const step = isBase ? 0.01 : 1;

	return (
		<div className="CollateralSlider">
			<Slider
				defaultValue={0}
				value={value}
				min={minValue}
				max={maxValue}
				step={step}
				onChange={onChange}
			/>
		</div>
	);
};

export default CollateralSlider;