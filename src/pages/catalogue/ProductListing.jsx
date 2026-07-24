import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import chevronDown from '@/assets/icons/chevron-down.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const PAGE_SIZE = 24;

async function fetchProducts(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products?${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

function PriceDisplay({ price, taxInclusive }) {
  if (price == null) return null;
  return (
    <span style={{ fontWeight: 600, color: '#212529', fontSize: '16px' }}>
      ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      {taxInclusive && (
        <span style={{ fontSize: '12px', color: '#495057', fontWeight: 400, marginLeft: '4px' }}>
          incl. tax
        </span>
      )}
    </span>
  );
}

function ProductCard({ product }) {
  const image = product.images?.[0]?.url || placeholderProduct;
  const price = product.skus?.[0]?.price ?? product.price;
  const slug = product.slug || product.id;

  return (
    <Link
      to={`/products/${slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #868e96',
        textDecoration: 'none',
        color: '#212529',
        transition: 'box-shadow 0.15s',
      }}
    >
      <div style={{ aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        <img
          src={image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.currentTarget.src = placeholderProduct; }}
        />
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {product.brand?.name && (
          <span style={{ fontSize: '12px', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            {product.brand.name}
          </span>
        )}
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, lineHeight: '24px', color: '#212529' }}>
          {product.name}
        </h3>
        <PriceDisplay price={price} taxInclusive />
        {product.stock === 0 && (
          <span style={{ fontSize: '12px', color: '#f03e3e', fontWeight: 500 }}>Out of stock</span>
        )}
      </div>
    </Link>
  );
}

function FilterSidebar({ categories, brands, filters, onChange }) {
  const [openSections, setOpenSections] = useState({ category: true, brand: true, price: true });

  const toggle = section => setOpenSections(s => ({ ...s, [section]: !s[section] }));

  const handleCheckbox = (key, value) => {
    const current = filters[key] ? filters[key].split(',').filter(Boolean) : [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ [key]: updated.join(',') || undefined });
  };

  const sectionStyle = {
    borderBottom: '1px solid #868e96',
    paddingBottom: '16px',
    marginBottom: '16px',
  };

  const headingStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    color: '#212529',
    background: 'none',
    border: 'none',
    padding: 0,
    width: '100%',
    textAlign: 'left',
    minHeight: '44px',
  };

  return (
    <aside style={{ width: '240px', flexShrink: 0 }}>
      <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#212529' }}>Filters</h2>

      <div style={sectionStyle}>
        <button style={headingStyle} onClick={() => toggle('category')} aria-expanded={openSections.category}>
          Category
          <img src={chevronDown} alt="" style={{ width: '16px', transform: openSections.category ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {openSections.category && (
          <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(categories || []).map(cat => (
              <li key={cat.id}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#343a40', minHeight: '44px' }}>
                  <input
                    type="checkbox"
                    checked={(filters.categoryId || '').split(',').includes(String(cat.id))}
                    onChange={() => handleCheckbox('categoryId', String(cat.id))}
                    style={{ accentColor: '#4c6ef5', width: '16px', height: '16px' }}
                  />
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={sectionStyle}>
        <button style={headingStyle} onClick={() => toggle('brand')} aria-expanded={openSections.brand}>
          Brand
          <img src={chevronDown} alt="" style={{ width: '16px', transform: openSections.brand ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {openSections.brand && (
          <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(brands || []).map(brand => (
              <li key={brand.id}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#343a40', minHeight: '44px' }}>
                  <input
                    type="checkbox"
                    checked={(filters.brandId || '').split(',').includes(String(brand.id))}
                    onChange={() => handleCheckbox('brandId', String(brand.id))}
                    style={{ accentColor: '#4c6ef5', width: '16px', height: '16px' }}
                  />
                  {brand.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={sectionStyle}>
        <button style={headingStyle} onClick={() => toggle('price')} aria-expanded={openSections.price}>
          Price Range
          <img src={chevronDown} alt="" style={{ width: '16px', transform: openSections.price ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {openSections.price && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={e => onChange({ minPrice: e.target.value || undefined })}
              style={{
                width: '80px', padding: '8px', border: '1px solid #868e96', borderRadius: '6px',
                fontSize: '14px', color: '#212529', background: '#ffffff',
              }}
            />
            <span style={{ color: '#868e96' }}>–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={e => onChange({ maxPrice: e.target.value || undefined })}
              style={{
                width: '80px', padding: '8px', border: '1px solid #868e96', borderRadius: '6px',
                fontSize: '14px', color: '#212529', background: '#ffffff',
              }}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '32px' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        style={{
          minWidth: '44px', minHeight: '44px', padding: '0 12px',
          border: '1px solid #868e96', borderRadius: '6px', background: '#ffffff',
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          color: page <= 1 ? '#adb5bd' : '#212529',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <img src={chevronLeft} alt="Previous" style={{ width: '16px' }} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
          style={{
            minWidth: '44px', minHeight: '44px', padding: '0 12px',
            border: '1px solid',
            borderColor: p === page ? '#4c6ef5' : '#868e96',
            borderRadius: '6px',
            background: p === page ? '#4c6ef5' : '#ffffff',
            color: p === page ? '#ffffff' : '#212529',
            fontWeight: p === page ? 600 : 400,
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        style={{
          minWidth: '44px', minHeight: '44px', padding: '0 12px',
          border: '1px solid #868e96', borderRadius: '6px', background: '#ffffff',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          color: page >= totalPages ? '#adb5bd' : '#212529',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <img src={chevronRight} alt="Next" style={{ width: '16px' }} />
      </button>
    </nav>
  );
}

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  const filters = {
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const updateParams = useCallback((updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === '') next.delete(k);
        else next.set(k, v);
      });
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const handlePageChange = useCallback(p => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    });
  }, [setSearchParams]);

  useEffect(() => {
    fetchCategories().then(d => setCategories(d.data || d)).catch(() => {});
    fetchBrands().then(d => setBrands(d.data || d)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {
      page,
      limit: PAGE_SIZE,
      sort,
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.brandId && { brandId: filters.brandId }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    };
    fetchProducts(params)
      .then(data => {
        setProducts(data.data || data.products || []);
        setTotal(data.total || data.count || 0);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#212529', marginBottom: '8px' }}>
          All Products
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '14px', color: '#495057' }}>
            {loading ? 'Loading…' : <><strong>{total}</strong> products</>}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="sort-select" style={{ fontSize: '14px', color: '#495057' }}>Sort by:</label>
            <select
              id="sort-select"
              value={sort}
              onChange={e => setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('sort', e.target.value); n.set('page', '1'); return n; })}
              style={{
                padding: '8px 12px', border: '1px solid #868e96', borderRadius: '6px',
                fontSize: '14px', color: '#212529', background: '#ffffff', minHeight: '44px', cursor: 'pointer',
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
            onChange={updateParams}
          />

          <main style={{ flex: 1, minWidth: 0 }}>
            {error && (
              <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#495057' }}>Loading products…</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                <img src={emptyState} alt="No products found" style={{ width: '120px', marginBottom: '16px', opacity: 0.6 }} />
                <p style={{ color: '#495057', fontSize: '16px' }}>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '20px',
                }}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
