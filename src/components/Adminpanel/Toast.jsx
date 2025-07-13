import React, { useState, useEffect } from "react"
import { useToast } from "../../context/ToastContext"
import { XMarkIcon } from "@heroicons/react/24/outline"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid"

const ToastItem = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(0);
  
  // Handle progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - toast.startTime;
      const newProgress = Math.min((elapsed / 3000) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, 30); 
    
    return () => clearInterval(interval);
  }, [toast.startTime]);
  
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />
      case "error":
        return <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
      case "warning":
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />
    }
  }

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }
  
  const getProgressColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-400"
      case "error":
        return "bg-red-400"
      case "warning":
        return "bg-yellow-400"
      default:
        return "bg-blue-400"
    }
  }

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border overflow-hidden ${getBackgroundColor(
        toast.type
      )}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon(toast.type)}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => onRemove(toast.id)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div 
          className={`h-full ${getProgressColor(toast.type)} transition-all duration-100 ease-linear`}
          style={{ width: `${100 - progress}%` }}
        />
      </div>
    </div>
  )
}

const Toast = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={removeToast} 
        />
      ))}
    </div>
  )
}

export default Toast