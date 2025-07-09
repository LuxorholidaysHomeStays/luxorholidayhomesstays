import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, Star, Heart } from 'lucide-react'
import { API_BASE_URL } from '../config/api'
import { useNavigate } from "react-router-dom"

// Import villa image collections
// Amrith Palace Images
import AP1 from "/AmrithPalace/AP1.jpg"
import AP2 from "/AmrithPalace/AP2.jpg"
import AP3 from "/AmrithPalace/AP3.jpg"
import AP4 from "/AmrithPalace/AP4.jpg"
import AP5 from "/AmrithPalace/AP5.jpg"
import AP6 from "/AmrithPalace/AP6.jpg"
import AP7 from "/AmrithPalace/AP7.jpg"
import AP8 from "/AmrithPalace/AP8.jpg"
import AP9 from "/AmrithPalace/AP9.jpg"
import AP10 from "/AmrithPalace/AP10.jpg"
import AP11 from "/AmrithPalace/AP11.jpg"
import AP12 from "/AmrithPalace/AP12.jpg"
import AP13 from "/AmrithPalace/AP13.jpg"
import AP14 from "/AmrithPalace/AP14.jpg"
import AP15 from "/AmrithPalace/AP15.jpg"
import AP16 from "/AmrithPalace/AP16.jpg"
import AP17 from "/AmrithPalace/AP17.jpg"
import AP18 from "/AmrithPalace/AP18.jpg"
import AP19 from "/AmrithPalace/AP19.jpg"
import AP20 from "/AmrithPalace/AP20.jpg"
import AP21 from "/AmrithPalace/AP21.jpg"
import AP22 from "/AmrithPalace/AP22.jpg"
import AP23 from "/AmrithPalace/AP23.jpg"
import AP24 from "/AmrithPalace/AP24.jpg"
import AP25 from "/AmrithPalace/AP25.jpg"
import AP26 from "/AmrithPalace/AP26.jpg"
import AP27 from "/AmrithPalace/AP27.jpg"
import AP28 from "/AmrithPalace/AP28.jpg"
import AP29 from "/AmrithPalace/AP29.jpg"
import AP30 from "/AmrithPalace/AP30.jpg"

// East Coast Villa Images
import EC1 from "/eastcoastvilla/EC1.jpg"
import EC2 from "/eastcoastvilla/EC2.jpg"
import EC3 from "/eastcoastvilla/EC3.jpg"
import EC4 from "/eastcoastvilla/EC4.jpg"
import EC5 from "/eastcoastvilla/EC5.jpg"
import EC6 from "/eastcoastvilla/EC6.jpg"
import EC7 from "/eastcoastvilla/EC7.jpg"
import EC8 from "/eastcoastvilla/EC8.jpg"
import EC9 from "/eastcoastvilla/EC9.jpg"
import EC10 from "/eastcoastvilla/EC10.jpg"
import EC11 from "/eastcoastvilla/EC11.jpg"
import EC12 from "/eastcoastvilla/EC12.jpg"
import EC13 from "/eastcoastvilla/EC13.jpg"
import EC14 from "/eastcoastvilla/EC14.jpg"
import EC15 from "/eastcoastvilla/EC15.jpg"

// Empire Anand Villa Samudra Images
import anandvilla1 from "/empireanandvillasamudra/anandvilla1.jpg"
import anandvilla2 from "/empireanandvillasamudra/anandvilla2.jpg"
import anandvilla3 from "/empireanandvillasamudra/anandvilla3.jpg"
import anandvilla4 from "/empireanandvillasamudra/anandvilla4.jpg"
import anandvilla5 from "/empireanandvillasamudra/anandvilla5.jpg"
import anandvilla6 from "/empireanandvillasamudra/anandvilla6.jpg"
import anandvilla7 from "/empireanandvillasamudra/anandvilla7.jpg"
import anandvilla8 from "/empireanandvillasamudra/anandvilla8.jpg"
import anandvilla9 from "/empireanandvillasamudra/anandvilla9.jpg"
import anandvilla10 from "/empireanandvillasamudra/anandvilla10.jpg"
import anandvilla11 from "/empireanandvillasamudra/anandvilla11.jpg"
import anandvilla12 from "/empireanandvillasamudra/anandvilla12.jpg"
import anandvilla13 from "/empireanandvillasamudra/anandvilla13.jpg"
import anandvilla14 from "/empireanandvillasamudra/anandvilla14.jpg"
import anandvilla15 from "/empireanandvillasamudra/anandvilla15.jpg"
import anandvilla16 from "/empireanandvillasamudra/anandvilla16.jpg"

