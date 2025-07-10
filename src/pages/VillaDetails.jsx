"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import Swal from "sweetalert2"
import { X, MapPin, Users, Bed, Bath, Star, Heart, Share, ArrowLeft, ChevronRight } from "lucide-react"

// Import enhanced components
import VillaGallery from "../components/VillaDetail/villagallery"
import VillaInfo from "../components/VillaDetail/VillaInfo.jsx"
import BookingForm from "../components/VillaDetail/booking-form.jsx"

// Import existing dependencies
import { useAuth } from "../context/AuthContext"
import { API_BASE_URL } from "../config/api"
import { getVillaPricing, getPriceForDate } from "../data/villa-pricing.jsx"

// Import all villa images (keeping existing imports)
import AP1 from "/AmrithPalace/AP1.jpg"
import AP2 from "/AmrithPalace/AP2.jpg"
import AP3 from "/AmrithPalace/AP3.jpg"
import AP4 from "/AmrithPalace/AP4.jpg"
import AP5 from "/AmrithPalace/AP5.jpg"
import AP6 from "/AmrithPalace/AP6.jpg"
import AP7 from "/AmrithPalace/AP7.jpg"
import AP8 from "/AmrithPalace/AP8.jpg"
import AP9 from "/AmrithPalace/AP9.jpg"
import AP10 from "/AmrithPalace/AP10.jpg"
import AP11 from "/AmrithPalace/AP11.jpg"
import AP12 from "/AmrithPalace/AP12.jpg"
import AP13 from "/AmrithPalace/AP13.jpg"
import AP14 from "/AmrithPalace/AP14.jpg"
import AP15 from "/AmrithPalace/AP15.jpg"
import AP16 from "/AmrithPalace/AP16.jpg"
import AP17 from "/AmrithPalace/AP17.jpg"
import AP18 from "/AmrithPalace/AP18.jpg"
import AP19 from "/AmrithPalace/AP19.jpg"
import AP20 from "/AmrithPalace/AP20.jpg"
import AP21 from "/AmrithPalace/AP21.jpg"
import AP22 from "/AmrithPalace/AP22.jpg"
import AP23 from "/AmrithPalace/AP23.jpg"
import AP24 from "/AmrithPalace/AP24.jpg"
import AP25 from "/AmrithPalace/AP25.jpg"
import AP26 from "/AmrithPalace/AP26.jpg"
import AP27 from "/AmrithPalace/AP27.jpg"
import AP28 from "/AmrithPalace/AP28.jpg"
import AP29 from "/AmrithPalace/AP29.jpg"
import AP30 from "/AmrithPalace/AP30.jpg"

// East Coast Villa Images
import EC1 from "/eastcoastvilla/EC1.jpg"
import EC2 from "/eastcoastvilla/EC2.jpg"
import EC3 from "/eastcoastvilla/EC3.jpg"
import EC4 from "/eastcoastvilla/EC4.jpg"
import EC5 from "/eastcoastvilla/EC5.jpg"
import EC6 from "/eastcoastvilla/EC6.jpg"
import EC7 from "/eastcoastvilla/EC7.jpg"
import EC8 from "/eastcoastvilla/EC8.jpg"
import EC9 from "/eastcoastvilla/EC9.jpg"
import EC10 from "/eastcoastvilla/EC10.jpg"
import EC11 from "/eastcoastvilla/EC11.jpg"
import EC12 from "/eastcoastvilla/EC12.jpg"
import EC13 from "/eastcoastvilla/EC13.jpg"
import EC14 from "/eastcoastvilla/EC14.jpg"
import EC15 from "/eastcoastvilla/EC15.jpg"

// Empire Anand Villa Samudra Images
import anandvilla1 from "/empireanandvillasamudra/anandvilla1.jpg"
import anandvilla2 from "/empireanandvillasamudra/anandvilla2.jpg"
import anandvilla3 from "/empireanandvillasamudra/anandvilla3.jpg"
import anandvilla4 from "/empireanandvillasamudra/anandvilla4.jpg"
import anandvilla5 from "/empireanandvillasamudra/anandvilla5.jpg"
import anandvilla6 from "/empireanandvillasamudra/anandvilla6.jpg"
import anandvilla7 from "/empireanandvillasamudra/anandvilla7.jpg"
import anandvilla8 from "/empireanandvillasamudra/anandvilla8.jpg"
import anandvilla9 from "/empireanandvillasamudra/anandvilla9.jpg"
import anandvilla10 from "/empireanandvillasamudra/anandvilla10.jpg"
import anandvilla11 from "/empireanandvillasamudra/anandvilla11.jpg"
import anandvilla12 from "/empireanandvillasamudra/anandvilla12.jpg"
import anandvilla13 from "/empireanandvillasamudra/anandvilla13.jpg"
import anandvilla14 from "/empireanandvillasamudra/anandvilla14.jpg"
import anandvilla15 from "/empireanandvillasamudra/anandvilla15.jpg"
import anandvilla16 from "/empireanandvillasamudra/anandvilla16.jpg"

