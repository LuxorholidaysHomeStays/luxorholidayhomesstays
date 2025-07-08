// "use client"

// import { useState, useEffect } from "react"
// import { ChevronLeft, ChevronRight, X } from "lucide-react"
// import { getPriceForDate, formatPrice } from "../../data/villa-pricing"

// export default function UnifiedCalendar({
//   isVisible,
//   onClose,
//   checkInDate,
//   checkOutDate,
//   onDateSelect,
//   villa,
// }) {
//   const [currentMonth, setCurrentMonth] = useState(new Date())
//   const [selectionMode, setSelectionMode] = useState("checkin")
//   const [tempCheckIn, setTempCheckIn] = useState(checkInDate)
//   const [tempCheckOut, setTempCheckOut] = useState(checkOutDate)

//   useEffect(() => {
//     if (checkInDate && !checkOutDate) {
//       setSelectionMode("checkout")
//     } else {
//       setSelectionMode("checkin")
//     }
//   }, [checkInDate, checkOutDate])

//   const formatDateToYYYYMMDD = (date) => {
//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, "0")
//     const day = String(date.getDate()).padStart(2, "0")
//     return `${year}-${month}-${day}`
//   }

//   const handleDateClick = (date) => {
//     const dateStr = formatDateToYYYYMMDD(date)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     if (date < today) return

//     if (selectionMode === "checkin") {
//       setTempCheckIn(dateStr)
//       setTempCheckOut("")
//       setSelectionMode("checkout")
//     } else {
//       if (tempCheckIn && dateStr <= tempCheckIn) {
//         setTempCheckOut(tempCheckIn)
//         setTempCheckIn(dateStr)
//       } else {
//         setTempCheckOut(dateStr)
//       }

//       setTimeout(() => {
//         const finalCheckIn = dateStr <= tempCheckIn ? dateStr : tempCheckIn
//         const finalCheckOut = dateStr <= tempCheckIn ? tempCheckIn : dateStr
//         onDateSelect(finalCheckIn, finalCheckOut)
//         onClose()
//       }, 300)
//     }
//   }

//   const navigateMonth = (direction) => {
//     const newDate = new Date(currentMonth)
//     newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
//     setCurrentMonth(newDate)
//   }

//   const renderCalendar = (monthOffset = 0) => {
//     const displayMonth = new Date(currentMonth)
//     displayMonth.setMonth(displayMonth.getMonth() + monthOffset)

//     const year = displayMonth.getFullYear()
//     const month = displayMonth.getMonth()
//     const firstDay = new Date(year, month, 1)
//     const startDate = new Date(firstDay)
//     startDate.setDate(startDate.getDate() - firstDay.getDay())

//     const days = []
//     for (let i = 0; i < 42; i++) {
//       const currentDate = new Date(startDate)
//       currentDate.setDate(startDate.getDate() + i)
//       days.push(currentDate)
//     }

//     return (
//       <div className="flex-1">
//         <div className="text-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">
//             {displayMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
//           </h3>
//         </div>

//         <div className="grid grid-cols-7 gap-1 mb-2">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//             <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-1">
//           {days.map((date, index) => {
//             const today = new Date()
//             today.setHours(0, 0, 0, 0)
//             const isCurrentMonth = date.getMonth() === month
//             const isToday = date.toDateString() === today.toDateString()
//             const isPast = date < today && !isToday
//             const dateStr = formatDateToYYYYMMDD(date)
//             const isCheckIn = tempCheckIn === dateStr
//             const isCheckOut = tempCheckOut === dateStr
//             const isInRange = tempCheckIn && tempCheckOut && dateStr >= tempCheckIn && dateStr <= tempCheckOut

//             let price = 15000
//             try {
//               price = getPriceForDate(date, villa?.name || "")
//             } catch (error) {
//               console.warn("Error getting price for date:", error)
//             }

