import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = [];

    toasts.forEach(toast => {
      if (toast.visible && !toast.timer) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, 3000);

        timers.push(timer);

        setToasts(prev =>
          prev.map(t =>
            t.id === toast.id ? { ...t, timer: true } : t
          )
        );
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [toasts]);

  const addToast = (message, type = 'info') => {
    const toastMessage = typeof message === 'object' && message.message
      ? message.message
      : String(message);

    const toastType = typeof message === 'object' && message.type
      ? message.type
      : type;

    setToasts(prevToasts => [
      ...prevToasts,
      {
        id: Date.now(),
        message: toastMessage,
        type: toastType,
        visible: true,
        startTime: Date.now()
      }
    ]);
  };

  const removeToast = (id) => {
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, visible: false } : toast
      )
    );

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

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
