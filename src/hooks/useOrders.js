import { useState, useEffect, useCallback } from 'react';

async function fetchOrders(params = {}) {
  const token = localStorage.getItem('token');
  const url = new URL('/orders', window.location.origin);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

async function fetchOrder(orderId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/orders/${orderId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
}

export function useOrders(params = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const loadOrders = useCallback(async (queryParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders(queryParams);
      setOrders(data.data || data.orders || data || []);
      if (data.meta) setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadOrders(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { orders, loading, error, meta, reload: loadOrders };
}

export function useOrderDetail(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrder = useCallback(async (id) => {
    const targetId = id || orderId;
    if (!targetId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrder(targetId);
      setOrder(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) loadOrder(orderId);
  }, [orderId, loadOrder]);

  return { order, loading, error, reload: loadOrder };
}