//             return (
//               <div
//                 key={index}
//                 className={`
//                   relative flex flex-col items-center justify-center rounded-xl cursor-pointer 
//                   min-h-[60px] transition-all duration-200 select-none border-2
//                   ${!isCurrentMonth ? "opacity-40" : ""}
//                   ${
//                     isPast
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
//                       : isCheckIn
//                         ? "bg-blue-600 text-white font-bold border-blue-700 shadow-lg scale-105"
//                         : isCheckOut
//                           ? "bg-emerald-600 text-white font-bold border-emerald-700 shadow-lg scale-105"
//                           : isInRange
//                             ? "bg-blue-50 text-blue-800 border-blue-200"
//                             : isToday
//                               ? "bg-gray-50 text-gray-900 font-semibold border-gray-300"
//                               : "hover:bg-gray-50 hover:border-gray-300 border-transparent hover:scale-105"
//                   }
//                 `}
//                 onClick={() => handleDateClick(date)}
//               >
//                 <div className="text-sm font-medium">{date.getDate()}</div>
//                 {isCurrentMonth && !isPast && (
//                   <div className={`text-xs mt-1 ${isCheckIn || isCheckOut ? "text-white" : "text-gray-600"}`}>
//                     {formatPrice(price)}
//                   </div>
//                 )}
//                 {isToday && !isCheckIn && !isCheckOut && (
//                   <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-blue-500" />
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   // Add body scroll lock when calendar is open
//   useEffect(() => {
//     if (isVisible) {
//       document.body.style.overflow = 'hidden';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isVisible]);
  
//   if (!isVisible) return null

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
//       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-[10000]">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Select your dates</h2>
//             <p className="text-gray-600 mt-1">
//               {selectionMode === "checkin"
//                 ? "Choose your check-in date"
//                 : tempCheckIn
//                   ? `Check-in: ${new Date(tempCheckIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • Now select check-out`
//                   : "Choose your check-out date"}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
//           >
//             <X className="h-5 w-5 text-gray-600" />
//           </button>
//         </div>

//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <button
//             onClick={() => navigateMonth("prev")}
//             className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
//           >
//             <ChevronLeft className="h-5 w-5 text-gray-600" />
//           </button>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 text-sm">
//               <div className="w-4 h-4 bg-blue-600 rounded" />
//               <span>Check-in</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <div className="w-4 h-4 bg-emerald-600 rounded" />
//               <span>Check-out</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded" />
//               <span>Selected range</span>
//             </div>
//           </div>

//           <button
//             onClick={() => navigateMonth("next")}
//             className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
//           >
//             <ChevronRight className="h-5 w-5 text-gray-600" />
//           </button>
//         </div>

//         <div className="p-6 overflow-y-auto max-h-[60vh]">
//           <div className="flex gap-8">
//             {renderCalendar(0)}
//             <div className="hidden lg:block">{renderCalendar(1)}</div>
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-600">
//               {tempCheckIn && tempCheckOut && (
//                 <span>
//                   {new Date(tempCheckIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -
//                   {" "}
//                   {new Date(tempCheckOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//                 </span>
//               )}
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setTempCheckIn("")
//                   setTempCheckOut("")
//                   setSelectionMode("checkin")
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
//               >
//                 Clear dates
//               </button>
//               <button
//                 onClick={onClose}
//                 className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { getPriceForDate, formatPrice } from "../../data/villa-pricing.jsx"

