const ccxt = require("ccxt");

const trade = async (curPair, side, amountPerc, key, secret, getMarkets) => {
  
  const authedBinance = new ccxt.binance({
    apiKey: key,
    secret: secret,
  });
  authedBinance.setSandboxMode(true);
  // find object with id in getMarkets array
  const symbols = Object.keys(getMarkets).filter((symbol) =>
    symbol.includes("USDT")
  );
  const marketCurPair = curPair.replace("USDT", "/USDT");
  const min = getMarkets[marketCurPair].limits.amount.min;
  const currency = curPair.replace("USDT", "");
  const allBalances = await authedBinance.fetchBalance();
  let amount = "";
  if (side === "buy") {
    const usdTBalance = allBalances.USDT.free;
    const price = await authedBinance.fetchTicker(curPair);
    const balanceInBase = usdTBalance / price.last;
    amount = balanceInBase * parseInt(amountPerc) * 0.01;
  } else if (side === "sell") {
    const balance = allBalances[currency].free;
    amount = balance * parseInt(amountPerc) * 0.01;
  }

  try {
    const amountDigits = min.toString().split(".")[1].length;
    const amountToFloat = parseFloat(amount).toFixed(amountDigits);
    const amountInt = parseFloat(amountToFloat);

    console.log(amountInt);
    const order = await authedBinance.createOrder(
      curPair,
      "market",
      side,
      amountInt
    );
    return order;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { trade };
