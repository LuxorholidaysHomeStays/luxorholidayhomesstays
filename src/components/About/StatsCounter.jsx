
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiHome, FiUsers } from "react-icons/fi";
import { FaHandshake, FaRegStar } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";

// Extended stats with more detailed information
const stats = [
  { 
    title: "Villa Offers", 
    value: 50, 
    suffix: "+", 
    icon: <FiHome />, 
    description: "Luxurious properties across prime locations",
    color: "from-blue-400 to-purple-600"
  },
  { 
    title: "Happy Members", 
    value: 1200, 
    suffix: "+", 
    icon: <FiUsers />, 
    description: "Satisfied guests with 5-star experiences",
    color: "from-green-400 to-teal-600"
  },
  { 
    title: "Organization Tie-ups", 
    value: 30, 
    suffix: "+", 
    icon: <FaHandshake />,
    description: "Partnered with premium hospitality brands",
    color: "from-amber-400 to-orange-600" 
  },
];

// Floating particle component
const Particle = ({ delay, duration }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20"
      initial={{ 
        opacity: 0, 
        scale: 0,
        x: "50%", 
        y: "50%" 
      }}
      animate={{ 
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0],
        x: `${50 + (Math.random() * 100 - 50)}%`,
        y: `${50 + (Math.random() * 100 - 50)}%`,
      }}
      transition={{ 
        delay, 
        duration, 
        repeat: Infinity, 
        repeatType: "loop" 
      }}
      style={{ 
        width: Math.random() * 6 + 2, 
        height: Math.random() * 6 + 2,
      }}
    />
  );
};

// Card shimmer effect
const Shimmer = ({ isHovered }) => {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHovered ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="absolute h-[200%] w-[50px] bg-gradient-to-b from-transparent via-white/30 to-transparent -skew-x-12"
        initial={{ left: '-60%', opacity: 0 }}
        animate={{ left: '150%', opacity: isHovered ? 1 : 0 }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut", 
          repeatDelay: 0.5
        }}
      />
    </motion.div>
  );
};

