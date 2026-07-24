'use strict';

/**
 * Centralised Express error handler.
 * Must be registered as the last middleware in the application.
 * Produces structured JSON error responses.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'An unexpected error occurred.';

  const body = {
    status: 'error',
    code,
    message,
  };

  if (err.details) {
    body.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && status === 500) {
    body.stack = err.stack;
  }

  return res.status(status).json(body);
}

module.exports = errorHandler;
