/* eslint-disable object-curly-spacing */
const express = require("express");
const app = express();
const functions = require("firebase-functions");
const cors = require("cors");

app.use(cors({ origin: "https://arwis1.web.app" }));

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./arwis1-firebase-adminsdk.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// SERVER-DEV

app.use("/write/:userid", (req, res) => {
  const demo = {
    first: req.params.userid,
    last: "Demo",
    curPairs: {
      c1: "BTCUSD",
      c2: "ETHUSD",
    },
  };

  const snapshot = db.collection("users").doc(req.params.userid);

  snapshot.set(demo);
  const routeResponse = {
    messaage: "SUCCESSFUL WRITE TO DATABASE",
    data: demo,
  };
  res.send(routeResponse);
});

app.use("/read/:userid", async (req, res) => {
  const snapshot = db.collection("users").doc(req.params.userid);
  const doc = await snapshot.get();
  //  const fuckthisshit = { data: doc.data() };
  const jsons = JSON.stringify(doc.data());
  res.send(jsons);
  // res.send("hello");
});

app.use("/instance", (req, res) => {
  res.send("Instance Started");
});

app.use("/count", (req, res) => {
  res.send();
});
// Root Render

app.use("/", (req, res) => {
  res.send();
});

exports.app = functions.https.onRequest(app);
