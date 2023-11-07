import { numberFromBigInt } from '../../../../../../../../utils/dataTypesUtils/bigIntUtils';
import { compareNumeric } from '../../../../../../../../utils/dataTypesUtils/arrayUtils';
import { compareObjectsByNumericValue } from '../../../../../../../../utils/dataTypesUtils/objectUtils';
import './StrikeChooser.scss';
import Button from '../../../../../../../../components/UI/Button/Button';
import { checkIsOptionITM } from '../../../../../../../../utils/optionsUtils';
import cx from "classnames";
import { useTogglePopup } from '../../../../../../../../hooks/useTogglePopup';
import StrikeInfoBox from './StrikeInfoBox/StrikeInfoBox';
import InnerWarning from '../../../../../../../../components/UI/InnerWarning/InnerWarning';
import { useEffect, useState } from 'react';
import StrikeCarousel from './StrikeCarousel/StrikeCarousel';
import useGodEye from '../../../../../../../../environment/contextHooks/useGodEye/useGodEye';
import { getStrikesFromStrikesData } from '../strikeUtils';
import StrikeCurrentPriceItem from './StrikeCurrentPriceItem/StrikeCurrentPriceItem';
import StrikeAbsentItem from './StrikeAbsentItem/StrikeAbsentItem';
import { getHasSufficientStrikes, getIsCall } from '../../../../../builderUtils';
import { MARKETS_ICONS } from '../../../../../../../../environment/constants/optionsConstants';
import { separateThousands } from '../../../../../../../../utils/dataTypesUtils/numberUtils';
import useIsMobile from './../../../../../../../../hooks/windowDimensionsHooks/useIsMobile';
import useTokenPriceBySymbol from './../../../../../../../../environment/contextHooks/useTokenPrices/useTokenPriceBySymbol';


