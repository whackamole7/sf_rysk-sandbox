import useGodEye from "../../../../environment/contextHooks/useGodEye/useGodEye";
import { getStrategyHasSell } from './../builderUtils';


const useBuilderFormButtonHandler = (
	amountStr,
	strategyStructure,
	chosenStrikes,
	collateralDataArr,
	paymentAmount,
	balanceAmount,
) => {
	
	const { isConnected } = useGodEye();

	const hasSell = getStrategyHasSell(strategyStructure);
		
	const getError = () => {
		if (!amountStr) {
			return `Enter Amount`;
		}
		
		const hasEmptyStrike = Boolean(
			chosenStrikes.length !== strategyStructure.length || 
			!chosenStrikes.every(data => data)
		);

		if (hasEmptyStrike) {
			return `Fill out the Strike fields`;
		}

		const hasEmptyCollateral = Boolean(
			collateralDataArr.find(data => data && data.inMarketToken === 0n)
		);
		
		if (hasSell && hasEmptyCollateral) {
			return `Fill out the Collateral fields`;
		}
		
		if (!paymentAmount) {
			return `Please, wait...`;
		}

		if (paymentAmount > balanceAmount) {
			return `Insufficient balance`;
		}
	}
	
	const getIsBtnEnabled = () => {
		if (!isConnected) {
			return true;
		}

		return !getError();
	}

	const getBtnText = () => {
		const btnDefaultText = "Buy Strategy";
		
		if (!isConnected) {
			return `Connect wallet`;
		}

		return getError() ?? btnDefaultText;
	}

	return {
		getError,
		getIsBtnEnabled,
		getBtnText,
	}
}


export default useBuilderFormButtonHandler;