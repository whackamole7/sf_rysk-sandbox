import { useEffect, useState } from 'react';
import { bigIntFromNumber } from '../../../../../../../utils/dataTypesUtils/bigIntUtils';
import './BuilderCost.scss';
import BuilderCostItems from './BuilderCostItems/BuilderCostItems';
import { deformatNumberFromInputString } from '../../../../../../../utils/dataTypesUtils/numberUtils';
import CostDecompositionTooltips from './CostDecompositionTooltips/CostDecompositionTooltips';
import { getHasChosenStrike, getShouldSwap, getStrategyHasBuy, getStrategyHasSell, overlayDecompositions } from '../../../../builderUtils';
import cx from "classnames";
import { useDebounce } from 'react-use';
import { BUILDER_STRATEGIES_CONFIG } from '../../../../builderConstants';
import { DEBOUNCE_DELAY } from '../../../../../../../environment/constants/commonConstants';
import SwapSlippageField from './SwapSlippageField/SwapSlippageField';


const BuilderCost = ({
	strategy,
	amountStr,
	chosenStrikesState,
	collateralDataArrState,
	youPayState,
	swapSlippageState,
}) => {

	const strategyStructure = BUILDER_STRATEGIES_CONFIG[strategy].structure;
	const hasSell = getStrategyHasSell(strategyStructure);
	const hasBuy = getStrategyHasBuy(strategyStructure);

	const [youPay, setYouPay] = youPayState;
	const [chosenStrikes, setChosenStrikes] = chosenStrikesState;
	const [collateralDataArr, setCollateralDataArr] = collateralDataArrState;
	
	const [maxCost, setMaxCost] = useState(null);
	const [minReceived, setMinReceived] = useState(null);
	const [netCost, setNetCost] = useState(null);
	const [collateralCost, setCollateralCost] = useState(null);
	
	const hasChosenStrike = getHasChosenStrike(chosenStrikes);
	const hasCollateralData = Boolean(collateralDataArr.find(data => data));

	const shouldSwap = getShouldSwap(youPay);

	const resetChosenStrikeAndCollateral = (i) => {
		chosenStrikes[i] = null;
		collateralDataArr[i] = null;
		setChosenStrikes([...chosenStrikes]);
		setCollateralDataArr([...collateralDataArr]);
	}


	const costHelpers = {
		sum: (costs) => {
			const summedCosts = costs.reduce((accum, cur, i) => {
				if (i === 0) {
					return {
						inUSDC: cur.inUSDC,
						decomposition: [cur]
					};
				}

				const decomposition = accum.decomposition;
				decomposition[i] = {
					marketToken: cur.marketToken,
					inMarketToken: cur.inMarketToken,
					inUSDC: cur.inUSDC,
				};
				
				return {
					inUSDC: accum.inUSDC + cur.inUSDC,
					decomposition,
				}
			}, costs[0]);
	
			return summedCosts;
		},

		separateBuyFromSell: (costs) => {
			const buyCosts = [];
			const sellCosts = [];
			
			costs.forEach(cost => {
				if (!cost) {
					return;
				}
				
				if (cost.isBuy) {
					buyCosts.push(cost);
				} else {
					sellCosts.push(cost);
				}
			});
	
			return {
				buyCosts,
				sellCosts,
			};
		},

		getArgsForHandler: (costType) => {
			const { reset } = costResetter[costType];
			const { isAllowed, update } = costUpdater[costType];

			return [reset, isAllowed, update];
		}
	}
	
	const costResetter = {
		collateral: {
			reset: () => {
				setCollateralCost({
					inUSDC: 0n,
				});
			}
		},
		trade: {
			reset: () => {
				setMaxCost(null);
				setMinReceived(null);
				setNetCost(null);
			}
		},
		youPay: {
			reset: () => {
				setYouPay(null);
			}
		}
	}

	const costCalculator = {
		collateral: {
			calc: () => {
				const collateralCosts = collateralDataArr
					.filter(data => data);
		
				const sum = costHelpers.sum(collateralCosts);
		
				return sum;
			}
		},

		trade: {
			calc: () => {
				if (!amountStr) {
					return;
				}
				
				const costsPromises = [];
				const amountBigInt = bigIntFromNumber(
					deformatNumberFromInputString(amountStr)
				);

				chosenStrikes.forEach((chosenStrike, i) => {
					if (!chosenStrike) {
						return;
					}
					
					costsPromises.push(
						chosenStrike.utils.calcPremium(amountBigInt)
							.then(data => {
								if (!data) {
									resetChosenStrikeAndCollateral(i);

									return null;
								}

								chosenStrike.premiumData = data;
								chosenStrike.amount = amountBigInt;
								data.isBuy = chosenStrike.isBuy;
								
								return data;
							})
					);
				});

				return (
					Promise.all(costsPromises)
						.then(costs => {
							const { buyCosts, sellCosts } = costHelpers.separateBuyFromSell(costs);
							
							return {
								maxCost: costHelpers.sum(buyCosts),
								minReceived: costHelpers.sum(sellCosts)
							};
						})
				)
			}
		},

		youPay: {
			calc: () => {
				let result;
				
				if (!hasSell) {
					result = {
						inUSDC: maxCost.inUSDC,
						decomposition: maxCost.decomposition,
					};
				} else {
					if (collateralCost?.inUSDC) {
						result = {
							inUSDC: collateralCost.inUSDC + (maxCost?.inUSDC ?? 0n),
							decomposition: overlayDecompositions(
								strategyStructure,
								maxCost?.decomposition,
								collateralCost.decomposition
							),
							shouldSwap
						};
					}
				}

				return result;
			}
		}
	}

	const costUpdater = {
		collateral: {
			triggers: [collateralDataArr],
			isAllowed: hasCollateralData && hasChosenStrike,
			update: () => {
				const collateralCost = costCalculator.collateral.calc();
				setCollateralCost(collateralCost);
			}
		},

		trade: {
			triggers: [chosenStrikes],
			debouncedTriggers: [amountStr],
			isAllowed: hasChosenStrike,
			update: () => {
				costCalculator.trade.calc()
					.then(data => {
						const { maxCost, minReceived } = data;
						setMaxCost(maxCost);
						setMinReceived(minReceived);

						const netCost = {
							inUSDC: (minReceived?.inUSDC ?? 0n) - (maxCost?.inUSDC ?? 0n),
						};

						setNetCost(netCost);
					})
			}
		},

		youPay: {
			triggers: [netCost, collateralCost],
			isAllowed: Boolean(hasSell
				? (netCost?.inUSDC && collateralCost?.inUSDC)
				: (netCost?.inUSDC)
			),
			update: () => {
				const youPay = costCalculator.youPay.calc();
				setYouPay(youPay);
			}
		}
	}

	const handleCostChange = (reset, isAllowed, update) => {
		reset();

		if (isAllowed) {
			update();
		}
	}

	// todo: make simple
	const COST_TYPES = Object.keys(costUpdater);
	COST_TYPES.forEach(type => {
		const handleFn = () => {
			handleCostChange(...costHelpers.getArgsForHandler(type));
		}

		const triggers = [...costUpdater[type].triggers];
		const debouncedTriggers = 
			costUpdater[type].debouncedTriggers && [
				...costUpdater[type].debouncedTriggers
			];

		if (debouncedTriggers) {
			useDebounce(handleFn, DEBOUNCE_DELAY, debouncedTriggers);
		}
		
		useEffect(handleFn, triggers);
	});

	return (
		<div className={cx("BuilderCost", hasSell && "has-sell")}>
			<div className="BuilderCost__content">
				<BuilderCostItems
					hasBuy={hasBuy}
					hasSell={hasSell}
					hasChosenStrike={hasChosenStrike}
					maxCost={maxCost}
					minReceived={minReceived}
					netCost={netCost}
					collateralCost={collateralCost}
				/>

				{shouldSwap && (
					<SwapSlippageField
						swapSlippageState={swapSlippageState}
					/>
				)}
			</div>

			<CostDecompositionTooltips
				maxCost={maxCost}
				minReceived={minReceived}
				collateralCost={collateralCost}
			/>
		</div>
	);
};

export default BuilderCost;