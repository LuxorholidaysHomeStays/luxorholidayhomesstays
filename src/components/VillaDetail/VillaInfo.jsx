"use client"

import { useState } from "react"
import {
  MapPin,
  ChevronDown,
  Shield,
  Star,
  Users,
  Bed,
  Bath,
  Home
} from "lucide-react"
import AmenitiesSection from "./AmenitiesSection"

// Step 1: Default villa descriptions based on name
const villaDescriptions = {
  "Amrith Palace": `Amrith Palace is an exquisite 9BHK private luxury villa strategically located in Pattipulam ECR, just 45 minutes from Chennai city. This magnificent property spans across 8000 sq. ft., featuring 9 spacious air-conditioned bedrooms, each with en-suite bathrooms, and a grand air-conditioned hall perfect for indoor gatherings. The crown jewel of the property is its pristine private swimming pool surrounded by lush tropical landscaping.

  Located just 800 meters from the beach, guests can enjoy the perfect balance of privacy and sea proximity. The villa boasts ample parking space for up to 10 vehicles, high-speed Wi-Fi coverage throughout the property, and comprehensive kitchen facilities including modern appliances, cookware, and utensils. The entertainment options include large smart TVs in common areas and select bedrooms, a premium sound system, and outdoor BBQ facilities.

  Security is paramount with 24/7 CCTV surveillance, night patrol, and a dedicated caretaker who lives on-site to assist with all guest requirements. The property features elegant interiors with a blend of contemporary and traditional Tamil Nadu design elements, marble flooring, and handcrafted wooden furniture.

  Amrith Palace is an ideal venue for various occasions including family get-togethers, bachelor/bachelorette parties, intimate weddings, corporate retreats, photo/video shoots, and milestone birthday celebrations. The expansive outdoor area can accommodate events with up to 100 guests.
  
  Weekdays: ₹45,000 | Weekend: ₹65,000
  Max occupancy: 35 guests (overnight stay)
  Event pricing varies based on the type and scale of event.
  Refundable security deposit: ₹25,000`,

  "Ram Water Villa": `Ram Water Villa is a stunning 5BHK private luxury property situated in the serene coastal area of Perur ECR, offering the perfect blend of modern amenities and natural beauty. This two-story villa features 5 meticulously designed air-conditioned bedrooms with premium mattresses and linens, plus a spacious air-conditioned hall ideal for indoor gatherings or relaxation.

  The villa's centerpiece is its crystal-clear private swimming pool with adjacent sun loungers and outdoor seating, perfect for soaking up the Tamil Nadu sunshine. Entertainment options abound with large smart TVs in the living area and master bedrooms, a professional-grade JBL party speaker system that can be set up indoors or poolside, and high-speed fiber-optic Wi-Fi throughout the property.

  The kitchen is fully equipped with modern appliances including a large refrigerator, microwave, gas cooking range, water purifier, and all necessary cookware and utensils. A significant advantage of Ram Water Villa is its private beach access path, allowing guests to reach the shoreline in just a 5-minute walk.

  The property is secured with 24/7 CCTV surveillance and features a resident caretaker who can assist with housekeeping, local recommendations, and arranging additional services like massage therapists, private chefs, or transportation. The outdoor area includes a covered veranda, garden seating, and mood lighting for evening gatherings.

  Ram Water Villa is ideally suited for family vacations, friend reunions, small celebrations, or as a peaceful retreat for those looking to escape the city while enjoying luxury amenities. The combination of privacy, comfort, and proximity to the sea makes this villa a sought-after destination on East Coast Road.
  
  Weekdays: ₹30,000 | Weekend: ₹45,000
  Max occupancy: 12 guests
  Refundable security deposit: ₹15,000`,

  "Eastcoast Villa": `Eastcoast Villa is a charming and compact 3BHK property in Perur ECR that offers an intimate, cozy atmosphere without compromising on luxury or amenities. This single-story villa spans approximately 2,500 sq. ft. and features three well-appointed air-conditioned bedrooms with quality furnishings, as well as a comfortable air-conditioned living room perfect for relaxation and entertainment.

  The villa's delightful private swimming pool is ideal for refreshing dips and is complemented by a surrounding deck area with outdoor furniture. The property is tastefully landscaped with native plants and features a compact but well-designed party lawn that can accommodate small gatherings of up to 25 people.

  Inside, guests will find a functional kitchen equipped with essential appliances including a refrigerator, microwave, and basic cooking facilities. Entertainment options include a large flat-screen TV with streaming capabilities, reliable high-speed Wi-Fi, and a premium JBL party speaker system that can fill the space with excellent sound quality.

  The villa is equipped with power backup to ensure uninterrupted comfort during your stay. Security and assistance are provided by an attentive caretaker who resides nearby and is available to help with housekeeping, local information, and other requirements during your stay.

  One of the highlights of Eastcoast Villa is its BBQ setup, perfect for evening cookouts and casual dining under the stars. The property is within a 10-minute drive to local beaches, restaurants, and attractions, making it convenient while maintaining its peaceful ambiance.

  This villa is particularly well-suited for small families, couples seeking extra space, or friend groups looking for an intimate setting for weekend getaways, small celebrations, or simply as a base to explore the beautiful East Coast Road area.
  
  Weekdays: ₹15,000 | Weekend: ₹25,000
  Max occupancy: 15 guests
  Event pricing varies based on the type of event.
  Refundable security deposit: ₹10,000`,

  "Empire Anand Villa Samudra": `Empire Anand Villa Samudra is a prestigious 6BHK beachfront luxury villa situated in the coveted Kovalam area of ECR, offering an unparalleled coastal living experience with direct sea views. This magnificent three-level property spans over 5,500 sq. ft. of thoughtfully designed living space that seamlessly blends indoor and outdoor environments.

  The villa features six luxurious en-suite bedrooms, each uniquely decorated with designer furnishings, premium bedding, and large windows that frame spectacular ocean views. The master suite includes a private balcony overlooking the sea, a walk-in closet, and a spa-like bathroom with both shower and soaking tub.

  The heart of the villa is its expansive open-concept living area with double-height ceilings, floor-to-ceiling windows, and sliding glass doors that open onto a large terrace with unobstructed ocean views. The elegant interior design incorporates natural materials, a sophisticated neutral color palette, and carefully curated artwork that complements the coastal setting.

  The villa boasts a stunning private infinity pool that appears to merge with the sea horizon, surrounded by a spacious deck furnished with premium loungers, outdoor dining furniture, and shaded relaxation areas. A few steps beyond the property's edge, guests can access a semi-private beach area perfect for morning walks or evening sunset viewing.

  The gourmet kitchen is a chef's dream, equipped with high-end appliances, stone countertops, and all necessary cookware and serving pieces for elaborate meals. Adjacent to the kitchen is a formal dining area that comfortably seats 12 guests, featuring a handcrafted teak table beneath an elegant chandelier.

  Additional amenities include smart home technology controlling lighting, temperature, and entertainment systems; a media room with surround sound; a well-stocked library corner; and a fitness area with basic exercise equipment. The villa offers complete privacy yet is only a 15-minute drive from local restaurants, shops, and attractions.

  A dedicated property manager and service staff ensure a seamless experience, from daily housekeeping to arranging special requests such as private chefs, in-villa spa services, yacht excursions, or cultural experiences. Empire Anand Villa Samudra represents the pinnacle of luxury coastal living in Tamil Nadu, ideal for discerning travelers seeking an exclusive retreat for family gatherings, milestone celebrations, or high-level corporate escapes.
  
  Weekdays: ₹40,000 | Weekend: ₹60,000
  Max occupancy: 15–20 guests
  Refundable security deposit: ₹15,000
  
  Location: https://maps.app.goo.gl/D1iCT5tYpnmbuHQr7`
}

