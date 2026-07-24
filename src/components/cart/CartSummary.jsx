import React from 'react';

const formatCurrency = (amount) =>
  `₹${Number(amount ?? 0).toFixed(2)}`;

const CartSummary = ({ summary, onProceedToCheckout }) => {
  const {
    subtotal = 0,
    shippingCharge = 0,
    discount = 0,
    gst = 0,
    grandTotal = 0,
  } = summary || {};

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <dl className="cart-summary__breakdown">
        <div className="cart-summary__row">
          <dt className="cart-summary__label">Subtotal</dt>
          <dd className="cart-summary__value">{formatCurrency(subtotal)}</dd>
        </div>

        <div className="cart-summary__row">
          <dt className="cart-summary__label">Shipping</dt>
          <dd className="cart-summary__value">
            {shippingCharge === 0 ? (
              <span className="cart-summary__free">Free</span>
            ) : (
              formatCurrency(shippingCharge)
            )}
          </dd>
        </div>

        {discount > 0 && (
          <div className="cart-summary__row cart-summary__row--discount">
            <dt className="cart-summary__label">Discount</dt>
            <dd className="cart-summary__value cart-summary__value--discount">
              &minus;{formatCurrency(discount)}
            </dd>
          </div>
        )}

        <div className="cart-summary__row">
          <dt className="cart-summary__label">GST</dt>
          <dd className="cart-summary__value">{formatCurrency(gst)}</dd>
        </div>

        <div className="cart-summary__row cart-summary__row--total">
          <dt className="cart-summary__label cart-summary__label--total">Grand Total</dt>
          <dd className="cart-summary__value cart-summary__value--total">
            {formatCurrency(grandTotal)}
          </dd>
        </div>
      </dl>

      {onProceedToCheckout && (
        <button
          type="button"
          className="cart-summary__cta btn btn--primary"
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;
