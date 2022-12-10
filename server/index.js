const origin = "https://arwisv1.web.app";
// const origin = "http://localhost:3000";

// Server and Database Packages
const express = require("express");
const cors = require("cors");
// Exchange packages
const ccxt = require("ccxt");
const publicBinance = new ccxt.binanceus();
// Encryption packages
const crypto = require("crypto");
const JSEncrypt = require("node-jsencrypt");

const app = express();
const port = process.env.PORT || 5000;

// const encPbKey = functions.config().enckey.pbkey;

// ////////////////////////////////////////////////////
// CORS CONFIGURATION AND SERVER & DATABASE INITIALIZATION

const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ////////////////////////////////////////////////////
// MONGODB

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

const mongoUri = process.env.MONGO_URL;
const mongoClient = require("mongodb").MongoClient;
const client = new mongoClient(mongoUri);

const tryClient = async () => {
  try {
    await client.connect();

    await listDatabases(client);
  } catch (e) {
    console.error(e);
  }
};
tryClient();
// ////////////////////////////////////////////////////
// USER DATA FUNCTIONS

const calculatePortfolioValue = async (balances, prices) => {
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
  uid
) => {
  const userApiKey = await encryptKey(clientApiKey, dbPublicKey);
  const userApiSecret = await encryptKey(clientApiSecret, dbPublicKey);
  //   const snapshot = db.collection("users").doc(uid);
  //   snapshot.set(
  //     { apiKey: userApiKey, apiSecret: userApiSecret },
  //     {
  //       merge: true,
  //     }
  //   );
};
// GET ENCRYPTED USER API KEY AND SECRET FROM DB AND DECRYPT
// const getEncryptedApiKeyFromDBAndDecrypt = async (uid, privateKey) => {
//   const snapshot = db.collection("users").doc(uid);
//   const doc = await snapshot.get();
//   const encryptedApiKey = doc.data().apiKey;
//   const encryptedApiSecret = doc.data().apiSecret;
//   const apiKey = decryptKey(encryptedApiKey, privateKey);
//   const apiSecret = decryptKey(encryptedApiSecret, privateKey);
//   return { apiKey, apiSecret };
// };

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
  const balances = await binance.fetchBalance();
  const prices = await publicBinance.fetchTickers();
  const balancesArray = balances.info.balances;

  const portfolioValue = await calculatePortfolioValue(balancesArray, prices);
  return portfolioValue;
};

// GET PORTFOLIO DISTRIBUTION PERCENTAGE FOR EACH ASSET
const getPortfolioDistributionFromBinance = async (apiKey, apiSecret) => {
  const binance = new ccxt.binanceus({
    apiKey: apiKey,
    secret: apiSecret,
  });
  const balances = await binance.fetchBalance();
  const prices = await publicBinance.fetchTickers();
  const balancesArray = balances.info.balances;

  const portfolioValue = await calculatePortfolioValue(balancesArray, prices);
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
};

// INSTANCE OF WALLET IN DATABASE
// ////////////////////////////////////////////////////
// const setWalletInDB = async (uid, wallet) => {
//   const snapshot = db.collection("users").doc(uid);
//   // PUSH NEW WALLET TO DATABASE
//   snapshot.set(
//     { wallets: arrayUnion(wallet) },
//     {
//       merge: true,
//     }
//   );
// };

// GET WALLET FROM DATABASE
// const getWalletsFromDB = async (uid) => {
//   console.log("GETTING WALLET FROM DB");
//   console.log(uid);
//   const snapshot = db.collection("users").doc(uid);
//   const doc = await snapshot.get();
//   const wallets = doc.data().wallets;
//   return wallets;
// };

// app.post("/api/set-wallet", express.json(), async (req, res) => {
//   const wallet = req.body.wallet;
//   const email = req.body.email;
//   await setWalletInDB(email, wallet);
//   res.status(200).send();
// });

// app.post("/api/get-wallets", express.json(), async (req, res) => {
//   const email = req.body.email;
//   const wallets = await getWalletsFromDB(email);
//   res.send({ wallets });
// });

// GET WALLET BALANCE
// // app.post("/api/wallet", express.json(), async (req, res) => {
// //   const api = await getEncryptedApiKeyFromDBAndDecrypt(
// //     req.body.uid,
// //     dbPrivateKey
// //   );
//   const authedBinance = new ccxt.binanceus({
//     apiKey: api.apiKey,
//     secret: api.apiSecret,
//   });
//   const currency = req.body.currency;
//   const allBalance = await authedBinance.fetchBalance();
//   const walletBalance = allBalance.total[currency];
//   const prices = await publicBinance.fetchTickers();
//   const price = prices[currency + "/USDT"];

