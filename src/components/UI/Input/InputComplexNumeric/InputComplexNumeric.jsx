import '../InputFamily.scss';
import './InputComplexNumeric.scss';
import useInput from '../../../../hooks/useInput';
import cx from "classnames";
import { deformatNumberFromInputString, formatNumberToInputString } from '../../../../utils/dataTypesUtils/numberUtils';

const InputComplexNumeric = (props) => {
	const {
		value,
		setValue,
		maxValue,
		placeholder,
		isDisabled,
		isFocused,
		hasError,
		formatInputStringFns = [
			formatNumberToInputString,
			deformatNumberFromInputString,
		],
		title,
		presentedValue,
		presentedValueTitle,
		iconData,
		unitStr,
	} = props;

	const input = useInput(
		[value, setValue],
		{ maxValue, placeholder, isDisabled, isFocused },
		formatInputStringFns,
	);
	const cls = cx(
		props.className,
		input.hasFocus && 'hlight',
		hasError && 'error',
		isDisabled && 'disabled'
	);

	const formatInputString = formatInputStringFns[0];

	return (
		<div
			className={cx("InputFamily InputComplexNumeric", cls)}
			onClick={() => {
				input.ref.current.focus();
			}}
		>
			<div className="InputComplexNumeric__header">
				<div className="InputComplexNumeric__title">
					{title}
				</div>
				{presentedValue && (
					<button
						className="InputComplexNumeric__presented-value"
						onClick={(e) => {
							e.stopPropagation();
							setValue(formatInputString(presentedValue));
						}}
					>
						<span className='InputComplexNumeric__presented-value-title'>
							{presentedValueTitle}:
						</span>
						{formatInputString(presentedValue)}
					</button>
				)}
				{iconData && (
					<div className='InputComplexNumeric__icon'>
						<img src={iconData.src} alt={iconData.alt ?? "icon"} />
					</div>
				)}
			</div>
			<div className="InputComplexNumeric__body">
				<div className="InputComplexNumeric__input-wrapper">
					{input.node}
				</div>
				<div className="InputComplexNumeric__helper">
					{maxValue &&
						<button
							className="InputComplexNumeric__max-btn"
							disabled={isDisabled}
							onClick={(e) => {
								e.stopPropagation();
								setValue(formatNumberToInputString(maxValue));
							}}
						>
							Max
						</button>
					}
					{unitStr &&
						<div className="InputComplexNumeric__unit">
							{unitStr}
						</div>
					}
				</div>
			</div>
		</div>
	);
};

export default InputComplexNumeric;