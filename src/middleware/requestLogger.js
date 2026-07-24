'use strict';

const morgan = require('morgan');
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});

/**
 * Custom Morgan token: request body (sanitised — passwords removed).
 */
morgan.token('body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) return '-';
  const sanitised = { ...req.body };
  if (sanitised.password) sanitised.password = '[REDACTED]';
  if (sanitised.newPassword) sanitised.newPassword = '[REDACTED]';
  if (sanitised.currentPassword) sanitised.currentPassword = '[REDACTED]';
  return JSON.stringify(sanitised);
});

/**
 * Morgan format string.
 */
const morganFormat =
  ':remote-addr :method :url :status :res[content-length] - :response-time ms :body';

/**
 * Morgan middleware using Winston as the write stream.
 */
const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
  skip: () => process.env.NODE_ENV === 'test',
});

module.exports = requestLogger;
module.exports.logger = logger;
