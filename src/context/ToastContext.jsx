import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const ToastContext = createContext(null);

// Default lifetime before a toast auto-dismisses. The provider owns this timing
// so a toast can never linger forever, no matter which Toast renderer is mounted.
const DEFAULT_DURATION = 4000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    // Remove the toast from the array and cancel its pending dismissal timer.
    setToasts(prev => prev.filter(toast => toast.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const addToast = useCallback((message, type = 'info', duration) => {
    const toastMessage = typeof message === 'object' && message.message
      ? message.message
      : String(message);

    const toastType = typeof message === 'object' && message.type
      ? message.type
      : type;

    const rawDuration = duration ?? (typeof message === 'object' ? message.duration : undefined);
    const toastDuration = Number.isFinite(Number(rawDuration)) && Number(rawDuration) > 0
      ? Number(rawDuration)
      : DEFAULT_DURATION;

    // Generate a unique ID for this toast (Date.now() alone collides when two
    // toasts are created in the same millisecond, breaking keys and dismissal).
    const id = `${Date.now()}-${(idRef.current += 1)}`;
    const startTime = Date.now();

    // Create the toast. startTime powers the progress bar in the Toast renderers.
    setToasts(prevToasts => [
      ...prevToasts,
      {
        id,
        message: toastMessage,
        type: toastType,
        startTime,
        duration: toastDuration,
      }
    ]);

    timersRef.current[id] = setTimeout(() => {
      removeToast(id);
    }, toastDuration);

    return id; // Return the ID so it can be used to manually dismiss
  }, [removeToast]);

  // Clear any pending dismissal timers when the provider unmounts.
  useEffect(() => {
    const timers = timersRef.current;
    const handleLegacyToast = (event) => {
      const { message, type, duration } = event.detail || {};
      if (message) addToast(message, type, duration);
    };
    window.addEventListener('luxor:toast', handleLegacyToast);

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
      window.removeEventListener('luxor:toast', handleLegacyToast);
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
