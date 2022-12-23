const BollingerBands = require("technicalindicators").BollingerBands;

const calculateBollingerBands = (data, period, stdDev) => {
  var input = {
    period: period,
    values: data,
    stdDev: stdDev,
  };
  const bollingerbands = BollingerBands.calculate(input);
  return bollingerbands;
};

const getBollingerBands = (data, period, stdDev) => {
  //const candlesClose = data.map((candle) => candle.close);
  const bollingerbands = calculateBollingerBands(data, period, stdDev);
  return bollingerbands;
};

module.exports = {
  getBollingerBands,
};