// Ram Water Villa Images
import RW1 from "/ramwatervilla/RW1.jpg"
import RW2 from "/ramwatervilla/RW2.jpg"
import RW3 from "/ramwatervilla/RW3.jpg"
import RW4 from "/ramwatervilla/RW4.jpg"
import RW5 from "/ramwatervilla/RW5.jpg"
import RW6 from "/ramwatervilla/RW6.jpg"
import RW7 from "/ramwatervilla/RW7.jpg"
import RW8 from "/ramwatervilla/RW8.jpg"
import RW9 from "/ramwatervilla/RW9.jpg"
import RW10 from "/ramwatervilla/RW10.jpg"
import RW11 from "/ramwatervilla/RW11.jpg"
import RW13 from "/ramwatervilla/RW13.jpg"
import RW14 from "/ramwatervilla/RW14.jpg"
import RW15 from "/ramwatervilla/RW15.jpg"
import RW16 from "/ramwatervilla/RW16.jpg"
import RW17 from "/ramwatervilla/RW17.jpg"
import RW18 from "/ramwatervilla/RW18.jpg"
import RW19 from "/ramwatervilla/RW19.jpg"

// LavishVilla 1 (22 images)
import lvone1 from "/LavishVilla 1/lvone1.jpg";
import lvone2 from "/LavishVilla 1/lvone2.jpg";
import lvone3 from "/LavishVilla 1/lvone3.jpg";
import lvone4 from "/LavishVilla 1/lvone4.jpg";
import lvone5 from "/LavishVilla 1/lvone5.jpg";
import lvone6 from "/LavishVilla 1/lvone6.jpg";
import lvone7 from "/LavishVilla 1/lvone7.jpg";
import lvone8 from "/LavishVilla 1/lvone8.jpg";
import lvone9 from "/LavishVilla 1/lvone9.jpg";
import lvone10 from "/LavishVilla 1/lvone10.jpg";
import lvone11 from "/LavishVilla 1/lvone11.jpg";
import lvone12 from "/LavishVilla 1/lvone12.jpg";
import lvone13 from "/LavishVilla 1/lvone13.jpg";
import lvone14 from "/LavishVilla 1/lvone14.jpg";
import lvone15 from "/LavishVilla 1/lvone15.jpg";
import lvone16 from "/LavishVilla 1/lvone16.jpg";
import lvone17 from "/LavishVilla 1/lvone17.jpg";
import lvone18 from "/LavishVilla 1/lvone18.jpg";
import lvone19 from "/LavishVilla 1/lvone19.jpg";
import lvone20 from "/LavishVilla 1/lvone20.jpg";
import lvone21 from "/LavishVilla 1/lvone21.jpg";
import lvone22 from "/LavishVilla 1/lvone22.jpg";

