const ordersService = require('./orders.service');

async function listOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const { page = 1, limit = 20, status, userId: queryUserId } = req.query;

    const targetUserId = isAdmin && queryUserId ? queryUserId : userId;
    const filters = { status };

    const result = await ordersService.listOrders(targetUserId, isAdmin, filters, { page: parseInt(page, 10), limit: parseInt(limit, 10) });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const order = await ordersService.getOrderById(orderId, userId, isAdmin);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrderTimeline(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const timeline = await ordersService.getOrderTimeline(orderId, userId, isAdmin);
    res.json(timeline);
  } catch (err) {
    next(err);
  }
}

async function getOrderTracking(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const tracking = await ordersService.getOrderTracking(orderId, userId, isAdmin);
    res.json(tracking);
  } catch (err) {
    next(err);
  }
}

async function getOrderRefunds(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const refunds = await ordersService.getOrderRefunds(orderId, userId, isAdmin);
    res.json(refunds);
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const { reason } = req.body;

    const result = await ordersService.cancelOrder(orderId, userId, isAdmin, reason);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function advanceOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const result = await ordersService.advanceOrder(orderId, status, { trackingNumber, carrier });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const { items, reason } = req.body;

    const result = await ordersService.createReturnRequest(orderId, userId, { items, reason });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createReturnRequest,
};
