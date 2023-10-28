import useInput from '../../../../../../../../hooks/useInput';
import './CollateralChooser.scss';
import Selector from '../../../../../../../../components/UI/Selector/Selector';
import Currency from '../../../../../../../../components/common/Currency/Currency';
import { useEffect, useState } from 'react';
import cx from "classnames";
import { deformatNumberFromInputString, formatNumberToInputString } from '../../../../../../../../utils/dataTypesUtils/numberUtils';
import { bigIntFromNumber } from '../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import { useDebounce } from 'react-use';
import InnerWarning from '../../../../../../../../components/UI/InnerWarning/InnerWarning';
import { awaitLoading } from '../../../../../../../../utils/commonUtils';
import CollateralLiqPrice from './CollateralLiqPrice/CollateralLiqPrice';
import CollateralRangeBtns from './CollateralRangeBtns/CollateralRangeBtns';
import CollateralSlider from './CollateralSlider/CollateralSlider';
import { DEBOUNCE_DELAY } from '../../../../../../../../environment/constants/commonConstants';


const CollateralChooser = (props) => {
	const {
		isInLastHalf,
		getCollateralData,
		collateralData,
		setCollateralData,
		collateralTokens,
		chosenStrike,
		updateTriggers,
		resetTriggers,
	} = props;

	const [collateralAmountStr, setCollateralAmountStr] = useState("");
	const [collateralToken, setCollateralToken] = useState(collateralTokens[0]);
	const [isCollateralDataLoading, setIsCollateralDataLoading] = useState(false);
	const [isLiqPriceLoading, setIsLiqPriceLoading] = useState(false);

	const reset = () => {
		setCollateralAmountStr("");
		setCollateralToken(collateralTokens[0]);
		setCollateralData(null);
	}

	const resetWithTokenSaved = () => {
		setCollateralAmountStr("");
		setCollateralData(null);
	}

	useEffect(() => {
		reset();
	}, resetTriggers);

	useEffect(() => {
		if (chosenStrike) {
			setIsCollateralDataLoading(true);
			
			resetWithTokenSaved();
			updateCollateralData(true);
		}
	}, [chosenStrike, collateralToken]);


	const updateCollateralData = (isInitial) => {
		let collateralAmountBigInt;

		if (!isInitial && collateralAmountStr) {
			const collateralAmount = deformatNumberFromInputString(collateralAmountStr);
			collateralAmountBigInt = bigIntFromNumber(collateralAmount);
		}

			getCollateralData(collateralToken, collateralAmountBigInt)
				.then(data => {
					setCollateralData(data);
					
					setIsCollateralDataLoading(false);
					setIsLiqPriceLoading(false);
				});
	}
	
	useDebounce(() => {
		if (!isCollateralDataLoading) {
			setIsLiqPriceLoading(true);
			updateCollateralData();
		}
	}, DEBOUNCE_DELAY, [collateralAmountStr, ...updateTriggers]);
	
	
	const input = useInput(
		[collateralAmountStr, setCollateralAmountStr],
		{ placeholder: "0" }
	);

	const tokenOptions = collateralTokens.map(token => {
		return {
			value: token,
			label: (
				<Currency symbol={token} isHlight={true} >
					{token}
				</Currency>
			),
		}
	});

	const cls = cx(input.hasFocus && "hlight");

	return (
		<div className={cx("CollateralChooser", cls)}>
			{chosenStrike
				? <>
						{collateralData && (
							<CollateralLiqPrice
								liqPrice={collateralData.liquidationPrice}
								isLiqPriceLoading={isLiqPriceLoading}
								isInLastHalf={isInLastHalf}
							/>
						)}
						{awaitLoading(
							<div className="CollateralChooser__input-container">
								<div className="CollateralChooser__input">
									{input.node}
								</div>

								{collateralData && (
									<CollateralRangeBtns
										min={collateralData.min}
										max={collateralData.max}
										collateralData={collateralData}
										handleClick={(value) => {
											setCollateralAmountStr(value);
										}}
									/>
								)}

								{collateralData && (
									<CollateralSlider
										collateralData={collateralData}
										collateralAmountStr={collateralAmountStr}
										onChange={(value) => {
											const formattedValue = formatNumberToInputString(value);
											setCollateralAmountStr(formattedValue);
										}}
									/>
								)}
							</div>,
							isCollateralDataLoading
						)}
						

						<div className="CollateralChooser__token-selector">
							<Selector
								key={`CollateralChooser__token-selector_${collateralToken}`}
								options={tokenOptions}
								defaultValue={collateralToken}
								isDisabled={tokenOptions.length === 1}
								onChange={opt => {
									setCollateralToken(opt.value);
								}}
							/>
						</div>
						
					</>
				: <InnerWarning>
						Strike required
					</InnerWarning>}
		</div>
	);
};

export default CollateralChooser;