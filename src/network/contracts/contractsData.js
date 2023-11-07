import TxBuilder_abi from './abis/sharwa/TxBuilder/TxBuilder.json';
import TxBuilderOpen_Lyra_BTC_abi from './abis/sharwa/TxBuilder/TxBuilderMarkets/TxBuilderOpen_Lyra_BTC.json';
import TxBuilderOpen_Lyra_ETH_abi from './abis/sharwa/TxBuilder/TxBuilderMarkets/TxBuilderOpen_Lyra_ETH.json';
import TxBuilderOpen_Hegic_abi from './abis/sharwa/TxBuilder/TxBuilderMarkets/TxBuilderOpen_Hegic.json';
import StopOrder_Hegic_abi from './abis/sharwa/StopOrder/StopOrder_Hegic.json';
import StopOrder_Lyra_BTC_abi from './abis/sharwa/StopOrder/StopOrder_Lyra_BTC.json';
import StopOrder_Lyra_ETH_abi from './abis/sharwa/StopOrder/StopOrder_Lyra_ETH.json';
import Exchanger_abi from './abis/sharwa/Exchanger/Exchanger.json';

import Hegic_OperationalTreasury_abi from './abis/options/Hegic/Hegic_OperationalTreasury.json';
import Hegic_PositionManager_abi from './abis/options/Hegic/Hegic_PositionManager.json';
import Hegic_Strategy_abi from './abis/options/Hegic/Hegic_Strategy.json';
import Hegic_PriceCalculator_abi from './abis/options/Hegic/Hegic_PriceCalculator.json';

import Lyra_OptionToken_BTC_abi from './abis/options/Lyra/Lyra_OptionToken_BTC.json';
import Lyra_OptionToken_ETH_abi from './abis/options/Lyra/Lyra_OptionToken_ETH.json';
import Lyra_Quoter_abi from './abis/options/Lyra/Lyra_Quoter.json';


import Rysk_LiquidityPool_abi from './abis/options/Rysk/Rysk_LiquidityPool.json';
import Rysk_OptionCatalogue_abi from './abis/options/Rysk/Rysk_OptionCatalogue.json';
import Rysk_BeyondPricer_abi from './abis/options/Rysk/Rysk_BeyondPricer.json';
import Rysk_OptionExchange_abi from './abis/options/Rysk/Rysk_OptionExchange.json';
import Rysk_AlphaPortfolioValuesFeed_abi from './abis/options/Rysk/Rysk_AlphaPortfolioValuesFeed.json';


import ERC20_abi from './abis/common/ERC20.json';
import Chainlink_abi from './abis/common/Chainlink.json';
import Uniswap_Quoter_abi from './abis/common/Uniswap_Quoter.json';

import { getDaysFromMs } from "../../utils/dateUtils";
import { ARBITRUM, OPTIMISM } from '../../environment/constants/networkConstants';
import { ethers } from 'ethers';
import { getAlchemyProvider } from '../providers';
import { TOKENS } from '../tokens';


