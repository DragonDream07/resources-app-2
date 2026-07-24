import api from './api';

const usersService = {
  getMe: () =>
    api.get('/users/me').then((res) => res.data),

  updateMe: (data) =>
    api.patch('/users/me', data).then((res) => res.data),

  changePassword: (data) =>
    api.post('/users/me/change-password', data).then((res) => res.data),

  // Admin CRUD
  adminListUsers: (params) =>
    api.get('/admin/users', { params }).then((res) => res.data),

  adminGetUser: (userId) =>
    api.get(`/admin/users/${userId}`).then((res) => res.data),

  adminUpdateUser: (userId, data) =>
    api.patch(`/admin/users/${userId}`, data).then((res) => res.data),

  adminDeleteUser: (userId) =>
    api.delete(`/admin/users/${userId}`).then((res) => res.data),
};

export default usersService;
