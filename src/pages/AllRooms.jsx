"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import PhotoGallery from "./PhotoGallery"
import Ac from "../assets/Facilities/AC.png"
import Kitchen from "../assets/Facilities/KITCHEN.png"
import Parking from "../assets/Facilities/PARK.png"
import Pool from "../assets/Facilities/p.png"
import Wifi from "../assets/Facilities/WIFI.png"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config/api"
import Swal from "sweetalert2"

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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }
  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .search-bar:focus-within {
    transform: scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
    "/AmrithPalace/AP1.jpg",
    "/AmrithPalace/AP2.jpg",
    "/AmrithPalace/AP3.jpg",
    "/AmrithPalace/AP4.jpg",
    "/AmrithPalace/AP5.jpg",
    "/AmrithPalace/AP6.jpg",
    "/AmrithPalace/AP7.jpg",
    "/AmrithPalace/AP8.jpg",
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
    "/ramwatervilla/RW1.jpg",
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
    "/ramwatervilla/RW19.jpg",
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
    "/LavishVilla 1/lvone1.jpg",
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
    "/LavishVilla 1/lvone18.jpg",
    "/LavishVilla 1/lvone19.jpg",
    "/LavishVilla 1/lvone20.jpg",
    "/LavishVilla 1/lvone21.jpg",
    "/LavishVilla 1/lvone22.jpg",
  ],
  "Lavish Villa II": [
    "/LavishVilla 2/lvtwo1.jpg",
    "/LavishVilla 2/lvtwo2.jpg",
    "/LavishVilla 2/lvtwo3.jpg",
    "/LavishVilla 2/lvtwo4.jpg",
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
    "/LavishVilla 3/lvthree1.jpg",
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
    "/LavishVilla 3/lvthree17.jpg",
    "/LavishVilla 3/lvthree18.jpg",
  ],
}

