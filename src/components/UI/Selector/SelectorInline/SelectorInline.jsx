import Selector from '../Selector';
import './SelectorInline.scss';
import cx from 'classnames';

const SelectorInline = ({
	className,
	options,
	defaultOption,
	defaultValue,
	onChange,
	...props
}) => {


	return (
		<Selector
			className={cx("SelectorInline", className)}
			options={options}
			defaultOption={defaultOption}
			defaultValue={defaultValue}
			onChange={onChange}
			{...props}
		/>
	);
};

export default SelectorInline;