// LavishVilla 2 (22 images)
import lvtwo1 from "/LavishVilla 2/lvtwo1.jpg";
import lvtwo2 from "/LavishVilla 2/lvtwo2.jpg";
import lvtwo3 from "/LavishVilla 2/lvtwo3.jpg";
import lvtwo4 from "/LavishVilla 2/lvtwo4.jpg";
import lvtwo5 from "/LavishVilla 2/lvtwo5.jpg";
import lvtwo6 from "/LavishVilla 2/lvtwo6.jpg";
import lvtwo7 from "/LavishVilla 2/lvtwo7.jpg";
import lvtwo8 from "/LavishVilla 2/lvtwo8.jpg";
import lvtwo9 from "/LavishVilla 2/lvtwo9.jpg";
import lvtwo10 from "/LavishVilla 2/lvtwo10.jpg";
import lvtwo11 from "/LavishVilla 2/lvtwo11.jpg";
import lvtwo12 from "/LavishVilla 2/lvtwo12.jpg";
import lvtwo13 from "/LavishVilla 2/lvtwo13.jpg";
import lvtwo14 from "/LavishVilla 2/lvtwo14.jpg";
import lvtwo15 from "/LavishVilla 2/lvtwo15.jpg";
import lvtwo16 from "/LavishVilla 2/lvtwo16.jpg";
import lvtwo17 from "/LavishVilla 2/lvtwo17.jpg";
import lvtwo18 from "/LavishVilla 2/lvtwo18.jpg";
import lvtwo19 from "/LavishVilla 2/lvtwo19.jpg";
import lvtwo20 from "/LavishVilla 2/lvtwo20.jpg";
import lvtwo21 from "/LavishVilla 2/lvtwo21.jpg";
import lvtwo22 from "/LavishVilla 2/lvtwo22.jpg";

// LavishVilla 3 (18 images)
import lvthree1 from "/LavishVilla 3/lvthree1.jpg";
import lvthree2 from "/LavishVilla 3/lvthree2.jpg";
import lvthree3 from "/LavishVilla 3/lvthree3.jpg";
import lvthree4 from "/LavishVilla 3/lvthree4.jpg";
import lvthree5 from "/LavishVilla 3/lvthree5.jpg";
import lvthree6 from "/LavishVilla 3/lvthree6.jpg";
import lvthree7 from "/LavishVilla 3/lvthree7.jpg";
import lvthree8 from "/LavishVilla 3/lvthree8.jpg";
import lvthree9 from "/LavishVilla 3/lvthree9.jpg";
import lvthree10 from "/LavishVilla 3/lvthree10.jpg";
import lvthree11 from "/LavishVilla 3/llvthree11.jpg";
import lvthree12 from "/LavishVilla 3/lvthree12.jpg";
import lvthree13 from "/LavishVilla 3/lvthree13.jpg";
import lvthree14 from "/LavishVilla 3/lvthree14.jpg";
import lvthree15 from "/LavishVilla 3/lvthree15.jpg";
import lvthree16 from "/LavishVilla 3/lvthree16.jpg";
import lvthree17 from "/LavishVilla 3/lvthree17.jpg";
import lvthree18 from "/LavishVilla 3/lvthree18.jpg";

// Create villa image collections object
const villaImageCollections = {
  "Amrith Palace": [
    AP8, AP2, AP3, AP4, AP5, AP6, AP7, AP1, AP9, AP10,
    AP11, AP12, AP13, AP14, AP15, AP16, AP17, AP18, AP19, AP20,
    AP21, AP22, AP23, AP24, AP25, AP26, AP27, AP28, AP29, AP30
  ],
  "East Coast Villa": [
    EC1, EC2, EC3, EC4, EC5, EC6, EC7, EC8, EC9, EC10,
    EC11, EC12, EC13, EC14, EC15
  ],
  "Ram Water Villa": [
    RW19, RW2, RW3, RW4, RW5, RW6, RW7, RW8, RW9, RW10,
    RW11, RW13, RW14, RW15, RW16, RW17, RW18, RW1
  ],
  "Empire Anand Villa Samudra": [
    anandvilla1, anandvilla2, anandvilla3, anandvilla4, anandvilla5, anandvilla6, anandvilla7, anandvilla8,
    anandvilla9, anandvilla10, anandvilla11, anandvilla12, anandvilla13, anandvilla14, anandvilla15, anandvilla16
  ],
  "Lavish Villa I": [
    lvone18, lvone2, lvone3, lvone4, lvone5, lvone6, lvone7, lvone8, lvone9, lvone10,
    lvone11, lvone12, lvone13, lvone14, lvone15, lvone16, lvone17, lvone1, lvone19, lvone20,
    lvone21, lvone22
  ],
  "Lavish Villa II": [
    lvtwo4, lvtwo2, lvtwo3, lvtwo1, lvtwo5, lvtwo6, lvtwo7, lvtwo8, lvtwo9, lvtwo10,
    lvtwo11, lvtwo12, lvtwo13, lvtwo14, lvtwo15, lvtwo16, lvtwo17, lvtwo18, lvtwo19, lvtwo20,
    lvtwo21, lvtwo22
  ],
  "Lavish Villa III": [
    lvthree17, lvthree2, lvthree3, lvthree4, lvthree5, lvthree6, lvthree7, lvthree8, lvthree9, lvthree10,
    lvthree11, lvthree12, lvthree13, lvthree14, lvthree15, lvthree16, lvthree1, lvthree18
  ]
};

