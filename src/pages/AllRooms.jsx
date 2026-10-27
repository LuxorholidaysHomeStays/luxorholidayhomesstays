
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import PhotoGallery from "./PhotoGallery"
import Ac from "../assets/Facilities/AC.png"
import Kitchen from "../assets/Facilities/KITCHEN.png"
import Parking from "../assets/Facilities/PARK.png"
import Pool from "../assets/Facilities/p.png"
import Wifi from "../assets/Facilities/WIFI.png"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { API_BASE_URL } from "../config/api"
import { toast } from "../utils/toast"

// Custom CSS animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes searchStretch {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.02);
    }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .animate-slideInLeft {
    animation: slideInLeft 0.5s ease-out forwards;
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }
  .animate-searchStretch {
    animation: searchStretch 0.3s ease-out forwards;
  }
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #000000;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .search-bar:focus-within {
    transform: scale(1.02);
  }
  .filter-sidebar::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  .filter-sidebar::-webkit-scrollbar-track {
    background: transparent;
  }
  .filter-sidebar::-webkit-scrollbar-thumb {
    background: transparent;
  }
  .filter-sidebar::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

// Villa image collections (keeping your existing image imports)
const villaImageCollections = {
  "Amrith Palace": [
    "/AmrithPalace/AP8.jpg",
    "/AmrithPalace/AP2.jpg",
    "/AmrithPalace/AP3.jpg",
    "/AmrithPalace/AP4.jpg",
    "/AmrithPalace/AP5.jpg",
    "/AmrithPalace/AP6.jpg",
    "/AmrithPalace/AP7.jpg",
    "/AmrithPalace/AP1.jpg",
    "/AmrithPalace/AP9.jpg",
    "/AmrithPalace/AP10.jpg",
    "/AmrithPalace/AP11.jpg",
    "/AmrithPalace/AP12.jpg",
    "/AmrithPalace/AP13.jpg",
    "/AmrithPalace/AP14.jpg",
    "/AmrithPalace/AP15.jpg",
    "/AmrithPalace/AP16.jpg",
    "/AmrithPalace/AP17.jpg",
    "/AmrithPalace/AP18.jpg",
    "/AmrithPalace/AP19.jpg",
    "/AmrithPalace/AP20.jpg",
    "/AmrithPalace/AP21.jpg",
    "/AmrithPalace/AP22.jpg",
    "/AmrithPalace/AP23.jpg",
    "/AmrithPalace/AP24.jpg",
    "/AmrithPalace/AP25.jpg",
    "/AmrithPalace/AP26.jpg",
    "/AmrithPalace/AP27.jpg",
    "/AmrithPalace/AP28.jpg",
    "/AmrithPalace/AP29.jpg",
    "/AmrithPalace/AP30.jpg",
  ],
  "East Coast Villa": [
    "/eastcoastvilla/EC1.jpg",
    "/eastcoastvilla/EC2.jpg",
    "/eastcoastvilla/EC3.jpg",
    "/eastcoastvilla/EC4.jpg",
    "/eastcoastvilla/EC5.jpg",
    "/eastcoastvilla/EC6.jpg",
    "/eastcoastvilla/EC7.jpg",
    "/eastcoastvilla/EC8.jpg",
    "/eastcoastvilla/EC9.jpg",
    "/eastcoastvilla/EC10.jpg",
    "/eastcoastvilla/EC11.jpg",
    "/eastcoastvilla/EC12.jpg",
    "/eastcoastvilla/EC13.jpg",
    "/eastcoastvilla/EC14.jpg",
    "/eastcoastvilla/EC15.jpg",
  ],
  "Ram Water Villa": [
    "/ramwatervilla/RW19.jpg",
    "/ramwatervilla/RW2.jpg",
    "/ramwatervilla/RW3.jpg",
    "/ramwatervilla/RW4.jpg",
    "/ramwatervilla/RW5.jpg",
    "/ramwatervilla/RW6.jpg",
    "/ramwatervilla/RW7.jpg",
    "/ramwatervilla/RW8.jpg",
    "/ramwatervilla/RW9.jpg",
    "/ramwatervilla/RW10.jpg",
    "/ramwatervilla/RW11.jpg",
    "/ramwatervilla/RW13.jpg",
    "/ramwatervilla/RW14.jpg",
    "/ramwatervilla/RW15.jpg",
    "/ramwatervilla/RW16.jpg",
    "/ramwatervilla/RW17.jpg",
    "/ramwatervilla/RW18.jpg",
    "/ramwatervilla/RW1.jpg",
  ],
  "Empire Anand Villa Samudra": [
    "/empireanandvillasamudra/anandvilla1.jpg",
    "/empireanandvillasamudra/anandvilla2.jpg",
    "/empireanandvillasamudra/anandvilla3.jpg",
    "/empireanandvillasamudra/anandvilla4.jpg",
    "/empireanandvillasamudra/anandvilla5.jpg",
    "/empireanandvillasamudra/anandvilla6.jpg",
    "/empireanandvillasamudra/anandvilla7.jpg",
    "/empireanandvillasamudra/anandvilla8.jpg",
    "/empireanandvillasamudra/anandvilla9.jpg",
    "/empireanandvillasamudra/anandvilla10.jpg",
    "/empireanandvillasamudra/anandvilla11.jpg",
    "/empireanandvillasamudra/anandvilla12.jpg",
    "/empireanandvillasamudra/anandvilla13.jpg",
    "/empireanandvillasamudra/anandvilla14.jpg",
    "/empireanandvillasamudra/anandvilla15.jpg",
    "/empireanandvillasamudra/anandvilla16.jpg",
  ],
  "Lavish Villa I": [
    "/LavishVilla 1/lvone18.jpg",
    "/LavishVilla 1/lvone2.jpg",
    "/LavishVilla 1/lvone3.jpg",
    "/LavishVilla 1/lvone4.jpg",
    "/LavishVilla 1/lvone5.jpg",
    "/LavishVilla 1/lvone6.jpg",
    "/LavishVilla 1/lvone7.jpg",
    "/LavishVilla 1/lvone8.jpg",
    "/LavishVilla 1/lvone9.jpg",
    "/LavishVilla 1/lvone10.jpg",
    "/LavishVilla 1/lvone11.jpg",
    "/LavishVilla 1/lvone12.jpg",
    "/LavishVilla 1/lvone13.jpg",
    "/LavishVilla 1/lvone14.jpg",
    "/LavishVilla 1/lvone15.jpg",
    "/LavishVilla 1/lvone16.jpg",
    "/LavishVilla 1/lvone17.jpg",
    "/LavishVilla 1/lvone1.jpg",
    "/LavishVilla 1/lvone19.jpg",
    "/LavishVilla 1/lvone20.jpg",
    "/LavishVilla 1/lvone21.jpg",
    "/LavishVilla 1/lvone22.jpg",
  ],
  "Lavish Villa II": [
    "/LavishVilla 2/lvtwo4.jpg",
    "/LavishVilla 2/lvtwo2.jpg",
    "/LavishVilla 2/lvtwo3.jpg",
    "/LavishVilla 2/lvtwo1.jpg",
    "/LavishVilla 2/lvtwo5.jpg",
    "/LavishVilla 2/lvtwo6.jpg",
    "/LavishVilla 2/lvtwo7.jpg",
    "/LavishVilla 2/lvtwo8.jpg",
    "/LavishVilla 2/lvtwo9.jpg",
    "/LavishVilla 2/lvtwo10.jpg",
    "/LavishVilla 2/lvtwo11.jpg",
    "/LavishVilla 2/lvtwo12.jpg",
    "/LavishVilla 2/lvtwo13.jpg",
    "/LavishVilla 2/lvtwo14.jpg",
    "/LavishVilla 2/lvtwo15.jpg",
    "/LavishVilla 2/lvtwo16.jpg",
    "/LavishVilla 2/lvtwo17.jpg",
    "/LavishVilla 2/lvtwo18.jpg",
    "/LavishVilla 2/lvtwo19.jpg",
    "/LavishVilla 2/lvtwo20.jpg",
    "/LavishVilla 2/lvtwo21.jpg",
    "/LavishVilla 2/lvtwo22.jpg",
  ],
  "Lavish Villa III": [
    "/LavishVilla 3/lvthree17.jpg",
    "/LavishVilla 3/lvthree2.jpg",
    "/LavishVilla 3/lvthree3.jpg",
    "/LavishVilla 3/lvthree4.jpg",
    "/LavishVilla 3/lvthree5.jpg",
    "/LavishVilla 3/lvthree6.jpg",
    "/LavishVilla 3/lvthree7.jpg",
    "/LavishVilla 3/lvthree8.jpg",
    "/LavishVilla 3/lvthree9.jpg",
    "/LavishVilla 3/lvthree10.jpg",
    "/LavishVilla 3/lvthree12.jpg",
    "/LavishVilla 3/lvthree13.jpg",
    "/LavishVilla 3/lvthree14.jpg",
    "/LavishVilla 3/lvthree15.jpg",
    "/LavishVilla 3/lvthree16.jpg",
    "/LavishVilla 3/lvthree11.jpg",
    "/LavishVilla 3/lvthree18.jpg",
  ],
  "Opal Villa": [
    "/opal/opal5.jpg",
    "/opal/opal1.jpg",
    "/opal/opal2.jpg",
    "/opal/opal3.jpg",
    "/opal/opal4.jpg",
    "/opal/opal6.jpg",
    "/opal/opal7.jpg",
    "/opal/opal8.jpg",
    "/opal/opal9.jpg",
    "/opal/opal10.jpg",
    "/opal/opal11.jpg",
    "/opal/opal12.jpg",
    "/opal/opal13.jpg",
    "/opal/opal14.jpg",
    "/opal/opal15.jpg",
    "/opal/opal16.jpg",
    "/opal/opal17.jpg",
    "/opal/opal18.jpg",
    "/opal/opal19.jpg",
    "/opal/opal20.jpg",
    "/opal/opal21.jpg",
    "/opal/opal22.jpg",
  ],
}

