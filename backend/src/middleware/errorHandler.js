/**
 * Central Express error handler.
 *
 * - Logs the original error (useful for debugging)
 * - Returns a normalized JSON error shape: { error: { code, message } }
 * - Hides internal details for 500 errors (security + UX)
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = status === 500 ? "Internal Server Error" : err.message;

  res.status(status).json({ error: { code, message } });
}

module.exports = { errorHandler };
