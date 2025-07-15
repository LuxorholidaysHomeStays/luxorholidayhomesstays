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
  // Add global styles for iOS compatibility when the component mounts
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    style.id = 'ios-calendar-fixes';
    style.textContent = `
      /* iOS Safari specific fixes */
      @supports (-webkit-touch-callout: none) {
        .calendar-wrapper * {
          -webkit-tap-highlight-color: transparent !important;
          touch-action: manipulation !important;
        }
        
        .calendar-day, .calendar-wrapper div {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .calendar-day:active, .calendar-wrapper button:active {
          opacity: 0.7 !important;
        }

        /* Force hardware acceleration for iOS */
        .calendar-modal {
          -webkit-transform: translateZ(0) !important;
          transform: translateZ(0) !important;
          -webkit-backface-visibility: hidden !important;
          backface-visibility: hidden !important;
          -webkit-perspective: 1000px !important;
          perspective: 1000px !important;
        }
      }
      
      /* Additional iOS fixes for all browsers */
      .calendar-wrapper button {
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }

      /* Ensure modal displays properly */
      .calendar-modal {
        position: fixed !important;
        z-index: 9999 !important;
        overflow: hidden;
      }

      /* Increase touch target sizes for better iOS interaction */
      .calendar-day {
        min-height: 48px !important;
        min-width: 40px !important;
        padding: 5px !important;
      }
    `;
    
    // Add it to the document head
    document.head.appendChild(style);
    
    // Clean up
    return () => {
      const styleElem = document.getElementById('ios-calendar-fixes');
      if (styleElem) styleElem.remove();
    };
  }, []);

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
    
    // Find a fallback price for the villa
    const getFallbackPrice = () => {
      if (!villa.name) return isWeekend ? 60000 : 40000; // Default fallback
      
      // Check for exact match in fallback prices
      if (villaFallbackPrices[villa.name]) {
        return isWeekend ? villaFallbackPrices[villa.name].weekend : villaFallbackPrices[villa.name].weekday;
      }
      
      // Check for partial name match
      for (const [villaName, pricing] of Object.entries(villaFallbackPrices)) {
        if (villa.name.toLowerCase().includes(villaName.toLowerCase())) {
          return isWeekend ? pricing.weekend : pricing.weekday;
        }
      }
      
      // If we have weekday price but no weekend price
      if (isWeekend && villa.price && villa.price > 0) {
        return Math.round(villa.price * 1.5);
      }
      
      return isWeekend ? 60000 : 40000; // Last resort default
    };

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
      // Use fallback pricing
      else {
        return getFallbackPrice();
      }
    }

    // For weekdays, return the regular price or fallback if price is 0
    return Number(villa.price) > 0 ? Number(villa.price) : getFallbackPrice();
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

  // Add direct iOS detection function
  const isIOSDevice = () => {
    return typeof navigator !== 'undefined' && 
      /iPad|iPhone|iPod/.test(navigator.userAgent) && 
      !window.MSStream;
  };
  
  const renderCalendar = (monthOffset = 0) => {
    const displayMonth = new Date(currentMonth)
    displayMonth.setMonth(displayMonth.getMonth() + monthOffset)

    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    
    // Use iOS detection
    const isIOS = isIOSDevice();
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

        <div 
          className="grid grid-cols-7 gap-1 mb-2 calendar-wrapper" 
          style={{
            touchAction: "manipulation",
            WebkitAppearance: "none",
            appearance: "none",
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div 
          className="grid grid-cols-7 gap-1 calendar-wrapper"
        >
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
                  min-h-[45px] transition-all duration-200 select-none border calendar-day
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
                style={{
                  WebkitAppearance: "none",
                  appearance: "none",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  width: "100%",
                  boxSizing: "border-box"
                }}
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
      // Store current scroll position
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      // Enhanced approach for iOS compatibility:
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.height = "100%"
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = `-${scrollX}px`
      
      // Force layout recalculation for iOS
      const iosTimer = setTimeout(() => {
        // Force reflow specifically for iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
          document.body.style.webkitTransform = 'scale(1)';
          document.body.style.transform = 'scale(1)';
          window.scrollTo(0, 0);
        }
      }, 10);
      
      return () => {
        if (typeof document !== 'undefined' && document.body) {
          // Restore normal scrolling
          document.body.style.overflow = ""
          document.body.style.position = ""
          document.body.style.width = ""
          document.body.style.height = ""
          document.body.style.top = ""
          document.body.style.left = ""
          document.body.style.webkitTransform = ""
          document.body.style.transform = ""
          
          // Restore scroll position
          window.scrollTo(scrollX, scrollY);
          
          clearTimeout(iosTimer);
        }
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 calendar-modal"
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        WebkitBackdropFilter: "blur(0px)",
        backdropFilter: "blur(0px)",
        pointerEvents: "auto",
        touchAction: "auto",
        opacity: 1,
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        WebkitUserSelect: "none",
        userSelect: "none"
      }}
      onClick={(e) => {
        // Close the calendar when clicking outside
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-[95%] sm:w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative z-[10000] calendar-wrapper"
        style={{
          WebkitAppearance: "none",
          appearance: "none",
          opacity: 1,
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          pointerEvents: "auto",
          touchAction: "auto",
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent"
        }}>
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
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:text-white flex items-center justify-center transition-all hover:scale-110"
            style={{
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              WebkitAppearance: "none",
              appearance: "none",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <ChevronLeft className="h-5 w-5" />
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
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:text-white flex items-center justify-center transition-all hover:scale-110"
            style={{
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              WebkitAppearance: "none",
              appearance: "none",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div 
          className="px-2 py-3 overflow-y-auto max-h-[45vh] sm:max-h-[55vh] calendar-wrapper"
          style={{
            WebkitOverflowScrolling: "touch", // For iOS smooth scrolling
            overscrollBehavior: "contain",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            perspective: 1000,
            WebkitPerspective: 1000
          }}
        >
          <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-center">
            <div className="w-full md:max-w-[260px]">{renderCalendar(0)}</div>
            <div className="hidden lg:block w-full md:max-w-[260px]">{renderCalendar(1)}</div>
          </div>
        </div>

        <div className="p-2 pt-1 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col items-center">
            {/* Selection display */}
            <div className="text-sm text-gray-700 w-full text-center mb-1">
              {tempCheckIn && tempCheckOut && (
                <div className="flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">
                    {new Date(tempCheckIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                    {new Date(tempCheckOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            {/* Villa pricing info */}
            {villa && (
              <div className="bg-gray-50 px-3 py-1 rounded-lg flex flex-wrap items-center justify-center w-full max-w-[250px] mb-3 border border-gray-200">
                <div className="flex items-center w-full justify-center gap-3">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">Weekday:</span>
                    <span className="text-sm font-medium text-gray-700">{formatPrice(villa.price || getPriceForDate(new Date(new Date().setDate(new Date().getDate() + 1))) || 0)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">Weekend:</span>
                    <span className="text-sm font-medium text-yellow-700">
                      {formatPrice(villa.weekendprice || villa.weekendPrice || getPriceForDate(new Date(new Date().setDate(new Date().getDate() + (7 - new Date().getDay())))))}
                      <span className="text-[8px] ml-0.5 text-yellow-600">★</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BUTTONS SECTION - Always visible on all devices */}
            <div className="flex gap-3 w-full justify-center mt-2 sticky bottom-0 z-10 py-4 bg-gray-50">
              <button
                onClick={() => {
                  setTempCheckIn("")
                  setTempCheckOut("")
                  setSelectionMode("checkin")
                }}
                className="w-[40%] max-w-[140px] py-3 text-gray-700 hover:text-gray-900 font-medium text-base border border-gray-300 rounded-lg hover:border-[#D4AF37] bg-white hover:bg-gray-50 transition-all duration-200"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  WebkitAppearance: "none",
                  appearance: "none",
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </span>
              </button>
              <button
                onClick={onClose}
                className="w-[40%] max-w-[140px] py-3 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white rounded-lg hover:from-[#BFA181] hover:to-[#D4AF37] font-medium text-base transition-all duration-200 hover:shadow-lg"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  WebkitAppearance: "none", 
                  appearance: "none",
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
