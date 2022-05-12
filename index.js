const path = require("path");
const express = require("express");
const app = express(); // create express app

const Binance = require("node-binance-api");
const binance = new Binance().options({ APIKEY: "", APISECRET: "" });

app.use(express.static(path.resolve(__dirname, "./build")));

app.get("/chart_socket", async (req, res) => {
  binance.websockets.chart("BNBBTC", "1m", (symbol, interval, chart) => {
    let tick = binance.last(chart);
    const last = chart[tick].close;

    res.send(chart);
  });
});

app.get("/candlestick", async (req, res) => {
  const candle = binance.candlesticks(
    "VETUSDT",
    "1m",
    (error, ticks, symbol) => {
      let last_tick = ticks[ticks.length - 1];
      //console.log(last_tick);
      let [
        time,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        assetVolume,
        trades,
        buyBaseVolume,
        buyAssetVolume,
        ignored,
      ] = last_tick;
      res.send(ticks);
      return last_tick;
    },
    { limit: 20 }
  );
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
