import api from './api';
import ordersService from './ordersService';
import returnsService from './returnsService';
import usersService from './usersService';
import catalogueService from './catalogueService';
import promotionsService from './promotionsService';

const adminService = {
  // Dashboard stats
  getDashboardStats: () =>
    api.get('/admin/dashboard').then((res) => res.data),

  // Reports
  getReports: (params) =>
    api.get('/admin/reports', { params }).then((res) => res.data),

  // Delegated domain calls
  listOrders: (params) => ordersService.adminListOrders(params),
  getOrder: (orderId) => ordersService.adminGetOrder(orderId),
  advanceOrder: (orderId, data) => ordersService.adminAdvanceOrder(orderId, data),

  listReturnRequests: (params) => returnsService.adminListReturnRequests(params),
  reviewReturnRequest: (returnRequestId, data) =>
    returnsService.adminReviewReturnRequest(returnRequestId, data),

  listUsers: (params) => usersService.adminListUsers(params),
  getUser: (userId) => usersService.adminGetUser(userId),
  updateUser: (userId, data) => usersService.adminUpdateUser(userId, data),
  deleteUser: (userId) => usersService.adminDeleteUser(userId),

  listProducts: (params) => catalogueService.listProducts(params),
  createProduct: (data) => catalogueService.adminCreateProduct(data),
  updateProduct: (productId, data) => catalogueService.adminUpdateProduct(productId, data),
  deleteProduct: (productId) => catalogueService.adminDeleteProduct(productId),

  listCategories: (params) => catalogueService.listCategories(params),
  createCategory: (data) => catalogueService.adminCreateCategory(data),
  updateCategory: (categoryId, data) => catalogueService.adminUpdateCategory(categoryId, data),
  deleteCategory: (categoryId) => catalogueService.adminDeleteCategory(categoryId),

  listBrands: (params) => catalogueService.listBrands(params),
  createBrand: (data) => catalogueService.adminCreateBrand(data),

  listPromoCodes: (params) => promotionsService.adminListPromoCodes(params),
  createPromoCode: (data) => promotionsService.adminCreatePromoCode(data),
  getPromoCode: (promoCodeId) => promotionsService.adminGetPromoCode(promoCodeId),
  updatePromoCode: (promoCodeId, data) =>
    promotionsService.adminUpdatePromoCode(promoCodeId, data),
  deletePromoCode: (promoCodeId) => promotionsService.adminDeletePromoCode(promoCodeId),
};

export default adminService;
