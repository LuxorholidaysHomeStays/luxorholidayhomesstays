import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/luxor_holiday_home_stays?igsh=c3lndHU2ZG1rYjM=', '_blank');
  };

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/luxorholidayhomestays', '_blank');
  };

  const handleWhatsappClick = () => {
    window.open('https://wa.me/918015924647?text=Hi, I would like to know more about Luxor Holiday Home Stays', '_blank');
  };

  return (
    <footer className='bg-[#F6F9FC] text-gray-600 pt-12 px-6 md:px-16 lg:px-24 xl:px-32' data-component="footer">
      <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
        <div className='max-w-80'>
          <img src={assets.logo} alt="logo" className='mb-6 h-10 md:h-12' />
          <p className='text-sm leading-relaxed'>
            Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private getaways nestled in scenic destinations across Tamil Nadu.
          </p>
          <div className='flex items-center gap-4 mt-6'>
            <div 
              className='w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#BFA181] transition-colors duration-300'
              onClick={handleInstagramClick}
            >
              <img 
                src={assets.instagramIcon} 
                alt="instagram-icon" 
                className='w-5 brightness-0 invert'
              />
            </div>
            <div 
              className='w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#BFA181] transition-colors duration-300'
              onClick={handleFacebookClick}
            >
              <img 
                src={assets.facebookIcon} 
                alt="facebook-icon" 
                className='w-5 brightness-0 invert'
              />
            </div>
            <div 
              className='w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#BFA181] transition-colors duration-300'
              onClick={handleWhatsappClick}
            >
              <img 
                src={assets.whatsappIcon} 
                alt="whatsapp-icon" 
                className='w-5 brightness-0 invert'
              />
            </div>
          </div>
        </div>

        <div>
          <p className='font-playfair text-lg font-medium text-gray-800 border-b-2 border-[#D4AF37] pb-2 inline-block'>OUR VILLAS</p>
          <ul className='mt-5 flex flex-col gap-3 text-sm'>
            <li><Link to="/rooms" className="hover:text-[#D4AF37] transition-colors">Amrith Palace</Link></li>
            <li><Link to="/rooms" className="hover:text-[#D4AF37] transition-colors">Ram Water Villa</Link></li>
            <li><Link to="/rooms" className="hover:text-[#D4AF37] transition-colors">East Coast Villa</Link></li>
            <li><Link to="/rooms" className="hover:text-[#D4AF37] transition-colors">Empire Anand Villa</Link></li>
            <li><Link to="/rooms" className="hover:text-[#D4AF37] transition-colors">View All Properties</Link></li>
          </ul>
        </div>

        <div>
          <p className='font-playfair text-lg font-medium text-gray-800 border-b-2 border-[#D4AF37] pb-2 inline-block'>LUXOR VILLA</p>
          <ul className='mt-5 flex flex-col gap-3 text-sm'>
            <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
            <li><Link to="/h" className="hover:text-[#D4AF37] transition-colors">Help Center</Link></li>
            <li><Link to="/si" className="hover:text-[#D4AF37] transition-colors">Safety Information</Link></li>
            <li><Link to="/reviews" className="hover:text-[#D4AF37] transition-colors">Guest Reviews</Link></li>
          </ul>
        </div>

        <div className='max-w-80'>
          <p className='font-playfair text-lg font-medium text-gray-800 border-b-2 border-[#D4AF37] pb-2 inline-block'>STAY UPDATED</p>
          <p className='mt-5 text-sm leading-relaxed'>
            Subscribe to our newsletter for exclusive offers, travel inspiration, and updates on our newest luxury properties.
          </p>
          <div className='flex items-center mt-5'>
            <input 
              type="email" 
              className='bg-white rounded-l-full border border-gray-300 h-11 px-4 outline-none focus:border-[#D4AF37] transition-colors w-full' 
              placeholder='Your email address' 
            />
            <button className='flex items-center justify-center bg-[#D4AF37] h-11 px-5 rounded-r-full hover:bg-[#BFA181] transition-colors'>
              <span className="text-white text-sm font-medium mr-1">Subscribe</span>
              <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert' />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <span className="text-[#D4AF37] font-medium mr-3">Contact Us:</span>
            <a href="tel:+918015924647" className="text-gray-600 hover:text-[#D4AF37] transition-colors mr-6">+91 8015924647</a>
            <a href="mailto:support@luxorholidayhomestays.com" className="text-gray-600 hover:text-[#D4AF37] transition-colors">support@luxorholidayhomestays.com</a>
          </div>
          
          <div>
            <Link to="/" className="inline-flex items-center bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Check Availability
            </Link>
          </div>
        </div>
      </div>
      
      <hr className='border-gray-200 mt-8' />
      <div className='flex flex-col md:flex-row gap-3 items-center justify-between py-6'>
        <p className="text-sm">© {new Date().getFullYear()} Luxor Holiday Home Stays. All rights reserved.</p>
        <ul className='flex items-center gap-6'>
          <li><Link to="/privacy" className="text-sm hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms" className="text-sm hover:text-[#D4AF37] transition-colors">Terms & Conditions</Link></li>
          <li><a href="/sitemap.xml" className="text-sm hover:text-[#D4AF37] transition-colors">Sitemap</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer