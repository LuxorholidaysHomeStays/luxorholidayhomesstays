import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const MissionVision = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();

  useEffect(() => {
    if (isInView) {
      controlsLeft.start('visible');
      controlsRight.start('visible');
    }
  }, [isInView, controlsLeft, controlsRight]);

  const cardVariants = {
    hidden: (index) => ({
      opacity: 0,
      y: 50,
      x: index === 0 ? -50 : 50,
      rotateY: index === 0 ? -10 : 10,
    }),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateY: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  const backgroundVariants = {
    initial: {
      opacity: 0.05,
      scale: 1,
    },
    animate: {
      opacity: [0.05, 0.08, 0.05],
      scale: [1, 1.1, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  // Enhanced content for the cards
  const cards = [
    {
      title: 'Our Mission',
      text: 'To provide a serene and luxurious experience for our guests, surrounded by nature and comfort. We strive to create moments that transform into cherished memories.',
      icon: '✦',
      iconColor: 'from-blue-400 to-purple-500',
      bgPattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    },
    {
      title: 'Our Vision',
      text: 'To be the premier destination for relaxation and rejuvenation, where every guest feels at home. We aim to set new standards in luxury hospitality that inspire and delight.',
      icon: '✧',
      iconColor: 'from-amber-400 to-red-500',
      bgPattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    },
  ];

  return (
    <motion.div 
      ref={containerRef}
      className="relative flex justify-center items-center py-20 md:py-24 px-4 md:px-6 overflow-hidden"
      style={{ 
        background: "linear-gradient(to right bottom, #fafafa, #f5f5f5)" 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div 
          className="absolute right-0 top-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-30 blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 opacity-30 blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl w-full z-10">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            variants={cardVariants}
            initial="hidden"
            animate={idx === 0 ? controlsLeft : controlsRight}
            className={`
              relative bg-white rounded-2xl
              border border-gray-100
              overflow-hidden
              shadow-lg hover:shadow-2xl
              transition-all duration-500 ease-out
              ${hoveredCard === idx ? 'z-20' : 'z-10'}
            `}
            style={{
              perspective: '1500px',
              transformStyle: 'preserve-3d',
            }}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseMove={(e) => {
              if (hoveredCard !== idx) return;

              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;

              const rotateX = ((y - centerY) / centerY) * 6;
              const rotateY = ((centerX - x) / centerX) * 6;

              el.style.transform = `
                perspective(1500px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)
                scale(1.02)
              `;
            }}
            onMouseLeave={(e) => {
              setHoveredCard(null);
              const el = e.currentTarget;
              el.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
              el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
            }}
          >
            {/* Background pattern */}
            <div 
              className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: card.bgPattern }}
            />
            
            {/* Card content */}
            <div className="flex flex-col h-full relative p-8 md:p-10">
              {/* Background decorative icon */}
              <motion.div
                variants={backgroundVariants}
                initial="initial"
                animate="animate"
                className="absolute -top-10 -right-10 text-8xl pointer-events-none"
              >
                <span className={`bg-gradient-to-br ${card.iconColor} opacity-10 blur-sm text-transparent bg-clip-text`}>
                  {card.icon}
                </span>
              </motion.div>

              {/* Header section */}
              <div className="relative z-10">
                {/* Icon tag */}
                <motion.div
                  className="inline-flex items-center mb-6 px-4 py-1.5 rounded-full bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <span className={`text-lg bg-gradient-to-r ${card.iconColor} text-transparent bg-clip-text mr-2`}>
                    {card.icon}
                  </span>
                  <span className="text-sm font-medium tracking-wider text-gray-700">
                    {idx === 0 ? 'MISSION' : 'VISION'}
                  </span>
                </motion.div>

                {/* Title with animation */}
                <motion.h2
                  className="text-3xl md:text-4xl font-serif mb-4"
                  animate={{ 
                    y: hoveredCard === idx ? -2 : 0,
                    color: hoveredCard === idx ? '#1a1a1a' : '#2c2c2c',
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {card.title}
                </motion.h2>

                {/* Animated underline */}
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 mb-6"
                  animate={{ 
                    width: hoveredCard === idx ? '80px' : '50px',
                    background: hoveredCard === idx 
                      ? `linear-gradient(to right, ${idx === 0 ? '#60a5fa, #8b5cf6' : '#fbbf24, #ef4444'})`
                      : 'linear-gradient(to right, #d1d5db, #9ca3af)',
                  }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>

              {/* Card text content */}
              <motion.p
                className="text-base md:text-lg leading-relaxed text-gray-600 relative z-10"
                animate={{ 
                  opacity: hoveredCard === idx ? 1 : 0.9,
                  y: hoveredCard === idx ? 0 : 2,
                }}
                transition={{ duration: 0.5 }}
              >
                {card.text}
              </motion.p>

              {/* Additional decorative elements visible on hover */}
              <motion.div
                className="absolute bottom-6 right-6 opacity-0"
                animate={{ 
                  opacity: hoveredCard === idx ? 0.8 : 0,
                  scale: hoveredCard === idx ? 1 : 0.8,
                  rotate: hoveredCard === idx ? 0 : 45,
                }}
                transition={{ duration: 0.6 }}
              >
                <div className={`text-2xl bg-gradient-to-r ${card.iconColor} text-transparent bg-clip-text`}>
                  {card.icon}
                </div>
              </motion.div>

              {/* Corner accent */}
              <motion.div 
                className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none"
                animate={{ 
                  opacity: hoveredCard === idx ? 0.1 : 0.05,
                  scale: hoveredCard === idx ? 1.1 : 1,
                }}
                transition={{ duration: 0.8 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-tl ${card.iconColor} rounded-tl-full opacity-40`} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MissionVision;