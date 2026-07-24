import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '600px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '24px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '44px' },
  inputError: { borderColor: '#f03e3e' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' },
  fieldError: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  btn: { padding: '10px 24px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' },
  btnCancel: { padding: '10px 24px', backgroundColor: '#ffffff', color: '#343a40', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }
};

export default function AdminBrandNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', slug: '', description: '', logo_url: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true); setSubmitError(null);
    try {
      const token = localStorage.getItem('token');
      const body = { name: form.name };
      if (form.slug) body.slug = form.slug;
      if (form.description) body.description = form.description;
      if (form.logo_url) body.logo_url = form.logo_url;
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'Brand could not be saved.');
      }
      const newId = data.data?.id || data.brand?.id || data.id;
      navigate('/admin/catalogue/brands/' + newId + '/edit', { state: { toast: 'Brand created successfully.' } });
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
          <Link to="/admin/catalogue/brands" style={{ color: '#4c6ef5', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img src="/src/assets/icons/chevron-left.svg" alt="" width={16} height={16} /> Brands
          </Link>
          <h1 style={styles.title}>New Brand</h1>
        </div>
        {submitError && <div style={styles.errorBanner}>{submitError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.card}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="name">Name *</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }} />
              {errors.name && <div style={styles.fieldError}>{errors.name}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="slug">Slug</label>
              <input id="slug" name="slug" value={form.slug} onChange={handleChange} style={styles.input} placeholder="auto-generated if blank" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="description">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} style={styles.textarea} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="logo_url">Logo URL</label>
              <input id="logo_url" name="logo_url" value={form.logo_url} onChange={handleChange} style={styles.input} placeholder="https://..." />
            </div>
          </div>
          <div style={styles.actions}>
            <Link to="/admin/catalogue/brands" style={styles.btnCancel}>Cancel</Link>
            <button type="submit" style={styles.btn} disabled={submitting}>{submitting ? 'Saving...' : 'Create Brand'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
