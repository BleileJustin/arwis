// GET PORTFOLIO VALUE

const ccxt = require("ccxt");
const publicBinance = new ccxt.binanceus();
const getPortfolioValueFromBinance = async (apiKey, apiSecret) => {
  const authedBinance = new ccxt.binanceus({
    apiKey: apiKey,
    secret: apiSecret,
  });
  authedBinance.setSandboxMode(true);
  try {
    const balancesArray = await authedBinance.fetchBalance();
    const prices = await publicBinance.fetchTickers();
    const balances = balancesArray.info.balances;
    const portfolioValue = calculatePortfolioValue(balances, prices);
    return portfolioValue;
  } catch (e) {
    console.log(e);
  }
};

const calculatePortfolioValue = (balances, prices) => {
  let portfolioValue = 0;
  for (const balance of balances) {
    //Only for USDT Value
    if (balance.asset === "USDT") {
      portfolioValue += parseFloat(balance.free) + parseFloat(balance.locked);
    } else {
      //All other assets
      const total = parseFloat(balance.free) + parseFloat(balance.locked);
      // console.log("prices", prices);
      const price = prices[balance.asset + "/USDT"];
      if (parseFloat(total) > 0 && price !== undefined) {
        console.log([portfolioValue, total, price.info.lastPrice]);
        portfolioValue += parseFloat(total) * parseFloat(price.info.lastPrice);
      }
    }
  }
  return portfolioValue;
};

const getPortfolioDistributionFromBinance = async (apiKey, apiSecret) => {
  const authedBinance = new ccxt.binanceus({
    apiKey: apiKey,
    secret: apiSecret,
  });
  authedBinance.setSandboxMode(true);
  try {
    const balances = await authedBinance.fetchBalance();
    const prices = await publicBinance.fetchTickers();
    const balancesArray = balances.info.balances;

    const portfolioValue = calculatePortfolioValue(balancesArray, prices);
    const portfolioDistribution = [];

    for (const balance of balancesArray) {
      const free = balance.free;
      const locked = balance.locked;
      const total = parseFloat(free) + parseFloat(locked);
      const price = prices[balance.asset + "/USDT"];
      if (total > 0 && price) {
        const assetValue = total * parseFloat(price.info.lastPrice);
        const assetPercentage = (assetValue / portfolioValue) * 100;
        portfolioDistribution.push({
          asset: balance.asset,
          percentage: assetPercentage,
        });
      }
      if (balance.asset === "USDT") {
        const assetValue =
          parseFloat(balance.free) + parseFloat(balance.locked);
        const assetPercentage = (assetValue / portfolioValue) * 100;
        portfolioDistribution.push({
          asset: balance.asset,
          percentage: assetPercentage,
        });
      }
    }
    return portfolioDistribution;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getPortfolioValueFromBinance,
  getPortfolioDistributionFromBinance,
};
