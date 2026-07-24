const crypto = require('crypto');

const TOKEN_BYTE_LENGTH = 32;

/**
 * Generate a cryptographically secure random reset token.
 *
 * @returns {{ rawToken: string, hashedToken: string }}
 *   rawToken   - hex string to send to the user (not stored)
 *   hashedToken - SHA-256 hex digest to persist in the database
 */
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  return { rawToken, hashedToken };
};

/**
 * Hash a raw token received from the user for comparison against the stored hash.
 *
 * @param {string} rawToken - The plain token value supplied by the client
 * @returns {string} SHA-256 hex digest
 */
const hashToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

/**
 * Verify a raw token against a stored hash using a constant-time comparison.
 *
 * @param {string} rawToken    - Plain token from the client
 * @param {string} storedHash  - Hashed token retrieved from the database
 * @returns {boolean}
 */
const verifyResetToken = (rawToken, storedHash) => {
  const incomingHash = hashToken(rawToken);
  const incomingBuffer = Buffer.from(incomingHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (incomingBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(incomingBuffer, storedBuffer);
};

module.exports = {
  generateResetToken,
  hashToken,
  verifyResetToken,
  TOKEN_BYTE_LENGTH,
};
