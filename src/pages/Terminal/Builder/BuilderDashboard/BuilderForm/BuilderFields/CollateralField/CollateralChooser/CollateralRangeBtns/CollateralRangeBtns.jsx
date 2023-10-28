import React from 'react';
import { formatBigInt, formatBigIntFree } from '../../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import './CollateralRangeBtns.scss';

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
				const formatFn = isBase ? formatBigIntFree : formatBigInt;
				const formattedValue = formatFn(value, isBase ? 3 : 0);
				const isFirstBtn = i === 0;
				
				return (
					<React.Fragment key={i}>
						<button
							key={i}
							onClick={() => handleClick(formattedValue)}
						>
							{!isBase ? "$" : ""}{formattedValue}
						</button>
						{isFirstBtn ? "—" : ""}
					</React.Fragment>
				)
			})}
		</div>
	);
};

export default CollateralRangeBtns;