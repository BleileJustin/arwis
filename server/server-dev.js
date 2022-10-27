const express = require("express");
const path = require("path");
const logger = require("morgan");
const serveStatic = require("serve-static");

const app = express();
const port = 3000;

app.use(logger("dev"));

app.use(serveStatic(path.join(__dirname, "../build")));

console.log(path.join(__dirname, "../build", "index.html"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
