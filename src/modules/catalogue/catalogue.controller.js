const catalogueService = require('./catalogue.service');

// ── Products ────────────────────────────────────────────────────────────────

const listProducts = async (req, res, next) => {
  try {
    const result = await catalogueService.listProducts(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await catalogueService.getProduct(req.params.productId);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await catalogueService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await catalogueService.updateProduct(req.params.productId, req.body);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await catalogueService.deleteProduct(req.params.productId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ── Product Images ──────────────────────────────────────────────────────────

const listProductImages = async (req, res, next) => {
  try {
    const images = await catalogueService.listProductImages(req.params.productId);
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
};

const addProductImage = async (req, res, next) => {
  try {
    const image = await catalogueService.addProductImage(req.params.productId, req.body);
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};

const deleteProductImage = async (req, res, next) => {
  try {
    await catalogueService.deleteProductImage(req.params.productId, req.params.imageId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ── SKUs ────────────────────────────────────────────────────────────────────

const listProductSkus = async (req, res, next) => {
  try {
    const skus = await catalogueService.listProductSkus(req.params.productId);
    res.status(200).json(skus);
  } catch (err) {
    next(err);
  }
};

const getProductSku = async (req, res, next) => {
  try {
    const sku = await catalogueService.getProductSku(req.params.productId, req.params.skuId);
    res.status(200).json(sku);
  } catch (err) {
    next(err);
  }
};

const createProductSku = async (req, res, next) => {
  try {
    const sku = await catalogueService.createProductSku(req.params.productId, req.body);
    res.status(201).json(sku);
  } catch (err) {
    next(err);
  }
};

const updateProductSku = async (req, res, next) => {
  try {
    const sku = await catalogueService.updateProductSku(req.params.productId, req.params.skuId, req.body);
    res.status(200).json(sku);
  } catch (err) {
    next(err);
  }
};

const deleteProductSku = async (req, res, next) => {
  try {
    await catalogueService.deleteProductSku(req.params.productId, req.params.skuId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ── Categories ──────────────────────────────────────────────────────────────

const listCategories = async (req, res, next) => {
  try {
    const categories = await catalogueService.listCategories();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await catalogueService.getCategory(req.params.categoryId);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const listCategoryProducts = async (req, res, next) => {
  try {
    const result = await catalogueService.listCategoryProducts(req.params.categoryId, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await catalogueService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await catalogueService.updateCategory(req.params.categoryId, req.body);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await catalogueService.deleteCategory(req.params.categoryId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ── Brands ──────────────────────────────────────────────────────────────────

const listBrands = async (req, res, next) => {
  try {
    const brands = await catalogueService.listBrands();
    res.status(200).json(brands);
  } catch (err) {
    next(err);
  }
};

const getBrand = async (req, res, next) => {
  try {
    const brand = await catalogueService.getBrand(req.params.brandId);
    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const brand = await catalogueService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const brand = await catalogueService.updateBrand(req.params.brandId, req.body);
    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    await catalogueService.deleteBrand(req.params.brandId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductImages,
  addProductImage,
  deleteProductImage,
  listProductSkus,
  getProductSku,
  createProductSku,
  updateProductSku,
  deleteProductSku,
  listCategories,
  getCategory,
  listCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
