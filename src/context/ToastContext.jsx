import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // This effect will handle auto-dismissing toasts
  useEffect(() => {
    if (toasts.length === 0) return;
    
    // Create an array to store all the timeouts
    const timeoutIds = [];

    toasts.forEach(toast => {
      // Only set a timeout if the toast is visible and doesn't already have a timeout
      if (toast.visible && !toast.hasTimeout) {
        const timeoutId = setTimeout(() => {
          // Start dismiss animation
          setToasts(prevToasts => 
            prevToasts.map(t => 
              t.id === toast.id ? { ...t, dismissing: true } : t
            )
          );
          
          // Actually remove the toast after animation completes
          setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(t => t.id !== toast.id));
          }, 300); // Animation duration
        }, toast.duration || 2000); // Default 2 seconds or custom duration
        
        // Mark this toast as having a timeout and store the timeout ID
        setToasts(prevToasts => 
          prevToasts.map(t => 
            t.id === toast.id ? { ...t, hasTimeout: true } : t
          )
        );
        
        timeoutIds.push(timeoutId);
      }
    });

    // Cleanup all timeouts when component unmounts or when toasts change
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [toasts]);

  const addToast = (message, type = 'info', duration = 2000) => {
    const toastMessage = typeof message === 'object' && message.message
      ? message.message
      : String(message);

    const toastType = typeof message === 'object' && message.type
      ? message.type
      : type;

    // Generate a unique ID for this toast
    const id = Date.now();
    
    setToasts(prevToasts => [
      ...prevToasts,
      {
        id,
        message: toastMessage,
        type: toastType,
        visible: true,
        dismissing: false,
        hasTimeout: false,
        duration: duration
      }
    ]);
    
    return id; // Return the ID so it can be used to manually dismiss
  };

  const removeToast = (id) => {
    // Start dismiss animation
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, dismissing: true } : toast
      )
    );

    // Remove from array after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300); // Animation duration
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-md shadow-lg flex items-center justify-between ${
              toast.dismissing ? 'animate-fade-out' : 'animate-fade-in'
            } ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              )}
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
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
