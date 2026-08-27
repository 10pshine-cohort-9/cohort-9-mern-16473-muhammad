/**
 * Wraps an async route handler so any rejected promise is automatically
 * forwarded to next(err) -> global error middleware, instead of needing
 * a try/catch block in every single controller function.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;