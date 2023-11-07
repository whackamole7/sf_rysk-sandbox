import { useEffect, useState } from 'react';
import useInput from '../../../../hooks/useInput';
import './SlippageInput.scss';
import { BUILDER_SWAP_SLIPPAGE } from '../../../../pages/Terminal/Builder/builderConstants';
import icon_pen from '../../../../img/UI/pen.svg';
import cx from "classnames";
import { roundNumber } from '../../../../utils/dataTypesUtils/numberUtils';


const SlippageInput = ({
	slippage,
	setSlippage
}) => {
	
	const getSlippageStrFromSlippage = (slippage) => {
		return `${roundNumber(slippage * 100, 6)}`;
	}
	
	const [slippageStr, setSlippageStr] = useState(
		getSlippageStrFromSlippage(slippage)
	);

	const {
		node: inputNode,
		ref: inputRef,
		hasFocus: inputHasFocus
	} = useInput(
		[slippageStr, setSlippageStr],
		{ maxValue: 100 },
	)

	const setSlippageStrToDefault = () => {
		const defaultSlippageStr = getSlippageStrFromSlippage(BUILDER_SWAP_SLIPPAGE);

		setSlippageStr(defaultSlippageStr);
	}
	
	const updateSlippage = () => {
		const slippage = Number(slippageStr) / 100;

		setSlippage(slippage);
	}

	const setDynamicInputWidth = () => {
		const input = inputRef.current;
		const hasDot = input.value.includes(".");
		let inputWidth = (input.value.length + 1) * 8.5;
		if (hasDot) {
			inputWidth -= 4;
		}
		
		input.style.width = inputWidth + 'px';
	}

	const onInputBlur = () => {
		if (!slippageStr || Number(slippageStr) === 0) {
			setSlippageStrToDefault();
		}
	}
	
	useEffect(() => {
		if (slippageStr) {
			updateSlippage();
		}

		setDynamicInputWidth();
	}, [slippageStr]);

	useEffect(() => {
		if (!inputHasFocus) {
			onInputBlur();
		}
	}, [inputHasFocus]);

	return (
		<div
			className="SlippageInput"
			onClick={() => inputRef.current?.focus()}
		>
			<div className={
				cx("SlippageInput__input-container", inputHasFocus && "focused")
			}>
				{inputNode}
				<span
					className='SlippageInput__unit'
				>
					%
				</span>
			</div>
			<button
				className="SlippageInput__btn"
			>
				<img
					src={icon_pen}
					alt={"Edit slippage"}
				/>
			</button>
		</div>
	);
};

export default SlippageInput;