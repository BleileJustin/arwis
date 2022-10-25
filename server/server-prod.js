const express = require("express");
const path = require("path");
const logger = require("morgan");

const app = express();
const port = 3000;

app.use(logger("dev"));

app.get("/", (req, res) => {
  res.send(express.static(path.join(__dirname, "build")));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
