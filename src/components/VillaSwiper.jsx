import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Home, Users, Maximize, MapPin, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config/api"
import { getDisplayVillaImage, formatCompactPrice, getAccurateVillaPrice, getBestMatchingVillaImages, createFallbackProperties } from "../utils/villaImageUtils"

const VillaSwiper = () => {
  const navigate = useNavigate()

  // State management - Updated to match FeaturedDestination
  const [villas, setVillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const touchStartTime = useRef(0)
  const touchEndTime = useRef(0)
  const swipeVelocity = useRef(0)
  const isDragging = useRef(false)
  const dragOffset = useRef(0)
  const swiperRef = useRef(null)

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Fetching villas from:", `${API_BASE_URL}/api/villas`)
        const res = await fetch(`${API_BASE_URL}/api/villas`)
        if (!res.ok) throw new Error("Failed to load properties")
        const data = await res.json()
        console.log("API Response data:", data)
        const villaList = Array.isArray(data) ? data : (data.villas || data.data || [])

        if (villaList.length === 0) {
          throw new Error("No properties returned")
        }

        // Map backend data to carousel property format
        const processedProperties = villaList.map((villa, idx) => {
          const backendImages = Array.isArray(villa.images) ? villa.images.filter(Boolean) : []
          const images = backendImages.length > 0 ? backendImages : getBestMatchingVillaImages(villa.name || "")

          // Get accurate pricing using our helper function
          const accuratePricing = getAccurateVillaPrice(villa);

          return {
            id: villa.id || villa._id || `villa-${idx}`,
            _id: villa.id || villa._id || `villa-${idx}`,
            roomType: villa.name,
            hotel: {
              name: villa.name,
              address: villa.location || "",
              city: villa.location?.split(",")[0]?.trim() || "",
            },
            images: images.slice(0, 5), // First 5 images for carousel
            allImages: images, // All images for detail view
            pricePerNight: accuratePricing.weekday ? accuratePricing.weekday.toLocaleString() : "Contact for Price",
            pricing: {
              weekday: accuratePricing.weekday ? accuratePricing.weekday.toLocaleString() : "N/A",
              weekend: accuratePricing.weekend ? accuratePricing.weekend.toLocaleString() : "N/A",
              holiday: accuratePricing.weekend ? Math.round(accuratePricing.weekend * 1.2).toLocaleString() : "N/A",
            },
            description: villa.description || "",
            amenities: Array.isArray(villa.amenities) ? villa.amenities : (villa.facilities?.map((f) => f.name) || []),
            capacity: Number(villa.guests) || 0,
            rating: Number(villa.rating) || 4.8,
            rooms: Number(villa.bedrooms) || 0,
            area: "3500 sq ft",
            features: {
              bedrooms: Number(villa.bedrooms) || 0,
              bathrooms: Number(villa.bathrooms) || 0,
              balcony: "Ocean View",
              speciality: "Private Pool",
            },
          }
        })
        setVillas(processedProperties)
      } catch (err) {
        console.error("Error fetching villas:", err)
        setError("Our server is currently updating. Showing our luxury collection below.")
        // Create fallback properties using our image collections
        const fallbacks = createFallbackProperties()
        setVillas(fallbacks)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Navigate to villa detail page - Updated to match FeaturedDestination functionality
  const handleViewDetails = (villa) => {
    const villaId = villa._id || villa.id

    // Prepare data for villa details page - matching the structure from FeaturedDestination
    const villaData = {
      id: villaId,
      _id: villaId,
      name: villa.roomType,
      location: `${villa.hotel.address}, ${villa.hotel.city}`,
      price: Number.parseInt(villa.pricePerNight.replace(/,/g, "")),
      description: villa.description,
      images: villa.allImages || villa.images, // Pass ALL images to the detail view
      guests: villa.capacity,
      bedrooms: villa.features.bedrooms,
      bathrooms: villa.features.bathrooms,
      rating: villa.rating,
      amenities: villa.amenities,
      type: "VILLA",
    }

    console.log("Navigating to villa details with data:", villaData)

    // Navigate to villa details page
    navigate(`/villa/${villaId}`, { state: { villa: villaData } })
  }

  // Handle click on slide - navigate if active, otherwise bring slide to center
  const handleSlideClick = (index, villa) => {
    if (index === currentIndex) {
      handleViewDetails(villa)
    } else {
      goToSlide(index)
    }
  }

  const nextSlide = useCallback(() => {
    if (isAnimating || villas.length === 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % villas.length)
    setTimeout(() => setIsAnimating(false), 550)
  }, [isAnimating, villas.length])

  const prevSlide = useCallback(() => {
    if (isAnimating || villas.length === 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + villas.length) % villas.length)
    setTimeout(() => setIsAnimating(false), 550)
  }, [isAnimating, villas.length])

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex || villas.length === 0) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 600)
  }

  // Enhanced price formatting function
  const formatPrice = (price) => {
    if (!price) return "0"
    const numPrice = Number(price.toString().replace(/,/g, ""))

    // For display in the slider, use compact format like unified calendar
    return formatCompactPrice(numPrice)
  }

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && villas.length > 0) {
        nextSlide()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isAnimating, nextSlide, villas.length])

  // Enhanced keyboard navigation with visual feedback
  useEffect(() => {
    // Track active keys to prevent key repeat issues
    const activeKeys = new Set()
    const handleKeyDown = (e) => {
      // Only respond to keyboard if not already animating and key not already pressed
      if (isAnimating || activeKeys.has(e.key)) return
      // Only respond to keyboard if swiper is in viewport
      if (swiperRef.current) {
        const rect = swiperRef.current.getBoundingClientRect()
        const isInView =
          rect.top <= window.innerHeight * 0.75 && // Element is at least 25% in view
          rect.bottom >= window.innerHeight * 0.25 // Element is at least 25% in view
        if (isInView) {
          // Mark key as active
          activeKeys.add(e.key)
          // Provide visual feedback for keypresses
          let shouldAnimate = false
          let direction = ""
          if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            // Provide visual feedback for left movement (which will go to previous slide)
            if (swiperRef.current) {
              swiperRef.current.style.transform = "translateX(20px)"
              swiperRef.current.style.transition = "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)"
              setTimeout(() => {
                if (swiperRef.current) {
                  swiperRef.current.style.transform = ""
                }
              }, 150)
            }
            shouldAnimate = true
            direction = "prev" // Left key moves to previous slide
          } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            // Provide visual feedback for right movement (which will go to next slide)
            if (swiperRef.current) {
              swiperRef.current.style.transform = "translateX(-20px)"
              swiperRef.current.style.transition = "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)"
              setTimeout(() => {
                if (swiperRef.current) {
                  swiperRef.current.style.transform = ""
                }
              }, 150)
            }
            shouldAnimate = true
            direction = "next" // Right key moves to next slide
          }
          // Execute the slide animation after feedback
          if (shouldAnimate) {
            setTimeout(() => {
              if (direction === "next") {
                nextSlide()
              } else if (direction === "prev") {
                prevSlide()
              }
            }, 100)
          }
        }
      }
    }
    const handleKeyUp = (e) => {
      // Remove key from active keys when released
      activeKeys.delete(e.key)
    }
    // Add both keydown and keyup listeners
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isAnimating, nextSlide, prevSlide])

  // Optimized touch event handlers for ultra-smooth mobile swipe
  const touchVelocity = useRef(0)
  const lastTouchX = useRef(0)
  const lastTouchTime = useRef(0)
  const animationFrameId = useRef(null)
  const isSwiping = useRef(false)
  const rafScheduled = useRef(false)

  const handleTouchStart = useCallback(
    (e) => {
      // Don't handle new touch if animation is in progress
      if (isAnimating) return
      // Record initial touch position and time
      touchStartX.current = e.touches[0].clientX
      lastTouchX.current = e.touches[0].clientX
      lastTouchTime.current = Date.now()
      touchEndX.current = e.touches[0].clientX
      // Reset values
      touchVelocity.current = 0
      isDragging.current = true
      isSwiping.current = true
      dragOffset.current = 0
      // Cancel any ongoing animations to prevent conflicts
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      // Capture the touch to improve touch response
      if (swiperRef.current) {
        swiperRef.current.style.willChange = "transform"
      }
    },
    [isAnimating],
  )

  // Handle requestAnimationFrame for ultra-smooth animation
  const updateSwipeAnimation = useCallback(() => {
    if (swiperRef.current && isDragging.current) {
      // Enhanced resistance curve for even more natural feeling feedback
      // More responsive initially with smoother falloff
      const resistance = Math.min(0.9, 0.95 / (1 + Math.abs(dragOffset.current) / 350))
      // Add subtle rotation for enhanced physical feel (very slight)
      const rotateValue = dragOffset.current * 0.01
      const transformValue = `translateX(${dragOffset.current * resistance}px) rotateY(${rotateValue}deg)`
      // Apply transform with GPU acceleration hints
      swiperRef.current.style.transform = transformValue
      swiperRef.current.style.backfaceVisibility = "hidden"
    }
    rafScheduled.current = false
  }, [])

  const handleTouchMove = useCallback(
    (e) => {
      // Exit early if not in active swipe state
      if (!isDragging.current || !isSwiping.current) return
      // Calculate current velocity with high precision
      const currentX = e.touches[0].clientX
      const currentTime = Date.now()
      const dt = currentTime - lastTouchTime.current
      // Only calculate velocity if time has passed to avoid division by zero
      if (dt > 0) {
        // Exponential moving average for smoother velocity tracking
        const newVelocity = (currentX - lastTouchX.current) / dt
        touchVelocity.current = touchVelocity.current * 0.7 + newVelocity * 0.3
      }
      // Update tracking values
      lastTouchX.current = currentX
      lastTouchTime.current = currentTime
      touchEndX.current = currentX
      // Calculate drag offset for real-time feedback
      dragOffset.current = touchEndX.current - touchStartX.current
      // Use requestAnimationFrame for smoother rendering
      // This prevents jank by synchronizing with the browser's render cycle
      if (!rafScheduled.current) {
        rafScheduled.current = true
        animationFrameId.current = requestAnimationFrame(updateSwipeAnimation)
      }
      // Always prevent default to ensure the swiper takes full control
      e.preventDefault()
    },
    [updateSwipeAnimation],
  )

  const handleTouchEnd = useCallback(() => {
    // Exit early if not in active swipe state
    if (!isDragging.current || !isSwiping.current) return
    // Reset state
    isDragging.current = false
    isSwiping.current = false
    // Cancel any pending animation frames
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
    // Smoothly reset the transform with super smooth optimized animation
    if (swiperRef.current) {
      swiperRef.current.style.transform = ""
      swiperRef.current.style.transition = "transform 0.4s cubic-bezier(0.1, 0.0, 0.1, 1)"
      // Reset will-change after animation completes to free up resources
      setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.style.willChange = "auto"
        }
      }, 400)
    }
    // Calculate swipe metrics with enhanced sensitivity
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 25 // Even lower threshold for super-responsive touch
    const velocity = touchVelocity.current // pixels per millisecond
    const significantVelocity = Math.abs(velocity) > 0.3 // Extra sensitive flick detection for buttery smooth experience
    // Determine if swipe should trigger navigation
    if (Math.abs(diff) > minSwipeDistance || significantVelocity) {
      setIsAnimating(true)
      // Fixed swipe direction logic:
      // Swipe LEFT (negative diff/velocity) should go to NEXT slide (swiping content to the left)
      // Swipe RIGHT (positive diff/velocity) should go to PREVIOUS slide (swiping content to the right)
      const direction = diff > 0 ? "next" : "prev"
      // Execute the slide change with immediate response but smooth transition
      requestAnimationFrame(() => {
        if (direction === "next") {
          nextSlide()
        } else {
          prevSlide()
        }
        // Reset animation state after the transition completes with perfect timing
        setTimeout(() => setIsAnimating(false), 400)
      })
    }
  }, [nextSlide, prevSlide])

  // Additional mouse event handlers for desktop drag support
  const handleMouseDown = useCallback(
    (e) => {
      // Only handle left mouse button (button 0)
      if (isAnimating || e.button !== 0) return
      // Prevent default to avoid text selection
      e.preventDefault()
      // Record initial mouse position
      touchStartX.current = e.clientX
      lastTouchX.current = e.clientX
      lastTouchTime.current = Date.now()
      touchEndX.current = e.clientX
      // Reset values
      touchVelocity.current = 0
      isDragging.current = true
      isSwiping.current = true
      dragOffset.current = 0
      // Set will-change for performance optimization
      if (swiperRef.current) {
        swiperRef.current.style.willChange = "transform"
        swiperRef.current.style.cursor = "grabbing"
      }
      // Add document-level event listeners for mouse move and up
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [isAnimating],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging.current || !isSwiping.current) return
      // Calculate current velocity
      const currentX = e.clientX
      const currentTime = Date.now()
      const dt = currentTime - lastTouchTime.current
      if (dt > 0) {
        // Exponential moving average for smoother velocity tracking
        const newVelocity = (currentX - lastTouchX.current) / dt
        touchVelocity.current = touchVelocity.current * 0.7 + newVelocity * 0.3
      }
      // Update tracking values
      lastTouchX.current = currentX
      lastTouchTime.current = currentTime
      touchEndX.current = currentX
      // Calculate drag offset
      dragOffset.current = touchEndX.current - touchStartX.current
      // Use requestAnimationFrame for smoother rendering
      if (!rafScheduled.current) {
        rafScheduled.current = true
        animationFrameId.current = requestAnimationFrame(updateSwipeAnimation)
      }
      // Prevent default to avoid text selection
      e.preventDefault()
    },
    [updateSwipeAnimation],
  )

  const handleMouseUp = useCallback(
    (e) => {
      // Clean up document-level event listeners
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      if (!isDragging.current || !isSwiping.current) return
      // Reset state
      isDragging.current = false
      isSwiping.current = false
      // Reset cursor
      if (swiperRef.current) {
        swiperRef.current.style.cursor = "grab"
      }
      // Cancel any pending animation frames
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
      // Reset transform
      if (swiperRef.current) {
        swiperRef.current.style.transform = ""
        swiperRef.current.style.transition = "transform 0.3s cubic-bezier(0.2, 0.0, 0.2, 1)"
        setTimeout(() => {
          if (swiperRef.current) {
            swiperRef.current.style.willChange = "auto"
          }
        }, 300)
      }
      // Calculate swipe metrics
      const diff = touchStartX.current - touchEndX.current
      const minSwipeDistance = 50 // Higher threshold for mouse to avoid accidental swipes
      const velocity = touchVelocity.current
      const significantVelocity = Math.abs(velocity) > 0.5
      // Determine if swipe should trigger navigation
      if (Math.abs(diff) > minSwipeDistance || significantVelocity) {
        setIsAnimating(true)
        // Make consistent with touch behavior:
        // Drag LEFT (positive diff) should go to NEXT slide
        // Drag RIGHT (negative diff) should go to PREVIOUS slide
        const direction = diff > 0 ? "next" : "prev"
        requestAnimationFrame(() => {
          if (direction === "next") {
            nextSlide()
          } else {
            prevSlide()
          }
          setTimeout(() => setIsAnimating(false), 350)
        })
      }
    },
    [nextSlide, prevSlide, updateSwipeAnimation],
  )

  const getSlidePosition = (index) => {
    const diff = index - currentIndex
    const totalSlides = villas.length
    let position = diff
    if (diff > totalSlides / 2) {
      position = diff - totalSlides
    } else if (diff < -totalSlides / 2) {
      position = diff + totalSlides
    }
    return position
  }

  const getSlideStyle = (index) => {
    const position = getSlidePosition(index)
    const isCenter = position === 0
    const isAdjacent = Math.abs(position) === 1
    const isVisible = Math.abs(position) <= 2

    if (!isVisible) {
      return {
        transform: `translateX(${position * 100}%) scale(0.6)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
        visibility: "hidden",
      }
    }

    // Mobile-specific positioning (< 640px)
    if (windowWidth < 640) {
      if (isCenter) {
        return {
          transform: "translateX(0) scale(1)",
          opacity: 1,
          zIndex: 10,
          transition: isAnimating
            ? "all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "all 0.3s cubic-bezier(0.2, 0.0, 0.2, 1)",
          boxShadow: "none",
          willChange: "transform, opacity",
        }
      }
      if (isAdjacent) {
        const translateX = position < 0 ? "-82%" : "82%"
        return {
          transform: `translateX(${translateX}) scale(0.84)`,
          opacity: 0.5,
          zIndex: 5,
          transition: isAnimating
            ? "all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "all 0.3s cubic-bezier(0.2, 0.0, 0.2, 1)",
          filter: "brightness(0.95)",
          willChange: "transform, opacity",
          boxShadow: "none",
        }
      }
      return {
        transform: `translateX(${position < 0 ? "-130%" : "130%"}) scale(0.6)`,
        opacity: 0,
        zIndex: 1,
        pointerEvents: "none",
      }
    }

    // Tablet & Desktop positioning
    let spacing
    if (windowWidth >= 1440) {
      spacing = 380 // XL screens
    } else if (windowWidth >= 1280) {
      spacing = 350 // Large screens
    } else if (windowWidth >= 1024) {
      spacing = 320 // Medium-large screens
    } else if (windowWidth >= 768) {
      spacing = 280 // Tablet screens
    } else {
      spacing = 240 // Small tablet (640px - 767px)
    }

    const translateX = position * spacing
    const scale = isCenter ? 1 : isAdjacent ? 0.88 : 0.72
    const opacity = isCenter ? 1 : isAdjacent ? 0.82 : 0.35
    const zIndex = isCenter ? 10 : isAdjacent ? 5 : 1
    const filter = isCenter ? "none" : isAdjacent ? "brightness(0.97)" : "brightness(0.9)"

    const transformValue = isAdjacent
      ? `translateX(${translateX}px) scale(${scale}) rotateY(${position * -5}deg)`
      : `translateX(${translateX}px) scale(${scale})`

    return {
      transform: transformValue,
      opacity,
      zIndex,
      transition: isAnimating
        ? "all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "all 0.3s cubic-bezier(0.2, 0.0, 0.2, 1)",
      boxShadow: "none",
      willChange: "transform, opacity",
      filter,
      visibility: "visible",
    }
  }

  return (
    <div className="py-8 sm:py-12 px-3 sm:px-6 w-full bg-white">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#BFA181] mb-2 sm:mb-3">
            PICK YOUR DREAM VILLA TODAY
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2">
            Discover luxury villas with stunning views and premium amenities for your perfect getaway
          </p>

          {/* Tourism Awards Section */}
          <div className="flex flex-wrap items-center justify-center mt-3 gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
            <div className="flex items-center bg-gradient-to-r from-amber-50 to-amber-100/80 px-3 py-1 rounded-full border border-amber-200/50">
              <span className="text-amber-800">
                <span className="mr-1 text-xs">⭐</span>Tourism Board of India, 2024
              </span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-amber-50 to-amber-100/80 px-3 py-1 rounded-full border border-amber-200/50">
              <span className="text-amber-800">
                <span className="mr-1 text-xs">🏆</span>Travel & Leisure Awards, 2023
              </span>
            </div>
          </div>
          {/* Mobile-only swipe indicator */}
          <div className="flex sm:hidden items-center justify-center mt-3 text-gray-400 text-xs">
            <span className="flex items-center">
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Swipe to browse <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Loading and error states */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-lg mb-4 text-center border border-amber-200 text-sm">
            {error}
          </div>
        )}

        {/* Villa Swiper Carousel Container - Scaled & Responsive */}
        {!loading && villas.length > 0 && (
          <div className="relative h-[440px] sm:h-[480px] md:h-[520px] mb-4 sm:mb-6 overflow-hidden villa-swiper-container w-full select-none">
            <div
              ref={swiperRef}
              className="relative w-full h-full flex items-center justify-center will-change-transform cursor-grab"
              style={{ perspective: "1000px" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
            >
              {villas.map((villa, index) => (
                <div
                  key={villa.id}
                  className="absolute w-[285px] xs:w-[305px] sm:w-[325px] md:w-[350px] lg:w-[370px] cursor-pointer touch-manipulation villa-slide"
                  style={getSlideStyle(index)}
                  onClick={() => handleSlideClick(index, villa)}
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
                    {/* Villa Image */}
                    <div className="relative">
                      <img
                        src={Math.abs(index - currentIndex) <= 1 ? (villa.images[0] || "/placeholder.svg") : undefined}
                        alt={villa.roomType}
                        className="w-full h-36 sm:h-40 md:h-44 object-cover"
                        loading={index === currentIndex ? "eager" : "lazy"}
                        decoding="async"
                        width="640"
                        height="360"
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden"
                        }}
                      />
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-0.5 flex items-center gap-1 border border-gray-100">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-800">{villa.rating}</span>
                      </div>
                      <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white rounded-md text-[11px] px-2 py-0.5 font-medium">
                        {villa.hotel.city}
                      </div>
                    </div>

                    {/* Villa Details */}
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-0.5 truncate">{villa.roomType}</h3>
                      <div className="flex items-center gap-1 mb-2.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500 text-xs truncate">{villa.hotel.city}</span>
                      </div>

                      {/* 4 Feature Stats in a clean responsive grid */}
                      <div className="grid grid-cols-4 gap-1 sm:gap-1.5 mb-2.5">
                        <div className="bg-amber-50/70 rounded-lg p-1.5 text-center border border-amber-200/40">
                          <Home className="w-3.5 h-3.5 text-[#D4AF37] mx-auto mb-0.5" />
                          <div className="text-xs font-semibold text-gray-800 truncate">{villa.rooms}</div>
                          <div className="text-[10px] text-gray-500">Rooms</div>
                        </div>
                        <div className="bg-amber-50/70 rounded-lg p-1.5 text-center border border-amber-200/40">
                          <Maximize className="w-3.5 h-3.5 text-[#D4AF37] mx-auto mb-0.5" />
                          <div className="text-xs font-semibold text-gray-800 truncate">{villa.area}</div>
                          <div className="text-[10px] text-gray-500">Area</div>
                        </div>
                        <div className="bg-amber-50/70 rounded-lg p-1.5 text-center border border-amber-200/40">
                          <Users className="w-3.5 h-3.5 text-[#D4AF37] mx-auto mb-0.5" />
                          <div className="text-xs font-semibold text-gray-800 truncate">{villa.capacity}</div>
                          <div className="text-[10px] text-gray-500">Guests</div>
                        </div>
                        <div className="bg-amber-50/70 rounded-lg p-1.5 text-center border border-amber-200/40">
                          <div className="w-3.5 h-3.5 text-[#D4AF37] mx-auto mb-0.5 text-xs">✨</div>
                          <div className="text-xs font-semibold text-gray-800 truncate">{villa.features?.speciality || "Pool"}</div>
                          <div className="text-[10px] text-gray-500">Feature</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-gray-600 text-xs mb-2.5 line-clamp-2 ${index === currentIndex ? "opacity-100" : "opacity-0 h-0 sm:h-auto overflow-hidden sm:opacity-40"}`}>
                        {villa.description}
                      </p>

                      {/* Amenities chips */}
                      <div className={`flex flex-wrap gap-1 mb-2.5 ${index === currentIndex ? "opacity-100" : "hidden sm:flex opacity-40"}`}>
                        {villa.amenities?.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Book Now button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(villa)
                        }}
                        className={`w-full py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white rounded-lg hover:from-[#BFA181] hover:to-[#D4AF37] transition-all duration-300 cursor-pointer ${
                          index === currentIndex ? "opacity-100" : "opacity-60"
                        }`}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              aria-label="Previous villa"
              className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full p-2.5 transition-all duration-200 hover:scale-110 disabled:opacity-40 z-20 items-center justify-center border border-gray-200"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              aria-label="Next villa"
              className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full p-2.5 transition-all duration-200 hover:scale-110 disabled:opacity-40 z-20 items-center justify-center border border-gray-200"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Enhanced Dots Indicator */}
        {!loading && villas.length > 0 && (
          <div className="flex justify-center items-center gap-1.5 mb-4 sm:mb-6">
            {villas.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 focus:outline-none ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#BFA181] w-6 h-2"
                    : "bg-gray-300 hover:bg-gray-400 w-2 h-2"
                }`}
              />
            ))}
          </div>
        )}

        {/* Booking & Pricing Summary Box */}
        {!loading && villas.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Pricing details */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-base">
                  🏷️
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#BFA181]">
                      {formatPrice(villas[currentIndex]?.pricePerNight)}
                    </span>
                    <span className="text-gray-500 text-xs">/ night</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-500">
                      Weekday: <strong className="text-gray-700">₹{formatPrice(villas[currentIndex]?.pricing?.weekday)}</strong>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] text-gray-500">
                      Weekend: <strong className="text-gray-700">₹{formatPrice(villas[currentIndex]?.pricing?.weekend)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto">
                <button
                  onClick={() => navigate("/rooms")}
                  className="w-full sm:w-auto px-5 py-2 bg-white text-gray-800 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 border border-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-amber-50/30"
                >
                  View All Villas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VillaSwiper

