import { useRef, useState } from 'react';
import { deformatNumberFromInputString, formatNumberToInputString } from '../utils/dataTypesUtils/numberUtils';

export default function useInput(
		valueState,
		options = {
			maxValue: undefined,
			placeholder: "",
			isDisabled: false,
			isFocused: false
		},
		formatFns = [
			formatNumberToInputString,
			deformatNumberFromInputString,
		]
	) {

	const [value, setValue] = valueState;
	const { maxValue, placeholder, isDisabled, isFocused } = options;
	const [
		formatInputString,
		deformatInputString,
	] = formatFns;

	const [hasFocus, setHasFocus] = useState(false);
	const inputRef = useRef(null);
	
	return {
		node:
			<input
				autoFocus={isFocused}
				type="text"
				ref={inputRef}
				value={value}
				disabled={isDisabled}
				placeholder={placeholder}
				onChange={(e) => {
					if (maxValue && (deformatInputString(e.target.value) > maxValue)) {
						setValue(formatInputString(maxValue));
					} else {
						setValue(
							formatInputString(e.target.value)
						);
					}
				}}
				onFocus={() => {
					setHasFocus(true);
				}}
				onBlur={() => {
					setHasFocus(false);
				}}
			/>,
		hasFocus,
		ref: inputRef,
	}
}