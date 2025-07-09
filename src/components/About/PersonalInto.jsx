import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import owner from '../../assets/About/owner.jpg';

const PersonalIntro = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isTextHovered, setIsTextHovered] = useState(false);
    const componentRef = useRef(null);
    const imageRef = useRef(null);
    
    // For parallax scroll effect
    const { scrollYProgress } = useScroll({
        target: componentRef,
        offset: ["start end", "end start"]
    });
    
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.98]);

    // Mouse parallax effect for image
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    const handleMouseMove = (e) => {
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            setMousePosition({ x, y });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    // Floating animation variants
    const floatingAnimation = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div 
            ref={componentRef}
            className="relative flex flex-col md:flex-row items-center py-24 px-4 md:px-12 lg:px-20 overflow-hidden"
            style={{
                background: "linear-gradient(to bottom right, #ffffff, #f8f9fa)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Animated background elements */}
            <motion.div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ y: backgroundY }}
            >
                {/* Abstract shapes */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute opacity-5"
                        style={{
                            width: `${Math.random() * 300 + 100}px`,
                            height: `${Math.random() * 300 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: Math.random() * 30 + 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#2C2C2C" d={[
                                "M42.8,-57.2C55.9,-49.4,67.2,-37.5,73.8,-22.6C80.4,-7.7,82.3,10.3,76.5,25.3C70.7,40.2,57.2,52.2,42.3,59.7C27.4,67.3,11.2,70.3,-3.4,74.8C-18,79.3,-31,85.3,-44.2,81.5C-57.4,77.8,-70.7,64.2,-75.6,48.2C-80.6,32.1,-77.3,13.6,-74.2,-4.2C-71,-21.9,-68,-38.9,-58.1,-48.7C-48.2,-58.4,-31.3,-60.9,-16.3,-66.9C-1.2,-72.9,12.8,-82.3,25.8,-78.8C38.9,-75.3,50.2,-58.8,54.8,-48.8C59.4,-38.7,56.5,-35.2,56.4,-28.8C56.4,-22.4,59.2,-13.2,62,-3.4L66.3,3.3L53.2,9.8Z",
                                "M39.9,-65.7C51.1,-58.5,59.2,-46.4,63.8,-33.4C68.4,-20.4,69.3,-6.5,66.9,6.4C64.5,19.3,58.7,31.3,50.3,40.8C41.9,50.4,31,57.5,18.5,62.9C6,68.4,-8,72.2,-21.1,69.9C-34.2,67.5,-46.3,59,-54.6,47.6C-63,36.3,-67.5,22,-72.3,5.9C-77.1,-10.3,-82.2,-28.2,-76.3,-40.2C-70.4,-52.3,-53.6,-58.4,-38.6,-63.5C-23.6,-68.6,-10.4,-72.7,2.5,-76.8C15.3,-80.9,28.7,-73,39.9,-65.7Z"
                            ][i % 2]} transform="translate(100 100)" />
                        </svg>
                    </motion.div>
                ))}
            </motion.div>

            {/* Photo section with enhanced animation */}
            <motion.div 
                className="md:w-1/2 mb-16 md:mb-0 px-8"
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
                <div 
                    className="relative mx-auto max-w-xs"
                    ref={imageRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
                >
                    {/* 3D perspective container */}
                    <motion.div 
                        className="relative w-full h-full perspective-800"
                        style={{ 
                            scale: imageScale,
                            rotateY: mousePosition.x * 10,
                            rotateX: mousePosition.y * -10
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                        {/* Decorative frame */}
                        <motion.div 
                            className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-gray-200 via-white to-gray-100 shadow-lg"
                            animate={{ 
                                boxShadow: isHovered 
                                    ? "0 20px 40px rgba(0,0,0,0.2), 0 0 30px rgba(0,0,0,0.1) inset" 
                                    : "0 10px 30px rgba(0,0,0,0.1), 0 0 0px rgba(0,0,0,0) inset" 
                            }}
                            transition={{ duration: 0.5 }}
                        ></motion.div>
                        
                        {/* Profile image container */}
                        <motion.div
                            className="relative overflow-hidden rounded-[2rem] border-4 border-white"
                            initial={{ filter: "grayscale(1)" }}
                            animate={{ 
                                filter: isHovered ? "grayscale(0)" : "grayscale(0.8)",
                                boxShadow: isHovered ? "0 0 30px rgba(0,0,0,0.2) inset" : "0 0 0 rgba(0,0,0,0) inset"
                            }}
                            transition={{ duration: 0.6 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            whileHover={{ scale: 1.03 }}
                        >
                            {/* Overlay elements */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10 mix-blend-overlay"
                                animate={{ opacity: isHovered ? 0.3 : 0.7 }}
                                transition={{ duration: 0.5 }}
                            />
                            
                            <img 
                                src={owner}
                                alt="Villa Owner" 
                                className="w-full h-auto transition-all duration-1000" 
                            />
                            
                            {/* Animated color vignette effect */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-amber-500/20 mix-blend-overlay"
                                animate={{ 
                                    opacity: isHovered ? 0.8 : 0,
                                }}
                                transition={{ duration: 0.8 }}
                            />
                        </motion.div>
                        
                        {/* Decorative elements */}
                        <motion.div 
                            className="absolute -bottom-4 -right-4 p-4 bg-white rounded-full shadow-xl z-20"
                            animate={{ 
                                rotate: isHovered ? 0 : 12,
                                scale: isHovered ? 1.1 : 1
                            }}
                            transition={{ type: "spring", stiffness: 200 }}
                            {...floatingAnimation}
                        >
                            <span className="text-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-transparent bg-clip-text">✦</span>
                        </motion.div>
                        
                        <motion.div 
                            className="absolute -top-3 -left-3 p-3 bg-gray-100 rounded-full shadow-md z-20"
                            animate={{ rotate: isHovered ? 0 : -12 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <span className="text-xl bg-gradient-to-r from-gray-400 to-gray-600 text-transparent bg-clip-text">✧</span>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Text content with enhanced animations */}
            <motion.div 
                className="md:w-1/2 md:pl-12 lg:pl-20 px-6 md:px-0 relative"
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                onMouseEnter={() => setIsTextHovered(true)}
                onMouseLeave={() => setIsTextHovered(false)}
            >
                {/* Animated accent line */}
                <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-0.5 hidden md:block"
                    initial={{ height: 0, backgroundColor: "rgba(200,200,200,0.3)" }}
                    animate={{ 
                        height: isVisible ? "100%" : 0,
                        backgroundColor: isTextHovered ? "rgba(180,180,180,0.6)" : "rgba(200,200,200,0.3)"
                    }}
                    transition={{ duration: 1, delay: 0.3 }}
                />

                <div className="relative">
                    {/* Quote mark with floating animation */}
                    <motion.span 
                        className="absolute -left-6 -top-10 text-6xl text-gray-300 opacity-30 font-serif"
                        animate={{ 
                            y: [0, -8, 0],
                            rotate: [0, 5, 0],
                            opacity: isTextHovered ? 0.5 : 0.3
                        }}
                        transition={{ 
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 0.5 }
                        }}
                    >
                        ❝
                    </motion.span>
                    
                    {/* Title with animated underline */}
                    <motion.h2 
                        className="text-4xl font-serif font-light text-gray-800 mb-8 relative inline-block"
                        animate={{
                            scale: isTextHovered ? 1.03 : 1,
                            color: isTextHovered ? "#1a1a1a" : "#333333"
                        }}
                        transition={{ duration: 0.4 }}
                    >
                        About Me
                        <motion.div 
                            className="h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 absolute -bottom-1 left-0"
                            initial={{ width: 0 }}
                            animate={{ width: isVisible ? "100%" : 0 }}
                            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                        />
                    </motion.h2>
                </div>
                
                {/* Main text with staggered animation */}
                <motion.p 
                    className="text-gray-700 text-lg leading-relaxed mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    "Welcome to our villa, a place where comfort meets elegance. 
                    I have dedicated my life to creating a serene escape for our guests, 
                    where luxury and tranquility blend seamlessly to provide an unforgettable experience."
                </motion.p>
                
                {/* Quote section with animation */}
                <motion.div
                    className="relative mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-300"
                        initial={{ height: 0 }}
                        animate={{ height: isVisible ? "100%" : 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                    />
                    
                    <motion.p 
                        className="text-gray-600 italic text-lg pl-6 py-2"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        "Your experience is our priority. Every detail matters."
                    </motion.p>
                </motion.div>
                
                {/* Signature section with animation */}
                <motion.div 
                    className="flex items-center mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-5 shadow-md"
                        whileHover={{ 
                            scale: 1.2, 
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)" 
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <span className="text-white text-2xl">✦</span>
                    </motion.div>
                    
                    <div>
                        <motion.div 
                            className="font-handwriting text-2xl text-gray-800"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isVisible ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 1.2 }}
                        >
                            Gunaseelan
                        </motion.div>
                        <motion.span 
                            className="text-gray-500 text-sm uppercase tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={isVisible ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 1.4 }}
                        >
                            Founder & Managing Director
                        </motion.span>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default PersonalIntro;