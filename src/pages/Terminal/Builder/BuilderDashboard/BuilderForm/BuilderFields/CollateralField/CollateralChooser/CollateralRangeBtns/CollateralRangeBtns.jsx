import React from 'react';
import { formatTokenAmount, numberFromBigInt } from '../../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import './CollateralRangeBtns.scss';
import { roundNumber, separateThousands } from '../../../../../../../../../utils/dataTypesUtils/numberUtils';
import { INPUT_MAX_DECIMALS } from '../../../../../../../../../environment/constants/tokensConstants';

const CollateralRangeBtns = ({
	min,
	max,
	collateralData,
	handleClick
}) => {
	

	return (
		<div className="CollateralRangeBtns">
			{[min, max].map((value, i) => {
				const isBase = collateralData.isBase;
				const formattedValue = separateThousands(
					roundNumber(numberFromBigInt(value), INPUT_MAX_DECIMALS)
				);
				const displayValue = formatTokenAmount(
					value,
					collateralData.marketToken.isStable
				)
				const isFirstBtn = i === 0;
				
				return (
					<React.Fragment key={i}>
						<button
							key={i}
							onClick={() => handleClick(formattedValue)}
						>
							{!isBase ? "$" : ""}{displayValue}
						</button>
						{isFirstBtn ? "—" : ""}
					</React.Fragment>
				)
			})}
		</div>
	);
};

export default CollateralRangeBtns;