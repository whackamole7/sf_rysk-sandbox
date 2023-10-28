import './Wallet.scss';
import { useTogglePopup } from './../../../../../hooks/useTogglePopup';
import icon_wallet from "../../../../../img/common/wallet.svg";
import icon_link from "../../../../../img/common/link.svg";
import icon_cross from "../../../../../img/UI/cross_white.svg";
import cx from "classnames";
import { getExplorerUrl } from '../../../../../network/networkUtils';
import { useChainId } from 'wagmi';
import Button from '../../../../../components/UI/Button/Button';
import useGodEye from '../../../../../environment/contextHooks/useGodEye/useGodEye';
import useManageWallet from '../../../../../hooks/networkHooks/useManageWallet';

const Wallet = () => {
	const {
		isOpen,
		openPopup: openWallet,
		closePopup: closeWallet,
	} = useTogglePopup();

	const cls = cx(isOpen && "open");

	const chainId = useChainId();
	const { account, isConnected } = useGodEye();
	const { connectWallet, disconnectWallet } = useManageWallet();
	
	const shortenAddress = (addr) => {
		return addr.slice(0, 9) + "..." + addr.slice(-15);
	}
	
	const renderConnectButton = () => {
		return (
			<Button
				type="complex"
				onClick={connectWallet}
			>
				Connect Wallet
			</Button>
		)
	}

	const renderWalletInfo = () => {
		return (
			<>
				<button
					className="Wallet__header"
					onClick={openWallet}
				>
					<div className="Wallet__address">
						<img src={icon_wallet} alt="Wallet icon" />
						<span>
							{shortenAddress(account)}
						</span>
					</div>
				</button>
				<div
					className="Wallet__body"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						className="close-btn"
						onClick={closeWallet}
					>
						<img src={icon_cross} alt="x" />
					</button>
					<a
						className="Wallet__link"
						href={`${getExplorerUrl(chainId)}/address/${account}`}
						rel='noreferrer'
						target='_blank'
					>
						<img src={icon_link} alt="external link" />
						<span>View on explorer</span>
					</a>
					<div className="Wallet__inner-address">
						{"(" + shortenAddress(account) + ")"}
					</div>
					<Button
						className="Wallet__button"
						onClick={disconnectWallet}
					>
						Disconnect wallet
					</Button>
				</div>
			</>
		)
	}

	return (
		<div className={cx("Wallet", cls)}>
			{isConnected
				? renderWalletInfo()
				: renderConnectButton()}
		</div>
	);
};

export default Wallet;