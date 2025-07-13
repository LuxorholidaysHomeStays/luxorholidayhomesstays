import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Create a custom hook to detect if calendar modal is open
const useCalendarModalDetection = () => {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  
  useEffect(() => {
    // Function to check if calendar modal is open by looking for its elements
    const checkForCalendarModal = () => {
      const calendarElements = document.querySelectorAll('.fixed.inset-0.bg-black\\/50, .fixed.inset-0.bg-black\\/60');
      setIsCalendarModalOpen(calendarElements.length > 0);
    };
    
    // Set up a mutation observer to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
      checkForCalendarModal();
    });
    
    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial check
    checkForCalendarModal();
    
    // Clean up the observer when component unmounts
    return () => observer.disconnect();
  }, []);
  
  return isCalendarModalOpen;
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedSection, setExpandedSection] = useState({
    villas: false,
    luxorInfo: false,
  });
  
  // Use our custom hook to detect if calendar modal is open
  const isCalendarModalOpen = useCalendarModalDetection();
  
  // Add/remove body class when calendar modal opens/closes
  useEffect(() => {
    if (isCalendarModalOpen) {
      document.body.classList.add('calendar-modal-open');
    } else {
      document.body.classList.remove('calendar-modal-open');
    }
    
    return () => {
      document.body.classList.remove('calendar-modal-open');
    };
  }, [isCalendarModalOpen]);
  
  // Monitor screen size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/luxor_holiday_home_stays?igsh=c3lndHU2ZG1rYjM=', '_blank');
  };
  
  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/luxorholidayhomestays', '_blank');
  };

  const handleWhatsappClick = () => {
    window.open('https://wa.me/918015924647?text=Hi, I would like to know more about Luxor Holiday Home Stays', '_blank');
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear any previous messages when user starts typing again
    if (subscribeMessage) {
      setSubscribeMessage(null);
    }
  };
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscribeMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission - replace with actual API call in production
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribeMessage({ type: 'success', text: 'Thank you for subscribing!' });
      setEmail('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubscribeMessage(null);
      }, 3000);
    }, 1000);
  };

  const toggleAccordion = (section) => {
    if (isMobile) {
      setExpandedSection(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }
  };

  // If calendar modal is open, don't render the footer at all
  if (isCalendarModalOpen) {
    return null;
  }

  return (
    <footer className='bg-[#F6F9FC] text-gray-600 pt-12 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 relative z-0' data-component="footer">
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 relative'>
        <div className='max-w-xs'>
          <motion.img 
            src={assets.logo} 
            alt="logo" 
            className='mb-6 h-10 md:h-12' 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <p className='text-sm leading-relaxed'>
            Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private getaways nestled in scenic destinations across Tamil Nadu.
          </p>
          <div className='flex items-center gap-4 mt-6'>
            <motion.div 
              className='w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#BFA181] transition-all duration-300 shadow-md hover:shadow-lg'
              onClick={handleInstagramClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label="Visit our Instagram"
            >
              <img 
                src={assets.instagramIcon} 
                alt="instagram-icon" 
                className='w-5 brightness-0 invert'
              />
            </motion.div>
            <motion.div 
              className='w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#BFA181] transition-all duration-300 shadow-md hover:shadow-lg'
              onClick={handleFacebookClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label="Visit our Facebook"
            >
              <img 
                src={assets.facebookIcon} 
                alt="facebook-icon" 
                className='w-5 brightness-0 invert'
              />
            </motion.div>
            <motion.div 
              className='w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#BFA181] transition-all duration-300 shadow-md hover:shadow-lg'
              onClick={handleWhatsappClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label="Contact us on WhatsApp"
            >
              <img 
                src={assets.whatsappIcon} 
                alt="whatsapp-icon" 
                className='w-5 brightness-0 invert'
              />
            </motion.div>
          </div>
        </div>

        <div>
          <div 
            className={`flex items-center justify-between ${isMobile ? 'cursor-pointer' : ''}`}
            onClick={() => toggleAccordion('villas')}
          >
            <motion.p 
              className='font-playfair text-lg font-medium text-gray-800 border-b-2 border-[#D4AF37] pb-2 inline-block'
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              OUR VILLAS
            </motion.p>
            {isMobile && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: expandedSection.villas ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-[#D4AF37]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </div>
          
          <AnimatePresence>
            {(!isMobile || expandedSection.villas) && (
              <motion.ul 
                className='mt-5 flex flex-col gap-3 text-sm'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <Link to="/rooms" className="hover:text-[#D4AF37] transition-colors inline-block py-1">Amrith Palace</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  <Link to="/rooms" className="hover:text-[#D4AF37] transition-colors inline-block py-1">Ram Water Villa</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 }}
                >
                  <Link to="/rooms" className="hover:text-[#D4AF37] transition-colors inline-block py-1">East Coast Villa</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.5 }}
                >
                  <Link to="/rooms" className="hover:text-[#D4AF37] transition-colors inline-block py-1">Empire Anand Villa</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.6 }}
                >
                  <Link to="/rooms" className="hover:text-[#D4AF37] transition-colors inline-block py-1 font-medium">View All Properties</Link>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div>
          <div 
            className={`flex items-center justify-between ${isMobile ? 'cursor-pointer' : ''}`}
            onClick={() => toggleAccordion('luxorInfo')}
          >
            <motion.p 
              className='font-playfair text-lg font-medium text-gray-800 border-b-2 border-[#D4AF37] pb-2 inline-block'
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              LUXOR VILLA
            </motion.p>
            {isMobile && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: expandedSection.luxorInfo ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-[#D4AF37]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </div>
          
          <AnimatePresence>
            {(!isMobile || expandedSection.luxorInfo) && (
              <motion.ul 
                className='mt-5 flex flex-col gap-3 text-sm'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  <Link to="/about" className="hover:text-[#D4AF37] transition-colors inline-block py-1">About Us</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 }}
                >
                  <Link to="/contact" className="hover:text-[#D4AF37] transition-colors inline-block py-1">Contact Us</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.5 }}
                >
                  <Link to="/h" className="hover:text-[#D4AF37] transition-colors inline-block py-1">Help Center</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.6 }}
                >
                  <Link to="/si" className="hover:text-[#D4AF37] transition-colors inline-block py-1">Safety Information</Link>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.7 }}
                >
                  <Link to="/reviews" className="hover:text-[#D4AF37] transition-colors inline-block py-1">Guest Reviews</Link>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className='max-w-80'>
          <motion.p 
            className='font-playfair text-lg font-medium text-gray-800 border-b-2 border-[#D4AF37] pb-2 inline-block'
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            STAY UPDATED
          </motion.p>
          <motion.p 
            className='mt-5 text-sm leading-relaxed'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Subscribe to our newsletter for exclusive offers, travel inspiration, and updates on our newest luxury properties.
          </motion.p>
          <motion.form 
            className='flex flex-col sm:flex-row items-center mt-5'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onSubmit={handleSubscribe}
          >
            <div className="relative w-full">
              <input 
                type="email" 
                className='bg-white rounded-l-full sm:rounded-l-full rounded-full border border-gray-300 h-11 px-4 outline-none focus:border-[#D4AF37] transition-colors w-full' 
                placeholder='Your email address' 
                value={email}
                onChange={handleEmailChange}
                required
              />
              {subscribeMessage && (
                <div className={`absolute -bottom-6 left-0 text-xs ${subscribeMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {subscribeMessage.text}
                </div>
              )}
            </div>
            <button 
              type="submit"
              className='flex items-center justify-center bg-[#D4AF37] h-11 px-5 sm:rounded-r-full rounded-full hover:bg-[#BFA181] transition-colors mt-3 sm:mt-0 sm:w-auto w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <span className="text-white text-sm font-medium mr-1">Subscribe</span>
                  <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert' />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
      
      <motion.div 
        className="mt-12 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <span className="text-[#D4AF37] font-medium mr-0 sm:mr-3 mb-2 sm:mb-0">Contact Us:</span>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <a href="tel:+918015924647" className="text-gray-600 hover:text-[#D4AF37] transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 8015924647
              </a>
              <a href="mailto:support@luxorholidayhomestays.com" className="text-gray-600 hover:text-[#D4AF37] transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@luxorholidayhomestays.com
              </a>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/" className="inline-flex items-center bg-gradient-to-r from-[#D4AF37] to-[#BFA181] hover:from-[#BFA181] hover:to-[#D4AF37] text-white transition-all duration-300 px-6 py-2.5 rounded-full text-sm shadow-md hover:shadow-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Check Availability
            </Link>
          </div>
        </div>
      </motion.div>
      
      <motion.hr 
        className='border-gray-200 mt-8'
        initial={{ opacity: 0, width: "0%" }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
      <motion.div 
        className='flex flex-col md:flex-row gap-4 items-center justify-between py-6'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-medium text-[#D4AF37]">Luxor Holiday Home Stays</span>. All rights reserved.
        </p>
        <ul className='flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6'>
          <li>
            <Link 
              to="/privacy" 
              className="text-sm hover:text-[#D4AF37] transition-colors relative group"
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link 
              to="/terms" 
              className="text-sm hover:text-[#D4AF37] transition-colors relative group"
            >
              Terms & Conditions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <a 
              href="/sitemap.xml" 
              className="text-sm hover:text-[#D4AF37] transition-colors relative group"
            >
              Sitemap
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        </ul>
      </motion.div>
    </footer>
  )
}

export default Footer