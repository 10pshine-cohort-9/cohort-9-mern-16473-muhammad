const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';

// Central logger instance used throughout the app.
// In development, pino-pretty makes logs human-readable in the terminal.
// In production, we skip that for performance and let logs stay as structured JSON.
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Redact anything that could leak an auth cookie or JWT into log output
  // (pino-http logs full request/response headers by default).
  redact: {
    paths: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
    censor: '[REDACTED]',
  },
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
});

module.exports = logger;