const StrikeChooser = ({
	className,
	id,
	isAutoSelectEnabled,
	structureKey,
	asset,
	amountStr,
	strikesData,
	chosenStrikeData,
	setChosenStrikeData,
}) => {

	const { isConnected } = useGodEye();
	
	const currentPriceBigInt = useTokenPriceBySymbol(asset);
	const currentPrice = Math.floor(
		numberFromBigInt(currentPriceBigInt)
	);

	const isFirstRow = id === 0;

	const isMobile = useIsMobile();

	const [chosenStrikeMarketsDataArr, setChosenStrikeMarketsDataArr] = useState(null);

	// todo: auto-select
	/* useEffect(() => {
		if (isAutoSelectEnabled && strikesData && !chosenStrikeData) {
			const firstMarketsStrikeData = Object.values(strikesData).find(marketsData => {
				const firstMarketStrikeData = marketsData[0];

				return !firstMarketStrikeData.isDummy;
			});

			if (!firstMarketsStrikeData) {
				return;
			}
			
			const firstStrikeData = firstMarketsStrikeData[0];
			
			setChosenStrikeData(firstStrikeData);
		}
	}, [strikesData]); */
	

	const clearStrikesDataOfCurrentPrice = (strikesData) => {
		const clearedStrikesData = {};
		
		for (const strike in strikesData) {
			const strikeMarketsData = strikesData[strike];
			const firstMarketStrikeData = strikeMarketsData[0];

			const { isCurrentPrice, isDummy } = firstMarketStrikeData;
			
			if ( !(isCurrentPrice && isDummy) ) {
				clearedStrikesData[strike] = strikesData[strike];
			}
		}

		return clearedStrikesData;
	}

	// todo: refactor
	const getStrikesDataWithCurrentPrice = () => {
		const resultStrikesData = clearStrikesDataOfCurrentPrice(strikesData);

		let currentPriceStrikeData;
		for (const strike in strikesData) {
			const firstMarketStrikeData = strikesData[strike][0];

			const isCurrentPrice = firstMarketStrikeData.isCurrentPrice ||
				currentPrice === firstMarketStrikeData.strike;
			
			if (isCurrentPrice) {
				firstMarketStrikeData.isCurrentPrice = true;
				currentPriceStrikeData = firstMarketStrikeData;
				break;
			}
		}
		
		if (!currentPriceStrikeData) {
			resultStrikesData[currentPrice] = [{
				strike: currentPrice,
				isCurrentPrice: true,
				isDummy: true,
			}];
		}

		return resultStrikesData;
	}

	const getSortedStrikesAndDataArr = () => {
		if (strikesData) {
			if (!getHasSufficientStrikes(strikesData)) {
				return {
					strikes: [],
					dataArr: []
				}
			}
			
			let strikesDataWithCurrentPrice = getStrikesDataWithCurrentPrice();

			const strikes = getStrikesFromStrikesData(strikesDataWithCurrentPrice)
				.sort(compareNumeric);
				
			const dataArr = Object.values(strikesDataWithCurrentPrice)
				.sort((prev, cur) => {
					const firstPrevData = prev[0];
					const firstCurData = cur[0];
					
					return (
						compareObjectsByNumericValue(firstPrevData, firstCurData, "strike")
					);
				});

			return {
				strikes,
				dataArr
			}
		}

		return {};
	}

	const { strikes, dataArr } = getSortedStrikesAndDataArr();
	const hasStrikes = Boolean(strikes?.length);


	const {
		openPopup: openStrikeInfo,
		closePopup: closeStrikeInfo,
		isOpen: isStrikeInfoOpen,
	} = useTogglePopup(() => setChosenStrikeMarketsDataArr(null));


	const getStrikeCarousel = () => {
		return (
			<StrikeCarousel asset={asset}>
				{strikes.map((strike, i) => {
					const strikeMarketsDataArr = dataArr[i];
					const templateStrikeData = strikeMarketsDataArr[0];
					const { isCurrentPrice, isAbsent, isDummy } = templateStrikeData;

					if (isCurrentPrice && isDummy) {
						return (
							<StrikeCurrentPriceItem
								key={`current_price`}
								currentPrice={strike}
								isFirst={isFirstRow}
							/>
						)
					}

					const isCall = getIsCall(structureKey);
					const isITM = checkIsOptionITM(isCall, strike, currentPrice);

					if (isAbsent) {
						return (
							<StrikeAbsentItem key={i} isITM={isITM} />
						)
					}
					
					const isChosen = chosenStrikeData
						&& (chosenStrikeData.strike === strike);
					
					const chosenMarket = isChosen && chosenStrikeData.market;

					const isOpen = chosenStrikeMarketsDataArr === strikeMarketsDataArr;

					return (
						<Button
							key={strike}
							className={cx(
								"StrikeChooser__item",
								isITM && "StrikeChooser__item_ITM",
								isChosen && "chosen",
								isOpen && "open",
								isCurrentPrice && cx(
									"StrikeCurrentPriceItem",
									isFirstRow && "StrikeCurrentPriceItem_first"
								)
							)}
							style={{cursor: "pointer"}}
							type="stroke"
							onClick={(e) => {
								if (isStrikeInfoOpen) {
									e.stopPropagation();
								}
								setChosenStrikeMarketsDataArr(strikeMarketsDataArr);
								openStrikeInfo();
							}}
						>
							{isChosen && (
								<div className="StrikeChooser__item-market">
									<img src={MARKETS_ICONS[chosenMarket].circledLight} alt={`${chosenMarket} icon`} />
								</div>
							)}
							<span>
								${separateThousands(strike)}
							</span>
						</Button>
					)
				})}
			</StrikeCarousel>
		)
	}

	const getStrikeChooserContent = () => {
		if (strikesData) {
			if (hasStrikes) {
				return (
					<div className="StrikeChooser__items" style={{zIndex: (10 - id*2)}}>
						{getStrikeCarousel()}
					</div>
				)
			} else {
				return (
					<InnerWarning>
						No Liquidity
					</InnerWarning>
				)
			}
		} else {
			return (
				<InnerWarning>
					{!isConnected ? "Connect wallet and c" : "C"}hoose expiration date to view strikes
				</InnerWarning>
			)
		}
	}

	
	return (
		<div className={cx("StrikeChooser", className, (isMobile && !strikesData) && "hidden")}>
			{getStrikeChooserContent()}

			<StrikeInfoBox
				id={id}
				amountStr={amountStr}
				strikeMarketsDataArr={chosenStrikeMarketsDataArr}
				chosenStrikeData={chosenStrikeData}
				setChosenStrikeData={setChosenStrikeData}
				isOpen={isStrikeInfoOpen}
				close={closeStrikeInfo}
			/>
		</div>
	);
};

export default StrikeChooser;