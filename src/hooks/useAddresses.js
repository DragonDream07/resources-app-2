import { useState, useEffect, useCallback } from 'react';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchAddresses() {
  const res = await fetch('/users/me/addresses', { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return res.json();
}

async function fetchAddress(addressId) {
  const res = await fetch(`/users/me/addresses/${addressId}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch address');
  return res.json();
}

async function createAddress(payload) {
  const res = await fetch('/users/me/addresses', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create address');
  return res.json();
}

async function updateAddress(addressId, payload) {
  const res = await fetch(`/users/me/addresses/${addressId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update address');
  return res.json();
}

async function deleteAddress(addressId) {
  const res = await fetch(`/users/me/addresses/${addressId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res.json();
}

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAddresses();
      setAddresses(data.data || data.addresses || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const getAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAddress(addressId);
      return data.data || data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createAddress(payload);
      const newAddress = data.data || data;
      setAddresses((prev) => [...prev, newAddress]);
      return newAddress;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editAddress = useCallback(async (addressId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateAddress(addressId, payload);
      const updated = data.data || data;
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? updated : a))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addresses,
    loading,
    error,
    reload: loadAddresses,
    getAddress,
    addAddress,
    editAddress,
    removeAddress,
  };
}
