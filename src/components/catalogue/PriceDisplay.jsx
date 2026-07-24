import React from 'react';

const SIZE_CLASSES = {
  sm: {
    current: 'text-sm font-bold',
    original: 'text-xs',
    badge: 'text-xs px-1.5 py-0.5',
  },
  md: {
    current: 'text-xl font-bold',
    original: 'text-sm',
    badge: 'text-xs px-2 py-0.5',
  },
  lg: {
    current: 'text-2xl font-bold',
    original: 'text-base',
    badge: 'text-sm px-2 py-1',
  },
};

const formatPrice = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const computeDiscount = (original, current) => {
  if (!original || !current || original <= current) return null;
  return Math.round(((original - current) / original) * 100);
};

const PriceDisplay = ({
  price,
  originalPrice,
  size = 'md',
  showTaxLabel = true,
  className = '',
}) => {
  const sizes = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const discountPct = computeDiscount(originalPrice, price);
  const hasDiscount = discountPct != null && discountPct > 0;

  return (
    <div className={`flex flex-wrap items-baseline gap-1.5 ${className}`}>
      <span className={`${sizes.current} text-gray-900`}>
        {formatPrice(price)}
      </span>

      {hasDiscount && (
        <span
          className={`${sizes.original} text-gray-400 line-through`}
          aria-label={`Original price ${formatPrice(originalPrice)}`}
        >
          {formatPrice(originalPrice)}
        </span>
      )}

      {hasDiscount && (
        <span
          className={`${sizes.badge} bg-green-100 text-green-700 font-semibold rounded`}
        >
          {discountPct}% off
        </span>
      )}

      {showTaxLabel && price != null && (
        <span className="text-xs text-gray-400 self-end">(incl. tax)</span>
      )}
    </div>
  );
};

export default PriceDisplay;
