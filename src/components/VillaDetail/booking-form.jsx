"use client"
import { useState, useEffect } from "react"
import { Calendar, Plus, Minus, Check, Shield, Heart, ChevronRight, Users, CreditCard, Clock, MapPin, Home } from "lucide-react"
import UnifiedCalendar from "../VillaDetail/unified-calender.jsx"
import { getVillaPricing, getPriceForDate } from "../../data/villa-pricing.jsx"
import Swal from "sweetalert2"

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
  blockedDates = [],
}) {
  const [bookingStep, setBookingStep] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)
  
  // Address state
  const [address, setAddress] = useState({
    street: "",
    country: "",
    state: "",
    city: "",
    zipCode: ""
  })
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(false)
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  // Fixed times - no longer changeable by users
  const checkInTime = "14:00 (2:00 PM)" // Fixed check-in time
  const checkOutTime = "12:00 (12:00 PM)" // Fixed check-out time

  // Calculate the number of nights
  const totalNights = checkInDate && checkOutDate 
    ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24)))
    : 0;
  
  // Add this fallback pricing map in the component (before any use of it)
  const villaFallbackPricing = {
    "Amrith Palace": { weekday: 45000, weekend: 65000 },
    "Ram Water Villa": { weekday: 30000, weekend: 45000 },
    "East Coast Villa": { weekday: 15000, weekend: 25000 },
    "Lavish Villa I": { weekday: 18000, weekend: 25000 },
    "Lavish Villa II": { weekday: 18000, weekend: 25000 },
    "Lavish Villa III": { weekday: 16000, weekend: 23000 },
    "Empire Anand Villa Samudra": { weekday: 40000, weekend: 60000 }
  };

  // Get exact prices from villa object with proper fallback
  const weekdayPrice = villa?.price || 0;
  
  // Enhanced weekend price retrieval with fallback logic
  let weekendPrice = villa?.weekendPrice || villa?.weekendprice || 0;
  
  // If weekend price is still 0, use fallback pricing based on villa name
  if (weekendPrice === 0 && villa?.name) {
    // Find matching villa in fallback pricing
    const villaMatch = Object.entries(villaFallbackPricing).find(([name]) => 
      villa.name.toLowerCase().includes(name.toLowerCase())
    );
    
    if (villaMatch) {
      weekendPrice = villaMatch[1].weekend;
      console.log(`Using fallback weekend price for ${villa.name}: ₹${weekendPrice}`);
    } else if (weekdayPrice > 0) {
      // If no match found but weekday price exists, use 1.5x multiplier
      weekendPrice = Math.round(weekdayPrice * 1.5);
      console.log(`No fallback found for ${villa.name}, using 1.5x multiplier: ₹${weekendPrice}`);
    }
  }
  
  // Debug log for prices
  console.log('Booking form prices:', {
    villaName: villa?.name,
    weekdayPrice: weekdayPrice,
    weekendPrice: weekendPrice,
    rawData: villa,
    usingFallback: villa?.weekendPrice === 0 || villa?.weekendprice === 0
  });

  // DEFINE THE FUNCTIONS BEFORE USING THEM
  // Updated calculation function to properly handle weekend prices
  const calculateBasePrice = () => {
    if (!checkInDate || !checkOutDate || !villa) return 0;
    
    try {
      let totalPrice = 0;
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));

      // Include the check-in date in the calculation
      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        
        // Determine if it's a weekend
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
        
        // Apply weekend price if applicable - use our already calculated weekend price
        if (isWeekend) {
          totalPrice += Number(weekendPrice);
        } else {
          totalPrice += Number(weekdayPrice);
        }
      }
      
      return totalPrice;
    } catch (error) {
      console.error("Error calculating base price:", error);
      return 0;
    }
  };

  const calculateTotalAmount = () => {
    if (!checkInDate || !checkOutDate || !villa) return 0
    try {
      let totalPrice = 0
      const startDate = new Date(checkInDate)
      const endDate = new Date(checkOutDate)
  
      const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
      
      // Include the check-in date in the calculation
      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + i)
        totalPrice += getPriceForDate(currentDate, villa)
      }

      const serviceFee = Math.round(totalPrice * 0.05)
      const taxAmount = Math.round((totalPrice + serviceFee) * 0.18)
      return Math.round(totalPrice + serviceFee + taxAmount)
    } catch (error) {
      console.error("Error calculating total amount:", error)
      return 0
    }
  };

  // NOW USE THE FUNCTIONS
  // Calculate the base price
  const basePrice = calculateBasePrice();
  
  // Calculate the total amount
  const totalAmount = calculateTotalAmount();

  // Helper function to format time display
  const formatTimeDisplay = (timeString) => {
    return timeString // Already formatted
  }

  // Helper function to extract 24-hour time for backend
  const extractRailwayTime = (timeString) => {
    // Extract the railway time part from "14:00 (2:00 PM)" format
    if (timeString.includes("(")) {
      return timeString.split(" ")[0] // Returns "14:00"
    }
    return timeString 
  }

  // Enhanced date change handler
  const handleDateChangeWithTime = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      // Both dates selected at once - save immediately and close calendar
      onDateChange(checkIn, checkOut)
      setShowCalendar(false)
    } else if (checkIn && !checkInDate) {
      // New check-in date selected - save it immediately
      onDateChange(checkIn, checkOutDate)
    } else if (checkOut && checkInDate) {
      // New check-out date selected - save it immediately
      onDateChange(checkInDate, checkOut)
      setShowCalendar(false)
    } else {
      // Fallback - save whatever is provided
      onDateChange(checkIn, checkOut)
      if (checkIn && checkOut) {
        setShowCalendar(false)
      }
    }
  }

  // Enhanced booking handler with fixed time and address data
  const handleBookNowWithTime = () => {
    // Check if user is signed in
    if (!isSignedIn) {
      // Save current booking state including address
      const bookingData = {
        checkInDate,
        checkOutDate,
        adults,
        children,
        infants,
        address, // Include address data here
        bookingStep,
        villaId: villa?._id
      };
      
      localStorage.setItem('pendingBookingData', JSON.stringify(bookingData));
      
      // Show message before redirecting to login
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please log in to complete your booking. Your selections will be saved.',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'Continue to Login',
      }).then(() => {
        // Redirect to login
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      });
      
      return;
    }
    
    const bookingData = {
      checkInTime: extractRailwayTime(checkInTime), // Send "14:00" format to backend
      checkOutTime: extractRailwayTime(checkOutTime), // Send "12:00" format to backend
      address: address // Include address data
    }
    onBookNow(bookingData)
  }
  
  // Fetch all countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setCountries(data.data.map(c => ({ name: c.name, code: c.iso2 || '' })));
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchStates = async (country) => {
    if (!country) return;
    
    setIsLoadingStates(true);
    setStates([]);
    setCities([]);
    
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country })
      });
      
      const data = await response.json();
      if (data.data && data.data.states) {
        setStates(data.data.states);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const fetchCities = async (country, state) => {
    if (!country || !state) return;
    
    setIsLoadingCities(true);
    setCities([]);
    
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, state })
      });
      
      const data = await response.json();
      if (data.data) {
        setCities(data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    
    if (name === 'country') {
      fetchStates(value);
      setAddress(prev => ({ ...prev, state: '', city: '' }));
    }
    
    if (name === 'state') {
      fetchCities(address.country, value);
      setAddress(prev => ({ ...prev, city: '' }));
    }
  };

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
          {[1, 2, 3, 4].map((step) => (
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
              {step < 4 && (
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
            {bookingStep === 1 && "📅 Select Dates"}
            {bookingStep === 2 && "👥 Choose Guests"}
            {bookingStep === 3 && "🏠 Enter Address"}
            {bookingStep === 4 && "💳 Confirm & Pay"}
          </h3>
          <p className="text-gray-600 text-sm mt-1">Step {bookingStep} of 4</p>
        </div>

        {/* Price Display - Fix weekend price display */}
        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-4 mb-6 border border-[#D4AF37]/20">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Starting from</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{weekdayPrice?.toLocaleString() || "15,000"}
              <span className="text-base font-normal text-gray-600 ml-1">/ night</span>
            </div>
            <div className="flex justify-center gap-3 mt-2 text-xs">
              <div className="text-gray-600">
                Weekdays: <span className="font-semibold">₹{weekdayPrice?.toLocaleString()}</span>
              </div>
              <div className="text-gray-600">
                Weekends: <span className="font-semibold">₹{weekendPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          {/* Step 1: Date Selection */}
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

              {/* Fixed Time Display - No interaction */}
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
                    <div className="text-lg font-bold text-[#D4AF37]">{formatTimeDisplay(checkInTime)}</div>
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
                    <div className="text-lg font-bold text-[#D4AF37]">{formatTimeDisplay(checkOutTime)}</div>
                  </div>
                </div>
              )}

              {/* Fixed Time Info Note with Clarification */}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-700 text-center">
                  <div className="font-medium mb-1">⏰ Standard Check-in/Check-out Times</div>
                  <div className="space-y-1">
                    <div><span className="font-medium">Check-in:</span> 14:00 (2:00 PM) on arrival day</div>
                    <div><span className="font-medium">Check-out:</span> 12:00 (12:00 PM) on departure day</div>
                    <div>When you select dates {checkInDate && checkOutDate && `(${totalNights} nights)`}, your stay includes all selected days</div>
                  </div>
                </div>
              </div>

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
                <p className="text-xs text-gray-600 mb-2">Maximum {villa?.maxGuests || 15} guests allowed</p>
                {(adults + children) > (villa?.maxGuests || 15) && (
                  <div className="mb-4 p-2 bg-red-50 rounded-md border border-red-200 text-xs text-red-700">
                    <strong>Warning:</strong> You have selected more guests than allowed for this villa. Please reduce the number of guests.
                  </div>
                )}

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
                      disabled={adults + children >= 15}
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
                      disabled={adults + children >= 15}
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

          {/* Step 3: Address Entry */}
          {bookingStep === 3 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-4 border border-[#D4AF37]/20">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-semibold text-gray-900 text-sm">Your Address Details</h4>
                </div>
                <p className="text-xs text-gray-600 mb-4">Please provide your address information for the booking</p>

                <form className="space-y-4">
                  {/* Street Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Street Address</label>
                    <input 
                      type="text" 
                      name="street" 
                      value={address.street} 
                      onChange={handleAddressChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Enter your street address" 
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <select 
                      name="country" 
                      value={address.country} 
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
                      required
                    >
                      <option value="">-- Select Country --</option>
                      {isLoadingCountries ? (
                        <option value="" disabled>Loading countries...</option>
                      ) : (
                        countries.map((country) => (
                          <option key={country.name} value={country.name}>
                            {country.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State/Province</label>
                    <select 
                      name="state" 
                      value={address.state} 
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
                      disabled={!address.country || isLoadingStates}
                      required
                    >
                      <option value="">-- Select State --</option>
                      {isLoadingStates ? (
                        <option value="" disabled>Loading states...</option>
                      ) : (
                        states.map((state) => (
                          <option key={state.name} value={state.name}>
                            {state.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <select 
                      name="city" 
                      value={address.city} 
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
                      disabled={!address.state || isLoadingCities}
                      required
                    >
                      <option value="">-- Select City --</option>
                      {isLoadingCities ? (
                        <option value="" disabled>Loading cities...</option>
                      ) : (
                        cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* ZIP Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                    <input 
                      type="text" 
                      name="zipCode" 
                      value={address.zipCode} 
                      onChange={handleAddressChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Enter ZIP code" 
                      required
                    />
                  </div>
                </form>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  onClick={() => {
                    // Validate address fields
                    if (!address.street || !address.country || !address.state || !address.city || !address.zipCode) {
                      Swal.fire({
                        icon: 'warning',
                        title: 'Missing Information',
                        text: 'Please fill in all address fields to continue.',
                        confirmButtonColor: '#D4AF37',
                      });
                      return;
                    }
                    
                    setBookingStep(4);
                  }}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  Continue to Review
                </button>
                <button
                  onClick={() => setBookingStep(2)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
                >
                  Back to Guests
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Booking Summary */}
          {bookingStep === 4 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 rounded-xl p-4 border border-[#D4AF37]/20">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-semibold text-gray-900 text-sm">Booking Summary</h4>
                </div>                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dates ({totalNights} {totalNights === 1 ? 'night' : 'nights'}):</span>
                      <span className="font-medium text-xs">
                        {checkInDate &&
                          checkOutDate &&
                          `${new Date(checkInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(checkOutDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in (arrival):</span>
                      <span className="font-medium text-xs">{formatTimeDisplay(checkInTime)} on {new Date(checkInDate).toLocaleDateString("en-US", {month: "short", day: "numeric"})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out (departure):</span>
                      <span className="font-medium text-xs">{formatTimeDisplay(checkOutTime)} on {new Date(checkOutDate).toLocaleDateString("en-US", {month: "short", day: "numeric"})}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium text-xs">
                      {adults + children} guest{adults + children !== 1 ? "s" : ""} 
                      {infants > 0 ? ` + ${infants} infant${infants !== 1 ? "s" : ""}` : ""}
                      <span className="text-xs text-gray-500 ml-1">
                        (Max: {villa?.maxGuests || 15})
                      </span>
                      {adults + children} Adults/Children{infants > 0 ? `, ${infants} Infants` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked by:</span>
                    <span className="font-medium text-xs">{userData?.name || userData?.email || "Guest User"}</span>
                  </div>
                  
                
                  {address.street && address.country && (
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p className="font-medium text-sm text-gray-700 mb-1">Booking Address:</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {address.street}, {address.city}, {address.state}, {address.country}, {address.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
                onClick={() => {
                  const maxGuests = villa?.maxGuests || 15;
                  
                  if ((adults + children) > maxGuests) {
                    
                    Swal.fire({
                      icon: 'error',
                      title: 'Guest Limit Exceeded',
                      text: `This villa allows a maximum of ${maxGuests} guests. Please reduce the number of guests to continue.`,
                      confirmButtonText: 'OK',
                      confirmButtonColor: '#D4AF37',
                    });
                    return;
                  }
                  
                  setBookingStep(3); 
                }}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Continue to Address
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
                onClick={() => setBookingStep(2)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
              >
                Back to Guests
              </button>
            </div>
          )}

          {bookingStep === 4 && (
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
              blockedDates={blockedDates}
            />
          </div>
        </div>
      )}
    </div>
  )
}