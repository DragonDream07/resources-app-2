import api from './api';

const promotionsService = {
  listPromoCodes: (params) =>
    api.get('/promo-codes', { params }).then((res) => res.data),

  // Admin CRUD
  adminListPromoCodes: (params) =>
    api.get('/admin/promo-codes', { params }).then((res) => res.data),

  adminCreatePromoCode: (data) =>
    api.post('/admin/promo-codes', data).then((res) => res.data),

  adminGetPromoCode: (promoCodeId) =>
    api.get(`/admin/promo-codes/${promoCodeId}`).then((res) => res.data),

  adminUpdatePromoCode: (promoCodeId, data) =>
    api.put(`/admin/promo-codes/${promoCodeId}`, data).then((res) => res.data),

  adminDeletePromoCode: (promoCodeId) =>
    api.delete(`/admin/promo-codes/${promoCodeId}`).then((res) => res.data),
};

export default promotionsService;
