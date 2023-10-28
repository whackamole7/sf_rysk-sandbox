import './PositionCollateralModal.scss';
import Modal from '../../../../../../components/UI/Modal/Modal';
import InputComplexNumeric from '../../../../../../components/UI/Input/InputComplexNumeric/InputComplexNumeric';
import { getTokenIconBySymbol } from '../../../../../../network/tokens';
import { useEffect, useState } from 'react';
import Button from '../../../../../../components/UI/Button/Button';
import { sendTransaction } from '../../../../../../network/contracts/contractsUtils';
import { useChainId } from 'wagmi';
import Currency from '../../../../../../components/common/Currency/Currency';
import useTokenApprover from '../../../../../../hooks/networkHooks/tokenHooks/useTokenApprover';
import { getContractAddress } from '../../../../../../network/contracts/contractsData';
import { useDebounce } from 'react-use';
import { bigIntFromInputString } from '../../../../../../utils/dataTypesUtils/bigIntUtils';
import { DEBOUNCE_DELAY } from '../../../../../../environment/constants/commonConstants';


const PositionCollateralModal = ({
	position,
	isOpen,
	setIsOpen
}) => {

	const chainId = useChainId();
	
	const [addedAmountStr, setAddedAmountStr] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isApproved, setIsApproved] = useState(null);

	const collateralToken = position?.collateral?.marketToken ?? { symbol: "ETH" };
	const tokenIcon = getTokenIconBySymbol(collateralToken.symbol);

	const Approver = useTokenApprover(
		collateralToken?.symbol,
		getContractAddress(chainId, "Lyra_Quoter"),
		bigIntFromInputString(addedAmountStr),
		setIsApproved,
	);

	const updateIsApproved = () => {
		setIsApproved(null);
		Approver.check();
	}

	useEffect(() => {
		setIsApproved(null);
	}, [addedAmountStr]);
	useDebounce(
		() => {
			if (addedAmountStr) {
				updateIsApproved();
			}
		}, DEBOUNCE_DELAY, [addedAmountStr]
	);

	if (!position || !position.collateral) {
		return null;
	}

	const getError = () => {
		if (!addedAmountStr) {
			return `Enter Amount`;
		}

		if (isApproved === null) {
			return `Please, wait...`;
		}
		
		if (isLoading) {
			if (!isApproved) {
				return `Approving ${collateralToken.symbol}...`;
			}
			
			return `Updating Collateral...`;
		}
	}
	
	const isBtnEnabled = () => {
		return !getError();
	}

	const getBtnText = () => {
		const activeBtnText = !isApproved ?
			`Approve ${addedAmountStr} ${collateralToken.symbol}`
			: "Add Collateral"
		
		return getError() ?? activeBtnText;
	}
	
	const handleClick = () => {
		if (!isApproved) {
			Approver.approve(
				setIsLoading,
				updateIsApproved
			);

			return;
		}
		
		const addedAmount = bigIntFromInputString(addedAmountStr);

		sendTransaction(
			chainId,
			position.actions.addToCollateral,
			[addedAmount],
			{
				text: `${addedAmountStr} ${collateralToken.symbol} added.`,
				node: (
					<Currency symbol={collateralToken.symbol}>
						{addedAmountStr} added to collateral.
					</Currency>
				)
			},
			setIsLoading,
			() => setIsOpen(false)
		)
	}
	
	return (
		<Modal
			className={"PositionCollateralModal"}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			reset={() => {
				setAddedAmountStr("");
				setIsApproved(null);
			}}
		>
			<h1>Edit Collateral</h1>

			<InputComplexNumeric
				value={addedAmountStr}
				setValue={setAddedAmountStr}
				title="Add Amount"
				iconData={{
					src: tokenIcon
				}}
				isFocused={true}
			/>

			<Button
				isDisabled={!isBtnEnabled()}
				onClick={handleClick}
			>
				{getBtnText()}
			</Button>
		</Modal>
	);
};

export default PositionCollateralModal;