const CONTRACTS_DATA = {
	[ARBITRUM]: {
		// Sharwa.Finance
		TxBuilder: {
			address: "0x9C22123ffecAf575F93e5FA21DEeb43696A10ad3",
			abi: TxBuilder_abi,
		},
		// todo: add TxBuilderClose
		TxBuilderOpen_Lyra_BTC: {
			address: "0x90481D5ed869be0E5bf11e5a2a8dCF632b9FAEf5",
			abi: TxBuilderOpen_Lyra_BTC_abi,
		},
		TxBuilderOpen_Lyra_ETH: {
			address: "0x0aaE7bFE3D404Bb6BA3502Ced966Aea6c4F17222",
			abi: TxBuilderOpen_Lyra_ETH_abi,
		},
		TxBuilderOpen_Hegic: {
			address: "0xBe5aE8dbB22fa18BeBA05057a171266383a8d5B7",
			abi: TxBuilderOpen_Hegic_abi,
		},
		StopOrder_Hegic: {
			address: "0x83ca705E8eEE363b16935D5FCbC3514530d41C74",
			abi: StopOrder_Hegic_abi,
		},
		StopOrder_Lyra_BTC: {
			address: "0xDE51a10A711412353e825623F58F56d9D0EA98cF",
			abi: StopOrder_Lyra_BTC_abi,
		},
		StopOrder_Lyra_ETH: {
			address: "0x06a6815b91c88BDa19832Ada861077e123C34FFb",
			abi: StopOrder_Lyra_ETH_abi,
		},
		Exchanger: {
			address: "0x2f7e0Ee16FFd6BA0721158F74934Ff0e42Df6131",
			abi: Exchanger_abi,
		},
		
		// Options
		Hegic_OperationalTreasury: {
			address: "0xec096ea6eB9aa5ea689b0CF00882366E92377371",
			abi: Hegic_OperationalTreasury_abi,
		},
		Hegic_PositionManager: {
			address: "0x5fe380d68fee022d8acd42dc4d36fbfb249a76d5",
			abi: Hegic_PositionManager_abi,
		},
		Hegic_Strategy: {
			abi: Hegic_Strategy_abi,
		},
		Hegic_PriceCalculator: {
			abi: Hegic_PriceCalculator_abi,
		},
		Lyra_OptionToken_BTC: {
			address: "0x0e97498F3d91756Ec7F2d244aC97F6Ea9f4eBbC3",
			abi: Lyra_OptionToken_BTC_abi,
		},
		Lyra_OptionToken_ETH: {
			address: "0xe485155ce647157624C5E2A41db45A9CC88098c3",
			abi: Lyra_OptionToken_ETH_abi,
		},
		Lyra_Quoter: {
			address: "0x23236b4c7772636b5224df56Be8168A2f42df31C",
			abi: Lyra_Quoter_abi,
		},
		Rysk_LiquidityPool: {
			address: "0x217749d9017cB87712654422a1F5856AAA147b80",
			abi: Rysk_LiquidityPool_abi,
		},
		Rysk_OptionCatalogue: {
			address: "0x44227Dc2a1d71FC07DC254Dfd42B1C44aFF12168",
			abi: Rysk_OptionCatalogue_abi,
		},
		Rysk_BeyondPricer: {
			address: "0xeA5Fb118862876f249Ff0b3e7fb25fEb38158def",
			abi: Rysk_BeyondPricer_abi,
		},
		Rysk_OptionExchange: {
			address: "0xC117bf3103bd09552F9a721F0B8Bce9843aaE1fa",
			abi: Rysk_OptionExchange_abi,
		},
		Rysk_AlphaPortfolioValuesFeed: {
			address: "0xc7abaec336098cd0dcd98b67cb14d3b18e1c68a8",
			abi: Rysk_AlphaPortfolioValuesFeed_abi,
		},


		// Tokens
		// all contracts for tokens in tokens.js included by the function below

		
		// Common
		Chainlink_BTC: {
			address: "0x6ce185860a4963106506C203335A2910413708e9",
			abi: Chainlink_abi,
		},
		Chainlink_ETH: {
			address: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
			abi: Chainlink_abi,
		},
		Uniswap_Quoter: {
			address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
			abi: Uniswap_Quoter_abi
		},
	},
	// Optimism
	[OPTIMISM]: {

	}
}

const insertTokenContracts = () => {
	for (const chainId in CONTRACTS_DATA) {
		const contracts = CONTRACTS_DATA[chainId];
		const tokens = TOKENS[chainId];

		if (!tokens) {
			continue;
		}

		tokens.forEach(token => {
			if (token.isETH) {
				return;
			}
			
			contracts[token.symbol] = {
				address: token.address,
				abi: ERC20_abi,
			}
		})

		CONTRACTS_DATA[chainId] = { ...contracts };
	}
}
insertTokenContracts();


export const getContractData = (chainId, name) => {
	if (!CONTRACTS_DATA[chainId]) {
		throw new Error(`Unknown chainId ${chainId}`);
	}

	const contractData = CONTRACTS_DATA[chainId][name];
	if (!contractData) {
		throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
	}

	return [contractData.address, contractData.abi];
}

