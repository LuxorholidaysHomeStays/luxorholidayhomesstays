import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  "Patio"
];

export default function AmenitiesSection({ amenities = [] }) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Use standard amenities if none provided
  const amenitiesList = Array.isArray(amenities) && amenities.length > 0 ? 
    amenities : standardAmenities;

  // Define categories - updated to match standard amenities
  const categories = {
    "Essential Comforts": [
      "AC",
      "WiFi",
      "TV",
      "Geyser",
      "Room Dark Shades",
      "Essentials",
    ],
    "Kitchen & Dining": [
      "Refrigerator",
      "Coffee Maker",
      "Microwave",
      "Stove",
      "Dishes",
      "Cooking Basics",
      "Oven",
    ],
    "Bathroom & Personal Care": [
      "Shampoo",
      "Hanger",
      "Washing machine",
    ],
    "Outdoor Space": [
      "Private Pool",
      "Garden",
      "Patio",
    ],
    "Parking & Transport": [
      "Free Parking",
      "Free Street Parking",
    ],
    "Baby & Family": [
      "Baby Crib",
    ],
  };

  // Group amenities by category
  const groupedAmenities = Object.entries(categories).map(([category, items]) => ({
    category,
    items: items.filter(item => amenitiesList.includes(item)),
  })).filter(group => group.items.length > 0);

  const visibleAmenities = showAllAmenities ? groupedAmenities : groupedAmenities.slice(0, 3);

  const getAmenityIcon = (amenity) => {
    // Map amenities to exact icon paths
    const iconMap = {
      "Private Pool": "/amenities-icons/pool.svg",
      "AC": "/amenities-icons/icons8-air-conditioner-48.png",
      "WiFi": "/amenities-icons/icons8-wifi-48.png",
      "Free WiFi": "/amenities-icons/icons8-wifi-48.png",
      "Geyser": "/amenities-icons/icons8-water-heater-48.png",
      "Room Dark Shades": "/amenities-icons/icons8-blinds-48.png",
      "Essentials": "/amenities-icons/essentials.svg",
      "TV": "/amenities-icons/icons8-tv-50.png",
      "Garden": "/amenities-icons/icons8-garden-48.png",
      "Patio": "/amenities-icons/icons8-patio-48.png",
      "Refrigerator": "/amenities-icons/icons8-ice-cream-freezer-48.png",
      "Coffee Maker": "/amenities-icons/icons8-coffee-maker-48.png",
      "Microwave": "/amenities-icons/icons8-microwave-48.png",
      "Stove": "/amenities-icons/icons8-stove-48.png",
      "Dishes": "/amenities-icons/icons8-tableware-48.png",
      "Cooking Basics": "/amenities-icons/icons8-cooking-48.png",
      "Oven": "/amenities-icons/icons8-oven-48.png",
      "Shampoo": "/amenities-icons/icons8-shampoo-48.png",
      "Hanger": "/amenities-icons/icons8-hanger-48.png",
      "Washing machine": "/amenities-icons/icons8-washing-machine-48.png",
      "Free Parking": "/amenities-icons/icons8-parking-48.png",
      "Free Street Parking": "/amenities-icons/icons8-parking-48.png",
      "Baby Crib": "/amenities-icons/icons8-feeding-baby-50.png",
    };
    
    // Return specific icon or fallback
    return iconMap[amenity] || "/amenities-icons/ease.svg";
  };

  const amenityDescriptions = {
    "Private Pool": "Exclusive swimming pool for your personal use",
    "AC": "Air conditioning in all rooms for comfort",
    "WiFi": "High-speed internet access throughout the property",
    "Geyser": "Hot water system for comfortable bathing",
    "Room Dark Shades": "Blackout curtains for better sleep",
    "Essentials": "Basic toiletries and amenities provided",
    "TV": "Television with entertainment channels",
    "Garden": "Beautiful landscaped garden area",
    "Patio": "Outdoor seating area for relaxation",
    "Refrigerator": "Full-size refrigerator for food storage",
    "Coffee Maker": "Fresh coffee brewing facilities",
    "Microwave": "Convenient microwave for quick meals",
    "Stove": "Full cooking stove for meal preparation",
    "Dishes": "Complete set of dishes and utensils",
    "Cooking Basics": "Essential cooking ingredients and spices",
    "Oven": "Baking oven for cooking needs",
    "Shampoo": "Quality hair care products provided",
    "Hanger": "Clothing hangers in wardrobes",
    "Washing machine": "Laundry facilities available",
    "Free Parking": "Complimentary parking space",
    "Free Street Parking": "Free parking available on street",
    "Baby Crib": "Baby-friendly furniture and amenities",
  };

  return (
    <div className="space-y-6">
      {groupedAmenities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAmenities.map(({ category, items }) => (
              <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">{category}</h4>
                <div className="space-y-4">
                  {items.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 group cursor-pointer"
                      onClick={() => setSelectedCategory(selectedCategory === amenity ? null : amenity)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 flex items-center justify-center group-hover:from-[#D4AF37]/20 group-hover:to-[#BFA181]/20 transition-all">
                        <img 
                          src={getAmenityIcon(amenity)}
                          alt={amenity}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Try different fallback icons
                            const fallbacks = [
                              '/amenities-icons/ease.svg',
                              '/amenities-icons/room-service.svg',
                              '/amenities-icons/icons8-tv-50.png',
                              '/amenities-icons/icons8-ice-cream-freezer-48.png',
                              '/amenities-icons/icons8-grill-50.png',
                              
                            ];
                            
                            // Try the next fallback if available
                            const currentIndex = fallbacks.indexOf(e.target.src);
                            if (currentIndex < fallbacks.length - 1) {
                              e.target.src = fallbacks[currentIndex + 1];
                            } else {
                              // If all fallbacks fail, show a generic icon
                              e.target.src = '/amenities-icons/ease.svg';
                            }
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                          {amenity}
                        </p>
                        {selectedCategory === amenity && amenityDescriptions[amenity] && (
                          <p className="text-xs text-gray-500 mt-1 animate-fadeIn">
                            {amenityDescriptions[amenity]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {groupedAmenities.length > 3 && (
            <button
              onClick={() => setShowAllAmenities(!showAllAmenities)}
              className="w-full mt-4 py-3 px-4 rounded-xl border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              {showAllAmenities ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show All Amenities <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </>
      ) : (
        // If no amenities can be grouped, display a fallback list
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Villa Amenities</h4>
            <div className="space-y-4">
              {amenitiesList.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 group cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === amenity ? null : amenity)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-[#BFA181]/10 flex items-center justify-center group-hover:from-[#D4AF37]/20 group-hover:to-[#BFA181]/20 transition-all">
                    <img 
                      src={getAmenityIcon(amenity)}
                      alt={amenity}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/amenities-icons/ease.svg';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                      {amenity}
                    </p>
                    {selectedCategory === amenity && amenityDescriptions[amenity] && (
                      <p className="text-xs text-gray-500 mt-1 animate-fadeIn">
                        {amenityDescriptions[amenity]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
