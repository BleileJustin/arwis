// API
// //////////////////////////////////////////

// const origin = "https://arwis.up.railway.app";
const origin = "http://localhost:3000";

// Server and Database Packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
// Exchange packages
const ccxt = require("ccxt");
const publicBinance = new ccxt.binanceus();
// Encryption packages
const crypto = require("crypto");

// EXPRESS SERVER INITIALIZATION
const app = express();
const port = process.env.PORT || 5001;
const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MONGODB DATABASE INITIALIZATION

const mongoUri = process.env.MONGO_URL;
const mongoClient = require("mongodb").MongoClient;
const client = new mongoClient(mongoUri);
const connectDB = async () => {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }
};
connectDB();

// GENERATE RSA ENCRYPTION KEYPAIR FOR CLIENT
const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  return keyPair;
};

const clientKeyPair = generateKeyPair();
const clientPublicKey = clientKeyPair.publicKey;
const clientPrivateKey = clientKeyPair.privateKey;

const dbPublicKey = process.env.DB_PUBLIC_KEY;
const dbPrivateKey = process.env.DB_PRIVATE_KEY;

//IMPORTED MODULES
const portfolio = require("./modules/portfolio/portfolio-analytics.js");
const databaseApikeyManager = require("./modules/database_manager/database-apikey-manager.js");
const databasePortfolioManager = require("./modules/portfolio/portfolio-database.js");
const databaseWalletManager = require("./modules/wallets/wallets-database.js");

app.post("/api/set-wallet", express.json(), async (req, res) => {
  const wallet = req.body.wallet;
  const email = req.body.email;
  try {
    await databaseWalletManager.setWalletInDB(email, wallet, client);
  } catch (e) {
    console.log(e);
  }
  res.status(200).send();
});

app.post("/api/delete-wallet", express.json(), async (req, res) => {
  databaseWalletManager.deleteWalletFromDB(
    req.body.email,
    req.body.curPair,
    client
  );
  res.status(200).send();
});

app.post("/api/get-wallets", express.json(), async (req, res) => {
  try {
    const wallets = await databaseWalletManager.getWalletsFromDB(
      req.body.email,
      client
    );
    res.send({ wallets });
  } catch (e) {
    console.log(e);
  }
});

// GET WALLET BALANCE
app.post("/api/wallet", express.json(), async (req, res) => {
  try {
    const api = await databaseApikeyManager.getEncryptedApiKeyFromDBAndDecrypt(
      req.body.email,
      dbPrivateKey,
      client
    );
    const authedBinance = new ccxt.binanceus({
      apiKey: api.apiKey,
      secret: api.apiSecret,
    });
    authedBinance.setSandboxMode(true);
    const currency = req.body.currency;

    const prices = await publicBinance.fetchTickers();
    const price = prices[currency + "/USDT"];

    const allBalance = await authedBinance.fetchBalance();
    if (!allBalance[currency]) {
      return res.send({ walletBalance: 0, walletBalanceToUsd: 0 });
    }
    const walletBalance = allBalance.total[currency];
    const walletBalanceToUsd = (walletBalance * price.last).toFixed(2);

    res.send({ walletBalance, walletBalanceToUsd });
  } catch (e) {
    console.log(e);
  }
});

// GET PORTFOLIO VALUE RECORDS FROM DATABASE ROUTE
app.post("/api/portfolio-chart", express.json(), async (req, res) => {
  const email = req.body.email;
  try {
    const portfolioValueRecord =
      await databasePortfolioManager.getPortfolioValueRecordsFromDB(
        email,
        client
      );
    res.send({ portfolioValueRecord });
  } catch (e) {
    console.log(e);
  }
});

// PORTFOLIO VALUE ROUTE
app.post("/api/portfolio-value", express.json(), async (req, res) => {
  try {
    const api = await databaseApikeyManager.getEncryptedApiKeyFromDBAndDecrypt(
      req.body.email,
      dbPrivateKey,
      client
    );
    const apiKey = api.apiKey;
    const apiSecret = api.apiSecret;
    const portfolioValue = await portfolio.getPortfolioValueFromBinance(
      apiKey,
      apiSecret
    );
    res.send({ portfolioValue });
  } catch (e) {
    console.log(e);
  }
});

// SET PORTFOLIO VALUE IN DATABASE ROUTE
app.post("/api/set-portfolio-value", express.json(), async (req, res) => {
  try {
    const email = req.body.email;
    await databasePortfolioManager.setPortfolioValueInDB(email, client);
    res.status(200).send();
  } catch (e) {
    console.log(e);
  }
});

// PORTFOLIO DISTRIBUTION ROUTE
app.post("/api/portfolio-distribution", express.json(), async (req, res) => {
  try {
    const api = await databaseApikeyManager.getEncryptedApiKeyFromDBAndDecrypt(
      req.body.email,
      dbPrivateKey,
      client
    );
    const apiKey = api.apiKey;
    const apiSecret = api.apiSecret;
    const portfolioDistribution =
      await portfolio.getPortfolioDistributionFromBinance(apiKey, apiSecret);

    res.send({ portfolioDistribution });
  } catch (e) {
    console.log(e);
  }
});

// ////////////////////////////////////////////////////
// // PUBLIC API

// GET TICKER DATA
app.get("/api/binance/:curPair", async (req, res) => {
  try {
    const ticker = await publicBinance.fetchTicker(req.params.curPair);
    const tickerData = JSON.stringify(ticker);
    res.send(tickerData);
  } catch (e) {
    console.log(e);
  }
});

// GET CANDLESTICK DATA
app.post("/api/binance/candles", express.json(), async (req, res) => {
  try {
    if (publicBinance.has.fetchOHLCV) {
      // milliseconds
      const candles = await publicBinance.fetchOHLCV(
        req.body.curPair,
        req.body.interval
      );
      res.send({ candles: candles });
    }
  } catch (e) {
    console.log(e);
  }
});

// ////////////////////////////////////////////////////
// API KEY ENCRYPTION HANDLING/ AuthForm.js ENDPOINTS

// DELETE USER ROUTE
app.post("/api/delete-user", express.json(), async (req, res) => {
  try {
    const email = req.body.email;
    databaseApikeyManager.deleteUserFromDB(email, client);
    res.status(200).send();
  } catch (e) {
    console.log(e);
  }
});

// SEND PUBLIC ENCRYPTION KEY TO CLIENT
app.post("/api/client-public-key", (req, res) => {
  res.send({ publicKey: clientPublicKey });
});

// GET AND DECRYPT API KEY AND SECRET FROM CLIENT
app.post("/api/encrypt-api-key", express.json(), async (req, res) => {
  const encryptedApiKey = req.body.encryptedApiKey;
  const encryptedApiSecret = req.body.encryptedApiSecret;
  const email = req.body.email;
  const clientApiKey = databaseApikeyManager.decryptKey(
    encryptedApiKey,
    clientPrivateKey
  );
  const clientApiSecret = databaseApikeyManager.decryptKey(
    encryptedApiSecret,
    clientPrivateKey
  );
  const authedBinance = new ccxt.binanceus({
    apiKey: clientApiKey,
    secret: clientApiSecret,
  });
  authedBinance.setSandboxMode(true);
  try {
    await authedBinance.fetchBalance();
  } catch (e) {
    console.log(e);
    return res.send("error");
  }

  // ENCRYPT API KEY AND SECRET AND SEND TO DATABASE
  try {
    await databaseApikeyManager.sendEncryptedApiKeyToDB(
      dbPublicKey,
      clientApiKey,
      clientApiSecret,
      email,
      client
    );
    res.send("ok");
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