export const getContractAddress = (chainId, name) => {
	return getContractData(chainId, name)[0];
}
export const getContractAbi = (chainId, name) => {
	return getContractData(chainId, name)[1];
}


const HEGIC_STRATEGIES_ADDRESSES = {
	[ARBITRUM]: {
		short: {
			CALL_100_BTC: '0x527d1086C3DD22FcdB338F69D47A1e4bFE11E539',
			CALL_100_ETH: '0x09a4B65b3144733f1bFBa6aEaBEDFb027a38Fb60',
			CALL_110_BTC: '0x377191F680b52ce3d0060388fEF01be7ef68e3d5',
			CALL_110_ETH: '0xF48f571DdD77dba9Ae10fefF6df04484685091D9',
			CALL_120_BTC: '0x8Fb8529695237D4004cffb21499e7E49E982786a',
			CALL_120_ETH: '0x96416b82C9DFA7649570c784Eb0D0FFcDE361cFE',
			CALL_130_BTC: '0x32563D6151891c0A8d56eD644AcDEa6FE5f4E4eB',
			CALL_130_ETH: '0xf8b8b54bE1Eb37E76873670Ac9DE3C28b507142C',
			PUT_100_BTC: '0xA8DF600289bEc25602741756f55f27ffFDAB69a6',
			PUT_100_ETH: '0xaA0DfBFb8dA7f45BB41c0fB68B71FAEB959B22aa',
			PUT_70_BTC: '0x7066286C1AA0FeBE0f63eF8a44F6Fea9F05FFBE0',
			PUT_70_ETH: '0x35EF16F3c329a54050Ca120145340dfC2b4F9541',
			PUT_80_BTC: '0x06c3Ba025bEd24Ea38c2BdDA4bcD2A7F9f5C30e1',
			PUT_80_ETH: '0x77C8d12d9E2D21f6eE02E8ccA332fDe4BE5C2465',
			PUT_90_BTC: '0xe115beD3b0752BBbbEF5C423021b464bBF93dC2c',
			PUT_90_ETH: '0x6B7e5906F53d8bB365f4A6fA776Fd0f0caf57881',
			"CALL-SPREAD_10_BTC": '0x5D0bc0d08e8A7C09d10df9BB2498f1d4aB986e6A',
			"CALL-SPREAD_10_ETH": '0x5c59f7ec23C0Bace3B1959C99A43FFd30078E5bE',
			"CALL-SPREAD_20_BTC": '0x597cdD5D4CEC7FA2851Cc0cfd93d6915c926a107',
			"CALL-SPREAD_20_ETH": '0x4490ad3c0c1A61061E88a3eaD661bFe16225A370',
			"CALL-SPREAD_30_BTC": '0xc822F483dAE467721123eA60D3D233e7ac68802f',
			"CALL-SPREAD_30_ETH": '0x610D7feB49DD18BBC20E4dbe600c53E1cDf6d9F1',
			"PUT-SPREAD_10_BTC": '0x45b9D63F1998ca31151981792849a64342C88631',
			"PUT-SPREAD_10_ETH": '0xc4C3b5050D574CBF3eE0b613104cF5C4E47625d4',
			"PUT-SPREAD_20_BTC": '0x606e34C7008f1425C3a69446de4cAd3D7c6fd96D',
			"PUT-SPREAD_20_ETH": '0xa1c290D16E2290EA536a13Ba7cc3Df0000A0f1A6',
			"PUT-SPREAD_30_BTC": '0x71D89f44C71252f319Cd9652f7886c3834685A58',
			"PUT-SPREAD_30_ETH": '0x8F11Ed84e9Dc76db4392b428A0eAF98Ce72c3752',
	
		},
		medShort: {
			CALL_100_BTC: '0x20ee3e61e8f1eB8ae959abf5F78bA8731d010Ac3',
			CALL_100_ETH: '0x6418C3514923a6464A26A2ffA5f17bF1efC96a21',
			CALL_110_BTC: '0xaFA483B18FE66251C8306C7018028f674F653012',
			CALL_110_ETH: '0xaF38a4d9153B149F05FA85C2cCFAaA677c99040E',
			CALL_120_BTC: '0xFe35F1AB7e18930d4316B86fCefBCF053bf44A45',
			CALL_120_ETH: '0x1060e80c1156060a1E8DdB9C64Afe74564865Ee2',
			CALL_130_BTC: '0xe4DB400BFC4D627559D592db4ca2839cb87Fbbfc',
			CALL_130_ETH: '0xc00103524932d86770d4F671107b0E170BD0fe6c',
			PUT_100_BTC: '0xE0f083fd87ebAEBFCfa8236098048105d32639E4',
			PUT_100_ETH: '0x2739A4C003080A5B3Ade22b92c3321EDa2Da3A9e',
			PUT_70_BTC: '0x52442a8C632D4c998A8BDBf44A70481AA5599b0e',
			PUT_70_ETH: '0x48EcF46Aa51992a064aB172439ABFE182F39b478',
			PUT_80_BTC: '0xb02343D33d2447870E38b3452Ef59d0De7b3289d',
			PUT_80_ETH: '0xb58ccd922B57422d0497904B7D9fccB922b8aaDf',
			PUT_90_BTC: '0x7d0c3FDF0e8A6f475Ed1834ae05fDa1E519fd227',
			PUT_90_ETH: '0x3e2a0fE32Cc000d87D9e5D6ed8b3D64e9c74C752',
			"CALL-SPREAD_10_BTC": '0x6FF946F2BB609B63910a774E193F29CdE7E8fD5f',
			"CALL-SPREAD_10_ETH": '0x0ac1995C43B5566760AD1D88B812f3e51e12eCc6',
			"CALL-SPREAD_20_BTC": '0x7E8e5eaD9A1b8F0533F614a736214a95835c79d7',
			"CALL-SPREAD_20_ETH": '0x1068daF4CD8fDe2000B6FbE8Ec94F106dc08a40E',
			"CALL-SPREAD_30_BTC": '0x3b4900D5a20dbEbCE44eDF8f6B68Dae32E990Ed0',
			"CALL-SPREAD_30_ETH": '0x24db3145F45aAF2c54f586C66b801c42c8658671',
			"PUT-SPREAD_10_BTC": '0x88386f02c46d8D7b2C9E4aEf3b4246A438F72693',
			"PUT-SPREAD_10_ETH": '0x31e6Cd148fe51830E7a97262eE9cf52Fe5256B08',
			"PUT-SPREAD_20_BTC": '0x72Ac8A96b8E79466AdcE711EcBD1Ec5968b371C8',
			"PUT-SPREAD_20_ETH": '0x9e1072E5119C9345d9543a5Ba1EFeDBAE9bEF2AD',
			"PUT-SPREAD_30_BTC": '0x01381e0EDdB57678257179d2cB472C3e8e54202c',
			"PUT-SPREAD_30_ETH": '0xE8dD9Cc3A4Bd078f3D36043f259381d5B50D4B45',
		},
		medLong: {
			CALL_100_BTC: '0x21a4b4441AA957735902507A72A58A3a1Caaa0dC',
			CALL_100_ETH: '0xE377A1a97237b3B89a96d8B731A2ab10d5DaC16C',
			CALL_110_BTC: '0x6c46e2531a42F618F2ae452971DC9a7c6AD48D15',
			CALL_110_ETH: '0x05458B7d9531EaD242290De60bEaa3cC10C87560',
			CALL_120_BTC: '0xe259410Bbfb45CE89FDA81ec0A97d36Da8Db4374',
			CALL_120_ETH: '0x79F87E88088293FE34dEf4eBe71fBFa5367220B4',
			CALL_130_BTC: '0x27806482457FC98F9C2e724b5E604C66BB5ba121',
			CALL_130_ETH: '0xae2F4e15564995af79b7dd2378B2680f7Facc342',
			PUT_100_BTC: '0x035b965c5B7bC20E00358ACF1794d2248eA1932A',
			PUT_100_ETH: '0xf711D0BC60F37cA28845BA623ccd9C635E5073A1',
			PUT_70_BTC: '0x55c4532e1790592120b7b27436842caD203E7CD3',
			PUT_70_ETH: '0xF55F6d98e2F48F8D46757D5A6e225bf0ADC9651C',
			PUT_80_BTC: '0x8dD239e0e51BCAAd503b06D818ce811e7D99c1Af',
			PUT_80_ETH: '0xdF30cdb7abb3Ca707b82359A349D3b0C94d4a421',
			PUT_90_BTC: '0xE56BEAfAe4731A21eF83fe81F63b95055e81E374',
			PUT_90_ETH: '0x33a4B4403B8C6349371CbDf539138D78ec0Aab66',
			"CALL-SPREAD_10_BTC": '0x8e3063D5dCbe66E58053C3Bc8E0BC8dDFe43D585',
			"CALL-SPREAD_10_ETH": '0xBB318170Ce1c2dc79B564f33F92BacaadaBd22de',
			"CALL-SPREAD_20_BTC": '0x324be893029D982c187F0333E7aa1d44365d2676',
			"CALL-SPREAD_20_ETH": '0xb89d7eB2bc675347BEb685ff1bE1557E983beFe1',
			"CALL-SPREAD_30_BTC": '0x530289340C6d2Ef02140054Ae7F91C293fd586CF',
			"CALL-SPREAD_30_ETH": '0x929d20D9e1A6A90bf057857C8BA09271f1BaadA2',
			"PUT-SPREAD_10_BTC": '0x7267091cFc9825a4A1dF36C26d412FeFD788d935',
			"PUT-SPREAD_10_ETH": '0x2B93645f310E016c1a6d1738DCec0f18621F71d0',
			"PUT-SPREAD_20_BTC": '0x9ab2f8530150799CDdAC35799d18Ad2fe05Bf8c3',
			"PUT-SPREAD_20_ETH": '0x4EE21aB8bc165Cd3e6C45676F9f64426Ffc2d67b',
			"PUT-SPREAD_30_BTC": '0xBa883223A1757eEB781d02C383926c308d4843f4',
			"PUT-SPREAD_30_ETH": '0xf87C8C7587055FA62082E8ed447fe68D98805fF2',
		},
		long: {
			CALL_100_BTC: '0xc07fBf677f417bb9FfDD8248A74c7FBcCFaDAe9e',
			CALL_100_ETH: '0x2727B807D22fCAeB7F900F49894054Ed92b9125B',
			CALL_110_BTC: '0x14d25367102A931E2E2F587F4ED94087dc585fd0',
			CALL_110_ETH: '0xE53a20c824cEAB8151AF8Fc92E7Eb689cFbD1231',
			CALL_120_BTC: '0xBAbccB37338488AFBaBECAE2C3D21b9a71289A73',
			CALL_120_ETH: '0xB7b36483B256290435a060805bdF15B3f2b122eb',
			CALL_130_BTC: '0x9fA4DFfBE3B129988e0d09536b0E2D74F6bF7D91',
			CALL_130_ETH: '0x4dC39763ccC861dB1c8e80c34C0079c9A12f03E4',
			PUT_100_BTC: '0xEd46f602212d1CbaCd699C876b4A49761421bf97',
			PUT_100_ETH: '0x015FAA9aF7599e6cea597EBC7e7e04A149a3E992',
			PUT_70_BTC: '0xa26541ccE18CcC6E21360562d34044ceb3B5A40e',
			PUT_70_ETH: '0x5BBe6C4A66D4a48442dc0837a0eA859a11D7766C',
			PUT_80_BTC: '0xFD203c73851986ad7e7B99457AeafF3d98e76228',
			PUT_80_ETH: '0x7FD5E8B2Ef25A105bf6B1c45f62d8925Eaa068Bc',
			PUT_90_BTC: '0x02d730e3dEb3B5876fE2Cba59423ef1Db8211DA1',
			PUT_90_ETH: '0x3031EA515c2274024D93A8D3BfA91ce920E1192E',
			"CALL-SPREAD_10_BTC": '0x0c1C4D9dFd51093bE1e4Bab1b565113B339835F6',
			"CALL-SPREAD_10_ETH": '0xCe5e136688A1553C67b3B39Ff5366595dD0F771E',
			"CALL-SPREAD_20_BTC": '0x7b92a9f268bab14F0FAee4337B01D563AE132Bc3',
			"CALL-SPREAD_20_ETH": '0xe3F646CB987a9d16eb71B8d0883744e55c95862a',
			"CALL-SPREAD_30_BTC": '0x223b806Bab0CA844a91b247fE0Ba179E11EAA728',
			"CALL-SPREAD_30_ETH": '0x199DB958f00F150438E5b9276ff30617D3f83ebF',
			"PUT-SPREAD_10_BTC": '0x66F54921b32cCA36767D2C272Dda64D5152B92C4',
			"PUT-SPREAD_10_ETH": '0xfcd40dDe82b699D455B3D073196d580227C2Fba6',
			"PUT-SPREAD_20_BTC": '0x8c77f5427B40ab2414dC9bca48c74928BFe17Dd1',
			"PUT-SPREAD_20_ETH": '0xbAe8114E3A2EA5aF5e2b3c8F6FF37714f6D4afFB',
			"PUT-SPREAD_30_BTC": '0x6D79b82701e4017887d499Ba131FD336ceA6A4CC',
			"PUT-SPREAD_30_ETH": '0x9945Eb8ac1F4c524fe7Da710ff3068969A329fBA',
		}
	}
}
const HEGIC_PRICE_CALCULATORS_ADDRESSES = {
	[ARBITRUM]: {
		PUT_100_BTC: '0x4567600c2c813322F0CBb358a8d083296A7eEA37',
		PUT_100_ETH: '0xB72FC913e45522cD721252476fEfB7F50a65E23A',
		PUT_70_BTC: '0x3aFbaf00a6C42e6BE67f8a618b17fB3D441C1898',
		PUT_70_ETH: '0xf3625e26cb920f762dEC8DB4fE4845E9384313C0',
		PUT_80_BTC: '0x9C3BBe90191F8311939A34737c02A6B49e27caA5',
		PUT_80_ETH: '0x58051Cb78094551afC202C50085B13bF00BF624E',
		PUT_90_BTC: '0x56A2dC3fAc4bE0A1716c938295e141195e4A1cb3',
		PUT_90_ETH: '0x1AF37c8412bCdAa6C6dD4D2E2aDae2B8292603D4',
		CALL_100_BTC: '0xAA4483Da5c4D17830dE9a843d07C37b3eC028d9F',
		CALL_100_ETH: '0xC62a0b7e480a23BdCfe13EA08BDAceDc278a14C1',
		CALL_110_BTC: '0x04BFC83f6277cf50dFB032EFd348316aACbD7863',
		CALL_110_ETH: '0x6316BC5f5dF141ae88C436Fe6047D334f1B7e485',
		CALL_120_BTC: '0x965Ded687bc0Da3388c6925e0Eb330bD44629B77',
		CALL_120_ETH: '0x321F8A71e8268f50eBd2f748D524E7750AD70798',
		CALL_130_BTC: '0x4b350b7457b54C5A76828f81472f2719D801D0D5',
		CALL_130_ETH: '0xffdc9da896d3301DE596b16a389138B70b1CBAdb',
		"CALL-SPREAD_10_BTC": '0xD3872581C3f7DE832Ecc9Aa51eb525AC9Ffc41d2',
		"CALL-SPREAD_10_ETH": '0x3BC74C993e1E85ffB5e242402aEc3e90DCfa249f',
		"CALL-SPREAD_20_BTC": '0x7f6a7d60c6f7ac50BD0efA677D397d9cd61fC3a9',
		"CALL-SPREAD_20_ETH": '0x8C335E897B04B2Ca569Ec733f6242cDe33917094',
		"CALL-SPREAD_30_BTC": '0x631c5EFb3e9D2536F9c9c9d7635e2B01363C51C5',
		"CALL-SPREAD_30_ETH": '0xAe4897D4d3742F7f9C6A1eA01447EA3061bD6de2',
		"PUT-SPREAD_10_BTC": '0xa4A32102a2c1d3Bf01A73B66571B440795835ff5',
		"PUT-SPREAD_10_ETH": '0x5a4Dc7011CA0be61c42957cDC36D508d45010D8B',
		"PUT-SPREAD_20_BTC": '0x0cC3559beCa7bB605348B1a7B4D90963672C880a',
		"PUT-SPREAD_20_ETH": '0xeb38c2Ba3125733e9636eAB7C3c2e7a2C4A11534',
		"PUT-SPREAD_30_BTC": '0x4CE72803543da3f563Ef76592945C57FBE7fce38',
		"PUT-SPREAD_30_ETH": '0xDB044975100aE87d0eEDd804D9E6083a8406fdAe',
	}
}

