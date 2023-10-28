import './CryptoGateway.scss';
import Wallet from './Wallet/Wallet';
import NetworkSwitcher from './NetworkSwitcher/NetworkSwitcher';
import useGodEye from '../../../../environment/contextHooks/useGodEye/useGodEye';

const CryptoGateway = () => {
	const { isConnected } = useGodEye();
	
	return (
		<div className="CryptoGateway">
			{isConnected && (
				<NetworkSwitcher />
			)}
			<Wallet />
		</div>
	);
};

export default CryptoGateway;