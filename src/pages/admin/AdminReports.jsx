import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const tokens = {
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorSecondary: '#fd7e14',
  colorSecondarySubtle: '#fff3e6',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorWarning: '#fd7e14',
  colorWarningSubtle: '#fff4e6',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorSurface: '#ffffff',
  colorCanvas: '#f8f9fa',
  colorBorder: '#868e96',
  colorOnPrimary: '#ffffff',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
};

const styles = {
  page: {
    backgroundColor: tokens.colorCanvas,
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: tokens.colorInk,
    padding: '32px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: tokens.colorMuted,
  },
  breadcrumbLink: {
    color: tokens.colorPrimary,
    textDecoration: 'none',
    fontSize: '14px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    margin: '0',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorBody,
  },
  select: {
    fontSize: '14px',
    fontWeight: '400',
    color: tokens.colorBody,
    backgroundColor: tokens.colorSurface,
    border: `1px solid #ced4da`,
    borderRadius: '6px',
    padding: '8px 32px 8px 12px',
    minHeight: '44px',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23868e96' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    cursor: 'pointer',
    outline: 'none',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    lineHeight: '16px',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    marginBottom: '16px',
    marginTop: '0',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  metricCard: {
    backgroundColor: tokens.colorSurface,
    borderRadius: '10px',
    padding: '24px',
    border: `1px solid #e9ecef`,
    boxShadow: '0 1px 3px rgba(33,37,41,0.06)',
  },
  metricLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    marginBottom: '8px',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    marginBottom: '4px',
  },
  metricChange: {
    fontSize: '13px',
    fontWeight: '500',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  metricBar: {
    height: '4px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    marginTop: '16px',
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.6s ease',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: tokens.colorSurface,
    borderRadius: '10px',
    border: `1px solid #e9ecef`,
    boxShadow: '0 1px 3px rgba(33,37,41,0.06)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '16px 24px',
    borderBottom: `1px solid #e9ecef`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: tokens.colorInk,
    margin: '0',
  },
  cardBody: {
    padding: '24px',
  },
  chartPlaceholder: {
    width: '100%',
    borderRadius: '6px',
    backgroundColor: tokens.colorCanvas,
    border: `1px dashed #ced4da`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    gap: '8px',
    color: tokens.colorMuted,
    fontSize: '14px',
  },
  barChartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '8px',
    height: '180px',
    padding: '0 4px',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    flex: 1,
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.5s ease',
    minWidth: '24px',
  },
  barLabel: {
    fontSize: '11px',
    color: tokens.colorMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    borderBottom: `2px solid #e9ecef`,
    backgroundColor: '#fafafa',
  },
  td: {
    padding: '14px 16px',
    borderBottom: `1px solid #f1f3f5`,
    color: tokens.colorBody,
    verticalAlign: 'middle',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
  },
  tabsRow: {
    display: 'flex',
    gap: '0',
    borderBottom: `2px solid #e9ecef`,
    marginBottom: '24px',
  },
  tab: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorMuted,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'color 0.15s, border-color 0.15s',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  tabActive: {
    color: tokens.colorPrimary,
    borderBottomColor: tokens.colorPrimary,
    fontWeight: '600',
  },
  donutContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  donutPlaceholder: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: `conic-gradient(${tokens.colorPrimary} 0% 42%, ${tokens.colorSuccess} 42% 67%, ${tokens.colorSecondary} 67% 82%, ${tokens.colorError} 82% 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutHole: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: tokens.colorSurface,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  donutCenter: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorInk,
    lineHeight: '18px',
    textAlign: 'center',
  },
  legendList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: tokens.colorBody,
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '8px',
    flexShrink: 0,
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
    color: tokens.colorMuted,
    fontSize: '16px',
  },
  exportBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: tokens.colorSurface,
    color: tokens.colorBody,
    padding: '8px 16px',
    borderRadius: '10px',
    border: `1px solid #ced4da`,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    transition: 'background-color 0.15s',
  },
};

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last 12 months' },
];

const REPORT_TABS = ['Sales', 'Orders', 'Returns', 'Inventory'];

