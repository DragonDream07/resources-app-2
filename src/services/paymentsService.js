import api from './api';

const paymentsService = {
  initiatePayment: (data) =>
    api.post('/payments/initiate', data).then((res) => res.data),

  confirmPayment: (data) =>
    api.post('/payments/confirm', data).then((res) => res.data),
};

export default paymentsService;
