import { BigNumber, ethers } from "ethers";
import { getContractData } from "../../../../network/contracts/contractsData";
import { useChainId } from "wagmi";
import { getAlchemyProvider, getSigner } from "../../../../network/providers";
import { useState } from "react";
import { BUILDER_PROTOCOL_TYPES, BUILDER_STRATEGIES_CONFIG } from "../builderConstants";
import Swapper, { getSwapperPath } from "../../../../network/helpers/Swapper";
import { bringFromDefaultDecimals, numberFromBigInt } from "../../../../utils/dataTypesUtils/bigIntUtils";
import { sendTransaction } from "../../../../network/contracts/contractsUtils";
import { getBigIntWithSlippage } from "../../../../utils/optionsUtils";


const useBuildBuyer = (
	strategy,
	chosenStrikes,
	collateralDataArr,
	youPay,
	swapSlippage,
	interactionFns = {
		setIsLoading: () => {},
		closeModal: () => {},
		addPendingPosition: () => {}
	}
) => {
	const chainId = useChainId();
	const strategyConfig = BUILDER_STRATEGIES_CONFIG[strategy];

	const { setIsLoading, closeModal, addPendingPosition } = interactionFns;
	const { paymentToken, decomposition: paymentDecomposition } = youPay;
	const isETH = paymentToken.isETH;

	const [buyArgs, setBuyArgs] = useState({
		moduleArr: [],
		parametersArr: [],
		swapDataArr: [],
		productType: strategyConfig.key,
	});
	const [ethAmountsIn, setEthAmountsIn] = useState([]);

	const sumEthAmountsIn = () => {
		const sum = ethAmountsIn.reduce((sum, cur) => {
			return sum + cur;
		}, 0n);

		return sum;
	}
	
	const TxBuilder = new ethers.Contract(
		...getContractData(chainId, "TxBuilder"),
		getSigner()
	);

	const fillModuleArr = (strike, i) => {
		const protocolType = BUILDER_PROTOCOL_TYPES[strike.protocolName];
		
		return(
			TxBuilder.module(protocolType)
				.then(module => {
					buyArgs.moduleArr[i] = module;
				})
		);
	}

	const fillParametersArr = (strike, i) => {
		const collateralData = collateralDataArr[i];
		
		const options = {
			setToCollateral: collateralData && BigNumber.from(collateralData.inMarketToken),
			isBaseCollateral: collateralData?.isBase,
			premiumInMarketToken: strike.premiumData.inMarketToken,
		}
		
		return(
			strike.utils.getBuilderParams(strike.amount, options, paymentToken.decimals)
				.then(params => {
					buyArgs.parametersArr[i] = params;
				})
		);
	}

	const fillSwapDataArr = (strike, i) => {
		const decompositionItem = paymentDecomposition[i];
		
		const Exchanger = new ethers.Contract(
			...getContractData(chainId, "Exchanger"),
			getAlchemyProvider(chainId)
		);

		const marketToken = decompositionItem.marketToken;

		const path = getSwapperPath(paymentToken.address, marketToken.address);
		const amountOutMinimum = decompositionItem.inMarketToken;
		
		const shouldSwap = paymentToken.address !== marketToken.address;

		return (
			Swapper(chainId, marketToken.address, paymentToken.address, amountOutMinimum)
				.then(amountIn => {
					const amountInWithSlippage = getBigIntWithSlippage(amountIn, swapSlippage);

					return amountInWithSlippage;
				}).then(amountIn => {
					if (isETH) {
						ethAmountsIn.push(amountIn);
						setEthAmountsIn([...ethAmountsIn]);
					}

					return (
						Exchanger.encodeFromExchange({
							path,
							tokenIn: paymentToken.address,
							tokenOut: marketToken.address,
							amountIn: bringFromDefaultDecimals(
								amountIn,
								paymentToken.decimals,
							),
							amountOutMinimum: bringFromDefaultDecimals(
								amountOutMinimum,
								marketToken.decimals
							),
							isETH,
							swap: shouldSwap
						}).then((swapData) => {
							buyArgs.swapDataArr[i] = swapData;
						})
					)
				})
		)
	}

	const fillBuyArgs = () => {
		const promises = [];
		
		chosenStrikes.forEach((strike, i) => {
			promises.push(
				fillModuleArr(strike, i),
				fillParametersArr(strike, i),
				fillSwapDataArr(strike, i),
			)
		})

		return (
			Promise.all(promises)
				.then(() => {
					setBuyArgs({ ...buyArgs });
				}).catch(() => setIsLoading(false))
		);
	}

	const buyBuild = () => {
		setIsLoading(true);
		const { amount, asset } = chosenStrikes[0];
		
		// todo: fix pending
		/* addPendingPosition({
			id: `Opening_${strategy}_${numberFromBigInt(amount)}_${numberFromBigInt(youPay.inUSDC)}`,
			strategy,
			market: "Hegic",
			amount,
			asset,
			premium: -youPay.inUSDC,
		}); */
		
		return (
			fillBuyArgs().then(() => {
				const amountNum = numberFromBigInt(amount);
				const isPlural = amountNum !== 1;
				const pluralStr = strategyConfig.plural ?? `${strategy}s`;

				return (
					sendTransaction(
						chainId,
						TxBuilder.consolidationOfTransactions,
						[
							buyArgs.moduleArr,
							buyArgs.parametersArr,
							buyArgs.swapDataArr,
							buyArgs.productType,
							ethAmountsIn.length
								? { value: sumEthAmountsIn(), }
								: {},
						],
						`${amountNum} ${isPlural ? pluralStr : strategy} opened.`,
						setIsLoading,
						closeModal
					)
				)
			}).then(() => {
				setEthAmountsIn([]);
			})
		)
	}

	return buyBuild;
}

export default useBuildBuyer;