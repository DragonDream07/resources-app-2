'use strict';

/**
 * RBAC middleware factory.
 * Returns an Express middleware that checks whether req.user
 * holds at least one of the required roles.
 *
 * @param {...string} roles - One or more role names that are permitted.
 * @returns {Function} Express middleware
 */
function authorize(...roles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication is required.',
      });
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];

    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      });
    }

    return next();
  };
}

module.exports = authorize;
