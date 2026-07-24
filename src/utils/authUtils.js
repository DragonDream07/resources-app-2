/**
 * Decodes the payload of a JWT without verifying the signature.
 * @param {string} token - The JWT string.
 * @returns {object|null} Decoded payload object or null if invalid.
 */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT is expired based on its `exp` claim.
 * @param {string} token - The JWT string.
 * @returns {boolean} True if expired or invalid, false if still valid.
 */
export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // exp is in seconds; Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Extracts specific claims from a JWT payload.
 * @param {string} token - The JWT string.
 * @returns {{ userId: string|null, email: string|null, roles: string[], exp: number|null }}
 */
export function getJwtClaims(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return { userId: null, email: null, roles: [], exp: null };
  }
  return {
    userId: payload.sub ?? payload.userId ?? null,
    email: payload.email ?? null,
    roles: Array.isArray(payload.roles) ? payload.roles : [],
    exp: payload.exp ?? null,
  };
}

/**
 * Returns true if the token is present and not expired.
 * @param {string|null|undefined} token - The JWT string.
 * @returns {boolean}
 */
export function isAuthenticated(token) {
  if (!token) return false;
  return !isTokenExpired(token);
}