const MOCK_METRICS = [
  { label: 'Gross Revenue', value: '₹8,42,310', change: '+12.4%', up: true, fill: 68, color: tokens.colorPrimary },
  { label: 'Net Revenue', value: '₹7,91,040', change: '+10.1%', up: true, fill: 63, color: tokens.colorSuccess },
  { label: 'Orders Placed', value: '1,284', change: '+8.7%', up: true, fill: 55, color: tokens.colorSecondary },
  { label: 'Avg Order Value', value: '₹656', change: '-2.3%', up: false, fill: 44, color: tokens.colorWarning },
  { label: 'Refunds Issued', value: '₹18,920', change: '+3.1%', up: false, fill: 22, color: tokens.colorError },
  { label: 'Conversion Rate', value: '3.8%', change: '+0.4pp', up: true, fill: 38, color: tokens.colorPrimaryDark },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MOCK_REVENUE_BY_MONTH = [42, 58, 51, 70, 63, 88, 74, 95, 82, 110, 97, 120];

const MOCK_TOP_PRODUCTS = [
  { name: 'Blue Denim Jacket', sku: 'SKU-1021', sold: 312, revenue: '₹1,24,488', returns: 8 },
  { name: 'White Sneakers L', sku: 'SKU-998', sold: 278, revenue: '₹97,300', returns: 12 },
  { name: 'Floral Kurta S', sku: 'SKU-874', sold: 241, revenue: '₹72,300', returns: 5 },
  { name: 'Classic Chinos M', sku: 'SKU-1102', sold: 198, revenue: '₹59,400', returns: 3 },
  { name: 'Cotton Tee Pack', sku: 'SKU-755', sold: 185, revenue: '₹46,250', returns: 9 },
];

const MOCK_ORDER_STATUS = [
  { status: 'Delivered', count: 842, color: tokens.colorSuccess },
  { status: 'Shipped', count: 194, color: tokens.colorPrimary },
  { status: 'Processing', count: 98, color: tokens.colorSecondary },
  { status: 'Cancelled', count: 150, color: tokens.colorError },
];

const MOCK_RETURNS = [
  { id: 'RR-210', order: 'ORD-10028', customer: 'Sneha Roy', reason: 'Wrong size', status: 'approved', amount: '₹1,299' },
  { id: 'RR-209', order: 'ORD-10021', customer: 'Amit Kumar', reason: 'Defective item', status: 'pending', amount: '₹2,499' },
  { id: 'RR-208', order: 'ORD-10019', customer: 'Divya Singh', reason: 'Changed mind', status: 'rejected', amount: '₹899' },
  { id: 'RR-207', order: 'ORD-10014', customer: 'Rajan Mehta', reason: 'Not as described', status: 'approved', amount: '₹3,199' },
];

const MOCK_INVENTORY = [
  { name: 'Blue Denim Jacket S', sku: 'SKU-1020', stock: 3, threshold: 10, status: 'low' },
  { name: 'White Sneakers XL', sku: 'SKU-999', stock: 0, threshold: 10, status: 'out' },
  { name: 'Floral Kurta M', sku: 'SKU-875', stock: 24, threshold: 10, status: 'ok' },
  { name: 'Classic Chinos L', sku: 'SKU-1103', stock: 7, threshold: 10, status: 'low' },
  { name: 'Cotton Tee XL', sku: 'SKU-756', stock: 52, threshold: 10, status: 'ok' },
];

const STATUS_BADGE = {
  approved: { bg: tokens.colorSuccessSubtle, color: tokens.colorSuccess },
  pending: { bg: tokens.colorWarningSubtle, color: tokens.colorWarning },
  rejected: { bg: tokens.colorErrorSubtle, color: tokens.colorError },
  low: { bg: tokens.colorWarningSubtle, color: tokens.colorWarning },
  out: { bg: tokens.colorErrorSubtle, color: tokens.colorError },
  ok: { bg: tokens.colorSuccessSubtle, color: tokens.colorSuccess },
};

function StatusBadge({ status }) {
  const s = STATUS_BADGE[status] || { bg: '#f1f3f5', color: tokens.colorMuted };
  return (
    <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

const maxRevenue = Math.max(...MOCK_REVENUE_BY_MONTH);

function SalesTab() {
  return (
    <>
      <div style={styles.chartsRow}>
        {/* Revenue Bar Chart */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Monthly Revenue (₹ thousands)</h3>
          </div>
          <div style={{ ...styles.cardBody, paddingBottom: '16px' }}>
            <div style={styles.barChartContainer}>
              {MOCK_REVENUE_BY_MONTH.map((val, idx) => (
                <div key={MONTHS[idx]} style={styles.barWrapper}>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${(val / maxRevenue) * 150}px`,
                      backgroundColor: idx === MOCK_REVENUE_BY_MONTH.length - 1
                        ? tokens.colorPrimary
                        : tokens.colorPrimarySubtle,
                      border: idx === MOCK_REVENUE_BY_MONTH.length - 1
                        ? `2px solid ${tokens.colorPrimaryDark}`
                        : 'none',
                    }}
                    title={`${MONTHS[idx]}: ₹${val}k`}
                  />
                  <span style={styles.barLabel}>{MONTHS[idx]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Donut */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Order Status</h3>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.donutContainer}>
              <div style={styles.donutPlaceholder}>
                <div style={styles.donutHole}>
                  <span style={styles.donutCenter}>1,284<br/>orders</span>
                </div>
              </div>
              <div style={styles.legendList}>
                {MOCK_ORDER_STATUS.map((item) => (
                  <div key={item.status} style={styles.legendItem}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ ...styles.legendDot, backgroundColor: item.color }} />
                      <span>{item.status}</span>
                    </div>
                    <span style={{ fontWeight: '600', color: tokens.colorInk }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Top Selling Products</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Units Sold</th>
                <th style={styles.th}>Revenue</th>
                <th style={styles.th}>Returns</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_PRODUCTS.map((p) => (
                <tr key={p.sku}>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontSize: '13px',
                        color: tokens.colorMuted,
                      }}
                    >
                      {p.sku}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{p.sold}</td>
                  <td style={{ ...styles.td, fontWeight: '600', color: tokens.colorSuccess }}>{p.revenue}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        color: p.returns > 10 ? tokens.colorError : tokens.colorMuted,
                        fontWeight: p.returns > 10 ? '600' : '400',
                      }}
                    >
                      {p.returns}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function OrdersTab() {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Order Status Breakdown</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Count</th>
              <th style={styles.th}>Share</th>
              <th style={styles.th}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDER_STATUS.map((item) => {
              const total = MOCK_ORDER_STATUS.reduce((a, b) => a + b.count, 0);
              const pct = ((item.count / total) * 100).toFixed(1);
              return (
                <tr key={item.status}>
                  <td style={styles.td}>
                    <StatusBadge status={item.status.toLowerCase()} />
                  </td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>{item.count}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{pct}%</span>
                      <div style={{ ...styles.metricBar, flex: 1, marginTop: 0 }}>
                        <div
                          style={{
                            ...styles.metricBarFill,
                            width: `${pct}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: tokens.colorMuted, fontSize: '13px' }}>—</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReturnsTab() {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Return Requests</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Return ID</th>
              <th style={styles.th}>Order</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RETURNS.map((r) => (
              <tr key={r.id}>
                <td style={styles.td}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                      color: tokens.colorPrimary,
                    }}
                  >
                    {r.id}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                      color: tokens.colorMuted,
                    }}
                  >
                    {r.order}
                  </span>
                </td>
                <td style={styles.td}>{r.customer}</td>
                <td style={{ ...styles.td, color: tokens.colorMuted }}>{r.reason}</td>
                <td style={styles.td}><StatusBadge status={r.status} /></td>
                <td style={{ ...styles.td, fontWeight: '600' }}>{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryTab() {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Inventory Alerts</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Threshold</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVENTORY.map((item) => (
              <tr key={item.sku}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                      color: tokens.colorMuted,
                    }}
                  >
                    {item.sku}
                  </span>
                </td>
                <td style={{
                  ...styles.td,
                  fontWeight: '600',
                  color: item.stock === 0
                    ? tokens.colorError
                    : item.stock < item.threshold
                    ? tokens.colorWarning
                    : tokens.colorSuccess,
                }}>
                  {item.stock}
                </td>
                <td style={{ ...styles.td, color: tokens.colorMuted }}>{item.threshold}</td>
                <td style={styles.td}><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('Sales');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [period]);

  function renderTabContent() {
    switch (activeTab) {
      case 'Sales': return <SalesTab />;
      case 'Orders': return <OrdersTab />;
      case 'Returns': return <ReturnsTab />;
      case 'Inventory': return <InventoryTab />;
      default: return null;
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
          <span>›</span>
          <span>Reports</span>
        </nav>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Business Reports</h1>
          <div style={styles.filterBar}>
            <label style={styles.filterLabel} htmlFor="report-period">Period:</label>
            <select
              id="report-period"
              style={styles.select}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              style={styles.exportBtn}
              onClick={() => {}}
              type="button"
              title="Export report"
            >
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingState}>Loading report data…</div>
        ) : (
          <>
            {/* Key Metrics */}
            <p style={styles.sectionLabel}>Key Metrics</p>
            <div style={styles.metricsGrid}>
              {MOCK_METRICS.map((m) => (
                <div key={m.label} style={styles.metricCard}>
                  <div style={styles.metricLabel}>{m.label}</div>
                  <div style={styles.metricValue}>{m.value}</div>
                  <div
                    style={{
                      ...styles.metricChange,
                      color: m.up ? tokens.colorSuccess : tokens.colorError,
                    }}
                  >
                    <span>{m.up ? '▲' : '▼'}</span>
                    <span>{m.change} vs prev period</span>
                  </div>
                  <div style={styles.metricBar}>
                    <div
                      style={{
                        ...styles.metricBarFill,
                        width: `${m.fill}%`,
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Tabbed Report Sections */}
            <div style={styles.tabsRow} role="tablist" aria-label="Report sections">
              {REPORT_TABS.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div role="tabpanel">
              {renderTabContent()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
