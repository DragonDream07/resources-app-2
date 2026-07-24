import React from 'react';
import { Link } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';
import starIcon from '@/assets/icons/star.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const RatingBadge = ({ rating, reviewCount }) => {
  if (rating == null) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
      <img src={starIcon} alt="star" className="w-3 h-3 brightness-0 invert" />
      <span>{Number(rating).toFixed(1)}</span>
      {reviewCount != null && (
        <span className="text-green-100 font-normal">({reviewCount})</span>
      )}
    </span>
  );
};

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    productId,
    name,
    slug,
    price,
    originalPrice,
    taxInclusivePrice,
    images,
    imageUrl,
    rating,
    reviewCount,
    brand,
  } = product;

  const resolvedId = id || productId;
  const resolvedSlug = slug || resolvedId;
  const resolvedPrice = taxInclusivePrice ?? price;
  const primaryImage =
    (images && images[0]?.url) || imageUrl || placeholderProduct;

  return (
    <Link
      to={`/products/${resolvedSlug}`}
      className="group flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {originalPrice != null && originalPrice > resolvedPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            SALE
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3 flex-1">
        {brand && (
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">
            {brand}
          </span>
        )}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {name}
        </h3>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 flex-wrap">
          <PriceDisplay
            price={resolvedPrice}
            originalPrice={originalPrice}
            size="sm"
          />
          <RatingBadge rating={rating} reviewCount={reviewCount} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
