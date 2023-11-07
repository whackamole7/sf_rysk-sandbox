import { useEffect, useRef, useState } from "react";
import './BuilderPositionChart.scss';
import InnerWarning from '../../../../../components/UI/InnerWarning/InnerWarning';
import Currency from '../../../../../components/common/Currency/Currency';
import { numberFromBigInt } from './../../../../../utils/dataTypesUtils/bigIntUtils';
import { deformatNumberFromInputString, separateThousands } from "../../../../../utils/dataTypesUtils/numberUtils";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BUILDER_STRATEGIES_CONFIG } from "../../builderConstants";
import { GREEN, GREY, LGREY, RED } from "../../../../../environment/constants/styleConstants";
import cx from "classnames";
import useTokenPriceBySymbol from './../../../../../environment/contextHooks/useTokenPrices/useTokenPriceBySymbol';



const BuilderPositionChart = ({
	asset,
	strategy,
	amountStr,
	chosenStrikes,
	collateralDataArr,
}) => {

	// todo: refactor!!

	const strategyStructure = BUILDER_STRATEGIES_CONFIG[strategy].structure;
	
	const chartRef = useRef(null);

	const amount = deformatNumberFromInputString(amountStr);
	const chartData = {
		amount,
		strikes: chosenStrikes.map(strikeData => strikeData?.strike),
		premiums: chosenStrikes.map(strikeData => {
			const premiumInUsdc = strikeData?.premiumData.inUSDC;
			
			return premiumInUsdc && numberFromBigInt(premiumInUsdc);
		}),
		strategies: strategyStructure,
		collaterals: collateralDataArr,

		isReady:	amount &&
							chosenStrikes.length === strategyStructure.length &&
							chosenStrikes.every(strikeData => strikeData),
	}

	const isETH = asset === "ETH";

	const minMaxDelta = isETH ? 0.3 : 0.2;
	const priceStep = isETH ? 5 : 10;
	const pxPerPoint = 100;
	
	const currentPriceBigInt = useTokenPriceBySymbol(asset);
	const currentPrice = numberFromBigInt(currentPriceBigInt);
	const currentPriceFormatted = currentPrice && Math.round(currentPrice / priceStep) * priceStep;


	const calcPnl = (i, closePrice) => {
		const strategy = chartData.strategies[i];
		const premium = chartData.premiums[i];
		const strikePrice = chartData.strikes[i];
		const amount = chartData.amount;
		const collateralObj = chartData.collaterals[i];

		const liqPrice = collateralObj?.liquidationPrice && numberFromBigInt(
			collateralObj.liquidationPrice
		);

		const collateral = collateralObj && numberFromBigInt(
			collateralObj.inMarketToken,
		);

		const isBase = collateralObj?.isBase;
		

		let result;
		if (!premium) {
			return;
		}
		
		switch(strategy) {
			case 1: // Long Call
				if (closePrice < strikePrice) {
					result = -premium;
				} else {
					result = ((closePrice - strikePrice) * amount) - premium;
				}
				break;
			case 2: // Long Put
				if (closePrice > strikePrice) {
					result = -premium;
				} else {
					result = ((strikePrice - closePrice) * amount) - premium;
				}
				break;
			case -1: // Short Call
				if (liqPrice && closePrice > liqPrice) {
					if (isBase) {
						result = -(collateral * liqPrice) + premium;
					} else {
						result = -collateral + premium;
					}
				} else {
					if (isBase) {
						const maxProfit = ((strikePrice - currentPrice) * amount) + premium;
						if (closePrice > strikePrice) {
							result = maxProfit;
						} else {
							result = ((closePrice - currentPrice) * amount) + premium;
						}
					} else {
						if (closePrice < strikePrice) {
							result = premium;
						} else {
							result = ((strikePrice - closePrice) * amount) + premium;
						}
					}
				}
				break;
			case -2: // Short Put
				if (liqPrice && closePrice < liqPrice) {
					if (isBase) {
						result = -(collateral * liqPrice) + premium;
					} else {
						result = -collateral + premium;
					}
				} else {
					if (closePrice > strikePrice) {
						result = premium;
					} else {
						result = ((closePrice - strikePrice) * amount) + premium;
					}
				}
				break;
		}
		
		if (result) {
			return Number(result);
		}
	}


	const createDataset = () => {
		if (!chartData) {
			return;
		}
		const averageStrike = chartData.strikes.reduce((average, cur) => {
			return (average + cur) / 2;
		}, chartData.strikes[0]);
		const delta = window.innerWidth > 480 ? minMaxDelta : minMaxDelta - 0.05;
		const min = Math.round(averageStrike * (1 - delta) / 100) * 100;
		const max = Math.round(averageStrike * (1 + delta) / 100) * 100;
		const points = [];
		
		for (let i = 0; i < (max - min) / priceStep; i++) {
			const point = min + i * priceStep;
			points.push(point);
		}
		
		const dataset = [];
		chartData.strategies.forEach((strat, i) => {
			points.forEach((point, j) => {
				const pnl = calcPnl(i, point);
				
				if (i === 0) {
					dataset.push({
						closePrice: point,
						pnl,
					})
				} else {
					dataset[j].pnl = dataset[j].pnl + pnl;
				}
			})
		})

		return dataset;
	}
	const data = createDataset();
	const biggestPnl = data.reduce((prev, cur) => {
		if (cur.pnl > prev.pnl) {
			return cur;
		}

		return prev;
	}, data[0])?.pnl;
	const biggestPnlStr = biggestPnl && separateThousands(biggestPnl.toFixed(0));


	// Area Split color
	const gradientOffset = () => {
		if (!data) {
			return;
		}
		const dataMax = Math.max(...data.map((i) => i.pnl));
		const dataMin = Math.min(...data.map((i) => i.pnl));
	
		if (dataMax <= 0) {
			return 0;
		}
		if (dataMin >= 0) {
			return 1;
		}
	
		const offset = dataMax / (dataMax - dataMin);
		
		return isNaN(offset) ? 0 : offset;
	};
	const off = gradientOffset();

	// Custom Elements
	const CustomDot = ({ value, cx, cy }) => {
		const xValue = value[1];
		let color;
		if (xValue < 0) {
			color = RED;
		} else if (xValue > 0) {
			color = GREEN;
		} else {
			color = LGREY;
		}

		return (
			<circle
				cx={cx}
				cy={cy}
				r={5}
				style={{opacity: "0.9"}}
				fill={color} />
		)
	}
	const ChartTooltip = (props) => {
		const { active, payload, label } = props;

		const value = active && payload && payload.length && Number(payload[0].value.toFixed(2));
		
		if (active && payload && payload.length) {
			return (
				<div className='react-tooltip'>
					<Currency currencyName={asset} isHlight={true} isSmall={true}>
						{separateThousands(label)}
					</Currency>
					<p>
						PnL <span className={cx({ positive: value > 0, negative: value < 0 })}>
							{`${value !== 0 ? (value > 0 ? '+' : '-') : ""}$${separateThousands(Math.abs(value))}`}
						</span>
					</p>
				</div>
			)
		}
		return null;
	}


	// Axis settings
	const tickFormatter = (val => {
		return separateThousands(val);
	})
	const tick = {
		fill: LGREY,
		fontSize: 13,
	}
	const axisStroke = GREY;

	// Interval calc
	const [interval, setInterval] = useState(null);
	useEffect(() => {
		if (chartRef.current && data) {
			let interval;
			const temp = Math.round(pxPerPoint / (chartRef.current.clientWidth / data.length));
			if (temp < 20) {
				interval = 19;
			} else {
				interval = (Math.floor(temp / 20) * 20) - 1;
			}
			setInterval(interval);
		}
	}, [chartRef.current, data, window.innerWidth]);
	
	return (
		<div className="BuilderPositionChart App-box" ref={chartRef}>
			{chartData.isReady ? (
				<ResponsiveContainer>
					<AreaChart
						data={data}
						margin={{
							// todo: fix
							left: biggestPnlStr?.length * 7.5 - 40,
							right: 15,
							top: 15,
						}}
					>
						<XAxis
							dataKey="closePrice"
							interval={interval}
							tickFormatter={tickFormatter}
							tick={tick}
							stroke={axisStroke}
						/>
						<YAxis 
							dataKey="pnl"
							tickFormatter={tickFormatter} 
							tick={tick}
							stroke={axisStroke}
							padding={{
								bottom: 15,
							}}
						/>
						<Tooltip
							cursor={{ stroke: LGREY }}
							content={<ChartTooltip />}
						/>
						<Area
							type="monotone"
							dot={false}
							dataKey="pnl"
							stroke="url(#splitColor)"
							activeDot={<CustomDot />}
							fill="url(#splitColorTransparent)"
						/>
						<defs>
							<linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
								<stop offset={off} stopColor={GREEN} stopOpacity={1} />
								<stop offset={off} stopColor={RED} stopOpacity={1} />
							</linearGradient>
							<linearGradient id="splitColorTransparent" x1="0" y1="0" x2="0" y2="1">
								<stop offset={off} stopColor={GREEN} stopOpacity={0.3} />
								<stop offset={off} stopColor={RED} stopOpacity={0.3} />
							</linearGradient>
						</defs>
						<ReferenceLine
							x={currentPriceFormatted}
							stroke={GREY}
							strokeDasharray="3 3"
							label={{
								value: `Current Price`,
								fill: GREY,
								fontSize: window.innerWidth > 768 ? 15 : 13,
								position: "insideTopLeft",
								writingMode: "tb-rl",
								offset: 9,
							}}
						/>
						{chartData.collaterals.length && chartData.collaterals.map(collateral => {
							if (!collateral || !collateral.liquidationPrice) {
								return;
							}
							const liqPrice = numberFromBigInt(
								collateral.liquidationPrice
							);
							
							const liqPriceRounded = Math.round(liqPrice / priceStep) * priceStep;

							return (
								<ReferenceLine
									key={liqPrice}
									x={liqPriceRounded}
									stroke={RED}
									strokeDasharray="3 3"
									label={{
										value: `Liq. Price`,
										fill: RED,
										fontSize: window.innerWidth > 768 ? 15 : 13,
										position: "insideTopLeft",
										writingMode: "tb-rl",
										offset: 9,
									}}
								/>
							)
						})}
						<CartesianGrid stroke={"rgba(58, 68, 102, 0.15)"} />
					</AreaChart>
				</ResponsiveContainer>
			) : (
				<InnerWarning>
					Fill out the Strike fields to view position chart
				</InnerWarning>
			)}
		</div>
	);
};

export default BuilderPositionChart;