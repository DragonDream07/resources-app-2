import React from 'react';
import PropTypes from 'prop-types';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

function ShippingBadge({ subtotalAfterDiscount }) {
  const isFree = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD;
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount;

  if (isFree) {
    return (
      <div className="shipping-badge shipping-badge--free" role="status" aria-label="Free shipping applied">
        <span className="shipping-badge__icon" aria-hidden="true">🚚</span>
        <span className="shipping-badge__text">
          You qualify for <strong>Free Shipping</strong>!
        </span>
        <style>{`
          .shipping-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.8125rem;
            margin-top: 0.5rem;
          }
          .shipping-badge--free {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #15803d;
          }
          .shipping-badge--charge {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
          }
          .shipping-badge__icon {
            font-size: 1rem;
            line-height: 1;
          }
          .shipping-badge__text {
            line-height: 1.4;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="shipping-badge shipping-badge--charge" role="status" aria-label="Shipping charge applies">
      <span className="shipping-badge__icon" aria-hidden="true">🚚</span>
      <span className="shipping-badge__text">
        Add{' '}
        <strong>
          ₹{amountNeeded.toFixed(0)}
        </strong>{' '}
        more for <strong>Free Shipping</strong>. A ₹{SHIPPING_CHARGE} shipping fee applies.
      </span>
      <style>{`
        .shipping-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.8125rem;
          margin-top: 0.5rem;
        }
        .shipping-badge--free {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }
        .shipping-badge--charge {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
        }
        .shipping-badge__icon {
          font-size: 1rem;
          line-height: 1;
        }
        .shipping-badge__text {
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}

ShippingBadge.propTypes = {
  subtotalAfterDiscount: PropTypes.number.isRequired,
};

export default ShippingBadge;
