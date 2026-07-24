import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#212529' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.01em', margin: 0 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#4c6ef5', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', minHeight: '44px' },
  btnDanger: { padding: '6px 12px', backgroundColor: '#f03e3e', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', minHeight: '44px' },
  btnSecondary: { padding: '6px 12px', backgroundColor: '#ffffff', color: '#4c6ef5', border: '1px solid #4c6ef5', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '44px' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #868e96', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#495057', borderBottom: '1px solid #868e96', backgroundColor: '#f8f9fa' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#212529', borderBottom: '1px solid #e9ecef' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  error: { backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  empty: { textAlign: 'center', padding: '64px 24px', color: '#495057' },
  logo: { width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e9ecef' }
};

export default function AdminBrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/brands', { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Failed to load brands');
      const data = await res.json();
      setBrands(data.data || data.brands || data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Brands</h1>
          <Link to="/admin/catalogue/brands/new" style={styles.btn}>
            <img src="/src/assets/icons/plus.svg" alt="" width={16} height={16} />
            New Brand
          </Link>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.card}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : brands.length === 0 ? (
            <div style={styles.empty}>No brands found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Logo</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(b => (
                  <tr key={b.id}>
                    <td style={styles.td}>
                      {b.logo_url ? (
                        <img src={b.logo_url} alt={b.name} style={styles.logo} onError={e => { e.target.src = '/src/assets/images/placeholder-product.svg'; }} />
                      ) : <span style={{ color: '#adb5bd', fontSize: '12px' }}>No logo</span>}
                    </td>
                    <td style={styles.td}>{b.name}</td>
                    <td style={styles.td}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{b.slug}</span></td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link to={'/admin/catalogue/brands/' + b.id + '/edit'} style={styles.btnSecondary}>
                          <img src="/src/assets/icons/edit.svg" alt="Edit" width={14} height={14} />
                        </Link>
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
