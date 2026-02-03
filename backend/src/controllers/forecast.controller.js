const { getForecastDays } = require("../db/queries");
const { parsePositiveInt } = require("../utils/number")

/**
 * GET /api/forecast?originId=1
 *
 * Validates originId, then returns stored 7-day forecast data from the DB.
 * Errors:
 *  - 400 BAD_REQUEST: originId missing/invalid
 *  - 500 INTERNAL_ERROR: unexpected errors are handled by the global errorHandler middleware
 */

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
