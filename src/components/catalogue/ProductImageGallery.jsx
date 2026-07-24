import React, { useState } from 'react';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const ProductImageGallery = ({ images = [], productName = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedImages =
    images.length > 0 ? images : [{ url: placeholderProduct, altText: productName }];

  const activeImage = resolvedImages[activeIndex];

  const prev = () =>
    setActiveIndex((i) => (i - 1 + resolvedImages.length) % resolvedImages.length);
  const next = () =>
    setActiveIndex((i) => (i + 1) % resolvedImages.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={activeImage.url || placeholderProduct}
          alt={activeImage.altText || productName}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />

        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            >
              <img src={chevronLeftIcon} alt="" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            >
              <img src={chevronRightIcon} alt="" className="w-4 h-4" />
            </button>
          </>
        )}

        {resolvedImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {resolvedImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {resolvedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {resolvedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Select image ${i + 1}`}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                i === activeIndex
                  ? 'border-indigo-600'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={img.url || placeholderProduct}
                alt={img.altText || `${productName} ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = placeholderProduct;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
