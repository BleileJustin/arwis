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
    const balances = await authedBinance.fetchBalance();
    const prices = await publicBinance.fetchTickers();
    const balancesArray = balances.info.balances;

    const portfolioValue = calculatePortfolioValue(balancesArray, prices);
    return portfolioValue;
  } catch (e) {
    console.log(e);
  }
};

const calculatePortfolioValue = (balances, prices) => {
  let portfolioValue = 0;
  for (const balance of balances) {
    if (balance.asset === "USDT") {
      portfolioValue += parseFloat(balance.free) + parseFloat(balance.locked);
    } else {
      const total = parseFloat(balance.free) + parseFloat(balance.locked);
      const price = prices[balance.asset + "/USDT"];
      if (total > 0 && price) {
        portfolioValue += total * parseFloat(price.last);
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
    console.log(balancesArray);
    for (const balance of balancesArray) {
      const free = balance.free;
      const locked = balance.locked;
      const total = parseFloat(free) + parseFloat(locked);
      const price = prices[balance.asset + "/USDT"];
      if (total > 0 && price) {
        const assetValue = total * parseFloat(price.last);
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
    console.log(portfolioDistribution);
    return portfolioDistribution;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getPortfolioValueFromBinance,
  getPortfolioDistributionFromBinance,
};