// Utility to shuffle images for each villa
function getRandomImages(imagesArr) {
  const arr = [...imagesArr]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
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

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 50000])
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
  }

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        setLoading(true)
        console.log("Fetching villas from:", `${API_BASE_URL}/api/villas/`)

        const response = await fetch(`${API_BASE_URL}/api/villas/`)
        if (!response.ok) {
          console.error("API Error:", response.status, response.statusText)
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("API Response data:", data)

        if (!data || data.length === 0) {
          console.warn("API returned empty data")
          setVillas([])
          setFilteredVillas([])
          setLoading(false)
          return
        }

        // Process villa data and handle images properly
        const transformedData = data.map((villa, index) => {
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

          // If no match found, use backend images or fallback
          if (!images) {
            if (Array.isArray(villa.images) && villa.images.length > 0) {
              if (villa.images[0] === "empireAnandVillaImages") {
                // Use empire Anand Villa fallback for this specific case
                images = getRandomImages(villaImageCollections["Empire Anand Villa Samudra"])
              } else {
                // Use the images provided by the backend
                images = villa.images
              }
            } else if (villaName.toLowerCase().includes("anand") || villaName.toLowerCase().includes("empire")) {
              // Use empire Anand Villa fallback
              images = getRandomImages(villaImageCollections["Empire Anand Villa Samudra"])
            } else {
              // Default fallback - use a random image collection
              const collections = Object.values(villaImageCollections)
              const randomCollection = collections[Math.floor(Math.random() * collections.length)]
              images = getRandomImages(randomCollection)
            }
          }

          // Generate a unique ID based on villa name and index
          const generatedId = villa._id || `villa-${(villa.name || "").toLowerCase().replace(/\s+/g, "-")}-${index}`

          // Ensure we have a valid price
          const price = Number(villa.price) || Math.floor(Math.random() * 30000) + 5000

          // Extract amenities from facilities if available
          let amenities = []
          if (villa.facilities && Array.isArray(villa.facilities)) {
            amenities = villa.facilities.map((facility) => facility.name || facility)
          }

          return {
            id: generatedId,
            _id: villa._id,
            name: villa.name || `Villa ${index + 1}`,
            location: villa.location || "Goa, India",
            price: price,
            description: villa.description || "A beautiful villa with stunning views and modern amenities.",
            images: images,
            guests: villa.guests || Math.floor(Math.random() * 10) + 2,
            bedrooms: villa.bedrooms || Math.floor(Math.random() * 5) + 1,
            bathrooms: villa.bathrooms || villa.bedrooms || Math.floor(Math.random() * 5) + 1,
            rating: villa.rating || (Math.random() * 1 + 4).toFixed(1),
            amenities: amenities.length > 0 ? amenities : ["WiFi", "AC", "Kitchen", "Free Parking"],
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
          location: index % 2 === 0 ? "Goa, India" : "Pondicherry, India",
          price: Math.floor(Math.random() * 30000) + 5000,
          description: "A beautiful villa with stunning views and modern amenities.",
          images: images,
          guests: Math.floor(Math.random() * 10) + 2,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: (Math.random() * 1 + 4).toFixed(1),
          amenities: ["WiFi", "AC", "Kitchen", "Free Parking"],
          type: "VILLA",
        })
      })

      setVillas(fallbackVillas)
      setFilteredVillas(fallbackVillas)
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
      if (selectedTypes.length > 0 && !selectedTypes.includes(villa.location)) return false

      // Bedrooms filter
      if (selectedBedrooms !== "Any" && villa.bedrooms !== Number.parseInt(selectedBedrooms)) return false

      // Beds filter
      if (selectedBeds !== "Any" && villa.beds !== Number.parseInt(selectedBeds)) return false

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
    const sorted = [...filtered]
    if (sortBy === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortBy === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sortBy === "Rating") {
      sorted.sort((a, b) => b.rating - a.rating)
    }

    return sorted
  }

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
        Swal.fire({
          title: "No Images",
          text: "This villa has no images to download.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        })
        return
      }

      // Show loading notification
      Swal.fire({
        title: "Downloading Images...",
        text: `Preparing to download ${images.length} image(s) for ${villa.name}`,
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      })

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
        Swal.fire({
          title: "Download Complete!",
          text: `Successfully downloaded ${images.length} image(s) for ${villa.name}`,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        })
      }, 1500)
    } catch (error) {
      console.error("Error downloading villa images:", error)
      Swal.fire({
        title: "Download Failed",
        text: "There was an error downloading the images. Please try again.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      })
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
      const response = await fetch(`${API_BASE_URL}/api/villas/search?location=${encodeURIComponent(searchTerm)}`)

      if (response.ok) {
        const data = await response.json()
        const transformedData = data.map((villa, index) => {
          let images = villa.images || []
          if (images.length === 1 && images[0] === "empireAnandVillaImages") {
            images = getRandomImages(villaImageCollections["Empire Anand Villa Samudra"])
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
    const searchLower = searchTerm.toLowerCase().trim()
    const filtered = villas.filter((villa) => {
      return (
        villa.name.toLowerCase().includes(searchLower) ||
        villa.location.toLowerCase().includes(searchLower) ||
        villa.description?.toLowerCase().includes(searchLower) ||
        villa.amenities.some((amenity) => amenity.toLowerCase().includes(searchLower))
      )
    })
    // Limit to only 6 villas
    setFilteredVillas(filtered.slice(0, 6))
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 rounded-xl bg-white shadow-xl">
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-green-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-4 border-l-4 border-gray-200 animate-ping opacity-60"></div>
          </div>
          <p className="text-xl text-gray-700 mb-2 font-semibold">Loading Villas</p>
          <p className="text-gray-500">Fetching the best stays for you...</p>
        </div>
      </div>
    )
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 rounded-xl bg-white shadow-xl max-w-md">
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
          <p className="text-xl text-gray-700 mb-2 font-semibold">Unable to Load Villas</p>
          <p className="text-gray-500 mb-6">We encountered a problem while fetching villa data.</p>
          <div className="bg-gray-50 p-4 rounded-lg text-left mb-6 overflow-auto max-h-32">
            <p className="text-sm text-red-600 font-mono">{error.message || "Unknown error"}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Retry
            </button>
            <button
              onClick={createFallbackVillas}
              className="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
    <div className="min-h-screen">
      {/* Innovative Header Section */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D4AF37]">Luxury Villas</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Discover your perfect getaway in our handpicked collection
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified Properties
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="pb-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters - Enhanced Sticky */}
          <div
            className="w-full lg:w-80 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto
            self-start transition-all duration-300 filter-sidebar hide-scrollbar"
          >
            <div
              className="rounded-2xl shadow-lg p-3 sm:p-5 border border-[#D4AF37]/20
              backdrop-blur-sm hover:shadow-xl transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.7) 100%)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 20px -8px rgba(0, 0, 0, 0.15), 0 0 15px -5px rgba(212, 175, 55, 0.2)",
              }}
            >
              {/* Destination Filter with Clean Design */}
              <div className="mb-4 sm:mb-6 group">
                <div
                  className="bg-white/50 rounded-xl p-2 sm:p-4 border border-[#D4AF37]/30 hover:border-[#D4AF37]
                  hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => setShowTypeFilter(!showTypeFilter)}
                    className="flex items-center justify-between w-full text-left font-semibold"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div className="p-1 sm:p-2 bg-black rounded-lg">
                        <svg
                          className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white"
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
                      <span className="text-sm sm:text-lg text-[#D4AF37]">Destination</span>
                    </div>
                    <div className={`transform transition-all duration-300 ${showTypeFilter ? "rotate-180" : ""}`}>
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4AF37]" />
                    </div>
                  </button>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      showTypeFilter ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-2 sm:space-y-3">
                      <label
                        className="flex items-center group cursor-pointer p-1.5 sm:p-3 rounded-lg hover:bg-black/10
                        transition-all duration-300 border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes("Pondicherry")}
                          onChange={() => handleTypeChange("Pondicherry")}
                          className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded border-2 border-[#D4AF37]/50 text-[#D4AF37]
                            focus:ring-[#D4AF37] focus:ring-2 transition-all duration-200"
                        />
                        <div className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-3">
                          <div className="w-6 h-6 sm:w-10 sm:h-10 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
                            <span className="text-[#D4AF37] text-xs sm:text-sm font-bold">P</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#D4AF37] transition-colors">
                            Pondicherry
                          </span>
                        </div>
                      </label>
                      <label
                        className="flex items-center group cursor-pointer p-1.5 sm:p-3 rounded-lg hover:bg-black/10
                        transition-all duration-300 border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes("Chennai")}
                          onChange={() => handleTypeChange("Chennai")}
                          className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded border-2 border-[#D4AF37]/50 text-[#D4AF37]
                            focus:ring-[#D4AF37] focus:ring-2 transition-all duration-200"
                        />
                        <div className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-3">
                          <div className="w-6 h-6 sm:w-10 sm:h-10 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full flex items-center justify-center">
                            <span className="text-[#D4AF37] text-xs sm:text-sm font-bold">C</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#D4AF37] transition-colors">
                            Chennai
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Villa Grid with Enhanced Design */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
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

                  // Enhanced staggered animation
                  const animationDelay = `${idx * 0.15}s`

                  return (
                    <div
                      key={villa.id || villa._id}
                      className="bg-white/10 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl
                      transition-all duration-500 cursor-pointer transform hover:-translate-y-2
                      animate-fadeInUp group border border-[#D4AF37]/20 backdrop-blur-sm"
                      style={{
                        animationDelay,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      }}
                      onClick={(e) => handleViewVilla(e, villa)}
                    >
                      <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                        {images.length > 0 && (
                          <img
                            src={images[currentImageIndex] || "/placeholder.svg"}
                            alt={`${villa.name} ${currentImageIndex + 1}`}
                            className="object-cover h-full w-full transform group-hover:scale-110
                            transition-all duration-700 ease-out"
                            onError={(e) => {
                              // Try to get a fallback image if this one fails to load
                              const fallbackImages = getFallbackImages(villa.name)
                              if (fallbackImages && fallbackImages.length > 0) {
                                e.target.src = fallbackImages[0] // Use the first fallback image
                              } else {
                                e.target.src = "/placeholder.svg" // Last resort fallback
                              }
                            }}
                          />
                        )}

                        {/* Enhanced Navigation Buttons - No dots */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={handlePrev}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md
                              hover:bg-white/30 rounded-full p-3 shadow-lg transition-all duration-300
                              opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0
                              hover:scale-110 active:scale-95"
                            >
                              <ChevronLeft className="h-5 w-5 text-white" />
                            </button>
                            <button
                              onClick={handleNext}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md
                              hover:bg-white/30 rounded-full p-3 shadow-lg transition-all duration-300
                              opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0
                              hover:scale-110 active:scale-95"
                            >
                              <ChevronRight className="h-5 w-5 text-white" />
                            </button>
                            {/* Image counter instead of dots */}
                            <div
                              className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white
                            px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {currentImageIndex + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-2 sm:mb-4">
                          <div className="flex-1 mr-2">
                            <h3
                              className="font-bold text-lg sm:text-xl lg:text-2xl text-[#D4AF37] mb-1 sm:mb-2
                            transition-colors line-clamp-2 lg:line-clamp-1 opacity-90 group-hover:opacity-100"
                            >
                              {villa.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 flex items-center">
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[#D4AF37]/70 flex-shrink-0"
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
                              <span className="truncate">{villa.location}</span>
                            </p>
                          </div>
                          {/* Price in info section */}
                          <div className="text-right">
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-[#D4AF37]">
                              ₹{villa.price.toLocaleString()}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">per night</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                          <span
                            className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50
                          px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-blue-700 border border-blue-200/50"
                          >
                            <svg
                              className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5"
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
                          <span
                            className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50
                          px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-green-700 border border-green-200/50"
                          >
                            <svg
                              className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5"
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

                        <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs sm:text-sm font-semibold text-gray-700">{villa.rating}</span>
                          </div>
                          <motion.button
                            className="text-base sm:text-lg font-medium tracking-wider px-3 sm:px-4 py-1.5 sm:py-2
                          bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-black rounded-lg sm:rounded-xl
                          hover:from-[#E5C048] hover:to-[#CDB292] transition-all duration-300
                          flex items-center group shadow-lg hover:shadow-xl hover:scale-105"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleViewVilla(e, villa, true)}
                          >
                            View Details
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Empty state with animation */}
            {filteredVillas && filteredVillas.length === 0 && (
              <div className="text-center py-12 animate-fadeIn">
                <div className="mb-6 text-gray-400">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">No villas found matching your criteria.</p>
                <p className="text-gray-400 mb-6">Try adjusting your filters for better results.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700
                 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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
          />
        )}
      </div>
    </div>
  )
}

export default AllRooms
