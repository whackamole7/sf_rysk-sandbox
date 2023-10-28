import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import cx from "classnames";
import './SimplePriceChart.scss';

import { createChart } from "krasulya-lightweight-charts";

import {
	USD_DECIMALS,
	SWAP,
	CHART_PERIODS,
	getTokenInfo,
	formatAmount,
	formatDateTime,
	usePrevious,
	useLocalStorageSerializeKey,
} from "../../lib/legacy";
import { useChartPrices } from "../../domain/legacy";
import Tab from "../Tab/Tab";

import { getTokens } from "../../config/Tokens";
import { GREEN, LGREY, RED } from "../../../../environment/constants/styleConstants";

const PRICE_LINE_TEXT_WIDTH = 15;

const timezoneOffset = -new Date().getTimezoneOffset() * 60;

export function getChartToken(asset, fromToken, toToken, chainId) {
	if (!fromToken || !toToken) {
		return;
	}

	if (asset !== SWAP) {
		return toToken;
	}

	if (fromToken.isUsdg && toToken.isUsdg) {
		return getTokens(chainId).find((t) => t.isStable);
	}
	if (fromToken.isUsdg) {
		return toToken;
	}
	if (toToken.isUsdg) {
		return fromToken;
	}

	if (fromToken.isStable && toToken.isStable) {
		return toToken;
	}
	if (fromToken.isStable) {
		return toToken;
	}
	if (toToken.isStable) {
		return fromToken;
	}

	return toToken;
}

const DEFAULT_PERIOD = "4h";

const getSeriesOptions = () => ({
	// https://github.com/tradingview/lightweight-charts/blob/master/docs/area-series.md
	lineColor: "#5472cc",
	topColor: "rgba(49, 69, 131, 0.4)",
	bottomColor: "rgba(42, 64, 103, 0.0)",
	lineWidth: 2,
	priceLineColor: "#384263",
	downColor: RED,
	wickDownColor: RED,
	upColor: GREEN,
	wickUpColor: GREEN,
	borderVisible: false,
});

const getChartOptions = (width, height) => ({
	width,
	height,
	layout: {
		backgroundColor: "rgba(255, 255, 255, 0)",
		textColor: LGREY,
		fontFamily: "Gantari",
	},
	localization: {
		// https://github.com/tradingview/lightweight-charts/blob/master/docs/customization.md#time-format
		timeFormatter: (businessDayOrTimestamp) => {
			return formatDateTime(businessDayOrTimestamp - timezoneOffset);
		},
	},
	grid: {
		vertLines: {
			visible: true,
			color: "rgba(35, 38, 59, 1)",
			style: 2,
		},
		horzLines: {
			visible: true,
			color: "rgba(35, 38, 59, 1)",
			style: 2,
		},
	},
	// https://github.com/tradingview/lightweight-charts/blob/master/docs/time-scale.md#time-scale
	timeScale: {
		rightOffset: 5,
		borderVisible: false,
		barSpacing: 5,
		timeVisible: true,
		fixLeftEdge: true,
	},
	// https://github.com/tradingview/lightweight-charts/blob/master/docs/customization.md#price-axis
	priceScale: {
		borderVisible: false,
	},
	crosshair: {
		horzLine: {
			color: "#aaa",
		},
		vertLine: {
			color: "#aaa",
		},
		mode: 0,
	},
});

