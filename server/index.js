const express = require("express");
const app = express();
const functions = require("firebase-functions");
const cors = require("cors");
const serviceAccount = require("./arwisv1-firebase-adminsdk.json");
const port = 80;
const ccxt = require("ccxt");
const binance = new ccxt.binance();

var whitelist = ["http://localhost:3000", "https://arwis1.web.app"];
var corsOptions = {
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
//Binance API
app.get("/api/binance/:curPair", async (req, res) => {
  const ticker = await binance.fetchTicker(req.params.curPair);
  const tickerData = JSON.stringify(ticker);
  res.send(tickerData);
});

app.get("/api/binance/candles/:curPair", async (req, res) => {
  if (binance.has.fetchOHLCV) {
    // milliseconds
    const candles = await binance.fetchOHLCV(req.params.curPair, "1m");
    res.send({ candles: candles });
  }
});

//////////////////////////////////////////////////////
// SERVER-DEV
//// WRITE
app.get("/write/:userid", async (req, res) => {
  let count = 0;

  const snapshot = db.collection("users").doc(req.params.userid);

  snapshot.set({ count: count }, { merge: true });
  const doc = await snapshot.get();
  const json = JSON.stringify(doc.data());
  res.send(json);
});

//// READ
app.get("/read/:userid", async (req, res) => {
  const snapshot = db.collection("users").doc(req.params.userid);
  const doc = await snapshot.get();
  //  const fuckthisshit = { data: doc.data() };
  const jsons = JSON.stringify(doc.data());
  res.send(jsons);
  // res.send("hello");
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
exports.app = functions.https.onRequest(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
