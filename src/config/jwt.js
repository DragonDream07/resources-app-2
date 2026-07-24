'use strict';

const config = require('./index');

/**
 * JWT secret and token TTL constants derived from config/index.js
 */
const JWT_SECRET = config.jwt.secret;
const JWT_ACCESS_TTL = config.jwt.accessTTL;
const JWT_RESET_TTL = config.jwt.resetTTL;

module.exports = {
  JWT_SECRET,
  JWT_ACCESS_TTL,
  JWT_RESET_TTL,
};
