import css from "./PortfolioChart.module.css";

import { createChart, LineStyle, CrosshairMode } from "lightweight-charts";
import React, { useLayoutEffect, useRef } from "react";

const PortfolioChart = (props) => {
  const propsData = props.data;

  const notInitialRender = useRef(0);
  const chartContainerRef = useRef();

  useLayoutEffect(() => {
    if (notInitialRender.current === 1 && propsData) {
      const data = propsData.portfolioValueRecord;
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

      // Get the current users primary locale
      const currentLocale = window.navigator.languages[0];
      console.log("CURRENT LOCALE: ", currentLocale);
      // Create a number format using Intl.NumberFormat

      const myPriceFormatter = Intl.NumberFormat(currentLocale, {
        style: "currency",
        currency: "USD", // Currency for data points
        minimumFractionDigits: 3,
      }).format;

      // Format time to user's timezone
      const myTimeFormatter = Intl.DateTimeFormat(currentLocale, {
        year: "2-digit",
        month: "numeric",
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        hour12: true,
      }).format;

      const myTickMarkFormatter = Intl.DateTimeFormat(currentLocale, {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format;

      // Apply the custom priceFormatter to the chart
      chart.applyOptions({
        localization: {
          priceFormatter: myPriceFormatter,
          timeFormatter: myTimeFormatter,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: myTickMarkFormatter,
        },

        layout: {
          fontFamily: "'Roboto', sans-serif",
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

      // Purple Gradient below Candles
      const lineData = data.map((datapoint) => {
        return {
          time: datapoint.timestamp,
          value: datapoint.portfolioValue,
        };
      });
      const areaSeries = chart.addAreaSeries({
        lastValueVisible: false, // hide the last value marker for this series
        crosshairMarkerVisible: false, // hide the crosshair marker for this series
        lineColor: "aliceblue",
        lineWidth: 2,
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

      areaSeries.applyOptions({
        borderVisible: false,
        priceFormat: {
          type: "custom",
          minMove: 0.00000001,
        },
      });
      areaSeries.priceScale().applyOptions({
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
    if (props.data !== propsData) {
      notInitialRender.current = 1;
    } else if (props.data === propsData) {
      notInitialRender.current++;
    }
  });

  return (
    <div className={css.portfolio_chart_container}>
      <div
        id="container"
        ref={chartContainerRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};
export default PortfolioChart;
