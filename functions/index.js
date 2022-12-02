/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable object-curly-spacing */
// UPDATE SERVICE ACCOUNT PATH BEFORE DEPLOYING
const serviceAccount = require("./arwisv1-firebase-adminsdk-diedy-c15bf5cfc5.json");
// Server and Database Packages
const port = 80;
const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Exchange packages
const ccxt = require("ccxt");
const publicBinance = new ccxt.binanceus();
// Encryption packages
const crypto = require("crypto");
const JSEncrypt = require("node-jsencrypt");

const app = express();

// const encPbKey = functions.config().enckey.pbkey;

// ////////////////////////////////////////////////////
// CORS CONFIGURATION AND SERVER & DATABASE INITIALIZATION
// const origin = "https://arwisv1.web.app";
const origin = "http://localhost:3000";

const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const { getFirestore } = require("firebase-admin/firestore");
const initApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore(initApp);

// ////////////////////////////////////////////////////
// API KEY ENCRYPTION HANDLING FUNCTIONS

// DECRYPT APIKEY AND APISECRET
const decryptKey = (encryptedKey, privateKey) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  const decryptedKey = decrypt.decrypt(encryptedKey);
  console.log("48");
  console.log(decryptedKey);
  return decryptedKey;
};

// ENCRYPT APIKEY AND APISECRET
const encryptKey = (key, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encryptedKey = encrypt.encrypt(key);
  return encryptedKey;
};

// SEND ENCRYPTED APIKEY AND APISECRET TO DATABASE
const sendEncryptedApiKeyToDB = async (
  dbKeyPair,
  clientApiKey,
  clientApiSecret,
  uid
) => {
  const dbPublicKey = dbKeyPair.pbkey;
  const userApiKey = await encryptKey(clientApiKey, dbPublicKey);
  const userApiSecret = await encryptKey(clientApiSecret, dbPublicKey);
  const snapshot = db.collection("users").doc(uid);
  snapshot.set(
    { apiKey: userApiKey, apiSecret: userApiSecret },
    {
      merge: true,
    }
  );
};

const getEncryptedApiKeyFromDBAndDecrypt = async (uid, privateKey) => {
  const snapshot = db.collection("users").doc(uid);
  const doc = await snapshot.get();
  const encryptedApiKey = doc.data().apiKey;
  const encryptedApiSecret = doc.data().apiSecret;
  const apiKey = decryptKey(encryptedApiKey, privateKey);
  const apiSecret = decryptKey(encryptedApiSecret, privateKey);
  return { apiKey, apiSecret };
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

const dbConfEncKeyPair = functions.config().enckey;

const dbPrivateKey = dbConfEncKeyPair.pvkey;

// ////////////////////////////////////////////////////
// API KEY HANDLING/ AUTHFORM ENDPOINTS

// SEND PUBLIC ENCRYPTION KEY TO CLIENT
app.post("/api/client-public-key", async (req, res) => {
  const key = { publicKey: clientPublicKey };
  const keyString = JSON.stringify(key);
  res.send({ keyString });
});
// kdsal;

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
  sendEncryptedApiKeyToDB(dbConfEncKeyPair, clientApiKey, clientApiSecret, uid);
  res.send("ok");
});

// ////////////////////////////////////////////////////
// BINANCE API

// // PRIVATE API
// GET WALLET BALANCE
app.post("/api/wallet", express.json(), async (req, res) => {
  const api = await getEncryptedApiKeyFromDBAndDecrypt(
    req.body.uid,
    dbPrivateKey
  );
  const authedBinance = new ccxt.binanceus({
    apiKey: api.apiKey,
    secret: api.apiSecret,
  });
  const balance = await authedBinance.fetchBalance();
  res.send({ walletData: balance });
});
// // PUBLIC API
// GET TICKER DATA
app.get("/api/binance/:curPair", async (req, res) => {
  const ticker = await publicBinance.fetchTicker(req.params.curPair);
  const tickerData = JSON.stringify(ticker);
  res.send(tickerData);
});

// GET CANDLESTICK DATA
app.get("/api/binance/candles/:curPair", async (req, res) => {
  if (publicBinance.has.fetchOHLCV) {
    // milliseconds
    const candles = await publicBinance.fetchOHLCV(req.params.curPair, "1m");
    res.send({ candles: candles });
  }
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

// ////////////////////////////////////////////////////

exports.app = functions.https.onRequest(app);

app.listen(port, () => {
  console.log(`app listening at port: ${port}`);
});
