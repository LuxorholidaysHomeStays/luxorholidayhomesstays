import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { toast } from "../utils/toast"
import { X, MapPin, Users, Bed, Bath, Star, Heart, Share, ArrowLeft, ChevronRight } from "lucide-react"

// Import enhanced components
import VillaGallery from "../components/VillaDetail/villagallery"
import VillaInfo from "../components/VillaDetail/VillaInfo.jsx"
import BookingForm from "../components/VillaDetail/booking-form.jsx"
import axios from "axios"

// Import existing dependencies
import { useAuth } from "../context/AuthContext"
import { API_BASE_URL, requireApiBaseUrl } from "../config/api"
import { getVillaPricing } from "../data/villa-pricing.jsx"
import { getBestMatchingVillaImages } from "../utils/villaImageUtils"

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

// Opal Villa Images
import opal1 from "/opal/opal1.jpg"
import opal2 from "/opal/opal2.jpg"
import opal3 from "/opal/opal3.jpg"
import opal4 from "/opal/opal4.jpg"
import opal5 from "/opal/opal5.jpg"
import opal6 from "/opal/opal6.jpg"
import opal7 from "/opal/opal7.jpg"
import opal8 from "/opal/opal8.jpg"
import opal9 from "/opal/opal9.jpg"
import opal10 from "/opal/opal10.jpg"
import opal11 from "/opal/opal11.jpg"
import opal12 from "/opal/opal12.jpg"
import opal13 from "/opal/opal13.jpg"
import opal14 from "/opal/opal14.jpg"
import opal15 from "/opal/opal15.jpg"
import opal16 from "/opal/opal16.jpg"
import opal17 from "/opal/opal17.jpg"
import opal18 from "/opal/opal18.jpg"
import opal19 from "/opal/opal19.jpg"
import opal20 from "/opal/opal20.jpg"
import opal21 from "/opal/opal21.jpg"
import opal22 from "/opal/opal22.jpg"

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
  "Opal Villa": [
    opal5, opal1, opal2, opal3, opal4, opal6, opal7, opal8, opal9, opal10,
    opal11, opal12, opal13, opal14, opal15, opal16, opal17, opal18, opal19, opal20,
    opal21, opal22
  ],
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

  // New state variables for booking step and address
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingAddress, setBookingAddress] = useState({
    street: "",
    country: "",
    state: "",
    city: "",
    zipCode: ""
  })

  // New state to track when the unified calendar is open
  const [calendarOpen, setCalendarOpen] = useState(false)

  // New state to track if we're fetching address info
  const [loadingAddressInfo, setLoadingAddressInfo] = useState(false)

  // Function to fetch user's address information from backend
  const fetchUserAddress = async () => {
    if (!isSignedIn || !authToken) return;

    try {
      setLoadingAddressInfo(true);
      const token = authToken || localStorage.getItem('authToken');

      if (!token) {
        console.log("No auth token available for fetching address");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = response.data?.user || response.data;
      if (user && user.address) {
        let addrObj = { street: "", city: "", state: "", country: "", zipCode: "" };
        if (typeof user.address === "string") {
          try {
            addrObj = JSON.parse(user.address);
          } catch {
            addrObj.street = user.address;
          }
        } else if (typeof user.address === "object") {
          addrObj = user.address;
        }
        console.log("Found user address info:", addrObj);
        setBookingAddress(addrObj);
      }
    } catch (error) {
      // Just log the error but don't show to user since this is just an enhancement
      console.error("Error fetching user address info:", error.response?.data || error.message);
    } finally {
      setLoadingAddressInfo(false);
    }
  };

  // Function to check if villa is in user's favorites
  const checkIfVillaIsSaved = async () => {
    if (!isSignedIn || !authToken) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/favorites`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.data && response.data.success) {
        const favorites = response.data.favorites || [];
        const villaId = String(villa._id || villa.id || "");
        const isFavorite = favorites.some((fav) =>
          String(fav.villaId || fav.villa_id || "") === villaId
        );
        setIsSaved(isFavorite);
      }
    } catch (error) {
      console.error("Error checking favorites:", error.response?.data || error.message);
    }
  };

  // Function to toggle save/unsave villa
  const handleSaveVilla = async () => {
    if (!isSignedIn) {
      toast.info("Please log in to save this villa to your favorites.");
      navigate("/sign-in?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      if (isSaved) {
        // Remove from favorites
        await axios.delete(`${API_BASE_URL}/api/users/favorites/${villa._id || villa.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        setIsSaved(false);
        toast.success("Villa removed from your favorites.");
      } else {
        // Add to favorites
        await axios.post(`${API_BASE_URL}/api/users/favorites`, {
          villaId: villa._id || villa.id,
          villaName: villa.name,
          villaLocation: villa.location,
          villaPrice: villa.price,
          villaImage: villa.images && villa.images.length > 0 ? villa.images[0] : null
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        setIsSaved(true);
        toast.success("Villa added to your favorites!");
      }
    } catch (error) {
      console.error("Error updating favorites:", error.response?.data || error.message);
      toast.error("There was a problem updating your favorites. Please try again.");
    }
  };

  // When user signs in, fetch their address and check if villa is saved
  useEffect(() => {
    if (isSignedIn && authToken) {
      fetchUserAddress();
      if (villa && (villa._id || villa.id)) {
        checkIfVillaIsSaved();
      }
    }
  }, [isSignedIn, authToken, villa]);

  const fetchVillaDetails = async () => {
    try {
      requireApiBaseUrl()
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
      const rawVilla = data.villa || data.room || data.data || data;

      const villaName = rawVilla.name || "Unknown Villa"
      let images = []

      // Get images based on villa name or collection
      images = getBestMatchingVillaImages(villaName)

      const weekendPrice = Number(rawVilla.weekendprice) || Number(rawVilla.weekendPrice) || 0;
      const weekdayPrice = Number(rawVilla.price) || Number(rawVilla.weekdayPrice) || 0;


      const transformedVilla = {
        id: rawVilla._id || rawVilla.id || id,
        _id: rawVilla._id || rawVilla.id || id,
        name: rawVilla.name || villaName,
        location: rawVilla.location || "Perur ECR, Chennai",
        price: weekdayPrice,
        weekendPrice: weekendPrice,
        weekendprice: weekendPrice,
        description: rawVilla.description || "Luxury villa with all modern amenities for a comfortable stay.",
        longDescription: rawVilla.longDescription || "Experience unparalleled luxury in our stunning villa...",
        images: (rawVilla.images && rawVilla.images.length > 0) ? rawVilla.images : images,
        guests: rawVilla.guests || rawVilla.capacity || 10,
        capacity: rawVilla.guests || rawVilla.capacity || 10,
        bedrooms: rawVilla.bedrooms || 4,
        bathrooms: rawVilla.bathrooms || rawVilla.bedrooms || 4,
        rating: rawVilla.rating || 4.8,
        amenities: rawVilla.amenities || [],
        type: rawVilla.type || "VILLA",
      }

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
      requireApiBaseUrl()
      console.log("[VILLA DETAILS] Fetching blocked dates for villa:", villaId)
      const response = await fetch(`${API_BASE_URL}/api/bookings/blocked-dates/${villaId}`)
      if (response.ok) {
        const data = await response.json()
        console.log("[VILLA DETAILS] Received blocked dates:", data.blockedDates)
        console.log("[VILLA DETAILS] Blocked dates count:", data.blockedDates?.length || 0)

        // Log types of blocked dates
        if (data.blockedDates && data.blockedDates.length > 0) {
          const bookingBlocks = data.blockedDates.filter(d => d.type === 'booking');
          const adminBlocks = data.blockedDates.filter(d => d.type === 'blocked');
          console.log(`[VILLA DETAILS] ${bookingBlocks.length} booking blocks, ${adminBlocks.length} admin blocks`);
        }

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
      toast.info("Please log in to book this villa. We've saved your booking details.");
      navigate("/sign-in?redirect=booking")
      return
    }

    if (!checkInDate || !checkOutDate) {
      toast.warning("Please select check-in and check-out dates.");
      return
    }

    if (!villa?.name) {
      toast.error("Villa information is missing. Please refresh the page and try again.");
      return
    }

    setBookingLoading(true)
    setPaymentProcessing(true)
    isBookingInProgress.current = true

    try {
      requireApiBaseUrl()

      if (!checkInDate || !checkOutDate) {
        throw new Error("Please select your check-in and check-out dates.")
      }

      // No amount is computed here. The server prices the stay (base plus service
      // fee plus GST) and returns the order in paise, which is what Razorpay is
      // launched with below -- a locally derived total was how the charged amount
      // and the shown amount drifted apart.
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        throw new Error("Failed to load payment gateway. Please refresh and try again.")
      }


      // The backend is the pricing authority: it calculates the total from villa + dates
      // and ignores any client-supplied amount. Sending villaId, checkIn, and checkOut
      // lets the backend compute the correct price with service fee and GST.
      const orderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          villaId: villa.id || villa._id,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          notes: {
            villaName: villa.name,
            guestName: userData?.name || userData?.firstName || "Guest",
          },
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


      const keyId = orderData.keyId || orderData.key || import.meta.env.VITE_RAZORPAY_KEY
      if (!keyId) {
        throw new Error("The payment gateway is not configured for this site. Please contact us.")
      }

      const options = {
        key: keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "LuxorStay",
        description: `Booking for ${villa.name}`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            requireApiBaseUrl()
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
                  // No amount or night count is sent: the server recomputes both
                  // from the villa and dates and verifies the captured total.
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
              toast.success("Booking Confirmed! Your payment was successful.");
              navigate("/my-bookings", { replace: true });
            } else {
              throw new Error(verifyData.message || "Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast.warning(`Payment processed, but trouble confirming: ${error.message}. Our team will contact you shortly.`);
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
      toast.error(err.message || "There was a problem processing your booking.");
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
        const villaName = navigationVilla.name || ""
        processedImages = getBestMatchingVillaImages(villaName)
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

  // Restore booking data if available
  useEffect(() => {
    if (isSignedIn) {
      // Check if we have pending booking data
      const pendingBookingData = localStorage.getItem('pendingBookingData');
      if (pendingBookingData) {
        try {
          const bookingData = JSON.parse(pendingBookingData);

          // Only restore data if it's for the current villa
          if (bookingData.villaId === id) {
            if (bookingData.checkInDate) setCheckInDate(bookingData.checkInDate);
            if (bookingData.checkOutDate) setCheckOutDate(bookingData.checkOutDate);
            if (bookingData.adults) setAdults(bookingData.adults);
            if (bookingData.children) setChildren(bookingData.children);
            if (bookingData.infants) setInfants(bookingData.infants);
            if (bookingData.bookingStep) setBookingStep(bookingData.bookingStep);

            // Also restore the address state
            if (bookingData.address) {
              setBookingAddress(bookingData.address);
            }

            // Remove the Swal.fire notification
            // Silently restore the user's previous state without interrupting their flow

            // Clear the stored data after restoring
            localStorage.removeItem('pendingBookingData');
          }
        } catch (error) {
          console.error("Error restoring booking data:", error);
        }
      }
    }
  }, [isSignedIn, id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#D4AF37]/10 to-[#BFA181]/10">
        <div className="text-center p-8 rounded-3xl bg-white border border-gray-200">
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


  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 rounded-3xl bg-white border border-gray-200 max-w-md">
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
      {/* Villa Header Banner - Sits naturally below Navbar */}
      <div className="w-full bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-5">
          {/* Navigation & Actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/rooms")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4AF37] transition-all duration-200 group text-sm"
              >
                <ArrowLeft className="h-4 w-4 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline font-medium">Back</span>
              </button>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <button onClick={() => navigate("/")} className="hover:text-[#D4AF37] transition-colors">
                  Home
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                <button onClick={() => navigate("/rooms")} className="hover:text-[#D4AF37] transition-colors">
                  Villas
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-[#D4AF37] font-medium truncate max-w-[240px]">{villa.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm cursor-pointer"
                onClick={async () => {
                  const shareData = {
                    title: `${villa.name} - LuxorStay Holiday Homes`,
                    text: `Check out this amazing villa: ${villa.name} in ${villa.location}. Starting from ₹${villa.price?.toLocaleString()}/night`,
                    url: window.location.href,
                  };

                  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                    try {
                      await navigator.share(shareData);
                    } catch (err) {
                      if (err.name !== 'AbortError') {
                        console.error('Error sharing:', err);
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          toast.success("Villa link copied to clipboard!");
                        } catch {
                          toast.info(`Villa: ${villa.name}`);
                        }
                      }
                    }
                  } else {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Villa link copied to clipboard!");
                    } catch {
                      toast.info("Share URL: " + window.location.href);
                    }
                  }
                }}
              >
                <Share className="h-4 w-4 text-[#D4AF37]" />
                <span className="font-medium text-white hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Villa Title & Info */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-[#D4AF37] leading-tight">{villa.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2.5 py-1 backdrop-blur-sm">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.floor(villa.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-500"
                      }`}
                  />
                ))}
                {/* Real rating only; a random review count and a default 4.5 made
                    every villa look rated when none had been. */}
                <span className="font-semibold ml-1 text-white">{villa.rating ? Number(villa.rating).toFixed(1) : "New"}</span>
              </div>
              <div className="text-gray-300 bg-white/10 rounded-lg px-2.5 py-1 flex items-center gap-1.5 backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>{villa.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white z-40">
        <VillaGallery villa={villa} />
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Guests</p>
              <p className="font-bold text-gray-900">{villa.capacity || villa.guests}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Bed className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bedrooms</p>
              <p className="font-bold text-gray-900">{villa.bedrooms}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center">
              <Bath className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bathrooms</p>
              <p className="font-bold text-gray-900">{villa.bathrooms}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-sm">₹</span>
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
                initialBookingStep={bookingStep}
                initialAddress={bookingAddress}
                onCalendarVisibilityChange={setCalendarOpen}
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
              initialBookingStep={bookingStep}
              initialAddress={bookingAddress}
              onCalendarVisibilityChange={setCalendarOpen}
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
                className="absolute -right-2 -top-2 z-50 bg-white text-gray-700 rounded-full p-2 border border-gray-200 hover:bg-gray-100 transition-all"
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
                  initialBookingStep={bookingStep}
                  initialAddress={bookingAddress}
                  onCalendarVisibilityChange={setCalendarOpen}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
