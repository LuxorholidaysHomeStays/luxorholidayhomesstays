import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // We'll let the Toast component handle auto-dismissing
  // This ensures a single point of control for toast dismissal timing

  const addToast = (message, type = 'info') => {
    const toastMessage = typeof message === 'object' && message.message
      ? message.message
      : String(message);

    const toastType = typeof message === 'object' && message.type
      ? message.type
      : type;

    // Generate a unique ID for this toast
    const id = Date.now();
    
    // Create the toast with minimal properties
    setToasts(prevToasts => [
      ...prevToasts,
      {
        id,
        message: toastMessage,
        type: toastType
      }
    ]);
    
    return id; // Return the ID so it can be used to manually dismiss
  };

  const removeToast = (id) => {
    // Simply remove the toast from the array
    setToasts(prev => prev.filter(toast => toast.id !== id));
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
