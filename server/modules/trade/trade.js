const ccxt = require("ccxt");

const trade = async (curPair, side, amountPerc, key, secret) => {
  const authedBinance = new ccxt.binance({
    apiKey: key,
    secret: secret,
  });
  authedBinance.setSandboxMode(true);
  let currency = "";
  if (side === "buy") {
    currency = "USDT";
  } else if (side === "sell") {
    currency = curPair.replace("USDT", "");
  }
  try {
    const allBalances = await authedBinance.fetchBalance();
    const balance = allBalances[currency].free;
    console.log(balance);
    console.log(amountPerc);
    const amount = authedBinance.amountToPrecision(
      curPair,
      (parseInt(balance) * parseInt(amountPerc)) / 100
    );
    console.log(amount + "amt");
    const order = await authedBinance.createOrder(
      curPair,
      "market",
      side,
      amount
    );
    return order;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { trade };
