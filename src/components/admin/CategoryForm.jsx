import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CategoryForm = ({ initialValues, categories, onSubmit, loading, submitLabel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    parent_id: '',
    is_active: true,
    ...initialValues,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Category name is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const payload = {
      ...form,
      parent_id: form.parent_id || null,
    };
    onSubmit(payload);
  };

  // Exclude current category from parent options to prevent self-reference
  const parentOptions = categories.filter((cat) => cat.id !== initialValues?.id);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="cat_name" className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
        <input
          id="cat_name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="cat_description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="cat_description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="cat_parent_id" className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
        <select
          id="cat_parent_id"
          name="parent_id"
          value={form.parent_id ?? ''}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">None (top-level)</option>
          {parentOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="cat_is_active"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="w-4 h-4 text-indigo-600 rounded border-gray-300"
        />
        <label htmlFor="cat_is_active" className="text-sm font-medium text-gray-700">Active</label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : (submitLabel ?? 'Save Category')}
        </button>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  initialValues: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

CategoryForm.defaultProps = {
  categories: [],
  loading: false,
};

export default CategoryForm;
