import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EMPTY_SKU = { size: '', color: '', stock: '', price: '', sku_code: '' };

const ProductForm = ({ initialValues, categories, brands, onSubmit, loading, submitLabel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    is_active: true,
    ...initialValues,
  });

  const [skus, setSkus] = useState(
    initialValues?.skus?.length ? initialValues.skus : [{ ...EMPTY_SKU }]
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({ ...prev, ...initialValues }));
      if (initialValues.skus?.length) setSkus(initialValues.skus);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSkuChange = (index, field, value) => {
    setSkus((prev) => prev.map((sku, i) => i === index ? { ...sku, [field]: value } : sku));
  };

  const addSku = () => setSkus((prev) => [...prev, { ...EMPTY_SKU }]);

  const removeSku = (index) => setSkus((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    if (!form.category_id) errs.category_id = 'Category is required.';
    if (!form.brand_id) errs.brand_id = 'Brand is required.';
    skus.forEach((sku, i) => {
      if (!sku.sku_code.trim()) errs[`sku_${i}_sku_code`] = 'SKU code is required.';
      if (sku.price === '' || isNaN(Number(sku.price))) errs[`sku_${i}_price`] = 'Valid price is required.';
      if (sku.stock === '' || isNaN(Number(sku.stock))) errs[`sku_${i}_stock`] = 'Valid stock quantity is required.';
    });
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...form, skus });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

        <div>
          <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            id="product_name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="product_description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="product_description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="product_category_id" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              id="product_category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.category_id ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-600 mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <label htmlFor="product_brand_id" className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <select
              id="product_brand_id"
              name="brand_id"
              value={form.brand_id}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.brand_id ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Select brand…</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {errors.brand_id && <p className="text-xs text-red-600 mt-1">{errors.brand_id}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
        </div>
      </div>

      {/* SKU Variants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">SKU Variants</h3>
          <button
            type="button"
            onClick={addSku}
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <img src="/src/assets/icons/plus.svg" alt="" className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        {skus.map((sku, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Variant #{index + 1}</span>
              {skus.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSku(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label htmlFor={`sku_${index}_sku_code`} className="block text-xs font-medium text-gray-600 mb-1">SKU Code *</label>
                <input
                  id={`sku_${index}_sku_code`}
                  type="text"
                  value={sku.sku_code}
                  onChange={(e) => handleSkuChange(index, 'sku_code', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[`sku_${index}_sku_code`] ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors[`sku_${index}_sku_code`] && <p className="text-xs text-red-600 mt-1">{errors[`sku_${index}_sku_code`]}</p>}
              </div>

              <div>
                <label htmlFor={`sku_${index}_price`} className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
                <input
                  id={`sku_${index}_price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={sku.price}
                  onChange={(e) => handleSkuChange(index, 'price', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[`sku_${index}_price`] ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors[`sku_${index}_price`] && <p className="text-xs text-red-600 mt-1">{errors[`sku_${index}_price`]}</p>}
              </div>

              <div>
                <label htmlFor={`sku_${index}_stock`} className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
                <input
                  id={`sku_${index}_stock`}
                  type="number"
                  min="0"
                  value={sku.stock}
                  onChange={(e) => handleSkuChange(index, 'stock', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[`sku_${index}_stock`] ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors[`sku_${index}_stock`] && <p className="text-xs text-red-600 mt-1">{errors[`sku_${index}_stock`]}</p>}
              </div>

              <div>
                <label htmlFor={`sku_${index}_size`} className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                <input
                  id={`sku_${index}_size`}
                  type="text"
                  value={sku.size}
                  onChange={(e) => handleSkuChange(index, 'size', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor={`sku_${index}_color`} className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                <input
                  id={`sku_${index}_color`}
                  type="text"
                  value={sku.color}
                  onChange={(e) => handleSkuChange(index, 'color', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : (submitLabel ?? 'Save Product')}
        </button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  initialValues: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  brands: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

ProductForm.defaultProps = {
  categories: [],
  brands: [],
  loading: false,
};

export default ProductForm;
