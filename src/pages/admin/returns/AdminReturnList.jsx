import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_STYLES = {
  pending: { background: '#fff4e6', color: '#fd7e14' },
  approved: { background: '#d3f9d8', color: '#37b24d' },
  rejected: { background: '#ffe3e3', color: '#f03e3e' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { background: '#e8ecfd', color: '#4c6ef5' };
  return (
    <span
      style={{
        ...style,
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  );
}

export default function AdminReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('q', search);
      params.set('page', String(page));
      params.set('limit', '20');
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load return requests.');
      const data = await res.json();
      setReturns(data.data ?? data.returnRequests ?? []);
      setTotalPages(data.totalPages ?? data.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleStatusChange(e) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f8f9fa',
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
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: 0,
    },
    filtersRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    searchForm: {
      display: 'flex',
      gap: '8px',
    },
    input: {
      padding: '10px 14px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      outline: 'none',
      minWidth: '220px',
    },
    select: {
      padding: '10px 14px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      outline: 'none',
      cursor: 'pointer',
    },
    button: {
      padding: '10px 20px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
    },
    card: {
      background: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      borderBottom: '1px solid #868e96',
      background: '#f8f9fa',
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#343a40',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
    },
    trHover: {
      cursor: 'pointer',
    },
    link: {
      color: '#4c6ef5',
      textDecoration: 'none',
      fontWeight: '500',
    },
    idCode: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '13px',
    },
    emptyState: {
      padding: '48px 24px',
      textAlign: 'center',
      color: '#495057',
    },
    errorBox: {
      background: '#ffe3e3',
      color: '#f03e3e',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '14px',
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '24px',
      justifyContent: 'center',
    },
    pageBtn: {
      padding: '8px 14px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      background: '#ffffff',
      color: '#212529',
      cursor: 'pointer',
      fontSize: '14px',
      minHeight: '44px',
      minWidth: '44px',
    },
    pageBtnActive: {
      background: '#4c6ef5',
      color: '#ffffff',
      borderColor: '#4c6ef5',
    },
    pageBtnDisabled: {
      opacity: 0.45,
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Return Requests</h1>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.filtersRow}>
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by order or request ID"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={styles.input}
              aria-label="Search return requests"
            />
            <button type="submit" style={styles.button}>
              Search
            </button>
          </form>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            style={styles.select}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.card}>
          {loading ? (
            <div style={styles.emptyState}>Loading return requests&hellip;</div>
          ) : returns.length === 0 ? (
            <div style={styles.emptyState}>
              <img
                src="/src/assets/images/empty-state.svg"
                alt="No return requests"
                style={{ width: '80px', marginBottom: '16px', opacity: 0.5 }}
              />
              <p style={{ margin: 0 }}>No return requests found.</p>
            </div>
          ) : (
            <table style={styles.table} aria-label="Return requests table">
              <thead>
                <tr>
                  <th style={styles.th}>Request ID</th>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {returns.map(req => (
                  <tr key={req.id} style={styles.trHover}>
                    <td style={styles.td}>
                      <span style={styles.idCode}>{req.id}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.idCode}>{req.orderId ?? req.order_id ?? '—'}</span>
                    </td>
                    <td style={styles.td}>
                      {req.user?.name ??
                        req.customerName ??
                        req.customer_name ??
                        (req.user?.email ?? '—')}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          display: 'block',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={req.reason ?? ''}
                      >
                        {req.reason ?? '—'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={req.status ?? 'pending'} />
                    </td>
                    <td style={styles.td}>
                      {req.createdAt ?? req.created_at
                        ? new Date(req.createdAt ?? req.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/returns/${req.id}`}
                        style={styles.link}
                        aria-label={`View return request ${req.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.pageBtn,
                ...(page <= 1 ? styles.pageBtnDisabled : {}),
              }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                style={{
                  ...styles.pageBtn,
                  ...(p === page ? styles.pageBtnActive : {}),
                }}
                onClick={() => setPage(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            ))}
            <button
              style={{
                ...styles.pageBtn,
                ...(page >= totalPages ? styles.pageBtnDisabled : {}),
              }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              &rsaquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
