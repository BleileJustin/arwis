import React from "react";

const WalletChart = (props) => {
  const parseData = () => {
    const arr = props.data.map((candle) => {
      const candleObj = {};
      candleObj.date = new Date(candle[0]);
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
  console.log(data);

  console.log(data[data.length - 1].date);
  return <div></div>;
};

export default WalletChart;
