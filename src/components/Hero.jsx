"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaUtensils, FaWifi, FaSwimmingPool, FaStar } from "react-icons/fa"
import { FiChevronDown } from "react-icons/fi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import backgroundVideo from "../assets/About/v.mp4"
import { Popover } from "@headlessui/react"
import { Minus, Plus, Users, X } from "lucide-react"
import '../styles/Home/Hero/PremiumLocationsModal.css'
// import './PremiumLocationsModalFix.css'

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
                className="w-full p-2 bg-black/40 text-white border border-[#D4AF37]/30 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent flex justify-between items-center hero-gold-focus touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span>{searchParams.destination || "Select location"}</span>
                <FiChevronDown className={`transition-transform ${showLocationDropdown ? "rotate-180" : ""}`} />
              </button>
              
              {showLocationDropdown && (
                <div
                  className="absolute z-30 mt-1 w-full rounded-md bg-gray-900 shadow-lg border border-[#D4AF37]/30 overflow-hidden hero-location-option"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  <div className="max-h-60 overflow-auto py-1">
                    {locations.map((location) => (
                      <button
                        key={location}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleLocationSelect(location)
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault()
                          handleLocationSelect(location)
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#D4AF37]/20 transition-colors touch-manipulation ${searchParams.destination === location ? 'bg-[#D4AF37]/30 text-[#D4AF37]' : 'text-gray-300'}`}
                        style={{ 
                          WebkitTapHighlightColor: 'transparent',
                          minHeight: '44px' // Better touch target size for mobile
                        }}
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

const PremiumLocationsModal = ({ isOpen, onClose, clickPosition = null }) => {
  const navigate = useNavigate(); // Add navigate hook here
  
  // Get the navbar height to position the modal correctly
  const navbarHeight = useNavbarHeight();
  
  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Reference to the modal content for scrolling
  const modalContentRef = useRef(null);
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Scroll modal to ensure it's visible when opened
  useEffect(() => {
    if (isOpen && modalContentRef.current && isMobile) {
      // For mobile, ensure modal is in view regardless of scroll position
      setTimeout(() => {
        modalContentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }, 100);
    }
  }, [isOpen, isMobile]);
  
  useEffect(() => {
    // Store the scroll position
    let scrollPosition = 0;
    
    if (isOpen) {
      // Save current scroll position
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only prevent body scrolling on desktop, allow scrolling on mobile
      if (!isMobile) {
        // Add class to body to prevent scrolling on desktop only
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
        document.body.style.left = '0';
        document.body.style.right = '0';
      } else {
        // On mobile, add a class but don't prevent scrolling
        document.body.classList.add('modal-open-mobile');
      }
      
      // Add dynamic CSS for navbar height adjustment
      const modalStyle = document.createElement('style');
      modalStyle.setAttribute('data-premium-modal-style', '');
      
      // Different styling for mobile and desktop
      if (isMobile) {
        modalStyle.textContent = `
          .premium-locations-modal {
            align-items: center !important;
            padding-top: 0 !important;
          }
          .premium-locations-modal-content {
            margin-top: 60px !important;
            max-height: 85vh !important;
          }
        `;
      } else {
        modalStyle.textContent = `
          .premium-locations-modal {
            padding-top: ${navbarHeight + 20}px !important;
            align-items: flex-start !important;
          }
          .premium-locations-modal-content {
            max-height: calc(90vh - ${navbarHeight + 20}px) !important;
          }
        `;
      }
      
      document.head.appendChild(modalStyle);
      
      // Reset modal scroll position to top when opened
      setTimeout(() => {
        if (modalContentRef.current) {
          modalContentRef.current.scrollTop = 0;
        }
      }, 100);
      
      // Set focus to the modal content to improve accessibility
      setTimeout(() => {
        const modalElement = document.querySelector('.premium-locations-modal-content');
        if (modalElement) {
          modalElement.focus();
        }
      }, 100);
      
      // Add listener for escape key to close modal
      const handleEsc = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEsc);
      
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    } else {
      // Restore scroll position when closing
      const scrollY = document.body.style.top;
      document.body.classList.remove('modal-open');
      
      // Add a force-scroll class to ensure scrolling is enabled
      document.documentElement.classList.add('force-scroll');
      document.body.classList.add('force-scroll');
      
      // Reset all body styles
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      
      // First ensure scroll restoration works
      if (scrollY) {
        const scrollPx = Math.abs(parseInt(scrollY || '0', 10));
        window.scrollTo(0, scrollPx);
      }
      
      // Force scrolling to work again with a slight delay
      setTimeout(() => {
        // Remove force-scroll class after everything is reset
        document.documentElement.classList.remove('force-scroll');
        document.body.classList.remove('force-scroll');
        
        // Force a redraw/reflow to ensure scrolling works
        document.body.style.display = 'none';
        void document.body.offsetHeight; // Force reflow
        document.body.style.display = '';
        
        // Ensure we're at the right position
        if (scrollY) {
          const scrollPx = Math.abs(parseInt(scrollY || '0', 10));
          window.scrollTo(0, scrollPx);
        }
      }, 100);
    }
    
    // Cleanup on unmount
    return () => {
      // Remove modal class
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('force-scroll');
      document.body.classList.remove('force-scroll');
      
      // Reset all body styles completely
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      
      // Force body to be scrollable again
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      
      // Ensure scrolling is restored properly with a force refresh
      setTimeout(() => {
        // Force a redraw/reflow
        document.body.style.display = 'none';
        void document.body.offsetHeight; // Force reflow
        document.body.style.display = '';
        
        // Scroll to current position to ensure scrolling works
        window.scrollTo(0, window.scrollY);
      }, 100);
      
      // Remove any added styles
      const modalStyle = document.querySelector('style[data-premium-modal-style]');
      if (modalStyle) {
        modalStyle.remove();
      }
      
      // Re-enable navigation elements if needed
      const navElements = document.querySelectorAll(
        '.swiper, .carousel, .slider, [class*="swiper"], [class*="carousel"], [class*="slider"], ' +
        'button[aria-label*="slide"], button[class*="nav"], [class*="navigation"], ' + 
        '[class*="ChevronLeft"], [class*="ChevronRight"], ' +
        'button[aria-label*="Go to slide"]'
      );
      
      navElements.forEach(el => {
        // Restore original values
        el.style.zIndex = el.dataset.originalZIndex || '';
        el.style.pointerEvents = el.dataset.originalPointerEvents || '';
        el.style.opacity = el.dataset.originalOpacity || '';
        el.style.visibility = el.dataset.originalVisibility || '';
      });
    };
  }, [isOpen, onClose, navbarHeight]);
  
  if (!isOpen) return null;
  
  // Location data
  const premiumLocations = [
    {
      city: "Chennai",
      description: "Experience luxury living in Chennai's most exclusive neighborhoods with stunning coastal views and elegant villas designed for maximum comfort.",
      highlights: ["Beachfront Properties", "Private Pools", "Elite Neighborhoods", "Exclusive Amenities"],
      image: "/AmrithPalace/AP1.jpg" // Chennai image from AmrithPalace folder
    },
    {
      city: "Pondicherry",
      description: "Discover the French colonial charm of Pondicherry with our premium villas featuring serene garden spaces and refined architectural details.",
      highlights: ["Colonial Architecture", "Tranquil Gardens", "Heritage Locations", "Beach Proximity"],
      image: "/eastcoastvilla/EC1.jpg" // Pondicherry image from eastcoastvilla folder
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="premium-locations-modal" 
          onClick={(e) => {
            // Close modal only if clicking directly on the container or backdrop, not its children
            if (e.target.classList.contains('premium-locations-modal') || 
                e.target.classList.contains('premium-locations-modal-backdrop')) {
              onClose();
            }
          }}
          style={{
            paddingTop: isMobile ? '0px' : `${navbarHeight + 20}px`,
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: 'center'
          }}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop - removed onClick from here to prevent double triggering */}
          <motion.div 
            className="premium-locations-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content - Positioned according to click on mobile */}
          <motion.div
            ref={modalContentRef}
            className="w-full max-w-5xl overflow-y-auto premium-locations-modal-content scrollbar-hide"
            style={isMobile ? {
              maxHeight: '90vh',
              margin: '0 auto',
              marginTop: '60px', // Added fixed top margin for mobile
              marginBottom: '20px'
            } : {
              maxHeight: `calc(90vh - ${navbarHeight + 20}px)`
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            tabIndex="-1"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-white bg-black hover:bg-[#D4AF37]/80 p-2 rounded-full z-10 transition-all duration-200 hover:scale-110 close-button"
              onClick={onClose}
              aria-label="Close premium locations modal"
              style={{
                boxShadow: "0 0 15px rgba(212, 175, 55, 0.7)",
                border: "2px solid rgba(212, 175, 55, 0.8)",
                backgroundColor: "rgba(0, 0, 0, 0.8)"
              }}
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#BFA181] py-6 sm:py-8 px-6 sm:px-8 text-center">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-black"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Premium Locations
              </motion.h2>
              <motion.p 
                className="text-black/80 mt-2 text-sm sm:text-base md:text-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Discover our exclusive villas in the most sought-after destinations
              </motion.p>
            </div>
            
            {/* Locations grid - Responsive padding and gap */}
            <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {premiumLocations.map((location, index) => (
                <motion.div
                  key={location.city}
                  className="bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 group flex flex-col h-full"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4), 0 0 20px -5px rgba(212, 175, 55, 0.6)"
                  }}
                >
                  {/* Location Image - Responsive height */}
                  <div 
                    className="h-40 sm:h-48 md:h-56 bg-cover bg-center relative" 
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${location.image})`
                    }}
                  >
                    <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{location.city}</h3>
                      <div className="w-12 h-1 bg-[#D4AF37] rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Location Details - Improved spacing for better readability */}
                  <div className="p-4 sm:p-6 flex-grow flex flex-col">
                    <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{location.description}</p>
                    
                    <h4 className="text-[#D4AF37] font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Highlights:</h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {location.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center text-xs sm:text-sm text-white">
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Button - More touch-friendly on mobile */}
                    <div className="flex justify-end mt-auto">
                      <button 
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-black rounded-full font-semibold hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
                        onClick={() => {
                          onClose();
                          // Navigate to search results with the location filter
                          navigate(`/search-results?location=${location.city}`);
                        }}
                      >
                        View Villas →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Footer - Responsive padding and font sizes */}
            <div className="px-4 sm:px-8 pb-6 sm:pb-8 text-center border-t border-[#D4AF37]/20">
              <div className="pt-4 sm:pt-6">
                <motion.p 
                  className="text-[#D4AF37]/90 text-xs sm:text-sm mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Need personalized assistance?
                </motion.p>
                <motion.p 
                  className="text-white font-semibold text-sm sm:text-base mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Contact us at <span className="text-[#D4AF37]">+91 8015924647</span>
                </motion.p>
                
                {/* Bottom close button */}
                <motion.button
                  className="mx-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-black/80 text-white rounded-full border border-[#D4AF37]/50 hover:bg-[#D4AF37]/20 transition-all duration-200"
                  onClick={onClose}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm">Close</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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
  const [showPremiumLocations, setShowPremiumLocations] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);

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
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
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
    
    /* Location dropdown options - Enhanced for mobile */
    .hero-location-option {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      background-color: #111 !important;
      z-index: 999999 !important;
    }
    
    .hero-location-option button {
      -webkit-tap-highlight-color: transparent !important;
      tap-highlight-color: transparent !important;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    
    /* Better mobile touch targets */
    @media (max-width: 768px) {
      .hero-location-option button {
        min-height: 48px;
        font-size: 16px; /* Prevents zoom on iOS */
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
    }
    
    .react-datepicker__header {
      background-color: #111 !important;
      border-bottom: 1px solid #333 !important;
      padding-top: 10px !important;
      padding-bottom: 8px !important;
    }
    
    .react-datepicker_day-name, .react-datepickerday, .react-datepicker_time-name {
      color: #fff !important;
    }
    
    .react-datepicker_day:hover, .react-datepicker_month-text:hover, 
    .react-datepicker_quarter-text:hover, .react-datepicker_year-text:hover {
      background-color: rgba(212, 175, 55, 0.2) !important;
    }
    
    .react-datepicker_day--selected, .react-datepickerday--in-selecting-range, .react-datepicker_day--in-range {
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
                    className="bg-black/30 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-4 hover:border-[#D4AF37]/40 transition-all group cursor-pointer"
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 0 15px rgba(212, 175, 55, 0.15)" 
                    }}
                    onClick={(e) => {
                      // Capture click position for mobile modal positioning
                      setClickPosition({
                        x: e.clientX,
                        y: e.clientY,
                        scrollY: window.scrollY
                      });
                      setShowPremiumLocations(true);
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
                      <p className="text-xs text-gray-300">Stunning views in Chennai and Pondicherry's most desirable areas</p>
                      <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
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

      {/* Premium Locations Modal - Initially hidden */}
      <PremiumLocationsModal 
        isOpen={showPremiumLocations}
        onClose={() => setShowPremiumLocations(false)}
        clickPosition={clickPosition}
      />
    </div>
  )
}

export default Hero