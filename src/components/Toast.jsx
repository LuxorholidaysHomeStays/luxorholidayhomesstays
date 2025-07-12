import React from 'react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 w-full sm:w-auto px-4 sm:px-0 max-w-full">
      {toasts.map((toast) => {
        // Determine icon and color based on toast type
        let iconSvg, bgColor, borderColor, textColor;
        
        switch(toast.type) {
          case 'success':
            iconSvg = (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            );
            bgColor = "bg-green-50";
            borderColor = "border-l-4 border-green-600";
            textColor = "text-green-800";
            break;
            
          case 'error':
            iconSvg = (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            );
            bgColor = "bg-red-50";
            borderColor = "border-l-4 border-red-500";
            textColor = "text-red-800";
            break;
            
          default: // info
            iconSvg = (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            );
            bgColor = "bg-blue-50";
            borderColor = "border-l-4 border-blue-500";
            textColor = "text-blue-800";
        }
        
        return (
          <div
            key={toast.id}
            className={`w-full max-w-[calc(100vw-2rem)] sm:max-w-sm ${bgColor} ${borderColor} rounded-lg shadow-lg pointer-events-auto overflow-hidden transform transition-all duration-300 ease-in-out animate-slide-in-right`}
            style={{
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {iconSvg}
                </div>
                <div className="ml-2 sm:ml-3 flex-1">
                  <p className={`text-xs sm:text-sm font-medium ${textColor} break-words`}>{toast.message}</p>
                </div>
                <div className="ml-2 sm:ml-4 flex-shrink-0 flex">
                  <button
                    className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 transition-colors"
                    onClick={() => removeToast(toast.id)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;