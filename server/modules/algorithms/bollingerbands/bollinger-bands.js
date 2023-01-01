const BollingerBands = require("technicalindicators").BollingerBands;

const getBollingerBands = (data, period, stdDev, timeStamps, isNew) => {
  const input = {
    period: period,
    values: data,
    stdDev: stdDev,
  };

  const bollingerBands = BollingerBands.calculate(input);

  bollingerBands.forEach((band, index) => {
    const i = index + period - 1;
    band.timeStamp = timeStamps[i];
    band.isNew = isNew;
  });
  return bollingerBands;
};

module.exports = {
  getBollingerBands,
};