const SimplePriceChart = (props) => {
	const {
		asset,
		fromTokenAddress,
		toTokenAddress,
		infoTokens,
		chainId,
	} = props;

	const [currentChart, setCurrentChart] = useState();
	const [currentSeries, setCurrentSeries] = useState();

	let [period, setPeriod] = useLocalStorageSerializeKey([chainId, "Chart-period"], DEFAULT_PERIOD);
	if (!(period in CHART_PERIODS)) {
		period = DEFAULT_PERIOD;
	}

	const [hoveredCandlestick, setHoveredCandlestick] = useState();

	const fromToken = getTokenInfo(infoTokens, fromTokenAddress);
	const toToken = getTokenInfo(infoTokens, toTokenAddress);

	const [chartToken, setChartToken] = useState({
		maxPrice: null,
		minPrice: null,
	});

	useEffect(() => {
		const tmp = getChartToken(asset, fromToken, toToken, chainId);
		setChartToken(tmp);
	}, [asset, fromToken, toToken, chainId]);

	const symbol = chartToken ? (chartToken.isWrapped ? chartToken.baseSymbol : chartToken.symbol) : undefined;
	const marketName = chartToken ? symbol + "_USD" : undefined;
	const previousMarketName = usePrevious(marketName);

	const ref = useRef(null);
	const chartRef = useRef(null);

	const currentAveragePrice =
		chartToken.maxPrice && chartToken.minPrice ? chartToken.maxPrice.add(chartToken.minPrice).div(2) : null;
	const [priceData, updatePriceData] = useChartPrices(
		chainId,
		chartToken.symbol,
		chartToken.isStable,
		period,
		currentAveragePrice
	);

	const [chartInited, setChartInited] = useState(false);
	useEffect(() => {
		if (marketName !== previousMarketName) {
			setChartInited(false);
		}
	}, [marketName, previousMarketName]);

	const scaleChart = useCallback(() => {
		const from = Date.now() / 1000 - (7 * 24 * CHART_PERIODS[period]) / 2 + timezoneOffset;
		const to = Date.now() / 1000 + timezoneOffset;
		currentChart.timeScale().setVisibleRange({ from, to });
	}, [currentChart, period]);

	const onCrosshairMove = useCallback(
		(evt) => {
			if (!evt.time) {
				setHoveredCandlestick(null);
				return;
			}

			for (const point of evt.seriesPrices.values()) {
				setHoveredCandlestick((hoveredCandlestick) => {
					if (hoveredCandlestick && hoveredCandlestick.time === evt.time) {
						return hoveredCandlestick;
					}
					return {
						time: evt.time,
						...point,
					};
				});
				break;
			}
		},
		[setHoveredCandlestick]
	);

	useEffect(() => {
		if (!ref.current || !priceData || !priceData.length || currentChart) {
			return;
		}

		const chart = createChart(
			chartRef.current,
			getChartOptions(chartRef.current.offsetWidth, chartRef.current.offsetHeight)
		);

		chart.subscribeCrosshairMove(onCrosshairMove);

		const series = chart.addCandlestickSeries(getSeriesOptions());

		setCurrentChart(chart);
		setCurrentSeries(series);
	}, [ref, priceData, currentChart, onCrosshairMove]);

	useEffect(() => {
		const interval = setInterval(() => {
			updatePriceData(undefined, true);
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [updatePriceData]);

	useEffect(() => {
		if (!currentChart) {
			return;
		}
		const resizeChart = () => {
			currentChart.resize(chartRef.current.offsetWidth, chartRef.current.offsetHeight);
		};
		window.addEventListener("resize", resizeChart);
		return () => window.removeEventListener("resize", resizeChart);
	}, [currentChart]);

	useEffect(() => {
		if (currentSeries && priceData && priceData.length) {
			currentSeries.setData(priceData);

			if (!chartInited) {
				scaleChart();
				setChartInited(true);
			}
		}
	}, [priceData, currentSeries, chartInited, scaleChart]);

	const candleStatsHtml = useMemo(() => {
		if (!priceData) {
			return null;
		}
		const candlestick = hoveredCandlestick || priceData[priceData.length - 1];
		if (!candlestick) {
			return null;
		}

		const className = cx({
			"ExchangeChart-bottom-stats": true,
			positive: candlestick.open <= candlestick.close,
			negative: candlestick.open > candlestick.close,
			[`length-${String(parseInt(candlestick.close)).length}`]: true,
		});

		const toFixedNumbers = 2;

		return (
			<div className={className}>
				<span className="ExchangeChart-bottom-stats-label">O</span>
				<span className="ExchangeChart-bottom-stats-value">{candlestick.open.toFixed(toFixedNumbers)}</span>
				<span className="ExchangeChart-bottom-stats-label">H</span>
				<span className="ExchangeChart-bottom-stats-value">{candlestick.high.toFixed(toFixedNumbers)}</span>
				<span className="ExchangeChart-bottom-stats-label">L</span>
				<span className="ExchangeChart-bottom-stats-value">{candlestick.low.toFixed(toFixedNumbers)}</span>
				<span className="ExchangeChart-bottom-stats-label">C</span>
				<span className="ExchangeChart-bottom-stats-value">{candlestick.close.toFixed(toFixedNumbers)}</span>
			</div>
		);
	}, [hoveredCandlestick, priceData]);

	let high;
	let low;
	let deltaPrice;
	let delta;
	let deltaPercentage;
	let deltaPercentageStr;

	const now = parseInt(Date.now() / 1000);
	const timeThreshold = now - 24 * 60 * 60;

	if (priceData) {
		for (let i = priceData.length - 1; i > 0; i--) {
			const price = priceData[i];
			if (price.time < timeThreshold) {
				break;
			}
			if (!low) {
				low = price.low;
			}
			if (!high) {
				high = price.high;
			}

			if (price.high > high) {
				high = price.high;
			}
			if (price.low < low) {
				low = price.low;
			}

			deltaPrice = price.open;
		}
	}

	if (deltaPrice && currentAveragePrice) {
		const average = parseFloat(formatAmount(currentAveragePrice, USD_DECIMALS, 2));
		delta = average - deltaPrice;
		deltaPercentage = (delta * 100) / average;
		if (deltaPercentage > 0) {
			deltaPercentageStr = `+${deltaPercentage.toFixed(2)}%`;
		} else {
			deltaPercentageStr = `${deltaPercentage.toFixed(2)}%`;
		}
		if (deltaPercentage === 0) {
			deltaPercentageStr = "0.00";
		}
	}

	if (!chartToken) {
		return null;
	}

	return (
		<div className="ExchangeChart tv" ref={ref}>
			<div className="ExchangeChart-bottom App-box App-box-border">
				<div className="ExchangeChart-bottom-header">
					<div className="ExchangeChart-bottom-controls">
						<Tab options={Object.keys(CHART_PERIODS)} option={period} setOption={setPeriod} />
					</div>
					{candleStatsHtml}
				</div>
				<div className="ExchangeChart-bottom-content" ref={chartRef}></div>
			</div>
		</div>
	);
}

export default SimplePriceChart;