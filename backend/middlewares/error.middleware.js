const logger = require('../utils/logger');

/**
 * Global error handler — must be registered LAST, after all routes.
 * Any error passed to next(err), or thrown inside an async route
 * wrapped with catchAsync, ends up here.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
      statusCode,
    },
    isOperational ? 'Handled application error' : 'Unexpected server error'
  );

  res.status(statusCode).json({
    // Never leak internal error details for unexpected crashes —
    // only show the message for errors we deliberately created (AppError).
    message: isOperational ? err.message : 'Something went wrong. Please try again later.',
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFoundHandler };