const { getBollingerBands } = require("./bollinger-bands");
const { trade } = require("../../trade/trade");
const {
  setBBAlgoDB,
  setBBAlgoActiveDB,
} = require("./bollinger-bands-database");
const ccxt = require("ccxt");
//Bollinger Bands needs historical dataset then new datapoint is added every 5 minutes
let runningBollingerBands = {};

const stopBollingerBands = async (id, email, client) => {
  console.log("Stopping Algo...");
  console.log(" ");
  if (runningBollingerBands[email]) {
    if (runningBollingerBands[email][id]) {
      await setBBAlgoActiveDB(email, client, id, false);

      clearInterval(runningBollingerBands[email][id]);
    }
  }
  console.log(runningBollingerBands);
};

const restartBollingerBands = async (id, email, client, apiKey, apiSecret) => {
  console.log("Restarting Algo...");
  console.log(" ");
  await setBBAlgoActiveDB(email, client, id, true);
  const collection = client.db("arwis").collection("users");
  const user = await collection.find({ email: email }).toArray();
  const algoData = user[0].algorithms;
  const algo = algoData.filter((algo) => algo.id === id)[0];
  console.log(algo);
  const { interval, curPair, period, standardDev, amount } = algo;
  startBollingerBands(
    id,
    interval,
    curPair,
    period,
    standardDev,
    apiKey,
    apiSecret,
    amount,
    email,
    client,
    (isRestart = true)
  );
};

const deleteBollingerBands = async (id, email, client) => {
  console.log("Deleting Algo...");
  console.log(" ");

  const collection = client.db("arwis").collection("users");
  //deletes the algo from the database
  await collection.updateOne(
    { email },
    {
      $pull: {
        algorithms: { id: id },
      },
    }
  );
  if (runningBollingerBands[email]) {
    if (runningBollingerBands[email][id]) {
      clearInterval(runningBollingerBands[email][id]);
      delete runningBollingerBands[email][id];
    }
  }
  console.log(runningBollingerBands);
};

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
  client,
  isRestart
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
      email: email,
      id: id,
      curPair: curPair,
      interval: interval,
      period: period,
      standardDev: standardDev,
      amount: amount,
      active: true,
    };

    if (!isRestart) {
      await setBBAlgoDB(email, client, algoData);
    }

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
      const getMarkets = await publicBinance.loadMarkets();
      if (pb > 0.8) {
        const order = await trade(
          curPair,
          "sell",
          amount,
          apiKey,
          apiSecret,
          getMarkets
        );
        console.log("Sell signal: Price is above upper band.");
        console.log(curPair);
        console.log("email: " + email);
        console.log(pb);
        console.log("id: " + id);

        console.log(" ");
      } else if (pb < 0) {
        const order = await trade(
          curPair,
          "buy",
          amount,
          apiKey,
          apiSecret,
          getMarkets
        );
        console.log("Buy signal: Price is below lower band.");
        console.log(curPair);
        console.log("email: " + email);
        console.log(pb);
        console.log("id: " + id);

        console.log(" ");
      } else {
        console.log("Hold signal: Price is between upper and lower bands.");
        console.log(curPair);
        console.log("email: " + email);
        console.log(pb);
        console.log("id: " + id);
        console.log(" ");
      }
    };
    start();
    //check if email exists in runningBollingerBands and if not create it
    if (!runningBollingerBands[email]) {
      console.log(email);
      runningBollingerBands[email] = {};
    }
    runningBollingerBands[email] = {
      ...runningBollingerBands[email],
      [id]: setInterval(async () => {
        start();
      }, intervalMs),
    };
    console.log(" ");
    console.log("runningBollingerBands: ");
    console.log(runningBollingerBands);
    console.log(" ");

    return { runningBollingerBands, historicalBollingerBands };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  stopBollingerBands,
  startBollingerBands,
  deleteBollingerBands,
  restartBollingerBands,
};
