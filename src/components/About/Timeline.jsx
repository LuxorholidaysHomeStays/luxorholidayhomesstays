
import React, { useEffect, useRef, useState } from 'react';
import { FaBuilding, FaBusinessTime, FaCertificate, FaUsers } from 'react-icons/fa';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

const milestones = [
  {
    date: 'April 1, 2024',
    text: 'Business Incorporation',
    icon: <FaBuilding size={28} />,
    bgImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', // business-themed
    description: 'Luxor Holiday Home Stays was officially registered as a business entity under UDYAM certification.'
  },
  {
    date: 'April 1, 2024',
    text: 'Commencement of Business',
    icon: <FaBusinessTime size={28} />,
    bgImage:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', // business operations themed
    description: 'We officially began our business operations, opening our doors to welcome guests to our luxury accommodations.'
  },
  {
    date: 'February 17, 2025',
    text: 'Udyam Certificate Issued',
    icon: <FaCertificate size={28} />,
    bgImage:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', // certificate-themed
    description: 'Our official Udyam certificate was issued, recognizing Luxor Holiday Home Stays as a Micro Enterprise in the Accommodation and Hospitality sector.'
  },
  {
    date: 'Present Day',
    text: 'Growing Team of Professionals',
    icon: <FaUsers size={28} />,
    bgImage:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80', // team-themed
    description: 'Today, we proudly employ a dedicated team of 8 professionals (6 male and 2 female staff) committed to providing exceptional service to our guests.'
  },
];

const Timeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect for background elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  useEffect(() => {
    // Add 3D perspective to the container
    const container = containerRef.current;
    if (container) {
      container.style.perspective = '1000px';
    }
  }, []);

  // Create floating particles in background
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-black bg-opacity-5 backdrop-blur-sm"
            style={{
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 60 - 30],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="relative py-20 min-h-screen bg-gradient-to-b from-white to-gray-100 overflow-hidden select-none"
    >
      <Particles />

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,220,255,0.3),transparent_70%)]"
        style={{ y: backgroundY }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 px-4 sm:px-6 mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-black text-center tracking-wide drop-shadow-sm mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700">
            Our Journey
          </span>
        </h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm p-5 md:p-6 rounded-xl shadow-md border border-gray-100"
        >
          <h3 className="text-xl font-medium text-gray-800 mb-3 text-center md:text-left">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Business Name:</span> Luxor Holiday Home Stays</p>
              <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Owner:</span> Gunaseelan</p>
              <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Enterprise Type:</span> Micro</p>
              <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Registered as:</span> Proprietorship</p>
            </div>
            <div>
              <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Major Activity:</span> Services</p>
              <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Social Category:</span> OBC</p>
              <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Employees:</span> 8 (6 Male, 2 Female)</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-gray-700 text-sm md:text-base"><span className="font-medium">Address:</span> 6/181, Dargah Road, Kovalam Main Road, Kovalam Village, 
              Thiruporur Taluk, Chengalpattu, Tamil Nadu – 603112</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Animated vertical timeline line */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 transform -translate-x-1/2 w-[3px] bg-gradient-to-b from-black/5 via-black/20 to-black/5 rounded"
        ></motion.div>

        {milestones.map((m, i) => {
          const isLeft = i % 2 === 0;
          
          return (
            <MilestoneItem 
              key={i} 
              milestone={m} 
              isLeft={isLeft} 
              index={i} 
            />
          );
        })}
      </div>
    </div>
  );
};

// Separate component for each milestone for better animation control
const MilestoneItem = ({ milestone, isLeft, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: isLeft ? 50 : -50,
      rotateY: isLeft ? -10 : 10
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: { 
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260,
        damping: 20,
        delay: 0.4 + index * 0.1
      }
    }
  };
  
  // Industry codes (only shown for certificate milestone)
  const industryCodes = index === 2 ? [
    { code: "55109", name: "Accommodation (Holiday Homes / Private Guest Houses)" },
    { code: "56101", name: "Restaurants without Bars" },
    { code: "56210", name: "Event Catering" },
    { code: "79900", name: "Travel Services" }
  ] : null;

  return (
    <div
      ref={ref}
      className={`mb-24 md:mb-20 flex flex-col md:flex-row justify-between items-center w-full relative
        ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Content box with background image */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full md:w-5/12 p-6 md:p-8 rounded-[2rem] border border-black/10 shadow-lg backdrop-blur-sm
          text-${isLeft ? 'right' : 'left'} relative cursor-pointer
          transition-all duration-500 ease-out hover:shadow-xl
          hover:[transform:perspective(1000px)_rotateY(${isLeft ? '-' : ''}5deg)]
          group`}
        style={{
          backgroundImage: `url(${milestone.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Animated overlay for subtle text readability */}
        <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 rounded-[2rem] pointer-events-none
          transition-all duration-500 backdrop-filter backdrop-blur-[2px] group-hover:backdrop-blur-[1px]"></div>

        {/* Text content */}
        <div className="relative z-10">
          <p className="text-gray-700 text-sm font-mono mb-2 md:mb-3">{milestone.date}</p>
          <p className="text-black font-semibold text-xl md:text-2xl leading-relaxed mb-3">{milestone.text}</p>
          
          {/* Description or industry codes */}
          <AnimatePresence mode="wait">
            {index === 2 && isHovered ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-black/5 mt-2 hidden md:block"
              >
                <p className="text-black font-semibold text-sm mb-1">Industry Codes:</p>
                <ul className="space-y-1">
                  {industryCodes.map((industry, idx) => (
                    <li key={idx} className="text-gray-800 text-xs flex items-start">
                      <span className="font-medium mr-1">{industry.code}</span>
                      <span>- {industry.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-black/80 text-sm md:text-base leading-relaxed hidden md:block"
              >
                {milestone.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Icon circle */}
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="absolute top-8 md:top-auto left-1/2 transform -translate-x-1/2 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center
          bg-gradient-to-br from-gray-100 to-white backdrop-blur-md shadow-lg cursor-pointer z-20
          transition-transform duration-300 hover:scale-125 hover:shadow-xl"
        style={{
          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        }}
      >
        <div className="text-black z-10 drop-shadow-md">{milestone.icon}</div>
      </motion.div>
      
      {/* Date indicator and info for mobile */}
      <div className="md:hidden space-y-2 text-center py-3">
        <div className="text-lg font-bold">{milestone.date}</div>
        
        {index === 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-black/5 mx-3 mt-2"
          >
            <p className="text-black font-semibold text-sm mb-2">Industry Codes:</p>
            <ul className="space-y-2 text-left">
              {industryCodes && industryCodes.map((industry, idx) => (
                <li key={idx} className="text-gray-800 text-xs flex items-start">
                  <span className="font-medium min-w-[55px] mr-1">{industry.code}</span>
                  <span>- {industry.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Timeline;