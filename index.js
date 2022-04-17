const path = require("path");
const express = require("express");
const app = express(); // create express app

const Binance = require("node-binance-api");
const binance = new Binance().options({ APIKEY: "", APISECRET: "" });

app.use(express.static(path.resolve(__dirname, "./build")));

app.get("/trade", async (req, res) => {
  let data = "";
  const coin = await binance.prices("BNBBTC", (error, ticker) => {
    data = ticker.BNBBTC;
    res.send("Price of BNB: " + data);
  });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
