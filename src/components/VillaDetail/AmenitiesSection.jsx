"use client"

import { useState, useEffect } from "react"
import {
  Check,
  ChevronUp,
  ChevronDown,
  Waves,
  Car,
  Wind,
  Wifi,
  Trees,
  Zap,
  Snowflake,
  Flame,
  UtensilsCrossed,
  ChefHat,
  Coffee,
  Shirt,
  Droplets,
  Baby,
  Tv,
  Package,
  Moon,
  Home,
  Thermometer,
  Loader2,
} from "lucide-react"
import { fetchVillaAmenities } from "../../utils/amenitiesApi"

// Standard amenities list for all villas
const standardAmenities = [
  "Private Pool",
  "Free Parking",
  "Free Street Parking",
  "AC",
  "WiFi",
  "Garden",
  "Microwave",
  "Refrigerator",
  "Stove",
  "Dishes",
  "Cooking Basics",
  "Coffee Maker",
  "Washing machine",
  "Geyser",
  "Oven",
  "Baby Crib",
  "TV",
  "Shampoo",
  "Essentials",
  "Hanger",
  "Room Dark Shades",
  "Patio",
]

// Icon mapping for amenities
const amenityIcons = {
  "Private Pool": Waves,
  "Free Parking": Car,
  "Free Street Parking": Car,
  AC: Wind,
  WiFi: Wifi,
  Garden: Trees,
  Microwave: Zap,
  Refrigerator: Snowflake,
  Stove: Flame,
  Dishes: UtensilsCrossed,
  "Cooking Basics": ChefHat,
  "Coffee Maker": Coffee,
  "Washing machine": Shirt,
  Geyser: Thermometer,
  Oven: ChefHat,
  "Baby Crib": Baby,
  TV: Tv,
  Shampoo: Droplets,
  Essentials: Package,
  Hanger: Shirt,
  "Room Dark Shades": Moon,
  Patio: Home,
}

export default function AmenitiesSection({ amenities = [], villaName }) {
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [backendAmenities, setBackendAmenities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch amenities from backend when villaName is provided
  useEffect(() => {
    const loadAmenities = async () => {
      if (!villaName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`[AMENITIES] Loading amenities for villa: ${villaName}`);
        const response = await fetchVillaAmenities(villaName);
        
        if (response.success && response.data?.amenities) {
          setBackendAmenities(response.data.amenities);
          console.log(`[AMENITIES] Loaded ${response.data.amenities.length} amenities for ${villaName}`);
        } else {
          console.log(`[AMENITIES] No amenities found for ${villaName}, using fallback`);
          setBackendAmenities([]);
        }
      } catch (err) {
        console.error(`[AMENITIES] Error loading amenities for ${villaName}:`, err);
        setError(err.message);
        setBackendAmenities([]);
      } finally {
        setLoading(false);
      }
    };

    loadAmenities();
  }, [villaName]);

  // Determine which amenities to use: backend amenities take priority, then props, then standard fallback
  const getAmenitiesList = () => {
    if (backendAmenities.length > 0) {
      return backendAmenities;
    }
    if (Array.isArray(amenities) && amenities.length > 0) {
      return amenities;
    }
    return standardAmenities;
  };

  const amenitiesList = getAmenitiesList();
  const visibleAmenities = showAllAmenities ? amenitiesList : amenitiesList.slice(0, 12)

  // Group amenities into columns for display
  const columnCount = 3
  const columnsAmenities = []
  for (let i = 0; i < columnCount; i++) {
    columnsAmenities.push(visibleAmenities.filter((_, index) => index % columnCount === i))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">What this place offers</h3>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading amenities...
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-700">
            Unable to load custom amenities for this villa. Showing standard amenities.
          </p>
        </div>
      )}
      
      {/* Show data source for debugging in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mb-2">
          Data source: {backendAmenities.length > 0 ? 'Backend' : amenities.length > 0 ? 'Props' : 'Standard Fallback'} 
          ({amenitiesList.length} amenities)
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columnsAmenities.map((columnItems, colIndex) => (
          <div key={colIndex} className="space-y-5">
            {columnItems.map((amenity) => {
              const IconComponent = amenityIcons[amenity] || Check
              return (
                <div key={amenity} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-base text-gray-700">{amenity}</p>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {amenitiesList.length > 12 && (
        <button
          onClick={() => setShowAllAmenities(!showAllAmenities)}
          className="mt-4 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center gap-2"
        >
          {showAllAmenities ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show all amenities <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
