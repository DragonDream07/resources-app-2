'use strict';

/**
 * Generic Joi validation middleware factory.
 *
 * @param {import('joi').Schema} schema - A Joi schema object.
 * @param {'body'|'query'|'params'} [source='body'] - Which part of the request to validate.
 * @returns {Function} Express middleware
 */
function validate(schema, source = 'body') {
  return function (req, res, next) {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      return res.status(422).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed.',
        details,
      });
    }

    req[source] = value;
    return next();
  };
}

module.exports = validate;
