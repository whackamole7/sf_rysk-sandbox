import './UnsupportedChainErrorModal.scss';
import Modal from './../../../UI/Modal/Modal';
import { useState } from 'react';
import { CHAINS_DATA, SUPPORTED_CHAINS } from '../../../../environment/constants/networkConstants';
import Button from '../../../UI/Button/Button';
import useSwitchNetworkWithToast from './../../../../hooks/networkHooks/useSwitchNetworkWithToast';

const UnsupportedChainErrorModal = (props) => {
	const {
		chainId,
	} = props;

	const [isOpen, ] = useState(true);
	const switchNetworkWithToast = useSwitchNetworkWithToast();

	return (
		<Modal
			className="UnsupportedChainErrorModal"
			isOpen={isOpen}
			isObligatory={true}
		>
			<div className="UnsupportedChainErrorModal__text text-inline">
				Chain {chainId} is not supported.
			</div>

			<div className="UnsupportedChainErrorModal__switch-btns">
				{SUPPORTED_CHAINS.map(chainId => {
					const chainData = CHAINS_DATA[chainId];
					const { name, icon, isDisabled } = chainData;

					return (
						<Button
							key={chainId}
							isDisabled={isDisabled}
							type="stroke"
							onClick={() => {
								switchNetworkWithToast(chainId);
							}}
						>
							<img src={icon} alt={`${name} icon`} />
							Switch to {name}
						</Button>
					)
				})}
			</div>
		</Modal>
	);
};

export default UnsupportedChainErrorModal;