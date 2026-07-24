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
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    margin: '0',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  linkButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: tokens.colorPrimary,
    color: tokens.colorOnPrimary,
    padding: '10px 20px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    transition: 'background-color 0.15s ease',
    minHeight: '44px',
    boxSizing: 'border-box',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: tokens.colorSurface,
    borderRadius: '10px',
    padding: '24px',
    border: `1px solid #e9ecef`,
    boxShadow: '0 1px 3px rgba(33,37,41,0.06)',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    marginBottom: '4px',
  },
  statSub: {
    fontSize: '14px',
    fontWeight: '400',
    color: tokens.colorMuted,
    lineHeight: '20px',
  },
  statAccent: {
    display: 'inline-block',
    width: '4px',
    borderRadius: '2px',
    height: '40px',
    marginRight: '16px',
    flexShrink: 0,
  },
  statCardInner: {
    display: 'flex',
    alignItems: 'center',
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  tile: {
    backgroundColor: tokens.colorSurface,
    borderRadius: '10px',
    padding: '24px',
    border: `1px solid #e9ecef`,
    boxShadow: '0 1px 3px rgba(33,37,41,0.06)',
    textDecoration: 'none',
    color: tokens.colorInk,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    cursor: 'pointer',
  },
  tileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: tokens.colorInk,
    margin: '0',
  },
  tileDesc: {
    fontSize: '14px',
    fontWeight: '400',
    color: tokens.colorMuted,
    lineHeight: '20px',
    margin: '0',
  },
  tileArrow: {
    fontSize: '18px',
    color: tokens.colorPrimary,
    marginTop: 'auto',
  },
  sectionRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    borderBottom: `1px solid #e9ecef`,
  },
  td: {
    padding: '12px',
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
  viewAllLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorPrimary,
    textDecoration: 'none',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: tokens.colorMuted,
    fontSize: '16px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 0',
    borderBottom: `1px solid #f1f3f5`,
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    marginTop: '6px',
    flexShrink: 0,
  },
  activityText: {
    fontSize: '14px',
    lineHeight: '20px',
    color: tokens.colorBody,
  },
  activityTime: {
    fontSize: '12px',
    color: tokens.colorMuted,
    lineHeight: '16px',
    marginTop: '2px',
  },
};

const STATUS_COLORS = {
  pending: { bg: tokens.colorWarningSubtle, color: tokens.colorWarning },
  confirmed: { bg: tokens.colorPrimarySubtle, color: tokens.colorPrimary },
  shipped: { bg: tokens.colorPrimarySubtle, color: tokens.colorPrimaryDark },
  delivered: { bg: tokens.colorSuccessSubtle, color: tokens.colorSuccess },
  cancelled: { bg: tokens.colorErrorSubtle, color: tokens.colorError },
  returned: { bg: '#f1f3f5', color: tokens.colorMuted },
  processing: { bg: tokens.colorSecondarySubtle, color: tokens.colorSecondary },
};

function getBadgeStyle(status) {
  const s = STATUS_COLORS[status?.toLowerCase()] || { bg: '#f1f3f5', color: tokens.colorMuted };
  return { ...styles.badge, backgroundColor: s.bg, color: s.color };
}

const MOCK_STATS = [
  { label: 'Total Orders', value: '1,284', sub: 'All time', accent: tokens.colorPrimary },
  { label: 'Revenue', value: '₹8,42,310', sub: 'All time', accent: tokens.colorSuccess },
  { label: 'Active Users', value: '3,921', sub: 'Registered accounts', accent: tokens.colorSecondary },
  { label: 'Pending Orders', value: '47', sub: 'Awaiting processing', accent: tokens.colorWarning },
  { label: 'Return Requests', value: '12', sub: 'Open requests', accent: tokens.colorError },
  { label: 'Products', value: '238', sub: 'In catalogue', accent: tokens.colorPrimaryDark },
];

