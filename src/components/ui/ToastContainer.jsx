import React, { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';

const ToastContext = createContext(null);

let _nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, variant = 'info', duration = 4000) => {
    const id = _nextId++;
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
    return id;
  }, []);

  const toast = useCallback(
    {
      success: (msg, duration) => addToast(msg, 'success', duration),
      error: (msg, duration) => addToast(msg, 'error', duration),
      info: (msg, duration) => addToast(msg, 'info', duration),
      warning: (msg, duration) => addToast(msg, 'warning', duration),
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast, addToast, dismiss }}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-label="Notifications"
          className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end"
        >
          {toasts.map((t) => (
            <Toast
              key={t.id}
              id={t.id}
              message={t.message}
              variant={t.variant}
              duration={t.duration}
              onDismiss={dismiss}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx.toast;
}

export default ToastProvider;
