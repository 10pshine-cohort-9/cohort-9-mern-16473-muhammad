/**
 * Use this for any expected, handled error — validation failures,
 * not-found, unauthorized, duplicate email, etc. — so the global
 * error middleware knows this was anticipated and can safely show
 * the message to the client.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;