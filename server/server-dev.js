const express = require("express");
const path = require("path");
const serveStatic = require("serve-static");

const app = express();
const port = 3000;

const ccxt = require("ccxt");
let binance = new ccxt.binance();

const renderApp = (response) => {
  response.sendFile(path.join(__dirname, "../build", "index.html"));
};

app.use(serveStatic(path.join(__dirname, "../build")));
app.get("/", (req, res) => {
  renderApp(res);
});

app.use(
  "/exchanges",
  (req, res, next) => {
    console.log(ccxt.exchanges);
    next();
  },
  (req, res) => {
    renderApp(res);
  }
);

app.use(
  "/ticker/:symbol",
  async (req, res, next) => {
    const symbol = req.params.symbol;
    const tick = await binance.fetchTicker(symbol);
    await res.json(tick);
  },
  (req, res) => {
    renderApp(res);
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
