const { query, validationResult } = require('express-validator');

// ---------------------------------------------------------------------------
// Reusable middleware to handle validation results
// ---------------------------------------------------------------------------
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
    });
  }
  next();
}

// ---------------------------------------------------------------------------
// Validation rules for GET /search
// ---------------------------------------------------------------------------
const searchRules = [
  query('q')
    .optional()
    .isString()
    .withMessage('q must be a string')
    .isLength({ max: 200 })
    .withMessage('q must not exceed 200 characters'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),

  query('size')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('size must be an integer between 1 and 100'),

  query('sort')
    .optional()
    .isIn(['relevance', 'price_asc', 'price_desc', 'newest', 'popularity', 'rating'])
    .withMessage('sort must be one of: relevance, price_asc, price_desc, newest, popularity, rating'),

  query('filters')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error();
          }
        } catch {
          throw new Error('filters must be a valid JSON object');
        }
      } else if (typeof value !== 'object') {
        throw new Error('filters must be a valid JSON object');
      }
      return true;
    })
    .withMessage('filters must be a valid JSON object'),
];

// ---------------------------------------------------------------------------
// Validation rules for GET /search/suggest
// ---------------------------------------------------------------------------
const suggestRules = [
  query('q')
    .notEmpty()
    .withMessage('q is required')
    .isString()
    .withMessage('q must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('q must be between 1 and 100 characters'),

  query('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('size must be an integer between 1 and 20'),
];

// ---------------------------------------------------------------------------
// Exported middleware chains
// ---------------------------------------------------------------------------
const validateSearch = [...searchRules, handleValidationErrors];
const validateSuggest = [...suggestRules, handleValidationErrors];

module.exports = { validateSearch, validateSuggest };
