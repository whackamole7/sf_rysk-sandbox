import cx from "classnames";
import StrikeBrief from '../../../../../../../../../components/common/StrikeBrief/StrikeBrief';
import Table from '../../../../../../../../../components/common/Table/Table';
import { bigIntFromNumber, formatBigInt } from "../../../../../../../../../utils/dataTypesUtils/bigIntUtils";
import './StrikeInfoBox.scss';
import { useEffect, useState } from "react";
import { awaitLoadingDynamic, getMutedNode } from "../../../../../../../../../utils/commonUtils";
import { deformatNumberFromInputString } from "../../../../../../../../../utils/dataTypesUtils/numberUtils";
import { isUndefined } from "swr/_internal";


const StrikeInfoBox = (props) => {
	const {
		id,
		amountStr,
		strikeMarketsDataArr,
		chosenStrikeData,
		setChosenStrikeData,
		isOpen,
		close,
	} = props;


	const [premiums, setPremiums] = useState([]);

	const updateMarketsPremiums = () => {
		strikeMarketsDataArr.forEach((strikeData, i) => {
			const amountBigInt = bigIntFromNumber(
				deformatNumberFromInputString(amountStr)
			);

			strikeData.utils.calcPremium(amountBigInt)
				.then(premiumData => {
					premiums[i] = premiumData;
					setPremiums([...premiums]);
				});
		})
	}

	useEffect(() => {
		setPremiums([]);

		if (strikeMarketsDataArr) {
			updateMarketsPremiums();
		}
	}, [strikeMarketsDataArr, amountStr]);

	
	if (!strikeMarketsDataArr) {
		return null;
	}


	const CELL_X_PADDING = 23;
	const GREEK_CELL_WIDTH = 80;
	const GREEK_INNER_WIDTH = GREEK_CELL_WIDTH - CELL_X_PADDING;
	const MARKET_CELL_WIDTH = 180;
	const MARKET_INNER_WIDTH = MARKET_CELL_WIDTH - CELL_X_PADDING;

	return (
		<div
			className={cx(
				"StrikeInfoBox",
				isOpen && "open"
			)}
			style={{ zIndex: (9 - id*2) }}
		>
			<Table onClick={(e) => e.stopPropagation()}>
				<thead>
					<tr>
						<th>
							<div style={{width: MARKET_INNER_WIDTH}}>
								Market
							</div>
						</th>
						<th>
							<div style={{width: GREEK_INNER_WIDTH}}>
								Source
							</div>
						</th>
						<th>
							<div style={{width: GREEK_INNER_WIDTH}}>
								Delta
							</div>
						</th>
						<th>
							<div style={{width: GREEK_INNER_WIDTH}}>
								Vega
							</div>
						</th>
						<th>
							<div style={{width: GREEK_INNER_WIDTH}}>
								Gamma
							</div>
						</th>
						<th>
							<div style={{width: GREEK_INNER_WIDTH}}>
								Theta
							</div>
						</th>
						<th>
							<div style={{width: GREEK_INNER_WIDTH}}>
								Rho
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{strikeMarketsDataArr.map((strikeData, i) => {
						const { greeks } = strikeData;

						const premiumData = premiums[i];
						const isDisabled = !premiumData || premiumData.isDisabled;

						const isChosen = strikeData === chosenStrikeData;

						return (
							<tr
								key={strikeData.market}
								className={cx(
									"StrikeInfoBox__strike-option",
									isDisabled && "disabled",
									isChosen && "chosen"
								)}
							>
								<td>
									<button
										className="StrikeInfoBox__strike-option-overlay-btn"
										onClick={() => {
											setChosenStrikeData(strikeData);
											close();
										}}
										disabled={isDisabled}
									/>
									<StrikeBrief
										strikeData={strikeData}
										priceNode={awaitLoadingDynamic(
											() => {
												if (premiumData === null) {
													return getMutedNode(`No liquidity`, true);
												}
												return `$${formatBigInt(premiumData.inUSDC)}`;
											},
											isUndefined(premiumData)
										)}
										isPriceHlight={true}
									/>
								</td>
								<td>AMM</td>
								<td>{greeks.delta}</td>
								<td>{greeks.vega}</td>
								<td>{greeks.gamma}</td>
								<td>{greeks.theta}</td>
								<td>{greeks.rho}</td>
							</tr>
						)
					})}
					
				</tbody>
			</Table>
		</div>
	);
};

export default StrikeInfoBox;