const getHegicstrategiesAddressesForChainId = (chainId) => {
	const strategiesAddressesForChainId = HEGIC_STRATEGIES_ADDRESSES[chainId];
	if (!strategiesAddressesForChainId) {
		throw new Error(`No Hegic strategies found for chainId ${chainId}`)
	}

	return strategiesAddressesForChainId;
}

export const getHegicStrategiesAddressesForPeriod = (chainId, periodMs) => {
	const strategiesAddressesForChainId = getHegicstrategiesAddressesForChainId(chainId);
	
	const periodDays = getDaysFromMs(periodMs);
	if (periodDays < 7 || periodDays > 90) {
		return;
	}

	let strategiesAddresses;
	if (periodDays < 14) {
		strategiesAddresses = strategiesAddressesForChainId.short;
	} else if (periodDays < 30) {
		strategiesAddresses = strategiesAddressesForChainId.medShort;
	} else if (periodDays < 60) {
		strategiesAddresses = strategiesAddressesForChainId.medLong;
	} else if (periodDays <= 90) {
		strategiesAddresses = strategiesAddressesForChainId.long;
	}

	return strategiesAddresses;
}

export const getHegicStrategiesAddresses = (chainId) => {
	const strategiesAddresses = {};
	const strategiesAddressesForChainId = getHegicstrategiesAddressesForChainId(chainId);

	Object.values(strategiesAddressesForChainId).forEach((strategiesData, i) => {
		const periodName = Object.keys(strategiesAddresses)[i];
		
		for (const strategyKey in strategiesData) {
			const strategyAddress = strategiesData[strategyKey];
			
			strategiesAddresses[`${strategyKey}_${periodName}`] = strategyAddress;
		}
	})

	return strategiesAddresses;
}

