
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { PlayCircle, PauseCircle, X, ZoomIn, ChevronLeft, ChevronRight, Image, Camera, Heart } from 'lucide-react';
import villaVideo from '../../assets/About/v.mp4';
import SEOHead from '../SEO/SEOHead';

const Gallery = () => {
  // SEO Configuration for Gallery page
  const galleryTitle = "Luxury Villa Gallery | Luxor Holiday Home Stays Premium Collection";
  const galleryDescription = "Explore our premium collection of luxury villas in Chennai and Pondicherry. Browse high-quality images of Luxor Holiday Home Stays' exclusive properties with private pools, beachfront views, and premium amenities.";
  const galleryKeywords = "luxor gallery, luxor holiday gallery, luxor stay photos, luxor holiday homestays gallery, luxury villas, villa photos, chennai villas, pondicherry villas";
  
  // State management
  const [isInView, setIsInView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const [playingStates, setPlayingStates] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);
  //  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Unused state removed// Uncomment if needed for mouse interactions
  const [scrollY, setScrollY] = useState(0);
  
  // Refs for element access
  const galleryRef = useRef(null);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const modalVideoRef = useRef(null);
  const controls = useAnimation();
  
  // CRT effect ref
  const crtOverlayRef = useRef(null);

  // Premium villa gallery items
  const mediaItems = [
    // Chennai - Amrith Palace
    { 
      type: 'image', 
      src: '/AmrithPalace/AP1.jpg', 
      alt: 'Amrith Palace Villa Front View', 
      category: 'exterior',
      featured: true,
      location: 'Chennai'
    },
    { 
      type: 'video', 
      src: villaVideo, 
      alt: 'Luxury Villa Tour', 
      category: 'tour',
      featured: true,
      location: 'Chennai'
    },
    { 
      type: 'image', 
      src: '/AmrithPalace/AP2.jpg', 
      alt: 'Premium Infinity Pool', 
      category: 'outdoor',
      featured: true,
      location: 'Chennai'
    },
    { 
      type: 'image', 
      src: '/AmrithPalace/AP3.jpg', 
      alt: 'Master Suite with Ocean View', 
      category: 'interior',
      featured: false,
      location: 'Chennai' 
    },
    { 
      type: 'image', 
      src: '/AmrithPalace/AP4.jpg', 
      alt: 'Gourmet Kitchen', 
      category: 'interior',
      featured: false,
      location: 'Chennai' 
    },
    { 
      type: 'image', 
      src: '/AmrithPalace/AP5.jpg', 
      alt: 'Spacious Living Area', 
      category: 'interior',
      featured: false,
      location: 'Chennai'
    },
    { 
      type: 'image', 
      src: '/AmrithPalace/AP10.jpg', 
      alt: 'Luxurious Bedroom Suite', 
      category: 'interior',
      featured: true,
      location: 'Chennai'
    },
    { 
      type: 'image', 
      src: '/AmrithPalace/AP15.jpg', 
      alt: 'Elegant Bathroom', 
      category: 'interior',
      featured: false,
      location: 'Chennai'
    },
    { 
      type: 'image', 
      src: '/AmrithPalace/AP20.jpg', 
      alt: 'Modern Entertainment Area', 
      category: 'interior',
      featured: true,
      location: 'Chennai'
    },
    
    // Pondicherry - Lavish Villa 1
    { 
      type: 'image', 
      src: '/LavishVilla 1/lvone1.jpg', 
      alt: 'Lavish Villa 1 Entrance', 
      category: 'exterior',
      featured: false,
      location: 'Pondicherry' 
    },
    { 
      type: 'image', 
      src: '/LavishVilla 1/lvone2.jpg', 
      alt: 'Private Garden Terrace', 
      category: 'outdoor',
      featured: true,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/LavishVilla 1/lvone3.jpg', 
      alt: 'Luxury Dining Experience', 
      category: 'interior',
      featured: false,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/LavishVilla 1/lvone10.jpg', 
      alt: 'Spacious Living Room', 
      category: 'interior',
      featured: true,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/LavishVilla 1/lvone15.jpg', 
      alt: 'Premium Bedroom', 
      category: 'interior',
      featured: false,
      location: 'Pondicherry'
    },
    
    // Pondicherry - Lavish Villa 2
    { 
      type: 'image', 
      src: '/LavishVilla 2/lvtwo1.jpg', 
      alt: 'Lavish Villa 2 Exterior', 
      category: 'exterior',
      featured: true,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/LavishVilla 2/lvtwo5.jpg', 
      alt: 'Villa 2 Poolside', 
      category: 'outdoor',
      featured: true,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/LavishVilla 2/lvtwo10.jpg', 
      alt: 'Luxurious Lounge', 
      category: 'interior',
      featured: false,
      location: 'Pondicherry'
    },
    
    // Pondicherry - Lavish Villa 3
    { 
      type: 'image', 
      src: '/LavishVilla 3/lvthree1.jpg', 
      alt: 'Lavish Villa 3 Front View', 
      category: 'exterior',
      featured: false,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/LavishVilla 3/lvthree10.jpg', 
      alt: 'Villa 3 Lounge Area', 
      category: 'interior',
      featured: true,
      location: 'Pondicherry'
    },
    
    // Pondicherry - East Coast Villa
    { 
      type: 'image', 
      src: '/eastcoastvilla/EC1.jpg', 
      alt: 'East Coast Villa View', 
      category: 'exterior',
      featured: true,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/eastcoastvilla/EC2.jpg', 
      alt: 'Beachfront Relaxation Area', 
      category: 'outdoor',
      featured: false,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/eastcoastvilla/EC3.jpg', 
      alt: 'Designer Bathroom', 
      category: 'interior',
      featured: false,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/eastcoastvilla/EC10.jpg', 
      alt: 'Beach View Suite', 
      category: 'interior',
      featured: true,
      location: 'Pondicherry'
    },
    
    // Pondicherry - Empire Anand Villa
    { 
      type: 'image', 
      src: '/empireanandvillasamudra/anandvilla1.jpg', 
      alt: 'Anand Villa Exterior', 
      category: 'exterior',
      featured: true,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/empireanandvillasamudra/anandvilla5.jpg', 
      alt: 'Anand Villa Garden', 
      category: 'outdoor',
      featured: true,
      location: 'Pondicherry'
    },
    { 
      type: 'image', 
      src: '/empireanandvillasamudra/anandvilla10.jpg', 
      alt: 'Anand Villa Living Room', 
      category: 'interior',
      featured: false,
      location: 'Pondicherry'
    }
  ];

  // Enhanced filter categories
  const categories = ['all', 'exterior', 'interior', 'outdoor', 'tour'];
  const locations = ['all', 'Chennai', 'Pondicherry'];
  const [activeLocation, setActiveLocation] = useState('all');

  // Filtered items based on selected category and location
  const filteredItems = mediaItems.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const locationMatch = activeLocation === 'all' || item.location === activeLocation;
    return categoryMatch && locationMatch;
  });

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for triggering animations when gallery comes into view
  useEffect(() => {
    const options = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          controls.start("visible");
        }
      });
    }, options);

    if (galleryRef.current) observer.observe(galleryRef.current);
    
    return () => {
      if (galleryRef.current) observer.unobserve(galleryRef.current);
    };
  }, [controls]);

  // Create CRT effect when a video is active
  const applyCRTEffect = (videoElement, isPlaying) => {
    if (!crtOverlayRef.current) return;
    
    if (isPlaying) {
      // Activate CRT effect
      crtOverlayRef.current.style.opacity = '1';
      crtOverlayRef.current.style.display = 'block';
      
      // Apply scan lines and flicker
      document.documentElement.style.setProperty('--crt-scan-speed', '8s');
    } else {
      // Remove CRT effect with a smooth fadeout
      crtOverlayRef.current.style.opacity = '0';
      setTimeout(() => {
        crtOverlayRef.current.style.display = 'none';
      }, 500);
      
      // Reset scan lines
      document.documentElement.style.setProperty('--crt-scan-speed', '0s');
    }
  };

  // Enhanced video play/pause with smooth transitions and effects
  const toggleVideoPlay = (index, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const video = videoRefs.current[index];
    if (!video) return;
    
    setPlayingStates(prev => {
      const newState = { ...prev, [index]: !prev[index] };
      
      if (!prev[index]) {
        // Video is about to play
        setActiveVideoIndex(index);
        video.play().catch(e => console.log('Play error:', e));
        
        // Add visual effects for playing state
        applyCRTEffect(video, true);
        
        // Create startup animation
        video.classList.add('playing');
        setTimeout(() => video.classList.add('crt-active'), 100);
      } else {
        // Video is about to pause
        video.pause();
        setActiveVideoIndex(null);
        
        // Remove visual effects
        applyCRTEffect(video, false);
        
        // Remove classes with transition
        video.classList.remove('crt-active');
        setTimeout(() => video.classList.remove('playing'), 300);
      }
      
      return newState;
    });
  };

  // Handle mouse hover effects
  const handleMouseEnter = (index) => {
    setHoveredItem(index);
    
    // Auto-play on hover (optional)
    // const video = videoRefs.current[index];
    // if (mediaItems[index].type === 'video' && video && video.paused) {
    //   video.play().catch(e => console.log('Play error on hover:', e));
    //   setPlayingStates(prev => ({ ...prev, [index]: true }));
    // }
  };
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
    
    // Auto-pause on mouse leave (optional)
    // if (hoveredItem !== null) {
    //   const video = videoRefs.current[hoveredItem];
    //   if (mediaItems[hoveredItem]?.type === 'video' && video && !video.paused) {
    //     video.pause();
    //     setPlayingStates(prev => ({ ...prev, [hoveredItem]: false }));
    //   }
    // }
  };
  
  // Track mouse position for hover effects - simplified to avoid unused state
  const handleMouseMove = () => {
    // Mouse tracking functionality removed to simplify component
    // This function is kept to prevent errors with the onMouseMove prop
  };
  
  // Open fullscreen modal for item
  const openModal = (index) => {
    setSelectedItem(index);
    document.body.style.overflow = 'hidden';
    
    // If it's a video, prepare it for modal viewing
    if (mediaItems[index].type === 'video') {
      setTimeout(() => {
        if (modalVideoRef.current) {
          modalVideoRef.current.currentTime = 0;
        }
      }, 100);
    }
  };
  
  // Close fullscreen modal
  const closeModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = '';
    
    // If active video is playing in gallery, keep it playing
    if (activeVideoIndex !== null) {
      const video = videoRefs.current[activeVideoIndex];
      if (video && !video.paused) {
        video.play().catch(e => console.log('Resume error:', e));
      }
    }
  };
  
  // Handle modal video playback
  const toggleModalVideo = () => {
    if (!modalVideoRef.current) return;
    
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      applyCRTEffect(modalVideoRef.current, true);
    } else {
      modalVideoRef.current.pause();
      applyCRTEffect(modalVideoRef.current, false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (index) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    }),
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    tap: {
      scale: 0.97
    }
  };

  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const filterItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    active: {
      color: "#000",
      fontWeight: "600",
      scale: 1.05,
      textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
    },
    inactive: {
      color: "#777",
      fontWeight: "400",
      scale: 1
    },
    hover: {
      color: "#000",
      scale: 1.05
    },
    tap: {
      scale: 0.97
    }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* SEO Component */}
      <SEOHead 
        title={galleryTitle}
        description={galleryDescription}
        keywords={galleryKeywords}
        ogImage="/AmrithPalace/AP2.jpg"
      />
      
      {/* CRT overlay effect for videos */}
      <div 
        ref={crtOverlayRef} 
        className="fixed inset-0 pointer-events-none z-10 opacity-0 hidden transition-opacity duration-300"
        style={{
          background: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.02) 50%)",
          backgroundSize: "100% 4px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Custom CSS for CRT effect */}
      <style jsx global>{`
        @keyframes scanLine {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes flicker {
          0% { opacity: 0.97; }
          5% { opacity: 0.9; }
          10% { opacity: 0.97; }
          15% { opacity: 1; }
          50% { opacity: 0.94; }
          80% { opacity: 0.98; }
          95% { opacity: 0.94; }
          100% { opacity: 0.98; }
        }
        
        .crt-active {
          animation: flicker 0.3s infinite alternate;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.2);
        }
        
        .crt-active::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.05) 50%);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 2;
        }
        
        .playing {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .playing::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          animation: scanLine var(--crt-scan-speed, 8s) linear infinite;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <motion.div 
        ref={(el) => {
          galleryRef.current = el;
          containerRef.current = el;
        }}
        className="bg-white px-6 py-12 md:p-12 rounded-xl shadow-lg overflow-hidden relative"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        onMouseMove={handleMouseMove}
      >
        {/* Background elements */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gray-100 mix-blend-multiply opacity-50"
          animate={{
            y: scrollY * 0.05
          }}
        />
        
        <motion.div
          className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-gray-200 mix-blend-multiply opacity-40"
          animate={{
            y: scrollY * -0.03
          }}
        />
        
        {/* Premium title section with animated underline */}
        <motion.div className="text-center mb-10 relative z-10" variants={titleVariants}>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="uppercase text-xs tracking-wider text-gray-500 font-semibold mb-2"
          >
            Luxor Holiday Home Stays
          </motion.div>
          
          <motion.h2 className="text-3xl sm:text-5xl font-serif text-charcoal mb-4 inline-block relative">
            Premium Villa Gallery
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-charcoal to-transparent"
              initial={{ width: "0%" }}
              animate={{ width: "80%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.h2>
          
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Explore our exclusive collection of luxury villas in Chennai and Pondicherry. 
            Each property is carefully designed to provide unparalleled comfort and elegance.
            Click on any image to view in full screen and immerse yourself in the exquisite details.
          </motion.p>
        </motion.div>
        
        {/* Filter sections */}
        <div className="mb-8">
          {/* Location filters */}
          <motion.div 
            className="mb-4 text-center"
            variants={filterVariants}
          >
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Choose Location</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {locations.map((location, index) => (
                <motion.button
                  key={location}
                  variants={filterItemVariants}
                  custom={index}
                  animate={activeLocation === location ? "active" : "inactive"}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setActiveLocation(location)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${
                    activeLocation === location 
                    ? 'bg-charcoal text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {location}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Category filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={filterVariants}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                variants={filterItemVariants}
                custom={index}
                animate={filterCategory === category ? "active" : "inactive"}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm ${
                  filterCategory === category 
                  ? 'border-charcoal bg-charcoal/5' 
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </div>
        
        {/* Featured Section - if any featured items exist */}
        {filteredItems.some(item => item.featured) && (
          <motion.div className="mb-12" variants={containerVariants}>
            <motion.h3 
              className="text-2xl font-serif text-charcoal mb-6 relative inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Featured Properties
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-charcoal to-transparent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 0.5 }}
              />
            </motion.h3>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              variants={containerVariants}
            >
              {filteredItems.filter(item => item.featured).slice(0, 2).map((item, index) => (
                <motion.div 
                  key={`featured-${index}`}
                  className="h-80 md:h-96 overflow-hidden rounded-xl relative group cursor-pointer"
                  variants={itemVariants}
                  custom={index}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => openModal(mediaItems.indexOf(item))}
                  onMouseEnter={() => handleMouseEnter(mediaItems.indexOf(item))}
                  onMouseLeave={() => handleMouseLeave()}
                  style={{
                    transformOrigin: 'center',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    backgroundColor: '#f8f8f8',
                  }}
                >
                  {/* Item content (image or video) */}
                  {item.type === 'image' ? (
                    <motion.img 
                      src={item.src} 
                      alt={item.alt} 
                      className="w-full h-full object-cover transition-transform duration-1500 ease-out"
                      initial={{ scale: 1.1, filter: 'grayscale(40%)' }}
                      animate={{ 
                        scale: hoveredItem === mediaItems.indexOf(item) ? 1.05 : 1,
                        filter: hoveredItem === mediaItems.indexOf(item) ? 'grayscale(0%)' : 'grayscale(20%)'
                      }}
                      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    />
                  ) : (
                    <div className="w-full h-full relative overflow-hidden">
                      <motion.video
                        ref={el => videoRefs.current[mediaItems.indexOf(item)] = el}
                        src={item.src}
                        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                          playingStates[mediaItems.indexOf(item)] ? '' : 'grayscale'
                        }`}
                        muted
                        loop
                        playsInline
                        initial={{ scale: 1.1 }}
                        animate={{ 
                          scale: hoveredItem === mediaItems.indexOf(item) || playingStates[mediaItems.indexOf(item)] ? 1.05 : 1
                        }}
                        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                        onClick={(e) => e.preventDefault()}
                      />
                      
                      {/* Play button overlay with improved animation */}
                      <motion.button
                        onClick={(e) => toggleVideoPlay(mediaItems.indexOf(item), e)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ 
                          scale: 1.1, 
                          opacity: 1,
                          boxShadow: "0 0 20px rgba(255,255,255,0.5)" 
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <motion.div
                          className="relative flex items-center justify-center"
                          animate={{
                            rotate: playingStates[mediaItems.indexOf(item)] ? 0 : 0,
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          {playingStates[mediaItems.indexOf(item)] ? (
                            <PauseCircle className="w-14 h-14 text-white drop-shadow-lg" />
                          ) : (
                            <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                          )}
                          
                          {/* Animated ring around play button */}
                          <motion.div
                            className="absolute -inset-1 rounded-full border-2 border-white/50"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                              scale: [0.8, 1.2, 0.8],
                              opacity: [0, 0.5, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                            }}
                          />
                        </motion.div>
                      </motion.button>
                    </div>
                  )}
                  
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4 bg-white/90 text-charcoal px-3 py-1 rounded-full text-xs font-medium shadow-md">
                    Featured
                  </div>
                  
                  {/* Overlay gradient */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredItem === mediaItems.indexOf(item) ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Location badge */}
                  <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
                    {item.location}
                  </div>
                  
                  {/* Item info */}
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full p-6 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: hoveredItem === mediaItems.indexOf(item) ? 1 : 0,
                      y: hoveredItem === mediaItems.indexOf(item) ? 0 : 20
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.h3 
                      className="text-xl font-medium"
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      {item.alt}
                    </motion.h3>
                    
                    <motion.div 
                      className="text-sm text-white/80 mt-2 flex items-center gap-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <span className="capitalize">{item.category}</span>
                      <span className="w-1 h-1 bg-white/70 rounded-full" />
                      <span>{item.type === 'video' ? 'Video' : 'Photo'}</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Main Gallery Grid */}
        <motion.div className="mb-6" variants={containerVariants}>
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="text-xl font-serif text-charcoal relative inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              All Properties
              <motion.div
                className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-charcoal to-transparent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 0.5 }}
              />
            </motion.h3>
            
            <motion.div 
              className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {filteredItems.length} properties found
            </motion.div>
          </div>
        </motion.div>
        
        {/* Gallery grid with empty state */}
        {filteredItems.length === 0 ? (
          <motion.div 
            className="py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-block p-4 rounded-full bg-gray-100">
              <Image className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try changing your filters to see more results</p>
            <button 
              onClick={() => { 
                setFilterCategory('all'); 
                setActiveLocation('all');
              }}
              className="px-6 py-2 bg-charcoal text-white rounded-full hover:bg-charcoal/90 transition-colors"
            >
              Reset filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {filteredItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="h-64 md:h-72 overflow-hidden rounded-xl relative group cursor-pointer"
              variants={itemVariants}
              custom={index}
              whileHover="hover"
              whileTap="tap"
              onClick={() => openModal(mediaItems.indexOf(item))}
              onMouseEnter={() => handleMouseEnter(mediaItems.indexOf(item))}
              onMouseLeave={() => handleMouseLeave()}
              style={{
                transformOrigin: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                backgroundColor: '#f8f8f8',
              }}
            >
              {/* Item content (image or video) */}
              {item.type === 'image' ? (
                <motion.img 
                  src={item.src} 
                  alt={item.alt} 
                  className="w-full h-full object-cover transition-transform duration-1500 ease-out"
                  initial={{ scale: 1.1, filter: 'grayscale(100%)' }}
                  animate={{ 
                    scale: hoveredItem === mediaItems.indexOf(item) ? 1.05 : 1,
                    filter: hoveredItem === mediaItems.indexOf(item) ? 'grayscale(0%)' : 'grayscale(80%)'
                  }}
                  transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                />
              ) : (
                <div className="w-full h-full relative overflow-hidden">
                  <motion.video
                    ref={el => videoRefs.current[mediaItems.indexOf(item)] = el}
                    src={item.src}
                    className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                      playingStates[mediaItems.indexOf(item)] ? '' : 'grayscale'
                    }`}
                    muted
                    loop
                    playsInline
                    initial={{ scale: 1.1 }}
                    animate={{ 
                      scale: hoveredItem === mediaItems.indexOf(item) || playingStates[mediaItems.indexOf(item)] ? 1.05 : 1
                    }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    onClick={(e) => e.preventDefault()}
                  />
                  
                  {/* Play button overlay with improved animation */}
                  <motion.button
                    onClick={(e) => toggleVideoPlay(mediaItems.indexOf(item), e)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ 
                      scale: 1.1, 
                      opacity: 1,
                      boxShadow: "0 0 20px rgba(255,255,255,0.5)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <motion.div
                      className="relative flex items-center justify-center"
                      animate={{
                        rotate: playingStates[mediaItems.indexOf(item)] ? 0 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {playingStates[mediaItems.indexOf(item)] ? (
                        <PauseCircle className="w-14 h-14 text-white drop-shadow-lg" />
                      ) : (
                        <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                      )}
                      
                      {/* Animated ring around play button */}
                      <motion.div
                        className="absolute -inset-1 rounded-full border-2 border-white/50"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                        }}
                      />
                    </motion.div>
                  </motion.button>
                </div>
              )}
              
              {/* Overlay gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredItem === mediaItems.indexOf(item) ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Item info */}
              <motion.div 
                className="absolute bottom-0 left-0 w-full p-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: hoveredItem === mediaItems.indexOf(item) ? 1 : 0,
                  y: hoveredItem === mediaItems.indexOf(item) ? 0 : 20
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <motion.h3 
                  className="text-lg font-medium"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {item.alt}
                </motion.h3>
                
                <motion.div 
                  className="text-sm text-white/80 mt-1 flex items-center gap-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <span className="capitalize">{item.category}</span>
                  <span className="w-1 h-1 bg-white/70 rounded-full" />
                  <span>{item.type === 'video' ? 'Video' : 'Photo'}</span>
                </motion.div>
              </motion.div>
              
              {/* Zoom icon */}
              <motion.div 
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: hoveredItem === mediaItems.indexOf(item) ? 1 : 0.5, 
                  opacity: hoveredItem === mediaItems.indexOf(item) ? 1 : 0 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </motion.div>
              
              {/* Category badge */}
              <motion.div 
                className="absolute top-4 left-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: hoveredItem === mediaItems.indexOf(item) ? 1 : 0, 
                  x: hoveredItem === mediaItems.indexOf(item) ? 0 : -10
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs capitalize">
                  {item.category}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </motion.div>
      
      {/* Premium fullscreen modal */}
      <AnimatePresence>
        {selectedItem !== null && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
              onClick={closeModal}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-8 h-8" />
            </motion.button>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <motion.div 
              className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/5 blur-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0.05] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
            
            <motion.div 
              className="relative max-w-6xl max-h-[85vh] w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Location badge */}
              <motion.div 
                className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/80"></div>
                  <span className="text-white text-sm">{mediaItems[selectedItem].location}</span>
                </div>
              </motion.div>
              
              {mediaItems[selectedItem].type === 'image' ? (
                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                  <motion.img 
                    src={mediaItems[selectedItem].src} 
                    alt={mediaItems[selectedItem].alt}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                  
                  {/* Premium overlay effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl">
                  <video
                    ref={modalVideoRef}
                    src={mediaItems[selectedItem].src}
                    className="w-full h-full object-contain"
                    controls={false}
                    muted
                    loop
                    onClick={toggleModalVideo}
                  />
                  
                  {/* CRT scan lines overlay for modal video */}
                  <div className="absolute inset-0 pointer-events-none z-10 opacity-30" 
                    style={{
                      background: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.05) 50%)",
                      backgroundSize: "100% 4px",
                      mixBlendMode: "overlay",
                    }}
                  />
                  
                  {/* Play/pause button */}
                  <motion.button
                    onClick={toggleModalVideo}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 rounded-full p-6 backdrop-blur-sm"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {modalVideoRef.current && !modalVideoRef.current.paused ? (
                      <PauseCircle className="w-12 h-12 text-white" />
                    ) : (
                      <PlayCircle className="w-12 h-12 text-white" />
                    )}
                  </motion.button>
                </div>
              )}
              
              {/* Enhanced image/video info */}
              <motion.div 
                className="bg-white/10 backdrop-blur-md text-white p-6 rounded-xl mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      {mediaItems[selectedItem].featured && (
                        <span className="bg-white text-charcoal px-2 py-0.5 rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs capitalize">
                        {mediaItems[selectedItem].category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-medium">{mediaItems[selectedItem].alt}</h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm mt-2">
                      <Camera className="w-4 h-4" />
                      <span>{mediaItems[selectedItem].type === 'video' ? 'Premium Video Tour' : 'High Resolution Photo'}</span>
                    </div>
                  </div>
                  
                  <div className="ml-auto">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-charcoal"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Book This Villa</span>
                    </motion.button>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm mt-4 border-t border-white/10 pt-4">
                  Experience the luxury and elegance of our exquisite {mediaItems[selectedItem].location} villa, 
                  designed for comfort and sophistication. Each property is carefully curated to provide an unforgettable stay.
                </p>
              </motion.div>
              
              {/* Navigation buttons */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-between pointer-events-none">
                <motion.button 
                  className="pointer-events-auto bg-black/30 backdrop-blur-sm p-2 rounded-full text-white/70 hover:text-white -ml-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(selectedItem > 0 ? selectedItem - 1 : mediaItems.length - 1);
                  }}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={mediaItems.length <= 1}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                
                <motion.button 
                  className="pointer-events-auto bg-black/30 backdrop-blur-sm p-2 rounded-full text-white/70 hover:text-white -mr-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem((selectedItem + 1) % mediaItems.length);
                  }}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={mediaItems.length <= 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;