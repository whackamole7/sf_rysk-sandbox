import StrikeChooser from "./StrikeChooser/StrikeChooser";
import { awaitLoading } from '../../../../../../../utils/commonUtils';
import { useEffect } from "react";
import { fetchHegicStrikesData } from "../../../../../../../network/fetchers/fetchHegicStrikesData";
import { useChainId } from "wagmi";
import { echoStrikeChoice, getIsBuy, getIsCall } from '../../../../builderUtils';
import cx from "classnames";
import { fetchLyraStrikesData } from "../../../../../../../network/fetchers/fetchLyraStrikesData";
import useGodEye from "../../../../../../../environment/contextHooks/useGodEye/useGodEye";
import Spinner from "../../../../../../../components/UI/Spinner/Spinner";
import { fillStrikesDataArrWithNullStrikes, getUnitedStrikesDataArr } from "./strikeUtils";
import { getEchoedStrikesIds } from "../../../../builderUtils";
import { deformatNumberFromInputString } from "../../../../../../../utils/dataTypesUtils/numberUtils";


const StrikeField = (props) => {
	const {
		asset,
		strategy,
		amountStr,
		chosenDate,
		strategyStructure,
		hasSell,
		strikesDataArrState,
		chosenStrikesState,
		areStrikesLoadingState,
		lyraMarket,
		updateTriggers,
		resetTriggers,
		updateUnstableField,
	} = props;

	const chainId = useChainId();
	const { account } = useGodEye();

	const [strikesDataArr, setStrikesDataArr] = strikesDataArrState;
	const [chosenStrikes, setChosenStrikes] = chosenStrikesState;
	const [areStrikesLoading, setAreStrikesLoading] = areStrikesLoadingState;

	
	const updateStrikesDataArr = () => {
		setAreStrikesLoading(true);
		const fetchPromises = [];
		
		strategyStructure.forEach((structureKey, i) => {
			const strikeParams = {
				asset,
				amount: deformatNumberFromInputString(amountStr),
				expiry: chosenDate,
				isCall: getIsCall(structureKey),
				isBuy: getIsBuy(structureKey)
			}
			
			strikesDataArr[i] = {};
			const embedInStrikesData = (data) => {
				strikesDataArr[i] = {...strikesDataArr[i], ...data };
			}

			if (strikeParams.isBuy) {
				fetchPromises.push(
					fetchHegicStrikesData(chainId, { ...strikeParams })
						.then(embedInStrikesData)
				)
			}

			if (lyraMarket) {
				fetchPromises.push(
					fetchLyraStrikesData(chainId, lyraMarket, { ...strikeParams }, account)
						.then(embedInStrikesData)
				);
			}
		});

		Promise.all(fetchPromises)
			.then(() => {
				const unitedStrikesDataArr = getUnitedStrikesDataArr(strikesDataArr);
				const filledStrikesDataArr = fillStrikesDataArrWithNullStrikes(unitedStrikesDataArr);
				setStrikesDataArr([...filledStrikesDataArr]);
				setAreStrikesLoading(false);
			})
	}
	
	const resetChosenStrikes = () => {
		setChosenStrikes([]);
	}
	const resetStrikesDataArr = () => {
		setStrikesDataArr([]);
	}
	
	useEffect(() => {
		resetChosenStrikes();
		resetStrikesDataArr();
	}, resetTriggers);

	useEffect(() => {
		if (chosenDate) {
			updateStrikesDataArr();
		}
	}, updateTriggers);

	

	return (
		<div className={cx(
			"BuilderForm__field",
			"BuilderForm__field_strike",
			!hasSell && "col-span-2"
		)}>
			<div className="BuilderForm__field-header">
				<span className="tip" data-tooltip-id="BuilderForm_StrikeTooltip">
					Strike
				</span>
			</div>
			<div className="BuilderForm__field-body">
				{strategyStructure.map((structureKey, i) => {
					const echoedStrikesIds = getEchoedStrikesIds(strategy);
					const isStrikeEchoed = echoedStrikesIds
						&& echoedStrikesIds.indexOf(i) !== -1;
					
					const strikeNode = awaitLoading(
						<StrikeChooser
							key={i}
							id={i}
							isAutoSelectEnabled={strategyStructure.length === 1}
							structureKey={structureKey}
							asset={asset}
							amountStr={amountStr}
							strikesData={strikesDataArr[i]}
							chosenStrikeData={chosenStrikes[i]}
							setChosenStrikeData={(strikeData) => {
								chosenStrikes[i] = strikeData;

								if (isStrikeEchoed) {
									const strike = strikeData.strike;
									const market = strikeData.market;
									
									const dependentStrikesIds = echoedStrikesIds.filter(id => id !== i);
									dependentStrikesIds.forEach(id => {
										const echoedStrikeData = echoStrikeChoice(
											strikesDataArr[id][strike],
											market
										);
										
										chosenStrikes[id] = echoedStrikeData;
									});
								}
								
								setChosenStrikes([...chosenStrikes]);
							}}
						/>,
						areStrikesLoading,
						<Spinner key={i} />
					);

					updateUnstableField(i, strikeNode);
					
					return strikeNode;
				})}
			</div>
		</div>
	);
};

export default StrikeField;