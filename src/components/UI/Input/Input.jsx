import './Input.scss';
import './InputFamily.scss';
import cx from 'classnames';
import useInput from './../../../hooks/useInput';

const Input = (props) => {
	const {
		value,
		setValue,
		maxValue,
		formatInputStringFns,
		hasError,
		isDisabled,
		unitStr,
		placeholder,
	} = props;

	const input = useInput(
		[value, setValue],
		{ maxValue, placeholder, isDisabled },
		formatInputStringFns,
	);
	const cls = cx(props.className, input.hasFocus && "hlight", hasError && "error", isDisabled && "disabled");

	return (
		<div
			className={cx("InputFamily Input", cls)}
			onClick={() => {
				input.ref.current.focus();
			}}
		>
			{input.node}
			<div className="Input__unit">
				{unitStr}
			</div>
		</div>
	);
};

export default Input;