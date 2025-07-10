"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

// Fix the price formatting function to avoid adding "+" to the price
const formatPrice = (price) => {
  if (!price || isNaN(Number(price))) return "₹0";
  // Format as "₹45k" or "₹65k" - no "+" suffix
  const formattedPrice = Math.round(Number(price) / 1000);
  return `₹${formattedPrice}k`;
};

// Fallback price mapping if backend data isn't available
const villaFallbackPrices = {
  "Amrith Palace": { weekday: 45000, weekend: 65000 },
  "Ram Water Villa": { weekday: 30000, weekend: 45000 },
  "East Coast Villa": { weekday: 15000, weekend: 25000 },
  "Lavish Villa I": { weekday: 18000, weekend: 25000 },
  "Lavish Villa II": { weekday: 18000, weekend: 25000 },
  "Lavish Villa III": { weekday: 16000, weekend: 23000 },
  "Empire Anand Villa Samudra": { weekday: 40000, weekend: 60000 }
};

export default function UnifiedCalendar({ 
  isVisible, 
  onClose, 
  checkInDate, 
  checkOutDate, 
  onDateSelect, 
  villa, 
  blockedDates = [] 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectionMode, setSelectionMode] = useState("checkin")
  const [tempCheckIn, setTempCheckIn] = useState(checkInDate)
  const [tempCheckOut, setTempCheckOut] = useState(checkOutDate)

  // Fix the price calculation in the calendar
  const getPriceForDate = (date) => {
    if (!villa) {
      console.log('No villa data provided to calendar');
      return 0;
    }

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday

    // Debug log to identify the issue
    console.log('Villa data for pricing:', {
      name: villa.name,
      price: villa.price,
      weekendprice: villa.weekendprice,
      weekendPrice: villa.weekendPrice,
      isWeekend: isWeekend,
      day: dayOfWeek
    });

    if (isWeekend) {
      // First try weekendprice (from backend)
      if (villa.weekendprice && villa.weekendprice > 0) {
        return Number(villa.weekendprice);
      } 
      // Then try weekendPrice (camelCase version)
      else if (villa.weekendPrice && villa.weekendPrice > 0) {
        return Number(villa.weekendPrice);
      }
      // Then try fallback prices
      else if (villa.name && villaFallbackPrices[villa.name]) {
        return villaFallbackPrices[villa.name].weekend;
      }
      // Last resort: 1.5x weekday price
      else {
        return Number(villa.price) * 1.5;
      }
    }

    // For weekdays, return the regular price
    return Number(villa.price);
  };

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
    if (!blockedDates || blockedDates.length === 0) return false;

    const dateStr = formatDateToYYYYMMDD(date)
    const currentDate = new Date(date)
    currentDate.setHours(0, 0, 0, 0) // Normalize time part for comparison

    return blockedDates.some((blockedRange) => {
      // Handle potential date format issues
      const checkIn = new Date(blockedRange.checkIn)
      checkIn.setHours(0, 0, 0, 0)
      const checkOut = new Date(blockedRange.checkOut)
      checkOut.setHours(0, 0, 0, 0)

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

            let price = 0
            try {
              price = getPriceForDate(date)
            } catch (error) {
              console.error("Error getting price for date:", error, "Villa:", villa)
              price = 0 // Show 0 if there's an error - makes it obvious there's an issue
            }

            return (
              <div
                key={index}
                className={`
                  relative flex flex-col items-center justify-center rounded-lg cursor-pointer 
                  min-h-[50px] transition-all duration-200 select-none border-2
                  ${!isCurrentMonth ? "opacity-40" : ""}
                  ${isPast
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent opacity-60"
                    : isBlocked
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300 opacity-80"
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
                    <span className={`${(date.getDay() === 0 || date.getDay() === 6) && !isCheckIn && !isCheckOut ? "text-yellow-700 font-medium" : ""}`}>
                      {formatPrice(getPriceForDate(date))}
                    </span>
                    {(date.getDay() === 0 || date.getDay() === 6) && (
                      <span className={`text-[8px] ml-0.5 ${isCheckIn || isCheckOut ? "text-white/80" : "text-yellow-600"} font-semibold`}>
                        ★
                      </span>
                    )}
                  </div>
                )}
                {isBlocked && isCurrentMonth && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-red-500 rotate-45 z-10"></div>
                    <div className="w-6 h-0.5 bg-red-500 -rotate-45 absolute z-10"></div>
                    <div className="absolute inset-0 bg-gray-200 opacity-60 rounded-lg"></div>
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
    if (isVisible && typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.overflow = ""
      }
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

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-1 text-xs mr-1">
              <div className="w-3 h-3 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded" />
              <span>Check-in</span>
            </div>
            <div className="flex items-center gap-1 text-xs mr-1">
              <div className="w-3 h-3 bg-gradient-to-r from-[#BFA181] to-[#D4AF37] rounded" />
              <span>Check-out</span>
            </div>
            <div className="flex items-center gap-1 text-xs mr-1">
              <div className="w-3 h-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#BFA181]/20 border-2 border-[#D4AF37]/30 rounded" />
              <span>Range</span>
            </div>
            <div className="flex items-center gap-1 text-xs mr-1">
              <div className="w-3 h-3 bg-gray-200 rounded relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-red-500 rotate-45"></div>
                  <div className="w-3 h-0.5 bg-red-500 -rotate-45 absolute"></div>
                </div>
              </div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-yellow-700 font-medium text-xs">₹</span>
              <span className="text-[8px] text-yellow-600 font-semibold">★</span>
              <span>Weekend</span>
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
          <div className="flex flex-wrap items-center justify-between">
            <div className="text-sm text-gray-600">
              {tempCheckIn && tempCheckOut && (
                <span>
                  {new Date(tempCheckIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                  {new Date(tempCheckOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>

            {/* Villa pricing info */}
            {villa && (
              <div className="text-xs bg-gray-100 px-3 py-1 rounded-full flex items-center mr-auto ml-2 my-2">
                <span className="text-gray-600 mr-1">Pricing:</span>
                <span className="font-medium text-gray-700 mr-2">Weekday: {formatPrice(villa.price || 0)}</span>
                <span className="font-medium text-yellow-700">Weekend: {formatPrice(villa.weekendprice || villa.weekendPrice || 0)} ★</span>
              </div>
            )}

            <div className="flex gap-2 ml-auto">
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
