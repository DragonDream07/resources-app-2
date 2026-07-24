import React from 'react';
import ProductCard from './ProductCard';

const SkeletonCard = () => (
  <div className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-pulse">
    <div className="w-full aspect-square bg-gray-200" />
    <div className="p-3 flex flex-col gap-2">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="mt-2 flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-1/5" />
      </div>
    </div>
  </div>
);

const ProductGrid = ({ products = [], loading = false, skeletonCount = 12 }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-lg font-medium">No products found.</span>
        <span className="text-sm mt-1">Try adjusting your filters or search query.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id || product.productId} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
