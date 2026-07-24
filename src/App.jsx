import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ─── Auth Context ────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = useCallback((userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const value = { user, token, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Cart Context ────────────────────────────────────────────────────────────
export const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => localStorage.getItem('cartId') || null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cart, setCart] = useState(null);

  const updateCart = useCallback((cartData) => {
    setCart(cartData);
    if (cartData?.id) {
      setCartId(cartData.id);
      localStorage.setItem('cartId', cartData.id);
    }
    const count = cartData?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    setCartItemCount(count);
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    setCartId(null);
    setCartItemCount(0);
    localStorage.removeItem('cartId');
  }, []);

  const value = { cartId, cart, cartItemCount, updateCart, clearCart, setCartId };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Notifications Context ───────────────────────────────────────────────────
export const NotificationsContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationsContext);
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const markRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const setAllNotifications = useCallback((list) => {
    setNotifications(list);
    setUnreadCount(list.filter((n) => !n.read).length);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    markRead,
    setAllNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <Routes>
              <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>} />
            </Routes>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
