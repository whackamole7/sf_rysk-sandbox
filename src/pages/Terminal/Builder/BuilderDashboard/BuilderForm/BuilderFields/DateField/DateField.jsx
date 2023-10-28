import Selector from '../../../../../../../components/UI/Selector/Selector';
import { format } from 'date-fns';
import { awaitLoading,  } from '../../../../../../../utils/commonUtils';
import { compareNumeric, getUniqueValuesFromArr } from '../../../../../../../utils/dataTypesUtils/arrayUtils';
import { useEffect, useState } from 'react';
import { MILISECONDS_IN_SECOND } from '../../../../../../../environment/constants/dateConstants';
import cx from "classnames";
import Spinner from '../../../../../../../components/UI/Spinner/Spinner';
import { getIsBuy, getIsCall } from '../../../../builderUtils';
import useGodEye from '../../../../../../../environment/contextHooks/useGodEye/useGodEye';
import { getExpiryDatesForOptions } from '../../../../../../../utils/optionsUtils';
import { getTimeLeftString } from '../../../../../../../utils/dateUtils';
import './DateField.scss';



const DateField = (props) => {
	const {
		strategyStructure,
		dateListState,
		chosenDateState,
		lyraMarket,
		updateTriggers,
		resetTriggers,
		isDisabled,
		updateUnstableField,
	} = props;

	const [dateList, setDateList] = dateListState;
	const [isDateListLoading, setIsDateListLoading] = useState(false);
	const [chosenDate, setChosenDate] = chosenDateState;
	const { account } = useGodEye();

	const updateDateList = () => {
		setIsDateListLoading(true);
		
		let dateList = getExpiryDatesForOptions();
		
		if (lyraMarket) {
			const lyraDateList = lyraMarket.liveBoards().map(board => {
				return board.expiryTimestamp * MILISECONDS_IN_SECOND;
			});

			const totalDateList = [...dateList, ...lyraDateList];
			dateList = getUniqueValuesFromArr(
				totalDateList
			).sort(compareNumeric);
		}

		if (lyraMarket || lyraMarket === null) {
			setDateList(dateList);
			setIsDateListLoading(false);
		}
	}

	const resetChosenDate = () => {
		setChosenDate(null);
	}
	
	useEffect(() => {
		updateDateList();
	}, updateTriggers);

	useEffect(() => {
		resetChosenDate();
	}, resetTriggers);


	// todo: auto-select
	useEffect(() => {
		if (account && dateList.length && !chosenDate) {
			setChosenDate(dateList[0]);
		}
	}, [account, dateList]);

	const getDateItemNode = (date, formatConfig = 'd MMM') => {
		const period = date - Date.now();
		
		return (
			<>
				<div className="BuilderForm__date-value">
					{format(date, formatConfig)}
				</div>

				<div className="BuilderForm__date-period">
					{getTimeLeftString(period)}
				</div>
			</>
		)
	}

	const dateOptions = dateList.map(date => {
		return {
			value: date,
			label: getDateItemNode(date),
		}
	});
	const selectedDateOption = chosenDate && dateOptions.find(opt => opt.value === chosenDate);
	
	return (
		<div className="BuilderForm__field BuilderForm__field_date">
			<div className="BuilderForm__field-header">
				Expiration Date
			</div>
			<div className="BuilderForm__field-body">
				{strategyStructure.map((structureKey, i) => {
					const isBuy = getIsBuy(structureKey);
					const isCall = getIsCall(structureKey);

					const dateNode = awaitLoading(
						<Selector
							key={i}
							className="Selector_thin-options"
							placeholder="Choose Date"
							isDisabled={isDisabled || !account}
							options={dateOptions}
							value={selectedDateOption}
							formatOptionLabel={({ value }, { selectValue, context }) => {
								if (context === "menu") {
									return getDateItemNode(value);
								}
								
								const isSelected = selectValue[0]?.value === value;
								const formatConfig = isSelected ? "d MMM hh a" : "d MMM";
	
								return getDateItemNode(value, formatConfig);
							}}
							onChange={(option) => {
								setChosenDate(option.value);
							}}
							iconTextNode={
								<span className={cx({
									positive: isBuy,
									negative: !isBuy,
								}, "block")}
									style={{width: 25}}
								>
									{isBuy ? "Buy" : "Sell"}<br />
									{isCall ? "Call" : "Put"}
								</span>
							}
						/>,
						isDateListLoading,
						<Spinner key={i} />
					)
					
					updateUnstableField(i, dateNode);
					
					return dateNode;
				})}
			</div>
		</div>
	);
};

export default DateField;