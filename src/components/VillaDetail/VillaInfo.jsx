import { useState, useEffect } from "react"
import {
  MapPin,
  ChevronDown,
  Star,
  Users,
  Bed,
  Bath,
  Tv,
  Wifi,
  Wind,
  Car,
  Waves,
  Zap,
  Coffee,
  UtensilsCrossed,
  Shield,
  MessageSquare,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  X
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import AmenitiesSection from "./AmenitiesSection"
import UnifiedCalendar from "./unified-calender"

// Default villa descriptions based on name
const villaDescriptions = {
  "Amrith Palace": `Amrith Palace is an exquisite 9BHK private luxury villa strategically located in Pattipulam ECR, just 45 minutes from Chennai city. This magnificent property spans across 8000 sq. ft., featuring 9 spacious air-conditioned bedrooms, each with en-suite bathrooms, and a grand air-conditioned hall perfect for indoor gatherings. The crown jewel of the property is its pristine private swimming pool surrounded by lush tropical landscaping.

  Located just 800 meters from the beach, guests can enjoy the perfect balance of privacy and sea proximity. The villa boasts ample parking space for up to 10 vehicles, high-speed Wi-Fi coverage throughout the property, and comprehensive kitchen facilities including modern appliances, cookware, and utensils.`,

  "Ram Water Villa": `Ram Water Villa is a stunning 5BHK private luxury property situated in the serene coastal area of Perur ECR, offering the perfect blend of modern amenities and natural beauty. This two-story villa features 5 meticulously designed air-conditioned bedrooms with premium mattresses and linens, plus a spacious air-conditioned hall ideal for indoor gatherings or relaxation.

  The villa's centerpiece is its crystal-clear private swimming pool with adjacent sun loungers and outdoor seating, perfect for soaking up the sunshine.`,

  "East Coast Villa": `East Coast Villa is a charming and compact 3BHK property in Perur ECR that offers an intimate, cozy atmosphere without compromising on luxury or amenities. This single-story villa spans approximately 2,500 sq. ft. and features three well-appointed air-conditioned bedrooms with quality furnishings, as well as a comfortable air-conditioned living room perfect for relaxation.`,

  "Empire Anand Villa Samudra": `Empire Anand Villa Samudra is a prestigious 6BHK beachfront luxury villa situated in the coveted Kovalam area of ECR, offering an unparalleled coastal living experience with direct sea views. This magnificent three-level property spans over 5,500 sq. ft. of thoughtfully designed living space that seamlessly blends indoor and outdoor environments.
 
   The villa features six luxurious en-suite bedrooms, each uniquely decorated with designer furnishings, premium bedding, and large windows that frame spectacular ocean views. The master suite includes a private balcony overlooking the sea, a walk-in closet, and a spa-like bathroom with both shower and soaking tub.`,

  "Opal Villa": `Opal Villa is an ultra-luxurious 4BHK private sanctuary located along the scenic East Coast Road (ECR), Chennai. Featuring cutting-edge contemporary architecture, the villa boasts a stunning private swimming pool, sun-drenched deck, spacious air-conditioned living areas, and en-suite designer bedrooms.

  With lush private landscaped gardens, gourmet kitchen amenities, and close proximity to the beach, Opal Villa is the quintessential luxury haven for family retreats, celebrations, and peaceful weekends.`
}

const villaLocations = {
  "Amrith Palace": {
    address: "Pattipulam, East Coast Road, Chennai, Tamil Nadu",
    coordinates: "12.8046° N, 80.2329° E",
    description: "Located just 800m from Pattipulam Beach, 45 minutes from Chennai city center",
    mapUrl: "https://maps.app.goo.gl/zgKn8G6c7q3zXaNK9",
    nearbyAttractions: ["Kovalam Beach - 15 min drive", "Mahabalipuram - 25 min drive", "Dakshina Chitra Museum - 20 min drive"]
  },
  "Ram Water Villa": {
    address: "Perur, East Coast Road, Chennai, Tamil Nadu",
    coordinates: "12.7985° N, 80.2456° E",
    description: "Peaceful location in Perur with just 5 minutes walk to a secluded beach",
    mapUrl: "https://maps.app.goo.gl/T42kAzGFteVLF7Ry7?g_st=ac",
    nearbyAttractions: ["Perur Beach - 5 min walk", "Local seafood hub - 10 min drive", "ECR scenic viewpoints - 15 min drive"]
  },
  "East Coast Villa": {
    address: "Perur, East Coast Road, Chennai, Tamil Nadu",
    coordinates: "12.8025° N, 80.2515° E",
    description: "Conveniently located on the East Coast Road with easy access to beaches and attractions",
    mapUrl: "https://maps.app.goo.gl/KbUjnyUxBeSNf3Yh8",
    nearbyAttractions: ["Nettukuppam Beach - 10 min drive", "Muttukadu Boat House - 20 min drive", "VGP Kingdom - 25 min drive"]
  },
  "Empire Anand Villa Samudra": {
    address: "Kovalam, East Coast Road, Chennai, Tamil Nadu",
    coordinates: "12.7879° N, 80.2483° E",
    description: "Premium beachfront location in Kovalam with direct sea views and private beach access",
    mapUrl: "https://maps.app.goo.gl/D1iCT5tYpnmbuHQr7",
    nearbyAttractions: ["Kovalam Beach - Direct access", "Crocodile Bank - 10 min drive", "Mahabalipuram Shore Temple - 20 min drive"]
  },
  "Opal Villa": {
    address: "East Coast Road, Chennai, Tamil Nadu",
    coordinates: "12.8210° N, 80.2415° E",
    description: "Scenic and serene location along ECR with private pool and quick beach access",
    mapUrl: "https://maps.google.com/?q=ECR+Chennai",
    nearbyAttractions: ["ECR Beach - 5 min walk", "Muttukadu Backwaters - 10 min drive", "Covelong Beach - 12 min drive"]
  }
}

// Similar villas list for the bottom section
const similarVillasList = [
  {
    id: "amrith-palace",
    name: "Amrith Palace",
    location: "Pattipulam, ECR",
    price: 45000,
    rating: 4.8,
    reviewsCount: 38,
    image: "/AmrithPalace/AP1.jpg",
    specs: "9 Beds · 35 Guests"
  },
  {
    id: "ram-water-villa",
    name: "Ram Water Villa",
    location: "Perur, ECR",
    price: 30000,
    rating: 4.9,
    reviewsCount: 42,
    image: "/ramwatervilla/RW1.jpg",
    specs: "5 Beds · 12 Guests"
  },
  {
    id: "east-coast-villa",
    name: "East Coast Villa",
    location: "Perur, ECR",
    price: 15000,
    rating: 4.7,
    reviewsCount: 29,
    image: "/eastcoastvilla/EC1.jpg",
    specs: "3 Beds · 15 Guests"
  }
]

// Builds the map embed for THIS villa. Both branches of the previous ternary
// hardcoded the same Kovalam latitude/longitude, so every villa showed the same
// map regardless of where it actually stands.
function mapEmbedSrc(location, villaName) {
  const match = /([\d.]+)\s*°?\s*([NS]),\s*([\d.]+)\s*°?\s*([EW])/i.exec(location?.coordinates || "")
  if (match) {
    const lat = parseFloat(match[1]) * (match[2].toUpperCase() === "S" ? -1 : 1)
    const lng = parseFloat(match[3]) * (match[4].toUpperCase() === "W" ? -1 : 1)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
    }
  }

  const query = [villaName, location?.address].filter(Boolean).join(", ")
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`
}

export default function VillaInfo({
  villa,
  villaPricing,
  checkInDate,
  checkOutDate,
  onDateChange,
  blockedDates = []
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const navigate = useNavigate()

  const villaLocation = villaLocations[villa?.name] || {
    address: villa?.location || "East Coast Road, Chennai, Tamil Nadu",
    coordinates: "12.8000° N, 80.2400° E",
    description: "Prime luxury villa located along the scenic East Coast Road.",
    nearbyAttractions: ["Beach access - 5 min walk", "ECR Cafes & Dining - 10 min drive", "Sightseeing - 15 min drive"]
  }

  const defaultDescription =
    villaDescriptions[villa?.name] ||
    villa?.longDescription ||
    villa?.description ||
    "Experience luxury and relaxation in our premier villa equipped with modern amenities, private swimming pool, and comfortable living spaces for a memorable holiday."

  const scrollToSection = (id) => {
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Filter out current villa from similar villas
  const filteredSimilarVillas = similarVillasList.filter(
    (v) => v.name.toLowerCase() !== (villa?.name || "").toLowerCase()
  )

  return (
    <div className="space-y-8 text-gray-900">
      {/* Sub-Navigation Tabs (Image 2 style) */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8 overflow-x-auto scrollbar-none py-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "amenities", label: "Amenities" },
            { id: "map", label: "Map" },
            { id: "reviews", label: "Reviews" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? "text-gray-900 border-b-2 border-gray-900 -mb-[1px]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Villa Title & Specs Header */}
      <div id="overview" className="space-y-3 pt-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
          {villa?.name || "Luxury Villa"}
        </h1>

        {/* Specs Badges Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 font-medium">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{villa?.capacity || villa?.guests || 8} Guests</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-gray-500" />
            <span>{villa?.bedrooms || 4} Bedroom</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-gray-500" />
            <span>{villa?.bathrooms || 3} Bathroom</span>
          </div>
        </div>

        {/* Rating & Location */}
        <div className="flex items-center gap-2 text-sm text-gray-700 pt-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            {/* Show the stored rating, or nothing. A hardcoded 4.7 made every
                unrated villa look good. */}
            <span className="font-bold text-gray-900">{villa?.rating ? Number(villa.rating).toFixed(1) : "—"}</span>
          </div>
          <span className="text-gray-400">·</span>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>{villa?.location || "Location on request"}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* About this Property Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">About this Property</h2>
        <div className="text-gray-700 leading-relaxed text-sm sm:text-base space-y-3">
          <p className="whitespace-pre-line">
            {showFullDescription
              ? defaultDescription
              : defaultDescription.substring(0, 320) + (defaultDescription.length > 320 ? "..." : "")}
          </p>
          {defaultDescription.length > 320 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="font-semibold text-gray-900 hover:text-black underline flex items-center gap-1 text-sm mt-2"
            >
              {showFullDescription ? "Show less" : "Show more"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFullDescription ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Amenities Section */}
      <div id="amenities" className="pt-2">
        <AmenitiesSection amenities={villa?.amenities || []} villaName={villa?.name} />
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Explore the area (Map) Section */}
      <div id="map" className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-gray-900">Explore the area</h2>
        <div className="rounded-2xl overflow-hidden border border-gray-200 h-[280px] sm:h-[350px] bg-gray-100">
          <iframe
            src={mapEmbedSrc(villaLocation, villa?.name)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Villa Location Map"
          />
        </div>
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span>{villaLocation.address}</span>
          </div>
          {villaLocation.nearbyAttractions && villaLocation.nearbyAttractions.length > 0 && (
            <div className="text-xs sm:text-sm text-gray-500 pl-6 space-y-1">
              {villaLocation.nearbyAttractions.map((item, index) => (
                <div key={index}>• {item}</div>
              ))}
            </div>
          )}
        </div>
      </div>



      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Reviews Section */}
      <div id="reviews" className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-700 mt-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-gray-900">{villa?.rating || 4.7}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600">57 guest reviews</span>
            </div>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            Write a Review
          </button>
        </div>

        {/* Review Box / Prompt */}
        <div className="border border-gray-200 rounded-xl p-6 text-center bg-gray-50/50 space-y-3">
          <p className="text-gray-600 text-sm sm:text-base">
            No reviews yet. We'd love to hear your experience — be the first to leave a review!
          </p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Similar Properties Section */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-gray-900">Similar properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSimilarVillas.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                window.scrollTo(0, 0)
                navigate(`/villa/${item.id}`)
              }}
              className="cursor-pointer group border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all bg-white"
            >
              <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base truncate">{item.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{item.location} • {item.specs}</p>
                <div className="pt-1">
                  <span className="font-bold text-gray-900 text-sm">₹{item.price?.toLocaleString()}</span>
                  <span className="text-xs text-gray-500"> for 1 night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Modal */}
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative animate-fadeIn border border-gray-200">
            <button
              onClick={() => setShowAmenitiesModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h3>
            <AmenitiesSection amenities={villa?.amenities || []} villaName={villa?.name} />
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative animate-fadeIn border border-gray-200 space-y-4">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
            <p className="text-sm text-gray-500">Share your experience at {villa?.name || "this villa"}.</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 text-amber-400 fill-amber-400 cursor-pointer" />
              ))}
            </div>
            <textarea
              rows={4}
              placeholder="Tell other guests what you loved about this property..."
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              onClick={() => {
                setShowReviewModal(false)
                alert("Thank you for your review! It will be posted after moderation.")
              }}
              className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  )
}