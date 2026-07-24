const { body, query } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

/**
 * Validation for POST /checkout/start
 */
const validateCheckoutStart = [
  body('cartId')
    .notEmpty()
    .withMessage('cartId is required.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('guestToken must be a string.'),

  handleValidationErrors,
];

/**
 * Validation for POST /checkout/address
 */
const validateCheckoutAddress = [
  body('checkoutSessionId')
    .notEmpty()
    .withMessage('checkoutSessionId is required.'),

  body('addressId')
    .optional()
    .isString()
    .withMessage('addressId must be a string.'),

  // Inline address validation (only if addressId is absent)
  body('address.fullName')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('address.fullName is required when addressId is not provided.'),

  body('address.line1')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('address.line1 is required when addressId is not provided.'),

  body('address.city')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('address.city is required when addressId is not provided.'),

  body('address.state')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('address.state is required when addressId is not provided.'),

  body('address.postalCode')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('address.postalCode is required when addressId is not provided.'),

  body('address.country')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('address.country is required when addressId is not provided.'),

  body('address.phone')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('address.phone is required when addressId is not provided.'),

  handleValidationErrors,
];

/**
 * Validation for POST /checkout/place-order
 */
const validateCheckoutPlaceOrder = [
  body('checkoutSessionId')
    .notEmpty()
    .withMessage('checkoutSessionId is required.'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('paymentMethod is required.'),

  body('paymentMethod.type')
    .notEmpty()
    .withMessage('paymentMethod.type is required.')
    .isIn(['card', 'upi', 'netbanking', 'wallet', 'cod'])
    .withMessage('paymentMethod.type must be one of: card, upi, netbanking, wallet, cod.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('guestToken must be a string.'),

  handleValidationErrors,
];

module.exports = { validateCheckoutStart, validateCheckoutAddress, validateCheckoutPlaceOrder };
