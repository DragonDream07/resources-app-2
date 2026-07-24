import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  const { addToast, removeToast } = context;

  const toast = (message, options = {}) => {
    const { type = 'info', duration = 4000, title } = options;
    addToast({ message, type, duration, title });
  };

  const success = (message, options = {}) =>
    toast(message, { ...options, type: 'success' });

  const error = (message, options = {}) =>
    toast(message, { ...options, type: 'error' });

  const warning = (message, options = {}) =>
    toast(message, { ...options, type: 'warning' });

  const info = (message, options = {}) =>
    toast(message, { ...options, type: 'info' });

  return { toast, success, error, warning, info, removeToast };
}
