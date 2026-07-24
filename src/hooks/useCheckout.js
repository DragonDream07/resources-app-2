import { useState, useCallback } from 'react';

const STEPS = ['address', 'payment', 'review'];

const INITIAL_STATE = {
  step: 'address',
  address: null,
  payment: null,
  review: null,
  orderResult: null,
  loading: false,
  error: null,
};

async function postCheckoutAddress(payload) {
  const token = localStorage.getItem('token');
  const res = await fetch('/checkout/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save checkout address');
  return res.json();
}

async function fetchCheckoutReview() {
  const token = localStorage.getItem('token');
  const res = await fetch('/checkout/review', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch checkout review');
  return res.json();
}

async function postPlaceOrder(payload) {
  const token = localStorage.getItem('token');
  const res = await fetch('/checkout/place-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
}

export function useCheckout() {
  const [state, setState] = useState(INITIAL_STATE);

  const setStep = useCallback((step) => {
    if (STEPS.includes(step)) {
      setState((prev) => ({ ...prev, step }));
    }
  }, []);

  const goToNextStep = useCallback(() => {
    setState((prev) => {
      const idx = STEPS.indexOf(prev.step);
      const next = STEPS[Math.min(idx + 1, STEPS.length - 1)];
      return { ...prev, step: next };
    });
  }, []);

  const goToPrevStep = useCallback(() => {
    setState((prev) => {
      const idx = STEPS.indexOf(prev.step);
      const prev2 = STEPS[Math.max(idx - 1, 0)];
      return { ...prev, step: prev2 };
    });
  }, []);

  const submitAddress = useCallback(async (addressData) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await postCheckoutAddress(addressData);
      setState((prev) => ({
        ...prev,
        address: result,
        step: 'payment',
        loading: false,
      }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message, loading: false }));
      throw err;
    }
  }, []);

  const submitPayment = useCallback((paymentData) => {
    setState((prev) => ({
      ...prev,
      payment: paymentData,
      step: 'review',
    }));
  }, []);

  const loadReview = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchCheckoutReview();
      setState((prev) => ({ ...prev, review: data, loading: false }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message, loading: false }));
      throw err;
    }
  }, []);

  const placeOrder = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const payload = {
        addressId: state.address?.id || state.address,
        payment: state.payment,
      };
      const result = await postPlaceOrder(payload);
      setState((prev) => ({
        ...prev,
        orderResult: result,
        loading: false,
      }));
      return result;
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message, loading: false }));
      throw err;
    }
  }, [state.address, state.payment]);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    step: state.step,
    steps: STEPS,
    address: state.address,
    payment: state.payment,
    review: state.review,
    orderResult: state.orderResult,
    loading: state.loading,
    error: state.error,
    setStep,
    goToNextStep,
    goToPrevStep,
    submitAddress,
    submitPayment,
    loadReview,
    placeOrder,
    reset,
  };
}
