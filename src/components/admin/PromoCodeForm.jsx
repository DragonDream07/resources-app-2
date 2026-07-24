import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PROMO_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat Amount' },
];

const PromoCodeForm = ({ initialValues, onSubmit, loading, submitLabel }) => {
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_order_value: '',
    max_uses: '',
    expiry_date: '',
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
    if (!form.code.trim()) {
      errs.code = 'Promo code is required.';
    }
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) {
      errs.value = 'A positive discount value is required.';
    }
    if (form.type === 'percentage' && Number(form.value) > 100) {
      errs.value = 'Percentage discount cannot exceed 100.';
    }
    if (form.expiry_date && isNaN(Date.parse(form.expiry_date))) {
      errs.expiry_date = 'Invalid expiry date.';
    }
    if (form.min_order_value && (isNaN(Number(form.min_order_value)) || Number(form.min_order_value) < 0)) {
      errs.min_order_value = 'Minimum order value must be a non-negative number.';
    }
    if (form.max_uses && (isNaN(Number(form.max_uses)) || Number(form.max_uses) < 1)) {
      errs.max_uses = 'Max uses must be a positive integer.';
    }
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
      value: Number(form.value),
      min_order_value: form.min_order_value ? Number(form.min_order_value) : null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expiry_date: form.expiry_date || null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="promo_code" className="block text-sm font-medium text-gray-700 mb-1">Promo Code *</label>
          <input
            id="promo_code"
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.code ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code}</p>}
        </div>

        <div>
          <label htmlFor="promo_type" className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
          <select
            id="promo_type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {PROMO_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="promo_value" className="block text-sm font-medium text-gray-700 mb-1">
            {form.type === 'percentage' ? 'Percentage (%) *' : 'Flat Amount *'}
          </label>
          <input
            id="promo_value"
            type="number"
            name="value"
            min="0"
            step={form.type === 'percentage' ? '1' : '0.01'}
            value={form.value}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.value ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
        </div>

        <div>
          <label htmlFor="promo_expiry_date" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            id="promo_expiry_date"
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.expiry_date ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.expiry_date && <p className="text-xs text-red-600 mt-1">{errors.expiry_date}</p>}
        </div>

        <div>
          <label htmlFor="promo_min_order_value" className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value</label>
          <input
            id="promo_min_order_value"
            type="number"
            name="min_order_value"
            min="0"
            step="0.01"
            value={form.min_order_value}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.min_order_value ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.min_order_value && <p className="text-xs text-red-600 mt-1">{errors.min_order_value}</p>}
        </div>

        <div>
          <label htmlFor="promo_max_uses" className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
          <input
            id="promo_max_uses"
            type="number"
            name="max_uses"
            min="1"
            step="1"
            value={form.max_uses}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.max_uses ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.max_uses && <p className="text-xs text-red-600 mt-1">{errors.max_uses}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="promo_is_active"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="w-4 h-4 text-indigo-600 rounded border-gray-300"
        />
        <label htmlFor="promo_is_active" className="text-sm font-medium text-gray-700">Active</label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : (submitLabel ?? 'Save Promo Code')}
        </button>
      </div>
    </form>
  );
};

PromoCodeForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

PromoCodeForm.defaultProps = {
  loading: false,
};

export default PromoCodeForm;
