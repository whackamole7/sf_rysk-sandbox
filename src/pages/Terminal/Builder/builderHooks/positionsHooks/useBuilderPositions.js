import useHegicPositions from "../../../../../hooks/networkHooks/positionsHooks/useHegicPositions";
import useLyraPositions from "../../../../../hooks/networkHooks/positionsHooks/useLyraPositions";
import useBuilderPositionsStructure from "./useBuilderPositionsStructure";
import { sumObjectValues } from './../../../../../utils/dataTypesUtils/objectUtils';
import { BUILDER_POSITION_ROLES } from "../../builderConstants";
import { calcPnlPercentage, sumGreeks } from "../../../../../utils/optionsUtils";
import { useContext } from "react";
import PendingPositionsStateContext, { removeMarketPendingPositions } from "../../builderContext/PendingPositionsStateContext";
import { isUndefined } from "swr/_internal";


const { PARENT_COMPLEX, PARENT_SIMPLE, CHILD } = BUILDER_POSITION_ROLES;


const useBuilderPositions = (callback) => {
	const pendingPositionsState = useContext(PendingPositionsStateContext);
	const callbacks = {
		Lyra: () => {
			removeMarketPendingPositions(pendingPositionsState, "Lyra");
		},
		Hegic: () => {
			removeMarketPendingPositions(pendingPositionsState, "Hegic");
		}
	}

	const marketsPositions = {
		Lyra: useLyraPositions(callbacks.Lyra),
		Hegic: useHegicPositions(callbacks.Hegic),
	}

	const positionsDataArr = Object.values(marketsPositions);
	const isPositionsLoading = positionsDataArr.every(
		data => isUndefined(data)
	);
	const isPositionsComplete = positionsDataArr.every(
		data => !isUndefined(data)
	);

	const positionsStructure = useBuilderPositionsStructure();

	if (!positionsStructure || isPositionsLoading) {
		return;
	}

	const builderPositionsDraft = positionsStructure.map(structure => {
		const { childPositionsStructure } = structure;
		const childPositions = [];

		const isSimplePosition = childPositionsStructure.length === 1;
		
		for (let i = 0; i < childPositionsStructure.length; i++) {
			const { id, market } = childPositionsStructure[i];

			const marketPositions = marketsPositions[market];

			if (!marketPositions) {
				return;
			}

			const childPositionIndex = marketPositions.findIndex(
				marketPosition => marketPosition.id === id
			);
			const childPosition = marketPositions[childPositionIndex];

			if (childPosition) {
				childPositions.push(childPosition);
				marketPositions[childPositionIndex].role = CHILD;
			}
		}
		
		if (childPositions.length) {
			if (isSimplePosition) {
				const position = { ...childPositions[0] };
				
				return {
					...structure,
					...position,
					role: PARENT_SIMPLE,
				}
			} else {
				const summedData = sumChildPositionsData(childPositions);
				const asset = childPositions[0].asset;

				return {
					...structure,
					childPositions,
					asset,
					...summedData,
					role: PARENT_COMPLEX
				};
			}
		}
	});

	const builderPositions = builderPositionsDraft.filter(position => !isUndefined(position));
	
	if (isPositionsComplete && callback) {
		callback();
	}

	const jointPositions = joinBuilderAndMarketsPositions(builderPositions, marketsPositions);

	return jointPositions;
}

const getTotalData = (marketsPositions) => {
	if (!marketsPositions.length) {
		return null;
	}
	
	const totalDataInit = {
		premium: 0n,
		collateral: {
			inUSDC: 0n
		},
		pnl: {
			inUSDC: 0n,
		},
		greeks: {},
		isTotal: true,
	}

	const totalData = marketsPositions.reduce((prev, cur) => {
		const result = sumObjectValues(prev, cur, ["premium", "pnl.inUSDC"]);
		result.greeks = sumGreeks(prev.greeks, cur.greeks);
		
		if (cur.collateral?.inUSDC) {
			result.collateral.inUSDC += cur.collateral.inUSDC;
		}

		return result;
	}, totalDataInit)

	totalData.pnl.inPercentage = calcPnlPercentage(
		totalData.pnl.inUSDC - totalData.premium,
		totalData.premium
	);

	return totalData;
}

const joinBuilderAndMarketsPositions = (builderPositions, marketsPositions) => {
	const jointPositions = [];
	
	const marketsPositionsArr = [];
	Object.values(marketsPositions).forEach(positions => {
		if (!positions) {
			return;
		}

		marketsPositionsArr.push(...positions);
	});
	
	const unusedMarketsPositions = marketsPositionsArr.filter(
		position => position.role !== CHILD
	);

	const formattedMarketsPositions = unusedMarketsPositions.map(position => {
		const { isCall, isSpread, isBuy } = position;
		const spreadName = isCall ? "Bull" : "Bear";
		
		const strategy = (
			`${isSpread ? spreadName : (isBuy ? "Long" : "Short")} ${isCall ? "Call" : "Put"} ${isSpread ? "Spread" : ""}`
		).trim();
		
		const formattedPosition = {
			strategy,
			...position,
		}

		return formattedPosition;
	});
	
	jointPositions.push(
		...builderPositions,
		...formattedMarketsPositions,
	);

	const totalData = getTotalData(marketsPositionsArr);
	if (totalData) {
		jointPositions.push(totalData);
	}

	return jointPositions;
}

const sumChildPositionsData = (childPositions) => {
	const summedData = childPositions.reduce((sum, position) => {
		const result = sumObjectValues(sum, position, [
			"amount", "premium", "pnl.inUSDC"
		]);
		
		result.greeks = sumGreeks(sum.greeks, position.greeks);

		result.collaterals = position.collateral
			? [...sum.collaterals, position.collateral]
			: sum.collaterals;
		
		return result;
	}, {
		amount: 0n,
		premium: 0n,
		collaterals: [],
		pnl: { inUSDC: 0n },
		greeks: { delta: 0, vega: 0, gamma: 0, theta: 0, rho: 0 }
	});

	summedData.pnl.inPercentage = calcPnlPercentage(
		summedData.pnl.inUSDC - summedData.premium,
		summedData.premium
	);

	summedData.expiry = childPositions[0].expiry;

	return summedData;
}


export default useBuilderPositions;