const QUICK_TILES = [
  {
    title: 'Manage Products',
    desc: 'Add, edit or remove products and SKUs',
    icon: '📦',
    iconBg: tokens.colorPrimarySubtle,
    to: '/admin/products',
  },
  {
    title: 'Manage Orders',
    desc: 'View and process customer orders',
    icon: '🧾',
    iconBg: tokens.colorSuccessSubtle,
    to: '/admin/orders',
  },
  {
    title: 'Return Requests',
    desc: 'Review and handle return requests',
    icon: '↩️',
    iconBg: tokens.colorErrorSubtle,
    to: '/admin/returns',
  },
  {
    title: 'Promo Codes',
    desc: 'Create and manage discount codes',
    icon: '🎫',
    iconBg: tokens.colorSecondarySubtle,
    to: '/admin/promos',
  },
  {
    title: 'Categories',
    desc: 'Organise the product catalogue',
    icon: '🗂️',
    iconBg: tokens.colorPrimarySubtle,
    to: '/admin/categories',
  },
  {
    title: 'Reports',
    desc: 'Consolidated business reports',
    icon: '📊',
    iconBg: tokens.colorSuccessSubtle,
    to: '/admin/reports',
  },
];

const MOCK_RECENT_ORDERS = [
  { id: 'ORD-10041', customer: 'Aarav Shah', amount: '₹2,499', status: 'pending', date: '2 min ago' },
  { id: 'ORD-10040', customer: 'Priya Nair', amount: '₹1,199', status: 'confirmed', date: '18 min ago' },
  { id: 'ORD-10039', customer: 'Rahul Verma', amount: '₹5,799', status: 'shipped', date: '1 hr ago' },
  { id: 'ORD-10038', customer: 'Meera Iyer', amount: '₹899', status: 'delivered', date: '3 hr ago' },
  { id: 'ORD-10037', customer: 'Kiran Patel', amount: '₹3,249', status: 'cancelled', date: '5 hr ago' },
];

const MOCK_ACTIVITY = [
  { text: 'Return request #RR-204 marked as approved', time: '5 min ago', color: tokens.colorSuccess },
  { text: 'New order ORD-10041 placed by Aarav Shah', time: '7 min ago', color: tokens.colorPrimary },
  { text: 'Stock updated for SKU-998 (Blue Sneakers L)', time: '22 min ago', color: tokens.colorSecondary },
  { text: 'Promo code SUMMER20 created', time: '1 hr ago', color: tokens.colorWarning },
  { text: 'Order ORD-10035 advanced to Shipped', time: '2 hr ago', color: tokens.colorPrimary },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingState}>Loading dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <div style={styles.headerActions}>
            <Link to="/admin/reports" style={styles.linkButton}>
              📊 View Reports
            </Link>
          </div>
        </div>

        {/* Aggregated Stats */}
        <p style={styles.sectionLabel}>Overview</p>
        <div style={styles.statsGrid}>
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <div style={styles.statCardInner}>
                <span
                  style={{
                    ...styles.statAccent,
                    backgroundColor: stat.accent,
                  }}
                />
                <div>
                  <div style={styles.statLabel}>{stat.label}</div>
                  <div style={styles.statValue}>{stat.value}</div>
                  <div style={styles.statSub}>{stat.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick-Access Tiles */}
        <p style={styles.sectionLabel}>Quick Access</p>
        <div style={styles.tilesGrid}>
          {QUICK_TILES.map((tile) => (
            <Link
              key={tile.title}
              to={tile.to}
              style={styles.tile}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,110,245,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(33,37,41,0.06)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ ...styles.tileIcon, backgroundColor: tile.iconBg }}>
                {tile.icon}
              </div>
              <p style={styles.tileTitle}>{tile.title}</p>
              <p style={styles.tileDesc}>{tile.desc}</p>
              <span style={styles.tileArrow}>→</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders + Activity Feed */}
        <div style={styles.sectionRow}>
          {/* Recent Orders */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Recent Orders</h2>
              <Link to="/admin/orders" style={styles.viewAllLink}>View all</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RECENT_ORDERS.map((order) => (
                    <tr key={order.id}>
                      <td style={styles.td}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '13px',
                            color: tokens.colorPrimary,
                          }}
                        >
                          {order.id}
                        </span>
                      </td>
                      <td style={styles.td}>{order.customer}</td>
                      <td style={styles.td}>{order.amount}</td>
                      <td style={styles.td}>
                        <span style={getBadgeStyle(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: tokens.colorMuted, fontSize: '13px' }}>
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Recent Activity</h2>
            </div>
            <div style={styles.cardBody}>
              {MOCK_ACTIVITY.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.activityItem,
                    borderBottom: idx === MOCK_ACTIVITY.length - 1 ? 'none' : `1px solid #f1f3f5`,
                  }}
                >
                  <span
                    style={{ ...styles.activityDot, backgroundColor: item.color }}
                  />
                  <div>
                    <div style={styles.activityText}>{item.text}</div>
                    <div style={styles.activityTime}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
