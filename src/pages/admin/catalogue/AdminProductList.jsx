import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', minHeight: '44px' },
  btnDanger: { padding: '6px 12px', backgroundColor: '#f03e3e', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' },
  btnSecondary: { padding: '6px 12px', backgroundColor: '#ffffff', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', minHeight: '44px', display: 'inline-flex', alignItems: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', borderBottom: '1px solid #868e96', backgroundColor: '#f8f9fa' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#212529', borderBottom: '1px solid #e9ecef' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  badge: { display: 'inline-block', padding: '2px 8px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' },
  badgeActive: { backgroundColor: '#d3f9d8', color: '#37b24d' },
  badgeInactive: { backgroundColor: '#e9ecef', color: '#495057' },
  error: { backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  empty: { textAlign: 'center', padding: '64px 24px', color: '#495057' },
  img: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' },
  searchRow: { display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' },
  searchInput: { flex: 1, padding: '10px 14px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', color: '#212529', backgroundColor: '#ffffff', outline: 'none', minHeight: '44px' }
};

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch('/api/products?' + params.toString(), {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data.data || data.products || data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Delete failed');
      fetchProducts();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Products</h1>
          <Link to="/admin/catalogue/products/new" style={styles.btn}>
            <img src="/src/assets/icons/plus.svg" alt="" width={16} height={16} />
            New Product
          </Link>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.searchRow}>
          <input
            style={styles.searchInput}
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.card}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : products.length === 0 ? (
            <div style={styles.empty}>No products found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Base Price</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={styles.td}>
                      <img
                        src={p.image_url || '/src/assets/images/placeholder-product.svg'}
                        alt={p.name}
                        style={styles.img}
                        onError={e => { e.target.src = '/src/assets/images/placeholder-product.svg'; }}
                      />
                    </td>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{p.slug}</span></td>
                    <td style={styles.td}>{p.brand?.name || p.brand_name || '-'}</td>
                    <td style={styles.td}>{p.base_price != null ? '₹' + Number(p.base_price).toFixed(2) : '-'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(p.is_active ? styles.badgeActive : styles.badgeInactive) }}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link to={'/admin/catalogue/products/' + p.id + '/edit'} style={styles.btnSecondary}>
                          <img src="/src/assets/icons/edit.svg" alt="Edit" width={14} height={14} />
                        </Link>
                        <button onClick={() => handleDelete(p.id)} style={styles.btnDanger}>
                          <img src="/src/assets/icons/trash.svg" alt="Delete" width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
