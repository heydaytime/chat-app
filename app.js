const express = require("express");
const morgan = require("morgan");

const app = express();

const api = require(`${__dirname}/routes/api`);
const requests = require(`${__dirname}/routes/requests`);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api", api);

app.use("/", requests);

module.exports = app;
