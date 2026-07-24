import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Return Requested', value: 'return_requested' },
  { label: 'Returned', value: 'returned' },
];

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#3b5bdb' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  return_requested: { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#ffe3e3', color: '#f03e3e' },
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '9999px',
        backgroundColor: colors.bg,
        color: colors.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        lineHeight: '16px',
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const q = searchParams.get('q') || '';
  const limit = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (q) params.set('q', q);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const token = localStorage.getItem('token');
      const res = await fetch(`/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.orders || data.data || []);
      setTotalCount(data.total || data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [status, page, q]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleStatusFilter(val) {
    const next = new URLSearchParams(searchParams);
    if (val) next.set('status', val);
    else next.delete('status');
    next.set('page', '1');
    setSearchParams(next);
  }

  function handleSearch(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set('q', searchInput.trim());
    else next.delete('q');
    next.set('page', '1');
    setSearchParams(next);
  }

  function handlePageChange(newPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.01em',
              lineHeight: '32px',
              margin: '0',
              color: '#212529',
            }}
          >
            Orders
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search by order ID or customer…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#212529',
                backgroundColor: '#ffffff',
                minWidth: '260px',
                outline: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Status Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleStatusFilter(f.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: status === f.value ? '#4c6ef5' : '#868e96',
                backgroundColor: status === f.value ? '#4c6ef5' : '#ffffff',
                color: status === f.value ? '#ffffff' : '#495057',
                fontSize: '13px',
                fontWeight: status === f.value ? '600' : '400',
                cursor: 'pointer',
                minHeight: '36px',
                transition: 'all 0.15s ease',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #868e96',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#495057',
                fontSize: '16px',
              }}
            >
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#495057',
                fontSize: '16px',
              }}
            >
              No orders found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #868e96',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Action'].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: '12px',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#495057',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr
                      key={order.id || order.orderId || idx}
                      style={{
                        borderBottom: '1px solid #e9ecef',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f8f9fa')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <td
                        style={{
                          padding: '14px 16px',
                          fontFamily:
                            "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '13px',
                          color: '#4c6ef5',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        #{order.id || order.orderId}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#212529' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>
                          {order.customerName || order.customer?.name || '—'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#495057' }}>
                          {order.customerEmail || order.customer?.email || ''}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#495057',
                          whiteSpace: 'nowrap',
                          fontSize: '13px',
                        }}
                      >
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#495057',
                          textAlign: 'center',
                          fontSize: '14px',
                        }}
                      >
                        {order.itemCount ?? order.items?.length ?? '—'}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#212529',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          fontSize: '14px',
                        }}
                      >
                        ₹{Number(order.total ?? order.totalAmount ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={order.status || 'pending'} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link
                          to={`/admin/orders/${order.id || order.orderId}`}
                          style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            backgroundColor: '#e8ecfd',
                            color: '#4c6ef5',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            minHeight: '32px',
                            lineHeight: '20px',
                          }}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '14px', color: '#495057' }}>
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalCount)} of {totalCount}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  backgroundColor: page <= 1 ? '#e9ecef' : '#ffffff',
                  color: page <= 1 ? '#adb5bd' : '#212529',
                  fontSize: '14px',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  minHeight: '36px',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => handlePageChange(pg)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid',
                      borderColor: pg === page ? '#4c6ef5' : '#868e96',
                      borderRadius: '6px',
                      backgroundColor: pg === page ? '#4c6ef5' : '#ffffff',
                      color: pg === page ? '#ffffff' : '#212529',
                      fontSize: '14px',
                      fontWeight: pg === page ? '600' : '400',
                      cursor: 'pointer',
                      minHeight: '36px',
                      minWidth: '36px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  backgroundColor: page >= totalPages ? '#e9ecef' : '#ffffff',
                  color: page >= totalPages ? '#adb5bd' : '#212529',
                  fontSize: '14px',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  minHeight: '36px',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
