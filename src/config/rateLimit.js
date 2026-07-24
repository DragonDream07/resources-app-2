'use strict';

const config = require('./index');

/**
 * Rate-limit window and max request constants derived from config/index.js
 */
const RATE_LIMIT_WINDOW_MS = config.rateLimit.windowMs;
const RATE_LIMIT_MAX = config.rateLimit.max;

module.exports = {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
};
