const express = require("express");
const app = express();
const functions = require("firebase-functions");
const cors = require("cors");

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

const serviceAccount = require("./arwis1-firebase-adminsdk.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const port = 80;

// SERVER-DEV

//// WRITE
app.use("/write/:userid", async (req, res) => {
  let count = 0;

  const snapshot = db.collection("users").doc(req.params.userid);

  snapshot.set({ count: count }, { merge: true });
  const doc = await snapshot.get();
  const json = JSON.stringify(doc.data());
  res.send(json);
});

//// READ
app.use("/read/:userid", async (req, res) => {
  const snapshot = db.collection("users").doc(req.params.userid);
  const doc = await snapshot.get();
  //  const fuckthisshit = { data: doc.data() };
  const jsons = JSON.stringify(doc.data());
  res.send(jsons);
  // res.send("hello");
});

app.use("/count", (req, res) => {
  res.send("count");
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
