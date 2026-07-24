const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { validateAdvanceOrder, validateCancelOrder, validateReturnRequest } = require('./orders.validator');
const { authenticate, requireRole } = require('../../middleware/auth.middleware');

// User routes
router.get('/', authenticate, ordersController.listOrders);
router.get('/:orderId', authenticate, ordersController.getOrder);
router.get('/:orderId/timeline', authenticate, ordersController.getOrderTimeline);
router.get('/:orderId/tracking', authenticate, ordersController.getOrderTracking);
router.get('/:orderId/refunds', authenticate, ordersController.getOrderRefunds);
router.post('/:orderId/cancel', authenticate, validateCancelOrder, ordersController.cancelOrder);
router.post('/:orderId/advance', authenticate, requireRole('admin'), validateAdvanceOrder, ordersController.advanceOrder);
router.post('/:orderId/return-requests', authenticate, validateReturnRequest, ordersController.createReturnRequest);

module.exports = router;
