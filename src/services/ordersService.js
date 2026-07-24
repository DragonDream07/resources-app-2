import api from './api';

const ordersService = {
  listOrders: (params) =>
    api.get('/orders', { params }).then((res) => res.data),

  getOrder: (orderId) =>
    api.get(`/orders/${orderId}`).then((res) => res.data),

  getOrderTimeline: (orderId) =>
    api.get(`/orders/${orderId}/timeline`).then((res) => res.data),

  getOrderTracking: (orderId) =>
    api.get(`/orders/${orderId}/tracking`).then((res) => res.data),

  cancelOrder: (orderId, data) =>
    api.post(`/orders/${orderId}/cancel`, data).then((res) => res.data),

  getOrderRefunds: (orderId) =>
    api.get(`/orders/${orderId}/refunds`).then((res) => res.data),

  // Admin
  adminListOrders: (params) =>
    api.get('/admin/orders', { params }).then((res) => res.data),

  adminGetOrder: (orderId) =>
    api.get(`/admin/orders/${orderId}`).then((res) => res.data),

  adminAdvanceOrder: (orderId, data) =>
    api.post(`/orders/${orderId}/advance`, data).then((res) => res.data),
};

export default ordersService;
