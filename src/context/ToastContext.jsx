import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Add effect to handle toast expiration for each toast individually
  useEffect(() => {
    const timers = [];
    
    toasts.forEach(toast => {
      if (toast.visible && !toast.timer) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, 3000); // 3 seconds timeout
        
        timers.push(timer);
        
        // Update toast to track progress
        setToasts(prev => 
          prev.map(t => 
            t.id === toast.id ? { ...t, timer: true, startTime: Date.now() } : t
          )
        );
      }
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [toasts]);

  const addToast = (message, type = 'info') => {
    // Ensure message is a string
    const toastMessage = typeof message === 'object' && message.message 
      ? message.message 
      : String(message);
      
    const toastType = typeof message === 'object' && message.type
      ? message.type
      : type;
      
    // Add visible property and startTime for progress tracking
    setToasts(prevToasts => [
      ...prevToasts, 
      { 
        id: Date.now(), 
        message: toastMessage, 
        type: toastType, 
        visible: true,
        startTime: Date.now(),
      }
    ]);
  };

  const removeToast = (id) => {
    // Set visible to false to trigger fade-out animation
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