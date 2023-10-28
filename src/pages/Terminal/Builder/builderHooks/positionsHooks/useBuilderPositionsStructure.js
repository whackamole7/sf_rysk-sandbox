import useSWR from "swr";
import useGodEye from '../../../../../environment/contextHooks/useGodEye/useGodEye';
import { getAlchemyProvider } from '../../../../../network/providers';
import { useChainId } from "wagmi";
import { BUILDER_STRATEGIES, BUILDER_STRATEGIES_CONFIG } from '../../builderConstants';
import { ethers } from "ethers";
import { getContractData } from '../../../../../network/contracts/contractsData';
import { getTxBuilderMarketsContracts } from '../../builderUtils';
import { resolvePromisesPack } from './../../../../../utils/asyncUtils';
import { getMsInDays } from "../../../../../utils/dateUtils";
import { EXPIRY_PERIODS_IN_MS } from "../../../../../environment/constants/optionsConstants";
import { MILISECONDS_IN_SECOND } from "../../../../../environment/constants/dateConstants";


const PROMISES_LIMIT = 6;


const useBuilderPositionsStructure = () => {
	const { isConnected, account } = useGodEye();
	const chainId = useChainId();

	const TxBuilder = new ethers.Contract(
		...getContractData(chainId, "TxBuilder"),
		getAlchemyProvider(chainId)
	);
	
	const { data: positionsStructure, error: positionsStructureError } = useSWR(
		isConnected && [account, "useBuilderPositionsStructure"],
		async () => {
			const positions = [];

			const buildEvents = await getBuildEventsByAccount(TxBuilder, account);
			
			const promisesPack = [];

			for (let i = 0; i < buildEvents.length; i++) {
				const buildEvent = buildEvents[i];
				const { buildID: buildId, productType } = buildEvent.args;

				const strategy = BUILDER_STRATEGIES.find(strategy => {
					return BUILDER_STRATEGIES_CONFIG[strategy].key === productType.toNumber();
				});

				const position = {
					strategy,
					buildId: buildId.toNumber(),
					childPositionsStructure: [],
				};

				const marketsEvents = getMarketsEventsByBuildId(chainId, buildId);
				const marketsEventsPromises = [];
				for (const market in marketsEvents) {
					const eventsPromises = marketsEvents[market];
					
					eventsPromises.forEach(promise => {
						promise.then(events => {
							updateChildPositionsStructureByEvents(events, market, position.childPositionsStructure);
						})

						marketsEventsPromises.push(promise);
					})
				}

				const totalMarketsEventsPromise = (
					Promise.all(marketsEventsPromises).then(() => {
						positions.push(position);
					})
				)

				promisesPack.push(totalMarketsEventsPromise);

				await resolvePromisesPack(promisesPack, PROMISES_LIMIT, buildEvents.length, i);
			}

			return positions;
		},
		{ refreshInterval: 20000 }
	)

	if (positionsStructureError) {
		console.log('Builder Positions error:\n', positionsStructureError);
		return;
	}

	return positionsStructure;
}


const getMarketsEventsByBuildId = (chainId, buildId) => {
	const { Hegic, Lyra_ETH, Lyra_BTC } = getTxBuilderMarketsContracts(chainId);
	
	const { OpenPositionByHegic: openByHegicFilter } = Hegic.filters;
	const { OpenPositionByLyra: openByLyraFilter_ETH } = Lyra_ETH.filters;
	const { OpenPositionByLyra: openByLyraFilter_BTC } = Lyra_BTC.filters;

	const hegicEvents = [
		Hegic.queryFilter(openByHegicFilter(buildId))
	];
	const lyraEvents = [
		Lyra_ETH.queryFilter(openByLyraFilter_ETH(buildId)),
		Lyra_BTC.queryFilter(openByLyraFilter_BTC(buildId))
	]

	return {
		Hegic: hegicEvents,
		Lyra: lyraEvents,
	}
}

const getBuildEventsByAccount = (TxBuilder, account) => {
	const { CreateBuild: createBuildFilter } = TxBuilder.filters;
	
	const buildEvents = (
		TxBuilder.queryFilter(createBuildFilter(null, account))
	).then(events => {
		const eventsRelevancePromises = events.map((event) => {
			return waitIsBuildEventRelevant(event, TxBuilder.provider)
		});

		return (
			Promise.all(eventsRelevancePromises).then(eventsRelevance => {
				const relevantEvents = events.filter((event, i) => {
					if (eventsRelevance[i]) {
						return true;
					}
				})
	
				return relevantEvents.reverse();
			})
		)
	});

	return buildEvents;
}

const waitIsBuildEventRelevant = (event, provider) => {
	return (
		provider.getBlock(event.blockNumber)
			.then(block => {
				const maxExpiryPeriod = EXPIRY_PERIODS_IN_MS[EXPIRY_PERIODS_IN_MS.length - 1];
				const oldestBlockTime = Date.now() - maxExpiryPeriod - getMsInDays(1);
				
				const blockTime = block.timestamp * MILISECONDS_IN_SECOND;

				if (blockTime > oldestBlockTime) {
					return true;
				}
			})
	)
}

const updateChildPositionsStructureByEvents = (events, market, childPositionsStructure) => {
	events.forEach(event => {
		const id = event.args.tokenID;

		childPositionsStructure.push({
			market,
			id: id.toNumber()
		});
	})
}

export default useBuilderPositionsStructure;