import api from './api';

const checkoutService = {
  reviewCheckout: (params) =>
    api.get('/checkout/review', { params }).then((res) => res.data),

  setCheckoutAddress: (data) =>
    api.post('/checkout/address', data).then((res) => res.data),

  placeOrder: (data) =>
    api.post('/checkout/place-order', data).then((res) => res.data),
};

export default checkoutService;
