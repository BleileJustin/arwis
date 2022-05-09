const path = require("path");
const express = require("express");
const app = express(); // create express app

const Binance = require("node-binance-api");
const binance = new Binance().options({ APIKEY: "", APISECRET: "" });

app.use(express.static(path.resolve(__dirname, "./build")));

app.get("/candlestick", async (req, res) => {
  const candle = binance.candlesticks(
    "VETUSDT",
    "5m",
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
      res.send(last_tick);
      return last_tick;
    },
    { limit: 20 }
  );
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
