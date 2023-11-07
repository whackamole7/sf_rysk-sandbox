import { ethers } from "ethers";
import { getAlchemyProvider } from "../../../network/providers";
import { getContractData } from "../../../network/contracts/contractsData";
import { getAreTokensDifferent } from './../../../utils/tokenUtils';



export const getIsCall = (structureKey) => {
	return Math.abs(structureKey) === 1;
}

export const getIsBuy = (structureKey) => {
	return structureKey > 0;
}

export const getStrategyHasSell = (strategyStructure) => {
	return Boolean(
		strategyStructure.find(structureKey => !getIsBuy(structureKey))
	);
}
export const getStrategyHasBuy = (strategyStructure) => {
	return Boolean(
		strategyStructure.find(structureKey => getIsBuy(structureKey))
	);
}

export const getHasChosenStrike = (chosenStrikes) => {
	return Boolean(
		chosenStrikes.find(strike => strike)
	);
}

export const decodeStrikeKey = (strikeKey) => {
	const [, strike] = strikeKey.split("_");
	return Number(strike);
}


export const getCollateralTokens = (structureKey, strategy, asset) => {
	let collateralTokens;

	const wrappedToken = `W${asset}`;
	const strategyType = strategy.split(" ")[0];
	const isCall = getIsCall(structureKey);

	if (!isCall || strategyType === "Short") {
		collateralTokens = ["USDC.e"];
	} else if (strategyType === "Covered") {
		collateralTokens = [wrappedToken];
	} else if (strategyType === "Iron") {
		collateralTokens = ["USDC.e", wrappedToken];
	}

	return collateralTokens;
}

export const getEchoedStrikesIds = (strategy) => {
	const isStraddle = strategy.includes("Straddle");
	const isIronButtefly = strategy === "Iron Butterfly";

	if (isStraddle) {
		return [0, 1];
	}
	if (isIronButtefly) {
		return [1, 2];
	}
}

export const echoStrikeChoice = (
	dependentStrikeMarketsData,
	sourceMarket,
) => {
	if (!dependentStrikeMarketsData?.[0].market) {
		return;
	}
	
	const hasMultipleMarkets = dependentStrikeMarketsData.length > 1;
	if (hasMultipleMarkets) {
		const sameMarketStrikeData =  dependentStrikeMarketsData.find(
			data => data.market === sourceMarket
		);

		if (sameMarketStrikeData) {
			return sameMarketStrikeData;
		}
	}

	return dependentStrikeMarketsData[0];
}



export const getEncodingContract = (chainId, protocolName) => {
	const encodingContract = new ethers.Contract(
		...getContractData(chainId, `TxBuilderOpen_${protocolName}`),
		getAlchemyProvider(chainId)
	);

	return encodingContract;
}

export const getTxBuilderMarketsContracts = (chainId) => {
	const TxBuilderOpen_Hegic = new ethers.Contract(
		...getContractData(chainId, "TxBuilderOpen_Hegic"),
		getAlchemyProvider(chainId)
	);
	
	const TxBuilderOpen_Lyra_BTC = new ethers.Contract(
		...getContractData(chainId, "TxBuilderOpen_Lyra_BTC"),
		getAlchemyProvider(chainId)
	);

	const TxBuilderOpen_Lyra_ETH = new ethers.Contract(
		...getContractData(chainId, "TxBuilderOpen_Lyra_ETH"),
		getAlchemyProvider(chainId)
	);


	return {
		Hegic: TxBuilderOpen_Hegic,
		Lyra_ETH: TxBuilderOpen_Lyra_ETH,
		Lyra_BTC: TxBuilderOpen_Lyra_BTC
	}
}


export const overlayDecompositions = (
	strategyStructure,
	maxCostDecomposition,
	collateralDecomposition
) => {
	if (!maxCostDecomposition) {
		return collateralDecomposition;
	}
	
	let buyIndex = 0;
	let sellIndex = 0;
	
	const overlayedDecomposition = strategyStructure.map(structureKey => {
		const isBuy = getIsBuy(structureKey);

		if (isBuy) {
			return maxCostDecomposition[buyIndex++];
		} else {
			return collateralDecomposition[sellIndex++];
		}
	})

	return overlayedDecomposition;
}

export const getHasSufficientStrikes = (strikesData) => {
	const strikes = Object.keys(strikesData);

	if (!strikes) {
		return false;
	}
	
	const sufficientStrike = strikes.find(strike => {
		const strikeMarkets = strikesData[strike];
		
		return !strikeMarkets[0].isAbsent;
	})

	return Boolean(sufficientStrike);
}


export const getShouldSwap = (youPay, newPaymentToken) => {
	if (!youPay?.decomposition?.length) {
		return false;
	}
	
	const shouldSwap = Boolean(
		youPay.decomposition.find(decompositionItem => {
			if (!decompositionItem) {
				return;
			}
			
			const marketToken = decompositionItem.marketToken;
			const paymentToken = newPaymentToken ?? youPay.paymentToken;

			if (!marketToken || !paymentToken) {
				return false;
			}
	
			return getAreTokensDifferent(marketToken, paymentToken);
		})
	);

	return shouldSwap;
}