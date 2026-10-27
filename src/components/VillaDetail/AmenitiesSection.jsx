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
  Bed,
  Bath,
  Sparkles,
  ShieldCheck,
  Compass,
  Thermometer,
  Loader2,
} from "lucide-react"
import { fetchVillaAmenities } from "../../utils/amenitiesApi"

// Standard amenities list fallback for villas
const standardAmenities = [
  "Air Conditioning",
  "Wi-Fi",
  "Television",
  "Free Parking",
  "Swimming Pool",
  "Power Backup",
  "King / Queen Beds",
  "Kitchen & Dining",
  "Private Pool",
  "Refrigerator",
  "Microwave",
  "Oven",
  "Baby Crib",
  "Shampoo",
  "Room Dark Shades",
  "Hanger",
  "Essentials",
  "Towel",
]

// Icon mapping dictionary
const amenityIcons = {
  "Private Pool": Waves,
  "Free Parking": Car,
  "Free Street Parking": Car,
  AC: Wind,
  WiFi: Wifi,
  "Wi-Fi": Wifi,
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
  Television: Tv,
  Shampoo: Droplets,
  Essentials: Package,
  Hanger: Shirt,
  "Room Dark Shades": Moon,
  Patio: Home,
  "King / Queen Beds": Bed,
  "Kitchen & Dining": UtensilsCrossed,
  "Power Backup": Zap,
  "Air Conditioning": Wind,
}

// Helper to find best matching icon
export const getAmenityIcon = (name) => {
  if (!name) return Sparkles
  if (amenityIcons[name]) return amenityIcons[name]

  const lower = name.toLowerCase().trim()
  if (lower.includes("pool") || lower.includes("swim")) return Waves
  if (lower.includes("park") || lower.includes("car")) return Car
  if (lower.includes("ac") || lower.includes("air condition") || lower.includes("climate") || lower.includes("cooling")) return Wind
  if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("internet")) return Wifi
  if (lower.includes("garden") || lower.includes("lawn") || lower.includes("tree")) return Trees
  if (lower.includes("micro") || lower.includes("power") || lower.includes("backup") || lower.includes("generator")) return Zap
  if (lower.includes("fridge") || lower.includes("refrigerator") || lower.includes("freeze")) return Snowflake
  if (lower.includes("stove") || lower.includes("bbq") || lower.includes("barbecue") || lower.includes("flame")) return Flame
  if (lower.includes("dish") || lower.includes("cutlery") || lower.includes("dining") || lower.includes("kitchen")) return UtensilsCrossed
  if (lower.includes("oven") || lower.includes("cook") || lower.includes("chef") || lower.includes("baking")) return ChefHat
  if (lower.includes("coffee") || lower.includes("tea") || lower.includes("kettle")) return Coffee
  if (lower.includes("wash") || lower.includes("cloth") || lower.includes("hanger") || lower.includes("wardrobe") || lower.includes("towel") || lower.includes("linen")) return Shirt
  if (lower.includes("geyser") || lower.includes("heater") || lower.includes("hot water") || lower.includes("bath") || lower.includes("temp")) return Thermometer
  if (lower.includes("crib") || lower.includes("baby") || lower.includes("child")) return Baby
  if (lower.includes("tv") || lower.includes("television") || lower.includes("screen") || lower.includes("theatre")) return Tv
  if (lower.includes("shampoo") || lower.includes("soap") || lower.includes("drop") || lower.includes("water") || lower.includes("toiletries")) return Droplets
  if (lower.includes("essential") || lower.includes("kit") || lower.includes("package")) return Package
  if (lower.includes("shade") || lower.includes("curtain") || lower.includes("dark") || lower.includes("night") || lower.includes("moon")) return Moon
  if (lower.includes("bed") || lower.includes("mattress")) return Bed
  if (lower.includes("patio") || lower.includes("balcony") || lower.includes("terrace") || lower.includes("deck")) return Home
  if (lower.includes("bath") || lower.includes("shower")) return Bath
  if (lower.includes("security") || lower.includes("guard") || lower.includes("safe") || lower.includes("cctv")) return ShieldCheck
  if (lower.includes("view") || lower.includes("mountain") || lower.includes("sea") || lower.includes("beach")) return Compass

  return Check
}

export default function AmenitiesSection({ amenities = [], villaName }) {
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [backendAmenities, setBackendAmenities] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch amenities from backend when villaName is provided
  useEffect(() => {
    const loadAmenities = async () => {
      if (!villaName) return
      
      setLoading(true)
      try {
        const response = await fetchVillaAmenities(villaName)
        if (response.success && response.data?.amenities && response.data.amenities.length > 0) {
          setBackendAmenities(response.data.amenities)
        } else {
          setBackendAmenities([])
        }
      } catch (err) {
        console.error(`[AMENITIES] Error loading amenities for ${villaName}:`, err)
        setBackendAmenities([])
      } finally {
        setLoading(false)
      }
    }

    loadAmenities()
  }, [villaName])

  // Determine which amenities to use
  const getAmenitiesList = () => {
    if (backendAmenities.length > 0) {
      return backendAmenities
    }
    if (Array.isArray(amenities) && amenities.length > 0) {
      return amenities
    }
    return standardAmenities
  }

  const amenitiesList = getAmenitiesList()
  const visibleAmenities = showAllAmenities ? amenitiesList : amenitiesList.slice(0, 9)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">What this place offers</h2>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        {visibleAmenities.map((amenity, idx) => {
          // The backend `amenities` column is raw JSONB, so an entry can be a plain
          // string, an object carrying a `name`, or null/undefined. Rendering an
          // object directly crashed React ("Objects are not valid as a React child").
          let label = amenity && typeof amenity === "object" ? amenity.name : amenity
          if (label === null || label === undefined || label === "") return null
          label = String(label)
          const IconComponent = getAmenityIcon(label)
          return (
            <div key={`${label}-${idx}`} className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-full bg-[#FAF5E6] border border-[#F2E5BA]/60 flex items-center justify-center text-[#D4AF37] flex-shrink-0 transition-transform group-hover:scale-105">
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base text-gray-800 font-medium leading-tight">{label}</span>
            </div>
          )
        })}
      </div>

      {amenitiesList.length > 9 && (
        <button
          onClick={() => setShowAllAmenities(!showAllAmenities)}
          className="mt-3 py-2.5 px-5 rounded-xl border border-gray-900 text-gray-900 hover:bg-gray-50 transition-all duration-300 font-semibold text-sm flex items-center gap-2 cursor-pointer active:scale-95"
        >
          {showAllAmenities ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show all {amenitiesList.length} amenities <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