// Villa location details with coordinates and descriptions
// Villa location details with coordinates and descriptions
const villaLocations = {
  "Amrith Palace": {
    address: "Pattipulam, East Coast Road, Chennai",
    coordinates: "12.8046° N, 80.2329° E",
    description: "Located just 800m from Pattipulam Beach, 45 minutes from Chennai city center",
    mapUrl: "https://maps.app.goo.gl/zgKn8G6c7q3zXaNK9",
    nearbyAttractions: [
      "Kovalam Beach - 15 min drive",
      "Mahabalipuram - 25 min drive",
      "Dakshina Chitra Museum - 20 min drive"
    ]
  },
  "Ram Water Villa": {
    address: "Perur, East Coast Road, Chennai",
    coordinates: "12.7985° N, 80.2456° E",
    description: "Peaceful location in Perur with just 5 minutes walk to a secluded beach",
    mapUrl: "https://maps.app.goo.gl/T42kAzGFteVLF7Ry7?g_st=ac",
    nearbyAttractions: [
      "Perur Beach - 5 min walk",
      "Local fish market - 10 min drive",
      "ECR restaurants - 15 min drive"
    ]
  },
  "Eastcoast Villa": {
    address: "Perur, East Coast Road, Chennai",
    coordinates: "12.8025° N, 80.2515° E",
    description: "Conveniently located on the East Coast Road with easy access to beaches and attractions",
    mapUrl: "https://maps.app.goo.gl/KbUjnyUxBeSNf3Yh8",
    nearbyAttractions: [
      "Nettukuppam Beach - 10 min drive",
      "VGP Snow Kingdom - 25 min drive",
      "Muttukadu Boat House - 20 min drive"
    ]
  },
  "Empire Anand Villa Samudra": {
    address: "Kovalam, East Coast Road, Chennai",
    coordinates: "12.7879° N, 80.2483° E",
    description: "Premium beachfront location in Kovalam with direct sea views and private beach access",
    mapUrl: "https://maps.app.goo.gl/D1iCT5tYpnmbuHQr7",
    nearbyAttractions: [
      "Kovalam Beach - Direct access",
      "Crocodile Bank - 10 min drive",
      "Mahabalipuram temples - 20 min drive"
    ]
  },
  "Lavish I": {
    address: "East Coast Road, Chennai",
    coordinates: "13.0827° N, 80.2707° E",
    description: "One of our three signature Lavish villas on the East Coast Road",
    mapUrl: "https://maps.app.goo.gl/FwjnyQ3Fjqotg89NA?g_st=aw",
    nearbyAttractions: [
      "Marina Beach - 30 min drive",
      "Kapaleeshwarar Temple - 35 min drive",
      "Fort St. George - 40 min drive"
    ]
  },
  "Lavish II": {
    address: "East Coast Road, Chennai",
    coordinates: "13.0827° N, 80.2707° E",
    description: "One of our three signature Lavish villas on the East Coast Road",
    mapUrl: "https://maps.app.goo.gl/FwjnyQ3Fjqotg89NA?g_st=aw",
    nearbyAttractions: [
      "Marina Beach - 30 min drive",
      "Kapaleeshwarar Temple - 35 min drive",
      "Fort St. George - 40 min drive"
    ]
  },
  "Lavish III": {
    address: "East Coast Road, Chennai",
    coordinates: "13.0827° N, 80.2707° E",
    description: "One of our three signature Lavish villas on the East Coast Road",
    mapUrl: "https://www.google.com/maps/place/Ecrholidays%2FLavish+Home+stays/@11.9693191,79.8385511,17.7z/data=!4m9!3m8!1s0x3a5363005d0a6e63:0x80241e87f3f19b09!5m2!4m1!1i2!8m2!3d11.9683005!4d79.8401932!16s%2Fg%2F11v_6782jg?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D",
    nearbyAttractions: [
      "Marina Beach - 30 min drive",
      "Kapaleeshwarar Temple - 35 min drive",
      "Fort St. George - 40 min drive"
    ]
  },
  "default": {
    address: "East Coast Road, Chennai",
    coordinates: "13.0827° N, 80.2707° E",
    description: "Located in Chennai, Tamil Nadu",
    mapUrl: "https://maps.app.goo.gl/defaultmaplocation",
    nearbyAttractions: [
      "Marina Beach - 30 min drive",
      "Kapaleeshwarar Temple - 35 min drive",
      "Fort St. George - 40 min drive"
    ]
  }
};

