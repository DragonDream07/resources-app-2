import { Link } from 'react-router-dom';
import emptyState from '@/assets/images/empty-state.svg';
import logo from '@/assets/images/logo.svg';

export default function NotFound() {
  const styles = {
    page: {
      background: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      background: '#ffffff',
      borderBottom: '1px solid #868e96',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
    },
    headerInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    logoLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      color: '#4c6ef5',
      fontSize: '20px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      gap: '32px',
      textAlign: 'center',
    },
    illustration: {
      width: '200px',
      height: '200px',
      opacity: 0.7,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      maxWidth: '480px',
    },
    statusCode: {
      fontSize: '40px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
      color: '#4c6ef5',
      margin: 0,
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      color: '#212529',
      margin: 0,
    },
    description: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      color: '#495057',
      margin: 0,
      maxWidth: '72ch',
    },
    actions: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '8px',
    },
    btnPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#4c6ef5',
      color: '#ffffff',
      textDecoration: 'none',
      border: 'none',
      borderRadius: '10px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      minWidth: '160px',
    },
    btnSecondary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      color: '#4c6ef5',
      textDecoration: 'none',
      border: '1px solid #4c6ef5',
      borderRadius: '10px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#495057',
    },
    breadcrumbLink: {
      color: '#4c6ef5',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    footer: {
      background: '#ffffff',
      borderTop: '1px solid #868e96',
      padding: '24px',
      textAlign: 'center',
    },
    footerText: {
      fontSize: '14px',
      color: '#495057',
      margin: 0,
    },
    footerLink: {
      color: '#4c6ef5',
      textDecoration: 'none',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link to="/" style={styles.logoLink}>
            <img src={logo} alt="ShopMini logo" style={{ height: '32px', width: '32px' }} />
            <span>ShopMini</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <nav aria-label="Breadcrumb">
          <div style={styles.breadcrumb}>
            <Link to="/" style={styles.breadcrumbLink}>Home</Link>
            <span aria-hidden="true">/</span>
            <span>Page Not Found</span>
          </div>
        </nav>

        <img
          src={emptyState}
          alt="Empty state illustration — page not found"
          style={styles.illustration}
        />

        <div style={styles.content}>
          <p style={styles.statusCode} aria-hidden="true">404</p>
          <h1 style={styles.title}>Page Not Found</h1>
          <p style={styles.description}>
            Sorry, we couldn&rsquo;t find the page you were looking for. It may have been moved,
            deleted, or the URL might be incorrect.
          </p>

          <div style={styles.actions}>
            <Link to="/" style={styles.btnPrimary}>
              Go to Home
            </Link>
            <Link to="/products" style={styles.btnSecondary}>
              Browse Products
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Need help?{' '}
          <Link to="/" style={styles.footerLink}>Return to Home</Link>
          {' '}or{' '}
          <Link to="/products" style={styles.footerLink}>View All Products</Link>
        </p>
      </footer>
    </div>
  );
}
