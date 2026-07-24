import api from './api';

const cartService = {
  getCart: (cartId) =>
    api.get(`/carts/${cartId}`).then((res) => res.data),

  addItem: (cartId, data) =>
    api.post(`/carts/${cartId}/items`, data).then((res) => res.data),

  updateItem: (cartId, itemId, data) =>
    api.patch(`/carts/${cartId}/items/${itemId}`, data).then((res) => res.data),

  removeItem: (cartId, itemId) =>
    api.delete(`/carts/${cartId}/items/${itemId}`).then((res) => res.data),

  applyPromo: (cartId, data) =>
    api.post(`/carts/${cartId}/promo`, data).then((res) => res.data),
};

export default cartService;
