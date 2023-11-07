import { useChainId } from 'wagmi';
import './RyskSandbox.scss';
import useGodEye from '../../environment/contextHooks/useGodEye/useGodEye';
import { DEFAULT_DECIMALS } from '../../environment/constants/tokensConstants';
import { getTokenByAddress, getTokenBySymbol } from '../../network/tokens';
import { absBigInt, bigIntFromNumber, bringFromDefaultDecimals, bringToDecimals, bringToDefaultDecimals, convertDataToBigInt, divBigIntsSavingDecimals, formatBigInt, multiplyBigIntByNumber, multiplyBigIntsSavingDecimals, negativeBigInt, numberFromBigInt } from '../../utils/dataTypesUtils/bigIntUtils';
import { useEffect } from 'react';
import { roundNumber } from '../../utils/dataTypesUtils/numberUtils';
import { swapFromUSDC, swapToUSDC } from '../../network/helpers/Swapper';
import { getAlchemyProvider, getSigner } from '../../network/providers';
import { BigNumber, ethers } from 'ethers';
import { getContractAbi, getContractAddress, getContractData } from '../../network/contracts/contractsData';
import useTokenPrices from '../../environment/contextHooks/useTokenPrices/useTokenPrices';


const RyskSandbox = () => {
	const chainId = useChainId();
	const { account, isConnected } = useGodEye();
	const tokenPrices = useTokenPrices();


	// Uncomment needed functions and watch console
	
	// Fires on account's change
	useEffect(() => {
		// learnAccountAndIsConnected();
		// learnProviders();
	}, [account]);


	// Fires on tokenPrices' change
	useEffect(() => {
		if (tokenPrices) {
			// learnTokenPrices();
		}
	}, [tokenPrices]);


	// Fires on load
	useEffect(() => {
		// learnGetTokenBy();
		// learnBigIntUtils();
		// learnSwapper();
		// learnContractsData();
	}, []);
	
	
	const learnAccountAndIsConnected = () => {
		if (isConnected) {
			console.log(`User wallet address: ${account}`);
		} else {
			console.log(`Wallet is not connected`);
		}
	}

	const learnProviders = () => {
		// You'll need to put your Alchemy Api Key to providers.js
		let alchemyProvider;
		try {
			alchemyProvider = getAlchemyProvider(chainId);
		} catch(e) { console.log(e) }
		
		const signer = getSigner(); // ethers Web3Provider's signer

		console.log(alchemyProvider, signer);
	}

	const learnBigIntUtils = () => {
		// Source: bigIntUtils.js and numberUtils.js
		console.log('\n--- BigInt Utils ---\n');
		console.log('Default decimals:', DEFAULT_DECIMALS); // 18 decimals
		const ONE_BIG_INT = bigIntFromNumber(1);
		

		// Getting BigInt
		const learnGettingBigInt = () => {
			console.log('\n> Getting BigInt');
			
			console.log(
				'bigIntFromNumber(1):\n',
				bigIntFromNumber(1) // = BigInt(1 * 10**DEFAULT_DECIMALS)
			);
			console.log(
				'bigIntFromNumber(1, 8):\n',
				bigIntFromNumber(1, 8) // = BigInt(1 * 10**8)
			);
		}

		// BigInt Math
		const learnBigIntMath = () => {
			console.log('\n> BigInt Math');

			console.log(
				'multiplyBigIntByNumber(ONE_BIG_INT, 2):\n',
				multiplyBigIntByNumber(ONE_BIG_INT, 2) // = BigInt(2 * 10**DEFAULT_DECIMALS)
			);
	
			console.log(
				'multiplyBigIntsSavingDecimals(\n\tbigIntFromNumber(4),\n\tbigIntFromNumber(2)\n):',
				multiplyBigIntsSavingDecimals(
					bigIntFromNumber(4),
					bigIntFromNumber(2)
				) // = BigInt(8 * 10**DEFAULT_DECIMALS)
			);
	
			console.log(
				'divBigIntsSavingDecimals(\n\tbigIntFromNumber(4),\n\tbigIntFromNumber(2)\n):',
				divBigIntsSavingDecimals(
					bigIntFromNumber(4),
					bigIntFromNumber(2)
				) // = BigInt(2 * 10**DEFAULT_DECIMALS)
			);
	
			console.log(
				'absBigInt(-ONE_BIG_INT):\n',
				absBigInt(-ONE_BIG_INT) // = BigInt(1 * 10**DEFAULT_DECIMALS)
			);
	
			console.log(
				'negativeBigInt(ONE_BIG_INT):\n',
				negativeBigInt(ONE_BIG_INT) // = BigInt(-1 * 10**DEFAULT_DECIMALS)
			);
			console.log(
				'negativeBigInt(-ONE_BIG_INT):\n',
				negativeBigInt(-ONE_BIG_INT) // = BigInt(-1 * 10**DEFAULT_DECIMALS)
			);
		}

		// Changing BigInt decimals
		const learnChangingBigIntDecimals = () => {
			console.log('\n> Changing BigInt decimals');
			
			console.log(
				'bringToDecimals(\n\tbigIntFromNumber(1, 10),\n\t10,\n\t8\n):\n',
				bringToDecimals(
					bigIntFromNumber(1, 10), // = BigInt(1 * 10**10)
					10, // initDecimals
					8 // resultDecimals
				) // = BigInt(1 * 10**8);
			);
	
			console.log(
				'bringFromDefaultDecimals(\n\tONE_BIG_INT,\n\t8\n):\n',
				bringFromDefaultDecimals(
					ONE_BIG_INT, // = BigInt(1 * 10**DEFAULT_DECIMALS)
					8 // resultDecimals
				) // = BigInt(1 * 10**8);
			);
	
			console.log(
				'bringToDefaultDecimals(\n\tbigIntFromNumber(1, 8),\n\t8\n):\n',
				bringToDefaultDecimals(
					bigIntFromNumber(1, 8), // = BigInt(1 * 10**8)
					8 // initDecimals
				) // = BigInt(1 * 10**DEFAULT_DECIMALS);
			);
		}

		// Converting BigInt to other data types
		const learnConvertingBigInt = () => {
			console.log('\n> Converting BigInt to other data types');
			
			// Getting Number
			console.log(
				'numberFromBigInt(ONE_BIG_INT):\n',
				numberFromBigInt(ONE_BIG_INT) // 10**18 / 10**DEFAULT_DECIMALS = 1;
			);
			console.log(
				'numberFromBigInt(1000n, 3):\n',
				numberFromBigInt(1000n, 3) // 1000 / 10**3 = 1 
			);

			// Getting formatted String
			console.log(
				'formatBigInt(\n\tbigIntFromNumber(3000.28)\n):',
				formatBigInt(
					bigIntFromNumber(3000.285129)
				) // = 3,000.28
			);

			console.log(
				'formatBigInt(\n\tbigIntFromNumber(3000.28),\n\t0\n):',
				formatBigInt(
					bigIntFromNumber(3000.285129),
					0
				) // = 3,000
			);
		}

		// Complex BigInt utils
		const learnComplexBigIntUtils = () => {
			console.log('\n> Complex BigInt utils');
			
			// Converting Object with BigNumbers to Object with BigInts
			console.log(
				"convertDataToBigInt({\n\tamount: BigNumber.from(10).pow(18),\n\tpremium: BigNumber.from(35).mul(BigNumber.from(10).pow(18)),\n\tstrategy: 'Long Call',\n}):\n",
				convertDataToBigInt({
					amount: BigNumber.from(10).pow(18),
					premium: BigNumber.from(35).mul(BigNumber.from(10).pow(18)),
					strategy: "Long Call"
				})
			);
		}


		learnGettingBigInt();
		learnBigIntMath();
		learnChangingBigIntDecimals();
		learnConvertingBigInt();
		learnComplexBigIntUtils();
	}

	const learnTokenPrices = () => {
		console.log('\n--- Token Prices ---');
		
		const { ETH: priceETH, BTC: priceBTC } = tokenPrices;
		console.log(`ETH price: ${formatBigInt(priceETH)} | BTC price: ${formatBigInt(priceBTC)}`);
	}
	
	const learnGetTokenBy = () => {
		console.log('\n--- getTokenBy functions ---\n');
		
		const USDT_token = getTokenBySymbol(chainId, "USDT");
		console.log(USDT_token);

		const DAI_address = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
		const DAI_token = getTokenByAddress(chainId, DAI_address);
		console.log(DAI_token);
	}

	const learnSwapper = async () => {
		// Swap to USDC
		const learnSwapToUsdc = async () => {
			const WETH = getTokenBySymbol(chainId, "WETH");
	
			const wethAmount = roundNumber(Math.random(), 6);
			const wethAmountBigInt = bigIntFromNumber(wethAmount);
			
			const usdcAmountBigInt = await swapToUSDC(
				chainId,
				WETH.address,
				wethAmountBigInt
			);
			const usdcAmount = numberFromBigInt(usdcAmountBigInt);
	
			return `${wethAmount} WETH = ${usdcAmount} USDC`;
		}

		// Swap from USDC
		const learnSwapFromUsdc = async () => {
			const WBTC = getTokenBySymbol(chainId, "WBTC");
		
			const usdcAmount = roundNumber(30000 * Math.random(), 6);
			const usdcAmountBigInt = bigIntFromNumber(usdcAmount);
	
			const wbtcAmountBigInt = await swapFromUSDC(
				chainId,
				WBTC.address,
				usdcAmountBigInt
			)
			const wbtcAmount = numberFromBigInt(wbtcAmountBigInt);

			return `${usdcAmount} USDC = ${wbtcAmount} WBTC`;
		}

		Promise.all([
			learnSwapToUsdc(),
			learnSwapFromUsdc()
		]).then(([toUsdcResultStr, fromUsdcResultStr]) => {
			console.log('\n--- Swapper ---\n');
			console.log(toUsdcResultStr);
			console.log(fromUsdcResultStr);
		})
	}

	const learnContractsData = () => {
		// You should put data of any contracts you use to contractsData.js,
		// watch for comments there to guide you

		console.log('\n--- Contracts Data ---');

		const USDCe_contract = new ethers.Contract(
			...getContractData(chainId, "USDC.e"),
			getSigner() // or getAlchemyProvider for readonly purposes
		);
		console.log(`USDC.e contract:\n`, USDCe_contract);

		const UniswapQuoter_address = getContractAddress(chainId, "Uniswap_Quoter");
		console.log(`Uniswap Quoter address: ${UniswapQuoter_address}`);

		const UniswapQuoter_abi = getContractAbi(chainId, "Uniswap_Quoter");
		console.log(`Uniswap Quoter abi:\n`, UniswapQuoter_abi);
	}

	return (
		<div className="RyskSandbox">
			<h1>Rysk.Finance SDK</h1>

			<div className="text-center muted_light">
				Uncomment needed functions and watch console
			</div>
		</div>
	);
};

export default RyskSandbox;