// Villa image collections
const villaImageCollections = {
  "Amrith Palace": [
    AP1,
    AP2,
    AP3,
    AP4,
    AP5,
    AP6,
    AP7,
    AP8,
    AP9,
    AP10,
    AP11,
    AP12,
    AP13,
    AP14,
    AP15,
    AP16,
    AP17,
    AP18,
    AP19,
    AP20,
    AP21,
    AP22,
    AP23,
    AP24,
    AP25,
    AP26,
    AP27,
    AP28,
    AP29,
    AP30,
  ],
  "East Coast Villa": [EC1, EC2, EC3, EC4, EC5, EC6, EC7, EC8, EC9, EC10, EC11, EC12, EC13, EC14, EC15],
  "Empire Anand Villa Samudra": [
    anandvilla1,
    anandvilla2,
    anandvilla3,
    anandvilla4,
    anandvilla5,
    anandvilla6,
    anandvilla7,
    anandvilla8,
    anandvilla9,
    anandvilla10,
    anandvilla11,
    anandvilla12,
    anandvilla13,
    anandvilla14,
    anandvilla15,
    anandvilla16,
  ],
}

// Add this fallback pricing map after the villaImageCollections object
const villaFallbackPricing = {
  "Amrith Palace": { weekday: 45000, weekend: 65000 },
  "Ram Water Villa": { weekday: 30000, weekend: 45000 },
  "East Coast Villa": { weekday: 15000, weekend: 25000 },
  "Lavish Villa I": { weekday: 18000, weekend: 25000 },
  "Lavish Villa II": { weekday: 18000, weekend: 25000 },
  "Lavish Villa III": { weekday: 16000, weekend: 23000 },
  "Empire Anand Villa Samudra": { weekday: 40000, weekend: 60000 },
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function VillaDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { userData, authToken } = useAuth()
  const isSignedIn = !!authToken && !!userData

  const [villa, setVilla] = useState(location.state?.villa || null)
  const [loading, setLoading] = useState(!location.state?.villa)
  const [error, setError] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [blockedDates, setBlockedDates] = useState([])

  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const isBookingInProgress = useRef(false)

  
  const [activeSection, setActiveSection] = useState("overview")
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  
  const fetchVillaDetails = async () => {
    try {
      setLoading(true)
      let response = await fetch(`${API_BASE_URL}/api/villas/${id}`)
      if (!response.ok) {
        const roomsResponse = await fetch(`${API_BASE_URL}/api/rooms/${id}`)
        if (roomsResponse.ok) {
          response = roomsResponse
        }
      }

      if (!response.ok) {
        throw new Error(`Villa not found (${response.status})`)
      }

      const data = await response.json()
      console.log("Backend villa data:", data); // Debug log
      
      const villaName = data.name || "Unknown Villa"
      let images = []
      
      // Get images based on villa name
      if (villaName.toLowerCase().includes("amrith") || villaName.toLowerCase().includes("palace")) {
        images = villaImageCollections["Amrith Palace"]
      } else if (villaName.toLowerCase().includes("east") || villaName.toLowerCase().includes("coast")) {
        images = villaImageCollections["East Coast Villa"]
      } else {
        images = villaImageCollections["Empire Anand Villa Samudra"]
      }

      // Get fallback pricing if needed
      let weekendPrice = data.weekendprice || data.weekendPrice || 0;
      let weekdayPrice = data.price || 0;
      
      // Apply fallback pricing if weekend price is missing or zero
      if (weekendPrice === 0 || !weekendPrice) {
        // Try to find a match in our fallback pricing data
        const fallbackPricing = Object.entries(villaFallbackPricing).find(([name]) => 
          villaName.toLowerCase().includes(name.toLowerCase())
        );
        
        if (fallbackPricing) {
          console.log(`Using fallback pricing for ${villaName}:`, fallbackPricing[1]);
          weekendPrice = fallbackPricing[1].weekend;
          // Only override weekday price if it's also zero/missing
          if (weekdayPrice === 0 || !weekdayPrice) {
            weekdayPrice = fallbackPricing[1].weekday;
          }
        } else if (weekdayPrice > 0) {
          // If we can't find a match but have a weekday price, use a standard multiplier
          console.log(`No fallback pricing found for ${villaName}, using standard 1.5x multiplier`);
          weekendPrice = Math.round(weekdayPrice * 1.5);
        }
      }

      // Don't use pricing from getVillaPricing - use direct backend data with fallback
      const transformedVilla = {
        id: data._id,
        _id: data._id,
        name: data.name,
        location: data.location,
        price: weekdayPrice,
        weekendPrice: weekendPrice,
        weekendprice: weekendPrice, // Keep both for compatibility
        description: data.description || "Luxury villa with all modern amenities for a comfortable stay.",
        longDescription: data.longDescription || "Experience unparalleled luxury in our stunning villa...",
        images: images,
        guests: data.guests || 8,
        capacity: data.guests || 8,
        bedrooms: data.bedrooms || 4,
        bathrooms: data.bathrooms || data.bedrooms || 3,
        rating: data.rating || 4.5,
        amenities: data.amenities || [],
        type: data.type || "VILLA",
      }
      
      console.log("Transformed villa with prices:", transformedVilla); // Debug log
      setVilla(transformedVilla)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  // Fetch blocked dates for the villa
  const fetchBlockedDates = async (villaId) => {
    try {
      console.log("[VILLA DETAILS] Fetching blocked dates for villa:", villaId)
      const response = await fetch(`${API_BASE_URL}/api/bookings/blocked-dates/${villaId}`)
      if (response.ok) {
        const data = await response.json()
        console.log("[VILLA DETAILS] Received blocked dates:", data.blockedDates)
        setBlockedDates(data.blockedDates || [])
      } else {
        console.error("Failed to fetch blocked dates")
        setBlockedDates([])
      }
    } catch (error) {
      console.error("Error fetching blocked dates:", error)
      setBlockedDates([])
    }
  }

  // Utility function to convert date ranges to individual dates (if needed in future)
  const getDatesBetween = (start, end) => {
    const dates = []
    const current = new Date(start)
    const endDate = new Date(end)
    while (current <= endDate) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

 
  const handleBookNow = async (bookingData = {}) => {
    if (!isSignedIn) {
      const bookingState = {
        villaId: villa._id || villa.id,
        villaName: villa.name,
        checkInDate,
        checkOutDate,
        checkInTime: bookingData.checkInTime || "14:00",
        checkOutTime: bookingData.checkOutTime || "12:00",
        adults,
        children,
        infants,
        returnUrl: window.location.pathname + window.location.search,
      }
      localStorage.setItem("pendingBooking", JSON.stringify(bookingState))
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to book this villa. We'll save your booking details.",
        confirmButtonColor: "#D4AF37",
      }).then(() => {
        navigate("/sign-in?redirect=booking")
      })
      return
    }

    if (!checkInDate || !checkOutDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Dates",
        text: "Please select check-in and check-out dates.",
        confirmButtonColor: "#D4AF37",
      })
      return
    }

    if (!villa?.name) {
      Swal.fire({
        icon: "error",
        title: "Villa Error",
        text: "Villa information is missing. Please refresh the page and try again.",
        confirmButtonColor: "#D4AF37",
      })
      return
    }

    setBookingLoading(true)
    setPaymentProcessing(true)
    isBookingInProgress.current = true

    try {
    
      const startDate = new Date(checkInDate)
      const endDate = new Date(checkOutDate)
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

      let totalPrice = 0
      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + i)
        totalPrice += getPriceForDate(currentDate, villa.name)
      }

      const serviceFee = Math.round(totalPrice * 0.05)
      const taxAmount = Math.round((totalPrice + serviceFee) * 0.18)
      const calculatedTotalAmount = Math.round(totalPrice + serviceFee + taxAmount)

      if (calculatedTotalAmount <= 0) {
        throw new Error("Invalid booking amount calculated. Please try again.")
      }

     
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        throw new Error("Failed to load payment gateway. Please refresh and try again.")
      }

     
      const orderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          amount: calculatedTotalAmount,
          currency: "INR",
          villaName: villa.name,
          villaId: villa._id || villa.id,
          guestName: userData?.name || userData?.firstName || "Guest",
          email: userData?.email,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          checkInTime: bookingData.checkInTime || "14:00",
          checkOutTime: bookingData.checkOutTime || "12:00",
          guests: adults + children,
          infants,
          totalDays: nights + 1,
          totalNights: nights,
          address: bookingData.address || {} // Include address data here
        }),
      })

      const rawResponse = await orderResponse.text()
      let orderData
      try {
        orderData = JSON.parse(rawResponse)
      } catch (parseError) {
        console.error("Failed to parse order response:", parseError)
        throw new Error("Invalid response from server. Please try again later.")
      }

      if (!orderData.success || !orderData.order || !orderData.order.id) {
        console.error("Invalid order data:", orderData)
        throw new Error(orderData.message || "Unable to create payment order. Please try again.")
      }

    
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_live_quNHH9YfEhaAru",
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "LuxorStay",
        description: `Booking for ${villa.name}`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  villaId: villa._id || villa.id,
                  villaName: villa.name,
                  email: userData?.email,
                  guestName: userData?.name || userData?.firstName || "Guest",
                  checkIn: checkInDate,
                  checkOut: checkOutDate,
                  checkInTime: bookingData.checkInTime || "14:00",
                  checkOutTime: bookingData.checkOutTime || "12:00",
                  guests: adults + children,
                  infants,
                  totalAmount: calculatedTotalAmount,
                  totalDays: nights + 1,
                  totalNights: nights,
                  address: bookingData.address || {} // Include address data here
                },
              }),
            })

            const verifyRawResponse = await verifyResponse.text()
            let verifyData
            try {
              verifyData = JSON.parse(verifyRawResponse)
            } catch (parseError) {
              console.error("Failed to parse verification response:", parseError)
              throw new Error("Invalid response from server during verification")
            }

            if (verifyResponse.ok && verifyData.success) {
           
              setCheckInDate("")
              setCheckOutDate("")
              setAdults(1)
              setChildren(0)
              setInfants(0)
              Swal.fire({
                icon: "success",
                title: "Booking Confirmed! 🎉",
                text: "Your payment was successful and booking has been confirmed!",
                confirmButtonColor: "#D4AF37",
                confirmButtonText: "View My Bookings",
              }).then(() => {
                navigate("/my-bookings", { replace: true })
              })
            } else {
              throw new Error(verifyData.message || "Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            Swal.fire({
              icon: "warning",
              title: "Payment Verification Issue",
              text: `Your payment was processed, but we're having trouble confirming it. Error: ${error.message}. Our team will contact you shortly.`,
              confirmButtonColor: "#D4AF37",
            })
          } finally {
            setPaymentProcessing(false)
            setBookingLoading(false)
            isBookingInProgress.current = false
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false)
            setBookingLoading(false)
            isBookingInProgress.current = false
          },
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
          contact: userData?.phone || "",
        },
      }

      const razorpayInstance = new window.Razorpay(options)
      razorpayInstance.open()
    } catch (err) {
      console.error("Booking error:", err)
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: err.message || "There was a problem processing your booking.",
        confirmButtonColor: "#D4AF37",
      })
      setPaymentProcessing(false)
      setBookingLoading(false)
      isBookingInProgress.current = false
    }
  }


  const handleDateChange = (checkIn, checkOut) => {
    setCheckInDate(checkIn)
    setCheckOutDate(checkOut)
  }


  const handleGuestChange = (newAdults, newChildren, newInfants) => {
    setAdults(newAdults)
    setChildren(newChildren)
    setInfants(newInfants)
  }


  useEffect(() => {
    if (location.state?.villa) {
      const navigationVilla = location.state.villa
      let processedImages = navigationVilla.images || []

      if (location.state?.fromSearch && (!processedImages.length || processedImages.length < 5)) {
        const villaName = navigationVilla.name?.toLowerCase() || ""
        if (villaName.includes("amrith") || villaName.includes("palace")) {
          processedImages = villaImageCollections["Amrith Palace"]
        } else if (villaName.includes("east") || villaName.includes("coast")) {
          processedImages = villaImageCollections["East Coast Villa"]
        } else {
          processedImages = villaImageCollections["Empire Anand Villa Samudra"]
        }
      }
      setVilla({ ...navigationVilla, images: processedImages })
      setLoading(false)
      // Fetch blocked dates for this villa
      if (navigationVilla._id || navigationVilla.id) {
        fetchBlockedDates(navigationVilla._id || navigationVilla.id)
      }
    } else if (id) {
      fetchVillaDetails()
    }
  }, [id, location.state])

  // Fetch blocked dates when villa is loaded
  useEffect(() => {
    if (villa && (villa._id || villa.id)) {
      fetchBlockedDates(villa._id || villa.id)
    }
  }, [villa])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#D4AF37]/10 to-[#BFA181]/10">
        <div className="text-center p-8 rounded-3xl bg-white shadow-2xl">
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-[#D4AF37] animate-spin" />
            <div className="absolute inset-2 rounded-full border-r-4 border-l-4 border-[#BFA181]/30 animate-ping opacity-60" />
          </div>
          <p className="text-2xl text-gray-700 mb-2 font-bold">Loading Villa</p>
          <p className="text-gray-500">Fetching details for your dream stay...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 rounded-3xl bg-white shadow-2xl max-w-md">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-2xl text-gray-700 mb-2 font-bold">Unable to Load Villa</p>
          <p className="text-gray-500 mb-6">We encountered a problem while fetching villa data.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/rooms")}
              className="bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white px-6 py-3 rounded-2xl hover:from-[#BFA181] hover:to-[#D4AF37] transition-all font-medium"
            >
              Back to Villas
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl hover:bg-gray-300 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header - Always Sticky */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Navigation & Actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/rooms")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 group backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 text-white group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline font-medium text-white">Back</span>
              </button>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm text-white/80">
                <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
                  Home
                </button>
                <ChevronRight className="h-3 w-3" />
                <button onClick={() => navigate("/rooms")} className="hover:text-white transition-colors">
                  Villas
                </button>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white font-medium truncate max-w-[200px]">{villa.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 group backdrop-blur-sm"
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    isSaved ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-300"
                  }`}
                />
                <span className="font-medium text-white hidden sm:inline">Save</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
                <Share className="h-4 w-4 text-white" />
                <span className="font-medium text-white hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Villa Title & Info */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{villa.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1 backdrop-blur-sm">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(villa.rating || 4.5) ? "text-yellow-300 fill-current" : "text-white/50"
                    }`}
                  />
                ))}
                <span className="font-semibold ml-1 text-white">{villa.rating || 4.5}</span>
                <span className="text-white/80">({Math.floor(Math.random() * 50) + 20})</span>
              </div>
              <div className="text-white/90 bg-white/20 rounded-lg px-2 py-1 backdrop-blur-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {villa.location}
              </div>
            </div>
          </div>
        </div>
      </div>

 
      <div className="h-[140px] md:h-[130px]"></div>

      <div className="bg-white z-40 shadow-md">
        <VillaGallery villa={villa} />
      </div>

    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Guests</p>
              <p className="font-bold text-gray-900">{villa.capacity || villa.guests}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded-lg flex items-center justify-center">
              <Bed className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bedrooms</p>
              <p className="font-bold text-gray-900">{villa.bedrooms}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded-lg flex items-center justify-center">
              <Bath className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bathrooms</p>
              <p className="font-bold text-gray-900">{villa.bathrooms}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="font-bold text-gray-900">₹{villa.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh-4rem)]">
 
        <div className="lg:col-span-2 order-2 lg:order-1">
          <VillaInfo
            villa={villa}
            villaPricing={getVillaPricing(villa || {})}
            onShowBookingModal={() => setShowBookingModal(true)}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Booking Form Component */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="hidden lg:block h-full">
            <div className="sticky top-[calc(4rem+2rem)] transition-all duration-300">
              <BookingForm
                villa={villa}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onDateChange={handleDateChange}
                adults={adults}
                children={children}
                infants={infants}
                onGuestChange={handleGuestChange}
                onBookNow={handleBookNow}
                bookingLoading={bookingLoading}
                paymentProcessing={paymentProcessing}
                isSignedIn={isSignedIn}
                userData={userData}
                blockedDates={blockedDates}
              />
            </div>
          </div>

          <div className="lg:hidden">
            <BookingForm
              villa={villa}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onDateChange={handleDateChange}
              adults={adults}
              children={children}
              infants={infants}
              onGuestChange={handleGuestChange}
              onBookNow={handleBookNow}
              bookingLoading={bookingLoading}
              paymentProcessing={paymentProcessing}
              isSignedIn={isSignedIn}
              userData={userData}
              blockedDates={blockedDates}
            />
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowBookingModal(false)}
            ></div>
            <div className="relative z-10 w-full max-w-xl animate-fadeIn">
              {/* Close button */}
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute -right-2 -top-2 z-50 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
                aria-label="Close booking form"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal content */}
              <div className="relative">
                <BookingForm
                  villa={villa}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  onDateChange={handleDateChange}
                  adults={adults}
                  children={children}
                  infants={infants}
                  onGuestChange={handleGuestChange}
                  onBookNow={handleBookNow}
                  bookingLoading={bookingLoading}
                  paymentProcessing={paymentProcessing}
                  isSignedIn={isSignedIn}
                  userData={userData}
                  blockedDates={blockedDates}
                  isModal={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}