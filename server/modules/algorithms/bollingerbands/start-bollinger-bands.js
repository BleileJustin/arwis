const { getBollingerBands } = require("./bollinger-bands");
const ccxt = require("ccxt");
//Bollinger Bands needs historical dataset then new datapoint is added every 5 minutes
const startBollingerBands = async (interval, curPair, period, standardDev) => {
  const publicBinance = new ccxt.binanceus();
  try {
    const historicalData = await publicBinance.fetchOHLCV(curPair, interval);
    const closePrices = historicalData.map((candle) => candle[4]);
    const historicalBollingerBands = getBollingerBands(
      closePrices,
      period,
      standardDev
    );
    console.log("Bollinger Bands");
    console.log(historicalBollingerBands);
    return historicalBollingerBands;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  startBollingerBands,
};
