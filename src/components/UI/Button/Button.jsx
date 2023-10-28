import { forwardRef } from 'react';
import './Button.scss';
import cx from "classnames";

const Button = forwardRef(function Button({
	children,
	className,
	style,
	isDisabled,
	onClick,
	type, // complex, stroke, dark, micro
}, ref) {
	
	const cls = cx(className, type && `Button_${type}`);
	const isComplex = type === "complex";

	return (
		<button
			className={cx("Button", cls)}
			ref={ref}
			disabled={isDisabled}
			onClick={onClick}
			data-text={children}
			style={style}
		>
			{isComplex 
				? <span>{children.toString()}</span>
				: children}
		</button>
	);
});

export default Button;