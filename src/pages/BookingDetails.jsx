"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { API_BASE_URL } from "../config/api"
import { useAuth } from "../context/AuthContext"
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Home,
  Download,
  X,
  Printer,
  Share2,
} from "lucide-react"

// Import villa images
import AP1 from "/AmrithPalace/AP8.jpg"
import EC1 from "/eastcoastvilla/EC1.jpg"
import anandvilla1 from "/empireanandvillasamudra/anandvilla1.jpg"
import RW1 from "/ramwatervilla/RW19.jpg"
import LAV1 from "/LavishVilla 1/lvone18.jpg"
import LAV2 from "/LavishVilla 2/lvtwo22.jpg"
import LAV3 from "/LavishVilla 3/lvthree5.jpg"

const villaImageMap = {
  "Amrith Palace": AP1,
  "East Coast Villa": EC1,
  "Empire Anand Villa Samudra": anandvilla1,
  "Ram Water Villa": RW1,
  "Lavish Villa I": LAV1,
  "Lavish Villa II": LAV2,
  "Lavish Villa III": LAV3,
  default: AP1,
}

const getVillaImage = (villaName) => {
  if (!villaName) return villaImageMap.default

  if (villaImageMap[villaName]) {
    return villaImageMap[villaName]
  }

  const lowerName = villaName.toLowerCase()
  if (lowerName.includes("amrith") || lowerName.includes("palace")) {
    return villaImageMap["Amrith Palace"]
  } else if (lowerName.includes("east") || lowerName.includes("coast")) {
    return villaImageMap["East Coast Villa"]
  } else if (lowerName.includes("empire") || lowerName.includes("anand") || lowerName.includes("samudra")) {
    return villaImageMap["Empire Anand Villa Samudra"]
  } else if (lowerName.includes("ram") || lowerName.includes("water")) {
    return villaImageMap["Ram Water Villa"]
  } else if (
    lowerName.includes("lavish") &&
    lowerName.includes("i") &&
    !lowerName.includes("ii") &&
    !lowerName.includes("iii")
  ) {
    return villaImageMap["Lavish Villa I"]
  } else if (lowerName.includes("lavish") && lowerName.includes("ii")) {
    return villaImageMap["Lavish Villa II"]
  } else if (lowerName.includes("lavish") && lowerName.includes("iii")) {
    return villaImageMap["Lavish Villa III"]
  }

  return villaImageMap.default
}

const PrintStyles = () => (
  <style type="text/css" media="print">
    {`
    nav, footer, .no-print, button {
      display: none !important;
    }
    .print-only {
      display: block !important;
    }
    .print-container {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    body {
      background-color: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    [class*="bg-gray-"] {
      background-color: white !important;
    }
    [class*="text-gray-"] {
      color: #333 !important;
    }
    .text-emerald-400, .text-emerald-500, .text-emerald-600 {
      color: #D4AF37 !important;
    }
    .page-break-inside-avoid {
      page-break-inside: avoid !important;
    }
    @page {
      margin: 1cm;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    [class*="border-gray-"] {
      border-color: #fef3c7 !important;
    }
    `}
  </style>
)

const BookingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { userData, authToken } = useAuth()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPrintView, setIsPrintView] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const bookingId = id || location.state?.bookingId
  const villaImage = location.state?.villaImage
  const villaName = location.state?.villaName

  const showToastNotification = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  useEffect(() => {
    if (!authToken) {
      navigate("/sign-in")
      return
    }
    if (bookingId) {
      fetchBookingDetails()
    } else {
      setError("Booking ID not found")
      setLoading(false)
    }
  }, [bookingId, authToken, navigate])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      console.log("Fetching booking details for ID:", bookingId)

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Booking details received:", data)
      setBooking(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching booking details:", err)
      setError(err.message || "Unable to load booking details. Please try again later.")
      setLoading(false)
    }
  }

  const cancelBooking = async () => {
    if (!booking || !bookingId || !authToken) {
      showToastNotification("Error: Missing booking information")
      return
    }

    setIsCancelling(true)
    setBooking((prev) => ({ ...prev, processingCancel: true }))

    try {
      console.log(`Attempting to cancel booking: ${bookingId}`)

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          reason: cancellationReason || "User initiated cancellation",
        }),
      })

      console.log("Cancel API Response status:", response.status)

      let data
      try {
        const text = await response.text()
        console.log("Cancel API Response text:", text)
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        throw new Error("Invalid server response")
      }

      if (!response.ok) {
        console.error("Cancel API Error:", data)
        throw new Error(data.error || `Cancellation failed (${response.status})`)
      }

      if (!data.success) {
        throw new Error(data.error || "Cancellation failed")
      }

      console.log("Cancellation successful:", data)

      // Update booking status with the response from the server
      setBooking({
        ...booking,
        processingCancel: false,
        status: "cancelled",
        cancelReason: cancellationReason,
        cancelledAt: new Date().toISOString(),
        refundAmount: data.booking?.refundAmount || 0,
        refundPercentage: data.booking?.refundPercentage || 0,
      })

      setCancelSuccess(true)
      showToastNotification("Booking cancelled successfully")

      setTimeout(() => {
        setShowCancelModal(false)
        setIsCancelling(false)
        navigate("/my-bookings", {
          state: {
            refresh: true,
            message: "Booking cancelled successfully",
          },
        })
      }, 2000)
    } catch (err) {
      console.error("Error cancelling booking:", err)
      showToastNotification(`Error: ${err.message}`)

      // Remove processing state
      setBooking((prev) => ({ ...prev, processingCancel: false }))
      setIsCancelling(false)
    }
  }

  const togglePrintView = () => {
    setIsPrintView(!isPrintView)
    if (!isPrintView) {
      document.body.classList.add("print-mode")
      setTimeout(() => {
        window.print()
        setTimeout(() => {
          document.body.classList.remove("print-mode")
          setIsPrintView(false)
        }, 500)
      }, 300)
    } else {
      document.body.classList.remove("print-mode")
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `Booking Confirmation - ${booking?.villaName || "Luxury Villa"}`,
      text: `My booking at ${booking?.villaName || "Luxury Villa"} from ${formatShortDate(booking?.checkIn)} to ${formatShortDate(booking?.checkOut)}`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if (err.name !== "AbortError") {
          fallbackShare()
        }
      }
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    const url = window.location.href
    const text = `Check out my booking at ${booking?.villaName || "Luxury Villa"} - ${url}`

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToastNotification("Booking link copied to clipboard!")
        })
        .catch(() => {
          promptToCopy(text)
        })
    } else {
      promptToCopy(text)
    }
  }

  const promptToCopy = (text) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand("copy")
      showToastNotification("Booking link copied to clipboard!")
    } catch (err) {
      showToastNotification("Unable to copy. Please copy this link manually: " + window.location.href)
    }
    document.body.removeChild(textArea)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatShortDate = (dateString) => {
    if (!dateString) return "Not specified"
    const options = { month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
      case "pending":
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-yellow-500 border-t-transparent mb-4"></div>
        <p className="text-yellow-600 text-sm sm:text-base">Loading booking details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 px-4 md:px-12 lg:px-16 xl:px-24 bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white p-6 sm:p-8 rounded-xl text-center max-w-md mx-auto border border-gray-200 shadow-md">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-red-600">Error Loading Booking Details</h2>
            <p className="mb-6 text-sm sm:text-base text-gray-600">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchBookingDetails}
                className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-yellow-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg text-sm sm:text-base border border-gray-200 hover:bg-gray-200 transition-colors"
              >
                Back to My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen pt-28 px-4 md:px-12 lg:px-16 xl:px-24 bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white p-6 sm:p-8 rounded-xl text-center max-w-md mx-auto border border-gray-200 shadow-md">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">Booking Not Found</h2>
            <p className="mb-6 text-sm sm:text-base text-gray-600">
              We couldn't find the booking you're looking for. It may have been removed or the link might be incorrect.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-yellow-700 transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate("/rooms")}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg text-sm sm:text-base border border-gray-200 hover:bg-gray-200 transition-colors"
              >
                Browse Villas
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${isPrintView ? "print-mode" : "pt-28"} px-4 md:px-12 lg:px-16 xl:px-24 pb-16 bg-gray-50`}
    >
      <PrintStyles />

      <div className={`${isPrintView ? "print-container" : "max-w-5xl mx-auto"}`}>
        {/* Back Navigation */}
        {!isPrintView && (
          <button
            onClick={() => navigate("/my-bookings")}
            className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-6 group no-print"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Back to My Bookings</span>
          </button>
        )}

        {/* Print Header */}
        {isPrintView && (
          <div className="mb-8 print-only">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Booking Confirmation</h1>
              <div className="flex items-center">
                <img src="/logo.png" alt="Luxor Stay" className="h-12" />
              </div>
            </div>
            <div className="h-1 bg-yellow-500 w-full"></div>
          </div>
        )}

        {/* Print/Download Action Bar */}
        {!isPrintView && (
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 no-print border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-full mr-3">
                <Download className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">Booking Document</h3>
                <p className="text-xs sm:text-sm text-gray-500">Save or print your booking confirmation</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0">
              <button
                onClick={togglePrintView}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-yellow-600 text-white text-xs sm:text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
                Print / Download
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-200 text-gray-700 text-xs sm:text-sm hover:bg-gray-300 transition-colors"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Share
              </button>
            </div>
          </div>
        )}

        {/* Booking Header */}
        <div
          className={`${isPrintView ? "bg-white border-emerald-100" : "bg-white border-gray-200"} rounded-xl ${isPrintView ? "" : "shadow-md"} overflow-hidden mb-6 sm:mb-8 page-break-inside-avoid border relative`}
        >
          {/* Processing overlay */}
          {booking.processingCancel && (
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
                <div className="mx-auto w-12 h-12 mb-4 relative">
                  <div className="animate-spin h-full w-full rounded-full border-4 border-gray-200 border-t-yellow-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Processing Cancellation</h3>
                <p className="text-gray-600 text-sm">Please wait while we process your cancellation request...</p>
              </div>
            </div>
          )}

          <div className="md:flex">
            {/* Villa Image */}
            <div className="md:w-1/3 h-48 sm:h-60 md:h-auto relative overflow-hidden">
              <img
                src={villaImage || getVillaImage(booking.villaName)}
                alt={booking.villaName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex flex-col justify-end p-3 sm:p-4">
                <h2 className="text-white text-lg sm:text-xl font-bold">{booking.villaName}</h2>
                <p className="text-white/90 flex items-center text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {booking.location || "Premium Location"}
                </p>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="md:w-2/3 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Booking Reference</div>
                  <div className="text-lg sm:text-xl font-bold text-yellow-600">
                    #{booking._id.substring(0, 8).toUpperCase()}
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : booking.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : booking.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                  } text-xs sm:text-sm`}
                >
                  {getStatusIcon(booking.status)}
                  <span className="font-medium capitalize">{booking.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Check-in</div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">{formatDate(booking.checkIn)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Check-out</div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">{formatDate(booking.checkOut)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Guests</div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">{booking.guests} Guests</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Duration</div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">{booking.totalDays} Nights</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Amount</div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">
                      ₹{booking.totalAmount?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Date Info - only in print view */}
              {isPrintView && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <div>
                      Booking Date:{" "}
                      <span className="font-medium">{formatShortDate(booking.bookingDate || booking.createdAt)}</span>
                    </div>
                    <div>
                      Confirmation ID: <span className="font-medium">{booking._id}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Guest Information */}
          <div
            className={`${isPrintView ? "bg-white border-emerald-100" : "bg-white border-gray-200"} p-4 sm:p-6 rounded-xl ${isPrintView ? "" : "shadow-md"} page-break-inside-avoid border`}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-800">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              Guest Information
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Guest Name</div>
                <div className="font-medium text-gray-700 text-sm sm:text-base">{booking.guestName}</div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Email</div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <span className="text-gray-700 text-xs sm:text-sm">{booking.email}</span>
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Contact</div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <span className="text-gray-700 text-xs sm:text-sm">{booking.phone || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div
            className={`${isPrintView ? "bg-white border-emerald-100" : "bg-white border-gray-200"} p-4 sm:p-6 rounded-xl ${isPrintView ? "" : "shadow-md"} page-break-inside-avoid border`}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-800">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              Payment Details
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-xs sm:text-sm">Base Price × {booking.totalDays} nights</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">
                  ₹{Math.round(booking.totalAmount / 1.23).toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-xs sm:text-sm">Service Fee (5%)</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">
                  ₹{Math.round(booking.totalAmount * 0.05).toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-xs sm:text-sm">Taxes (18%)</div>
                <div className="font-medium text-gray-700 text-xs sm:text-sm">
                  ₹{Math.round(booking.totalAmount * 0.18).toLocaleString()}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <div className="flex justify-between items-center text-sm sm:text-lg">
                  <div className="font-semibold text-gray-700">Total Amount</div>
                  <div className="font-bold text-yellow-600">₹{booking.totalAmount?.toLocaleString()}</div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className={booking.isPaid ? "text-emerald-600" : "text-amber-600"}>
                      {booking.isPaid ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">Payment Status</span>
                  </div>
                  <div
                    className={`font-semibold text-xs sm:text-sm ${booking.isPaid ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {booking.isPaid ? "Paid" : "Payment Due at Hotel"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div
          className={`${isPrintView ? "bg-white border-emerald-100" : "bg-white border-gray-200"} p-4 sm:p-6 rounded-xl ${isPrintView ? "" : "shadow-md"} mb-6 sm:mb-8 page-break-inside-avoid border`}
        >
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            Cancellation Policy
          </h3>
          <div className="text-gray-700">
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>Free cancellation up to 30 days before check-in (75% refund)</li>
              <li>Cancellation between 15-30 days: 50% refund</li>
              <li>Cancellation within 15 days of check-in: Non-refundable</li>
              <li>Early departure or no-show: No refund</li>
            </ul>
          </div>
        </div>

        {/* Important Notes - added for print view */}
        {isPrintView && (
          <div className="bg-white p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 border border-emerald-100 page-break-inside-avoid">
            <h3 className="text-lg font-bold mb-3 sm:mb-4 text-gray-800">Important Information</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
              <li>• Check-in time: 2:00 PM - 8:00 PM. Please inform us in advance for late check-ins.</li>
              <li>• Check-out time: 11:00 AM</li>
              <li>• A security deposit of ₹10,000 may be required at check-in, refundable upon departure.</li>
              <li>• Please present this confirmation along with a valid ID at check-in.</li>
              <li>• Pets are {booking.villaName.toLowerCase().includes("pet") ? "allowed" : "not allowed"}.</li>
              <li>• For any assistance, contact us at +91 79040 40739 or support@luxorstay.com</li>
            </ul>
          </div>
        )}

        {/* Print view footer */}
        {isPrintView && (
          <div className="mt-8 text-center text-gray-700 text-sm print-only">
            <p>Thank you for choosing Luxor Stay!</p>
            <p>This is an electronic confirmation and does not require a physical signature.</p>
            <div className="border-t border-yellow-200 mt-4 pt-2">
              <p>Luxor Stay Pvt. Ltd. | www.luxorstay.com | +91 79040 40739</p>
            </div>
          </div>
        )}

        {/* Action Buttons - Hide in print view */}
        {!isPrintView && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 no-print">
            <button
              onClick={togglePrintView}
              className="flex-1 bg-yellow-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
            >
              <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
              Print / Download PDF
            </button>
            <button
              onClick={() => navigate("/rooms")}
              className="flex-1 bg-gray-100 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm border border-gray-200"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              Browse Villas
            </button>
            {booking.status !== "cancelled" && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 bg-red-50 text-red-600 border border-red-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Cancel Booking</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {!cancelSuccess ? (
              <>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-700 text-sm sm:text-base">
                        Are you sure you want to cancel?
                      </h4>
                      {/* Calculate days until check-in and display refund percentage */}
                      {(() => {
                        const daysUntilCheckIn = Math.ceil(
                          (new Date(booking.checkIn).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                        )
                        let refundPercentage = 0
                        if (daysUntilCheckIn > 30) {
                          refundPercentage = 75
                        } else if (daysUntilCheckIn > 15) {
                          refundPercentage = 50
                        }
                        const refundAmount = Math.round((booking.totalAmount * refundPercentage) / 100)

                        return (
                          <div className="text-xs sm:text-sm text-amber-600 mt-1">
                            <p>Based on our cancellation policy:</p>
                            <p className="mt-1 font-medium">
                              {daysUntilCheckIn > 30 ? (
                                <>You will receive a 75% refund (₹{refundAmount.toLocaleString()})</>
                              ) : daysUntilCheckIn > 15 ? (
                                <>You will receive a 50% refund (₹{refundAmount.toLocaleString()})</>
                              ) : (
                                <>No refund will be issued for cancellations within 15 days of check-in</>
                              )}
                            </p>
                            <p className="mt-1">Days until check-in: {daysUntilCheckIn}</p>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label
                    htmlFor="cancellationReason"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    id="cancellationReason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Please let us know why you're cancelling"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={cancelBooking}
                    disabled={isCancelling}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-medium ${
                      isCancelling
                        ? "bg-red-300 text-white cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {isCancelling ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Cancelling...
                      </div>
                    ) : (
                      "Yes, Cancel Booking"
                    )}
                  </button>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={isCancelling}
                    className="flex-1 bg-gray-100 text-gray-700 border border-gray-200 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                  >
                    No, Keep It
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center border border-emerald-200">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">Booking Cancelled Successfully</h3>
                {/* Show refund info if applicable */}
                {booking.refundAmount > 0 ? (
                  <p className="text-gray-600 text-xs sm:text-sm mb-3">
                    A refund of ₹{booking.refundAmount.toLocaleString()} ({booking.refundPercentage}%) will be processed
                    according to our policy.
                  </p>
                ) : (
                  <p className="text-gray-600 text-xs sm:text-sm mb-3">
                    No refund will be issued based on our cancellation policy.
                  </p>
                )}
                <p className="text-gray-600 text-xs sm:text-sm mb-6">You'll receive a confirmation email shortly.</p>
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setIsCancelling(false)
                    navigate("/my-bookings", { state: { refresh: true } })
                  }}
                  className="w-full bg-yellow-600 text-white px-4 py-2 rounded text-xs sm:text-sm hover:bg-yellow-700 transition-colors"
                >
                  Back to My Bookings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingDetails
