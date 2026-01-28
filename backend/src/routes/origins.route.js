const express = require("express");
const { listOrigins } = require("../controllers/origins.controller");

const router = express.Router();

router.get("/origins", listOrigins);

module.exports = router;
