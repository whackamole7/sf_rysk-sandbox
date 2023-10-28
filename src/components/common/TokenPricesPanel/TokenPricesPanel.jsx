import './TokenPricesPanel.scss';
import icon_graph from '../../../img/common/graph.svg';
import Currency from '../Currency/Currency';
import { formatBigInt } from '../../../utils/dataTypesUtils/bigIntUtils';
import useTokenPrices from '../../../hooks/networkHooks/tokenHooks/tokenPrices/useTokenPrices';
import { ASSETS } from '../../../environment/constants/tokensConstants';

const TokenPricesPanel = () => {
	const pricesData = useTokenPrices();

	return (
		<div className="TokenPricesPanel">
			<div className="TokenPricesPanel__icon">
				<img src={icon_graph} alt="Graph icon" />
			</div>
			<div className="TokenPricesPanel__items">
				{ASSETS.map(asset => {
					if (!pricesData) {
						return null;
					}

					const priceBigInt = pricesData[asset];
					const priceFormatted = formatBigInt(
						priceBigInt,
						undefined,
						undefined,
						true
					);
					
					return (
						<div className="TokenPricesPanel__item" key={asset}>
							<Currency isHlight={true} symbol={asset} >
								<span>
									${priceFormatted}
								</span>
							</Currency>
						</div>
					)
				})}
			</div>
		</div>
	);
};

export default TokenPricesPanel;