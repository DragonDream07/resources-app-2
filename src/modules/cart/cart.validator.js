const { body } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/handleValidationErrors');

const validateCreateCart = [
  body('guestId')
    .optional()
    .isString()
    .withMessage('Guest ID must be a string.'),
  handleValidationErrors,
];

const validateAddItem = [
  body('skuId')
    .notEmpty()
    .withMessage('SKU ID is required.')
    .isString()
    .withMessage('SKU ID must be a string.'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer.'),
  handleValidationErrors,
];

const validateUpdateItem = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer.'),
  handleValidationErrors,
];

const validateApplyPromo = [
  body('promoCode')
    .notEmpty()
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.')
    .trim(),
  handleValidationErrors,
];

module.exports = {
  validateCreateCart,
  validateAddItem,
  validateUpdateItem,
  validateApplyPromo,
};
