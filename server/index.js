const origin = "https://arwis.up.railway.app";
// const origin = "http://localhost:3000";

// Server and Database Packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
// Exchange packages
const ccxt = require("ccxt");
const publicBinance = new ccxt.binanceus();
// Encryption packages
const crypto = require("crypto");
const JSEncrypt = require("node-jsencrypt");

const app = express();
const port = process.env.PORT || 5001;
// ////////////////////////////////////////////////////
// CORS CONFIGURATION AND SERVER & DATABASE INITIALIZATION

const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MONGODB CONNECTION

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

// ////////////////////////////////////////////////////
// USER DATA FUNCTIONS

const calculatePortfolioValue = (balances, prices) => {
  let portfolioValue = 0;
  for (const balance of balances) {
    const free = balance.free;
    const locked = balance.locked;
    const total = parseFloat(free) + parseFloat(locked);
    const price = prices[balance.asset + "/USDT"];
    if (total > 0 && price) {
      portfolioValue += total * parseFloat(price.last);
    }
  }
  return portfolioValue;
};

// ////////////////////////////////////////////////////
// API KEY ENCRYPTION HANDLING FUNCTIONS

// DECRYPT APIKEY AND APISECRET
const decryptKey = (encryptedKey, privateKey) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  const decryptedKey = decrypt.decrypt(encryptedKey);
  return decryptedKey;
};

// ENCRYPT APIKEY AND APISECRET
const encryptKey = (key, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encryptedKey = encrypt.encrypt(key);
  return encryptedKey;
};

//  ENCRYPT AND SEND USER API KEY AND SECRET TO DATABASE
const sendEncryptedApiKeyToDB = async (
  dbPublicKey,
  clientApiKey,
  clientApiSecret,
  email
) => {
  try {
    const userApiKey = await encryptKey(clientApiKey, dbPublicKey);
    const userApiSecret = await encryptKey(clientApiSecret, dbPublicKey);

    const collection = client.db("arwis").collection("users");

    collection.updateOne(
      { email: email },
      { $set: { apiKey: userApiKey, apiSecret: userApiSecret } },
      { upsert: true }
    );
  } catch (e) {
    console.log(e);
  }
};
// GET ENCRYPTED USER API KEY AND SECRET FROM DB AND DECRYPT
const getEncryptedApiKeyFromDBAndDecrypt = async (email, privateKey) => {
  const collection = client.db("arwis").collection("users");
  try {
    const user = await collection.find({ email: email }).toArray();
    const encryptedApiKey = user[0].apiKey;
    const encryptedApiSecret = user[0].apiSecret;
    const apiKey = decryptKey(encryptedApiKey, privateKey);
    const apiSecret = decryptKey(encryptedApiSecret, privateKey);
    return { apiKey, apiSecret };
  } catch (e) {
    console.log(e);
  }
};

// GENERATE RSA ENCRYPTION KEYPAIR FOR CLIENT AND DATABASE
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

// ////////////////////////////////////////////////////
// BINANCE API

// // PRIVATE API

// GET PORTFOLIO VALUE
const getPortfolioValueFromBinance = async (apiKey, apiSecret) => {
  const binance = new ccxt.binanceus({
    apiKey: apiKey,
    secret: apiSecret,
  });
  try {
    const balances = await binance.fetchBalance();
    const prices = await publicBinance.fetchTickers();
    const balancesArray = balances.info.balances;

    const portfolioValue = calculatePortfolioValue(balancesArray, prices);
    return portfolioValue;
  } catch (e) {
    console.log(e);
  }
};

// GET PORTFOLIO DISTRIBUTION PERCENTAGE FOR EACH ASSET
const getPortfolioDistributionFromBinance = async (apiKey, apiSecret) => {
  const binance = new ccxt.binanceus({
    apiKey: apiKey,
    secret: apiSecret,
  });
  try {
    const balances = await binance.fetchBalance();
    const prices = await publicBinance.fetchTickers();
    const balancesArray = balances.info.balances;

    const portfolioValue = calculatePortfolioValue(balancesArray, prices);
    const portfolioDistribution = [];
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
    }
    return portfolioDistribution;
  } catch (e) {
    console.log(e);
  }
};

// SET INSTANCE OF WALLET IN DATABASE
// ////////////////////////////////////////////////////
const setWalletInDB = async (email, wallet) => {
  const collection = client.db("arwis").collection("users");
  try {
    const result = await collection.updateOne(
      { email: email },
      { $set: { wallets: [wallet] } },
      { upsert: true }
    );
  } catch (e) {
    console.log(e);
  }
};

// GET WALLET FROM DATABASE
const getWalletsFromDB = async (email) => {
  const collection = client.db("arwis").collection("users");
  try {
    const user = await collection.find({ email: email }).toArray();
    if (!user[0].wallets) {
      return [];
    } else {
      return user[0].wallets;
    }
  } catch (e) {
    console.log(e);
  }
};

