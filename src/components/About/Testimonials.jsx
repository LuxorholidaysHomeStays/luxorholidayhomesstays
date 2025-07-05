
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Star, Quote, Award, ChevronLeft, ChevronRight, Globe, X } from "lucide-react";

// Enhanced 3D particle component - lighter version
const Particle3D = ({ delay = 0 }) => {
  const [randomValues] = useState({
    size: Math.random() * 15 + 8,
    opacity: Math.random() * 0.08 + 0.03,
    posX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
    posY: Math.random() * 400,
    moveX: Math.random() * 150 - 75,
    moveY: Math.random() * -200 - 50,
    duration: Math.random() * 15 + 10,
    extraDelay: Math.random() * 3
  });
  
  return (
    <motion.div
      className="absolute rounded-full bg-black"
      style={{
        width: randomValues.size,
        height: randomValues.size,
        opacity: randomValues.opacity,
      }}
      initial={{
        x: randomValues.posX,
        y: randomValues.posY,
        scale: 0.3,
      }}
      animate={{
        y: [null, randomValues.posY + randomValues.moveY],
        x: [null, randomValues.posX + randomValues.moveX],
        opacity: [0, randomValues.opacity, 0],
      }}
      transition={{
        duration: randomValues.duration,
        delay: delay + randomValues.extraDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Star rating component with lighter animation
const StarRating = ({ rating, className = "" }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: i * 0.05,
          }}
          className="relative"
        >
          <Star
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-amber-500 text-amber-500"
                : i < rating
                ? "fill-amber-300 text-amber-300"
                : "fill-transparent text-gray-300"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Testimonials data
const testimonials = [
  {
    quote: "This villa is a hidden gem! The ambiance is simply magical and every detail speaks of luxury and elegance.",
    author: "Jane Doe",
    role: "Travel Blogger",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    awards: ["Best Stay 2022", "Top 10 Villas in Europe"],
    rating: 5,
  },
  {
    quote: "An unforgettable experience! The service was impeccable and every moment was crafted for pure relaxation.",
    author: "John Smith",
    role: "Luxury Traveler",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    awards: ["Traveler's Choice 2023"],
    rating: 5,
  },
  {
    quote: "A perfect getaway! I can't wait to return and experience the tranquility and opulence of this stunning property again.",
    author: "Emily Johnson",
    role: "Frequent Visitor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    awards: [],
    rating: 4.5,
  },
  {
    quote: "The attention to detail in this villa is extraordinary. Every corner reveals thoughtful design and luxurious comfort.",
    author: "Michael Chen",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    awards: ["Design Excellence Award"],
    rating: 5,
  },
  {
    quote: "From the stunning views to the exquisite furnishings, our stay was the epitome of luxury. Simply magnificent!",
    author: "Sophia Williams",
    role: "Celebrity Stylist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
    awards: ["Luxury Travel Award 2023"],
    rating: 5,
  },
];

// Duplicate for infinite scroll effect
const doubleTestimonials = [...testimonials, ...testimonials];

// Common irregular shape polygon for all testimonial cards
const cardShape = "polygon(0% 0%, 98% 0%, 100% 5%, 100% 95%, 98% 100%, 0% 100%, 2% 95%, 2% 5%)";

// Enhanced testimonial card with uniform shape and faster animations
const TestimonialCard = ({ testimonial, index, isActive, onClick }) => {
  const cardRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: index * 0.05, // Faster appearance
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 20px 30px rgba(0,0,0,0.1), 0 10px 15px rgba(0,0,0,0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative bg-gradient-to-br from-gray-900 to-black text-white rounded-lg p-6 flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[320px] cursor-pointer ${isActive ? "z-10" : ""}`}
      style={{
        clipPath: cardShape, // Using the same irregular shape for all cards
      }}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(index)}
    >
      {/* Pattern background */}
      <div className="absolute inset-0 opacity-20 rounded-lg" 
        style={{backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 1px, transparent 8px)"}} 
      />

      {/* Quote icon */}
      <div className="absolute -top-3 -right-3 text-white/10">
        <Quote className="w-14 h-14" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* User image */}
        <div className="absolute -top-10 -left-2 rounded-full overflow-hidden w-14 h-14 border-2 border-white shadow-lg">
          {testimonial.image && (
            <motion.img
              src={testimonial.image}
              alt={testimonial.author}
              className="w-full h-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        <div className="mt-6">
          {/* Quote text */}
          <div className="mb-4">
            <p className="italic text-base leading-relaxed text-white/90 line-clamp-3">
              "{testimonial.quote}"
            </p>
          </div>

          {/* Author info */}
          <div className="space-y-1">
            <p className="font-bold">{testimonial.author}</p>
            <p className="text-white/70 text-xs">{testimonial.role}</p>
            <StarRating rating={testimonial.rating} className="mt-1" />
          </div>

          {/* Awards */}
          {testimonial.awards.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {testimonial.awards.map((award, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold uppercase px-2 py-0.5 border border-white/50 rounded-full tracking-wide flex items-center gap-0.5"
                >
                  <Award className="w-2 h-2" />
                  {award}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Shine effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  transformOrigin: "left",
                  transform: "skewX(45deg) translateX(-100%)",
                  animation: "fastShine 1.2s ease-out",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-lg border-2 border-white/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        />
      )}
    </motion.div>
  );
};

// Main Testimonials component
const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const carouselRef = useRef(null);
  const controls = useAnimation();
  
  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Start animations immediately
    controls.start("visible");
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [controls]);

  // Handle testimonial card click
  const handleCardClick = (index) => {
    setActiveIndex(index);
    setSelectedTestimonial(testimonials[index % testimonials.length]);
    setIsModalOpen(true);
  };

  // Handle manual navigation
  const handleNavClick = (direction) => {
    if (!carouselRef.current) return;
    
    const scrollAmount = isSmallScreen ? 270 : 340; // Width of card + gap
    carouselRef.current.scrollLeft += direction * scrollAmount;
  };

  // CSS Keyframes and styles
  const cssStyles = `
    @keyframes fastScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    @keyframes fastShine {
      0% { transform: skewX(45deg) translateX(-150%); }
      100% { transform: skewX(45deg) translateX(250%); }
    }
    
    @keyframes floatLight {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(0, -8px); }
    }

    .testimonial-fast-scroll {
      animation: fastScroll 30s linear infinite;
    }
    
    .testimonial-fast-scroll-mobile {
      animation: fastScroll 15s linear infinite;
    }

    @media (max-width: 768px) {
      .testimonial-fast-scroll {
        animation-duration: 25s;
      }
    }

    @media (max-width: 640px) {
      .testimonial-fast-scroll {
        animation-duration: 20s;
      }
    }

    /* Disable animations for users who prefer reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .testimonial-fast-scroll, 
      .testimonial-fast-scroll-mobile {
        animation: none;
      }
    }
  `;

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white text-black overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      
      {/* Subtle particles background - reduced count for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <Particle3D key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Simple decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-r from-amber-200 to-red-200 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section heading */}
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-black tracking-wide relative inline-block">
            What Our Guests Say
            <motion.div
              className="absolute -bottom-2 left-0 h-[2px] bg-black"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </h2>
          
          <motion.p
            className="mt-4 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Discover what our distinguished guests have to say about their luxury experience
          </motion.p>
        </motion.div>

        {/* Navigation controls - visible on all screen sizes for better UX */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            onClick={() => handleNavClick(-1)}
            className="bg-black/5 hover:bg-black text-black hover:text-white rounded-full p-2 sm:p-3 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <motion.button
            onClick={() => handleNavClick(1)}
            className="bg-black/5 hover:bg-black text-black hover:text-white rounded-full p-2 sm:p-3 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        {/* Fast, light carousel */}
        <div 
          className="relative max-w-full mx-auto overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div
            ref={carouselRef}
            className={`flex gap-4 sm:gap-5 lg:gap-6 py-4 ${
              isSmallScreen ? "overflow-x-scroll scrollbar-hide" : "overflow-hidden"
            }`}
            style={{
              width: isSmallScreen ? "auto" : "200%",
              animation: isPaused || isSmallScreen ? "none" : "fastScroll 30s linear infinite",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Testimonial cards */}
            {(isSmallScreen ? testimonials : doubleTestimonials).map((testimonial, i) => (
              <TestimonialCard
                key={i}
                testimonial={testimonial}
                index={i}
                isActive={i === activeIndex}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>

        {/* Decorative floating element */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-30 hidden md:block"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Globe className="w-12 h-12" />
        </motion.div>
      </div>

      {/* Modal for detailed testimonial view */}
      <AnimatePresence>
        {isModalOpen && selectedTestimonial && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white relative rounded-lg overflow-hidden max-w-lg w-full"
              style={{ clipPath: cardShape }} // Using same irregular shape for modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-gray-900 to-black h-20" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    {selectedTestimonial.image && (
                      <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden">
                        <img
                          src={selectedTestimonial.image}
                          alt={selectedTestimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-bold">{selectedTestimonial.author}</h3>
                      <p className="text-gray-600">{selectedTestimonial.role}</p>
                    </div>
                  </div>
                  
                  <button
                    className="bg-black/5 hover:bg-black/10 rounded-full p-2"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <StarRating rating={selectedTestimonial.rating} className="mb-2" />
                  <p className="text-lg italic">"{selectedTestimonial.quote}"</p>
                </div>
                
                {selectedTestimonial.awards.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-sm mb-2">Awards:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTestimonial.awards.map((award, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold uppercase px-3 py-1 bg-black text-white rounded-full tracking-wider flex items-center gap-1"
                        >
                          <Award className="w-3 h-3" />
                          {award}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-black/5 p-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;