import './ClosePositionModal.scss';
import Modal from './../../../../../../components/UI/Modal/Modal';
import InputComplexNumeric from './../../../../../../components/UI/Input/InputComplexNumeric/InputComplexNumeric';
import { sendTransaction } from './../../../../../../network/contracts/contractsUtils';
import { useChainId } from 'wagmi';
import Currency from './../../../../../../components/common/Currency/Currency';
import { useContext, useEffect, useState } from 'react';
import PendingPositionsStateContext from '../../../builderContext/PendingPositionsStateContext';
import { bigIntFromInputString, bigIntFromNumber, inputStringFromBigInt, numberFromBigInt } from '../../../../../../utils/dataTypesUtils/bigIntUtils';
import { getTokenIconBySymbol } from '../../../../../../network/tokens';
import Button from './../../../../../../components/UI/Button/Button';
import StrikeBrief from './../../../../../../components/common/StrikeBrief/StrikeBrief';
import { formatBigInt } from './../../../../../../utils/dataTypesUtils/bigIntUtils';
import { formatBigIntToDollarStr } from './../../../../../../utils/formattingUtils';
import cx from "classnames";
import { awaitLoadingDynamic } from './../../../../../../utils/commonUtils';
import { isUndefined } from 'swr/_internal';
import { useDebounce } from 'react-use';
import { DEBOUNCE_DELAY } from '../../../../../../environment/constants/commonConstants';


const ClosePositionModal = ({
	position,
	isOpen,
	setIsOpen,
}) => {

	const chainId = useChainId();
	
	const [closeAmountStr, setCloseAmountStr] = useState("");
	const [pnl, setPnl] = useState(undefined);

	const [isLoading, setIsLoading] = useState(false);
	const [pendingPositions, setPendingPositions] = useContext(PendingPositionsStateContext);

	const setMaxCloseAmount = () => {
		const formattedAmount = inputStringFromBigInt(position.amount);
		setCloseAmountStr(formattedAmount);
	}

	const updatePnl = (amount) => {
		setPnl(undefined);
		
		position.utils.calcPnl(amount)
			.then(setPnl);
	}

	useEffect(() => {
		if (isOpen && position) {
			setMaxCloseAmount();
			updatePnl();
		}
	}, [isOpen]);

	useDebounce(() => {
		if (position && closeAmountStr) {
			updatePnl(bigIntFromInputString(closeAmountStr));
		}
	}, DEBOUNCE_DELAY, [closeAmountStr])
	
	if (!position || !position.actions) {
		return null;
	}

	const setIsBtnSpinning = (isSpinning) => {
		if (isSpinning) {
			pendingPositions.closing.push({ id: position.id, market: position.market });
		} else {
			const closingIndex = pendingPositions.closing.findIndex(
				closingPosition => closingPosition.id === position.id
			);

			if (closingIndex !== -1) {
				pendingPositions.closing.splice(closingIndex, 1);
			}
		}

		setPendingPositions({ ...pendingPositions });
	}

	const { close } = position.actions;
	const { asset, amount, strategy, isCall, isBuy } = position;
	
	const strategyStr = strategy ??
		`${isBuy ? "Long" : "Short"} ${isCall ? "Call" : "Put"}`;
	
	const successMsgNode = (
		<Currency symbol={asset}>
			{closeAmountStr} {strategyStr} closed.
		</Currency>
	)
	const successMsg = `${closeAmountStr} ${asset} ${strategyStr} closed.`;
	const successMsgContent = {
		text: successMsg,
		node: successMsgNode,
	}

	const closeAmount = bigIntFromInputString(closeAmountStr);
	const closingPnl = pnl?.inUSDC;

	const handleClick = () => {
		sendTransaction(
			chainId,
			close,
			[closeAmount],
			successMsgContent,
			setIsLoading,
			() => {
				setIsBtnSpinning(true);
				setIsOpen(false);
			}
		)
	}


	const getError = () => {
		if (!closeAmountStr) {
			return `Enter Amount`;
		}

		if (isLoading) {
			return `Closing Strategy...`;
		}
	}

	const getBtnText = () => {
		return getError() ?? "Close Strategy";
	}

	const isBtnEnabled = () => {
		return !getError();
	}

	const tokenIcon = getTokenIconBySymbol(asset);

	return (
		<Modal
			className={"ClosePositionModal"}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			reset={() => {
				setCloseAmountStr("");
				setPnl(undefined);
			}}
		>

			<div className="ClosePositionModal__body">
				<h1>Close Strategy</h1>

				<div className="info-row">
					<div className="info-row__title">
						Strike
					</div>
					<div className="info-row__value">
						<StrikeBrief
							strikeData={position}
							priceNode={formatBigInt(position.strike, 0)}
						/>
					</div>
				</div>

				{position.market !== "Hegic" && (
					<InputComplexNumeric
						value={closeAmountStr}
						setValue={setCloseAmountStr}
						title="Amount"
						iconData={{
							src: tokenIcon
						}}
						isFocused={true}
						maxValue={numberFromBigInt(amount)}
					/>
				)}
				
			</div>

			<div className="ClosePositionModal__footer">
				<div className="info-row">
					<div className="info-row__title">
						PnL
					</div>
					<div className={cx("info-row__value", {
						positive: closingPnl > 0n,
						negative: closingPnl < 0n,
					})}>
						{awaitLoadingDynamic(
							() => formatBigIntToDollarStr(closingPnl),
							isUndefined(closingPnl)
						)}
					</div>
				</div>
				
				<Button
					isDisabled={!isBtnEnabled()}
					onClick={handleClick}
				>
					{getBtnText()}
				</Button>
			</div>
		</Modal>
	);
};

export default ClosePositionModal;