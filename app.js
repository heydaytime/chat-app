const express = require("express");
const morgan = require("morgan");

const app = express();

const apiRouter = require(`${__dirname}/routes/apiRouter`);
const redirectRouter = require(`${__dirname}/routes/redirect`);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api", apiRouter);
app.use("/", redirectRouter);

module.exports = app;
