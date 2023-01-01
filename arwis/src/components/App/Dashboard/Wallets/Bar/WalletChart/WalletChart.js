import { createChart, LineStyle, CrosshairMode } from "lightweight-charts";
import React, { useLayoutEffect, useRef } from "react";

const WalletChart = (props) => {
  const data = props.data.map((candle) => {
    const candleObj = {};
    candleObj.time = candle[0];
    candleObj.open = candle[1];
    candleObj.high = candle[2];
    candleObj.low = candle[3];
    candleObj.close = candle[4];
    candleObj.volume = candle[5];
    return candleObj;
  });

  const notInitialRender = useRef(0);
  const chartContainerRef = useRef();
  console.log("WALLETCHART");
  console.log(props.algoData);
  console.log("WALLETCHART");

  const upperBands = [];
  const middleBands = [];
  const lowerBands = [];
  const timeStamps = [];

  const parseBollingerBands = () => {
    props.algoData.bollingerBands.forEach((band) => {
      upperBands.push(band.upper);
      middleBands.push(band.middle);
      lowerBands.push(band.lower);
      timeStamps.push(band.timeStamp);
    });
  };

  if (props.algoData) {
    parseBollingerBands();
  }

  useLayoutEffect(() => {
    if (notInitialRender.current === 1) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: "#222" },
          textColor: "#C3BCDB",
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
      });
      // Create the Lightweight Chart within the container element

      // Setting the border color for the vertical axis
      chart.priceScale().applyOptions({
        borderColor: "#71649C",
        percentage: true,
      });

      // Setting the border color for the horizontal axis
      chart.timeScale().applyOptions({
        borderColor: "#71649C",
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 10,
      });
      //

      // Get the current users primary locale
      const currentLocale = window.navigator.languages[0];
      // Create a number format using Intl.NumberFormat
      const fractionDigits = () => {
        if (data[0].close < 0.1) {
          return 6;
        } else if (data[0].close < 1) {
          return 4;
        } else if (data[0].close < 10) {
          return 3;
        } else if (data[0].close < 100) {
          return 2;
        } else if (data[0].close < 1000) {
          return 1;
        } else {
          return 0;
        }
      };
      const myPriceFormatter = Intl.NumberFormat(currentLocale, {
        style: "currency",
        currency: "USD", // Currency for data points
        minimumFractionDigits: fractionDigits(),
      }).format;

      const myTimeFormatter = Intl.DateTimeFormat(currentLocale, {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "2-digit",
        hour12: true,
      }).format;

      const timeTickMarkFormatter = Intl.DateTimeFormat(currentLocale, {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format;

      // Apply the custom priceFormatter to the chart
      chart.applyOptions({
        layout: {
          fontFamily: "'Roboto', sans-serif",
        },
        localization: {
          priceFormatter: myPriceFormatter,
          timeFormatter: myTimeFormatter,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: timeTickMarkFormatter,
        },
        crosshair: {
          // Change mode from default 'magnet' to 'normal'.
          // Allows the crosshair to move freely without snapping to datapoints
          mode: CrosshairMode.Magnet,

          // Vertical crosshair line (showing Date in Label)
          vertLine: {
            width: 8,
            color: "#C3BCDB44",
            style: LineStyle.Solid,
            labelBackgroundColor: "#9B7DFF",
          },

          // Horizontal crosshair line (showing Price in Label)
          horzLine: {
            color: "#9B7DFF",
            labelBackgroundColor: "#9B7DFF",
          },
        },
      });

      // Create the Bollinger Bands Series
      const upperBandsSeries = chart.addLineSeries({
        color: "aliceblue",
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        position: "overlay",
      });
      const middleBandsSeries = chart.addLineSeries({
        color: "aliceblue",
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        position: "overlay",
      });
      const lowerBandsSeries = chart.addLineSeries({
        color: "aliceblue",
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        position: "overlay",
      });

      upperBandsSeries.setData(
        upperBands.map((band, index) => ({
          time: timeStamps[index],
          value: band,
        }))
      );
      middleBandsSeries.setData(
        middleBands.map((band, index) => ({
          time: timeStamps[index],
          value: band,
        }))
      );
      lowerBandsSeries.setData(
        lowerBands.map((band, index) => ({
          time: timeStamps[index],
          value: band,
        }))
      );

      // Create the Bollinger Bands Series

      // Purple Gradient below Candles
      const lineData = data.map((datapoint) => ({
        time: datapoint.time,
        value: (datapoint.close + datapoint.open) / 2,
      }));
      const areaSeries = chart.addAreaSeries({
        lastValueVisible: false, // hide the last value marker for this series
        crosshairMarkerVisible: false, // hide the crosshair marker for this series
        lineColor: "transparent", // hide the line
        topColor: "rgba(56, 33, 110,0.6)",
        bottomColor: "rgba(56, 33, 110, 0.1)",
        position: "back", // place the area series behind the candlesticks
      });
      areaSeries.setData(lineData);
      areaSeries.applyOptions({
        priceFormat: {
          type: "custom",
          minMove: 0.00000001,
          formatter: (price) => parseFloat(price).toFixed(8),
        },
      });

      // Create the Main Series (Candlesticks)
      const mainSeries = chart.addCandlestickSeries();
      mainSeries.setData(data);

      // RESIZE OBSERVER

      // Create a ResizeObserver to resize the chart when the container element size changes
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          chart.resize(width, height);
        }
      });
      // Observe the chart container element
      resizeObserver.observe(chartContainerRef.current);

      mainSeries.applyOptions({
        wickUpColor: "rgb(5, 255, 0)",
        upColor: "rgb(5, 255, 0)",
        wickDownColor: "rgb(225, 50, 85)",
        downColor: "rgb(225, 50, 85)",
        borderVisible: false,
        priceFormat: {
          type: "custom",
          minMove: 0.00000001,
          formatter: (price) => parseFloat(price).toFixed(8),
        },
      });
      mainSeries.priceScale().applyOptions({
        autoScale: true, // disables auto scaling based on visible content
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
        snapToTicks: true,
      });
      // Prevent Repeat Chart Creation
      return () => {
        resizeObserver.disconnect();
        chart.remove();
      };
    }
    if (props.data !== data) {
      notInitialRender.current = 1;
    } else if (props.data === data) {
      notInitialRender.current++;
    }
  });

  return (
    <div
      id="container"
      ref={chartContainerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};
export default WalletChart;
