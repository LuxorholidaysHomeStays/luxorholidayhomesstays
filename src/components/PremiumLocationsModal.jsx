import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaTimes, FaBuilding, FaInfoCircle, FaStar } from 'react-icons/fa';
import { MdLocationOn, MdLocationCity, MdBeachAccess, MdLocalActivity } from 'react-icons/md';

const PremiumLocationsModal = ({ isOpen, onClose, navigate, clickPosition = null }) => {
  // State to track which location is active
  const [activeLocation, setActiveLocation] = useState('Chennai');
  
  // Reference to the modal content for scrolling
  const modalContentRef = useRef(null);
  
  // For mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to handle body scroll lock and positioning
  useEffect(() => {
    if (isOpen) {
      // Lock scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
      
      // Force scroll to top immediately for consistent positioning
      window.scrollTo({
        top: 0,
        behavior: 'auto' // Use 'auto' for immediate scroll without animation
      });
      
      // For desktop, apply a class to body for better positioning
      document.body.classList.add('premium-modal-open');
      
      // For mobile specific handling
      if (isMobile) {
        document.body.classList.add('premium-modal-open-mobile');
      }
      
      // Add inline styles to ensure modal is at the top
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = '';
      document.body.classList.remove('premium-modal-open');
      document.body.classList.remove('premium-modal-open-mobile');
      
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('premium-modal-open');
      document.body.classList.remove('premium-modal-open-mobile');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen, isMobile]);

  // Location data
  const locationData = {
    Chennai: {
      mainImage: "/eastcoastvilla/EC1.jpg", // Main featured image for Chennai
      description: "Experience the perfect blend of traditional charm and modern luxury in Chennai. Our premium villas in this vibrant coastal city offer stunning sea views, private pools, and easy access to both cultural landmarks and pristine beaches.",
      attractions: [
        "Marina Beach - The second-longest urban beach in the world",
        "Kapaleeshwarar Temple - Ancient Dravidian architecture",
        "DakshinaChitra Museum - Cultural heritage center",
        "ECR (East Coast Road) - Scenic coastal drive"
      ],
      villaCount: 5,
      villaTypes: "Beachfront, Garden View, City View"
    },
    Pondicherry: {
      mainImage: "/AmrithPalace/AP1.jpg", // Main featured image for Pondicherry
      description: "Discover the French colonial charm of Pondicherry through our exquisite villas. Located in serene neighborhoods, our properties combine French architectural elegance with Indian warmth, creating unique spaces perfect for a tranquil getaway.",
      attractions: [
        "Promenade Beach - Scenic 1.5km stretch along Bay of Bengal",
        "Auroville - Experimental township with the iconic Matrimandir",
        "French Quarter - Colonial buildings and charming streets",
        "Paradise Beach - Pristine secluded beach"
      ],
      villaCount: 3,
      villaTypes: "Heritage Design, Waterfront, Colonial Style"
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overflow-x-hidden bg-black/70 backdrop-blur-sm"
          style={{ 
            paddingTop: 0,
            alignItems: 'flex-start' 
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative m-4 max-w-4xl w-full"
            ref={modalContentRef}
            initial={{ scale: 0.9, y: -100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300, velocity: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-b from-black/90 to-black/95 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#D4AF37]/20">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold luxury-gold-bg">Premium Locations</h2>
                  <p className="text-[#D4AF37]/80 text-sm">Explore our exclusive villa collections</p>
                </div>
                <button 
                  onClick={onClose}
                  className="rounded-full p-2 bg-black/40 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Location selector */}
              <div className="flex p-4 gap-3 border-b border-[#D4AF37]/20">
                {Object.keys(locationData).map(location => (
                  <button
                    key={location}
                    onClick={() => setActiveLocation(location)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      activeLocation === location
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-black font-bold shadow-lg'
                        : 'bg-black/30 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <MdLocationOn className="mr-2" />
                      {location}
                    </div>
                  </button>
                ))}
              </div>

              {/* Location Image at the Top */}
              <div className="relative w-full h-48 sm:h-64 overflow-hidden">
                <img 
                  src={locationData[activeLocation].mainImage} 
                  alt={`${activeLocation} Featured`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-4 sm:p-6 w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                      {activeLocation}
                      <span className="block text-sm font-normal text-[#D4AF37] mt-1">
                        {locationData[activeLocation].villaCount} Luxury Villas Available
                      </span>
                    </h2>
                  </div>
                </div>
              </div>

              {/* Main content area with scroll */}
              <div className="p-4 sm:p-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  {/* Location description */}
                  <div className="bg-black/30 rounded-xl p-4 border border-[#D4AF37]/20">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#D4AF37]/20 p-2 rounded-full shrink-0">
                        <FaMapMarkerAlt className="text-[#D4AF37] h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">About {activeLocation}</h3>
                        <p className="text-gray-300">
                          {locationData[activeLocation].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location attractions */}
                  <div className="bg-black/30 rounded-xl p-4 border border-[#D4AF37]/20">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#D4AF37]/20 p-2 rounded-full shrink-0">
                        <MdLocalActivity className="text-[#D4AF37] h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Top Attractions</h3>
                        <ul className="space-y-2">
                          {locationData[activeLocation].attractions.map((attraction, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-[#D4AF37] mt-1">•</span>
                              <span className="text-gray-300">{attraction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Available Villa Types */}
                  <div className="bg-black/30 rounded-xl p-4 border border-[#D4AF37]/20">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#D4AF37]/20 p-2 rounded-full shrink-0">
                        <MdBeachAccess className="text-[#D4AF37] h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Villa Types</h3>
                        <p className="text-gray-300">
                          {locationData[activeLocation].villaTypes}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Browse Villas Button */}
                  <motion.button
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-black font-bold rounded-lg shadow-xl flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px -5px rgba(212, 175, 55, 0.6)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Close modal and navigate to search results with location filter
                      onClose();
                      if (navigate) {
                        // Use React Router navigation if available
                        navigate(`/search-results?location=${activeLocation}`);
                      } else {
                        // Fallback to window.location
                        window.location.href = `/search-results?location=${activeLocation}`;
                      }
                    }}
                  >
                    <FaBuilding className="h-5 w-5" />
                    <span>Browse {activeLocation} Villas</span>
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#D4AF37]/20 flex justify-between items-center">
                <span className="text-xs text-[#D4AF37]/70 flex items-center">
                  <FaInfoCircle className="mr-1 h-3 w-3" />
                  All villas feature premium amenities & services
                </span>
                <button 
                  onClick={onClose}
                  className="px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#BFA181] text-black rounded-full text-sm font-medium hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumLocationsModal;
