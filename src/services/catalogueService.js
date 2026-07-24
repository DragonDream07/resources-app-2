import api from './api';

const catalogueService = {
  // Products
  listProducts: (params) =>
    api.get('/products', { params }).then((res) => res.data),

  getProduct: (productId) =>
    api.get(`/products/${productId}`).then((res) => res.data),

  getProductSkus: (productId) =>
    api.get(`/products/${productId}/skus`).then((res) => res.data),

  getProductImages: (productId) =>
    api.get(`/products/${productId}/images`).then((res) => res.data),

  // Categories
  listCategories: (params) =>
    api.get('/categories', { params }).then((res) => res.data),

  getCategory: (categoryId) =>
    api.get(`/categories/${categoryId}`).then((res) => res.data),

  getCategoryProducts: (categoryId, params) =>
    api.get(`/categories/${categoryId}/products`, { params }).then((res) => res.data),

  // Brands
  listBrands: (params) =>
    api.get('/brands', { params }).then((res) => res.data),

  getBrand: (brandId) =>
    api.get(`/brands/${brandId}`).then((res) => res.data),

  // Admin catalogue CRUD — Products
  adminCreateProduct: (data) =>
    api.post('/products', data).then((res) => res.data),

  adminUpdateProduct: (productId, data) =>
    api.put(`/products/${productId}`, data).then((res) => res.data),

  adminDeleteProduct: (productId) =>
    api.delete(`/products/${productId}`).then((res) => res.data),

  adminAddProductImages: (productId, data) =>
    api.post(`/products/${productId}/images`, data).then((res) => res.data),

  adminCreateSku: (productId, data) =>
    api.post(`/products/${productId}/skus`, data).then((res) => res.data),

  adminUpdateSku: (productId, skuId, data) =>
    api.put(`/products/${productId}/skus/${skuId}`, data).then((res) => res.data),

  // Admin catalogue CRUD — Categories
  adminCreateCategory: (data) =>
    api.post('/categories', data).then((res) => res.data),

  adminUpdateCategory: (categoryId, data) =>
    api.put(`/categories/${categoryId}`, data).then((res) => res.data),

  adminDeleteCategory: (categoryId) =>
    api.delete(`/categories/${categoryId}`).then((res) => res.data),

  // Admin catalogue CRUD — Brands
  adminCreateBrand: (data) =>
    api.post('/brands', data).then((res) => res.data),
};

export default catalogueService;
