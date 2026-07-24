import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#4c6ef5',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    marginBottom: '24px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    display: 'block',
    marginBottom: '4px',
  },
  fieldValue: {
    fontSize: '14px',
    color: '#343a40',
  },
  badge: (role) => {
    const map = {
      admin: { bg: '#e8ecfd', color: '#3b5bdb' },
      customer: { bg: '#d3f9d8', color: '#2f9e44' },
      guest: { bg: '#e9ecef', color: '#495057' },
    };
    const scheme = map[role] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      backgroundColor: scheme.bg,
      color: scheme.color,
      marginRight: '6px',
      marginBottom: '4px',
    };
  },
  roleAssignment: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  roleOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1.5px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'border-color 0.15s',
  },
  roleOptionChecked: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1.5px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
    cursor: 'pointer',
    minHeight: '44px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
  },
  roleLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#343a40',
    textTransform: 'capitalize',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  btnPrimary: (disabled) => ({
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: disabled ? '#adb5bd' : '#4c6ef5',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
  }),
  btnSecondary: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1.5px solid #868e96',
    backgroundColor: '#ffffff',
    color: '#343a40',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '44px',
  },
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  successBox: {
    backgroundColor: '#d3f9d8',
    color: '#2f9e44',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  codeText: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#343a40',
  },
  fullWidthCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
    marginTop: '24px',
  },
};

const AVAILABLE_ROLES = ['admin', 'customer', 'guest'];

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to load user (${res.status})`);
      const data = await res.json();
      const userData = data.data || data.user || data;
      setUser(userData);
      setSelectedRoles(userData.roles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  function toggleRole(role) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
    setSaveSuccess(false);
  }

  async function handleSaveRoles() {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roles: selectedRoles }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to update roles (${res.status})`);
      }
      setSaveSuccess(true);
      fetchUser();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setSelectedRoles(user?.roles || []);
    setSaveError(null);
    setSaveSuccess(false);
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingText}>Loading user…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Link to="/admin/users" style={styles.backLink}>
            ← Back to Users
          </Link>
          <div style={styles.errorBox}>{error}</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const fullName = [
    user.first_name || user.firstName || '',
    user.last_name || user.lastName || '',
  ]
    .join(' ')
    .trim() || '—';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/users" style={styles.backLink}>
          ← Back to Users
        </Link>

        <div style={styles.header}>
          <h1 style={styles.title}>{fullName}</h1>
          <p style={styles.subtitle}>{user.email}</p>
        </div>

        <div style={styles.grid}>
          {/* User Info Card */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>User Information</div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>User ID</span>
              <span style={{ ...styles.fieldValue, ...styles.codeText }}>{user.id}</span>
            </div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Full Name</span>
              <span style={styles.fieldValue}>{fullName}</span>
            </div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Email</span>
              <span style={styles.fieldValue}>{user.email}</span>
            </div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Phone</span>
              <span style={styles.fieldValue}>
                {user.phone || user.phone_number || '—'}
              </span>
            </div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Account Type</span>
              <span style={styles.fieldValue}>
                {user.is_guest ? 'Guest' : 'Registered'}
              </span>
            </div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Current Roles</span>
              <div>
                {(user.roles || []).length > 0 ? (
                  (user.roles || []).map((r) => (
                    <span key={r} style={styles.badge(r)}>{r}</span>
                  ))
                ) : (
                  <span style={styles.fieldValue}>—</span>
                )}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Joined</span>
              <span style={styles.fieldValue}>
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : '—'}
              </span>
            </div>

            <div style={styles.fieldGroup}>
              <span style={styles.fieldLabel}>Last Updated</span>
              <span style={styles.fieldValue}>
                {user.updated_at
                  ? new Date(user.updated_at).toLocaleString()
                  : '—'}
              </span>
            </div>
          </div>

          {/* Role Assignment Card */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Role Assignment</div>

            {saveSuccess && (
              <div style={styles.successBox}>Roles updated successfully.</div>
            )}
            {saveError && (
              <div style={styles.errorBox}>{saveError}</div>
            )}

            <div style={styles.roleAssignment}>
              {AVAILABLE_ROLES.map((role) => {
                const checked = selectedRoles.includes(role);
                return (
                  <label
                    key={role}
                    style={checked ? styles.roleOptionChecked : styles.roleOption}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRole(role)}
                      style={styles.checkbox}
                      aria-label={`Assign role ${role}`}
                    />
                    <span style={styles.roleLabel}>{role}</span>
                    <span style={{ ...styles.badge(role), margin: '0 0 0 auto' }}>
                      {role}
                    </span>
                  </label>
                );
              })}
            </div>

            <div style={styles.btnRow}>
              <button
                type="button"
                style={styles.btnPrimary(saving)}
                onClick={handleSaveRoles}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Roles'}
              </button>
              <button
                type="button"
                style={styles.btnSecondary}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders Summary */}
        {user.recent_orders && user.recent_orders.length > 0 && (
          <div style={styles.fullWidthCard}>
            <div style={styles.cardTitle}>Recent Orders</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#495057',
                      borderBottom: '1px solid #e9ecef',
                    }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#495057',
                      borderBottom: '1px solid #e9ecef',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#495057',
                      borderBottom: '1px solid #e9ecef',
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#495057',
                      borderBottom: '1px solid #e9ecef',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#495057',
                      borderBottom: '1px solid #e9ecef',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.recent_orders.map((order, idx) => (
                  <tr
                    key={order.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      borderBottom: '1px solid #e9ecef',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontSize: '14px',
                        color: '#343a40',
                      }}
                    >
                      {order.id}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#343a40' }}>
                      {order.status}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#343a40' }}>
                      {typeof order.total === 'number'
                        ? `₹${order.total.toFixed(2)}`
                        : order.total || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#343a40' }}>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        style={{ color: '#4c6ef5', textDecoration: 'none', fontWeight: '500' }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
