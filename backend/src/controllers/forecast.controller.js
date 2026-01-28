const { getForecastDays } = require("../db/queries");
const { parsePositiveInt } = require("../utils/number")

async function getForecast(req, res, next) {
  try {
    const originId = parsePositiveInt(req.query.originId);
    if (!originId) {
      return res.status(400).json({
        error: { code: "BAD_REQUEST", message: "originId must be a positive integer" },
      });
    }

    const days = await getForecastDays(originId);
    res.json({ originId, days });
  } catch (err) {
    next(err);
  }
}

module.exports = { getForecast };
