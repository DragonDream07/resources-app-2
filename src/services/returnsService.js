import api from './api';

const returnsService = {
  createReturnRequest: (orderId, data) =>
    api.post(`/orders/${orderId}/return-requests`, data).then((res) => res.data),

  getReturnRequest: (returnRequestId) =>
    api.get(`/return-requests/${returnRequestId}`).then((res) => res.data),

  // Admin
  adminListReturnRequests: (params) =>
    api.get('/return-requests', { params }).then((res) => res.data),

  adminReviewReturnRequest: (returnRequestId, data) =>
    api.post(`/return-requests/${returnRequestId}/review`, data).then((res) => res.data),
};

export default returnsService;
