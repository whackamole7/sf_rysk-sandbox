import './NetworkSwitcher.scss';
import { CHAINS_DATA, SUPPORTED_CHAINS } from '../../../../../environment/constants/networkConstants';
import Selector from './../../../../../components/UI/Selector/Selector';
import { useChainId } from 'wagmi';
import useSwitchNetworkWithToast from './../../../../../hooks/networkHooks/useSwitchNetworkWithToast';
import TooltipCustom from './../../../../../components/UI/TooltipCustom/TooltipCustom';

const NetworkSwitcher = () => {
	const currentChainId = useChainId();
	const switchNetworkWithToast = useSwitchNetworkWithToast();
	
	const networkOptions = SUPPORTED_CHAINS.map(chainId => {
		const { name, icon, isDisabled } = CHAINS_DATA[chainId];

		return {
			value: chainId,
			label: (
				<div
					className="flex gap-x-7"
				>
					<img src={icon} alt={`${name} icon`} />
					<span>{name}</span>
				</div>
			),
			isCurrent: chainId === currentChainId,
			isDisabled,
		}
	});

	const currentNetwork = networkOptions.find(opt => opt.isCurrent);

	return (
		<div className="NetworkSwitcher">
			<Selector
				options={networkOptions}
				value={currentNetwork}
				onChange={(option) => {
					switchNetworkWithToast(option.value);
				}}
				isDisabled={true}
			/>
			<TooltipCustom
				anchorSelect=".NetworkSwitcher .Selector__option--is-disabled"
				content="Coming soon"
			/>
		</div>
	);
};

export default NetworkSwitcher;