import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  title: { fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', padding: '24px', marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: 600, marginBottom: '16px', marginTop: 0 },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '44px' },
  inputError: { borderColor: '#f03e3e' },
  select: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '44px' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' },
  errorBanner: { backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' },
  successBanner: { backgroundColor: '#d3f9d8', color: '#37b24d', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' },
  fieldError: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
  retryLink: { color: '#4c6ef5', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  btn: { padding: '10px 24px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' },
  btnCancel: { padding: '10px 24px', backgroundColor: '#ffffff', color: '#343a40', border: '1px solid #868e96', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '44px' },
  btnSmall: { padding: '6px 14px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', minHeight: '36px' },
  btnDanger: { padding: '6px 12px', backgroundColor: '#f03e3e', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', minHeight: '36px' },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  skuRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end', marginBottom: '12px' },
  skuHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', marginBottom: '4px' },
  divider: { border: 'none', borderTop: '1px solid #e9ecef', margin: '20px 0' },
  code: { fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '13px' },
  imgPreview: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e9ecef' },
  imgGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }
};

const emptySkuForm = () => ({ sku_code: '', size: '', color: '', price: '', stock_quantity: '' });

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: '', slug: '', description: '', base_price: '', tax_rate: '', category_id: '', brand_id: '', is_active: true });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(location.state?.toast || null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState(null);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState(null);
  const [skus, setSkus] = useState([]);
  const [skuForms, setSkuForms] = useState([]);
  const [newSku, setNewSku] = useState(emptySkuForm());
  const [skuError, setSkuError] = useState(null);
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const token = () => localStorage.getItem('token');

  const loadProduct = useCallback(async () => {
    setLoadingProduct(true);
    try {
      const res = await fetch('/api/products/' + id, { headers: { Authorization: 'Bearer ' + token() } });
      if (!res.ok) throw new Error('Failed to load product');
      const data = await res.json();
      const p = data.data || data.product || data;
      setForm({
        name: p.name || '',
        slug: p.slug || '',
        description: p.description || '',
        base_price: p.base_price != null ? String(p.base_price) : '',
        tax_rate: p.tax_rate != null ? String(p.tax_rate) : '',
        category_id: p.category_id != null ? String(p.category_id) : '',
        brand_id: p.brand_id != null ? String(p.brand_id) : '',
        is_active: p.is_active !== false
      });
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setLoadingProduct(false);
    }
  }, [id]);

  const loadSkus = useCallback(async () => {
    try {
      const res = await fetch('/api/products/' + id + '/skus', { headers: { Authorization: 'Bearer ' + token() } });
      if (!res.ok) throw new Error('Failed to load SKUs');
      const data = await res.json();
      const list = data.data || data.skus || data || [];
      setSkus(list);
      setSkuForms(list.map(s => ({ sku_code: s.sku_code || '', size: s.size || '', color: s.color || '', price: s.price != null ? String(s.price) : '', stock_quantity: s.stock_quantity != null ? String(s.stock_quantity) : '' })));
    } catch (e) {
      setSkuError(e.message);
    }
  }, [id]);

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch('/api/products/' + id + '/images', { headers: { Authorization: 'Bearer ' + token() } });
      if (!res.ok) throw new Error('Failed to load images');
      const data = await res.json();
      setImages(data.data || data.images || data || []);
    } catch (e) {
      setImageError(e.message);
    }
  }, [id]);

  const loadCategories = async () => {
    setCatsLoading(true); setCatsError(null);
    try {
      const res = await fetch('/api/categories', { headers: { Authorization: 'Bearer ' + token() } });
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data.data || data.categories || data || []);
    } catch (e) { setCatsError(e.message); }
    finally { setCatsLoading(false); }
  };

  const loadBrands = async () => {
    setBrandsLoading(true); setBrandsError(null);
    try {
      const res = await fetch('/api/brands', { headers: { Authorization: 'Bearer ' + token() } });
      if (!res.ok) throw new Error('Failed to load brands');
      const data = await res.json();
      setBrands(data.data || data.brands || data || []);
    } catch (e) { setBrandsError(e.message); }
    finally { setBrandsLoading(false); }
  };

  useEffect(() => {
    loadProduct();
    loadCategories();
    loadBrands();
    loadSkus();
    loadImages();
  }, [id]);

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
    setSubmitting(true); setSubmitError(null); setSubmitSuccess(null);
    try {
      const res = await fetch('/api/products/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
        body: JSON.stringify({ ...form, base_price: Number(form.base_price), tax_rate: Number(form.tax_rate) })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'Product could not be saved.');
      }
      setSubmitSuccess('Product saved successfully.');
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkuFormChange = (idx, e) => {
    const { name, value } = e.target;
    setSkuForms(prev => prev.map((s, i) => i === idx ? { ...s, [name]: value } : s));
  };

  const handleSkuUpdate = async (idx) => {
    const sku = skus[idx];
    const sf = skuForms[idx];
    setSkuError(null);
    try {
      const res = await fetch('/api/products/' + id + '/skus/' + sku.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
        body: JSON.stringify({ ...sf, price: Number(sf.price), stock_quantity: Number(sf.stock_quantity) })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'SKU update failed'); }
      await loadSkus();
    } catch (e) { setSkuError(e.message); }
  };

  const handleNewSkuChange = (e) => {
    const { name, value } = e.target;
    setNewSku(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSku = async (e) => {
    e.preventDefault();
    setSkuError(null);
    try {
      const res = await fetch('/api/products/' + id + '/skus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
        body: JSON.stringify({ ...newSku, price: Number(newSku.price), stock_quantity: Number(newSku.stock_quantity) })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Add SKU failed'); }
      setNewSku(emptySkuForm());
      await loadSkus();
    } catch (e) { setSkuError(e.message); }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    setImageUploading(true); setImageError(null);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      const res = await fetch('/api/products/' + id + '/images', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token() },
        body: fd
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Image upload failed'); }
      setImageFile(null);
      await loadImages();
    } catch (e) { setImageError(e.message); }
    finally { setImageUploading(false); }
  };

  if (loadingProduct) return <div style={styles.page}><div style={styles.container}>Loading product...</div></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link to="/admin/catalogue/products" style={{ color: '#4c6ef5', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img src="/src/assets/icons/chevron-left.svg" alt="" width={16} height={16} /> Products
          </Link>
          <h1 style={styles.title}>Edit Product</h1>
        </div>
        {submitError && <div style={styles.errorBanner}>Product could not be saved. {submitError}</div>}
        {submitSuccess && <div style={styles.successBanner}>{submitSuccess}</div>}

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
              <input id="slug" name="slug" value={form.slug} onChange={handleChange} style={{ ...styles.input, ...(errors.slug ? styles.inputError : {}) }} />
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
                    {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
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
                    {brands.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
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
            <button type="submit" style={styles.btn} disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Images</h2>
          {imageError && <div style={styles.errorBanner}>{imageError}</div>}
          <div style={styles.imgGrid}>
            {images.map((img, i) => (
              <img key={img.id || i} src={img.url || img.image_url} alt="Product" style={styles.imgPreview}
                onError={e => { e.target.src = '/src/assets/images/placeholder-product.svg'; }}
              />
            ))}
          </div>
          <form onSubmit={handleImageUpload} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '14px' }} />
            <button type="submit" style={styles.btnSmall} disabled={imageUploading || !imageFile}>{imageUploading ? 'Uploading...' : 'Upload Image'}</button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>SKUs</h2>
          {skuError && <div style={styles.errorBanner}>{skuError}</div>}
          {skus.length > 0 && (
            <div>
              <div style={styles.skuHeader}>
                {['SKU Code', 'Size', 'Color', 'Price', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057' }}>{h}</span>
                ))}
              </div>
              {skus.map((sku, idx) => (
                <div key={sku.id} style={styles.skuRow}>
                  <input name="sku_code" value={skuForms[idx]?.sku_code || ''} onChange={e => handleSkuFormChange(idx, e)} style={{ ...styles.input, fontFamily: "'JetBrains Mono', monospace" }} placeholder="SKU Code" />
                  <input name="size" value={skuForms[idx]?.size || ''} onChange={e => handleSkuFormChange(idx, e)} style={styles.input} placeholder="Size" />
                  <input name="color" value={skuForms[idx]?.color || ''} onChange={e => handleSkuFormChange(idx, e)} style={styles.input} placeholder="Color" />
                  <input name="price" type="number" value={skuForms[idx]?.price || ''} onChange={e => handleSkuFormChange(idx, e)} style={styles.input} placeholder="Price" min="0" step="0.01" />
                  <button type="button" onClick={() => handleSkuUpdate(idx)} style={styles.btnSmall}>Save</button>
                </div>
              ))}
              <hr style={styles.divider} />
            </div>
          )}
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Add New SKU</div>
          <form onSubmit={handleAddSku}>
            <div style={styles.skuRow}>
              <input name="sku_code" value={newSku.sku_code} onChange={handleNewSkuChange} style={{ ...styles.input, fontFamily: "'JetBrains Mono', monospace" }} placeholder="SKU Code" />
              <input name="size" value={newSku.size} onChange={handleNewSkuChange} style={styles.input} placeholder="Size" />
              <input name="color" value={newSku.color} onChange={handleNewSkuChange} style={styles.input} placeholder="Color" />
              <input name="price" type="number" value={newSku.price} onChange={handleNewSkuChange} style={styles.input} placeholder="Price" min="0" step="0.01" />
              <button type="submit" style={styles.btnSmall}>
                <img src="/src/assets/icons/plus.svg" alt="Add" width={14} height={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
