

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CalendarDays, PhoneCall, MapPin, X } from 'lucide-react';

const CallToAction = () => {
  const [isHovered, setIsHovered] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleBookClick = (e) => {
    e.preventDefault();
    setShowLocationPopup(true);
  };
  
  const handleLocationClick = (location) => {
    if (location === 'Chennai') {
      window.location.href = '/chennai-villas';
    } else if (location === 'Pondicherry') {
      window.location.href = '/pondicherry-villas';
    }
    setShowLocationPopup(false);
  };
  
  const closePopup = () => {
    setShowLocationPopup(false);
  };
  
  // Particles for hover effect
  const particles = Array.from({ length: 15 }, (_, i) => i);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="relative py-24 px-6 sm:px-8 md:px-12 overflow-hidden bg-gradient-to-br from-white to-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      onMouseMove={handleMouseMove}
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: "url('https://www.transparenttextures.com/patterns/black-paper.png')", 
          y: scrollY * 0.1 
        }}
      />
      
      <motion.div 
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-black/5 to-black/10 blur-3xl mix-blend-overlay"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-gradient-to-l from-black/5 to-black/10 blur-3xl mix-blend-overlay"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Main content */}
      <motion.div 
        className="max-w-5xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div 
          className="flex flex-col items-center"
          variants={itemVariants}
        >
          {/* Subtle sparkle effect */}
          <div className="relative">
            <motion.div
              className="absolute -top-6 left-1/2 transform -translate-x-1/2"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <motion.div 
                className="text-black/30"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-serif text-charcoal mb-4 text-center relative z-10"
              variants={itemVariants}
              whileHover={{ letterSpacing: "0.02em" }}
              transition={{ duration: 0.5 }}
            >
              Ready to Experience Luxury?
            </motion.h2>
          </div>
          
          <motion.div 
            className="w-20 h-1 bg-black/20 mx-auto mb-8 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "5rem", opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
          
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-center max-w-2xl mb-12 text-lg"
          >
            Immerse yourself in a world of unparalleled comfort and sophistication. 
            Our luxury villas await your arrival.
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          variants={itemVariants}
        >
          {/* Book Your Stay button with enhanced animations */}
          <motion.div
            className="relative"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setIsHovered('book')}
            onHoverEnd={() => setIsHovered(null)}
            onMouseMove={handleMouseMove}
          >
            <motion.button 
              className="bg-black text-white py-4 px-8 rounded-lg shadow-lg relative overflow-hidden group z-10 min-w-[200px]"
              onClick={handleBookClick}
            >
              {/* Background light effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-black/40 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: isHovered === 'book' 
                    ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 60%)`
                    : ''
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered === 'book' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Particle effects */}
              <AnimatePresence>
                {isHovered === 'book' && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/70 rounded-full"
                        initial={{ 
                          x: mousePosition.x, 
                          y: mousePosition.y, 
                          scale: 0,
                          opacity: 0
                        }}
                        animate={{
                          x: mousePosition.x + (Math.random() * 100 - 50),
                          y: mousePosition.y + (Math.random() * -100),
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1 + Math.random(),
                          ease: "easeOut"
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={{
                          left: 0,
                          top: 0
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
              
              <span className="relative flex items-center justify-center gap-2 font-medium">
                <CalendarDays className="w-5 h-5" />
                <span>Book Your Stay</span>
                <motion.div
                  animate={{ 
                    x: isHovered === 'book' ? [0, 5, 0] : 0
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: isHovered === 'book' ? Infinity : 0,
                    repeatType: "loop"
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </span>
            </motion.button>
            
            {/* Shadow effect */}
            <motion.div
              className="absolute -inset-1 rounded-lg bg-black/20 blur-md -z-10 opacity-0"
              animate={{ 
                opacity: isHovered === 'book' ? 0.6 : 0,
                scale: isHovered === 'book' ? 1 : 0.95
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          {/* Contact Us button with subtle animations */}
          <motion.div
            className="relative"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setIsHovered('contact')}
            onHoverEnd={() => setIsHovered(null)}
          >
            <motion.button 
              className="bg-white border-2 border-black text-charcoal py-4 px-8 rounded-lg shadow-md relative overflow-hidden group z-10 min-w-[200px]"
              onClick={() => window.location.href = '/contact'}
            >
              {/* Subtle background animation */}
              <motion.div 
                className="absolute inset-0 bg-black/5 transform origin-left scale-x-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered === 'contact' ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              
              <span className="relative flex items-center justify-center gap-2 font-medium">
                <PhoneCall className="w-5 h-5" />
                <span>Contact Us</span>
              </span>
            </motion.button>
            
            {/* Subtle lifting shadow */}
            <motion.div
              className="absolute -inset-1 rounded-lg bg-black/5 blur-md -z-10 opacity-0"
              animate={{ 
                opacity: isHovered === 'contact' ? 0.3 : 0,
                y: isHovered === 'contact' ? 4 : 0,
                scale: isHovered === 'contact' ? 1 : 0.95
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="w-40 h-[1px] bg-black"></div>
          <div className="w-1 h-20 bg-black mx-auto"></div>
        </motion.div>
        
        {/* Floating badges/social proof */}
        <motion.div
          className="absolute -bottom-4 right-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-white/20 text-sm flex items-center gap-2"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Sparkles className="w-4 h-4 text-black" />
          </motion.div>
          <span className="text-gray-700">500+ satisfied guests</span>
        </motion.div>
      </motion.div>
      
      {/* Location Selection Popup */}
      <AnimatePresence>
        {showLocationPopup && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-serif text-gray-800">Select Your Location</h3>
                <button 
                  onClick={closePopup}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <motion.button
                    className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationClick('Chennai')}
                  >
                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-gray-700" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">Chennai</h4>
                    <p className="text-sm text-gray-500 mt-1 text-center">Explore our luxury villas in Chennai</p>
                  </motion.button>
                  
                  <motion.button
                    className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationClick('Pondicherry')}
                  >
                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-gray-700" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">Pondicherry</h4>
                    <p className="text-sm text-gray-500 mt-1 text-center">Discover beach-side villas in Pondicherry</p>
                  </motion.button>
                </div>
                
                <p className="mt-6 text-xs text-gray-400 text-center">
                  Select a location to browse our available luxury villas
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CallToAction;