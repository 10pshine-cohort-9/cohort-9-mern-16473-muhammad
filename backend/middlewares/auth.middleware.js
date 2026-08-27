const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Protects a route by requiring a valid JWT in the cookie.
 * If valid, attaches the decoded payload (id, email) to req.user
 * so later handlers know who's making the request.
 */
const authenticate = (req, res, next) => {
  const token = req.cookies?.[process.env.COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next(); // token is valid — let the request continue to the actual route
  } catch (err) {
    logger.warn({ err: err.message }, 'JWT verification failed');
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

module.exports = authenticate;