export const getHegicStrategiesAddressesArray = (chainId) => {
	const strategiesAddressesForChainId = getHegicstrategiesAddressesForChainId(chainId);

	const strategiesAddressesArr = [];
	Object.values(strategiesAddressesForChainId).forEach(strategiesData => {
		strategiesAddressesArr.push(...Object.values(strategiesData));
	})

	return strategiesAddressesArr;
}

export const getHegicPriceCalculatorAddress = (chainId, strategyKey) => {
	const priceCalculatorAddressesForChainId = HEGIC_PRICE_CALCULATORS_ADDRESSES[chainId];
	if (!priceCalculatorAddressesForChainId) {
		throw new Error(`No Hegic Price Calculator address found for chainId ${chainId}`);
	}
	
	const priceCalculatorAddress = priceCalculatorAddressesForChainId[strategyKey];
	if (!priceCalculatorAddress) {
		throw new Error(`No Hegic Price Calculator address found for strategy key ${strategyKey}`);
	}

	return priceCalculatorAddress;
}

const getHegicDynamicContract = (chainId, address, type) => {
  const abi = getContractAbi(chainId, `Hegic_${type}`);
  const contract = new ethers.Contract(address, abi, getAlchemyProvider(chainId));

  return contract;
}

export const getHegicPriceCalculatorContract = (chainId, strategyKey) => {
	const address = getHegicPriceCalculatorAddress(chainId, strategyKey);
	const contract = getHegicDynamicContract(chainId, address, "PriceCalculator");

	return contract;
}

export const getHegicStrategyContract = (chainId, address) => {
	const contract = getHegicDynamicContract(chainId, address, "Strategy");
	
	return contract;
}