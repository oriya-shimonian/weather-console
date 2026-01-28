const express = require("express");
const originsRoute = require("./routes/origins.route");
const forecastRoute = require("./routes/forecast.route");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(express.json());

  // Routes
  app.use("/api", originsRoute);
  app.use("/api", forecastRoute);

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