// Standard amenities list for all villas - comprehensive list
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
  // Adding more amenities for a comprehensive list
  "Premium Toiletries",
  "Housekeeping",
  "BBQ Grill",
  "Sound System",
  "Beach Access",
  "Yoga Space",
  "Hot Tub",
  "Air Conditioning",
  "Smart TV",
  "Kitchen",
  "Caretaker Service",
  "CCTV Security",
  "Power Backup",
  "JBL Party Speaker",
  "BBQ Setup",
  "Party Lawn"
];


export default function VillaInfo ({ villa, villaPricing }) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false)
  const [showThingsToKnow, setShowThingsToKnow] = useState(false)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")

  // Use standard amenities for all villas
  const villaAmenities = standardAmenities;
  
  // Get villa location data based on name, default to Chennai if not found
  const getVillaLocation = () => {
    if (!villa || !villa.name) return villaLocations.default;
    
    // Try to find exact match first
    if (villaLocations[villa.name]) {
      return villaLocations[villa.name];
    }
    
    // Try to find partial match
    const locationKey = Object.keys(villaLocations).find(
      key => key !== "default" && villa.name.toLowerCase().includes(key.toLowerCase())
    );
    
    return locationKey ? villaLocations[locationKey] : villaLocations.default;
  };
  
  const villaLocation = getVillaLocation();

  const sections = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "amenities", label: "Amenities", icon: Star },
    { id: "location", label: "Location", icon: MapPin },
    { id: "policies", label: "Policies", icon: Shield },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        const defaultDescription =
          villaDescriptions[villa?.name] || villa?.longDescription || villa?.description || "No description available."
          
        return (            <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3">
                <Home className="h-4 w-4 text-white" />
              </span>
              About this place
            </h2>
            <div className="text-gray-700 leading-relaxed text-lg">
              <p className="mb-6">
                {showFullDescription
                  ? defaultDescription
                  : defaultDescription.substring(0, 300) + "..."}
              </p>                <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-[#D4AF37] hover:text-[#BFA181] font-semibold underline transition-colors"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            </div>
          </div>
        )

      case "amenities":
        return (
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3">
                <Star className="h-4 w-4 text-white" />
              </span>
              What this place offers
            </h2>
            
            {/* Simple list view of amenities */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {(showAllAmenities ? villaAmenities : villaAmenities.slice(0, 12)).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 text-[#D4AF37] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
              
              {/* Show more/less button if there are more than 12 amenities */}
              {villaAmenities.length > 12 && (
                <button 
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-6 flex items-center gap-2 text-[#D4AF37] font-medium hover:underline"
                >
                  {showAllAmenities ? 'Show fewer amenities' : 'Show all amenities'}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showAllAmenities ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )

      case "location":
        return (
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3">
                <MapPin className="h-4 w-4 text-white" />
              </span>
              Where you'll be
            </h2>
            <div className="rounded-lg overflow-hidden h-80 shadow-lg mb-6">
              {villaLocation.mapUrl ? (
                // Extract Google Maps embed URL from the shared URL
                <iframe
                  src={villaLocation.mapUrl.includes('maps.app.goo.gl') 
                    ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890!2d${villaLocation.coordinates.split(',')[1].trim().split('°')[0]}!3d${villaLocation.coordinates.split(',')[0].trim().split('°')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2s${encodeURIComponent(villa?.name || 'Luxury Villa')}!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin` 
                    : villaLocation.mapUrl.replace('https://www.google.com/maps/place/', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d')
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing ${villa?.name || 'Villa'} location`}
                />
              ) : (
                // Fallback to coordinates if no map URL available
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${villaLocation.coordinates.split(',')[1].trim().split('°')[0]}!3d${villaLocation.coordinates.split(',')[0].trim().split('°')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(villa?.name || 'Luxury Villa')}!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing ${villa?.name || 'Villa'} location`}
                />
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                <span className="font-medium">{villaLocation.address}</span>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{villaLocation.description}</p>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nearby attractions:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {villaLocation.nearbyAttractions.map((attraction, index) => (
                    <li key={index}>{attraction}</li>
                  ))}
                </ul>
              </div>
              
              {/* Add a link to open in Google Maps */}
              <div className="mt-4">
                <a 
                  href={villaLocation.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#BFA181] font-medium"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        )

      case "policies":
        return (
          <div className="space-y-6">
            {/* Cancellation Policy */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setShowCancellationPolicy(!showCancellationPolicy)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3">
                    <Shield className="h-4 w-4 text-white" />
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">Cancellation Policy</h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-[#D4AF37] transition-transform ${showCancellationPolicy ? "rotate-180" : ""}`}
                />
              </button>

              {showCancellationPolicy && (
                <div className="px-8 pb-8">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10">
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setShowThingsToKnow(!showThingsToKnow)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">Things to Know</h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-[#D4AF37] transition-transform ${showThingsToKnow ? "rotate-180" : ""}`}
                />
              </button>

              {showThingsToKnow && (
                <div className="px-8 pb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                      </div>
                      <span className="text-gray-700">
                        Security deposit of ₹{villaPricing?.securityDeposit?.toLocaleString() || "20,000"}
                        will be collected and refunded within 72 hours of checkout.
                      </span>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                      </div>
                      <span className="text-gray-700">Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                      </div>
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
      <div className="bg-gradient-to-r from-white/80 to-gray-100/80 backdrop-blur-sm p-2 rounded-xl shadow-md">
        <div className="flex overflow-x-auto scrollbar-hide gap-1 justify-center">
          {sections.map((section) => {
            const IconComponent = section.icon
            const isActive = activeSection === section.id
            return (
              <div key={section.id} className="relative">
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-[#D4AF37] text-white shadow-lg transform -translate-y-0.5"
                      : "bg-white/70 text-gray-500 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] shadow"
                  }`}
                >
                  <IconComponent className={`h-5 w-5`} />
                  <span className={`font-medium text-sm ${isActive ? 'font-bold' : ''}`}>{section.label}</span>
                  
                  {/* Right chevron for active tab */}
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dynamic Section Content */}
      {renderSectionContent()}
      
    </div>
  )

}