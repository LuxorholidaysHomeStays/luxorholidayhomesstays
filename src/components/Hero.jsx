"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaUtensils, FaWifi, FaSwimmingPool, FaStar } from "react-icons/fa"
import { FiChevronDown } from "react-icons/fi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import backgroundVideo from "../assets/About/v.mp4"
import { Popover } from "@headlessui/react"
import { Minus, Plus, Users, X } from "lucide-react"

// Booking form component to be reused in mobile and desktop
const BookingFormSection = ({
  formRef,
  searchParams,
  datePickerOpen,
  setDatePickerOpen,
  handleDateChange,
  totalNights,
  adults,
  children,
  infants,
  setAdults,
  setChildren,
  setInfants,
  showLocationDropdown,
  setShowLocationDropdown,
  locationDropdownRef,
  handleLocationSelect,
  locations,
  error,
  loading,
  handleSearch,
  amenities,
  datePickerWrapperStyles,
  isDesktop = false
}) => {
  return (
    <motion.div
      className={`${isDesktop ? "lg:w-full" : ""} mt-6 lg:mt-0 w-full max-w-md mx-auto lg:max-w-2xl hero-tilt-card`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      ref={formRef}
      onMouseMove={isDesktop ? (e) => {
        if (formRef.current) {
          const rect = formRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          
          formRef.current.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        }
      } : undefined}
      onMouseLeave={isDesktop ? () => {
        if (formRef.current) {
          formRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        }
      } : undefined}
    >
      <div className="backdrop-blur-lg bg-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl border border-[#D4AF37]/30 relative overflow-hidden"
           style={{
             boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 30px -15px rgba(212, 175, 55, 0.35)"
           }}
      >
        {/* Decorative elements for unique look */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-[#D4AF37]/15 to-transparent rounded-full blur-xl"></div>
        {/* Booking Form Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Book Your Villa</h3>
            <p className="text-sm text-[#D4AF37]/90 mt-1">Luxury awaits your arrival</p>
          </div>
          <div className="bg-[#D4AF37]/20 p-2 rounded-full">
            <FaCalendarAlt className="text-[#D4AF37] h-5 w-5" />
          </div>
        </div>
        
        {/* Price Display */}
        <div className="bg-gradient-to-r from-black/40 to-black/60 rounded-2xl p-4 mb-5 border border-[#D4AF37]/20">
          <div className="text-center">
            <div className="text-sm text-[#D4AF37]/80 mb-1">Starting from</div>
            <div className="text-xl font-bold text-white">
              ₹15,000
              <span className="text-base font-normal text-gray-300 ml-1">/ night</span>
            </div>
            <div className="flex justify-center gap-2 mt-1 text-xs">
              <div className="text-gray-300">
                Weekdays: <span className="font-semibold text-white">₹15,000</span>
              </div>
              <div className="text-gray-300">
                Weekends: <span className="font-semibold text-white">₹25,000</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 hero-form">
          {/* Date Selection */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div style={datePickerWrapperStyles}>
                <label htmlFor="checkIn" className="block text-[#D4AF37] text-sm font-medium mb-1">
                  <FaCalendarAlt className="inline mr-2 text-[#D4AF37]" /> Check-in
                </label>
                <DatePicker
                  id="checkIn"
                  selected={searchParams.checkIn ? new Date(searchParams.checkIn) : null}
                  onChange={(date) => handleDateChange(date, "checkIn")}
                  onCalendarOpen={() => setDatePickerOpen(true)}
                  onCalendarClose={() => setDatePickerOpen(false)}
                  className="w-full p-2 bg-black/40 text-white border border-[#D4AF37]/30 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent hero-gold-focus"
                  placeholderText="Select date"
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  popperClassName="z-[1000]"
                  popperPlacement="bottom-start"
                  required
                />
              </div>

              <div style={datePickerWrapperStyles}>
                <label htmlFor="checkOut" className="block text-[#D4AF37] text-sm font-medium mb-1">
                  <FaCalendarAlt className="inline mr-2 text-[#D4AF37]" /> Check-out
                </label>
                <DatePicker
                  id="checkOut"
                  selected={searchParams.checkOut ? new Date(searchParams.checkOut) : null}
                  onChange={(date) => handleDateChange(date, "checkOut")}
                  onCalendarOpen={() => setDatePickerOpen(true)}
                  onCalendarClose={() => setDatePickerOpen(false)}
                  className="w-full p-2 bg-black/40 text-white border border-[#D4AF37]/30 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent hero-gold-focus"
                  placeholderText="Select date"
                  dateFormat="yyyy-MM-dd"
                  minDate={
                    searchParams.checkIn
                      ? new Date(new Date(searchParams.checkIn).getTime() + 86400000)
                      : new Date(new Date().getTime() + 86400000)
                  }
                  popperClassName="z-[1000]"
                  popperPlacement="bottom-start"
                  required
                />
              </div>
            </div>

            {searchParams.checkIn && searchParams.checkOut && (
              <div className="bg-[#D4AF37]/10 rounded-xl p-3 border border-[#D4AF37]/20">
                <div className="text-center">
                  <div className="text-[#D4AF37] font-semibold">
                    {totalNights} night{totalNights > 1 ? "s" : ""} selected
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {new Date(searchParams.checkIn).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    to{" "}
                    {new Date(searchParams.checkOut).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Guests and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Guests */}
            <div>
              <label className="block text-[#D4AF37] text-sm font-medium mb-1">
                <Users className="inline h-4 w-4 mr-2 text-[#D4AF37]" /> Guests
              </label>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button className="w-full flex justify-between items-center border border-[#D4AF37]/30 bg-black/40 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent hero-gold-focus">
                      <span>{adults + children + infants} Guests</span>
                      <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-20 mt-2 w-full max-w-full bg-gray-900 rounded-xl shadow-2xl p-4 space-y-4 left-0 border border-[#D4AF37]/20">
                      <div className="space-y-3">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white">Adults</div>
                            <div className="text-xs text-gray-400">Age 13+</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="p-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-50"
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              disabled={adults <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center text-white">{adults}</span>
                            <button
                              type="button"
                              className="p-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              onClick={() => setAdults(adults + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {/* Children */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white">Children</div>
                            <div className="text-xs text-gray-400">Age 3-12</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="p-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-50"
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              disabled={children <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center text-white">{children}</span>
                            <button
                              type="button"
                              className="p-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              onClick={() => setChildren(children + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {/* Infants */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white">Infants</div>
                            <div className="text-xs text-gray-400">Under 2</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="p-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-50"
                              onClick={() => setInfants(Math.max(0, infants - 1))}
                              disabled={infants <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center text-white">{infants}</span>
                            <button
                              type="button"
                              className="p-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              onClick={() => setInfants(infants + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </>
                )}
              </Popover>
            </div>

            {/* Location with custom dropdown */}
            <div className="relative" ref={locationDropdownRef}>
              <label htmlFor="destination" className="block text-[#D4AF37] text-sm font-medium mb-1">
                <FaMapMarkerAlt className="inline mr-2 text-[#D4AF37]" /> Location
              </label>
              <button
                type="button"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="w-full p-2 bg-black/40 text-white border border-[#D4AF37]/30 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent flex justify-between items-center hero-gold-focus"
              >
                <span>{searchParams.destination || "Select location"}</span>
                <FiChevronDown className={`transition-transform ${showLocationDropdown ? "rotate-180" : ""}`} />
              </button>
              
              {showLocationDropdown && (
                <div
                  className="absolute z-20 mt-1 w-full rounded-md bg-gray-900 shadow-lg border border-[#D4AF37]/30 overflow-hidden hero-location-option"
                >
                  <div className="max-h-60 overflow-auto py-1">
                    {locations.map((location) => (
                      <button
                        key={location}
                        type="button"
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full px-4 py-2 text-left hover:bg-[#D4AF37]/20 transition-colors ${searchParams.destination === location ? 'bg-[#D4AF37]/30 text-[#D4AF37]' : 'text-gray-300'}`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Hidden input for form validation */}
              <input 
                type="hidden" 
                id="destination" 
                value={searchParams.destination} 
                required
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              className="bg-red-500/80 text-white px-3 py-2 rounded-md text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Added perks/amenities */}
          <div className="flex flex-wrap gap-2 justify-center">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center text-xs text-white bg-[#D4AF37]/10 px-2 py-1 rounded-full border border-[#D4AF37]/20">
                <span className="mr-1.5 text-[#D4AF37]">{amenity.icon}</span>
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full py-3 hero-gold-gradient text-white font-bold rounded-lg relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.02]"
            disabled={loading}
            style={{ letterSpacing: "0.05em" }}
          >
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
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
                  Searching...
                </>
              ) : (
                <>
                  Search Availability
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
          
          {/* Booking security note */}
          <div className="text-center text-xs text-gray-400">
            <span className="flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#D4AF37]">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
              Secure booking • No credit card required
            </span>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Helper for navbar height detection
const useNavbarHeight = () => {
  const [navbarHeight, setNavbarHeight] = useState(0)
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar =
        document.querySelector("header nav") || document.querySelector("header") || document.querySelector("nav")

      if (navbar) {
        setNavbarHeight(navbar.offsetHeight)
      } else {
        setNavbarHeight(80) // Default height if navbar not found
      }
    }

    setTimeout(updateNavbarHeight, 100)
    window.addEventListener("resize", updateNavbarHeight)
    return () => window.removeEventListener("resize", updateNavbarHeight)
  }, [])
  return navbarHeight
}

const Hero = () => {
  const navbarHeight = useNavbarHeight()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const formRef = useRef(null)
  const locationDropdownRef = useRef(null)

  // Text animation
  const [displayText, setDisplayText] = useState("")
  const fullText = "Comfort"
  
  // For 3D effect
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)

  // Booking form state
  const [searchParams, setSearchParams] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTableReservation, setShowTableReservation] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  // Add local state for guests
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  // DatePicker z-index management
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  // Typewriter effect for "Comfort"
  useEffect(() => {
    if (displayText.length < fullText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1))
      }, 150)
      
      return () => clearTimeout(timeoutId)
    }
  }, [displayText])
  
  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Sync guest state with searchParams
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      adults,
      children,
      infants,
    }))
    // eslint-disable-next-line
  }, [adults, children, infants])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setSearchParams((prev) => ({
      ...prev,
      [id]: Number.parseInt(value, 10),
    }))
  }

  const handleDateChange = (date, field) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().split("T")[0] : "",
    }))
  }

  const handleLocationSelect = (location) => {
    setSearchParams({
      ...searchParams,
      destination: location
    })
    setShowLocationDropdown(false)
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (
      !searchParams.destination ||
      !searchParams.checkIn ||
      !searchParams.checkOut ||
      searchParams.adults < 1
    ) {
      setError("Please fill in all search fields (at least 1 adult required)")
      return
    }
    // Validate dates: checkOut must be after checkIn
    if (new Date(searchParams.checkIn) >= new Date(searchParams.checkOut)) {
      setError("Check-out date must be after check-in date.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formattedDestination =
        searchParams.destination.charAt(0).toUpperCase() +
        searchParams.destination.slice(1).toLowerCase()

      navigate(
        `/search-results?location=${formattedDestination}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&adults=${searchParams.adults}&children=${searchParams.children}`,
      )
    } catch (err) {
      console.error("Search error:", err)
      setError(err.message || "Error searching for properties")
    } finally {
      setLoading(false)
    }
  }

  // Handle video loaded event
  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  // Handle mobile devices better
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (videoRef.current) {
      if (isMobile) {
        // Mobile optimizations
        videoRef.current.setAttribute('playsinline', '')
        videoRef.current.setAttribute('muted', '')
        videoRef.current.setAttribute('loop', '')
        videoRef.current.play().catch(err => console.log('Auto-play prevented:', err))
        setVideoLoaded(true)
      }
    }
  }, [])

  // Amenities for the left side
  const amenities = [
    { icon: <FaWifi className="w-5 h-5" />, name: "Free WiFi" },
    { icon: <FaSwimmingPool className="w-5 h-5" />, name: "Swimming Pool" },
    { icon: <FaStar className="w-5 h-5" />, name: "5-Star Service" },
  ]

  // Available locations - keeping only Chennai and Pondicherry
  const locations = ["Chennai", "Pondicherry"]

  // Calculate total nights between check-in and check-out
  const totalNights =
    searchParams.checkIn && searchParams.checkOut
      ? Math.ceil((new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) / (1000 * 3600 * 24))
      : 0
      
  // Custom date picker styles to fix z-index issues
  const datePickerWrapperStyles = {
    position: "relative",
    zIndex: datePickerOpen ? 1000 : 1,
  }
  
  // Custom styles for Hero component only - SCOPED to avoid navbar conflicts
  const heroStyles = `
    /* Typewriter effect */
    .hero-typewriter-cursor::after {
      content: '|';
      display: inline-block;
      color: #D4AF37;
      animation: heroTypeBlink 1s step-end infinite;
      margin-left: 2px;
    }
    
    @keyframes heroTypeBlink {
      from, to { opacity: 1; }
      50% { opacity: 0; }
    }
    
    /* Gold gradient for buttons */
    .hero-gold-gradient {
      background: linear-gradient(to right, #D4AF37, #BFA181);
    }
    
    /* Gold text */
    .hero-gold-text {
      color: #D4AF37;
    }
    
    /* Custom styles for form inputs */
    .hero-form input[type="date"], 
    .hero-form select, 
    .hero-form .custom-dropdown-btn {
      color-scheme: dark;
    }
    
    .hero-form input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
    }
    
    /* Gold focus styles */
    .hero-gold-focus:focus {
      border-color: #D4AF37 !important;
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.25) !important;
    }
    
    /* 3D Tilt animation */
    .hero-tilt-card {
      transform-style: preserve-3d;
      transition: transform 0.1s ease;
    }
    
    @media (min-width: 1024px) {
      /* Enhanced desktop styling */
      .hero-tilt-card {
        transition: transform 0.2s ease, box-shadow 0.3s ease;
      }
      
      .hero-tilt-card:hover {
        box-shadow: 0 20px 70px -20px rgba(0, 0, 0, 0.6), 0 0 40px -15px rgba(212, 175, 55, 0.45);
      }
    }
    
    /* Location dropdown options */
    .hero-location-option {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      background-color: #111 !important;
    }
    
    /* Hero container - ensure it doesn't affect navbar */
    .hero-container {
      position: relative;
      z-index: 1;
    }
    
    /* React datepicker override styles */
    .react-datepicker {
      font-family: inherit !important;
      border: 1px solid #D4AF37 !important;
      background-color: #1a1a1a !important;
      border-radius: 0.5rem !important;
      overflow: hidden !important;
      z-index: 1000 !important;
    }
    
    .react-datepicker__header {
      background-color: #111 !important;
      border-bottom: 1px solid #333 !important;
      padding-top: 10px !important;
      padding-bottom: 8px !important;
    }
    
    .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
      color: #fff !important;
    }
    
    .react-datepicker__day:hover, .react-datepicker__month-text:hover, 
    .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover {
      background-color: rgba(212, 175, 55, 0.2) !important;
    }
    
    .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
      background-color: #D4AF37 !important;
      color: #000 !important;
    }
    
    /* Responsive font sizes for better mobile display */
    @media (max-width: 640px) {
      .hero-container h1 {
        font-size: 2.25rem;
      }
      
      .hero-container p {
        font-size: 0.9rem;
      }
    }
  `

  return (
    <div
      className="hero-container relative w-full overflow-hidden"
      style={{
        minHeight: `calc(110vh - ${navbarHeight}px)`, /* Reduced from 100vh to 90vh */
        marginTop: 0, 
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Add scoped styles that won't affect the navbar */}
      <style>{heroStyles}</style>
      
      {/* Video Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/40 z-10" />
        <motion.div
          className="w-full h-full"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoaded}
            poster="/placeholder-luxury-villa.jpg"
          >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </motion.div>

      {/* Loading overlay that fades out when video is ready */}
      {!videoLoaded && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: videoLoaded ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="text-[#D4AF37] text-xl mb-6 font-light tracking-wider"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Luxury Experience...
          </motion.div>
          
          <motion.div
            className="w-24 h-1 bg-[#D4AF37]/30 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 flex items-center h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16">
            {/* Left side - Text Content */}
            <motion.div
              className="lg:w-5/12 text-white w-full max-w-xl order-1 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.p
                className="text-sm sm:text-base md:text-lg font-light mb-2 text-[#D4AF37] tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome to Luxor Villa
              </motion.p>
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Your Kingdom of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E6CA] hero-typewriter-cursor">{displayText}</span>
              </motion.h1>
              <motion.p
                className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-200 max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience unparalleled luxury in our exclusive villas, where every detail is crafted for your ultimate
                relaxation and pleasure.
              </motion.p>
              
              {/* Mobile booking form will appear here on small screens */}
              <div className="block lg:hidden w-full mb-10">
                <BookingFormSection 
                  formRef={formRef}
                  searchParams={searchParams}
                  datePickerOpen={datePickerOpen}
                  setDatePickerOpen={setDatePickerOpen}
                  handleDateChange={handleDateChange}
                  totalNights={totalNights}
                  adults={adults}
                  children={children}
                  infants={infants}
                  setAdults={setAdults}
                  setChildren={setChildren}
                  setInfants={setInfants}
                  showLocationDropdown={showLocationDropdown}
                  setShowLocationDropdown={setShowLocationDropdown}
                  locationDropdownRef={locationDropdownRef}
                  handleLocationSelect={handleLocationSelect}
                  locations={locations}
                  error={error}
                  loading={loading}
                  handleSearch={handleSearch}
                  amenities={amenities}
                  datePickerWrapperStyles={datePickerWrapperStyles}
                />
              </div>
              
              {/* Enhanced Feature Highlights */}
              <motion.div
                className="mt-8 mb-6 space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h3 className="text-lg font-medium text-[#D4AF37]">Villa Highlights</h3>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Feature 1: Premium Locations */}
                  <motion.div
                    className="bg-black/30 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-4 hover:border-[#D4AF37]/40 transition-all"
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 0 15px rgba(212, 175, 55, 0.15)" 
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181] p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-white">Premium Locations</h4>
                    </div>
                    <p className="text-xs text-gray-300 ml-10">Stunning views in Chennai and Pondicherry's most desirable areas</p>
                  </motion.div>
                  
                  {/* Feature 2: Virtual Tour */}
                  <motion.div
                    className="bg-black/30 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-4 hover:border-[#D4AF37]/40 transition-all group cursor-pointer"
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 0 15px rgba(212, 175, 55, 0.15)" 
                    }}
                    onClick={() => {
                      // Virtual tour functionality can be added here
                      console.log("Virtual tour clicked");
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA181] p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-white">Virtual Tour</h4>
                    </div>
                    <div className="flex items-center justify-between ml-10">
                      <p className="text-xs text-gray-300">Experience our properties before booking</p>
                      <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Mobile Amenities removed as requested */}
              </motion.div>
            </motion.div>

            {/* Right side - Booking Form - Only visible on desktop */}
            <div className="hidden lg:block lg:w-7/12 order-2 lg:order-2">
              <BookingFormSection 
                formRef={formRef}
                searchParams={searchParams}
                datePickerOpen={datePickerOpen}
                setDatePickerOpen={setDatePickerOpen}
                handleDateChange={handleDateChange}
                totalNights={totalNights}
                adults={adults}
                children={children}
                infants={infants}
                setAdults={setAdults}
                setChildren={setChildren}
                setInfants={setInfants}
                showLocationDropdown={showLocationDropdown}
                setShowLocationDropdown={setShowLocationDropdown}
                locationDropdownRef={locationDropdownRef}
                handleLocationSelect={handleLocationSelect}
                locations={locations}
                error={error}
                loading={loading}
                handleSearch={handleSearch}
                amenities={amenities}
                datePickerWrapperStyles={datePickerWrapperStyles}
                isDesktop={true}
              />
            </div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-5 right-5 z-30 opacity-0 hover:opacity-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button 
          className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full border border-[#D4AF37]/20"
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            boxShadow: "0 0 10px rgba(212, 175, 55, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
            }
          }}
        >
          {videoRef.current?.paused ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Hero
