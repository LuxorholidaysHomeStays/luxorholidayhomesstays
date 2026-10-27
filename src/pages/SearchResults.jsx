import { useState, useEffect, useRef } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaMapMarkerAlt, FaRegCalendar, FaSwimmingPool, FaWifi, FaStar, FaUsers, FaBed, FaBath } from "react-icons/fa"
import { MdOutlineBeachAccess, MdHotTub } from "react-icons/md"
import { LuChefHat } from "react-icons/lu"
import { API_BASE_URL } from "../config/api"
import { getVillaImage } from "../utils/villaImages"

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
}

const getVillaAmenities = (villa) => {
  if (Array.isArray(villa.amenities)) return villa.amenities;
  if (Array.isArray(villa.facilities)) return villa.facilities.map((item) => item.name || item).filter(Boolean);
  return [];
}

const SearchResults = () => {
  const location = useLocation()
  const resultsRef = useRef(null)

  // Extract search parameters from the URL
  const searchParams = new URLSearchParams(location.search)
  const destination = searchParams.get("location")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const adults = searchParams.get("adults")
  const children = searchParams.get("children")

  const [villas, setVillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("recommended")
  const [viewType, setViewType] = useState("grid")
  const [currentImage, setCurrentImage] = useState({})

  useEffect(() => {
    const controller = new AbortController()
    const fetchVillas = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch all villas from Go backend
        const villaRes = await fetch(`${API_BASE_URL}/api/villas`, { signal: controller.signal });
        if (!villaRes.ok) {
          throw new Error(`Failed to fetch villas (${villaRes.status})`);
        }
        const villaData = await villaRes.json();
        const rawList = Array.isArray(villaData) ? villaData : (villaData.villas || villaData.data || []);
        
        let filteredList = rawList;
        if (destination && destination.trim()) {
          const term = destination.toLowerCase().trim();
          filteredList = rawList.filter(v => 
            (v.location || '').toLowerCase().includes(term) || 
            (v.name || '').toLowerCase().includes(term)
          );
        }

        let villaList = filteredList.map((villa) => {
          const villaId = villa.id || villa._id;
          if (!villaId) return null;

          let images = []
          if (Array.isArray(villa.images) && villa.images.length > 0) {
            images = villa.images.map((img) => (!img ? getVillaImage(villa.name) : img))
          } else {
            images = [getVillaImage(villa.name)]
          }
          
          return { 
            ...villa, 
            id: villaId,
            _id: villaId,
            images,
            // Use the villa's real rating and occupancy. Random values here made
            // every villa look better-rated than it is.
            rating: Number(villa.rating) || 0,
            amenities: getVillaAmenities(villa),
            bedrooms: villa.bedrooms || 0,
            bathrooms: villa.bathrooms || 0,
          }
        }).filter(Boolean)

        // Fetch all bookings for the selected date range
        let bookedVillaIds = new Set()
        if (checkIn && checkOut) {
          const bookingRes = await fetch(`${API_BASE_URL}/api/bookings/search?checkIn=${checkIn}&checkOut=${checkOut}`, { signal: controller.signal })
          if (bookingRes.ok) {
            const bookingData = await bookingRes.json()
            if (bookingData.unavailableVillaIds) {
              bookedVillaIds = new Set(bookingData.unavailableVillaIds.map(id => String(id)))
            } else if (bookingData.bookings) {
              bookedVillaIds = new Set(bookingData.bookings.map((b) => String(b.villaId)))
            }
          }
        }

        // Mark each villa as available or not
        const results = villaList.map((villa) => ({
          ...villa,
          isBooked: bookedVillaIds.has(String(villa._id)) || bookedVillaIds.has(String(villa.id)),
        }))

        setVillas(results)
      } catch (err) {
        if (err.name === "AbortError") return
        setError("Failed to fetch villa search results.")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    return () => controller.abort()
  }, [destination, checkIn, checkOut])

  // Calculate nights of stay
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  const nights = calculateNights()

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date)
  }

  // Sort villas based on selected option
  const sortedVillas = [...villas].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0 // recommended/default
    }
  })

  // Handle villa image cycling
  const cycleImage = (villaId, direction) => {
    setCurrentImage(prev => {
      const villa = villas.find(v => v._id === villaId)
      if (!villa || !villa.images || villa.images.length <= 1) return prev
      
      const currentIndex = prev[villaId] || 0
      let newIndex
      
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % villa.images.length
      } else {
        newIndex = (currentIndex - 1 + villa.images.length) % villa.images.length
      }
      
      return { ...prev, [villaId]: newIndex }
    })
  }

  // Get current image index for a villa
  const getCurrentImageIndex = (villaId) => {
    return currentImage[villaId] || 0
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-white">
      {/* Hero Banner */}
      <div className=" py-8 sm:py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-6 text-gray-900">
              Luxury Villas in <span className="font-semibold text-yellow-600">{destination || "All Locations"}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600">
              <div className="flex items-center text-sm sm:text-base">
                <FaRegCalendar className="mr-2 text-yellow-600" />
                <span>
                  {checkIn && checkOut ? (
                    <>
                      {formatDate(checkIn)} — {formatDate(checkOut)}
                      <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium">
                        {nights} Night{nights !== 1 ? "s" : ""}
                      </span>
                    </>
                  ) : (
                    "Any dates"
                  )}
                </span>
              </div>
              
              {adults && (
                <div className="flex items-center ml-4">
                  <FaUsers className="mr-2" />
                  <span>
                    {Number.parseInt(adults) + Number.parseInt(children || "0")} Guest
                    {Number.parseInt(adults) + Number.parseInt(children || "0") !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8" ref={resultsRef}>
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 sm:py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-yellow-100"></div>
              <div className="absolute top-0 left-0 h-16 w-16 sm:h-20 sm:w-20 border-t-4 border-yellow-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-600 font-light text-base sm:text-lg">Discovering your perfect villa...</p>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-700 p-8 rounded-xl my-8 shadow-sm border border-red-200"
          >
            <h3 className="text-2xl font-serif mb-3">We Encountered an Issue</h3>
            <p className="text-lg">{error}</p>
            <button 
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </motion.div>
        ) : villas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-xl shadow-sm border border-yellow-100"
          >
            <h2 className="text-3xl font-serif font-light mb-4 text-yellow-700">No Villas Available</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
              We couldn't find any available villas matching your search criteria. Try adjusting your dates or location.
            </p>
            <Link 
              to="/" 
              className="inline-block px-8 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all shadow-md hover:shadow-lg"
            >
              Return to Search
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="text-xl font-serif text-yellow-700 mb-4 md:mb-0">
                Found <span className="font-semibold">{villas.length}</span> luxury villas
              </div>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-yellow-100 text-sm sm:text-base rounded-lg px-3 sm:px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-200 text-gray-700"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-yellow-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="flex border border-yellow-200 rounded-md overflow-hidden">
                  <button 
                    onClick={() => setViewType('grid')} 
                    className={`px-3 py-2 flex items-center ${viewType === 'grid' ? 'bg-yellow-100 text-yellow-700' : 'bg-white text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewType('list')} 
                    className={`px-3 py-2 flex items-center ${viewType === 'list' ? 'bg-yellow-100 text-yellow-700' : 'bg-white text-gray-600'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Villa Results */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewType === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" 
                : "flex flex-col space-y-4 sm:space-y-6 md:space-y-8"
              }
            >
              {sortedVillas.map((villa) => (
                <motion.div 
                  key={villa._id} 
                  variants={itemVariants}
                  className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-yellow-50 flex ${viewType === 'list' ? 'flex-row' : 'flex-col'}`}
                >
                  {/* Image Container */}
                  <div 
                    className={`relative overflow-hidden ${viewType === 'list' ? 'w-full sm:w-2/5' : 'w-full'}`}
                    style={{ height: viewType === 'list' ? '280px' : '220px' }}
                  >
                    <img
                      src={villa.images[getCurrentImageIndex(villa._id)]}
                      alt={villa.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Image Navigation */}
                    {villa.images.length > 1 && (
                      <>
                        <button 
                          onClick={() => cycleImage(villa._id, 'prev')}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => cycleImage(villa._id, 'next')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {/* Image Indicators */}
                    {villa.images.length > 1 && (
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                        {villa.images.map((_, index) => (
                          <div 
                            key={index} 
                            className={`h-1.5 w-1.5 rounded-full ${getCurrentImageIndex(villa._id) === index ? 'bg-white' : 'bg-white/40'}`}
                          ></div>
                        ))}
                      </div>
                    )}
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center shadow-md">
                      <FaStar className="text-yellow-600 mr-1" />
                      <span className="font-medium text-sm">{villa.rating}</span>
                      <span className="text-gray-500 text-xs ml-1">({villa.reviews})</span>
                    </div>
                    
                    {/* Availability Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium shadow-md ${
                      villa.isBooked 
                        ? "bg-red-100 text-red-800 border border-red-200" 
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}>
                      {villa.isBooked ? "Not Available" : "Available"}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`p-4 sm:p-6 flex flex-col ${viewType === 'list' ? 'w-full sm:w-3/5' : 'w-full'}`}>
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl font-serif font-medium text-gray-900">{villa.name}</h3>
                    </div>
                    
                    <div className="flex items-center text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
                      <FaMapMarkerAlt className="mr-1 text-yellow-600" />
                      <span>{villa.location}</span>
                    </div>
                    
                    <div className={`flex gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap ${viewType === 'list' ? 'mb-auto' : ''}`}>
                      <div className="flex items-center bg-yellow-50/50 px-2 py-1 rounded-md border border-yellow-100/50">
                        <FaBed className="mr-1 text-yellow-600" />
                        <span className="text-xs sm:text-sm text-gray-700">{villa.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center bg-yellow-50/50 px-2 py-1 rounded-md border border-yellow-100/50">
                        <FaBath className="mr-1 text-yellow-600" />
                        <span className="text-xs sm:text-sm text-gray-700">{villa.bathrooms} Bathrooms</span>
                      </div>
                    </div>
                    
                    <div className="text-gray-600 mb-4 line-clamp-2">
                      {villa.description || "Experience luxury living in this beautifully designed villa with premium amenities and stunning views."}
                    </div>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                      {villa.amenities.map((amenity, index) => {
                        const label = typeof amenity === "string"
                          ? amenity
                          : amenity?.label || amenity?.name || ""
                        if (!label) return null
                        return (
                          <div key={`${label}-${index}`} className="flex items-center text-xs sm:text-sm text-gray-600">
                            {typeof amenity === "object" && amenity.icon && (
                              <span className="text-yellow-600">{amenity.icon}</span>
                            )}
                            <span className="ml-1">{label}</span>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <span className="text-xl sm:text-2xl font-semibold text-yellow-600">₹{villa.price}</span>
                        <span className="text-gray-500 text-xs sm:text-sm"> / night</span>
                      </div>
                      
                      <Link
                        to={`/villas/${villa._id}`}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                          villa.isBooked
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-700 text-white shadow hover:shadow-md hover:shadow-yellow-100"
                        }`}
                        onClick={(e) => villa.isBooked && e.preventDefault()}
                      >
                        {villa.isBooked ? "Not Available" : "View Details"}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResults