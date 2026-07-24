import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import starIcon from '@/assets/icons/star.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import cartIcon from '@/assets/icons/cart.svg';
import minusIcon from '@/assets/icons/minus.svg';
import plusIcon from '@/assets/icons/plus.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function fetchProduct(slug) {
  const res = await fetch(`${API_BASE}/products/${slug}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

async function fetchProductSkus(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/skus`, { credentials: 'include' });
  if (!res.ok) return { data: [] };
  return res.json();
}

async function fetchProductImages(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/images`, { credentials: 'include' });
  if (!res.ok) return { data: [] };
  return res.json();
}

async function addToCart(cartId, payload) {
  const res = await fetch(`${API_BASE}/carts/${cartId}/items`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to add to cart');
  }
  return res.json();
}

async function getOrCreateCart() {
  let cartId = localStorage.getItem('cartId');
  if (cartId) {
    const res = await fetch(`${API_BASE}/carts/${cartId}`, { credentials: 'include' });
    if (res.ok) return cartId;
  }
  const res = await fetch(`${API_BASE}/carts`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (res.ok) {
    const data = await res.json();
    cartId = data.id || data.cartId || data.data?.id;
    if (cartId) localStorage.setItem('cartId', cartId);
    return cartId;
  }
  return null;
}

function Badge({ children, color = '#4c6ef5', bg = '#e8ecfd' }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '3px',
      fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      color, backgroundColor: bg,
    }}>
      {children}
    </span>
  );
}

function StarRating({ rating, count }) {
  const filled = Math.round(rating || 0);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <img
          key={i} src={starIcon} alt=""
          style={{ width: '16px', height: '16px', opacity: i < filled ? 1 : 0.25, filter: i < filled ? 'invert(60%) sepia(80%) saturate(500%) hue-rotate(20deg)' : 'none' }}
        />
      ))}
      {count != null && <span style={{ fontSize: '14px', color: '#495057', marginLeft: '4px' }}>({count})</span>}
    </div>
  );
}

function ImageGallery({ images, productName }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const all = images.length > 0 ? images : [{ url: placeholderProduct, alt: productName }];
  const current = all[activeIdx];

  const prev = () => setActiveIdx(i => (i - 1 + all.length) % all.length);
  const next = () => setActiveIdx(i => (i + 1) % all.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative', aspectRatio: '1/1', backgroundColor: '#f8f9fa', borderRadius: '10px', overflow: 'hidden', border: '1px solid #868e96' }}>
        <img
          src={current.url || placeholderProduct}
          alt={current.alt || productName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.currentTarget.src = placeholderProduct; }}
        />
        {all.length > 1 && (
          <>
            <button
              onClick={prev} aria-label="Previous image"
              style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)', border: '1px solid #868e96', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <img src={chevronLeft} alt="" style={{ width: '16px' }} />
            </button>
            <button
              onClick={next} aria-label="Next image"
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)', border: '1px solid #868e96', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <img src={chevronRight} alt="" style={{ width: '16px' }} />
            </button>
          </>
        )}
      </div>
      {all.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {all.map((img, i) => (
            <button
              key={i} onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIdx}
              style={{
                flexShrink: 0, width: '72px', height: '72px', border: '2px solid',
                borderColor: i === activeIdx ? '#4c6ef5' : '#868e96',
                borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none',
              }}
            >
              <img src={img.url || placeholderProduct} alt={img.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantPicker({ skus, selectedSkuId, onSelect }) {
  if (!skus || skus.length === 0) return null;

  const allAttrKeys = [...new Set(skus.flatMap(s => Object.keys(s.attributes || {})))];

  if (allAttrKeys.length === 0) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', color: '#495057', marginBottom: '8px', fontWeight: 600 }}>Option</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {skus.map(sku => (
            <button
              key={sku.id}
              onClick={() => onSelect(sku.id)}
              aria-pressed={sku.id === selectedSkuId}
              disabled={sku.stock === 0}
              style={{
                padding: '8px 16px', borderRadius: '6px', border: '1px solid',
                borderColor: sku.id === selectedSkuId ? '#4c6ef5' : '#868e96',
                background: sku.id === selectedSkuId ? '#e8ecfd' : '#ffffff',
                color: sku.stock === 0 ? '#adb5bd' : '#212529',
                cursor: sku.stock === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: 500, minHeight: '44px',
                textDecoration: sku.stock === 0 ? 'line-through' : 'none',
              }}
            >
              {sku.name || `Option ${sku.id}`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {allAttrKeys.map(attrKey => {
        const attrValues = [...new Set(skus.map(s => s.attributes?.[attrKey]).filter(Boolean))];
        const selectedSku = skus.find(s => s.id === selectedSkuId);
        const currentAttrValue = selectedSku?.attributes?.[attrKey];
        return (
          <div key={attrKey}>
            <p style={{ fontSize: '14px', color: '#212529', marginBottom: '8px', fontWeight: 600 }}>
              {attrKey.charAt(0).toUpperCase() + attrKey.slice(1)}
              {currentAttrValue && <span style={{ fontWeight: 400, color: '#495057', marginLeft: '8px' }}>{currentAttrValue}</span>}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {attrValues.map(val => {
                const matchingSku = skus.find(s => s.attributes?.[attrKey] === val);
                const isSelected = currentAttrValue === val;
                const isOos = matchingSku?.stock === 0;
                return (
                  <button
                    key={val}
                    onClick={() => matchingSku && onSelect(matchingSku.id)}
                    aria-pressed={isSelected}
                    disabled={!matchingSku || isOos}
                    style={{
                      padding: '8px 16px', borderRadius: '6px', border: '1px solid',
                      borderColor: isSelected ? '#4c6ef5' : '#868e96',
                      background: isSelected ? '#e8ecfd' : '#ffffff',
                      color: isOos ? '#adb5bd' : '#212529',
                      cursor: isOos || !matchingSku ? 'not-allowed' : 'pointer',
                      fontSize: '14px', fontWeight: 500, minHeight: '44px',
                      textDecoration: isOos ? 'line-through' : 'none',
                    }}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuantityPicker({ quantity, onChange, max }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #868e96', borderRadius: '6px', overflow: 'hidden', width: 'fit-content' }}>
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        style={{
          width: '44px', height: '44px', border: 'none', background: '#f8f9fa',
          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
          color: quantity <= 1 ? '#adb5bd' : '#212529',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <img src={minusIcon} alt="" style={{ width: '16px' }} />
      </button>
      <span style={{
        minWidth: '48px', textAlign: 'center', fontSize: '16px', fontWeight: 600,
        color: '#212529', padding: '0 8px', lineHeight: '44px',
      }}>
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max || 99, quantity + 1))}
        disabled={max != null && quantity >= max}
        aria-label="Increase quantity"
        style={{
          width: '44px', height: '44px', border: 'none', background: '#f8f9fa',
          cursor: (max != null && quantity >= max) ? 'not-allowed' : 'pointer',
          color: (max != null && quantity >= max) ? '#adb5bd' : '#212529',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <img src={plusIcon} alt="" style={{ width: '16px' }} />
      </button>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [skus, setSkus] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkuId, setSelectedSkuId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProduct(slug)
      .then(async data => {
        const prod = data.data || data;
        setProduct(prod);
        const [skuData, imageData] = await Promise.all([
          fetchProductSkus(prod.id),
          fetchProductImages(prod.id),
        ]);
        const skuList = skuData.data || skuData.skus || [];
        const imageList = imageData.data || imageData.images || prod.images || [];
        setSkus(skuList);
        setImages(imageList);
        if (skuList.length > 0) setSelectedSkuId(skuList[0].id);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const selectedSku = skus.find(s => s.id === selectedSkuId) || null;
  const displayPrice = selectedSku?.price ?? product?.price;
  const stock = selectedSku?.stock ?? product?.stock;
  const isInStock = stock == null || stock > 0;

  const handleAddToCart = useCallback(async () => {
    if (!isInStock) return;
    setAddingToCart(true);
    setCartError(null);
    setCartSuccess(false);
    try {
      const cartId = await getOrCreateCart();
      if (!cartId) throw new Error('Could not create cart');
      await addToCart(cartId, {
        productId: product.id,
        skuId: selectedSkuId,
        quantity,
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setCartError(err.message);
    } finally {
      setAddingToCart(false);
    }
  }, [product, selectedSkuId, quantity, isInStock]);

  const tabStyle = (tab) => ({
    padding: '12px 20px',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? '#4c6ef5' : 'transparent'}`,
    background: 'none',
    cursor: 'pointer',
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? '#4c6ef5' : '#495057',
    fontSize: '14px',
    minHeight: '44px',
  });

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <span style={{ color: '#495057', fontSize: '16px' }}>Loading product…</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <p style={{ color: '#f03e3e', fontSize: '16px', marginBottom: '16px' }}>{error || 'Product not found'}</p>
          <Link to="/products" style={{ color: '#4c6ef5', fontWeight: 600, textDecoration: 'none' }}>Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '20px', fontSize: '14px', color: '#495057', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#4c6ef5', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: '#4c6ef5', textDecoration: 'none' }}>Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/categories/${product.category.slug}/products`} style={{ color: '#4c6ef5', textDecoration: 'none' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: '#212529' }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'flex-start' }}>
          <ImageGallery images={images} productName={product.name} />

          <div>
            {product.brand?.name && (
              <Link
                to={`/brands/${product.brand.slug || product.brand.id}`}
                style={{ fontSize: '14px', color: '#4c6ef5', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}
              >
                {product.brand.name}
              </Link>
            )}

            <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#212529', marginBottom: '12px', lineHeight: '40px' }}>
              {product.name}
            </h1>

            {product.rating != null && (
              <div style={{ marginBottom: '12px' }}>
                <StarRating rating={product.rating} count={product.reviewCount} />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              {displayPrice != null ? (
                <>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: '#212529', letterSpacing: '-0.02em' }}>
                    ₹{Number(displayPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '14px', color: '#495057', marginLeft: '8px' }}>incl. tax</span>
                </>
              ) : (
                <span style={{ fontSize: '16px', color: '#868e96' }}>Price unavailable</span>
              )}
            </div>

            {isInStock ? (
              <Badge color="#37b24d" bg="#d3f9d8">In Stock</Badge>
            ) : (
              <Badge color="#f03e3e" bg="#ffe3e3">Out of Stock</Badge>
            )}

            {skus.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <VariantPicker
                  skus={skus}
                  selectedSkuId={selectedSkuId}
                  onSelect={setSelectedSkuId}
                />
              </div>
            )}

            {isInStock && (
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#212529', marginBottom: '8px' }}>Quantity</p>
                <QuantityPicker quantity={quantity} onChange={setQuantity} max={stock || undefined} />
              </div>
            )}

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartSuccess && (
                <div style={{ backgroundColor: '#d3f9d8', color: '#37b24d', padding: '12px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500 }}>
                  Added to cart successfully!
                </div>
              )}
              {cartError && (
                <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', padding: '12px 16px', borderRadius: '6px', fontSize: '14px' }}>
                  {cartError}
                </div>
              )}
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || addingToCart}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px 24px', backgroundColor: !isInStock ? '#e9ecef' : '#4c6ef5',
                  color: !isInStock ? '#adb5bd' : '#ffffff',
                  border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600,
                  cursor: !isInStock || addingToCart ? 'not-allowed' : 'pointer',
                  minHeight: '44px', transition: 'background-color 0.15s',
                  opacity: addingToCart ? 0.8 : 1,
                }}
              >
                <img src={cartIcon} alt="" style={{ width: '20px', filter: !isInStock ? 'opacity(0.4)' : 'invert(1)' }} />
                {addingToCart ? 'Adding…' : isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              {isInStock && (
                <button
                  onClick={async () => { await handleAddToCart(); navigate('/cart'); }}
                  disabled={addingToCart}
                  style={{
                    padding: '14px 24px', backgroundColor: '#ffffff', color: '#4c6ef5',
                    border: '2px solid #4c6ef5', borderRadius: '10px', fontSize: '16px', fontWeight: 600,
                    cursor: addingToCart ? 'not-allowed' : 'pointer', minHeight: '44px',
                  }}
                >
                  Buy Now
                </button>
              )}
            </div>

            {selectedSku?.sku && (
              <p style={{ marginTop: '16px', fontSize: '12px', color: '#868e96' }}>
                SKU: <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", color: '#495057' }}>{selectedSku.sku}</span>
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '48px', borderTop: '1px solid #868e96' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #868e96' }} role="tablist">
            {[{ key: 'description', label: 'Description' }, { key: 'specifications', label: 'Specifications' }, { key: 'shipping', label: 'Shipping' }].map(tab => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`tabpanel-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                style={tabStyle(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div id="tabpanel-description" role="tabpanel" hidden={activeTab !== 'description'} style={{ padding: '24px 0', maxWidth: '72ch' }}>
            {product.description ? (
              <p style={{ fontSize: '16px', lineHeight: '1.625', color: '#343a40' }}>{product.description}</p>
            ) : (
              <p style={{ color: '#868e96', fontSize: '14px' }}>No description available.</p>
            )}
          </div>

          <div id="tabpanel-specifications" role="tabpanel" hidden={activeTab !== 'specifications'} style={{ padding: '24px 0' }}>
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #868e96' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: '#212529', width: '40%', verticalAlign: 'top' }}>{key}</td>
                      <td style={{ padding: '12px 0', color: '#343a40' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedSku?.attributes && Object.keys(selectedSku.attributes).length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {Object.entries(selectedSku.attributes).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #868e96' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: '#212529', width: '40%' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                      <td style={{ padding: '12px 0', color: '#343a40' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#868e96', fontSize: '14px' }}>No specifications available.</p>
            )}
          </div>

          <div id="tabpanel-shipping" role="tabpanel" hidden={activeTab !== 'shipping'} style={{ padding: '24px 0', maxWidth: '72ch' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.625', color: '#343a40' }}>
              Standard delivery is available to serviceable pin codes. Enter your pin code at checkout to confirm delivery availability and estimated delivery date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
