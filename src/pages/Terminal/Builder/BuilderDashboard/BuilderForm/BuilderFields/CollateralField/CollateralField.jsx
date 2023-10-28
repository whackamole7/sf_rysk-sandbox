import { getCollateralTokens, getIsBuy } from '../../../../builderUtils';
import { bigIntFromNumber } from '../../../../../../../utils/dataTypesUtils/bigIntUtils';
import { deformatNumberFromInputString } from '../../../../../../../utils/dataTypesUtils/numberUtils';
import CollateralChooser from './CollateralChooser/CollateralChooser';
import { getIsWrapped } from '../../../../../../../utils/tokenUtils';
import { BigNumber } from 'ethers';
import { useEffect } from 'react';
import { getMutedNode } from '../../../../../../../utils/commonUtils';


const CollateralField = (props) => {
	const {
		asset,
		amountStr,
		strategy,
		strategyStructure,
		hasSell,
		chosenStrikes,
		collateralDataArrState,
		updateTriggers,
		resetTriggers,
		updateUnstableField,
	} = props;

	const [collateralDataArr, setCollateralDataArr] = collateralDataArrState;
	

	const resetCollateralDataArr = () => {
		setCollateralDataArr([]);
	}

	useEffect(() => {
		resetCollateralDataArr();
	}, resetTriggers);


	const setCollateralData = (i, data) => {
		collateralDataArr[i] = data;
		setCollateralDataArr([...collateralDataArr]);
	}

	const getCollateralData = (i, collateralToken, collateralAmountBigInt) => {
		const chosenStrike = chosenStrikes[i];
		if (!chosenStrike || !chosenStrike.utils.getCollateralData) {
			return new Promise(() => {});
		}
		
		const amountBigInt = bigIntFromNumber(
			deformatNumberFromInputString(amountStr)
		);

		const isBase = getIsWrapped(collateralToken);
		const collateralAmountBigNum = BigNumber.from(collateralAmountBigInt ?? 0);

		return chosenStrike.utils.getCollateralData(
			amountBigInt,
			{
				isBaseCollateral: isBase,
				setToCollateral: collateralAmountBigNum,
			}
		);
	}

	if (!hasSell) {
		return null;
	}

	return (
		<div className="BuilderForm__field BuilderForm__field_collateral">
			<div className="BuilderForm__field-header">
				<span className="tip" data-tooltip-id="BuilderForm_CollateralTooltip">
					Collateral
				</span>
			</div>
			<div className="BuilderForm__field-body">
				{strategyStructure.map((structureKey, i) => {
					const isBuy = getIsBuy(structureKey);
					if (isBuy) {
						return (
							<div key={i} className='BuilderForm__field-empty-row'>
								{getMutedNode()}
							</div>
						);
					}

					const chosenStrike = chosenStrikes[i];
					const collateralTokens = getCollateralTokens(structureKey, strategy, asset);

					const isInLastHalf = i > ((strategyStructure.length - 1) / 2);

					const collateralNode =(
						<CollateralChooser
							key={i}
							isInLastHalf={isInLastHalf}
							collateralTokens={collateralTokens}
							collateralData={collateralDataArr[i]}
							setCollateralData={(data) => setCollateralData(i, data)}
							getCollateralData={(collateralToken, collateralAmountBigInt) => {
								return getCollateralData(i, collateralToken, collateralAmountBigInt);
							}}
							chosenStrike={chosenStrike}
							updateTriggers={updateTriggers}
							resetTriggers={resetTriggers}
						/>
					)
						
					
					updateUnstableField(i, collateralNode);
					
					return collateralNode;
				})}
			</div>
		</div>
	);
};

export default CollateralField;