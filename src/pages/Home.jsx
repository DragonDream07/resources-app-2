import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import starIcon from '@/assets/icons/star.svg';
import heartIcon from '@/assets/icons/heart.svg';

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'home-living', label: 'Home & Living', emoji: '🏠' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'books', label: 'Books', emoji: '📚' },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 1299, originalPrice: 2499, rating: 4.5, reviews: 128 },
  { id: 2, name: 'Running Shoes', price: 899, originalPrice: 1799, rating: 4.3, reviews: 96 },
  { id: 3, name: 'Smart Watch', price: 3499, originalPrice: 5999, rating: 4.7, reviews: 204 },
  { id: 4, name: 'Casual T-Shirt', price: 399, originalPrice: 799, rating: 4.1, reviews: 57 },
];

export default function Home() {
  const navigate = useNavigate();

  const styles = {
    page: {
      background: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    header: {
      background: '#ffffff',
      borderBottom: '1px solid #868e96',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    headerInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    logoWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      color: '#4c6ef5',
      fontSize: '20px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      flexShrink: 0,
    },
    searchBar: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      background: '#f8f9fa',
      border: '1px solid #868e96',
      borderRadius: '6px',
      padding: '0 12px',
      height: '44px',
      gap: '8px',
    },
    searchInput: {
      border: 'none',
      background: 'transparent',
      outline: 'none',
      flex: 1,
      fontSize: '16px',
      color: '#212529',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '44px',
      minHeight: '44px',
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
    },
    heroBanner: {
      background: 'linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 100%)',
      borderRadius: '24px',
      padding: '48px 40px',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    heroBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '9999px',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#ffffff',
      width: 'fit-content',
    },
    heroTitle: {
      fontSize: '32px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      lineHeight: '40px',
      margin: 0,
      maxWidth: '600px',
    },
    heroSubtitle: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      opacity: 0.9,
      margin: 0,
    },
    heroActions: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    btnPrimary: {
      background: '#ffffff',
      color: '#4c6ef5',
      border: 'none',
      borderRadius: '10px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      minWidth: '160px',
      whiteSpace: 'nowrap',
    },
    btnSecondary: {
      background: 'rgba(255,255,255,0.15)',
      color: '#ffffff',
      border: '1px solid rgba(255,255,255,0.4)',
      borderRadius: '9999px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      whiteSpace: 'nowrap',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: 0,
      color: '#212529',
    },
    seeAllLink: {
      color: '#4c6ef5',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '16px',
    },
    categoryCard: {
      background: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '10px',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      textDecoration: 'none',
      color: '#212529',
      transition: 'box-shadow 0.15s',
      minHeight: '44px',
    },
    categoryEmoji: {
      fontSize: '32px',
      lineHeight: 1,
    },
    categoryLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#212529',
      textAlign: 'center',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '20px',
    },
    productCard: {
      background: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '10px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
    },
    productImageWrap: {
      position: 'relative',
      background: '#f8f9fa',
      aspectRatio: '4/3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      padding: '16px',
    },
    wishlistBtn: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: '#ffffff',
      border: 'none',
      borderRadius: '9999px',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    productInfo: {
      padding: '12px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      flex: 1,
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#212529',
      lineHeight: '24px',
      margin: 0,
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px',
      color: '#495057',
    },
    starIcon: {
      width: '14px',
      height: '14px',
      filter: 'invert(70%) sepia(80%) saturate(600%) hue-rotate(10deg)',
    },
    productPricing: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
      marginTop: '4px',
    },
    productPrice: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#212529',
    },
    productOriginalPrice: {
      fontSize: '14px',
      fontWeight: '400',
      color: '#868e96',
      textDecoration: 'line-through',
    },
    discountBadge: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#37b24d',
      background: '#d3f9d8',
      borderRadius: '3px',
      padding: '2px 6px',
    },
    addToCartBtn: {
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      marginTop: '8px',
      width: '100%',
    },
    promoBanner: {
      background: '#fff3e6',
      border: '1px solid #fd7e14',
      borderRadius: '10px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    },
    promoText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    promoTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#212529',
      margin: 0,
    },
    promoSubtitle: {
      fontSize: '14px',
      color: '#495057',
      margin: 0,
    },
    promoCode: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '14px',
      fontWeight: '400',
      background: '#f8f9fa',
      padding: '2px 6px',
      borderRadius: '3px',
      color: '#495057',
    },
    promoBtn: {
      background: '#fd7e14',
      color: '#212529',
      border: 'none',
      borderRadius: '9999px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      whiteSpace: 'nowrap',
    },
    footer: {
      background: '#ffffff',
      borderTop: '1px solid #868e96',
      padding: '32px 24px',
    },
    footerInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    },
    footerLinks: {
      display: 'flex',
      gap: '24px',
      flexWrap: 'wrap',
    },
    footerLink: {
      color: '#4c6ef5',
      textDecoration: 'none',
      fontSize: '14px',
    },
    footerMuted: {
      fontSize: '14px',
      color: '#495057',
    },
  };

  function getDiscount(price, original) {
    return Math.round(((original - price) / original) * 100);
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link to="/" style={styles.logoWrap}>
            <img src={logo} alt="ShopMini logo" style={{ height: '32px', width: '32px' }} />
            <span>ShopMini</span>
          </Link>

          <div style={styles.searchBar}>
            <img src={searchIcon} alt="" aria-hidden="true" style={{ width: '18px', height: '18px', opacity: 0.5 }} />
            <input
              style={styles.searchInput}
              type="search"
              placeholder="Search for products, brands and more…"
              aria-label="Search products"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </div>

          <button
            style={styles.iconBtn}
            aria-label="Cart"
            onClick={() => navigate('/cart')}
          >
            <img src={cartIcon} alt="" aria-hidden="true" style={{ width: '22px', height: '22px' }} />
          </button>

          <button
            style={styles.iconBtn}
            aria-label="Account"
            onClick={() => navigate('/login')}
          >
            <img src={userIcon} alt="" aria-hidden="true" style={{ width: '22px', height: '22px' }} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {/* Hero Banner */}
        <section aria-labelledby="hero-title">
          <div style={styles.heroBanner}>
            <span style={styles.heroBadge}>Limited Time Offer</span>
            <h1 id="hero-title" style={styles.heroTitle}>
              Up to 60% off on electronics, fashion &amp; home essentials
            </h1>
            <p style={styles.heroSubtitle}>
              Discover thousands of products from top brands. Free delivery on orders above ₹499.
            </p>
            <div style={styles.heroActions}>
              <button
                style={styles.btnPrimary}
                onClick={() => navigate('/products')}
              >
                Shop Now
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => navigate('/categories/home-living')}
              >
                🏠 Home &amp; Living
              </button>
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section aria-label="Promotional offer">
          <div style={styles.promoBanner}>
            <div style={styles.promoText}>
              <h2 style={styles.promoTitle}>🎉 First order? Get extra 10% off!</h2>
              <p style={styles.promoSubtitle}>
                Use code <code style={styles.promoCode}>WELCOME10</code> at checkout.
              </p>
            </div>
            <button
              style={styles.promoBtn}
              onClick={() => navigate('/products')}
            >
              Claim Offer
            </button>
          </div>
        </section>

        {/* Categories */}
        <section aria-labelledby="categories-title">
          <div style={styles.sectionHeader}>
            <h2 id="categories-title" style={styles.sectionTitle}>Shop by Category</h2>
            <Link to="/products" style={styles.seeAllLink}>
              See all
              <img src={chevronRight} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>
          <div style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                style={styles.categoryCard}
              >
                <span style={styles.categoryEmoji} aria-hidden="true">{cat.emoji}</span>
                <span style={styles.categoryLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section aria-labelledby="featured-title">
          <div style={styles.sectionHeader}>
            <h2 id="featured-title" style={styles.sectionTitle}>Featured Products</h2>
            <Link to="/products" style={styles.seeAllLink}>
              See all
              <img src={chevronRight} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>
          <div style={styles.productsGrid}>
            {FEATURED_PRODUCTS.map((product) => {
              const discount = getDiscount(product.price, product.originalPrice);
              return (
                <article
                  key={product.id}
                  style={styles.productCard}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div style={styles.productImageWrap}>
                    <img
                      src={placeholderProduct}
                      alt={product.name}
                      style={styles.productImage}
                    />
                    <button
                      style={styles.wishlistBtn}
                      aria-label={`Add ${product.name} to wishlist`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={heartIcon} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <div style={styles.productRating}>
                      <img src={starIcon} alt="" aria-hidden="true" style={styles.starIcon} />
                      <span>{product.rating}</span>
                      <span style={{ color: '#868e96' }}>({product.reviews})</span>
                    </div>
                    <div style={styles.productPricing}>
                      <span style={styles.productPrice}>₹{product.price.toLocaleString('en-IN')}</span>
                      <span style={styles.productOriginalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      <span style={styles.discountBadge}>{discount}% off</span>
                    </div>
                    <button
                      style={styles.addToCartBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/cart');
                      }}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerLinks}>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/products" style={styles.footerLink}>All Products</Link>
            <Link to="/orders" style={styles.footerLink}>My Orders</Link>
            <Link to="/login" style={styles.footerLink}>Login</Link>
          </div>
          <p style={styles.footerMuted}>&copy; 2024 ShopMini. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
