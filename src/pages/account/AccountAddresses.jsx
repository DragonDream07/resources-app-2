import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: 0,
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
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    position: 'relative',
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  addressLine: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 2px 0',
    lineHeight: '20px',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  btnEdit: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '6px',
    padding: '6px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnDelete: {
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '6px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '16px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#212529',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  defaultBadge: {
    display: 'inline-block',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 10px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginLeft: '8px',
  },
};

export default function AccountAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function loadAddresses() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/users/me/addresses', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load addresses.');
      const data = await res.json();
      setAddresses(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAddresses(); }, []);

  async function handleDelete(addressId) {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    setSuccessMsg('');
    setError('');
    try {
      const res = await fetch(`/users/me/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete address.');
      setSuccessMsg('Address deleted.');
      loadAddresses();
    } catch (err) {
      setError(err.message || 'Failed to delete address.');
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.headerRow}>
          <h1 style={styles.pageTitle}>Addresses</h1>
          <Link to="/account/addresses/new" style={styles.btnPrimary}>
            + Add new address
          </Link>
        </div>

        {successMsg && <div style={styles.successBanner}>{successMsg}</div>}
        {error && <div style={styles.errorBanner}>{error}</div>}

        {loading ? (
          <div style={styles.card}>
            <div style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '10px', width: '50%' }} />
            <div style={{ height: '14px', backgroundColor: '#e9ecef', borderRadius: '6px', width: '70%' }} />
          </div>
        ) : addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <p>You have no saved addresses.</p>
            <Link to="/account/addresses/new" style={{ color: '#4c6ef5' }}>Add your first address</Link>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} style={styles.card}>
              <p style={styles.addressName}>
                {addr.first_name} {addr.last_name}
                {addr.is_default && <span style={styles.defaultBadge}>Default</span>}
              </p>
              <p style={styles.addressLine}>{addr.address_line1}</p>
              {addr.address_line2 && <p style={styles.addressLine}>{addr.address_line2}</p>}
              <p style={styles.addressLine}>{addr.city}, {addr.state} {addr.postal_code}</p>
              <p style={styles.addressLine}>{addr.country}</p>
              {addr.phone && <p style={styles.addressLine}>📞 {addr.phone}</p>}
              <div style={styles.actionRow}>
                <button
                  style={styles.btnEdit}
                  onClick={() => navigate(`/account/addresses/${addr.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  style={styles.btnDelete}
                  onClick={() => handleDelete(addr.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
