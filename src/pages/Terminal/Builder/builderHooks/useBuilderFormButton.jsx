import useGodEye from "../../../../environment/contextHooks/useGodEye/useGodEye";
import { getStrategyHasSell } from '../builderUtils';
import useManageWallet from '../../../../hooks/networkHooks/useManageWallet';
import Button from '../../../../components/UI/Button/Button';


const useBuilderFormButton = (
	amountStr,
	strategyStructure,
	chosenStrikes,
	collateralDataArr,
	paymentAmount,
	balanceAmount,
	onClickDefault,
) => {
	
	const { isConnected } = useGodEye();
	const { connectWallet } = useManageWallet();

	const hasSell = getStrategyHasSell(strategyStructure);

	const hasEmptyStrike = Boolean(
		chosenStrikes.length !== strategyStructure.length || 
		!chosenStrikes.every(data => data)
	);
	const hasEmptyCollateral = Boolean(
		collateralDataArr.find(data => data && data.inMarketToken === 0n)
	);
	
	const comingSoonStrike = chosenStrikes.find(strike => strike.isComingSoon);
		
	const getError = () => {
		if (!amountStr) {
			return `Enter Amount`;
		}

		if (hasEmptyStrike) {
			return `Fill out the Strike fields`;
		}
		
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

		if (comingSoonStrike) {
			return true;
		}

		return !getError();
	}

	const getBtnText = () => {
		const btnDefaultText = "Buy Strategy";
		
		if (!isConnected) {
			return `Connect wallet`;
		}

		if (comingSoonStrike) {
			return `Visit ${comingSoonStrike.market} app`;
		}

		return getError() ?? btnDefaultText;
	}


	const onBtnClick = () => {
		if (!isConnected) {
			return connectWallet;
		}

		if (comingSoonStrike) {
			window.open(comingSoonStrike.marketLink);
		}

		return onClickDefault;
	}

	const BuilderFormButton = (
		<Button
			className="BuilderForm__button"
			onClick={onBtnClick}
			isDisabled={!getIsBtnEnabled()}
		>
			{getBtnText()}
		</Button>
	)

	return BuilderFormButton;
}


export default useBuilderFormButton;