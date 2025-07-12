import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    // Ensure message is a string
    const toastMessage = typeof message === 'object' && message.message 
      ? message.message 
      : String(message);
      
    const toastType = typeof message === 'object' && message.type
      ? message.type
      : type;
      
    setToasts(prevToasts => [
      ...prevToasts, 
      { id: Date.now(), message: toastMessage, type: toastType }
    ]);
  };

  const removeToast = (id) => {
 
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, visible: false } : toast
      )
    );
    
    // Then remove it after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  const value = {
    toasts,
    addToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
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

export default ToastContext;