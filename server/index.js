const port = 80;
const express = require("express");
const app = express();
const functions = require("firebase-functions");
const cors = require("cors");
const serviceAccount = require("./arwisv1-firebase-adminsdk.json");
const ccxt = require("ccxt");
const binance = new ccxt.binance();

const crypto = require("crypto");
const JSEncrypt = require("node-jsencrypt");
const jsencrypt = new JSEncrypt();

const whitelist = ["http://localhost:3000", "https://arwis1.web.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS" + origin));
    }
  },
};

app.use(cors(corsOptions));
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

//////////////////////////////////////////////////////
// API KEY ENCRYPTION HANDLING FUNCTIONS

// DECRYPT APIKEY AND APISECRET
const decryptKey = (encryptedKey, privateKey) => {
  jsencrypt.setPrivateKey(privateKey);
  const decryptedKey = jsencrypt.decrypt(encryptedKey, "utf8");
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
  const dbPublicKey = dbKeyPair.publicKey;

  const dbApiKey = await encryptKey(clientApiKey, dbPublicKey);
  const dbApiSecret = await encryptKey(clientApiSecret, dbPublicKey);

  const snapshot = db.collection("users").doc(uid);
  const doc = await snapshot.get();

  snapshot.set(
    { apiKey: dbApiKey, apiSecret: dbApiSecret },
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

//GENERATE KEYPAIR
const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 8192,
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

const dbKeyPair = generateKeyPair();
const dbPrivateKey = dbKeyPair.privateKey;

//////////////////////////////////////////////////////
// API KEY HANDLING

//SEND PUBLIC KEY TO CLIENT
app.get("/api/client-public-key", async (req, res) => {
  res.send({ publicKey: clientPublicKey });
});

//GET ENCRYPTED API KEY AND SECRET FROM CLIENT
app.post("/api/encrypted-api-key", express.json(), async (req, res) => {
  const encryptedApiKey = req.body.encryptedApiKey;
  const encryptedApiSecret = req.body.encryptedApiSecret;
  const uid = req.body.uid;

  const clientApiKey = await decryptKey(encryptedApiKey, clientPrivateKey);
  const clientApiSecret = await decryptKey(
    encryptedApiSecret,
    clientPrivateKey
  );
  sendEncryptedApiKeyToDB(dbKeyPair, clientApiKey, clientApiSecret, uid);
});

//////////////////////////////////////////////////////
// SERVER-DEV

// WRITE
app.get("/write/:userid", async (req, res) => {
  let count = 0;
  const snapshot = db.collection("users").doc(req.params.userid);
  snapshot.set({ count: count }, { merge: true });
  const doc = await snapshot.get();
  const json = JSON.stringify(doc.data());
  res.send(json);
});

// READ
app.get("/read/:userid", async (req, res) => {
  const snapshot = db.collection("users").doc(req.params.userid);
  const doc = await snapshot.get();
  const jsons = JSON.stringify(doc.data());
  res.send(jsons);
});

//////////////////////////////////////////////////////
// BINANCE API

// GET TICKER DATA
app.get("/api/binance/:curPair", async (req, res) => {
  const ticker = await binance.fetchTicker(req.params.curPair);
  const tickerData = JSON.stringify(ticker);
  res.send(tickerData);
});

// GET CANDLESTICK DATA
app.get("/api/binance/candles/:curPair", async (req, res) => {
  if (binance.has.fetchOHLCV) {
    // milliseconds
    const candles = await binance.fetchOHLCV(req.params.curPair, "1m");
    res.send({ candles: candles });
  }
});

// GET WALLET BALANCE
app.get("/api/get-wallet-data/:uid", async (req, res) => {
  const { apiKey, apiSecret } = await getEncryptedApiKeyFromDBAndDecrypt(
    req.params.uid,
    dbPrivateKey,
  );
  const binance = new ccxt.binance({
    apiKey: apiKey,
    secret: apiSecret,
  });
  const walletData = await binance.fetchBalance();
  res.send({ walletData: walletData });
});

//////////////////////////////////////////////////////
// INSTANCE
const startInstance = async (uid) => {
  const snapshot = db.collection("users").doc(uid);
  setInterval(async () => {
    let countDoc = await snapshot.get();
    let count = JSON.stringify(countDoc.data().count);
    count++;
    snapshot.set({ count: count }, { merge: true });
  }, 5000);
};

app.use("/instance/:userid", async (req, res) => {
  let uid = req.params.userid;
  const instance = startInstance(uid);
  res.send(`INSTANCE CREATED FOR ${uid}`);
});

//////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

exports.app = functions.https.onRequest(app);
