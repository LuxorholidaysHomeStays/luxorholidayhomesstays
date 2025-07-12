"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaUtensils, FaWifi, FaSwimmingPool, FaStar } from "react-icons/fa"
import { FiChevronDown } from "react-icons/fi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import backgroundVideo from "../assets/About/v.mp4"
import { Popover } from "@headlessui/react"
import { Minus, Plus, Users, X } from "lucide-react"
import PremiumLocationsModal from './PremiumLocationsModal';
import './PremiumLocationsModal.css';

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
  handleLocationSelect,
  locations,
  error,
  loading,
  handleSearch,
  amenities,
  datePickerWrapperStyles,
  isMobile,
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
              <span className="text-base font-normal text-[#D4AF37]/80 ml-1">/ night</span>
            </div>
            <div className="flex justify-center gap-2 mt-1 text-xs">
              <div className="text-[#D4AF37]/70">
                Weekdays: <span className="font-semibold text-[#D4AF37]">₹15,000</span>
              </div>
              <div className="text-[#D4AF37]/70">
                Weekends: <span className="font-semibold text-[#D4AF37]">₹25,000</span>
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
                  className="w-full p-2 bg-black/40 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent hero-gold-focus"
                  placeholderText="Select date"
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  popperClassName="z-[1000]"
                  popperPlacement={isMobile ? "top-start" : "bottom-start"}
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
                  className="w-full p-2 bg-black/40 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent hero-gold-focus"
                  placeholderText="Select date"
                  dateFormat="yyyy-MM-dd"
                  minDate={
                    searchParams.checkIn
                      ? new Date(new Date(searchParams.checkIn).getTime() + 86400000)
                      : new Date(new Date().getTime() + 86400000)
                  }
                  popperClassName="z-[1000]"
                  popperPlacement={isMobile ? "top-start" : "bottom-start"}
                  required
                />
              </div>
            </div>

            {searchParams.checkIn && searchParams.checkOut && (
              <div className="bg-[#D4AF37]/10 rounded-xl p-3 border border-[#D4AF37]/20">
                <div className="text-center">
                  <div className="text-[#D4AF37] font-semibold text-lg">
                    {totalNights} night{totalNights > 1 ? "s" : ""} selected
                  </div>
                  <div className="text-sm text-[#D4AF37]/90 mt-1 font-medium">
                    {new Date(searchParams.checkIn).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    <span className="text-white/70">to</span>{" "}
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
                      <span><span className="text-[#D4AF37] font-medium">{adults + children + infants}</span> Guests</span>
                      <FiChevronDown className={`transition-transform text-[#D4AF37] ${open ? "rotate-180" : ""}`} />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-20 mt-2 w-full max-w-full bg-gray-900 rounded-xl shadow-2xl p-4 space-y-4 left-0 border border-[#D4AF37]/20">
                      <div className="space-y-3">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-[#D4AF37]">Adults</div>
                            <div className="text-xs text-[#D4AF37]/70">Age 13+</div>
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
                            <span className="w-6 text-center text-[#D4AF37] font-medium">{adults}</span>
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
                            <div className="font-medium text-[#D4AF37]">Children</div>
                            <div className="text-xs text-[#D4AF37]/70">Age 3-12</div>
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
                            <span className="w-6 text-center text-[#D4AF37] font-medium">{children}</span>
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
                            <div className="font-medium text-[#D4AF37]">Infants</div>
                            <div className="text-xs text-[#D4AF37]/70">Under 2</div>
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
                            <span className="w-6 text-center text-[#D4AF37] font-medium">{infants}</span>
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

            {/* Location with Popover component (matching Guests style) */}
            <div>
              <label htmlFor="destination" className="block text-[#D4AF37] text-sm font-medium mb-1">
                <FaMapMarkerAlt className="inline mr-2 text-[#D4AF37]" /> Location
              </label>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button className="w-full flex justify-between items-center border border-[#D4AF37]/30 bg-black/40 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent hero-gold-focus">
                      <span>{searchParams.destination ? <span className="text-[#D4AF37] font-medium">{searchParams.destination}</span> : "Select location"}</span>
                      <FiChevronDown className={`transition-transform text-[#D4AF37] ${open ? "rotate-180" : ""}`} />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-20 mt-2 w-full max-w-full bg-gray-900 rounded-xl shadow-2xl p-4 space-y-4 left-0 border border-[#D4AF37]/20">
                      <div className="space-y-2">
                        {locations.map((location) => (
                          <button
                            key={location}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                              searchParams.destination === location 
                                ? 'bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/10 text-[#D4AF37] font-bold' 
                                : 'text-[#D4AF37]/90 hover:bg-[#D4AF37]/20 active:bg-[#D4AF37]/30'
                            }`}
                          >
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-2.5 text-[#D4AF37] h-4 w-4" />
                              {location}
                            </div>
                          </button>
                        ))}
                      </div>
                    </Popover.Panel>
                  </>
                )}
              </Popover>
              
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
              <div key={index} className="flex items-center text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/5">
                <span className="mr-1.5 text-[#D4AF37]">{amenity.icon}</span>
                <span className="font-medium">{amenity.name}</span>
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
                      d="M4 12a8 8 0 008-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
  const [videoLoaded, setVideoLoaded] = useState(true) // Set to true to skip video loading
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  // Add local state for guests
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  // DatePicker z-index management
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Typewriter effect for "Comfort"
  useEffect(() => {
    if (displayText.length < fullText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1))
      }, 150)
      
      return () => clearTimeout(timeoutId)
    }
  }, [displayText])
  
  // No longer need the custom location dropdown handling as we're using Popover

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
    // Update the destination in searchParams
    setSearchParams((prev) => ({
      ...prev,
      destination: location
    }))
    
    // Add haptic feedback for mobile devices if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50) // Short vibration for feedback
    }
    
    // Dismiss keyboard on mobile
    if (document.activeElement) {
      document.activeElement.blur()
    }
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
        `/search-results?location=${formattedDestination}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&adults=${searchParams.adults}&children=${searchParams.children}`
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
    setLoadingTimeout(false)
    // Hide the HTML preloader when video is ready
    if (window.hideAppPreloader) {
      window.hideAppPreloader()
    }
  }

  // Handle mobile devices and call preloader hide
  useEffect(() => {
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    // Set a timeout to hide loading if video takes too long
    const loadingTimer = setTimeout(() => {
      setLoadingTimeout(true)
      setVideoLoaded(true)
      // Force hide preloader even if video not loaded
      if (window.hideAppPreloader) {
        window.hideAppPreloader()
      }
    }, 2000) // 2 second timeout
    
    if (videoRef.current) {
      if (isMobile) {
        // Mobile optimizations
        videoRef.current.setAttribute('playsinline', '')
        videoRef.current.setAttribute('muted', '')
        videoRef.current.setAttribute('loop', '')
        videoRef.current.play().catch(err => {
          console.log('Auto-play prevented:', err)
          setVideoLoaded(true)
          if (window.hideAppPreloader) {
            window.hideAppPreloader()
          }
        })
      }
    }

    // Always hide preloader after component mounts
    setTimeout(() => {
      if (window.hideAppPreloader) {
        window.hideAppPreloader()
      }
    }, 1000)

    return () => clearTimeout(loadingTimer)
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
    ...(isMobile && {
      position: "static", // This helps with positioning the calendar above on mobile
    })
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
      box-shadow: 0 4px 15px -3px rgba(212, 175, 55, 0.3), 0 2px 5px -2px rgba(212, 175, 55, 0.2);
    }
    
    /* Gold text */
    .hero-gold-text {
      color: #D4AF37;
    }
    
    /* Luxury gold styling */
    .luxury-gold {
      color: #D4AF37;
      text-shadow: 0 0 2px rgba(212, 175, 55, 0.2);
    }
    
    .luxury-gold-bg {
      background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
      background-size: 200% 200%;
      animation: goldShimmer 2s infinite;
      -webkit-background-clip: text;
      color: transparent;
      text-shadow: 0 0 5px rgba(212, 175, 55, 0.2);
    }
    
    @keyframes goldShimmer {
      0% {background-position: 0% 50%}
      50% {background-position: 100% 50%}
      100% {background-position: 0% 50%}
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
    
    /* Calendar gold styling */
    .react-datepicker-wrapper input::placeholder {
      color: rgba(212, 175, 55, 0.7) !important;
    }
    
    /* Navigation arrows */
    .react-datepicker__navigation-icon::before {
      border-color: #D4AF37 !important;
    }
    
    .react-datepicker__navigation:hover *::before {
      border-color: #D4AF37 !important;
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
    
    /* Location dropdown options - Enhanced for mobile */
    .hero-location-option {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      background-color: #111 !important;
      z-index: 999999 !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
    }
    
    /* Better mobile touch targets */
    @media (max-width: 768px) {
      .hero-location-option {
        position: fixed !important;
        left: 3vw !important;
        right: 3vw !important;
        width: 94vw !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        border-radius: 16px !important;
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.2) !important;
        border: 2px solid rgba(212, 175, 55, 0.3) !important;
      }
      
      /* Location buttons */
      .hero-location-option button {
        min-height: 64px !important;
        font-size: 20px !important; /* Even larger for better visibility */
        padding: 1rem !important;
        border-bottom: 1px solid rgba(212, 175, 55, 0.1) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        -webkit-tap-highlight-color: rgba(212, 175, 55, 0.3) !important;
      }
      
      .hero-location-option button:last-child {
        border-bottom: none !important;
      }
      
      /* Improved feedback for touch */
      .hero-location-option button:active {
        background-color: rgba(212, 175, 55, 0.4) !important;
        transform: scale(0.98);
      }
    }
    
    /* Animation for selection success */
    .location-selection-success {
      animation: locationSelectionPulse 0.3s ease-in-out;
    }
    
    @keyframes locationSelectionPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    
    /* Make sure buttons are truly interactive */
    button {
      cursor: pointer;
      touch-action: manipulation;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* Location dropdown - mobile specific fixes */
    .location-dropdown {
      display: block !important; /* Force display */
    }
    
    @media (max-width: 640px) {
      .location-dropdown {
        margin-top: 0 !important; /* Remove margin on mobile */
      }
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
      color: #D4AF37 !important;
    }
    
    /* Mobile date picker position fixes */
    @media (max-width: 767px) {
      .react-datepicker-popper[data-placement^="top"] {
        margin-bottom: 10px !important;
      }
      
      .react-datepicker__triangle {
        display: none !important; /* Hide the triangle on mobile */
      }
      
      /* Ensure the calendar is properly positioned above input */
      .react-datepicker-popper {
        transform: translate3d(0, 0, 0) !important;
        position: fixed !important;
        bottom: auto !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 90% !important;
        max-width: 320px !important;
      }
    }
    
    .react-datepicker__header {
      background-color: #111 !important;
      border-bottom: 1px solid #D4AF37 !important;
      padding-top: 10px !important;
      padding-bottom: 8px !important;
    }
    
    /* Gold styling for day names in calendar header */
    .react-datepicker__day-name {
      color: #D4AF37 !important;
      font-weight: 600 !important;
    }
    
    /* Gold styling for month and year in header */
    .react-datepicker__current-month, 
    .react-datepicker-year-header {
      color: #D4AF37 !important;
      font-weight: bold !important;
    }
    
    /* Regular days styling */
    .react-datepicker__day {
      color: #D4AF37 !important;
      border-radius: 50% !important;
    }
    
    /* Outside month days styling */
    .react-datepicker__day--outside-month {
      color: #D4AF37 !important;
      opacity: 0.5 !important;
    }
    
    /* Hover effects */
    .react-datepicker__day:hover, 
    .react-datepicker__month-text:hover, 
    .react-datepicker__quarter-text:hover, 
    .react-datepicker__year-text:hover {
      background-color: rgba(212, 175, 55, 0.2) !important;
      color: #D4AF37 !important;
    }
    
    /* Selected day styling */
    .react-datepicker__day--selected, 
    .react-datepicker__day--in-selecting-range, 
    .react-datepicker__day--in-range {
      background-color: #D4AF37 !important;
      color: #000 !important;
      font-weight: bold !important;
    }
    
    /* Today's date highlight */
    .react-datepicker__day--today {
      border: 1px solid #D4AF37 !important;
      background-color: rgba(212, 175, 55, 0.1) !important;
      font-weight: bold !important;
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

  // State for Premium Locations modal
  const [premiumLocationsOpen, setPremiumLocationsOpen] = useState(false);
  const [modalClickPosition, setModalClickPosition] = useState(null);

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
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/40 z-10" />
        <motion.div className="w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoaded}
            onCanPlay={handleVideoLoaded}
            onLoadedMetadata={handleVideoLoaded}
            poster="/placeholder-luxury-villa.jpg"
          >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center h-full w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-20 sm:pt-24 lg:pt-12">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#F0E6CA] hero-typewriter-cursor" style={{textShadow: "0 0 5px rgba(212, 175, 55, 0.3)"}}>{displayText}</span>
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
                  isMobile={isMobile}
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
                  {/* Feature 1: Virtual Tour */}
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
                  
                  {/* Feature 2: Premium Locations */}
                  <motion.div
                    className="bg-black/30 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-4 hover:border-[#D4AF37]/40 transition-all group cursor-pointer premium-location-button"
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 0 15px rgba(212, 175, 55, 0.15)" 
                    }}
                    onClick={(e) => {
                      // Store click position for mobile animation
                      const rect = e.currentTarget.getBoundingClientRect();
                      setModalClickPosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      });
                      setPremiumLocationsOpen(true);
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
                    <div className="flex items-center justify-between ml-10">
                      <p className="text-xs text-gray-300">Discover our exclusive villas in Chennai & Pondicherry</p>
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
                isMobile={isMobile}
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

      {/* Premium Locations Modal - Positioned at top of page with navigation */}
      {createPortal(
        <AnimatePresence>
          {premiumLocationsOpen && (
            <PremiumLocationsModal 
              isOpen={premiumLocationsOpen} 
              onClose={() => setPremiumLocationsOpen(false)}
              navigate={navigate}
              clickPosition={modalClickPosition}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default Hero