const express = require("express");
const { getForecast } = require("../controllers/forecast.controller");

const router = express.Router();

router.get("/forecast", getForecast);

module.exports = router;
