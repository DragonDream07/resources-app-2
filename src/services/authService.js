import api from './api';

const authService = {
  register: (data) =>
    api.post('/auth/register', data).then((res) => res.data),

  login: (data) =>
    api.post('/auth/login', data).then((res) => res.data),

  logout: () =>
    api.post('/auth/logout').then((res) => res.data),

  forgotPassword: (data) =>
    api.post('/auth/forgot-password', data).then((res) => res.data),

  resetPassword: (data) =>
    api.post('/auth/reset-password', data).then((res) => res.data),

  guestRegister: (data) =>
    api.post('/auth/guest-register', data).then((res) => res.data),
};

export default authService;
