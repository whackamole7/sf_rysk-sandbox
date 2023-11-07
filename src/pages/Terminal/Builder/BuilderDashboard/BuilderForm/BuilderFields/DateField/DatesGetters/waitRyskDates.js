import { ethers } from "ethers";
import { getContractData } from "../../../../../../../../network/contracts/contractsData";
import { getAlchemyProvider } from "../../../../../../../../network/providers";
import { MILISECONDS_IN_SECOND } from "../../../../../../../../environment/constants/dateConstants";




const waitRyskDates = async (chainId) => {
	const LiquidityPool = new ethers.Contract(
		...getContractData(chainId, "Rysk_LiquidityPool"),
		getAlchemyProvider(chainId)
	);
	
	const OptionCatalogue = new ethers.Contract(
		...getContractData(chainId, "Rysk_OptionCatalogue"),
		getAlchemyProvider(chainId)
	);

	const {
		minExpiry: minExpiryBigNum,
		maxExpiry: maxExpiryBigNum
	} = await LiquidityPool.optionParams()

	return (
		OptionCatalogue.getExpirations()
			.then(expirations => {
				const validExpirations = expirations
					.map(expBigNum => Number(expBigNum) * MILISECONDS_IN_SECOND)
					.filter(exp => {
						const minExpiry = Number(minExpiryBigNum) * MILISECONDS_IN_SECOND;
						const maxExpiry = Number(maxExpiryBigNum) * MILISECONDS_IN_SECOND;
						
						if ((exp < Date.now())) 							return;
						if ((exp - Date.now()) < minExpiry) 	return;
						if ((exp - Date.now()) > maxExpiry) 	return;

						return true;
					})

				return validExpirations;
			})
	)
}


export default waitRyskDates;