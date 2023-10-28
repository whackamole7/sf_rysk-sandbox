import './BuyBuildModal.scss';
import Modal from './../../../../../../components/UI/Modal/Modal';
import Stages from './../../../../../../components/UI/Stages/Stages';
import { BUILDER_APPROVAL_SLIPPAGE, BUILDER_STRATEGIES_CONFIG } from '../../../builderConstants';
import Divider from './../../../../../../components/UI/Divider/Divider';
import Currency from './../../../../../../components/common/Currency/Currency';
import Button from './../../../../../../components/UI/Button/Button';
import { formatTokenAmount } from '../../../../../../utils/dataTypesUtils/bigIntUtils';
import { useContext, useEffect, useState } from 'react';
import useTokenApprover from './../../../../../../hooks/networkHooks/tokenHooks/useTokenApprover';
import { getContractData } from '../../../../../../network/contracts/contractsData';
import { useChainId } from 'wagmi';
import { ethers } from 'ethers';
import Spinner from '../../../../../../components/UI/Spinner/Spinner';
import { getSigner } from '../../../../../../network/providers';
import useBuildBuyer from '../../../builderHooks/useBuildBuyer';
import { getBigIntWithSlippage } from '../../../../../../utils/optionsUtils';
import PendingPositionsStateContext from './../../../builderContext/PendingPositionsStateContext';
import { getShouldSwap } from '../../../builderUtils';


const BuyBuildModal = ({
	isOpen,
	setIsOpen,
	asset,
	strategy,
	amountStr,
	chosenStrikes,
	collateralDataArr,
	youPay,
	swapSlippage
}) => {

	const chainId = useChainId();
	const strategyConfig = BUILDER_STRATEGIES_CONFIG[strategy];

	const [isLoading, setIsLoading] = useState(false);
	const [activeStage, setActiveStage] = useState(null);


	const [pendingPositions, setPendingPositions] = useContext(PendingPositionsStateContext);

	const buyBuild = useBuildBuyer(
		strategy,
		chosenStrikes,
		collateralDataArr,
		youPay,
		swapSlippage,
		{
			setIsLoading,
			closeModal: () => setIsOpen(false),
			addPendingPosition: (position) => {
				position.isOpening = true;

				pendingPositions.opening.push(position);
				setPendingPositions({ ...pendingPositions });
			}
		}
	);

	const shouldSwap = getShouldSwap(youPay);

	const stagesNames = ["Approve", "Buy"];
	const stagesArr = stagesNames.map(name => {
		return {
			name,
			isActive: activeStage === name,
		}
	});
	
	const { paymentToken, inPaymentToken } = youPay;
	const paymentAmountWithSlippage = getBigIntWithSlippage(
		inPaymentToken,
		shouldSwap
			? BUILDER_APPROVAL_SLIPPAGE + swapSlippage
			: BUILDER_APPROVAL_SLIPPAGE,
	);
	const paymentAmountFormatted = formatTokenAmount(
		paymentAmountWithSlippage,
		paymentToken.isStable
	);
	const paymentTokenSymbol = paymentToken.symbol;
	const paymentString = `${paymentAmountFormatted} ${paymentTokenSymbol}`;
	
	const buttonActionLabels = {
		Approve: `Approve ${paymentString}`,
		Buy: `Pay ${paymentString}`,
	}

	const Exchanger = new ethers.Contract(...getContractData(chainId, "Exchanger"), getSigner());
	
	const Approver = useTokenApprover(
		paymentTokenSymbol,
		Exchanger.address,
		paymentAmountWithSlippage,
		(isApproved) => {
			setActiveStage(isApproved ? "Buy" : "Approve");
		},
	);

	const updateIsApproved = () => {
		setActiveStage(null);
		Approver.check();
	}

	useEffect(() => {
		if (isOpen) {
			updateIsApproved();
		}
	}, [isOpen, youPay]);


	const getError = () => {
		if (!activeStage) {
			return `Please, wait...`;
		}

		if (isLoading) {
			if (activeStage === "Approve") {
				return `Approving ${paymentTokenSymbol}...`;
			}

			if (activeStage === "Buy") {
				return `Buying ${strategy}...`;
			}
		}

		return;
	}

	const ButtonClickHandler = {
		approve: () => {
			Approver.approve(
				setIsLoading,
				updateIsApproved,
			);
		},

		buy: buyBuild,
	}

	const ButtonHandler = {
		getBtnText: () => {
			const error = getError();
	
			return error ?? buttonActionLabels[activeStage];
		},

		getIsBtnEnabled: () => {
			const error = getError();
	
			return !error;
		},

		getBtnOnClick: () => {
			switch(activeStage) {
				case "Approve": {
					return ButtonClickHandler.approve;
				}
				case "Buy": {
					return ButtonClickHandler.buy;
				}
			}
		}
	}


	return (
		<Modal
			className="BuyBuildModal"
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Stages
				stagesArr={stagesArr}
			/>

			<h1 className="BuyBuildModal__title">
				{activeStage ?? <Spinner />}
			</h1>

			<div className="BuyBuildModal__strategy">
				Strategy

				<div className="BuyBuildModal__strategy-info">
					<span
						className='BuyBuildModal__strategy-name'
						style={{ color: strategyConfig.color }}
					>
						{strategy}
					</span>

					<Divider isVertical={true} />

					<Currency
						className="BuyBuildModal__strategy-amount"
						symbol={asset}
						isHlight={true}
					>
						{amountStr}
					</Currency>
				</div>
			</div>

			{shouldSwap && (
				<div className="BuyBuildModal__footer">
					<p className="BuyBuildModal__hint">
						Sharwa.Finance will auto-convert your {paymentString} into tokens compatible with the options protocols where your positions are to be opened, using Uniswap v3.
					</p>
				</div>
			)}

			<Button
				className="BuyBuildModal__button"
				isDisabled={!ButtonHandler.getIsBtnEnabled()}
				onClick={ButtonHandler.getBtnOnClick()}
			>
				{ButtonHandler.getBtnText()}
			</Button>
		</Modal>
	);
};

export default BuyBuildModal;