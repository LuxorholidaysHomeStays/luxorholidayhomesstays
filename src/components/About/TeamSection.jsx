

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import owner from '../../assets/About/owner.jpg';

// Custom shape for all cards for consistency
const CARD_SHAPE = "polygon(0% 0%, 97% 0%, 100% 7%, 100% 93%, 97% 100%, 0% 100%, 3% 93%, 3% 7%)";

// Team member component with enhanced animations
const TeamMember = ({ member, index, isInView }) => {
  const isEven = index % 2 === 0;
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: isEven ? -100 : 100,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: index * 0.2
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const imageVariants = {
    hidden: { grayscale: 1, filter: "brightness(0.8)" },
    visible: { grayscale: 1, filter: "brightness(0.8)" },
    hover: { 
      grayscale: 0, 
      filter: "brightness(1.1)",
      transition: { duration: 0.3 }
    }
  };

  const hoverGlowVariants = {
    hidden: { opacity: 0 },
    hover: { 
      opacity: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const socialVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: index * 0.2 + 0.5,
        staggerChildren: 0.1,
        delayChildren: index * 0.2 + 0.6 
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 15 }
    },
    hover: { 
      scale: 1.2, 
      y: -5,
      transition: { type: "spring", stiffness: 500, damping: 10 }
    }
  };

  const colorTransitions = {
    light: {
      background: "#ffffff",
      text: "#121212",
      secondary: "#444444"
    },
    dark: {
      background: "linear-gradient(145deg, #0f0f0f, #1a1a1a)",
      text: "#ffffff", 
      secondary: "#cccccc"
    }
  };

  const currentScheme = isHovered ? colorTransitions.light : colorTransitions.dark;

  return (
    <motion.div
      className="w-full sm:w-[85%] md:w-[80%] mx-auto relative"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8 rounded-2xl overflow-hidden relative"
        style={{ 
          clipPath: CARD_SHAPE,
          background: currentScheme.background,
          color: currentScheme.text,
          transition: "background 0.5s ease, color 0.5s ease",
        }}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/10 opacity-50"
          animate={{ opacity: isHovered ? 0 : 0.5 }}
          transition={{ duration: 0.5 }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/0 opacity-0"
          animate={{ opacity: isHovered ? 0.8 : 0 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Animated lines */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ 
            scaleX: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.8 : 0.3
          }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ 
            scaleX: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.8 : 0.3
          }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
        />

        {/* Image container with glow effect */}
        <div className="relative flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 rounded-full"
            variants={hoverGlowVariants}
            initial="hidden"
            animate={isHovered ? "hover" : "hidden"}
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          
          <motion.img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover rounded-full"
            variants={imageVariants}
            style={{ zIndex: 10 }}
            draggable="false"
          />
          
          {/* Highlight reflection */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
            animate={{ 
              opacity: isHovered ? 0.6 : 0.2,
              rotate: isHovered ? 45 : 0
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 z-10 text-center md:text-left">
          <motion.h3 
            className="text-2xl md:text-3xl font-semibold mb-1"
            animate={{ color: currentScheme.text }}
            transition={{ duration: 0.5 }}
          >
            {member.name}
          </motion.h3>
          
          <motion.p 
            className="text-sm font-light italic mb-3"
            animate={{ color: currentScheme.secondary }}
            transition={{ duration: 0.5 }}
          >
            {member.role}
          </motion.p>
          
          <motion.div
            className="w-12 h-0.5 mx-auto md:mx-0 mb-4"
            animate={{ 
              backgroundColor: currentScheme.text,
              width: isHovered ? "3rem" : "2rem"
            }}
            transition={{ duration: 0.5 }}
          />
          
          <motion.p 
            className="leading-relaxed max-w-md text-sm md:text-base"
            animate={{ color: currentScheme.secondary }}
            transition={{ duration: 0.5 }}
          >
            {member.funFact}
          </motion.p>
          
          {/* Social icons */}
          <motion.div 
            className="flex items-center gap-4 mt-6 justify-center md:justify-start"
            variants={socialVariants}
          >
            <motion.div variants={iconVariants} whileHover="hover">
              <FaEnvelope 
                size={20} 
                className="cursor-pointer hover:text-blue-400 transition-colors duration-300"
                style={{ color: isHovered ? "#3b82f6" : "#ffffff80" }} 
              />
            </motion.div>
            
            <motion.div variants={iconVariants} whileHover="hover">
              <FaPhone 
                size={20} 
                className="cursor-pointer hover:text-green-400 transition-colors duration-300" 
                style={{ color: isHovered ? "#22c55e" : "#ffffff80" }}
              />
            </motion.div>
            
            <motion.div variants={iconVariants} whileHover="hover">
              <FaLinkedin 
                size={20} 
                className="cursor-pointer hover:text-blue-600 transition-colors duration-300" 
                style={{ color: isHovered ? "#2563eb" : "#ffffff80" }}
              />
            </motion.div>
            
            <motion.div variants={iconVariants} whileHover="hover">
              <FaTwitter 
                size={20} 
                className="cursor-pointer hover:text-blue-400 transition-colors duration-300" 
                style={{ color: isHovered ? "#38bdf8" : "#ffffff80" }}
              />
            </motion.div>
            
            <motion.div variants={iconVariants} whileHover="hover">
              <FaInstagram 
                size={20} 
                className="cursor-pointer hover:text-pink-500 transition-colors duration-300" 
                style={{ color: isHovered ? "#ec4899" : "#ffffff80" }}
              />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Accent decoration */}
        <motion.div
          className="absolute -right-2 -top-2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-black to-gray-800"
          animate={{ 
            background: isHovered 
              ? "linear-gradient(135deg, #1a1a1a, #000000)" 
              : "linear-gradient(135deg, #ffffff20, #ffffff10)"
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-white"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full border-2 border-t-transparent border-white/20 border-b-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Main TeamSection component
const TeamSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const controls = useAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Villa Manager',
      funFact: 'John has over 10 years of experience in luxury hospitality. He is passionate about creating unique guest experiences and loves hiking in his free time.',
      photo: owner,
    },
    {
      name: 'Jane Smith',
      role: 'Head Chef',
      funFact: 'Jane trained in Italy and France before joining our team. She specializes in Mediterranean cuisine and sources ingredients from local organic farms.',
      photo: owner,
    },
    {
      name: 'Emily Johnson',
      role: 'Guest Relations',
      funFact: 'Emily speaks five languages and has traveled to over 30 countries. She enjoys gardening and creates beautiful floral arrangements for our villas.',
      photo: owner,
    },
    {
      name: 'Michael Brown',
      role: 'Concierge',
      funFact: 'Michael is an expert on local attractions and hidden gems. He previously worked as a tour guide and can recommend the perfect activities for any guest.',
      photo: owner,
    },
  ];
  
  // Handle carousel navigation
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  // Calculate visible team members based on screen size
  const visibleMembers = () => {
    // For mobile view, just show currentIndex
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return [currentIndex];
    }
    // For larger screens, show all members
    return teamMembers.map((_, i) => i);
  };

  // Background animation styles
  const backgroundStyle = `
    @keyframes gradientShift {
      0% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
      100% { background-position: 0% 0%; }
    }
    
    @keyframes floatLight {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
  `;

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-black py-16 md:py-24 px-4 overflow-hidden"
      style={{ 
        background: "linear-gradient(145deg, #000000, #0a0a0a, #111111, #0a0a0a)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: backgroundStyle }} />
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated dots */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{ 
              width: Math.random() * 6 + 2, 
              height: Math.random() * 6 + 2, 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Light sources */}
        <motion.div
          className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section heading */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Meet Our Team
          </motion.h2>
          
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-blue-500/80 to-purple-500/80 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          
          <motion.p 
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our dedicated staff ensures your stay is nothing short of extraordinary
          </motion.p>
        </motion.div>
        
        {/* Team members display */}
        <div className="relative">
          {/* Mobile navigation buttons */}
          <div className="md:hidden flex justify-between mb-8">
            <motion.button
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
          
          {/* Team carousel */}
          <div className="space-y-12 md:space-y-20">
            {visibleMembers().map(index => (
              <TeamMember
                key={index}
                member={teamMembers[index]}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
          
          {/* Mobile pagination dots */}
          <div className="flex justify-center space-x-2 mt-8 md:hidden">
            {teamMembers.map((_, i) => (
              <motion.button
                key={i}
                className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                onClick={() => setCurrentIndex(i)}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: i === currentIndex ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
        
        {/* Decorative element */}
        <motion.div 
          className="w-40 h-40 absolute -bottom-20 -right-20 opacity-20 pointer-events-none"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 100,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="#FFFFFF" 
              d="M42.7,-62.9C56.7,-55.1,70.4,-46.7,73.5,-34.9C76.5,-23.1,68.9,-7.9,65.3,8C61.7,23.8,62.2,40.3,55,52.3C47.9,64.3,33.1,71.8,17.9,74.1C2.8,76.3,-12.7,73.3,-27.2,67.9C-41.7,62.5,-55.1,54.8,-61.5,43.1C-67.9,31.5,-67.2,15.7,-66,0.7C-64.7,-14.3,-62.9,-28.5,-56.1,-39.8C-49.3,-51,-37.5,-59.2,-25.2,-67.3C-12.9,-75.4,0,-83.3,11.7,-79.7C23.4,-76.2,28.6,-70.7,42.7,-62.9Z" 
              transform="translate(100 100)" 
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;