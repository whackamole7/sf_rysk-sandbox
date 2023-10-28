import AmountField from './AmountField/AmountField';
import AssetField from './AssetField/AssetField';
import StrategyField from './StrategyField/StrategyField';
import DateField from './DateField/DateField';
import { useEffect, useState } from 'react';
import StrikeField from './StrikeField/StrikeField';
import { useChainId } from 'wagmi';
import { getLyra } from '../../../../../../network/providers';
import { BUILDER_STRATEGIES_CONFIG } from '../../../builderConstants';
import CollateralField from './CollateralField/CollateralField';
import { getStrategyHasSell } from '../../../builderUtils';
import BuilderMobileContainer from './BuilderMobileContainer/BuilderMobileContainer';


const BuilderFields = (props) => {
	const {
		assetState,
		strategyState,
		amountStrState,

		dateListState,
		chosenDateState,

		strikesDataArrState,
		chosenStrikesState,

		collateralDataArrState,
	} = props;

	
	const [asset, ] = assetState;
	const [strategy, ] = strategyState;
	const [amountStr, ] = amountStrState;
	const [chosenDate, ] = chosenDateState;

	const strategyStructure = BUILDER_STRATEGIES_CONFIG[strategy].structure;
	const hasSell = getStrategyHasSell(strategyStructure);

	const areStrikesLoadingState = useState(false);
	const [areStrikesLoading, ] = areStrikesLoadingState;
	const [chosenStrikes, ] = chosenStrikesState;
	const [strikesDataArr, ] = strikesDataArrState;
	
	const chainId = useChainId();
	const LYRA = getLyra(chainId);
	const [lyraMarket, setLyraMarket] = useState(undefined);

	const updateLyraMarket = () => {
		setLyraMarket(undefined);

		const assetWrapped = `W${asset}`;
		LYRA.markets().then(markets => {
			const market = markets.find(market => {
				return market.baseToken.symbol === assetWrapped;
			});

			setLyraMarket(market ?? null);
		})
	}

	useEffect(() => {
		updateLyraMarket();
	}, [asset]);
	
	const updateTriggers = {
		date: [asset, lyraMarket],
		strike: [chosenDate],
		collateral: [amountStr],
	}

	const resetTriggers = {
		date: [asset, strategy],
		strike: [asset, strategy, chosenDate],
		collateral: [asset, strategy, chosenDate],
		unstableFields: [strategy]
	}


	const [unstableFields, setUnstableFields] = useState({
		date: [], strike: [], collateral: []
	});

	const updateUnstableField = (fieldName, fieldId, value) => {
		unstableFields[fieldName][fieldId] = value;
	}

	useEffect(() => {
		setUnstableFields({ date: [], strike: [], collateral: []});
	}, resetTriggers.unstableFields);

	return (
		<div className="BuilderForm__fields">
			<AssetField
				assetState={assetState}
				isDisabled={areStrikesLoading}
			/>
			<StrategyField
				strategyState={strategyState}
				isDisabled={areStrikesLoading}
			/>
			<AmountField
				amountStrState={amountStrState}
				strategy={strategy}
			/>

			<DateField
				strategyStructure={strategyStructure}
				dateListState={dateListState}
				chosenDateState={chosenDateState}
				lyraMarket={lyraMarket}
				updateTriggers={updateTriggers.date}
				resetTriggers={resetTriggers.date}
				isDisabled={areStrikesLoading}
				updateUnstableField={(i, value) => {
					updateUnstableField("date", i, value);
				}}
			/>
			<StrikeField
				asset={asset}
				strategy={strategy}
				amountStr={amountStr}
				chosenDate={chosenDate}
				strategyStructure={strategyStructure}
				hasSell={hasSell}
				strikesDataArrState={strikesDataArrState}
				chosenStrikesState={chosenStrikesState}
				areStrikesLoadingState={areStrikesLoadingState}
				lyraMarket={lyraMarket}
				updateTriggers={updateTriggers.strike}
				resetTriggers={resetTriggers.strike}
				updateUnstableField={(i, value) => {
					updateUnstableField("strike", i, value);
				}}
			/>
			<CollateralField
				asset={asset}
				strategy={strategy}
				amountStr={amountStr}
				strategyStructure={strategyStructure}
				hasSell={hasSell}
				chosenStrikes={chosenStrikes}
				collateralDataArrState={collateralDataArrState}
				updateTriggers={updateTriggers.collateral}
				resetTriggers={resetTriggers.collateral}
				updateUnstableField={(i, value) => {
					updateUnstableField("collateral", i, value);
				}}
			/>
			<BuilderMobileContainer
				strategyStructure={strategyStructure}
				unstableFields={unstableFields}
				chosenStrikes={chosenStrikes}
				strikesDataArr={strikesDataArr}
				areStrikesLoading={areStrikesLoading}
			/>
		</div>
	);
};

export default BuilderFields;