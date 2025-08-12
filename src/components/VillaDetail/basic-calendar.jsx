"use client"
import { useState, useEffect } from "react"

export default function BasicCalendar({
  isVisible,
  onClose,
  checkInDate,
  checkOutDate,
  onDateSelect,
  villa
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // Simple effect to prevent background scrolling
  useEffect(() => {
    if (isVisible && typeof document !== 'undefined') {
      // Simple approach to prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={() => onClose()}
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Select Dates</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <span className="text-xl">×</span>
          </button>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <p>Villa: {villa?.name}</p>
          <p>Current check-in: {checkInDate || 'Not selected'}</p>
          <p>Current check-out: {checkOutDate || 'Not selected'}</p>
        </div>
        
        <div className="flex justify-between">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              const today = new Date();
              const tomorrow = new Date();
              tomorrow.setDate(today.getDate() + 1);
              
              const formattedToday = today.toISOString().split('T')[0];
              const formattedTomorrow = tomorrow.toISOString().split('T')[0];
              
              onDateSelect(formattedToday, formattedTomorrow);
              onClose();
            }}
          >
            Select Today & Tomorrow
          </button>
          <button 
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
