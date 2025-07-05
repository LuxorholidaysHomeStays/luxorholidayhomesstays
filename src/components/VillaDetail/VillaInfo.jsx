"use client"

import { useState } from "react"
import {
  MapPin,
  ChevronDown,
  Shield,
  Home,
  Star,
  Users,
  Bed,
  Bath,
} from "lucide-react"
import AmenitiesSection from "./AmenitiesSection"

// Step 1: Default villa descriptions based on name
const villaDescriptions = {
  "Amrith Palace": `Amrith Palace is a luxurious 9BHK private villa located in Pattipulam ECR. It features 9 AC bedrooms, 1 AC hall, and a private swimming pool. Located just 800m from the beach, the villa offers ample parking, Wi-Fi, basic kitchen facilities, fridge, TV, caretaker service, and CCTV security. Suitable for family get-togethers, bachelor parties, weddings, corporate events, shootings, and birthday celebrations.
  
  Weekdays: ₹45,000 | Weekend: ₹65,000
  Max occupancy: 35 guests
  Event pricing varies based on the type of event.`,

  "Ram Water Villa": `Ram Water Villa is a 5BHK private luxury villa located in Perur ECR. It includes 5 AC rooms and an AC hall, private swimming pool, TV, party speaker, fridge, kitchen facilities, Wi-Fi, caretaker service, and private beach access. Ideal for a serene stay with party amenities.`,

  "Eastcoast Villa": `Eastcoast Villa is a compact and elegant 3BHK villa in Perur ECR featuring AC rooms and hall, private swimming pool, basic kitchen, fridge, TV, Wi-Fi, power backup, caretaker service, JBL party speaker, BBQ setup, and a compact party lawn.
  
  Weekdays: ₹15,000 | Weekend: ₹25,000
  Max occupancy: 15 guests
  Event pricing varies based on the type of event.`,

  "Empire Anand Villa Samudra": `Empire Villa is a luxurious 6BHK private beachfront villa located in Kovalam (ECR). The property includes a private swimming pool, en-suite bedrooms, modern interiors, and a sea-view living space. The villa features a fully equipped kitchen, dining area, and caretaker service. Perfect for family gatherings or corporate retreats.
  
  Weekdays: ₹40,000 | Weekend: ₹60,000
  Max occupancy: 15–20 guests
  Refundable security deposit: ₹15,000
  
  Location: https://maps.app.goo.gl/D1iCT5tYpnmbuHQr7`
}

export default function VillaInfo({
  villa,
  villaPricing,
  onShowBookingModal,
  activeSection,
  setActiveSection,
}) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false)
  const [showThingsToKnow, setShowThingsToKnow] = useState(false)

  // Full list of amenities with their respective icons
  const allAmenities = [
    "Private Pool",
    "Hot Tub",
    "Smart TV",
    "Closet",
    "Refrigerator",
    "BBQ Grill",
    "Baby Care",
    "Fireplace",
    "Beach Access",
    "Yoga Space",
    "Housekeeping",
    "Books",
    "Sound System",
    "Charging Points",
    "Premium Toiletries",
    "Hair Dryer",
    "Room Service",
    "Ease of Access",
    "Meal Service",
    "Shower",
    "Air Conditioning",
    "Free WiFi",
    "Kitchen",
    "Microwave",
    "Dining Area",
    "Hot Water",
    "Safe",
    "24/7 Support",
    "Private Garden",
    "Balcony",
    "Terrace",
    "Parking",
  ];

  const sections = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "amenities", label: "Amenities", icon: Star },
    { id: "location", label: "Location", icon: MapPin },
    { id: "policies", label: "Policies", icon: Shield },
  ]

  // Default amenities if not provided
  const defaultAmenities = [
    "Private Pool",
    "Air Conditioning",
    "Free WiFi",
    "Kitchen",
    "Smart TV",
    "Premium Toiletries",
    "Housekeeping",
    "BBQ Grill",
    "Sound System",
    "Beach Access",
    "Yoga Space",
    "Hot Tub",
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        const defaultDescription =
          villaDescriptions[villa?.name] || villa?.longDescription || villa?.description || "No description available."
          
        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About this place</h2>
            <div className="text-gray-700 leading-relaxed text-lg">
              <p className="mb-6">
                {showFullDescription
                  ? defaultDescription
                  : defaultDescription.substring(0, 300) + "..."}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            </div>
          </div>
        )

      case "amenities":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#D4AF37]/20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">What this place offers</h2>
            <AmenitiesSection amenities={villa?.amenities || defaultAmenities} />
          </div>
        )

      case "location":
        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Where you'll be</h2>
            <div className="rounded-2xl overflow-hidden h-80 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497511.2313083493!2d79.92235835!3d13.048160899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map showing ${villa.name} location`}
              />
            </div>
            <div className="flex items-center gap-3 mt-4 text-gray-600">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{villa.location}</span>
            </div>
          </div>
        )

      case "policies":
        return (
          <div className="space-y-6">
            {/* Cancellation Policy */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setShowCancellationPolicy(!showCancellationPolicy)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-bold text-gray-900">Cancellation Policy</h2>
                <ChevronDown
                  className={`h-6 w-6 text-gray-500 transition-transform ${showCancellationPolicy ? "rotate-180" : ""}`}
                />
              </button>

              {showCancellationPolicy && (
                <div className="px-8 pb-8">
                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Timeframe</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-900">Policy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-700">Within 15 Days</td>
                          <td className="px-6 py-4 text-gray-700">Non-refundable</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-700">15-30 Days</td>
                          <td className="px-6 py-4 text-gray-700">50% cancellation fee</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-700">30+ Days</td>
                          <td className="px-6 py-4 text-gray-700">25% cancellation fee</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Things to Know */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setShowThingsToKnow(!showThingsToKnow)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-2xl font-bold text-gray-900">Things to Know</h2>
                <ChevronDown
                  className={`h-6 w-6 text-gray-500 transition-transform ${showThingsToKnow ? "rotate-180" : ""}`}
                />
              </button>

              {showThingsToKnow && (
                <div className="px-8 pb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        Security deposit of ₹{villaPricing?.securityDeposit?.toLocaleString() || "20,000"}
                        will be collected and refunded within 72 hours of checkout.
                      </span>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">Smoking is not allowed inside the property</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation - Mobile/Desktop Responsive */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#D4AF37]/20 p-2">
        <div className="flex overflow-x-auto scrollbar-hide gap-2">
          {sections.map((section) => {
            const IconComponent = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-white shadow-md"
                    : "hover:bg-gray-100"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dynamic Section Content */}
      {renderSectionContent()}
    </div>
  )
}