const facilityIconMap = {
  "Private Pool": Pool,
  "Shared Pool": Pool,
  "Free Parking": Parking,
  AC: Ac,
  WiFi: Wifi,
  Kitchen: Kitchen,
  Microwave: Kitchen,
  Barbecue: Kitchen,
  Gym: Kitchen,
  "Pet Friendly": null,
}

// Main Component
const AllRooms = () => {
  const [villas, setVillas] = useState([])
  const [filteredVillas, setFilteredVillas] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [sortBy, setSortBy] = useState("Recently Added")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const guests = searchParams.get("guests")

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedBedrooms, setSelectedBedrooms] = useState("Any")
  const [selectedBeds, setSelectedBeds] = useState("Any")
  const [selectedAmenities, setSelectedAmenities] = useState([])

  // UI states
  const [showPriceFilter, setShowPriceFilter] = useState(true)
  const [showTypeFilter, setShowTypeFilter] = useState(true)
  const [showRoomsFilter, setShowRoomsFilter] = useState(true)
  const [showAmenitiesFilter, setShowAmenitiesFilter] = useState(true)
  const [cardImageIndexes, setCardImageIndexes] = useState({})
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [selectedVilla, setSelectedVilla] = useState(null)

  // Close handler for photo gallery - SINGLE DECLARATION
  const closePhotoGallery = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setShowPhotoGallery(false)
    setSelectedVilla(null)
    // Re-enable body scrolling
    document.body.style.overflow = "unset"
    document.body.classList.remove("modal-open")
    // Ensure we stay on current page
    navigate(location.pathname || '/', { replace: true })
  }

  useEffect(() => {
    // Read URL search params from Hero component
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    if (guests) setSelectedBedrooms(guests === 'Any' ? 'Any' : guests)

    const fetchVillas = async () => {
      try {
        setLoading(true)
        console.log("Fetching villas from:", `${API_BASE_URL}/api/villas`)

        const response = await fetch(`${API_BASE_URL}/api/villas`)
        const availabilityResponse = checkIn && checkOut
          ? await fetch(`${API_BASE_URL}/api/bookings/search?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`)
          : null
        if (!response.ok) {
          console.error("API Error:", response.status, response.statusText)
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("API Response data:", data)

        const villaList = Array.isArray(data) ? data : (data.villas || data.data || [])
        const availabilityData = availabilityResponse?.ok ? await availabilityResponse.json() : null
        const unavailableIds = new Set(availabilityData?.unavailableVillaIds || [])

        if (villaList.length === 0) {
          console.warn("API returned empty data")
          setVillas([])
          setFilteredVillas([])
          setLoading(false)
          return
        }

        // Process villa data and handle images properly
        const transformedData = villaList.filter((villa) => !unavailableIds.has(String(villa.id || villa._id))).map((villa, index) => {
          // Check if this villa has a local image collection
          let images

          // Helper function to find the best matching villa name
          const getBestMatchingVillaImages = (villaName) => {
            // Direct match
            if (villaImageCollections[villaName]) {
              return villaImageCollections[villaName]
            }

            // Case insensitive match
            const lowercaseVillaName = villaName.toLowerCase().trim()
            for (const [key, imageArray] of Object.entries(villaImageCollections)) {
              if (key.toLowerCase().trim() === lowercaseVillaName) {
                return imageArray
              }
            }

            // Partial match (for villas with slightly different names)
            for (const [key, imageArray] of Object.entries(villaImageCollections)) {
              if (lowercaseVillaName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowercaseVillaName)) {
                return imageArray
              }
            }

            // Check for specific keywords in names
            const nameKeywords = {
              opal: "Opal Villa",
              amrith: "Amrith Palace",
              palace: "Amrith Palace",
              "east coast": "East Coast Villa",
              eastcoast: "East Coast Villa",
              "ram water": "Ram Water Villa",
              ramwater: "Ram Water Villa",
              empire: "Empire Anand Villa Samudra",
              anand: "Empire Anand Villa Samudra",
              samudra: "Empire Anand Villa Samudra",
            }

            for (const [keyword, villaKey] of Object.entries(nameKeywords)) {
              if (lowercaseVillaName.includes(keyword)) {
                return villaImageCollections[villaKey]
              }
            }

            // Return default images if no match found
            return null
          }

          // Try to find matching images for this villa
          const villaName = villa.name || ""
          images = getBestMatchingVillaImages(villaName)

          // If no match found, use backend images or show placeholder
          if (!images) {
            if (Array.isArray(villa.images) && villa.images.length > 0) {
              images = villa.images
            } else {
              // No images available - will show placeholder in UI
              images = []
            }
          }

          // Generate a unique ID based on backend id or name
          const generatedId = villa.id || villa._id || `villa-${(villa.name || "").toLowerCase().replace(/\s+/g, "-")}-${index}`

          // Use backend price directly - no fallback pricing since backend is the authority
          let price = Number(villa.price) || 0

          // Extract amenities from backend if available
          let amenities = []
          if (Array.isArray(villa.amenities)) {
            amenities = villa.amenities
          } else if (villa.facilities && Array.isArray(villa.facilities)) {
            amenities = villa.facilities.map((facility) => facility.name || facility)
          }

          return {
            id: generatedId,
            _id: villa._id,
            name: villa.name || `Villa ${index + 1}`,
            // No invented location, occupancy or rating: an unknown value renders
            // as unknown instead of random data the guest would rely on.
            location: villa.location || "",
            price: price,
            description: villa.description || "",
            images: images,
            guests: villa.guests || 0,
            bedrooms: villa.bedrooms || 0,
            bathrooms: villa.bathrooms || villa.bedrooms || 0,
            rating: Number(villa.rating) || 0,
            amenities: amenities.length > 0 ? amenities : [],
            type: villa.type || "VILLA",
          }
        })

        console.log("Transformed villa data:", transformedData)

        setVillas(transformedData)
        // Apply any currently active filters
        const filtered = applyAllFilters(transformedData)
        setFilteredVillas(filtered)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching villas:", error)
        setError(error)
        setLoading(false)

        // Fallback to show something if the API fails
        createFallbackVillas()
      }
    }

    fetchVillas()
  }, [])

  // Function to create fallback villas if API fails
  const createFallbackVillas = () => {
    try {
      console.log("Creating fallback villas")

      // Create some fallback villas using our predefined image collections
      const fallbackVillas = []

      Object.entries(villaImageCollections).forEach(([name, images], index) => {
        fallbackVillas.push({
          id: `fallback-villa-${index}`,
          _id: `fallback-${index}`,
          name: name,
          // This list only appears when the API is unreachable. It shows names and
          // photographs we hold locally, and leaves price, location and occupancy
          // blank rather than presenting invented figures as real.
          location: "",
          price: 0,
          description: "",
          images: images,
          guests: 0,
          bedrooms: 0,
          bathrooms: 0,
          rating: 0,
          amenities: [],
          type: "VILLA",
        })
      })

      setVillas(fallbackVillas)
      // Sort fallback villas in the preferred order before setting them
      const sortedFallbackVillas = sortVillasByPreferredOrder(fallbackVillas)
      setFilteredVillas(sortedFallbackVillas)
      setLoading(false)
    } catch (fallbackError) {
      console.error("Even fallback creation failed:", fallbackError)
    }
  }

  // Apply all active filters function - separated for reusability
  const applyAllFilters = (villasToFilter) => {
    const filtered = villasToFilter.filter((villa) => {
      // Price filter
      if (villa.price < priceRange[0] || villa.price > priceRange[1]) return false

      // Location filter
      if (selectedTypes.length > 0 && !selectedTypes.some(type => (villa.location || "").toLowerCase().includes(type.toLowerCase()))) return false

      // Bedrooms filter
      if (selectedBedrooms !== "Any" && villa.bedrooms !== Number.parseInt(selectedBedrooms)) return false
      if (guests && guests !== "Any" && Number(villa.guests || 0) < Number(guests)) return false

      // Beds filter
      if (selectedBeds !== "Any" && (villa.beds || villa.bedrooms) !== Number.parseInt(selectedBeds)) return false

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every((amenity) =>
          villa.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase())),
        )
        if (!hasAllAmenities) return false
      }

      // Search term filter (if active)
      if (
        searchTerm &&
        !villa.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !villa.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      return true
    })

    // Apply sorting
    let sorted = [...filtered]
    if (sortBy === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortBy === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sortBy === "Rating") {
      sorted.sort((a, b) => b.rating - a.rating)
    } else {
      // Apply custom preferred order sorting
      sorted = sortVillasByPreferredOrder(sorted)
    }

    return sorted
  }

  // Add this function after the applyAllFilters function (around line 455)

  const sortVillasByPreferredOrder = (villas) => {
    // Define the preferred order
    const preferredOrder = [
      "Empire Anand Villa Samudra",
      "Amrith Palace",
      "East Coast Villa",
      "Ram Water Villa", 
      "Lavish Villa I",
      "Lavish Villa II",
      "Lavish Villa III",
      "Opal Villa"
    ];
    
    // Create a sorting function based on the preferred order
    return [...villas].sort((a, b) => {
      // Get villa name index in the preferred order array
      const aIndex = preferredOrder.findIndex(name => 
        a.name.toLowerCase().includes(name.toLowerCase())
      );
      
      const bIndex = preferredOrder.findIndex(name => 
        b.name.toLowerCase().includes(name.toLowerCase())
      );
      
      // If both villas are in the preferred order, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one villa is in the preferred order, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // For villas not in the preferred order, maintain original order
      return 0;
    });
  };

  useEffect(() => {
    // When filters change, apply them to the main villa list
    if (villas.length > 0) {
      const filtered = applyAllFilters(villas)
      setFilteredVillas(filtered)
    }
  }, [priceRange, selectedTypes, selectedBedrooms, selectedBeds, selectedAmenities, sortBy, searchTerm])

  // Live search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      performLocalSearch()
    }, 300) // 300ms delay for better UX

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const clearFilters = () => {
    setPriceRange([0, 50000])
    setSelectedTypes([])
    setSelectedBedrooms("Any")
    setSelectedBeds("Any")
    setSelectedAmenities([])
  }

  const toggleFavorite = (villaId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(villaId)) {
      newFavorites.delete(villaId)
    } else {
      newFavorites.add(villaId)
    }
    setFavorites(newFavorites)
  }

  // Function to download all villa images
  const downloadVillaImages = async (villa) => {
    try {
      const images = villa.images || []
      if (images.length === 0) {
        toast.warning("This villa has no images to download.");
        return
      }

      // Show loading notification
      toast.info(`Preparing to download ${images.length} image(s) for ${villa.name}`);

      // Create a ZIP file or download all images in a folder-like structure
      const folderName = villa.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")

      // Download each image with folder-like naming
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i]
        const fileName = `${folderName}_${(i + 1).toString().padStart(2, "0")}.jpg`

        try {
          // Fetch the image as blob
          const response = await fetch(imageUrl)
          const blob = await response.blob()

          // Create a temporary anchor element to trigger download
          const link = document.createElement("a")
          const url = window.URL.createObjectURL(blob)
          link.href = url
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          // Small delay between downloads to avoid overwhelming the browser
          if (i < images.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 800))
          }
        } catch (error) {
          console.error(`Failed to download image ${i + 1}:`, error)
          // Try alternative download method
          try {
            const link = document.createElement("a")
            link.href = imageUrl
            link.download = fileName
            link.target = "_blank"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } catch (fallbackError) {
            console.error(`Fallback download also failed for image ${i + 1}:`, fallbackError)
          }
        }
      }

      // Success notification
      setTimeout(() => {
        toast.success(`Successfully downloaded ${images.length} image(s) for ${villa.name}`);
      }, 1500)
    } catch (error) {
      console.error("Error downloading villa images:", error)
      toast.error("There was an error downloading the images. Please try again.");
    }
  }

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
    } else {
      setSelectedAmenities([...selectedAmenities, amenity])
    }
  }

  const handleViewVilla = (e, villa, isDetailsView = false) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (isDetailsView) {
      // Navigate to details page
      const villaId = villa._id || villa.id
      navigate(`/villa/${villaId}`, { state: { villa: villa } })
    } else {
      // Show photo gallery
      setSelectedVilla(villa)
      setShowPhotoGallery(true)
      // Prevent body scroll when modal opens
      document.body.style.overflow = "hidden"
      document.body.classList.add("modal-open")
      // Ensure we stay on current page
      window.history.replaceState(null, "", window.location.pathname)
    }
  }

  // Add a search handler with live search
  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!searchTerm.trim()) {
      // If empty search, show all villas
      setFilteredVillas(villas)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/villas`)

      if (response.ok) {
        const data = await response.json()
        const rawList = Array.isArray(data) ? data : (data.villas || data.data || []);
        const filtered = searchTerm
          ? rawList.filter(v => (v.location || '').toLowerCase().includes(searchTerm.toLowerCase()) || (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
          : rawList;
        const transformedData = filtered.map((villa, index) => {
          let images = villa.images || []
          if (images.length === 1 && images[0] === "empireAnandVillaImages") {
            images = []
          }

          const generatedId = villa._id || `villa-${villa.name.toLowerCase().replace(/\s+/g, "-")}-${index}`

          return {
            id: generatedId,
            _id: villa._id,
            name: villa.name,
            location: villa.location,
            price: villa.price || 0,
            description: villa.description,
            images,
            guests: villa.guests || 0,
            bedrooms: villa.bedrooms || 0,
            bathrooms: villa.bathrooms || 0,
            rating: villa.rating || 4.5,
            amenities: villa.facilities?.map((f) => f.name) || [],
            type: villa.type || "VILLA",
          }
        })

        setVillas(transformedData)
        // Limit to only 6 villas
        setFilteredVillas(transformedData.slice(0, 6))
      } else {
        // Fallback to local search if API fails
        performLocalSearch()
      }
    } catch (err) {
      // Fallback to local search on error
      performLocalSearch()
    } finally {
      setLoading(false)
    }
  }

  // Local search function
  const performLocalSearch = () => {
    if (!villas || villas.length === 0) return
    const searchLower = searchTerm.toLowerCase().trim()
    if (!searchLower) {
      setFilteredVillas(applyAllFilters(villas))
      return
    }
    const filtered = villas.filter((villa) => {
      return (
        villa.name.toLowerCase().includes(searchLower) ||
        (villa.location || "").toLowerCase().includes(searchLower) ||
        villa.description?.toLowerCase().includes(searchLower) ||
        (villa.amenities && villa.amenities.some((amenity) => amenity.toLowerCase().includes(searchLower)))
      )
    })
    setFilteredVillas(filtered)
  }

  // Helper function to get fallback images based on villa name
  const getFallbackImages = (villaName) => {
    const lowerName = villaName.toLowerCase()
    if (lowerName.includes("amrith") || lowerName.includes("palace")) {
      return villaImageCollections["Amrith Palace"].slice(0, 5)
    } else if (lowerName.includes("east") || lowerName.includes("coast")) {
      return villaImageCollections["East Coast Villa"].slice(0, 5)
    } else if (lowerName.includes("ram") || lowerName.includes("water")) {
      return villaImageCollections["Ram Water Villa"].slice(0, 5)
    } else {
      return villaImageCollections["Empire Anand Villa Samudra"].slice(0, 5)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-white px-4">
        <div className="text-center p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 max-w-sm w-full">
          <div className="relative mx-auto mb-6 w-16 h-16 sm:w-20 sm:h-20">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-[#D4AF37] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-4 border-l-4 border-amber-200 animate-ping opacity-60"></div>
          </div>
          <p className="text-lg sm:text-xl text-gray-800 mb-1 font-semibold">Loading Villas</p>
          <p className="text-xs sm:text-sm text-gray-500">Fetching the best stays for you...</p>
        </div>
      </div>
    )
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-white px-4">
        <div className="text-center p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 max-w-md w-full">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg sm:text-xl text-gray-800 mb-1 font-semibold">Unable to Load Villas</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">We encountered a problem while fetching villa data.</p>
          <div className="bg-gray-50 p-3 rounded-xl text-left mb-5 overflow-auto max-h-24 border border-gray-100">
            <p className="text-xs text-red-600 font-mono">{error.message || "Unknown error"}</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#D4AF37] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-[#c5a028] transition-colors font-medium text-xs sm:text-sm"
            >
              Retry
            </button>
            <button
              onClick={createFallbackVillas}
              className="bg-gray-100 text-gray-800 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm border border-gray-200"
            >
              Load Sample Villas
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show villa listing page
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header Section */}
      <div className="bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 border-b border-gray-100 py-6 sm:py-8 lg:py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D4AF37]">Luxury Villas</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Discover your perfect getaway in our handpicked collection
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 font-medium">
            <span className="flex items-center bg-white/80 px-3 py-1.5 rounded-full border border-gray-200/80">
              <svg className="w-4 h-4 mr-1.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Verified Properties
            </span>
            <span className="flex items-center bg-white/80 px-3 py-1.5 rounded-full border border-gray-200/80">
              <svg className="w-4 h-4 mr-1.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              24/7 Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Sidebar Filters - Responsive & Clean Border Design */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
              {/* Destination Filter */}
              <div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowTypeFilter(!showTypeFilter)}
                    className="flex items-center justify-between w-full text-left font-semibold group"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="p-1.5 bg-[#D4AF37] rounded-lg">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-base sm:text-lg text-gray-900 font-bold">Destination</span>
                    </div>
                    <div className={`transform transition-transform duration-200 ${showTypeFilter ? "rotate-180" : ""}`}>
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-hover:text-[#D4AF37]" />
                    </div>
                  </button>
                </div>

                {/* Filter Options */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showTypeFilter ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-2.5">
                    <label
                      className={`flex items-center justify-between cursor-pointer p-2.5 sm:p-3 rounded-xl border transition-all ${
                        selectedTypes.includes("Pondicherry")
                          ? "border-[#D4AF37] bg-amber-50/40"
                          : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes("Pondicherry")}
                          onChange={() => handleTypeChange("Pondicherry")}
                          className="w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100/70 border border-amber-200/80 rounded-full flex items-center justify-center">
                          <span className="text-[#D4AF37] text-xs font-bold">P</span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">
                          Pondicherry
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center justify-between cursor-pointer p-2.5 sm:p-3 rounded-xl border transition-all ${
                        selectedTypes.includes("Chennai")
                          ? "border-[#D4AF37] bg-amber-50/40"
                          : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes("Chennai")}
                          onChange={() => handleTypeChange("Chennai")}
                          className="w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100/70 border border-amber-200/80 rounded-full flex items-center justify-center">
                          <span className="text-[#D4AF37] text-xs font-bold">C</span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">
                          Chennai
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Reset filter button if any destination is active */}
                  {selectedTypes.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-3.5 w-full py-2 text-xs font-semibold text-[#D4AF37] hover:text-[#b39023] border border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-xl bg-amber-50/30 transition-colors"
                    >
                      Clear Destination Filter ({selectedTypes.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Villa Grid - Fully Responsive & Clean Modern Cards */}
          <div className="flex-1 w-full min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
              {filteredVillas &&
                filteredVillas.map((villa, idx) => {
                  const images = villa.images || []
                  const currentImageIndex = cardImageIndexes[villa.id] || 0

                  const handlePrev = (e) => {
                    e.stopPropagation()
                    setCardImageIndexes((prev) => ({
                      ...prev,
                      [villa.id]: (currentImageIndex - 1 + images.length) % images.length,
                    }))
                  }

                  const handleNext = (e) => {
                    e.stopPropagation()
                    setCardImageIndexes((prev) => ({
                      ...prev,
                      [villa.id]: (currentImageIndex + 1) % images.length,
                    }))
                  }

                  return (
                    <div
                      key={villa.id || villa._id}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#D4AF37]
                      transition-all duration-300 cursor-pointer w-full overflow-hidden group flex flex-col justify-between"
                      onClick={(e) => handleViewVilla(e, villa)}
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                        {images.length > 0 ? (
                          <img
                            src={images[currentImageIndex] || "/placeholder.svg"}
                            alt={`${villa.name} ${currentImageIndex + 1}`}
                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500 ease-out"
                            onError={(e) => {
                              const fallbackImages = getFallbackImages(villa.name)
                              if (fallbackImages && fallbackImages.length > 0) {
                                e.target.src = fallbackImages[0]
                              } else {
                                e.target.src = "/placeholder.svg"
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image Available
                          </div>
                        )}

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={handlePrev}
                              aria-label="Previous Image"
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70
                              text-white rounded-full p-2 sm:p-2.5 transition-all
                              opacity-90 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-sm active:scale-95"
                            >
                              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button
                              onClick={handleNext}
                              aria-label="Next Image"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70
                              text-white rounded-full p-2 sm:p-2.5 transition-all
                              opacity-90 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-sm active:scale-95"
                            >
                              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            {/* Image Counter Badge */}
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
                              {currentImageIndex + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Card Details */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 sm:gap-4">
                        <div>
                          {/* Title & Price Row */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 group-hover:text-[#D4AF37] transition-colors truncate">
                                {villa.name}
                              </h3>
                              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 flex items-center gap-1 truncate">
                                <svg
                                  className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>{villa.location}</span>
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-base sm:text-lg lg:text-xl font-bold text-[#D4AF37]">
                                ₹{villa.price.toLocaleString()}
                              </div>
                              <div className="text-[11px] sm:text-xs text-gray-500">per night</div>
                            </div>
                          </div>

                          {/* Guests & Bedrooms Badges */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
                            <span className="flex items-center bg-amber-50/80 text-amber-900 border border-amber-200/60 px-2.5 py-1 rounded-lg text-xs font-medium">
                              <svg
                                className="w-3.5 h-3.5 mr-1 text-[#D4AF37]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {villa.guests} Guests
                            </span>
                            <span className="flex items-center bg-amber-50/80 text-amber-900 border border-amber-200/60 px-2.5 py-1 rounded-lg text-xs font-medium">
                              <svg
                                className="w-3.5 h-3.5 mr-1 text-[#D4AF37]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              {villa.bedrooms} Bedrooms
                            </span>
                          </div>
                        </div>

                        {/* Card Footer: Rating + View Details */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">{villa.rating}</span>
                          </div>

                          <button
                            type="button"
                            className="text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5
                            bg-[#D4AF37] text-white rounded-xl hover:bg-[#c5a028] active:bg-[#b08e26]
                            transition-colors duration-200 flex items-center gap-1 group/btn"
                            onClick={(e) => handleViewVilla(e, villa, true)}
                          >
                            <span>View Details</span>
                            <svg
                              className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Empty state when no villas match */}
            {filteredVillas && filteredVillas.length === 0 && (
              <div className="text-center py-12 px-4 rounded-2xl border border-gray-200 bg-white">
                <div className="mb-4 text-gray-400">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <p className="text-gray-800 font-semibold text-base sm:text-lg mb-1">No villas found matching your criteria.</p>
                <p className="text-gray-500 text-xs sm:text-sm mb-5">Try adjusting or clearing your filters to see more villas.</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#D4AF37] text-white px-5 py-2.5 rounded-xl hover:bg-[#c5a028]
                  transition-colors font-medium text-xs sm:text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery Modal */}
        {showPhotoGallery && selectedVilla && (
          <PhotoGallery
            images={selectedVilla.images}
            villaName={selectedVilla.name}
            isOpen={showPhotoGallery}
            onClose={closePhotoGallery}
            backTo={location.pathname || "/"}
            villa={selectedVilla}
          />
        )}
      </div>
    </div>
  )
}

export default AllRooms