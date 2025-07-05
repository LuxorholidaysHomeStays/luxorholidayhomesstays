
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import backgroundVideo from '../../assets/About/v.mp4';

const HeroSection = () => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isExploreHovered, setIsExploreHovered] = useState(false);
  const [isScrollIndicatorHovered, setIsScrollIndicatorHovered] = useState(false);
  
  // Generate particles for ambient effect
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5
  }));

  useEffect(() => {
    AOS.init({ 
      duration: 1500, 
      once: false, 
      mirror: true,
      easing: 'ease-out-cubic' 
    });
    
    setTimeout(() => setIsLoaded(true), 200);

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({ x, y });

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 6 * -1;
      const rotateY = ((x - centerX) / centerX) * 6;

      setTilt({ rotateX, rotateY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseLeave = () => {
      setTilt({ rotateX: 0, rotateY: 0 });
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('mousemove', handleMouseMove);
      node.addEventListener('mouseleave', handleMouseLeave);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (node) {
        node.removeEventListener('mousemove', handleMouseMove);
        node.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle scroll down when mouse indicator is clicked
  const handleScrollDown = () => {
    const windowHeight = window.innerHeight;
    window.scrollTo({
      top: windowHeight,
      behavior: 'smooth'
    });
  };

  // Text reveal animation variants
  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const textItem = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ perspective: '1600px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient floating particles */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/30"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.3)"
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * -150],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Video Background with parallax effect */}
      <motion.video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ease-out`}
        style={{
          opacity: isLoaded ? 1 : 0,
          filter: 'brightness(1.2) saturate(1.4)',
          transformOrigin: 'center center',
          transform: `scale(1.05) rotateX(${tilt.rotateX / 3}deg) rotateY(${tilt.rotateY / 3}deg)`,
          willChange: 'transform',
          pointerEvents: 'none',
          zIndex: 10,
        }}
        animate={{
          scale: [1.05, 1.08, 1.05],
          transition: { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }}
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Overlay with parallax effect */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          filter: 'grayscale(80%) brightness(0.7)',
          transition: 'filter 0.5s ease',
        }}
      >
        {/* Dynamic gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.75), rgba(15,15,20,0.9))',
            zIndex: 20,
          }}
          animate={{
            backgroundImage: isHovered 
              ? 'linear-gradient(135deg, rgba(0,0,0,0.65), rgba(15,15,20,0.85))' 
              : 'linear-gradient(135deg, rgba(0,0,0,0.75), rgba(15,15,20,0.9))'
          }}
          transition={{ duration: 1.2 }}
        />

        {/* Parallax shimmer/glow that follows mouse */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent 70%)',
            mixBlendMode: 'screen',
            zIndex: 25,
          }}
          animate={{
            backgroundPosition: `${mousePosition.x / 10}px ${mousePosition.y / 10}px`
          }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
        />
        
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23fff\' opacity=\'.2\'/%3E%3C/svg%3E")',
            opacity: 0.2,
            zIndex: 30
          }}
        />
        
        {/* Animated light beam effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            zIndex: 35,
          }}
          animate={{
            backgroundPosition: ['200% 0%', '-100% 100%'],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 15,
            ease: "linear"
          }}
        />
      </div>

      {/* Content with advanced animations */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-50">
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute -top-24 left-1/2 w-40 h-40 -translate-x-1/2 opacity-30 pointer-events-none"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="rgba(255, 255, 255, 0.5)" d="M47.1,-57.8C61.3,-48.3,73.5,-33.9,77.2,-17.3C80.9,-0.7,76,18.1,67.2,33.7C58.4,49.3,45.6,61.8,29.8,69.6C13.9,77.4,-5,80.5,-20.9,74.7C-36.8,68.9,-49.8,54.2,-61.5,38C-73.3,21.9,-84,4.4,-82.1,-12C-80.1,-28.4,-65.5,-43.6,-49.6,-52.9C-33.8,-62.2,-16.9,-65.6,-0.1,-65.4C16.7,-65.3,33.5,-67.1,47.1,-57.8Z" transform="translate(100 100)" />
            </svg>
          </motion.div>

          <motion.h1
            className="text-white font-serif tracking-wide leading-tight drop-shadow-xl"
          >
            <motion.span 
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
              variants={textItem}
            >
              Experience
            </motion.span>
            
            <motion.div
              className="relative inline-block"
              variants={textItem}
            >
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mt-1 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-100">
                Luxury Living
              </span>
              
              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1.2 }}
              />
            </motion.div>
          </motion.h1>

          <motion.p 
            className="mt-8 max-w-xl mx-auto text-gray-100 text-lg sm:text-xl md:text-2xl drop-shadow-lg font-light tracking-wide"
            variants={textItem}
          >
            Step inside your dream villa with panoramic views and serene ambiance.
          </motion.p>

          {/* Button with hover effects */}
          <motion.div
            variants={textItem}
            className="mt-12"
          >
            <motion.div className="relative inline-block">
              {/* Button glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-white/20 blur-xl"
                animate={{ 
                  scale: isExploreHovered ? [1, 1.5, 1.2] : 1,
                  opacity: isExploreHovered ? 0.6 : 0
                }}
                transition={{ duration: 1, repeat: isExploreHovered ? Infinity : 0 }}
              />
              
              <button
                className="relative px-10 py-5 rounded-full text-white font-medium uppercase tracking-widest overflow-hidden group"
                onClick={() => alert('Explore Villas')}
                onMouseEnter={() => setIsExploreHovered(true)}
                onMouseLeave={() => setIsExploreHovered(false)}
              >
                {/* Button background with animated gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"
                  animate={{
                    backgroundPosition: isExploreHovered ? ['0% 0%', '100% 100%'] : '0% 0%'
                  }}
                  transition={{
                    duration: 3,
                    repeat: isExploreHovered ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Shine effect */}
                <motion.div 
                  className="absolute inset-0 w-[20px] h-full bg-white/20 skew-x-12"
                  initial={{ left: '-100%' }}
                  animate={{ 
                    left: isExploreHovered ? ['100%', '-100%'] : '-100%' 
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: isExploreHovered ? Infinity : 0, 
                    repeatDelay: 0.5
                  }}
                />
                
                {/* Button text with reveal effect */}
                <div className="relative flex items-center justify-center space-x-2">
                  <span>Explore Now</span>
                  <motion.span
                    animate={{ x: isExploreHovered ? [0, 4, 0] : 0 }}
                    transition={{ 
                      duration: 1, 
                      repeat: isExploreHovered ? Infinity : 0,
                      repeatType: "reverse",
                      type: "tween"
                    }}
                  >
                    →
                  </motion.span>
                </div>
                
                {/* Button border */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/30"
                  animate={{ 
                    opacity: isExploreHovered ? 1 : 0.3,
                    scale: isExploreHovered ? [1, 1.05, 1] : 1
                  }}
                  transition={{ duration: 1, repeat: isExploreHovered ? Infinity : 0 }}
                />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom glass panel with info */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10 z-50 py-4 px-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isLoaded ? 0 : 100, 
          opacity: isLoaded ? 1 : 0 
        }}
        transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs sm:text-sm text-white/70">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Available for booking</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <span>Premium Experience</span>
            <span>24/7 Concierge</span>
            <span>Exclusive Access</span>
          </div>
          
          <motion.div 
            className="hidden sm:block"
            whileHover={{ scale: 1.05 }}
          >
            <span className="cursor-pointer hover:text-white transition-colors">Discover More →</span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Interactive mouse scroll indicator - Position adjusted to be lower */}
      <motion.div 
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 text-white cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: [0.7, 1, 0.7], 
          y: isScrollIndicatorHovered ? -5 : 0
        }}
        transition={{ 
          opacity: { duration: 2, repeat: Infinity },
          y: { duration: 0.3 }
        }}
        onClick={handleScrollDown}
        onMouseEnter={() => setIsScrollIndicatorHovered(true)}
        onMouseLeave={() => setIsScrollIndicatorHovered(false)}
      >
        <div className="flex flex-col items-center scale-75">
          <motion.span 
            className="text-xs font-light tracking-wider mb-1 opacity-70"
            animate={{ opacity: isScrollIndicatorHovered ? 1 : 0.7 }}
          >
            SCROLL
          </motion.span>
          
          <motion.div 
            className={`w-5 h-8 border-2 ${isScrollIndicatorHovered ? 'border-white' : 'border-white/30'} rounded-full flex justify-center pt-1.5 transition-colors duration-300`}
          >
            <motion.div 
              className="w-1 h-1.5 bg-white rounded-full"
              animate={{ 
                y: [0, 4, 0],
                opacity: isScrollIndicatorHovered ? 1 : 0.7
              }}
              transition={{ 
                y: { duration: 1.5, repeat: Infinity },
                opacity: { duration: 0.3 }
              }}
            />
          </motion.div>
          
          <motion.svg 
            width="12" 
            height="12" 
            viewBox="0 0 16 16" 
            className="mt-1 opacity-70"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              y: isScrollIndicatorHovered ? [0, 3, 0] : 0,
              opacity: isScrollIndicatorHovered ? 1 : 0.7
            }}
            transition={{ 
              y: { duration: 1, repeat: isScrollIndicatorHovered ? Infinity : 0 },
              opacity: { duration: 0.3 }
            }}
          >
            <path 
              d="M7.99999 11.0001L3.99999 7.00006L5.05999 5.94006L7.99999 8.88006L10.94 5.94006L12 7.00006L7.99999 11.0001Z" 
              fill="white" 
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Animated graphics and keyframes */}
      <style jsx>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(-45deg); }
          100% { transform: translateX(200%) rotate(-45deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;