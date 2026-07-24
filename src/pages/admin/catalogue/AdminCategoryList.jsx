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
  empty: { textAlign: 'center', padding: '64px 24px', color: '#495057' }
};

export default function AdminCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data.data || data.categories || data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Delete failed');
      fetchCategories();
    } catch (e) { setError(e.message); }
  };

  const renderRows = (cats, depth = 0) => {
    return cats.flatMap(cat => {
      const rows = [
        <tr key={cat.id}>
          <td style={styles.td}><span style={{ marginLeft: depth * 20 + 'px' }}>{depth > 0 ? '\u2514 ' : ''}{cat.name}</span></td>
          <td style={styles.td}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{cat.slug}</span></td>
          <td style={styles.td}>{cat.parent_id || '-'}</td>
          <td style={styles.td}>
            <div style={styles.actions}>
              <Link to={'/admin/catalogue/categories/' + cat.id + '/edit'} style={styles.btnSecondary}>
                <img src="/src/assets/icons/edit.svg" alt="Edit" width={14} height={14} />
              </Link>
              <button onClick={() => handleDelete(cat.id)} style={styles.btnDanger}>
                <img src="/src/assets/icons/trash.svg" alt="Delete" width={14} height={14} />
              </button>
            </div>
          </td>
        </tr>
      ];
      if (cat.children && cat.children.length > 0) {
        rows.push(...renderRows(cat.children, depth + 1));
      }
      return rows;
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Categories</h1>
          <Link to="/admin/catalogue/categories/new" style={styles.btn}>
            <img src="/src/assets/icons/plus.svg" alt="" width={16} height={16} />
            New Category
          </Link>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.card}>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : categories.length === 0 ? (
            <div style={styles.empty}>No categories found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Parent ID</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>{renderRows(categories)}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
