const { getOrigins } = require("../db/queries");

async function listOrigins(req, res, next) {
  try {
    const origins = await getOrigins();
    res.json({ origins });
  } catch (err) {
    next(err);
  }
}

module.exports = { listOrigins };
