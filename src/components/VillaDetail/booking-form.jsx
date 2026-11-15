import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Plus,
  Minus,
  ArrowRight,
  Phone,
  Shield,
  CreditCard,
  Info,
} from "lucide-react"
import UnifiedCalendar from "./unified-calender.jsx"
import { toast } from "../../utils/toast"
import { api } from "../../utils/apiClient"
import { daysBetween, eachDay, isWeekendDay } from "../../utils/date"

export default function BookingForm({
  villa,
  checkInDate,
  checkOutDate,
  onDateChange,
  adults = 1,
  children = 0,
  infants = 0,
  onGuestChange,
  blockedDates = [],
  isSignedIn = false,
  userData = null,
  onCalendarVisibilityChange,
}) {
  const navigate = useNavigate()
  const [showCalendarModal, setShowCalendarModal] = useState(false)

  const isOpal = (villa?.name || "").trim().toLowerCase() === "opal villa"
  const [selectedPackage, setSelectedPackage] = useState("standard_full")
  const [includeHorizonSuite, setIncludeHorizonSuite] = useState(false)

  // Pricing. ?? not || so a genuine zero is not replaced by an invented default,
  // and no weekend premium is fabricated for a villa that has none.
  const weekdayPrice = isOpal ? 40000 : (Number(villa?.weekdayPrice) || Number(villa?.price) || 0)
  const weekendPrice = isOpal ? 65000 : (Number(villa?.weekendPrice) || weekdayPrice)

  // Max guests depends on Opal package / suite
  let maxGuests = Number(villa?.guests) || 10
  if (isOpal) {
    if (selectedPackage === "midweek_couple_regular" || selectedPackage === "midweek_couple_horizon") {
      maxGuests = 2
    } else if (selectedPackage === "midweek_family") {
      maxGuests = 5
    } else if (includeHorizonSuite || selectedPackage === "villa_horizon_suite") {
      maxGuests = 12
    } else {
      maxGuests = 10
    }
  }

  const totalNights = checkInDate && checkOutDate ? daysBetween(checkInDate, checkOutDate) : 0

  // The service fee and GST are the server's to decide; it charges
  // base + 5% + 18% and stores that split on the booking. Until the quote returns
  // the form shows the base only, rather than guessing at tax.
  const [quote, setQuote] = useState(null)
  const [quoteError, setQuoteError] = useState("")

  useEffect(() => {
    let cancelled = false
    setQuote(null)
    setQuoteError("")

    const villaId = villa?.id || villa?._id
    if (!villaId || !checkInDate || !checkOutDate) return

    const quotePayload = {
      villaId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      package: isOpal ? selectedPackage : undefined,
      includeHorizonSuite: isOpal ? (includeHorizonSuite || selectedPackage === "villa_horizon_suite" || selectedPackage === "midweek_couple_horizon") : undefined,
    }

    api("/api/quote", {
      method: "POST",
      auth: false,
      body: quotePayload,
    })
      .then((data) => {
        if (!cancelled) {
          if (data?.breakdown) {
            setQuote(data.breakdown)
            setQuoteError("")
          } else if (data?.error) {
            setQuoteError(data.error)
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setQuote(null)
          setQuoteError(err?.message || "Could not retrieve pricing quote")
        }
      })

    return () => {
      cancelled = true
    }
  }, [villa?.id, villa?._id, checkInDate, checkOutDate, selectedPackage, includeHorizonSuite, isOpal])

  const localBase = (() => {
    if (!checkInDate || !checkOutDate || totalNights <= 0) return weekdayPrice
    let total = 0
    eachDay(checkInDate, checkOutDate).forEach((day) => {
      total += isWeekendDay(day) ? weekendPrice : weekdayPrice
    })
    return total
  })()

  const baseAccommodationTotal = quote?.base ?? localBase
  const serviceFee = quote?.serviceFee ?? 0
  const taxAmount = quote?.gstAmount ?? 0
  const grandTotal = quote?.total ?? baseAccommodationTotal
  const pricingPending = !quote

  const handleOpenCalendar = () => {
    setShowCalendarModal(true)
    if (onCalendarVisibilityChange) onCalendarVisibilityChange(true)
  }

  const handleCloseCalendar = () => {
    setShowCalendarModal(false)
    if (onCalendarVisibilityChange) onCalendarVisibilityChange(false)
  }

  const handleProceedToBooking = () => {
    if (!checkInDate || !checkOutDate) {
      toast.warning("Please select your check-in and check-out dates.")
      handleOpenCalendar()
      return
    }

    if (totalNights < 1) {
      toast.warning("Check-out date must be at least 1 day after check-in.")
      handleOpenCalendar()
      return
    }

    if (isOpal) {
      if (totalNights < 2) {
        toast.warning("Opal Villa requires a minimum stay of 2 nights.")
        return
      }
      if (selectedPackage === "midweek_family" && totalNights < 3) {
        toast.warning("Midweek Family Stay requires a minimum stay of 3 nights.")
        return
      }
      if (totalNights >= 28) {
        toast.info("Stays of 28 nights or longer require a custom quotation. Please call our concierge.")
        return
      }
    }

    const totalGuests = adults + children
    if (totalGuests > maxGuests) {
      toast.warning(`This package accommodates a maximum of ${maxGuests} guests.`)
      return
    }

    const hasHorizon = isOpal && (includeHorizonSuite || selectedPackage === "villa_horizon_suite" || selectedPackage === "midweek_couple_horizon")

    const bookingPayload = {
      villaId: villa?._id || villa?.id,
      villaName: villa?.name,
      checkInDate,
      checkOutDate,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalNights,
      // The backend's TotalDays holds nights, so pass nights, not nights + 1.
      totalDays: totalNights,
      adults,
      children,
      infants,
      guests: totalGuests,
      pricePerNight: weekdayPrice,
      weekendPrice,
      package: isOpal ? selectedPackage : undefined,
      includeHorizonSuite: hasHorizon,
      breakdown: {
        basePrice: baseAccommodationTotal,
        serviceFee,
        taxAmount,
        total: grandTotal,
        discountAmount: quote?.discountAmount || 0,
        discountRate: quote?.discountRate || 0,
        requiresApproval: quote?.requiresApproval || false,
      },
      totalAmount: grandTotal,
      guestName: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phoneNumber || userData?.phone || "",
      countryCode: "+91",
    }

    localStorage.setItem("pendingBookingReview", JSON.stringify(bookingPayload))
    localStorage.setItem("pendingBookingData", JSON.stringify(bookingPayload))

    const isAuth = isSignedIn || Boolean(userData) || Boolean(localStorage.getItem("authToken"))

    if (!isAuth) {
      toast.warning("Please sign in to complete your booking.")
      navigate("/sign-in", {
        state: {
          from: "/booking-review",
          bookingData: bookingPayload,
        },
      })
      return
    }

    navigate("/booking-review", {
      state: { bookingData: bookingPayload },
    })
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden text-gray-900 transition-all">
      {/* Price Header */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#BFA181] p-6 text-white">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-white/80 font-medium">Starting from</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight">₹{weekdayPrice.toLocaleString()}</span>
              <span className="text-sm font-medium text-white/90">/ night</span>
            </div>
          </div>
          <span className="text-xs bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium border border-white/20">
            Max {maxGuests} Guests
          </span>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/20 text-xs text-white/90">
          <span>Weekdays: ₹{weekdayPrice.toLocaleString()}</span>
          <span>•</span>
          <span>Weekends: ₹{weekendPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Opal Villa Special Packages and Horizon Suite Selection */}
        {isOpal && (
          <div className="space-y-4 border border-[#D4AF37]/30 bg-[#ca8a04]/5 rounded-2xl p-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#ca8a04]" />
                  Select Stay Package
                </span>
                <span className="text-[11px] font-semibold text-[#ca8a04] bg-[#ca8a04]/10 px-2 py-0.5 rounded-full">
                  Villa Opul Plan
                </span>
              </div>
              <div className="space-y-2 mt-2">
                {[
                  {
                    id: "standard_full",
                    name: "Standard Full Villa",
                    badge: "Up to 10 Guests • Min 2 Nights",
                    desc: "Day-based rates (Mon-Thu ₹40k, Fri/Sun ₹45k, Sat ₹65k). Access to 4 bedrooms & all standard amenities.",
                  },
                  {
                    id: "villa_horizon_suite",
                    name: "Villa + Horizon Suite",
                    badge: "Up to 12 Guests • Min 2 Nights",
                    desc: "Full villa plus exclusive Horizon Suite (+₹25,000/night). Entire rentable property unlocked.",
                  },
                  {
                    id: "midweek_couple_regular",
                    name: "Midweek Couple's Retreat",
                    badge: "2 Adults • Mon–Thu • Min 2 Nights",
                    desc: "₹35,000 / night. 1 bedroom open with common amenities; remaining bedrooms locked.",
                  },
                  {
                    id: "midweek_couple_horizon",
                    name: "Midweek Couple's + Horizon Suite",
                    badge: "2 Adults • Mon–Thu • Min 2 Nights",
                    desc: "₹60,000 / night (₹35k + ₹25k). Horizon Suite plus common amenities; regular bedrooms locked.",
                  },
                  {
                    id: "midweek_family",
                    name: "Midweek Family Stay",
                    badge: "Up to 5 Guests • Sun–Thu • Min 3 Nights",
                    desc: "₹35,000 / night. Up to 3 sleeping rooms prepared; remaining bedrooms locked.",
                  },
                ].map((pkg) => (
                  <label
                    key={pkg.id}
                    onClick={() => {
                      setSelectedPackage(pkg.id)
                      if (pkg.id === "villa_horizon_suite" || pkg.id === "midweek_couple_horizon") {
                        setIncludeHorizonSuite(true)
                      } else {
                        setIncludeHorizonSuite(false)
                      }
                    }}
                    className={`block p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? "border-[#ca8a04] bg-white shadow-sm ring-1 ring-[#ca8a04]"
                        : "border-gray-200/80 bg-white/60 hover:bg-white hover:border-[#ca8a04]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="opalPackage"
                          checked={selectedPackage === pkg.id}
                          onChange={() => {}}
                          className="accent-[#ca8a04]"
                        />
                        <span className="text-xs font-bold text-gray-900">{pkg.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {pkg.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 pl-5 leading-relaxed">{pkg.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Horizon Suite Add-on checkbox for standard full villa */}
            {selectedPackage === "standard_full" && (
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    Add Horizon Suite (+₹25,000 / night)
                  </span>
                  <span className="text-[11px] text-gray-500">Expands capacity to 12 guests</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeHorizonSuite}
                  onChange={(e) => setIncludeHorizonSuite(e.target.checked)}
                  className="w-4 h-4 accent-[#ca8a04] rounded cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {/* Date Selection Card */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Stay Dates
          </label>
          <button
            type="button"
            onClick={handleOpenCalendar}
            className="w-full flex items-center justify-between border border-gray-200 hover:border-[#D4AF37] rounded-2xl px-4 py-3.5 bg-gray-50/70 hover:bg-gray-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Check-in — Check-out
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {checkInDate && checkOutDate
                    ? `${new Date(checkInDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} — ${new Date(checkOutDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : "Select check-in & check-out"}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1.5 rounded-full">
              {totalNights > 0 ? `${totalNights} Night${totalNights > 1 ? "s" : ""}` : "Pick Dates"}
            </span>
          </button>
        </div>

        {/* Guests Stepper */}
        <div className="border border-gray-200/80 rounded-2xl p-4 bg-gray-50/50 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
            <div>
              <span className="block text-sm font-bold text-gray-800">Adults</span>
              <span className="text-xs text-gray-500">Ages 13 and above</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onGuestChange?.(Math.max(1, adults - 1), children, infants)}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900">{adults}</span>
              <button
                type="button"
                onClick={() => onGuestChange?.(Math.min(maxGuests, adults + 1), children, infants)}
                disabled={adults + children >= maxGuests}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
            <div>
              <span className="block text-sm font-bold text-gray-800">Children</span>
              <span className="text-xs text-gray-500">Ages 2 to 12</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onGuestChange?.(adults, Math.max(0, children - 1), infants)}
                disabled={children <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900">{children}</span>
              <button
                type="button"
                onClick={() => onGuestChange?.(adults, Math.min(maxGuests - adults, children + 1), infants)}
                disabled={adults + children >= maxGuests}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-gray-800">Infants</span>
              <span className="text-xs text-gray-500">Under 2 years</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onGuestChange?.(adults, children, Math.max(0, infants - 1))}
                disabled={infants <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900">{infants}</span>
              <button
                type="button"
                onClick={() => onGuestChange?.(adults, children, Math.min(5, infants + 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        {totalNights > 0 && (
          <div className="border-t border-gray-200/80 pt-4 space-y-2.5 text-sm">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Price Breakdown
            </span>

            {quoteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {quoteError}
              </div>
            )}

            {quote?.requiresApproval && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>Stays of 14+ nights receive a 15% discount and are subject to host approval.</span>
              </div>
            )}

            {quote?.customQuote && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0 text-blue-600" />
                <span>Stays of 28+ nights require a custom quotation. Please contact our concierge.</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Accommodation ({totalNights} Night{totalNights > 1 ? "s" : ""})</span>
              <span className="font-semibold text-gray-900">
                ₹{((quote?.base || baseAccommodationTotal) + (quote?.discountAmount || 0)).toLocaleString()}
              </span>
            </div>

            {quote?.discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Length-of-Stay Discount ({(quote.discountRate * 100).toFixed(0)}%)</span>
                <span>-₹{quote.discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Service Fee (5%)</span>
              <span className="font-semibold text-gray-900">₹{serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span className="font-semibold text-gray-900">₹{taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-dashed border-gray-200 pt-3">
              <span>Total Payable</span>
              <span className="text-[#ca8a04]">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <button
          type="button"
          onClick={handleProceedToBooking}
          className="w-full bg-gradient-to-r from-[#D4AF37] via-[#ca8a04] to-[#BFA181] hover:brightness-105 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
        >
          <span>Proceed to Booking</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Concierge Support */}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText("+91 8015924647")
            toast.info("Concierge hotline: +91 8015924647 (Copied to clipboard)")
          }}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#ca8a04] hover:text-[#996515] bg-[#ca8a04]/5 hover:bg-[#ca8a04]/10 rounded-xl transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Need more guests or special arrangements? Call Concierge</span>
        </button>
      </div>

      {/* Unified Calendar Modal */}
      <UnifiedCalendar
        isVisible={showCalendarModal}
        onClose={handleCloseCalendar}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        onDateSelect={(checkIn, checkOut) => {
          onDateChange?.(checkIn, checkOut)
        }}
        villa={villa}
        blockedDates={blockedDates}
        isModal={true}
      />
    </div>
  )
}
