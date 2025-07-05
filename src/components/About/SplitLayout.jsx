
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUsers, FaGift, FaHeart, FaAngleDown, FaMapMarkerAlt, FaRegClock, FaRegStar } from "react-icons/fa";
import villaImage from "../../assets/About/anandvilla1.jpg";

const SplitLayout = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);
  const translateY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);

  useEffect(() => {
    AOS.init({ 
      duration: 1200, 
      once: false, 
      easing: "ease-in-out",
      mirror: true 
    });
    
    // Create parallax effect on scroll
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollPosition = window.scrollY;
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      if (scrollPosition + windowHeight > containerTop && 
          scrollPosition < containerTop + containerHeight) {
        const parallaxValue = (scrollPosition - containerTop + windowHeight) * 0.1;
        containerRef.current.style.setProperty('--scroll-parallax', `${parallaxValue}px`);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const iconAnimationVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { 
      scale: [0.8, 1.1, 1],
      opacity: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="flex flex-col lg:flex-row min-h-[700px] relative bg-gradient-to-b from-white to-gray-50 text-black overflow-hidden"
      style={{ 
        opacity, 
        scale,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-gray-200/30 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-l from-gray-200/40 to-transparent rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>
      
      {/* Pattern overlay - Fixed SVG URL syntax */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'%3E%3C/path%3E%3Cpath d='M10 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' fill='%23000000'%3E%3C/path%3E%3C/svg%3E")`
      }}></div>
      
      {/* Image side with advanced effects */}
      <motion.div 
        className="lg:w-1/2 relative overflow-hidden min-h-[500px]"
        style={{ y: translateY }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            filter: isHovered ? "brightness(1.1) saturate(1.2)" : "brightness(0.95) saturate(1)"
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <img
            src={villaImage}
            alt="Luxurious Villa with Pool at Night"
            className="w-full h-full object-cover transition-all duration-1000"
            style={{ 
              transformStyle: "preserve-3d",
              objectPosition: "center center"
            }}
          />
          
          {/* Multi-layered overlays optimized for night pool image */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-blue-900/10 pointer-events-none mix-blend-soft-light"
            variants={overlayVariants}
            initial="hidden"
            animate={isHovered ? "hidden" : "visible"}
          />
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-cyan-400/10 pointer-events-none mix-blend-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          />
        </motion.div>
        
        {/* Floating info badge */}
        <motion.div 
          className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-4 z-20 border border-gray-100"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-black rounded-full p-2 flex items-center justify-center">
              <FaMapMarkerAlt className="text-white text-sm" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Private Pool Villa</h3>
              <p className="text-xs text-gray-600">Premium Luxury Experience</p>
            </div>
          </div>
        </motion.div>
        
        {/* Experience badges */}
        <motion.div
          className="absolute top-6 right-6 flex flex-col space-y-4 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <FeatureBadge icon={<FaRegClock />} text="24/7 Support" />
          <FeatureBadge icon={<FaRegStar />} text="Premium Service" />
        </motion.div>
      </motion.div>

      {/* Text content side with improved layout */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white/80 backdrop-blur-sm shadow-lg relative z-10 space-y-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-serif tracking-wide text-gray-900 mb-6 border-b pb-4 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm text-gray-500 uppercase block mb-1 tracking-[0.3em]">About</span>
          Discover Our Excellence
          <motion.span 
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-black to-gray-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "30%" }}
            transition={{ delay: 1, duration: 0.8 }}
          />
        </motion.h1>
        
        <motion.div 
          className="grid gap-6 md:gap-8"
          style={{ y: translateY }}
        >
          <AnimatePresence>
            <ContentBlock
              key="who"
              icon={<FaUsers />}
              title="WHO WE ARE"
              text="We are a team of dedicated professionals committed to excellence and innovation, establishing new standards in luxury villa experiences and personalized hospitality."
              aos="fade-left"
              delay={150}
              isActive={activeCard === 'who'}
              setActive={() => setActiveCard(activeCard === 'who' ? null : 'who')}
              index={1}
            />
            <ContentBlock
              key="what"
              icon={<FaGift />}
              title="WHAT WE OFFER"
              text="Offering bespoke services designed to meet your unique needs with perfection, from personalized concierge to tailored experiences that create unforgettable memories."
              aos="fade-left"
              delay={350}
              isActive={activeCard === 'what'}
              setActive={() => setActiveCard(activeCard === 'what' ? null : 'what')}
              index={2}
            />
            <ContentBlock
              key="why"
              icon={<FaHeart />}
              title="WHY GUESTS LOVE US"
              text="Our guests appreciate our attention to detail, warmth, and exceptional quality. We pride ourselves on creating experiences that exceed expectations and foster lasting connections."
              aos="fade-left"
              delay={550}
              isActive={activeCard === 'why'}
              setActive={() => setActiveCard(activeCard === 'why' ? null : 'why')}
              index={3}
            />
          </AnimatePresence>
        </motion.div>
        
        {/* Call to action */}
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.button 
            className="group flex items-center space-x-2 text-sm font-medium text-black border-b border-black pb-1 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Discover more about us</span>
            <motion.span 
              className="inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center flex-col cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        onClick={() => {
          const nextSection = containerRef.current.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <span className="text-xs uppercase tracking-widest text-gray-500 mb-2">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <FaAngleDown className="text-gray-400" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ContentBlock = ({ icon, title, text, aos, delay, isActive, setActive, index }) => {
  return (
    <motion.div
      className={`
        group rounded-2xl p-6 lg:p-8 border bg-white shadow-lg
        transform-gpu transition-all duration-500
        relative overflow-hidden
        ${isActive 
          ? "border-black/30 shadow-xl bg-white scale-[1.02] z-20" 
          : "border-black/5 hover:border-black/20 hover:shadow-lg hover:scale-[1.01]"}
      `}
      onClick={setActive}
      data-aos={aos}
      data-aos-delay={delay}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        layout: { duration: 0.3, type: "spring" }
      }}
    >
      {/* Background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-70 pointer-events-none" 
        animate={{ 
          background: isActive 
            ? "linear-gradient(to bottom right, rgb(245, 245, 245), white, rgb(240, 240, 240))"
            : "linear-gradient(to bottom right, white, rgb(250, 250, 250))"
        }}
      />
      
      {/* Shine effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ 
          transformOrigin: "0% 100%", 
          rotate: "25deg", 
          width: "150%", 
          height: "150%",
          top: "-25%",
          left: "-25%"
        }}
        animate={{ 
          left: isActive ? ["-120%", "120%"] : "120%" 
        }}
        transition={{ 
          duration: isActive ? 1.2 : 0,
          ease: "easeInOut",
          repeat: isActive ? Infinity : 0,
          repeatDelay: 2
        }}
      />
      
      <div className="flex flex-col items-center lg:flex-row lg:items-start text-center lg:text-left z-10 relative">
        {/* Animated icon */}
        <motion.div 
          className={`
            flex items-center justify-center w-14 h-14 rounded-full
            ${isActive ? "bg-black text-white" : "bg-gray-100 text-black"} 
            shadow-md mb-4 lg:mb-0 lg:mr-5 overflow-hidden
            transition-colors duration-300
          `}
          whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            variants={{
              idle: { scale: 1 },
              active: { 
                scale: [1, 1.2, 1],
                transition: { 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }
              }
            }}
            initial="idle"
            animate={isActive ? "active" : "idle"}
            className="text-2xl"
          >
            {icon}
          </motion.div>
        </motion.div>
        
        <div>
          <div className="flex items-center justify-center lg:justify-start mb-3">
            <h2 className="text-black font-serif text-xl md:text-2xl uppercase tracking-wider relative">
              {title}
            </h2>
            <motion.div
              animate={{ rotate: isActive ? 180 : 0 }}
              className="ml-2 text-xs opacity-70"
            >
              <FaAngleDown />
            </motion.div>
          </div>
          
          <motion.div
            className="relative overflow-hidden"
            initial={{ height: "auto" }}
            animate={{ height: isActive ? "auto" : "65px" }}
          >
            <motion.span 
              className="block h-1 w-12 bg-black/80 mb-4 rounded-full transition-all duration-300 group-hover:w-20"
              style={{ marginLeft: isActive ? 0 : "auto", marginRight: isActive ? 0 : "auto" }}
            />
            <p className="text-gray-700 leading-relaxed font-light">{text}</p>
            
            {!isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
            )}
          </motion.div>
          
          {isActive && (
            <motion.div
              className="mt-4 flex items-center justify-center lg:justify-start text-black/70 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="mr-2">Learn more</span>
              <span>→</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FeatureBadge = ({ icon, text }) => (
  <motion.div 
    className="bg-white/90 backdrop-blur-md shadow-lg rounded-full py-2 px-4 flex items-center space-x-2"
    whileHover={{ scale: 1.05, y: -3 }}
  >
    <span className="text-black/80 text-xs">{icon}</span>
    <span className="text-xs font-medium">{text}</span>
  </motion.div>
);

export default SplitLayout;