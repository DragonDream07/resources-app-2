import React from 'react';
import PropTypes from 'prop-types';
import ShippingBadge from './ShippingBadge';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

function fmt(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function OrderSummaryPanel({ items, subtotal, discount, promoCode, promoDiscount, tax }) {
  const shippingFree = subtotal - discount >= FREE_SHIPPING_THRESHOLD;
  const shippingCharge = shippingFree ? 0 : SHIPPING_CHARGE;
  const grandTotal = subtotal - discount - promoDiscount + shippingCharge + (tax || 0);

  return (
    <aside className="order-summary-panel" aria-label="Order summary">
      <h2 className="order-summary-panel__title">Order Summary</h2>

      {items && items.length > 0 && (
        <ul className="order-summary-panel__items">
          {items.map((item) => (
            <li key={item.id || item.skuId} className="order-summary-panel__item">
              <span className="order-summary-panel__item-name">
                {item.name}
                {item.quantity > 1 && (
                  <span className="order-summary-panel__item-qty"> ×{item.quantity}</span>
                )}
              </span>
              <span className="order-summary-panel__item-price">{fmt(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="order-summary-panel__divider" role="separator" />

      <dl className="order-summary-panel__totals">
        <div className="order-summary-panel__row">
          <dt>Subtotal</dt>
          <dd>{fmt(subtotal)}</dd>
        </div>

        {discount > 0 && (
          <div className="order-summary-panel__row order-summary-panel__row--discount">
            <dt>Item Discount</dt>
            <dd>−{fmt(discount)}</dd>
          </div>
        )}

        {promoDiscount > 0 && (
          <div className="order-summary-panel__row order-summary-panel__row--discount">
            <dt>
              Promo
              {promoCode && (
                <span className="order-summary-panel__promo-tag"> ({promoCode})</span>
              )}
            </dt>
            <dd>−{fmt(promoDiscount)}</dd>
          </div>
        )}

        <div className="order-summary-panel__row">
          <dt>Shipping</dt>
          <dd>
            {shippingFree ? (
              <span className="order-summary-panel__free">FREE</span>
            ) : (
              fmt(shippingCharge)
            )}
          </dd>
        </div>

        {tax > 0 && (
          <div className="order-summary-panel__row">
            <dt>Tax</dt>
            <dd>{fmt(tax)}</dd>
          </div>
        )}
      </dl>

      <div className="order-summary-panel__divider" role="separator" />

      <div className="order-summary-panel__grand-total">
        <span>Total</span>
        <span>{fmt(grandTotal)}</span>
      </div>

      <ShippingBadge subtotalAfterDiscount={subtotal - discount} />

      <style>{`
        .order-summary-panel {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.25rem;
          width: 100%;
          box-sizing: border-box;
        }
        .order-summary-panel__title {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem;
        }
        .order-summary-panel__items {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .order-summary-panel__item {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #374151;
        }
        .order-summary-panel__item-name {
          flex: 1;
          padding-right: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .order-summary-panel__item-qty {
          color: #6b7280;
        }
        .order-summary-panel__item-price {
          white-space: nowrap;
          font-weight: 500;
        }
        .order-summary-panel__divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0.75rem 0;
        }
        .order-summary-panel__totals {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0;
        }
        .order-summary-panel__row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #374151;
        }
        .order-summary-panel__row dt {
          font-weight: 400;
        }
        .order-summary-panel__row dd {
          font-weight: 500;
          margin: 0;
        }
        .order-summary-panel__row--discount dt,
        .order-summary-panel__row--discount dd {
          color: #16a34a;
        }
        .order-summary-panel__promo-tag {
          font-size: 0.75rem;
          color: #16a34a;
        }
        .order-summary-panel__free {
          color: #16a34a;
          font-weight: 600;
        }
        .order-summary-panel__grand-total {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </aside>
  );
}

OrderSummaryPanel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      skuId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  subtotal: PropTypes.number.isRequired,
  discount: PropTypes.number,
  promoCode: PropTypes.string,
  promoDiscount: PropTypes.number,
  tax: PropTypes.number,
};

OrderSummaryPanel.defaultProps = {
  items: [],
  discount: 0,
  promoCode: '',
  promoDiscount: 0,
  tax: 0,
};

export default OrderSummaryPanel;
