import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import chevronDown from '@/assets/icons/chevron-down.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

async function fetchSearchResults(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/search?${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch search results');
  return res.json();
}

async function fetchSuggest(q) {
  const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(q)}`, { credentials: 'include' });
  if (!res.ok) return { suggestions: [] };
  return res.json();
}

function PriceDisplay({ price }) {
  if (price == null) return null;
  return (
    <span style={{ fontWeight: 600, color: '#212529', fontSize: '16px' }}>
      ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      <span style={{ fontSize: '12px', color: '#495057', fontWeight: 400, marginLeft: '4px' }}>incl. tax</span>
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
        display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff',
        borderRadius: '10px', overflow: 'hidden', border: '1px solid #868e96',
        textDecoration: 'none', color: '#212529',
      }}
    >
      <div style={{ aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        <img
          src={image} alt={product.name}
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
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, lineHeight: '24px' }}>{product.name}</h3>
        <PriceDisplay price={price} />
        {product.category?.name && (
          <span style={{ fontSize: '12px', color: '#4c6ef5' }}>{product.category.name}</span>
        )}
      </div>
    </Link>
  );
}

function FacetFilter({ title, options, selectedValues, onToggle }) {
  const [open, setOpen] = useState(true);
  if (!options || options.length === 0) return null;
  return (
    <div style={{ borderBottom: '1px solid #868e96', paddingBottom: '16px', marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: '14px', color: '#212529', padding: 0, minHeight: '44px',
        }}
      >
        {title}
        <img src={chevronDown} alt="" style={{ width: '16px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {options.map(opt => (
            <li key={opt.value}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#343a40', minHeight: '44px' }}>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={() => onToggle(opt.value)}
                  style={{ accentColor: '#4c6ef5', width: '16px', height: '16px' }}
                />
                <span>{opt.label}</span>
                {opt.count != null && (
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#868e96' }}>({opt.count})</span>
                )}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '32px' }}>
      <button
        onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page"
        style={{ minWidth: '44px', minHeight: '44px', border: '1px solid #868e96', borderRadius: '6px', background: '#ffffff', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#adb5bd' : '#212529', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <img src={chevronLeft} alt="Previous" style={{ width: '16px' }} />
      </button>
      {pages.map(p => (
        <button
          key={p} onClick={() => onPageChange(p)} aria-current={p === page ? 'page' : undefined}
          style={{ minWidth: '44px', minHeight: '44px', border: '1px solid', borderColor: p === page ? '#4c6ef5' : '#868e96', borderRadius: '6px', background: p === page ? '#4c6ef5' : '#ffffff', color: p === page ? '#ffffff' : '#212529', fontWeight: p === page ? 600 : 400, cursor: 'pointer', fontSize: '14px' }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page"
        style={{ minWidth: '44px', minHeight: '44px', border: '1px solid #868e96', borderRadius: '6px', background: '#ffffff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: page >= totalPages ? '#adb5bd' : '#212529', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <img src={chevronRight} alt="Next" style={{ width: '16px' }} />
      </button>
    </nav>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimeout = useRef(null);
  const inputRef = useRef(null);

  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'relevance';
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  useEffect(() => {
    if (!q) { setResults([]); setTotal(0); setFacets({}); return; }
    setLoading(true);
    setError(null);
    const params = {
      q, page, limit: PAGE_SIZE, sort,
      ...(categoryFilter && { category: categoryFilter }),
      ...(brandFilter && { brand: brandFilter }),
    };
    fetchSearchResults(params)
      .then(data => {
        setResults(data.data || data.products || data.results || []);
        setTotal(data.total || data.count || 0);
        setFacets(data.facets || {});
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleInputChange = e => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(suggestTimeout.current);
    if (val.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    suggestTimeout.current = setTimeout(() => {
      fetchSuggest(val).then(d => {
        setSuggestions(d.suggestions || d.data || []);
        setShowSuggestions(true);
      }).catch(() => {});
    }, 250);
  };

  const handleSearch = useCallback((query) => {
    setShowSuggestions(false);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('q', query);
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const handleSubmit = e => { e.preventDefault(); handleSearch(inputValue); };

  const handleFacetToggle = useCallback((facetKey, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const current = (next.get(facetKey) || '').split(',').filter(Boolean);
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      if (updated.length === 0) next.delete(facetKey);
      else next.set(facetKey, updated.join(','));
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const handlePageChange = useCallback(p => {
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n; });
  }, [setSearchParams]);

  const categoryFacetOptions = (facets.categories || []).map(f => ({ value: f.value || f.slug || f.id, label: f.label || f.name, count: f.count }));
  const brandFacetOptions = (facets.brands || []).map(f => ({ value: f.value || f.slug || f.id, label: f.label || f.name, count: f.count }));

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#212529', marginBottom: '20px' }}>
          Search
        </h1>

        <form onSubmit={handleSubmit} style={{ position: 'relative', marginBottom: '24px', maxWidth: '600px' }} role="search">
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <img src={searchIcon} alt="" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', opacity: 0.5, pointerEvents: 'none' }} />
              <input
                ref={inputRef}
                type="search"
                aria-label="Search products"
                placeholder="Search products…"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                style={{
                  width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #868e96',
                  borderRadius: '6px', fontSize: '16px', color: '#212529', background: '#ffffff',
                  minHeight: '44px', boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff',
                  border: '1px solid #868e96', borderRadius: '6px', marginTop: '4px',
                  listStyle: 'none', padding: '4px 0', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => { setInputValue(s.text || s); handleSearch(s.text || s); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 16px', border: 'none', background: 'none',
                          cursor: 'pointer', fontSize: '14px', color: '#212529', minHeight: '44px',
                        }}
                      >
                        {s.text || s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              style={{
                padding: '0 24px', backgroundColor: '#4c6ef5', color: '#ffffff',
                border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '16px',
                cursor: 'pointer', minHeight: '44px', whiteSpace: 'nowrap',
              }}
            >
              Search
            </button>
          </div>
        </form>

        {q && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: '#495057' }}>
              {loading ? 'Searching…' : (
                <>{total > 0 ? <><strong>{total}</strong> results for &ldquo;<em>{q}</em>&rdquo;</> : <>No results for &ldquo;<em>{q}</em>&rdquo;</>}</>
              )}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="search-sort" style={{ fontSize: '14px', color: '#495057' }}>Sort by:</label>
              <select
                id="search-sort" value={sort}
                onChange={e => setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('sort', e.target.value); n.set('page', '1'); return n; })}
                style={{ padding: '8px 12px', border: '1px solid #868e96', borderRadius: '6px', fontSize: '14px', background: '#ffffff', minHeight: '44px', cursor: 'pointer' }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {!q && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#495057' }}>
            <img src={searchIcon} alt="" style={{ width: '48px', marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px' }}>Enter a search term to find products.</p>
          </div>
        )}

        {q && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            {(categoryFacetOptions.length > 0 || brandFacetOptions.length > 0) && (
              <aside style={{ width: '240px', flexShrink: 0 }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#212529' }}>Refine Results</h2>
                <FacetFilter
                  title="Category"
                  options={categoryFacetOptions}
                  selectedValues={categoryFilter ? categoryFilter.split(',') : []}
                  onToggle={v => handleFacetToggle('category', v)}
                />
                <FacetFilter
                  title="Brand"
                  options={brandFacetOptions}
                  selectedValues={brandFilter ? brandFilter.split(',') : []}
                  onToggle={v => handleFacetToggle('brand', v)}
                />
              </aside>
            )}

            <main style={{ flex: 1, minWidth: 0 }}>
              {error && (
                <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '64px', color: '#495057' }}>Searching…</div>
              ) : results.length === 0 && q ? (
                <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                  <img src={emptyState} alt="No results" style={{ width: '120px', marginBottom: '16px', opacity: 0.6 }} />
                  <p style={{ color: '#495057', fontSize: '16px' }}>No products found for &ldquo;{q}&rdquo;.</p>
                  <p style={{ color: '#868e96', fontSize: '14px' }}>Try different keywords or browse all products.</p>
                  <Link to="/products" style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>Browse all products</Link>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {results.map(product => <ProductCard key={product.id} product={product} />)}
                  </div>
                  <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