app.post("/api/set-wallet", express.json(), async (req, res) => {
  const wallet = req.body.wallet;
  const email = req.body.email;
  try {
    await setWalletInDB(email, wallet);
  } catch (e) {
    console.log(e);
  }
  res.status(200).send();
});

app.post("/api/get-wallets", express.json(), async (req, res) => {
  const email = req.body.email;
  try {
    const wallets = await getWalletsFromDB(email);
    res.send({ wallets });
  } catch (e) {
    console.log(e);
  }
});

// GET WALLET BALANCE
app.post("/api/wallet", express.json(), async (req, res) => {
  try {
    const api = await getEncryptedApiKeyFromDBAndDecrypt(
      req.body.email,
      dbPrivateKey
    );
    const authedBinance = new ccxt.binanceus({
      apiKey: api.apiKey,
      secret: api.apiSecret,
    });
    const currency = req.body.currency;
    const allBalance = await authedBinance.fetchBalance();

    const walletBalance = allBalance.total[currency];
    const prices = await publicBinance.fetchTickers();

    const price = prices[currency + "/USDT"];

    const walletBalanceToUsd = (walletBalance * price.last).toFixed(4);

    res.send({ walletBalance, walletBalanceToUsd });
  } catch (e) {
    console.log(e);
  }
});

// ////////////////////////////////////////////////////
// PORTFOLIO VALUE AND DISTRIBUTION ROUTES

// SET PORTFOLIO VALUE IN DATABASE
const setPortfolioValueInDB = async (email) => {
  try {
    const api = await getEncryptedApiKeyFromDBAndDecrypt(email, dbPrivateKey);
    const collection = client.db("arwis").collection("users");

    setInterval(async () => {
      const portfolioValue = await getPortfolioValueFromBinance(
        api.apiKey,
        api.apiSecret
      );
      const portfolioValueRecord = {
        portfolioValue: portfolioValue,
        timestamp: Date.now(),
      };
      console.log("SETTING PORTFOLIO VALUE IN DB");
      await collection.updateOne(
        { email: email },
        { $push: { portfolioValueRecord: portfolioValueRecord } },
        { upsert: true }
      );
    }, 1000 * 60 * 5); // 5 MINUTES
  } catch (e) {
    console.log(e);
  }
};

// GET PORTFOLIO VALUE RECORDS FROM DATABASE
const getPortfolioValueRecordsFromDB = async (email) => {
  const collection = client.db("arwis").collection("users");
  try {
    const user = await collection.find({ email: email }).toArray();
    if (!user[0].portfolioValueRecord) {
      return [];
    } else {
      return user[0].portfolioValueRecord;
    }
  } catch (e) {
    console.log(e);
  }
};

// GET PORTFOLIO VALUE RECORDS FROM DATABASE ROUTE
app.post("/api/portfolio-chart", express.json(), async (req, res) => {
  const email = req.body.email;
  try {
    const portfolioValueRecord = await getPortfolioValueRecordsFromDB(email);
    res.send({ portfolioValueRecord });
  } catch (e) {
    console.log(e);
  }
});

// PORTFOLIO VALUE ROUTE
app.post("/api/portfolio-value", express.json(), async (req, res) => {
  try {
    const api = await getEncryptedApiKeyFromDBAndDecrypt(
      req.body.email,
      dbPrivateKey
    );
    const apiKey = api.apiKey;
    const apiSecret = api.apiSecret;
    const portfolioValue = await getPortfolioValueFromBinance(
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
    await setPortfolioValueInDB(email);
    res.status(200).send();
  } catch (e) {
    console.log(e);
  }
});

// PORTFOLIO DISTRIBUTION ROUTE
app.post("/api/portfolio-distribution", express.json(), async (req, res) => {
  try {
    const api = await getEncryptedApiKeyFromDBAndDecrypt(
      req.body.email,
      dbPrivateKey
    );
    const apiKey = api.apiKey;
    const apiSecret = api.apiSecret;
    const portfolioDistribution = await getPortfolioDistributionFromBinance(
      apiKey,
      apiSecret
    );

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

// SEND PUBLIC ENCRYPTION KEY TO CLIENT
app.post("/api/client-public-key", (req, res) => {
  res.send({ publicKey: clientPublicKey });
});

// GET AND DECRYPT API KEY AND SECRET FROM CLIENT
app.post("/api/encrypt-api-key", express.json(), async (req, res) => {
  const encryptedApiKey = req.body.encryptedApiKey;
  const encryptedApiSecret = req.body.encryptedApiSecret;
  const email = req.body.email;
  const clientApiKey = decryptKey(encryptedApiKey, clientPrivateKey);
  const clientApiSecret = decryptKey(encryptedApiSecret, clientPrivateKey);
  // ENCRYPT API KEY AND SECRET AND SEND TO DATABASE
  try {
    await sendEncryptedApiKeyToDB(
      dbPublicKey,
      clientApiKey,
      clientApiSecret,
      email
    );
    res.send("ok");
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
