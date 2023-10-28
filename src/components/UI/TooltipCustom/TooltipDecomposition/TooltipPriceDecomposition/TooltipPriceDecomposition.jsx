import { formatBigInt, formatTokenAmount } from '../../../../../utils/dataTypesUtils/bigIntUtils';
import Currency from '../../../../common/Currency/Currency';
import React from 'react';
import TooltipDecomposition from './../TooltipDecomposition';


const TooltipPriceDecomposition = ({
	id,
	priceDecompositionArr
}) => {

	const convertPricesDataToDecompositionData = () => {
		const decompositionArr = priceDecompositionArr.map((pricesData) => {
			const isTokenStable = pricesData.marketToken.isStable;
			const nameNode =  <Currency symbol={pricesData.marketToken.symbol} isHlight={true}>
													{formatTokenAmount(pricesData.inMarketToken, isTokenStable)}
												</Currency>
			const valueNode = `$${formatBigInt(pricesData.inUSDC, 2)}`;

			return {
				nameNode,
				valueNode
			};
		})

		return decompositionArr;
	}

	const decompositionArr = convertPricesDataToDecompositionData();

	return (
		<TooltipDecomposition
			id={id}
			decompositionArr={decompositionArr}
		/>
	);
};

export default TooltipPriceDecomposition;