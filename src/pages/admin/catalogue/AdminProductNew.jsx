import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: 600, marginBottom: '16px', marginTop: 0 },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '44px' },
  inputError: { borderColor: '#f03e3e' },
  select: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '44px', appearance: 'none' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' },
  fieldError: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
  retryLink: { color: '#4c6ef5', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  btn: { padding: '10px 24px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' },
  btnCancel: { padding: '10px 24px', backgroundColor: '#ffffff', color: '#343a40', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '44px' },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
};

export default function AdminProductNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', slug: '', description: '', base_price: '', tax_rate: '', category_id: '', brand_id: '', is_active: true });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState(null);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState(null);

  const loadCategories = async () => {
    setCatsLoading(true);
    setCatsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data.data || data.categories || data || []);
    } catch (e) {
      setCatsError(e.message);
    } finally {
      setCatsLoading(false);
    }
  };

  const loadBrands = async () => {
    setBrandsLoading(true);
    setBrandsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/brands', { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Failed to load brands');
      const data = await res.json();
      setBrands(data.data || data.brands || data || []);
    } catch (e) {
      setBrandsError(e.message);
    } finally {
      setBrandsLoading(false);
    }
  };

  useEffect(() => { loadCategories(); loadBrands(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.base_price || isNaN(Number(form.base_price))) e.base_price = 'Base price is required.';
    if (form.tax_rate === '' || isNaN(Number(form.tax_rate))) e.tax_rate = 'Tax rate is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ ...form, base_price: Number(form.base_price), tax_rate: Number(form.tax_rate) })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) { setErrors(data.errors); }
        throw new Error(data.message || 'Product could not be saved.');
      }
      const newId = data.data?.id || data.product?.id || data.id;
      navigate('/admin/catalogue/products/' + newId + '/edit', { state: { toast: 'Product created successfully.' } });
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/admin/catalogue/products" style={{ color: '#4c6ef5', textDecoration: 'none', fontSize: '14px' }}>
            <img src="/src/assets/icons/chevron-left.svg" alt="" width={16} height={16} /> Products
          </Link>
          <h1 style={styles.title}>New Product</h1>
        </div>
        {submitError && <div style={styles.errorBanner}>Product could not be saved. {submitError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Basic Information</h2>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="name">Name *</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }} />
              {errors.name && <div style={styles.fieldError}>{errors.name}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="slug">Slug</label>
              <input id="slug" name="slug" value={form.slug} onChange={handleChange} style={styles.input} placeholder="auto-generated if blank" />
              {errors.slug && <div style={styles.fieldError}>{errors.slug}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="description">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} style={styles.textarea} />
            </div>
            <div style={styles.row2}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="base_price">Base Price *</label>
                <input id="base_price" name="base_price" type="number" min="0" step="0.01" value={form.base_price} onChange={handleChange} style={{ ...styles.input, ...(errors.base_price ? styles.inputError : {}) }} />
                {errors.base_price && <div style={styles.fieldError}>{errors.base_price}</div>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="tax_rate">Tax Rate (%) *</label>
                <input id="tax_rate" name="tax_rate" type="number" min="0" step="0.01" value={form.tax_rate} onChange={handleChange} style={{ ...styles.input, ...(errors.tax_rate ? styles.inputError : {}) }} />
                {errors.tax_rate && <div style={styles.fieldError}>{errors.tax_rate}</div>}
              </div>
            </div>
            <div style={styles.row2}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="category_id">Category</label>
                {catsLoading ? (
                  <div style={{ ...styles.input, backgroundColor: '#e9ecef', color: '#adb5bd' }}>Loading categories...</div>
                ) : catsError ? (
                  <div style={{ fontSize: '14px', color: '#f03e3e' }}>Could not load options — <span style={styles.retryLink} onClick={loadCategories}>retry</span></div>
                ) : (
                  <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} style={styles.select}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="brand_id">Brand</label>
                {brandsLoading ? (
                  <div style={{ ...styles.input, backgroundColor: '#e9ecef', color: '#adb5bd' }}>Loading brands...</div>
                ) : brandsError ? (
                  <div style={{ fontSize: '14px', color: '#f03e3e' }}>Could not load options — <span style={styles.retryLink} onClick={loadBrands}>retry</span></div>
                ) : (
                  <select id="brand_id" name="brand_id" value={form.brand_id} onChange={handleChange} style={styles.select}>
                    <option value="">Select brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                )}
              </div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.checkboxRow}>
                <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <label htmlFor="is_active" style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Active (visible to customers)</label>
              </div>
            </div>
          </div>
          <div style={styles.actions}>
            <Link to="/admin/catalogue/products" style={styles.btnCancel}>Cancel</Link>
            <button type="submit" style={styles.btn} disabled={submitting}>{submitting ? 'Saving...' : 'Create Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
