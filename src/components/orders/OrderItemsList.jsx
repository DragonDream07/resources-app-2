import React from 'react';

function OrderItemsList({ items = [], currency = 'INR' }) {
  const formatPrice = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No items found for this order.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 pr-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Product</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Qty</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Unit Price</th>
            <th className="text-right py-3 pl-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, index) => {
            const {
              id,
              productName,
              skuName,
              variantLabel,
              imageUrl,
              quantity,
              unitPrice,
              totalPrice,
            } = item;

            const displayName = productName || item.name || 'Product';
            const displayVariant = skuName || variantLabel || item.sku || null;
            const lineTotal =
              totalPrice !== undefined
                ? totalPrice
                : unitPrice !== undefined && quantity !== undefined
                ? unitPrice * quantity
                : null;

            return (
              <tr key={id || index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={displayName}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <img
                          src="/src/assets/images/placeholder-product.svg"
                          alt=""
                          className="w-6 h-6 opacity-40"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{displayName}</p>
                      {displayVariant && (
                        <p className="text-xs text-gray-500 mt-0.5">{displayVariant}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-gray-700">{quantity}</td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {unitPrice !== undefined ? formatPrice(unitPrice) : 'N/A'}
                </td>
                <td className="py-3 pl-4 text-right font-semibold text-gray-900">
                  {lineTotal !== null ? formatPrice(lineTotal) : 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
        {items.length > 1 && (
          <tfoot>
            <tr className="border-t border-gray-200">
              <td colSpan={3} className="py-3 pr-4 text-right text-sm font-semibold text-gray-700">
                Order Total
              </td>
              <td className="py-3 pl-4 text-right text-sm font-bold text-gray-900">
                {formatPrice(
                  items.reduce((sum, item) => {
                    const lineTotal =
                      item.totalPrice !== undefined
                        ? item.totalPrice
                        : (item.unitPrice || 0) * (item.quantity || 0);
                    return sum + lineTotal;
                  }, 0)
                )}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default OrderItemsList;
