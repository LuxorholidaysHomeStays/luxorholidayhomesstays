"use client"
import { useState } from "react"
import { Calendar, Plus, Minus, Check, Shield, Heart, ChevronRight, Users, CreditCard, Clock } from "lucide-react"
import UnifiedCalendar from "../VillaDetail/unified-calender.jsx"
import { getVillaPricing, getPriceForDate } from "../../data/villa-pricing.jsx"

export default function EnhancedBookingForm({
  villa,
  checkInDate,
  checkOutDate,
  onDateChange,
  adults,
  children,
  infants,
  onGuestChange,
  onBookNow,
  bookingLoading,
  paymentProcessing,
  isSignedIn,
  userData,
  isModal = false,
}) {
  const [bookingStep, setBookingStep] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [timeSelectionType, setTimeSelectionType] = useState("") // 'checkin' or 'checkout'
  const [checkInTime, setCheckInTime] = useState("15:00") // Default check-in time
  const [checkOutTime, setCheckOutTime] = useState("11:00") // Default check-out time
  const [tempDate, setTempDate] = useState(null)

  const villaPricing = getVillaPricing(villa?.name || "")

  // Time options for selection
  const timeOptions = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ]

  const calculateTotalAmount = () => {
    if (!checkInDate || !checkOutDate || !villa?.name) return 0
    try {
      let totalPrice = 0
      const startDate = new Date(checkInDate)
      const endDate = new Date(checkOutDate)
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + i)
        totalPrice += getPriceForDate(currentDate, villa.name)
      }

      const serviceFee = Math.round(totalPrice * 0.05)
      const taxAmount = Math.round((totalPrice + serviceFee) * 0.18)
      return Math.round(totalPrice + serviceFee + taxAmount)
    } catch (error) {
      console.error("Error calculating total amount:", error)
      return 0
    }
  }

  const calculateBasePrice = () => {
    if (!checkInDate || !checkOutDate || !villa?.name) return 0
    try {
      let totalPrice = 0
      const startDate = new Date(checkInDate)
      const endDate = new Date(checkOutDate)
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + i)
        totalPrice += getPriceForDate(currentDate, villa.name)
      }
      return totalPrice
    } catch (error) {
      console.error("Error calculating base price:", error)
      return 0
    }
  }

  // Enhanced date change handler with time selection
  const handleDateChangeWithTime = (checkIn, checkOut) => {
    if (checkIn && !checkInDate) {
      // New check-in date selected
      setTempDate(checkIn)
      setTimeSelectionType("checkin")
      setShowTimeSelector(true)
    } else if (checkOut && !checkOutDate && checkInDate) {
      // New check-out date selected
      setTempDate(checkOut)
      setTimeSelectionType("checkout")
      setShowTimeSelector(true)
    } else if (checkIn && checkOut) {
      // Both dates selected at once
      onDateChange(checkIn, checkOut)
      setShowCalendar(false)
    } else {
      // Single date update
      onDateChange(checkIn, checkOut)
    }
  }

  // Handle time selection confirmation
  const handleTimeConfirm = (selectedTime) => {
    if (timeSelectionType === "checkin") {
      setCheckInTime(selectedTime)
      onDateChange(tempDate, checkOutDate)
    } else if (timeSelectionType === "checkout") {
      setCheckOutTime(selectedTime)
      onDateChange(checkInDate, tempDate)
    }

    setShowTimeSelector(false)
    setShowCalendar(false)
    setTempDate(null)
    setTimeSelectionType("")
  }

  // Enhanced booking handler with time data
  const handleBookNowWithTime = () => {
    const bookingData = {
      checkInTime,
      checkOutTime,
      // Pass other booking data
    }
    onBookNow(bookingData)
  }

  const totalNights =
    checkInDate && checkOutDate
      ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24))
      : 0

  const totalAmount = calculateTotalAmount()
  const basePrice = calculateBasePrice()

  return (
    <div
      className={`${isModal ? "relative" : ""} ${
        !isModal ? "lg:sticky lg:top-[calc(4rem+2rem)]" : ""
      } transition-all duration-300`}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-4 lg:p-6 ${
          isModal ? "mt-0" : "mt-4"
        } transition-all duration-300 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-none lg:custom-scrollbar`}
      >
        {/* Enhanced Header */}
        <div className="text-center mb-6 p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl border border-[#D4AF37]/20">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Reserve Your Stay</h3>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span>Secure booking • Instant confirmation</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  bookingStep > step
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white"
                    : bookingStep === step
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {bookingStep > step ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-6 h-1 transition-all duration-300 ${
                    bookingStep > step ? "bg-gradient-to-r from-[#D4AF37] to-[#BFA181]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {bookingStep === 1 && "📅 Select Dates & Times"}
            {bookingStep === 2 && "👥 Choose Guests"}
            {bookingStep === 3 && "💳 Confirm & Pay"}
          </h3>
          <p className="text-gray-600 text-sm mt-1">Step {bookingStep} of 3</p>
        </div>

        {/* Price Display */}
        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-4 mb-6 border border-[#D4AF37]/20">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Starting from</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{villaPricing.weekday?.toLocaleString() || "15,000"}
              <span className="text-base font-normal text-gray-600 ml-1">/ night</span>
            </div>
            <div className="flex justify-center gap-3 mt-2 text-xs">
              <div className="text-gray-600">
                Weekdays: <span className="font-semibold">₹{villaPricing.weekday?.toLocaleString() || "15,000"}</span>
              </div>
              <div className="text-gray-600">
                Weekends: <span className="font-semibold">₹{villaPricing.weekend?.toLocaleString() || "25,000"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          {/* Step 1: Date & Time Selection */}
          {bookingStep === 1 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowCalendar(true)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#D4AF37] transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Select dates</div>
                      <div className="text-xs text-gray-600">
                        {checkInDate && checkOutDate
                          ? `${new Date(checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                          : "Choose check-in and check-out"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#D4AF37]" />
                </div>
              </button>

              {/* Time Display */}
              {checkInDate && checkOutDate && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-3 border border-[#D4AF37]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-sm font-semibold text-gray-900">Check-in</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(checkInDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-lg font-bold text-[#D4AF37]">{checkInTime}</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-3 border border-[#D4AF37]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#D4AF37]" />
                      <span className="text-sm font-semibold text-gray-900">Check-out</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(checkOutDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-lg font-bold text-[#D4AF37]">{checkOutTime}</div>
                  </div>
                </div>
              )}

              {checkInDate && checkOutDate && (
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-3 border border-[#D4AF37]/20">
                  <div className="text-center">
                    <div className="text-[#D4AF37] font-semibold text-sm">
                      {totalNights} night{totalNights > 1 ? "s" : ""} selected
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(checkInDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      to{" "}
                      {new Date(checkOutDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Guest Selection */}
          {bookingStep === 2 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-4 border border-[#D4AF37]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-semibold text-gray-900 text-sm">How many guests?</h4>
                </div>
                <p className="text-xs text-gray-600 mb-4">Maximum {villaPricing.maxGuests || 15} guests allowed</p>

                {/* Adults */}
                <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Adults</div>
                    <div className="text-xs text-gray-500">Age 13+</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGuestChange(Math.max(1, adults - 1), children, infants)}
                      disabled={adults <= 1}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:border-[#D4AF37] hover:text-white transition-all disabled:opacity-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-bold">{adults}</span>
                    <button
                      onClick={() => onGuestChange(adults + 1, children, infants)}
                      disabled={adults + children >= (villaPricing.maxGuests || 15)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:border-[#D4AF37] hover:text-white transition-all disabled:opacity-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Children</div>
                    <div className="text-xs text-gray-500">Age 3-12</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGuestChange(adults, Math.max(0, children - 1), infants)}
                      disabled={children <= 0}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:border-[#D4AF37] hover:text-white transition-all disabled:opacity-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-bold">{children}</span>
                    <button
                      onClick={() => onGuestChange(adults, children + 1, infants)}
                      disabled={adults + children >= (villaPricing.maxGuests || 15)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:border-[#D4AF37] hover:text-white transition-all disabled:opacity-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Infants</div>
                    <div className="text-xs text-gray-500">Under 2 (don't count)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGuestChange(adults, children, Math.max(0, infants - 1))}
                      disabled={infants <= 0}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:border-[#D4AF37] hover:text-white transition-all disabled:opacity-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-bold">{infants}</span>
                    <button
                      onClick={() => onGuestChange(adults, children, infants + 1)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#BFA181] hover:border-[#D4AF37] hover:text-white transition-all"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-white rounded-lg text-center shadow-sm">
                  <span className="font-semibold text-gray-900 text-sm">
                    Total: {adults + children} guest{adults + children > 1 ? "s" : ""}
                    {infants > 0 && ` + ${infants} infant${infants > 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Booking Summary */}
          {bookingStep === 3 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-4 border border-[#D4AF37]/20">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-semibold text-gray-900 text-sm">Booking Summary</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-medium text-xs">
                      {checkInDate &&
                        checkOutDate &&
                        `${new Date(checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium text-xs">{checkInTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium text-xs">{checkOutTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium text-xs">
                      {adults + children} Adults/Children{infants > 0 ? `, ${infants} Infants` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked by:</span>
                    <span className="font-medium text-xs">{userData?.name || userData?.email || "Guest User"}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {totalAmount > 0 && (
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-4 border border-[#D4AF37]/20">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {totalNights} night{totalNights > 1 ? "s" : ""}
                      </span>
                      <span className="font-medium">₹{basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service fee (5%)</span>
                      <span className="font-medium">₹{Math.round(basePrice * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes (18%)</span>
                      <span className="font-medium">
                        ₹{Math.round((basePrice + Math.round(basePrice * 0.05)) * 0.18).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-[#D4AF37]/30 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-900">Total Amount</span>
                        <span className="text-[#D4AF37]">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 space-y-2">
          {bookingStep === 1 && (
            <button
              onClick={() => {
                if (!checkInDate || !checkOutDate) {
                  alert("Please select both check-in and check-out dates.")
                  return
                }
                setBookingStep(2)
              }}
              disabled={!checkInDate || !checkOutDate}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Continue to Guests
            </button>
          )}

          {bookingStep === 2 && (
            <div className="space-y-2">
              <button
                onClick={() => setBookingStep(3)}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Review Booking
              </button>
              <button
                onClick={() => setBookingStep(1)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
              >
                Back to Dates
              </button>
            </div>
          )}

          {bookingStep === 3 && (
            <div className="space-y-2">
              <button
                onClick={handleBookNowWithTime}
                disabled={bookingLoading || paymentProcessing || !checkInDate || !checkOutDate}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {bookingLoading || paymentProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {paymentProcessing ? "Processing Payment..." : "Processing..."}
                  </div>
                ) : (
                  `Pay & Confirm ₹${totalAmount.toLocaleString()}`
                )}
              </button>
              <button
                onClick={() => setBookingStep(2)}
                disabled={bookingLoading || paymentProcessing}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
              >
                Back to Guests
              </button>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-[#D4AF37]" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-[#D4AF37]" />
              <span>Instant</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-[#D4AF37]" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isSignedIn && (
          <div className="mt-3 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl border border-[#D4AF37]/20">
            <div className="text-center">
              <h4 className="font-semibold text-[#D4AF37] text-sm">Login Required</h4>
              <p className="text-gray-700 text-xs mt-1">Sign in to complete your booking.</p>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            style={{ zIndex: 99999 }}
          >
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              style={{ zIndex: 100000 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <UnifiedCalendar
              isVisible={true}
              onClose={() => setShowCalendar(false)}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onDateSelect={handleDateChangeWithTime}
              villa={villa}
            />
          </div>
        </div>
      )}

      {/* Time Selector Modal */}
      {showTimeSelector && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4" style={{ zIndex: 99999 }}>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Select {timeSelectionType === "checkin" ? "Check-in" : "Check-out"} Time
                </h3>
                <p className="text-gray-600 text-sm">
                  {timeSelectionType === "checkin"
                    ? "What time would you like to check in?"
                    : "What time would you like to check out?"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeConfirm(time)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      (timeSelectionType === "checkin" && time === checkInTime) ||
                      (timeSelectionType === "checkout" && time === checkOutTime)
                        ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 text-[#D4AF37]"
                        : "border-gray-200 hover:border-[#D4AF37] hover:bg-gray-50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowTimeSelector(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTimeConfirm(timeSelectionType === "checkin" ? checkInTime : checkOutTime)}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
