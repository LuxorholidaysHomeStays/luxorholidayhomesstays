import React, { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "../utils/toast"
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Clock,
  Mail,
  User,
  Shield,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { api } from "../utils/apiClient"
import { API_BASE_URL, requireApiBaseUrl } from "../config/api"

const villaImageMap = {
  "Amrith Palace": "/AmrithPalace/AP8.jpg",
  "East Coast Villa": "/eastcoastvilla/EC1.jpg",
  "Empire Anand Villa Samudra": "/empireanandvillasamudra/anandvilla1.jpg",
  "Ram Water Villa": "/ramwatervilla/RW1.jpg",
  "Lavish Villa I": "/LavishVilla 1/lvone18.jpg",
  "Lavish Villa II": "/LavishVilla 2/lvtwo22.jpg",
  "Lavish Villa III": "/LavishVilla 3/lvthree5.jpg",
  "Opal Villa": "/opal/opal5.jpg",
  "Opal": "/opal/opal5.jpg",
  default: "/AmrithPalace/AP8.jpg",
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true)
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Helper to clean & extract valid human name (not email address)
const getCleanName = (rawName, userObj) => {
  if (rawName && typeof rawName === "string" && !rawName.includes("@") && rawName.trim().length > 0) {
    return rawName.trim()
  }
  const uName = userObj?.name || userObj?.firstName || ""
  if (uName && typeof uName === "string" && !uName.includes("@") && uName.trim().length > 0) {
    return uName.trim()
  }
  // Check previous booking details from localStorage
  const lastGuest = localStorage.getItem("lastBookingGuest")
  if (lastGuest) {
    try {
      const parsed = JSON.parse(lastGuest)
      if (parsed.name && !parsed.name.includes("@") && parsed.name.trim().length > 0) {
        return parsed.name.trim()
      }
    } catch (_e) {
      /* ignore invalid JSON */
    }
  }
  return ""
}

const getCleanEmail = (rawEmail, userObj) => {
  if (rawEmail && typeof rawEmail === "string" && rawEmail.includes("@")) {
    return rawEmail.trim()
  }
  if (userObj?.email && typeof userObj.email === "string" && userObj.email.includes("@")) {
    return userObj.email.trim()
  }
  const lastGuest = localStorage.getItem("lastBookingGuest")
  if (lastGuest) {
    try {
      const parsed = JSON.parse(lastGuest)
      if (parsed.email && parsed.email.includes("@")) return parsed.email.trim()
    } catch (_e) {
      /* ignore invalid JSON */
    }
  }
  return ""
}

const getCleanPhone = (rawPhone, userObj) => {
  const sanitize = (p) => (p ? String(p).replace(/^\+91\s*/, "").replace(/\D/g, "").slice(-10) : "")
  if (rawPhone && sanitize(rawPhone).length >= 10) return sanitize(rawPhone)
  const uPhone = userObj?.phoneNumber || userObj?.phone || ""
  if (uPhone && sanitize(uPhone).length >= 10) return sanitize(uPhone)
  const lastGuest = localStorage.getItem("lastBookingGuest")
  if (lastGuest) {
    try {
      const parsed = JSON.parse(lastGuest)
      if (parsed.phone && sanitize(parsed.phone).length >= 10) return sanitize(parsed.phone)
    } catch (_e) {
      /* ignore invalid JSON */
    }
  }
  return ""
}

export default function BookingReview() {
  const location = useLocation()
  const navigate = useNavigate()
  const { authToken, isAuthenticated, user } = useAuth()

  const [bookingData, setBookingData] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  // Guest details form state
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+91")

  // Hold Timer (5 minutes) and server-side booking lock
  const [timeLeft, setTimeLeft] = useState(300)
  const timerRef = useRef(null)
  const [bookingLockId, setBookingLockId] = useState(null)

  useEffect(() => {
    // Auth check
    const token = authToken || localStorage.getItem("authToken")
    if (!isAuthenticated && !token) {
      localStorage.setItem("authRedirectUrl", "/booking-review")
      if (location.state?.bookingData) {
        localStorage.setItem("pendingBookingReview", JSON.stringify(location.state.bookingData))
      }
      toast.warning("Please sign in to complete your booking.")
      navigate("/sign-in", { state: { from: "/booking-review" }, replace: true })
      return
    }

    // Load booking data from location state or localStorage
    let data = location.state?.bookingData
    if (!data) {
      const stored = localStorage.getItem("pendingBookingReview") || localStorage.getItem("pendingBookingData")
      if (stored) {
        try {
          data = JSON.parse(stored)
        } catch (e) {
          console.error("Failed to parse stored booking data:", e)
        }
      }
    }

    if (data) {
      setBookingData(data)
      setGuestName(getCleanName(data.guestName, user))
      setGuestEmail(getCleanEmail(data.email, user))
      setPhone(getCleanPhone(data.phone, user))
      if (data.countryCode) setCountryCode(data.countryCode)

      // Create server-side booking lock when data loads
      const createLock = async () => {
        try {
          requireApiBaseUrl()
          const lockResponse = await fetch(`${API_BASE_URL}/api/booking-locks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              villaId: data.villaId || data.id || data._id,
              villaName: data.villaName || "Villa",
              checkIn: data.checkInDate || data.checkIn,
              checkOut: data.checkOutDate || data.checkOut,
            }),
          })
          if (lockResponse.ok) {
            const lockData = await lockResponse.json()
            const newLockId = lockData.id || lockData.lock?.id
            if (newLockId) setBookingLockId(newLockId)
          }
        } catch (e) {
          console.warn("Failed to create booking lock:", e)
        }
      }
      createLock()
    } else {
      toast.error("No active booking found. Please select a villa to book.")
      navigate("/rooms")
    }

    // Compute or retrieve hold expiry timestamp for seamless page refreshes
    let holdExpiry = Number(localStorage.getItem("bookingHoldExpiry"))
    const now = Date.now()
    if (!holdExpiry || isNaN(holdExpiry) || holdExpiry < now) {
      holdExpiry = now + 5 * 60 * 1000 // 5 minutes
      localStorage.setItem("bookingHoldExpiry", String(holdExpiry))
    }

    const initialRemaining = Math.max(0, Math.floor((holdExpiry - now) / 1000))
    setTimeLeft(initialRemaining)

    // Start slot lock countdown
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const currentHoldExpiry = Number(localStorage.getItem("bookingHoldExpiry")) || holdExpiry
      const remaining = Math.max(0, Math.floor((currentHoldExpiry - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(timerRef.current)
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      // Release server-side lock on unmount
      if (bookingLockId) {
        const releaseLock = async () => {
          try {
            await fetch(`${API_BASE_URL}/api/booking-locks/${bookingLockId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })
          } catch (e) {
            console.warn("Failed to release lock on unmount:", e)
          }
        }
        releaseLock()
      }
    }
  }, [location.state, isAuthenticated, authToken, user, navigate])

  const handleExtendHold = async () => {
    try {
      requireApiBaseUrl()

      // Extend server-side lock by creating a new one (locks have 15-minute expiry)
      const token = authToken || localStorage.getItem("authToken")
      const lockResponse = await fetch(`${API_BASE_URL}/api/booking-locks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          villaId: bookingData?.villaId || bookingData?.id || bookingData?._id,
          villaName: bookingData?.villaName || "Villa",
          checkIn: bookingData?.checkInDate || bookingData?.checkIn,
          checkOut: bookingData?.checkOutDate || bookingData?.checkOut,
        }),
      })

      if (lockResponse.ok) {
        const lockData = await lockResponse.json()
        const newLockId = lockData.id || lockData.lock?.id
        if (newLockId) {
          // Release old lock if we have one
          if (bookingLockId) {
            try {
              await fetch(`${API_BASE_URL}/api/booking-locks/${bookingLockId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              })
            } catch (e) {
              console.warn("Failed to release old lock:", e)
            }
          }
          setBookingLockId(newLockId)
        }
      }

      // Update client-side timer
      const newExpiry = Date.now() + 5 * 60 * 1000
      localStorage.setItem("bookingHoldExpiry", String(newExpiry))
      setTimeLeft(300)
      toast.info("Reservation hold extended by 5 minutes.")
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((newExpiry - Date.now()) / 1000))
        setTimeLeft(remaining)
        if (remaining <= 0) {
          clearInterval(timerRef.current)
        }
      }, 1000)
    } catch (error) {
      console.error("Failed to extend hold:", error)
      toast.error("Could not extend reservation hold. Please try again.")
    }
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getVillaImage = (name) => {
    if (!name) return villaImageMap.default
    for (const [key, image] of Object.entries(villaImageMap)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return image
      }
    }
    return villaImageMap.default
  }

  // The backend owns pricing: it charges the base nightly rate plus a 5% service
  // fee plus 18% GST, and stores that split on the booking. Deriving these numbers
  // here as well is how the page came to show a different total from the one
  // Razorpay captured, so the amounts now come from /api/quote and nothing is
  // computed locally.
  const [serverPricing, setServerPricing] = useState(null)
  const [pricingError, setPricingError] = useState("")

  const quoteVillaId = bookingData?.villaId
  const quoteCheckIn = bookingData?.checkInDate || bookingData?.checkIn
  const quoteCheckOut = bookingData?.checkOutDate || bookingData?.checkOut

  useEffect(() => {
    let cancelled = false
    setServerPricing(null)
    setPricingError("")

    if (!quoteVillaId || !quoteCheckIn || !quoteCheckOut) {
      setPricingError("Select your dates to see the final price.")
      return
    }

    api("/api/quote", {
      method: "POST",
      auth: false,
      body: { villaId: quoteVillaId, checkIn: quoteCheckIn, checkOut: quoteCheckOut },
    })
      .then((data) => {
        if (cancelled) return
        if (data?.breakdown) setServerPricing(data.breakdown)
        else setPricingError("We could not price these dates. Please try again.")
      })
      .catch(() => {
        if (!cancelled) setPricingError("We could not reach the pricing service. Please retry.")
      })

    return () => {
      cancelled = true
    }
  }, [quoteVillaId, quoteCheckIn, quoteCheckOut])

  const totalNights = serverPricing?.nights || 0
  const totalGuests = (Number(bookingData?.adults) || 1) + (Number(bookingData?.children) || 0)
  const baseAccommodation = serverPricing?.base || 0
  const serviceFee = serverPricing?.serviceFee || 0
  const taxAmount = serverPricing?.gstAmount || 0
  const grandTotal = serverPricing?.total || 0

  const handleProceedPayment = async () => {
    requireApiBaseUrl()

    if (timeLeft <= 0) {
      toast.warning("Your 5-minute reservation hold has expired. Please re-select dates to continue.")
      navigate(-1)
      return
    }

    // Never start a payment we cannot price. Charging a locally computed total
    // against a server-side booking is what let the shown and captured amounts
    // disagree.
    if (!serverPricing || grandTotal <= 0) {
      toast.warning(pricingError || "The price for these dates is still loading. Please try again.")
      return
    }

    if (!guestName.trim() || guestName.includes("@") || guestName.trim().length < 2) {
      toast.warning("Please enter the primary guest's full name (not an email address).")
      return
    }

    if (!guestEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      toast.warning("Please enter a valid email address for booking confirmation.")
      return
    }

    const cleanDigits = phone.replace(/\D/g, "")
    if (!cleanDigits || cleanDigits.length < 10) {
      toast.warning("Please enter a valid 10-digit mobile number.")
      return
    }

    // Save for future pre-filling
    localStorage.setItem(
      "lastBookingGuest",
      JSON.stringify({
        name: guestName.trim(),
        email: guestEmail.trim(),
        phone: cleanDigits.slice(-10),
        countryCode: countryCode,
      })
    )

    setPaymentProcessing(true)
    const token = authToken || localStorage.getItem("authToken")

    try {
      const scriptReady = await loadRazorpayScript()
      if (!scriptReady) {
        throw new Error("Unable to load payment gateway. Please check your internet connection.")
      }

      // 1. Create booking record in Go backend
      const bookingPayload = {
        villaId: bookingData.villaId || bookingData.id || bookingData._id,
        villaName: bookingData.villaName || "Luxury Villa",
        checkIn: bookingData.checkInDate || bookingData.checkIn,
        checkOut: bookingData.checkOutDate || bookingData.checkOut,
        checkInTime: "14:00",
        checkOutTime: "11:00",
        guests: totalGuests,
        infants: Number(bookingData?.infants || 0),
        totalDays: totalNights,
        guestName: guestName.trim(),
        email: guestEmail.trim(),
        phone: `${countryCode} ${phone.trim()}`,
        paymentMethod: "Razorpay",
        status: "pending",
        paymentStatus: "pending",
      }

      const bookingRes = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      })

      if (!bookingRes.ok) {
        const errorData = await bookingRes.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || "Failed to initialize booking.")
      }

      const createdBookingData = await bookingRes.json()
      const bookingRecord = createdBookingData.booking || createdBookingData.data || createdBookingData
      const bookingId = bookingRecord?.id || bookingRecord?._id || bookingRecord?.bookingId

      // Release booking lock now that we have a booking record
      if (bookingLockId) {
        try {
          await fetch(`${API_BASE_URL}/api/booking-locks/${bookingLockId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
          setBookingLockId(null)
        } catch (e) {
          console.warn("Failed to release lock after booking:", e)
        }
      }

      // 2. Create Razorpay order. The backend is the pricing authority: it ignores
      // any client-supplied amount and calculates the total from the booking record.
      const orderRes = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: String(bookingId),
          notes: {
            villaName: bookingPayload.villaName,
            guestName: bookingPayload.guestName,
          },
        }),
      })

      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || "Failed to create payment order.")
      }

      const orderData = await orderRes.json()
      const order = orderData.order || orderData

      // 3. Launch Razorpay Checkout
      const keyId = orderData.keyId || orderData.key || import.meta.env.VITE_RAZORPAY_KEY
      if (!keyId) {
        throw new Error("The payment gateway is not configured for this site. Please contact us.")
      }

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Luxor Holiday Homes Stays",
        description: `Reservation for ${bookingPayload.villaName}`,
        order_id: order.id,
        prefill: {
          name: guestName.trim(),
          email: guestEmail.trim(),
          contact: `${countryCode}${phone.trim()}`,
        },
        theme: {
          color: "#D4AF37",
        },
        handler: async (response) => {
          try {
            // 4. Verify payment
            const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                bookingId: String(bookingId),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyResult = await verifyRes.json()

            if (verifyResult.success === true) {
              localStorage.removeItem("pendingBookingReview")
              localStorage.removeItem("pendingBookingData")
              toast.success("Payment successful! Your luxury stay is confirmed.")
              navigate("/my-bookings", { replace: true })
            } else {
              throw new Error(verifyResult.error || verifyResult.message || "Payment verification failed.")
            }
          } catch (verifyErr) {
            console.error("Payment verification failed:", verifyErr)
            toast.error(verifyErr.message || "Payment verification failed. Please contact customer support.")
          } finally {
            setPaymentProcessing(false)
          }
        },
        modal: {
          ondismiss: async () => {
            setPaymentProcessing(false)
            // Release booking lock on payment dismissal (abandoned checkout)
            if (bookingLockId) {
              try {
                await fetch(`${API_BASE_URL}/api/booking-locks/${bookingLockId}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                })
                setBookingLockId(null)
              } catch (e) {
                console.warn("Failed to release lock on payment dismissal:", e)
              }
            }
          },
        },
      }

      const rzpInstance = new window.Razorpay(options)
      rzpInstance.open()

      rzpInstance.on("payment.failed", (err) => {
        toast.error(err.error?.description || "Payment was not completed.")
        setPaymentProcessing(false)
      })
    } catch (err) {
      console.error("Booking payment error:", err)
      toast.error(err.message || "Something went wrong while processing your payment.")
      setPaymentProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#ca8a04] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Villa Details</span>
          </button>

          {/* Slot Reservation Hold Badge */}
          {timeLeft > 0 ? (
            <div className="flex items-center gap-2 bg-[#ca8a04]/10 text-[#ca8a04] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#ca8a04]/20 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>Slot reserved for: {formatTimer(timeLeft)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-red-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Hold expired</span>
              <button
                type="button"
                onClick={handleExtendHold}
                className="ml-1 underline font-semibold text-red-700 hover:text-red-900 cursor-pointer"
              >
                Extend 5 Mins
              </button>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Review & Confirm Stay</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your booking details and enter guest contact info
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Villa & Stay Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img
                src={getVillaImage(bookingData?.villaName)}
                alt={bookingData?.villaName || "Villa"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#ca8a04] px-2.5 py-1 rounded-full">
                  Confirmed Selection
                </span>
                <h2 className="text-2xl font-bold mt-2">{bookingData?.villaName || "Luxury Villa"}</h2>
                <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Perur ECR, Chennai, India</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-[#ca8a04]" />
                    <span>Dates</span>
                  </div>
                  <span className="font-bold text-gray-900 text-right">
                    {bookingData?.checkInDate && bookingData?.checkOutDate
                      ? `${new Date(bookingData.checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${new Date(bookingData.checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                      : "Dates Selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-[#ca8a04]" />
                    <span>Duration</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {totalNights} Night{totalNights > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-[#ca8a04]" />
                    <span>Guests</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {bookingData?.adults || 1} Adult{bookingData?.adults > 1 ? "s" : ""}
                    {bookingData?.children > 0 && `, ${bookingData.children} Child${bookingData.children > 1 ? "ren" : ""}`}
                    {bookingData?.infants > 0 && `, ${bookingData.infants} Infant${bookingData.infants > 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>

              {/* Secure Booking Guarantee */}
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800">
                <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>100% Guaranteed Luxury Stay with Direct Villa Host Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Details & Price Breakdown (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Guest Details Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 sm:p-8 space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ca8a04]" />
                  <span>Primary Guest Details</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Booking confirmation & access details will be sent here
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ca8a04] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ca8a04] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="w-24 shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#ca8a04] outline-none transition-all"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ca8a04] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown & Pay Now Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 sm:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#ca8a04]" />
                  <span>Price Summary</span>
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Accommodation ({totalNights} Night{totalNights > 1 ? "s" : ""})</span>
                  <span className="font-semibold text-gray-900">₹{baseAccommodation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee (5%)</span>
                  <span className="font-semibold text-gray-900">₹{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-gray-900">₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-extrabold text-gray-900 border-t border-dashed border-gray-200 pt-4">
                  <span>Total Payable</span>
                  <span className="text-[#ca8a04] text-xl">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handleProceedPayment}
                disabled={paymentProcessing}
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#ca8a04] to-[#BFA181] hover:brightness-105 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-[#D4AF37]/30 transition-all transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {paymentProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Securing Reservation...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Pay ₹{grandTotal.toLocaleString()} via Razorpay</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-gray-400" />
                <span>256-bit Encrypted & Powered by Razorpay Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
