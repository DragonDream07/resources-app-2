import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function AdminPromotionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchPromoCode() {
      try {
        const res = await fetch(`/api/promo-codes/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch promo code');
        const data = await res.json();
        const promo = data.data ?? data;
        setForm({
          code: promo.code ?? '',
          discount_type: promo.discount_type ?? 'percentage',
          discount_value: promo.discount_value != null ? String(promo.discount_value) : '',
          min_order_value: promo.min_order_value != null ? String(promo.min_order_value) : '',
          max_discount_amount: promo.max_discount_amount != null ? String(promo.max_discount_amount) : '',
          expires_at: promo.expires_at ? promo.expires_at.split('T')[0] : '',
          is_active: promo.is_active ?? true,
        });
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPromoCode();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = 'Code is required.';
    if (!form.discount_type) newErrors.discount_type = 'Discount type is required.';
    if (form.discount_value === '' || isNaN(Number(form.discount_value)) || Number(form.discount_value) <= 0) {
      newErrors.discount_value = 'Discount value must be a positive number.';
    }
    if (form.discount_type === 'percentage' && Number(form.discount_value) > 100) {
      newErrors.discount_value = 'Percentage discount cannot exceed 100.';
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        is_active: form.is_active,
      };
      if (form.min_order_value !== '') payload.min_order_value = Number(form.min_order_value);
      if (form.max_discount_amount !== '') payload.max_discount_amount = Number(form.max_discount_amount);
      if (form.expires_at !== '') payload.expires_at = form.expires_at;

      const res = await fetch(`/api/promo-codes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Failed to update promo code');
      }
      navigate('/admin/promotions');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="admin-promotion-edit__loading">Loading promo code…</p>;
  }

  if (fetchError) {
    return (
      <div className="admin-promotion-edit__fetch-error">
        <p>{fetchError}</p>
        <Link to="/admin/promotions">Back to Promo Codes</Link>
      </div>
    );
  }

  return (
    <div className="admin-promotion-edit">
      <div className="admin-promotion-edit__header">
        <Link to="/admin/promotions" className="admin-promotion-edit__back">
          <img src="/src/assets/icons/chevron-left.svg" alt="" />
          Back to Promo Codes
        </Link>
        <h1 className="admin-promotion-edit__title">Edit Promo Code</h1>
      </div>

      {serverError && (
        <div className="admin-promotion-edit__server-error" role="alert">
          {serverError}
        </div>
      )}

      <form className="admin-promotion-edit__form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="code" className="form-label">Code *</label>
          <input
            id="code"
            name="code"
            type="text"
            className={`form-input${errors.code ? ' form-input--error' : ''}`}
            value={form.code}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.code && <span className="form-error">{errors.code}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="discount_type" className="form-label">Discount Type *</label>
          <select
            id="discount_type"
            name="discount_type"
            className={`form-select${errors.discount_type ? ' form-select--error' : ''}`}
            value={form.discount_type}
            onChange={handleChange}
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
          {errors.discount_type && <span className="form-error">{errors.discount_type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="discount_value" className="form-label">
            Discount Value * {form.discount_type === 'percentage' ? '(%)' : '(₹)'}
          </label>
          <input
            id="discount_value"
            name="discount_value"
            type="number"
            min="0"
            step="0.01"
            className={`form-input${errors.discount_value ? ' form-input--error' : ''}`}
            value={form.discount_value}
            onChange={handleChange}
          />
          {errors.discount_value && <span className="form-error">{errors.discount_value}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="min_order_value" className="form-label">Minimum Order Value (₹)</label>
          <input
            id="min_order_value"
            name="min_order_value"
            type="number"
            min="0"
            step="0.01"
            className="form-input"
            value={form.min_order_value}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        {form.discount_type === 'percentage' && (
          <div className="form-group">
            <label htmlFor="max_discount_amount" className="form-label">Max Discount Amount (₹)</label>
            <input
              id="max_discount_amount"
              name="max_discount_amount"
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              value={form.max_discount_amount}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="expires_at" className="form-label">Expiry Date</label>
          <input
            id="expires_at"
            name="expires_at"
            type="date"
            className="form-input"
            value={form.expires_at}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group--checkbox">
          <label className="form-label form-label--checkbox">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <div className="admin-promotion-edit__actions">
          <Link to="/admin/promotions" className="btn btn--secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
