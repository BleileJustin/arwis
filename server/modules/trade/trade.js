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
    let amountInt = parseFloat(amount);

    // get amount to lots
    const lotSize = getMarkets[marketCurPair].limits.amount.min;
    const precSize = authedBinance.amountToPrecision(curPair, amountInt);
    console.log("precSize: " + precSize);
    amountInt = Math.floor(amountInt / lotSize) * lotSize;
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
