import './Selector.scss';
import Select, { components } from 'react-select';
import icon_dropdown from '../../../img/UI/dropdown.svg';
import cx from "classnames";

const Selector = ({
	className,
	options,
	defaultValue,
	defaultOption,
	onChange,
	iconNode,
	iconTextNode,
	...props
}) => {
	
	const hasIcon = iconNode || iconTextNode;

	const Control = ({ children, ...props }) => {
		return (
			<components.Control {...props}>
				{iconNode && (
					<div className="Selector__icon">
						{iconNode}
					</div>
				)}
				{iconTextNode && (
					<div className="Selector__icon Selector__icon_text">
						{iconTextNode}
					</div>
				)}
				{children}
			</components.Control>
		)
	}


	// todo: refactor
	const findDefaultOption = (value) => {
		const findFn = (option) => option.value === value;
		
		const hasGrouping = options.find(opt => opt.options);
		
		let defaultOption;

		if (hasGrouping) {
			options.forEach(opt => {
				if (defaultOption) {
					return;
				}

				const findingArray = opt.options ?? [opt];
				defaultOption = findingArray.find(findFn);
			});
		} else {
			defaultOption = options.find(findFn);
		}

		return defaultOption;
	}

	const cls = cx(
		className,
		hasIcon && "Selector_with-icon",
	);

	return (
		<Select
			{...props}
			options={options}
			defaultValue={
				defaultOption ??
				findDefaultOption(defaultValue)
			}
			onChange={onChange}
			className={cx("Selector", cls)}
			classNamePrefix={"Selector"}
			isClearable={false}
			isSearchable={false}
			components={{
				DropdownIndicator: ({ innerRef, innerProps }) => {
					return (
						<div
							ref={innerRef}
							{...innerProps}
							className='Selector__indicator Selector__dropdown-indicator'
						>
							<img src={icon_dropdown} alt="dropdown icon" />
						</div>
					)
				},
				Control: Control
			}}
		/>
	);
};

export default Selector;