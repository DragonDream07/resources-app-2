import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart';

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : { cartId: null, items: [], promoCode: null, summary: null };
  } catch {
    return { cartId: null, items: [], promoCode: null, summary: null };
  }
}

function saveGuestCart(cart) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadGuestCart());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    saveGuestCart(cart);
  }, [cart]);

  const setCartData = useCallback((newCart) => {
    setCart((prev) => ({ ...prev, ...newCart }));
  }, []);

  const addItem = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.skuId === item.skuId);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.skuId === item.skuId ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { ...prev, items: [...prev.items, item] };
    });
  }, []);

  const updateItem = useCallback((itemId, quantity) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.itemId === itemId ? { ...i, quantity } : i)),
    }));
  }, []);

  const removeItem = useCallback((itemId) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.itemId !== itemId),
    }));
  }, []);

  const applyPromo = useCallback((promoCode, summary) => {
    setCart((prev) => ({ ...prev, promoCode, summary }));
  }, []);

  const clearPromo = useCallback(() => {
    setCart((prev) => ({ ...prev, promoCode: null, summary: null }));
  }, []);

  const mergeGuestCart = useCallback((serverCart) => {
    setCart({
      cartId: serverCart.cartId,
      items: serverCart.items || [],
      promoCode: serverCart.promoCode || null,
      summary: serverCart.summary || null,
    });
    clearGuestCart();
  }, []);

  const clearCart = useCallback(() => {
    const empty = { cartId: null, items: [], promoCode: null, summary: null };
    setCart(empty);
    clearGuestCart();
  }, []);

  const itemCount = cart.items.reduce((acc, i) => acc + (i.quantity || 0), 0);

  const value = {
    cart,
    itemCount,
    loading,
    error,
    setLoading,
    setError,
    setCartData,
    addItem,
    updateItem,
    removeItem,
    applyPromo,
    clearPromo,
    mergeGuestCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

export default CartContext;