// Main StatsCounter component
const StatsCounter = () => {
  const { ref, inView } = useInView({ 
    triggerOnce: false, 
    threshold: 0.2,
    rootMargin: "-50px 0px" 
  });
  
  const controls = useAnimation();
  const textControls = useAnimation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
      textControls.start("visible");
      setIsAnimating(true);
    } else {
      controls.start("hidden");
      textControls.start("hidden");
      setIsAnimating(false);
    }
  }, [inView, controls, textControls]);
  
  // Main container animation
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  // Stats card animation
  const cardVariants = {
    hidden: { 
      y: 50, 
      opacity: 0, 
      rotateX: 15,
      rotateY: -15,
      scale: 0.9
    },
    visible: {
      y: 0, 
      opacity: 1, 
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };
  
  // Title animation
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10,
        duration: 0.8 
      }
    }
  };
  
  // Underline animation
  const underlineVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "120px",
      transition: { 
        delay: 0.4,
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };
  
  // Function to generate particles for each card
  const renderParticles = (index) => {
    const isActive = hoveredIndex === index || !hoveredIndex;
    if (!isAnimating) return null;
    
    return Array.from({ length: 8 }).map((_, i) => (
      <Particle 
        key={`particle-${index}-${i}`} 
        delay={i * 0.3 + Math.random() * 2} 
        duration={2 + Math.random() * 3}
      />
    ));
  };

  return (
    <section
      ref={ref}
      className="w-full py-20 px-4 flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-white to-gray-100"
    >
      {/* Background subtle pattern */}
      <div 
        className="absolute inset-0 opacity-5" 
        // style={{ 
        //   backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
        //   backgroundSize: "20px 20px"
        // }}
      />
      
      {/* Animated glowing orbs in background */}
      <motion.div 
        className="absolute top-0 left-10 w-40 h-40 rounded-full bg-purple-300/30 blur-3xl" 
        animate={{ 
          x: [0, 20, 0], 
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-300/20 blur-3xl" 
        animate={{ 
          x: [0, -30, 0], 
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      {/* Section title with animated underline */}
      <motion.div 
        className="relative mb-16 text-center"
        initial="hidden"
        animate={textControls}
        variants={titleVariants}
      >
        <motion.h2 
          className="text-black text-3xl md:text-5xl font-serif mb-4 tracking-wide"
        >
          Our Performance Highlights
        </motion.h2>
        
        <motion.div 
          className="h-1 bg-gradient-to-r from-black/80 to-black/40 mx-auto rounded-full"
          variants={underlineVariants}
        />
        
        <motion.p 
          className="text-gray-600 mt-4 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Discover the impact of our luxury experience across properties, guests, and partnerships
        </motion.p>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-8 -left-8 text-black/20"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, repeatType: "reverse" }
          }}
        >
          <FaRegStar className="w-6 h-6 md:w-10 md:h-10" />
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-4 -right-4 text-black/20"
          animate={{ 
            rotate: [0, -360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }
          }}
        >
          <HiOutlineSparkles className="w-5 h-5 md:w-8 md:h-8" />
        </motion.div>
      </motion.div>

      {/* Stats grid with 3D card effect */}
      <motion.div 
        className="max-w-6xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden"
            variants={cardVariants}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              rotateX: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
          >
            <div 
              className={`
                relative h-full
                bg-gradient-to-br from-black to-gray-800
                rounded-3xl p-8 md:p-10
                text-white shadow-xl
                transform perspective-1000
                transition-all duration-500
                border border-white/10
                hover:border-white/30
                hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
              `}
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              {/* 3D floating effect elements */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 hover:opacity-10 transition-opacity duration-700 rounded-3xl`}
              ></div>
              
              <Shimmer isHovered={hoveredIndex === index} />
              
              {/* Icon with 3D pop effect */}
              <motion.div 
                className="text-5xl md:text-6xl mb-6 drop-shadow-md text-white relative"
                style={{ 
                  transformStyle: "preserve-3d",
                  transform: "translateZ(20px)"
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <div className={`
                  p-5 rounded-full inline-flex
                  bg-gradient-to-br ${stat.color} opacity-90
                  shadow-lg
                `}>
                  {stat.icon}
                </div>
                
                {/* Glow effect */}
                <motion.div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.color} opacity-40 blur-xl`}
                  animate={{ 
                    scale: hoveredIndex === index ? [1, 1.3, 1] : 1,
                    opacity: hoveredIndex === index ? [0.4, 0.6, 0.4] : 0.4
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </motion.div>
              
              {/* Animated counter */}
              <motion.div 
                className="relative mb-2"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="text-5xl md:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {inView ? (
                    <CountUp 
                      start={0}
                      end={stat.value} 
                      duration={2.5} 
                      suffix={stat.suffix}
                      useEasing={true}
                      enableScrollSpy
                      scrollSpyOnce={false}
                    />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>
                
                {/* Animated particles on count completion */}
                <div className="absolute inset-0 pointer-events-none">
                  {renderParticles(index)}
                </div>
              </motion.div>
              
              {/* Card title with 3D effect */}
              <motion.p 
                className="text-lg md:text-xl font-medium tracking-wide text-white mb-3"
                style={{ transform: "translateZ(20px)" }}
              >
                {stat.title}
              </motion.p>
              
              {/* Description with reveal animation */}
              <motion.div 
                className="text-sm text-gray-300 mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: hoveredIndex === index ? 1 : 0.7,
                  y: hoveredIndex === index ? 0 : 5
                }}
                transition={{ duration: 0.3 }}
                style={{ transform: "translateZ(15px)" }}
              >
                {stat.description}
              </motion.div>
              
              {/* Bottom decorative line */}
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ width: "30%" }}
                animate={{ 
                  width: hoveredIndex === index ? "100%" : "30%",
                  opacity: hoveredIndex === index ? 0.8 : 0.3
                }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Background pattern with parallax effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  opacity: 0.3
                }}
                animate={{ 
                  backgroundPosition: hoveredIndex === index ? "0px 10px" : "0px 0px"
                }}
                transition={{ duration: 0.8 }}
              />
            </div>
            
            {/* Card reflection/shadow effect */}
            <motion.div
              className="absolute w-full h-full top-0 left-0 -z-10 opacity-40 blur-sm"
              style={{ 
                background: `linear-gradient(to bottom, transparent, ${index === 0 ? '#7c3aed20' : index === 1 ? '#10b98120' : '#f59e0b20'})`,
                transform: 'rotateX(180deg) translateY(10px) scale(0.9,0.5)'
              }}
              animate={{
                opacity: hoveredIndex === index ? 0.6 : 0.4,
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Bottom decorative elements */}
      <motion.div 
        className="w-full max-w-6xl mx-auto mt-16 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: inView ? 1 : 0, scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 1 }}
      />
    </section>
  );
};

export default StatsCounter;