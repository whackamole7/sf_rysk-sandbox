import { useChainId } from 'wagmi';
import { getTokenBySymbol } from '../../../network/tokens';
import './Currency.scss';
import cx from "classnames";

const Currency = ({
	className,
	children,
	isSmall = true,
	symbol = "USDC",
	isHlight,
	style
}) => {

	const chainId = useChainId();
	const tokenIcon = getTokenBySymbol(chainId, symbol).icon;

	const val = children;
	const cls = cx(isHlight && 'hlight', className);
	
	return (
		<div className={cx("Currency", cls)} style={style}>
			<img
				src={tokenIcon}
				alt={`${symbol} icon`}
				width={isSmall ? 15 : "auto"}
			/>
			<span>{val}</span>
		</div>
	);
};

export default Currency;