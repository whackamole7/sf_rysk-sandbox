import { Tooltip } from 'react-tooltip';
import './TooltipCustom.scss';


const TooltipCustom = ({
	children,
	hasDelay = true,
	...props
}) => {

	return (
		<Tooltip
			place="bottom-start"
			delayShow={hasDelay ? 150 : 0}
			delayHide={hasDelay ? 150 : 0}
			{...props}
		>
			{children}
		</Tooltip>
	);
};

export default TooltipCustom;