//   const walletBalanceToUsd = (walletBalance * price.last).toFixed(4);
//   console.log(walletBalanceToUsd);

//   res.send({ walletBalance, walletBalanceToUsd });
// });

// ////////////////////////////////////////////////////
// PORTFOLIO VALUE AND DISTRIBUTION ROUTES

// SET PORTFOLIO VALUE IN DATABASE
// const setPortfolioValueInDB = async (uid) => {
//   const snapshot = db.collection("users").doc(uid);
//   const api = await getEncryptedApiKeyFromDBAndDecrypt(uid, dbPrivateKey);

//   setInterval(async () => {
//     const portfolioValue = await getPortfolioValueFromBinance(
//       api.apiKey,
//       api.apiSecret
//     );
//     const portfolioValueRecord = {
//       portfolioValue: portfolioValue,
//       timestamp: Date.now(),
//     };
//     console.log("SETTING PORTFOLIO VALUE IN DB");
//     snapshot.set(
//       { portfolioValue: arrayUnion(portfolioValueRecord) },
//       {
//         merge: true,
//       }
//     );
//   }, 1000 * 60 * 5); // 5 MINUTES
// };

// PORTFOLIO VALUE ROUTE
// app.post("/api/portfolio-value", express.json(), async (req, res) => {
//   const api = await getEncryptedApiKeyFromDBAndDecrypt(
//     req.body.uid,
//     dbPrivateKey
//   );
//   const apiKey = api.apiKey;
//   const apiSecret = api.apiSecret;
//   const portfolioValue = await getPortfolioValueFromBinance(apiKey, apiSecret);
//   res.send({ portfolioValue });
// });

// SET PORTFOLIO VALUE IN DATABASE ROUTE
// app.post("/api/set-portfolio-value", express.json(), async (req, res) => {
//   const email = req.body.email;
//   await setPortfolioValueInDB(email);
//   res.status(200).send();
// });

// PORTFOLIO DISTRIBUTION ROUTE
// app.post("/api/portfolio-distribution", express.json(), async (req, res) => {
//   const api = await getEncryptedApiKeyFromDBAndDecrypt(
//     req.body.uid,
//     dbPrivateKey
//   );
//   const apiKey = api.apiKey;
//   const apiSecret = api.apiSecret;
//   const portfolioDistribution = await getPortfolioDistributionFromBinance(
//     apiKey,
//     apiSecret
//   );

//   res.send({ portfolioDistribution });
// });

// ////////////////////////////////////////////////////
// // PUBLIC API

// GET TICKER DATA
app.get("/api/binance/:curPair", async (req, res) => {
  const ticker = await publicBinance.fetchTicker(req.params.curPair);
  const tickerData = JSON.stringify(ticker);
  res.send(tickerData);
});

// GET CANDLESTICK DATA
app.post("/api/binance/candles", express.json(), async (req, res) => {
  if (publicBinance.has.fetchOHLCV) {
    // milliseconds
    const candles = await publicBinance.fetchOHLCV(
      req.body.curPair,
      req.body.interval
    );
    res.send({ candles: candles });
  }
});

// ////////////////////////////////////////////////////
// API KEY HANDLING/ AuthForm.js ENDPOINTS

// SEND PUBLIC ENCRYPTION KEY TO CLIENT
app.post("/api/client-public-key", async (req, res) => {
  res.send({ publicKey: clientPublicKey });
});

// GET AND DECRYPT API KEY AND SECRET FROM CLIENT
app.post("/api/encrypt-api-key", express.json(), async (req, res) => {
  const encryptedApiKey = req.body.encryptedApiKey;
  const encryptedApiSecret = req.body.encryptedApiSecret;
  const uid = req.body.uid;
  const clientApiKey = await decryptKey(encryptedApiKey, clientPrivateKey);
  const clientApiSecret = await decryptKey(
    encryptedApiSecret,
    clientPrivateKey
  );
  // ENCRYPT API KEY AND SECRET AND SEND TO DATABASE
  sendEncryptedApiKeyToDB(dbPublicKey, clientApiKey, clientApiSecret, uid);
  res.send("ok");
});
// ////////////////////////////////////////////////////
// INSTANCE
// const startInstance = async (uid) => {
//   const snapshot = db.collection("users").doc(uid);
//   setInterval(async () => {
//     const countDoc = await snapshot.get();
//     let count = JSON.stringify(countDoc.data().count);
//     count++;
//     snapshot.set({ count: count }, { merge: true });
//   }, 5000);
// };

app.use("/instance/:userid", async (req, res) => {
  const uid = req.params.userid;
  res.send(`INSTANCE CREATED FOR ${uid}`);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
