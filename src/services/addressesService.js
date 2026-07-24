import api from './api';

const addressesService = {
  listAddresses: () =>
    api.get('/users/me/addresses').then((res) => res.data),

  getAddress: (addressId) =>
    api.get(`/users/me/addresses/${addressId}`).then((res) => res.data),

  createAddress: (data) =>
    api.post('/users/me/addresses', data).then((res) => res.data),

  updateAddress: (addressId, data) =>
    api.put(`/users/me/addresses/${addressId}`, data).then((res) => res.data),

  deleteAddress: (addressId) =>
    api.delete(`/users/me/addresses/${addressId}`).then((res) => res.data),

  checkServiceability: (params) =>
    api.get('/serviceability', { params }).then((res) => res.data),
};

export default addressesService;
