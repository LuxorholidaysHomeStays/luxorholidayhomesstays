
"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { applyIOSViewportFix, cleanupIOSViewportFix } from "./ios-viewport-fix"

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
  console.log("UnifiedCalendar rendering with isVisible:", isVisible);
  console.log("UnifiedCalendar received blockedDates:", blockedDates);
  console.log("UnifiedCalendar blockedDates count:", blockedDates?.length || 0);
  
  // Log types of blocked dates received
  if (blockedDates && blockedDates.length > 0) {
    const bookingBlocks = blockedDates.filter(d => d.type === 'booking');
    const adminBlocks = blockedDates.filter(d => d.type === 'blocked');
    console.log(`UnifiedCalendar: ${bookingBlocks.length} booking blocks, ${adminBlocks.length} admin blocks`);
  }
  
  // Initialize all state at component top level
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

  // Helper function to check if a date is blocked and return the block type
  const getDateBlockInfo = (date) => {
    if (!blockedDates || blockedDates.length === 0) return { isBlocked: false, type: null, reason: null };

    const dateStr = formatDateToYYYYMMDD(date)
    const currentDate = new Date(date)
    currentDate.setHours(0, 0, 0, 0) // Normalize time part for comparison

    const blockInfo = blockedDates.find((blockedRange) => {
      // Handle potential date format issues
      const checkIn = new Date(blockedRange.checkIn)
      checkIn.setHours(0, 0, 0, 0)
      const checkOut = new Date(blockedRange.checkOut)
      checkOut.setHours(0, 0, 0, 0)

      // Check if the date falls within any blocked range (inclusive)
      const isInRange = currentDate >= checkIn && currentDate <= checkOut;
      
      // Debug logging for specific dates
      if (isInRange) {
        console.log(`Date ${dateStr} is blocked by:`, {
          type: blockedRange.type,
          checkIn: blockedRange.checkIn,
          checkOut: blockedRange.checkOut,
          reason: blockedRange.reason
        });
      }
      
      return isInRange;
    })

    if (blockInfo) {
      return {
        isBlocked: true,
        type: blockInfo.type || 'booking', // 'booking' or 'blocked'
        reason: blockInfo.reason || null,
        category: blockInfo.category || null
      }
    }

    return { isBlocked: false, type: null, reason: null }
  }

  // Helper function to check if a date is blocked (backward compatibility)
  const isDateBlocked = (date) => {
    return getDateBlockInfo(date).isBlocked
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
            const blockInfo = getDateBlockInfo(date)
            const isBlocked = blockInfo.isBlocked
            const blockType = blockInfo.type
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

            // Different styling for different block types
            const getBlockedStyle = () => {
              if (!isBlocked) return "";
              
              if (blockType === 'booking') {
                return "bg-red-100 text-red-600 cursor-not-allowed border-red-200";
              } else if (blockType === 'blocked') {
                return "bg-orange-100 text-orange-600 cursor-not-allowed border-orange-200";
              }
              return "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300";
            };

            return (
              <div
                key={index}
                className={`
                  relative flex flex-col items-center justify-center rounded-lg cursor-pointer 
                  min-h-[45px] transition-all duration-200 select-none border
                  ${!isCurrentMonth ? "opacity-40" : ""}
                  ${isPast
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent opacity-60"
                    : isBlocked
                      ? getBlockedStyle()
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
                title={isBlocked ? 
                  (blockType === 'booking' ? 
                    "Already booked" : 
                    `Blocked: ${blockInfo.reason || 'Not available'}`
                  ) : 
                  undefined
                }
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
                    {blockType === 'booking' ? (
                      // Red X for bookings
                      <>
                        <div className="w-6 h-0.5 bg-red-500 rotate-45 z-10"></div>
                        <div className="w-6 h-0.5 bg-red-500 -rotate-45 absolute z-10"></div>
                      </>
                    ) : (
                      // Orange prohibition sign for admin blocks
                      <>
                        <div className="w-6 h-6 rounded-full border-2 border-orange-500 z-10"></div>
                        <div className="w-4 h-0.5 bg-orange-500 absolute z-10"></div>
                      </>
                    )}
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
  
  // Update check-in/check-out mode
  useEffect(() => {
    if (checkInDate && !checkOutDate) {
      setSelectionMode("checkout");
    } else {
      setSelectionMode("checkin");
    }
  }, [checkInDate, checkOutDate]);

  // Early return if not visible - no hooks below this point!
  if (!isVisible) return null;

  // Return the component UI - simplified structure
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 9999
      }}
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-[95%] sm:w-full max-h-[90vh] overflow-hidden relative z-[10000]">
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
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-red-500 rotate-45"></div>
                  <div className="w-2 h-0.5 bg-red-500 -rotate-45 absolute"></div>
                </div>
              </div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1 text-xs mr-1">
              <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full border border-orange-500"></div>
                  <div className="w-1.5 h-0.5 bg-orange-500 absolute"></div>
                </div>
              </div>
              <span>Blocked</span>
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

        <div className="px-2 py-3 overflow-y-auto max-h-[45vh] sm:max-h-[50vh]">
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
            <div className="flex gap-3 w-full justify-center mt-2 sticky bottom-0 z-10 py-2 bg-gray-50">
              <button
                onClick={() => {
                  setTempCheckIn("")
                  setTempCheckOut("")
                  setSelectionMode("checkin")
                }}
                className="w-[30%] max-w-[120px] py-2 text-gray-700 hover:text-gray-900 font-medium text-base border border-gray-300 rounded-lg hover:border-[#D4AF37] bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </span>
              </button>
              <button
                onClick={onClose}
                className="w-[30%] max-w-[120px] py-2 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white rounded-lg hover:from-[#BFA181] hover:to-[#D4AF37] font-medium text-base transition-all duration-200 hover:shadow-lg"
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