export default function UnifiedCalendar({ isVisible, onClose, checkInDate, checkOutDate, onDateSelect, villa, blockedDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectionMode, setSelectionMode] = useState("checkin")
  const [tempCheckIn, setTempCheckIn] = useState(checkInDate)
  const [tempCheckOut, setTempCheckOut] = useState(checkOutDate)

  useEffect(() => {
    if (checkInDate && !checkOutDate) {
      setSelectionMode("checkout")
    } else {
      setSelectionMode("checkin")
    }
  }, [checkInDate, checkOutDate])

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Helper function to check if a date is blocked
  const isDateBlocked = (date) => {
    const dateStr = formatDateToYYYYMMDD(date)
    return blockedDates.some((blockedRange) => {
      const checkIn = new Date(blockedRange.checkIn)
      const checkOut = new Date(blockedRange.checkOut)
      const currentDate = new Date(date)
      
      // Check if the date falls within any blocked range (inclusive)
      return currentDate >= checkIn && currentDate <= checkOut
    })
  }

  // Helper function to check if a date range overlaps with any blocked dates
  const doesRangeOverlapBlocked = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return blockedDates.some((blockedRange) => {
      const blockedStart = new Date(blockedRange.checkIn)
      const blockedEnd = new Date(blockedRange.checkOut)
      
      // Check if any part of the range overlaps with blocked dates
      return (start <= blockedEnd && end >= blockedStart)
    })
  }

  const handleDateClick = (date) => {
    const dateStr = formatDateToYYYYMMDD(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Prevent selection of past dates or blocked dates
    if (date < today || isDateBlocked(date)) return

    if (selectionMode === "checkin") {
      setTempCheckIn(dateStr)
      setTempCheckOut("")
      setSelectionMode("checkout")
    } else {
      if (tempCheckIn && dateStr <= tempCheckIn) {
        setTempCheckOut(tempCheckIn)
        setTempCheckIn(dateStr)
      } else {
        setTempCheckOut(dateStr)
      }

      // Check if the selected range overlaps with any blocked dates
      const finalCheckIn = dateStr <= tempCheckIn ? dateStr : tempCheckIn
      const finalCheckOut = dateStr <= tempCheckIn ? tempCheckIn : dateStr
      
      if (doesRangeOverlapBlocked(finalCheckIn, finalCheckOut)) {
        // Reset selection if range overlaps with blocked dates
        setTempCheckIn("")
        setTempCheckOut("")
        setSelectionMode("checkin")
        return
      }

      setTimeout(() => {
        onDateSelect(finalCheckIn, finalCheckOut)
        onClose()
      }, 300)
    }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentMonth(newDate)
  }

  const renderCalendar = (monthOffset = 0) => {
    const displayMonth = new Date(currentMonth)
    displayMonth.setMonth(displayMonth.getMonth() + monthOffset)

    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      days.push(currentDate)
    }

    return (
      <div className="flex-1">
        <div className="text-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {displayMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const isCurrentMonth = date.getMonth() === month
            const isToday = date.toDateString() === today.toDateString()
            const isPast = date < today && !isToday
            const isBlocked = isDateBlocked(date)
            const dateStr = formatDateToYYYYMMDD(date)
            const isCheckIn = tempCheckIn === dateStr
            const isCheckOut = tempCheckOut === dateStr
            const isInRange = tempCheckIn && tempCheckOut && dateStr >= tempCheckIn && dateStr <= tempCheckOut

            let price = 15000
            try {
              price = getPriceForDate(date, villa?.name || "")
            } catch (error) {
              console.warn("Error getting price for date:", error)
            }

            return (
              <div
                key={index}
                className={`
                  relative flex flex-col items-center justify-center rounded-lg cursor-pointer 
                  min-h-[50px] transition-all duration-200 select-none border-2
                  ${!isCurrentMonth ? "opacity-40" : ""}
                  ${
                    isPast || isBlocked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent opacity-60"
                      : isCheckIn
                        ? "bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white font-bold border-[#D4AF37] shadow-lg scale-105"
                        : isCheckOut
                          ? "bg-gradient-to-r from-[#BFA181] to-[#D4AF37] text-white font-bold border-[#BFA181] shadow-lg scale-105"
                          : isInRange
                            ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#BFA181]/20 text-[#D4AF37] border-[#D4AF37]/30"
                            : isToday
                              ? "bg-gray-50 text-gray-900 font-semibold border-gray-300"
                              : "hover:bg-gray-50 hover:border-gray-300 border-transparent hover:scale-105"
                  }
                `}
                onClick={() => handleDateClick(date)}
              >
                <div className="text-sm font-medium">{date.getDate()}</div>
                {isCurrentMonth && !isPast && !isBlocked && (
                  <div className={`text-xs mt-1 ${isCheckIn || isCheckOut ? "text-white" : "text-gray-600"}`}>
                    {formatPrice(price)}
                  </div>
                )}
                {isBlocked && isCurrentMonth && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                    <div className="w-6 h-0.5 bg-red-500 -rotate-45 absolute"></div>
                  </div>
                )}
                {isToday && !isCheckIn && !isCheckOut && !isBlocked && (
                  <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-[10000]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#D4AF37] to-[#BFA181]">
          <div>
            <h2 className="text-xl font-bold text-white">Select your dates</h2>
            <p className="text-white/90 mt-1 text-sm">
              {selectionMode === "checkin"
                ? "Choose your check-in date"
                : tempCheckIn
                  ? `Check-in: ${new Date(tempCheckIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • Now select check-out`
                  : "Choose your check-out date"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={() => navigateMonth("prev")}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded" />
              <span>Check-in</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-gradient-to-r from-[#BFA181] to-[#D4AF37] rounded" />
              <span>Check-out</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#BFA181]/20 border-2 border-[#D4AF37]/30 rounded" />
              <span>Range</span>
            </div>
          </div>

          <button
            onClick={() => navigateMonth("next")}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="flex gap-6">
            {renderCalendar(0)}
            <div className="hidden lg:block">{renderCalendar(1)}</div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {tempCheckIn && tempCheckOut && (
                <span>
                  {new Date(tempCheckIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                  {new Date(tempCheckOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTempCheckIn("")
                  setTempCheckOut("")
                  setSelectionMode("checkin")
                }}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white rounded-lg hover:from-[#BFA181] hover:to-[#D4AF37] transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
