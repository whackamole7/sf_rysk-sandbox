import { GodEyeContext } from '../../environment/contextHooks/useGodEye/useGodEye';
import useGodEyeConfig from '../../environment/contextHooks/useGodEye/useGodEyeConfig';

const GodEyeConfig = ({ children }) => {
	const { godEyeAddress } = useGodEyeConfig();
	
	return (
		<GodEyeContext.Provider value={godEyeAddress}>
			{children}
		</GodEyeContext.Provider>
	);
};

export default GodEyeConfig;