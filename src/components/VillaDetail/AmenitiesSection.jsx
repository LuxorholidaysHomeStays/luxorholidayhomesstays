import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AmenitiesSection({ amenities = [] }) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  console.log("Received amenities:", amenities);

  // Define categories
  const categories = {
    "Essential Comforts": [
      "Private Pool",
      "Hot Tub",
      "Air Conditioning",
      "Free WiFi",
      "Charging Points",
    ],
    "Entertainment & Media": [
      "Smart TV",
      "Sound System",
      "Books",
      "Board Games",
    ],
    "Kitchen & Dining": [
      "Kitchen",
      "Refrigerator",
      "BBQ Grill",
      "Coffee Maker",
      "Microwave",
      "Dining Area",
      "Meal Service",
      "Room Service",
    ],
    "Bathroom & Personal Care": [
      "Premium Toiletries",
      "Hair Dryer",
      "Shower",
      "Hot Water",
      "Spa Services",
      "Ease of Access",
    ],
    "Comfort & Wellness": [
      "Yoga Space",
      "Beach Access",
      "Fireplace",
      "Baby Care",
      "Closet",
      "Housekeeping"
    ]
  };

  // Ensure amenities is an array
  const amenitiesList = Array.isArray(amenities) ? amenities : [];
  
  // Group amenities by category
  const groupedAmenities = Object.entries(categories).map(([category, items]) => ({
    category,
    items: items.filter(item => amenitiesList.includes(item)),
  })).filter(group => group.items.length > 0);

  const visibleAmenities = showAllAmenities ? groupedAmenities : groupedAmenities.slice(0, 3);

  const getAmenityIcon = (amenity) => {
    const iconName = amenity.toLowerCase().replace(/\s+/g, '-');
    const possiblePaths = [
      `/amenities-icons/${iconName}.svg`,
      `/amenities-icons/icons8-${iconName}-48.png`,
      `/amenities-icons/icons8-${iconName}-50.png`,
      `/amenities-icons/icons8-${iconName}-64.png`,
    ];
    
    // Try the exact match first
    switch(amenity) {
      case "Private Pool": return "/amenities-icons/pool.svg";
      case "Hot Tub": return "/amenities-icons/icons8-hot-tub-64.png";
      case "Smart TV": return "/amenities-icons/icons8-tv-50.png";
      case "Closet": return "/amenities-icons/icons8-closet-50.png";
      case "Refrigerator": return "/amenities-icons/icons8-ice-cream-freezer-48.png";
      case "BBQ Grill": return "/amenities-icons/icons8-grill-50.png";
      case "Baby Care": return "/amenities-icons/icons8-feeding-baby-50.png";
      case "Fireplace": return "/amenities-icons/icons8-fire-48.png";
      case "Beach Access": return "/amenities-icons/icons8-beach-with-umbrella-48.png";
      case "Yoga Space": return "/amenities-icons/icons8-woman-in-lotus-position-48.png";
      case "Housekeeping": return "/amenities-icons/icons8-housekeeping-48.png";
      case "Books": return "/amenities-icons/icons8-books-emoji-48.png";
      case "Sound System": return "/amenities-icons/icons8-portable-speaker-48.png";
      case "Charging Points": return "/amenities-icons/icons8-charging-battery-50.png";
      case "Premium Toiletries": return "/amenities-icons/toiletries.svg";
      case "Hair Dryer": return "/amenities-icons/hair-dryer.svg";
      case "Room Service": return "/amenities-icons/room-service.svg";
      case "Ease of Access": return "/amenities-icons/ease.svg";
      case "Meal Service": return "/amenities-icons/meal.svg";
      case "Shower": return "/amenities-icons/shower.svg";
      case "Spa Services": return "/amenities-icons/icons8-cosmetology-64.png";
      default: return possiblePaths[0];
    }
  };

  const amenityDescriptions = {
    "Private Pool": "Exclusive swimming pool for your personal use",
    "Hot Tub": "Relaxing jacuzzi for ultimate comfort",
    "Smart TV": "Modern TV with streaming services",
    "Closet": "Spacious wardrobe for storage",
    "Refrigerator": "Large fridge for food storage",
    "BBQ Grill": "Outdoor grilling facility",
    "Baby Care": "Baby-friendly amenities and furniture",
    "Fireplace": "Cozy fireplace for winter evenings",
    "Beach Access": "Easy access to nearby beach",
    "Yoga Space": "Dedicated area for yoga and meditation",
    "Housekeeping": "Daily cleaning service available",
    "Books": "Collection of books for leisure reading",
    "Sound System": "High-quality audio system",
    "Charging Points": "Multiple USB and power outlets",
    "Premium Toiletries": "High-end bath and body products",
    "Air Conditioning": "Climate control in all rooms",
    "Free WiFi": "High-speed internet access",
    "Kitchen": "Fully equipped modern kitchen",
    "Hair Dryer": "Professional hair dryer provided",
    "Shower": "Modern shower facilities",
    "Hot Water": "24/7 hot water availability",
    "Room Service": "In-room dining service available",
    "Ease of Access": "Wheelchair accessible facilities",
    "Meal Service": "Optional meal service with chef",
    "Spa Services": "Professional spa treatments available",
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
