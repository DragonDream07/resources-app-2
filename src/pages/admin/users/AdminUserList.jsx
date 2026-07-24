import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const ROLES = ['all', 'admin', 'customer', 'guest'];

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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: 0,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  filterBtn: (active) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    border: active ? '1.5px solid #4c6ef5' : '1.5px solid #868e96',
    backgroundColor: active ? '#e8ecfd' : '#ffffff',
    color: active ? '#3b5bdb' : '#343a40',
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'all 0.15s ease',
  }),
  searchInput: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1.5px solid #868e96',
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    minWidth: '240px',
    minHeight: '44px',
    outline: 'none',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f8f9fa',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    borderBottom: '1px solid #e9ecef',
  },
  tr: (idx) => ({
    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.1s',
  }),
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#343a40',
    verticalAlign: 'middle',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
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
    };
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid #e9ecef',
  },
  pageBtn: (disabled) => ({
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1.5px solid #868e96',
    backgroundColor: disabled ? '#e9ecef' : '#ffffff',
    color: disabled ? '#adb5bd' : '#343a40',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
  }),
  pageInfo: {
    fontSize: '14px',
    color: '#495057',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
};

export default function AdminUserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const roleFilter = searchParams.get('role') || 'all';
  const search = searchParams.get('search') || '';
  const PAGE_SIZE = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (roleFilter && roleFilter !== 'all') params.set('role', roleFilter);
      if (search) params.set('search', search);

      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
      const data = await res.json();
      setUsers(data.data || data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleRoleFilter(role) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('role', role);
      next.set('page', '1');
      return next;
    });
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('search', val);
      next.set('page', '1');
      return next;
    });
  }

  function handlePrev() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(Math.max(1, page - 1)));
      return next;
    });
  }

  function handleNext() {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(Math.min(totalPages, page + 1)));
      return next;
    });
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
        </div>

        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Role:</span>
          {ROLES.map((role) => (
            <button
              key={role}
              style={styles.filterBtn(roleFilter === role)}
              onClick={() => handleRoleFilter(role)}
              type="button"
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={handleSearchChange}
            style={styles.searchInput}
            aria-label="Search users"
          />
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.card}>
          {loading ? (
            <div style={styles.loadingText}>Loading users…</div>
          ) : users.length === 0 ? (
            <div style={styles.emptyState}>No users found.</div>
          ) : (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role(s)</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} style={styles.tr(idx)}>
                    <td style={styles.td}>
                      {user.first_name || user.firstName || ''}{' '}
                      {user.last_name || user.lastName || ''}
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      {(user.roles || []).map((r) => (
                        <span key={r} style={{ ...styles.badge(r), marginRight: '4px' }}>
                          {r}
                        </span>
                      ))}
                      {(!user.roles || user.roles.length === 0) && (
                        <span style={styles.badge('guest')}>—</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/users/${user.id}`}
                        style={styles.link}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && users.length > 0 && (
            <div style={styles.pagination}>
              <span style={styles.pageInfo}>
                Page {page} of {totalPages} &mdash; {total} user{total !== 1 ? 's' : ''}
              </span>
              <button
                style={styles.pageBtn(page <= 1)}
                onClick={handlePrev}
                disabled={page <= 1}
                type="button"
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                style={styles.pageBtn(page >= totalPages)}
                onClick={handleNext}
                disabled={page >= totalPages}
                type="button"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
