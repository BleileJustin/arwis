const { getBollingerBands } = require("./bollinger-bands");
const { trade } = require("../../trade/trade");
const { setBBAlgoDB } = require("./bollinger-bands-database");
const ccxt = require("ccxt");
//Bollinger Bands needs historical dataset then new datapoint is added every 5 minutes
const startBollingerBands = async (
  id,
  interval,
  curPair,
  period,
  standardDev,
  apiKey,
  apiSecret,
  amount,
  email,
  client
) => {
  const publicBinance = new ccxt.binanceus();
  try {
    const historicalData = await publicBinance.fetchOHLCV(
      curPair,
      interval,
      undefined,
      period + 100
    );
    let closePrices = historicalData.map((candle) => candle[4]);
    let timeStamps = historicalData.map((candle) => candle[0]);
    const historicalBollingerBands = getBollingerBands(
      closePrices,
      period,
      standardDev,
      timeStamps,
      false
    );

    console.log(interval);
    let intervalMs;
    switch (interval) {
      case "1m":
        intervalMs = 1000 * 60;
        break;
      case "5m":
        intervalMs = 1000 * 60 * 5;
        break;
      case "15m":
        intervalMs = 1000 * 60 * 15;
        break;
      case "30m":
        intervalMs = 1000 * 60 * 30;
        break;
      case "1h":
        intervalMs = 1000 * 60 * 60;
        break;
      case "6h":
        intervalMs = 1000 * 60 * 60 * 6;
        break;
      case "12h":
        intervalMs = 1000 * 60 * 60 * 12;
        break;
      case "1d":
        intervalMs = 1000 * 60 * 60 * 24;
        break;
      case "1w":
        intervalMs = 1000 * 60 * 60 * 24 * 7;
    }
    const algoData = {
      id: id,
      curPair: curPair,
      interval: interval,
      period: period,
      standardDev: standardDev,
      amount: amount,
    };

    await setBBAlgoDB(email, client, algoData);

    const start = async () => {
      const newCandle = await publicBinance.fetchOHLCV(
        curPair,
        interval,
        undefined,
        1
      );
      const newClosePrice = newCandle[0][4];
      closePrices.push(newClosePrice);
      closePrices.shift();

      const newTimeStamp = newCandle[0][0];
      timeStamps.push(newTimeStamp);
      timeStamps.shift();

      const newBollingerBands = getBollingerBands(
        closePrices,
        period,
        standardDev,
        timeStamps,
        true
      );
      const pb = newBollingerBands[newBollingerBands.length - 1].pb;
      if (pb > 1.2) {
        const order = await trade(curPair, "sell", amount, apiKey, apiSecret);
        console.log("Sell signal: Price is above upper band.");
        console.log(order);
        console.log(pb);
      } else if (pb < 0.2) {
        const order = await trade(curPair, "buy", amount, apiKey, apiSecret);
        console.log("Buy signal: Price is below lower band.");
        console.log(order);
        console.log(pb);
      } else {
        console.log("Hold signal: Price is between upper and lower bands.");
        console.log(pb);
      }
    };
    start();
    setInterval(async () => {
      start();
    }, intervalMs);

    return historicalBollingerBands;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  startBollingerBands,
};
