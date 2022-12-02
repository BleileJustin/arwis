import { createChart, LineStyle, CrosshairMode } from "lightweight-charts";
import React, { useLayoutEffect, useRef } from "react";

const WalletChart = (props) => {
  const parseData = () => {
    const arr = props.data.map((candle) => {
      const candleObj = {};
      candleObj.time = candle[0];
      candleObj.open = candle[1];
      candleObj.high = candle[2];
      candleObj.low = candle[3];
      candleObj.close = candle[4];
      candleObj.volume = candle[5];
      return candleObj;
    });
    return arr;
  };

  const data = parseData();

  const notInitialRender = useRef(0);
  const chartContainerRef = useRef();

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
      });

      // Setting the border color for the horizontal axis
      chart.timeScale().applyOptions({
        borderColor: "#71649C",
      });

      // Adjust the starting bar width (essentially the horizontal zoom)
      chart.timeScale().applyOptions({
        barSpacing: 10,
      });
      //

      // Changing the font
      chart.applyOptions({
        layout: {
          fontFamily: "'Roboto', sans-serif",
        },
      });

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

      // Apply the custom priceFormatter to the chart
      chart.applyOptions({
        localization: {
          priceFormatter: myPriceFormatter,
        },
      });

      // Customizing the Crosshair
      chart.applyOptions({
        crosshair: {
          // Change mode from default 'magnet' to 'normal'.
          // Allows the crosshair to move freely without snapping to datapoints
          mode: CrosshairMode.Normal,

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

      // Create the Main Series (Candlesticks)
      const mainSeries = chart.addCandlestickSeries();
      mainSeries.setData(data);
      new ResizeObserver((entries) => {
        if (
          entries.length === 0 ||
          entries[0].target !== chartContainerRef.current
        ) {
          return;
        }
        const newRect = entries[0].contentRect;
        chart.applyOptions({ height: newRect.height, width: newRect.width });
      }).observe(chartContainerRef.current);

      mainSeries.applyOptions({
        wickUpColor: "rgb(5, 255, 0)",
        upColor: "rgb(5, 255, 0)",
        wickDownColor: "rgb(225, 50, 85)",
        downColor: "rgb(225, 50, 85)",
        borderVisible: false,
        priceFormat: {
          type: "custom",
          precision: 0.000000001,
          minMove: 0.00000001,
        },
      });
      mainSeries.priceScale().applyOptions({
        autoScale: true, // disables auto scaling based on visible content
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      });
      notInitialRender.current++;
    } else {
      notInitialRender.current++;
    }
  }, [data]);
  return (
    <div
      id="container"
      ref={chartContainerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};
export default WalletChart;