// Fallback images if none are found
const unsplashImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
];

// Helper function to get a random unsplash image
function getRandomUnsplash() {
  return unsplashImages[Math.floor(Math.random() * unsplashImages.length)];
}

export const FeaturedDestination = () => {
  const [properties, setProperties] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  // Touch/swipe support
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const nextSlide = () => {
    if (isTransitioning || properties.length === 0) return
    setIsTransitioning(true)
    setActiveIndex((prev) => (prev === properties.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (isTransitioning || properties.length === 0) return
    setIsTransitioning(true)
    setActiveIndex((prev) => (prev === 0 ? properties.length - 1 : prev - 1))
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 700)
    return () => clearTimeout(timer)
  }, [activeIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000); // Change interval to 7 seconds
    return () => clearInterval(interval)
  }, [properties.length])

  // Show hand swipe animation on first load
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => setShowSwipeHint(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSwipeHint])

  // Helper function to find the best matching villa name in our collections
  const getBestMatchingVillaImages = (villaName) => {
    // Direct match
    if (villaImageCollections[villaName]) {
      return villaImageCollections[villaName];
    }

    // Case insensitive match
    const lowercaseVillaName = villaName.toLowerCase().trim();
    for (const [key, imageArray] of Object.entries(villaImageCollections)) {
      if (key.toLowerCase().trim() === lowercaseVillaName) {
        return imageArray;
      }
    }

    // Partial match (for villas with slightly different names)
    for (const [key, imageArray] of Object.entries(villaImageCollections)) {
      if (lowercaseVillaName.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(lowercaseVillaName)) {
        return imageArray;
      }
    }

    // Check for specific keywords in names
    const nameKeywords = {
      "amrith": "Amrith Palace",
      "palace": "Amrith Palace",
      "east coast": "East Coast Villa",
      "eastcoast": "East Coast Villa", 
      "ram water": "Ram Water Villa",
      "ramwater": "Ram Water Villa",
      "empire": "Empire Anand Villa Samudra",
      "anand": "Empire Anand Villa Samudra",
      "samudra": "Empire Anand Villa Samudra",
      "lavish villa 1": "Lavish Villa I",
      "lavish villa i": "Lavish Villa I",
      "lavish villa 2": "Lavish Villa II",
      "lavish villa ii": "Lavish Villa II",
      "lavish villa 3": "Lavish Villa III",
      "lavish villa iii": "Lavish Villa III"
    };

    for (const [keyword, villaKey] of Object.entries(nameKeywords)) {
      if (lowercaseVillaName.includes(keyword)) {
        return villaImageCollections[villaKey];
      }
    }

    // Return null if no match found
    return null;
  };

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching villas from:", `${API_BASE_URL}/api/villas/`);
        const res = await fetch(`${API_BASE_URL}/api/villas/`);
        if (!res.ok) throw new Error("Failed to load properties");
        const data = await res.json();
        console.log("API Response data:", data);
        
        // Map backend data to carousel property format
        const processedProperties = data.map((villa, idx) => {
          // Try to match villa name with our image collections
          const villaName = villa.name || "";
          let images = [];
          let featuredImage = null;
          
          // Get the full image collection for this villa
          const imageCollection = getBestMatchingVillaImages(villaName);
          
          if (imageCollection) {
            // Use our predefined image collections
            images = imageCollection;
            featuredImage = imageCollection[0]; // Use first image as featured
          } else if (Array.isArray(villa.images) && villa.images.length > 0) {
            // Use images from API if available
            images = villa.images;
            featuredImage = villa.images[0];
          } else {
            // Fallback to random image
            featuredImage = getRandomUnsplash();
            images = [featuredImage];
          }
          
          return {
            id: villa._id || `villa-${idx}`,
            _id: villa._id || `villa-${idx}`,
            name: villa.name,
            location: villa.location || "Luxury Location",
            rating: villa.rating || (4.5 + Math.random() * 0.5).toFixed(1),
            guests: villa.guests || 8,
            rooms: villa.bedrooms || 3,
            baths: villa.bathrooms || villa.bedrooms || 3,
            price: villa.price ? villa.price : 12000,
            formattedPrice: villa.price ? `₹${villa.price.toLocaleString()}` : "₹12,000",
            featuredImage: featuredImage, // Single image for carousel
            images: images, // All images for detail view
            bestRated: Math.random() > 0.5,
            category: villa.location?.split(",")[1]?.trim() || "All",
            amenities: villa.facilities?.map(f => f.name) || ["WiFi", "AC", "Kitchen", "Free Parking"],
            description: villa.description || "A beautiful luxury villa with stunning views and modern amenities.",
            type: villa.type || "VILLA"
          };
        });
        
        setProperties(processedProperties);
      } catch (err) {
        console.error("Error fetching villas:", err);
        setError('Failed to load properties');
        
        // Create fallback properties using our image collections
        createFallbackProperties();
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  // Function to create fallback properties if API fails
  const createFallbackProperties = () => {
    try {
      console.log("Creating fallback properties");
      
      // Create fallback properties using our predefined image collections
      const fallbackProperties = Object.entries(villaImageCollections).map(([name, images], index) => {
        return {
          id: `fallback-villa-${index}`,
          _id: `fallback-${index}`,
          name: name,
          location: index % 2 === 0 ? "Chennai, India" : "Pondicherry, India",
          rating: (Math.random() * 1 + 4).toFixed(1),
          guests: Math.floor(Math.random() * 10) + 2,
          rooms: Math.floor(Math.random() * 5) + 1,
          baths: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 30000) + 5000,
          formattedPrice: `₹${(Math.floor(Math.random() * 30000) + 5000).toLocaleString()}`,
          featuredImage: images[0], // First image as featured
          images: images, // All images for detail view
          bestRated: Math.random() > 0.5,
          category: "Luxury",
          amenities: ["WiFi", "AC", "Kitchen", "Free Parking"],
          description: "A beautiful luxury villa with stunning views and modern amenities.",
          type: "VILLA"
        };
      });
      
      setProperties(fallbackProperties);
    } catch (fallbackError) {
      console.error("Even fallback creation failed:", fallbackError);
    }
  };

  // Handler for View Details button - navigate to villa/:id with all images
  const handleViewDetails = (property) => {
    const villaId = property._id || property.id;
    
    // Prepare data for villa details page
    const villaData = {
      id: villaId,
      _id: villaId,
      name: property.name,
      location: property.location,
      price: property.price,
      description: property.description,
      images: property.images, // Pass ALL images to the detail view
      guests: property.guests,
      bedrooms: property.rooms,
      bathrooms: property.baths,
      rating: property.rating,
      amenities: property.amenities,
      type: property.type
    };
    
    console.log("Navigating to villa details with data:", villaData);
    
    // Navigate to villa details page
    navigate(`/villa/${villaId}`, { 
      state: { villa: villaData }
    });
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto relative golden-luxury-featured px-4">
        {/* Title with animation */}
      <motion.div 
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-amber-800 mb-2 flex items-center justify-center">
          Featured Properties
        </h1>
        <div className="flex justify-center">
          <motion.div 
            className="h-1.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Loading and error states */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 text-center border border-amber-200">
          {error}
        </div>
      )}

      {/* Carousel Container */}
      {!loading && !error && properties.length > 0 && (
        <div 
          className="relative overflow-hidden rounded-2xl shadow-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Hand swipe hint animation */}
          <AnimatePresence>
            {showSwipeHint && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-amber-900/80 to-yellow-900/80 text-amber-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-amber-600"
                  animate={{ 
                    x: [0, -50, 0], 
                    opacity: [0.9, 0.6, 0.9] 
                  }}
                  transition={{ 
                    repeat: 2, 
                    duration: 1.5,
                    repeatType: "reverse"  
                  }}
                >
                  <span className="text-lg">👆</span>
                  <span className="text-sm font-medium">Swipe to explore</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-sm p-3 rounded-full shadow-lg border border-amber-200 disabled:opacity-50 hover:from-amber-100 hover:to-yellow-100 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-amber-700" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-sm p-3 rounded-full shadow-lg border border-amber-200 disabled:opacity-50 hover:from-amber-100 hover:to-yellow-100 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-amber-700" />
          </button>

          {/* Crossfade Carousel */}
          <div className="relative h-[600px] sm:h-[600px] w-full">
            {properties.map((property, index) => (
              <AnimatePresence key={property.id}>
                {index === activeIndex && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="h-full w-full relative">
                      {/* Property Image with overlay - ONLY SHOW ONE FEATURED IMAGE HERE */}
                      <motion.img
                        src={property.featuredImage}
                        alt={property.name}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.7 }}
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.src = getRandomUnsplash();
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-800/30 to-transparent" />

                      {/* Rating Badge */}
                      <motion.div 
                        className="absolute top-5 left-5 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg border border-amber-200"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="font-semibold text-sm text-amber-800">{property.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </motion.div>
                      
                      {/* Heart Button */}
                      <motion.button 
                        className="absolute top-5 right-5 bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-sm rounded-full p-2 shadow-lg border border-amber-200"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-4 h-4 text-amber-600 hover:text-red-500 transition-colors" />
                      </motion.button>

                      {/* Property details - animated from bottom */}
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-amber-900/90 via-amber-800/70 to-transparent backdrop-blur-sm text-white"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <motion.h3 
                          className="text-2xl font-bold mb-2 text-amber-50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {property.name}
                        </motion.h3>
                        
                        <motion.div 
                          className="flex items-center gap-1.5 mb-3 text-amber-100"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <MapPin className="w-4 h-4 text-amber-300" />
                          <span className="text-sm">{property.location}</span>
                        </motion.div>
                        
                        <motion.p 
                          className="text-sm text-amber-200 mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          Up to {property.guests} Guests • {property.rooms} Rooms • {property.baths} Baths
                        </motion.p>
                        
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-amber-100">
                                ₹{property.price.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-amber-300 mt-0.5">Per Night + Taxes</p>
                          </div>
                          
                          <motion.button 
                            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 font-semibold px-6 py-2.5 rounded-lg shadow-lg border border-amber-300 hover:from-amber-300 hover:to-yellow-400 transition-all duration-300"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(251, 191, 36, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(property)}
                          >
                            View Details
                          </motion.button>
                        </motion.div>
                        
                        {/* Best Rated Badge */}
                        {property.bestRated && (
                          <motion.div 
                            className="absolute top-[-60px] right-0 bg-gradient-to-r from-amber-600 to-yellow-600 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-amber-400"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
                            <span className="text-xs font-medium">Best Rated</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Dots - Enhanced */}
      <div className="flex justify-center gap-2 mt-6">
        {properties.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="relative h-2 rounded-full transition-all"
            animate={{ 
              width: activeIndex === index ? "1.5rem" : "0.5rem",
              backgroundColor: activeIndex === index ? "#d97706" : "#fbbf24" 
            }}
            transition={{ duration: 0.3 }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: activeIndex === index ? "#d97706" : "#f59e0b"
            }}
          >
            {activeIndex === index && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-amber-400"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.5, 1.8],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
      </div>
    </section>
  )
}

export default FeaturedDestination

// You can also keep the named export if you want
export const AnimatedCarousel = FeaturedDestination