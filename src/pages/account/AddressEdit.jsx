import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    marginBottom: '24px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
  },
  formRowItem: {
    flex: 1,
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  fieldError: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#212529',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  skeleton: {
    height: '16px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    marginBottom: '12px',
  },
};

export default function AddressEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    is_default: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/users/me/addresses/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Address not found.');
        return res.json();
      })
      .then((data) => {
        const addr = data.data || data;
        setForm({
          first_name: addr.first_name || '',
          last_name: addr.last_name || '',
          address_line1: addr.address_line1 || '',
          address_line2: addr.address_line2 || '',
          city: addr.city || '',
          state: addr.state || '',
          postal_code: addr.postal_code || '',
          country: addr.country || '',
          phone: addr.phone || '',
          is_default: addr.is_default || false,
        });
      })
      .catch((err) => setApiError(err.message || 'Failed to load address.'))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required.';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required.';
    if (!form.address_line1.trim()) errs.address_line1 = 'Address line 1 is required.';
    if (!form.city.trim()) errs.city = 'City is required.';
    if (!form.state.trim()) errs.state = 'State is required.';
    if (!form.postal_code.trim()) errs.postal_code = 'Postal code is required.';
    if (!form.country.trim()) errs.country = 'Country is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`/users/me/addresses/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to update address.');
      }
      navigate('/account/addresses');
    } catch (err) {
      setApiError(err.message || 'Failed to update address.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={{ ...styles.skeleton, width: '60%' }} />
            <div style={{ ...styles.skeleton, width: '80%' }} />
            <div style={{ ...styles.skeleton, width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account/addresses" style={styles.backLink}>← Back to addresses</Link>
        <h1 style={styles.pageTitle}>Edit address</h1>
        <div style={styles.card}>
          {apiError && <div style={styles.errorBanner}>{apiError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.formRow}>
              <div style={styles.formRowItem}>
                <label htmlFor="first_name" style={styles.label}>First name</label>
                <input
                  id="first_name"
                  type="text"
                  style={{ ...styles.input, ...(errors.first_name ? styles.inputError : {}) }}
                  value={form.first_name}
                  onChange={handleChange('first_name')}
                  autoComplete="given-name"
                />
                {errors.first_name && <span style={styles.fieldError}>{errors.first_name}</span>}
              </div>
              <div style={styles.formRowItem}>
                <label htmlFor="last_name" style={styles.label}>Last name</label>
                <input
                  id="last_name"
                  type="text"
                  style={{ ...styles.input, ...(errors.last_name ? styles.inputError : {}) }}
                  value={form.last_name}
                  onChange={handleChange('last_name')}
                  autoComplete="family-name"
                />
                {errors.last_name && <span style={styles.fieldError}>{errors.last_name}</span>}
              </div>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="address_line1" style={styles.label}>Address line 1</label>
              <input
                id="address_line1"
                type="text"
                style={{ ...styles.input, ...(errors.address_line1 ? styles.inputError : {}) }}
                value={form.address_line1}
                onChange={handleChange('address_line1')}
                autoComplete="address-line1"
              />
              {errors.address_line1 && <span style={styles.fieldError}>{errors.address_line1}</span>}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="address_line2" style={styles.label}>Address line 2 (optional)</label>
              <input
                id="address_line2"
                type="text"
                style={styles.input}
                value={form.address_line2}
                onChange={handleChange('address_line2')}
                autoComplete="address-line2"
              />
            </div>
            <div style={styles.formRow}>
              <div style={styles.formRowItem}>
                <label htmlFor="city" style={styles.label}>City</label>
                <input
                  id="city"
                  type="text"
                  style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }}
                  value={form.city}
                  onChange={handleChange('city')}
                  autoComplete="address-level2"
                />
                {errors.city && <span style={styles.fieldError}>{errors.city}</span>}
              </div>
              <div style={styles.formRowItem}>
                <label htmlFor="state" style={styles.label}>State / Province</label>
                <input
                  id="state"
                  type="text"
                  style={{ ...styles.input, ...(errors.state ? styles.inputError : {}) }}
                  value={form.state}
                  onChange={handleChange('state')}
                  autoComplete="address-level1"
                />
                {errors.state && <span style={styles.fieldError}>{errors.state}</span>}
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formRowItem}>
                <label htmlFor="postal_code" style={styles.label}>Postal code</label>
                <input
                  id="postal_code"
                  type="text"
                  style={{ ...styles.input, ...(errors.postal_code ? styles.inputError : {}) }}
                  value={form.postal_code}
                  onChange={handleChange('postal_code')}
                  autoComplete="postal-code"
                />
                {errors.postal_code && <span style={styles.fieldError}>{errors.postal_code}</span>}
              </div>
              <div style={styles.formRowItem}>
                <label htmlFor="country" style={styles.label}>Country</label>
                <input
                  id="country"
                  type="text"
                  style={{ ...styles.input, ...(errors.country ? styles.inputError : {}) }}
                  value={form.country}
                  onChange={handleChange('country')}
                  autoComplete="country-name"
                />
                {errors.country && <span style={styles.fieldError}>{errors.country}</span>}
              </div>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.label}>Phone (optional)</label>
              <input
                id="phone"
                type="tel"
                style={styles.input}
                value={form.phone}
                onChange={handleChange('phone')}
                autoComplete="tel"
              />
            </div>
            <div style={styles.checkboxRow}>
              <input
                id="is_default"
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="is_default" style={styles.checkboxLabel}>Set as default address</label>
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account/addresses')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
