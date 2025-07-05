import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SafetyInfo = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const safetyCategories = [
    {
      title: "Health & Hygiene",
      icon: "🧼",
      items: [
        "Enhanced cleaning protocols using hospital-grade disinfectants",
        "24-hour buffer between guest stays for deep sanitization",
        "Contactless check-in and check-out options",
        "Hand sanitizer stations placed throughout the property",
        "Staff trained in COVID-19 health and safety guidelines",
        "Regular sanitization of high-touch surfaces"
      ]
    },
    {
      title: "Emergency Preparedness",
      icon: "🚨",
      items: [
        "First aid kits in every villa",
        "24/7 emergency assistance available",
        "Fire extinguishers and smoke detectors installed",
        "Emergency evacuation plans clearly displayed",
        "Staff trained in CPR and basic first aid",
        "Clearly marked emergency exits and safety routes"
      ]
    },
    {
      title: "Property Security",
      icon: "🔒",
      items: [
        "CCTV surveillance in common areas",
        "Digital locks with unique codes for each stay",
        "Secure gated compounds with controlled access",
        "Night security personnel on premises",
        "Motion sensor lighting around property perimeters",
        "Safe boxes in all villas for valuable storage"
      ]
    },
    {
      title: "Food Safety",
      icon: "🍽️",
      items: [
        "Strict food handling protocols following HACCP standards",
        "Regular health inspections of kitchen facilities",
        "Transparent ingredient sourcing information available on request",
        "Special dietary requirements accommodated with proper preparation protocols",
        "Staff trained in allergen awareness and cross-contamination prevention"
      ]
    },
    {
      title: "Child Safety",
      icon: "👶",
      items: [
        "Pool safety features including partial fencing where applicable",
        "Child-proof locks available upon request",
        "Electrical outlet covers available for families with young children",
        "Baby monitors available upon request",
        "Vetted babysitting services can be arranged"
      ]
    }
  ];
  
  const medicalResources = [
    {
      name: "Apollo Hospital",
      distance: "5 km from East Coast Villa & Ram Water Villa",
      contact: "+91 44 2829 3333",
      address: "No.6, Vanagaram Road, Arumbakkam, Chennai - 600106"
    },
    {
      name: "Kauvery Hospital",
      distance: "7 km from Empire Anand Villa",
      contact: "+91 44 4000 6000",
      address: "No.199, Luz Church Road, Mylapore, Chennai - 600004"
    },
    {
      name: "Government General Hospital",
      distance: "15 km from Amrith Palace",
      contact: "+91 44 2530 5000",
      address: "No.3, EVR Periyar Salai, Park Town, Chennai - 600003"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-playfair font-bold text-gray-800 mb-4"
        >
          Your Safety Is Our Priority
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-gray-600 max-w-3xl mx-auto"
        >
          At Luxor Holiday Home Stays, we are committed to providing a safe and secure environment for all our guests. 
          Learn about our comprehensive safety measures designed to ensure your peace of mind during your stay.
        </motion.p>
      </div>

      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative rounded-xl overflow-hidden mb-16 h-[300px] md:h-[400px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/80 to-transparent z-10"></div>
        <img 
          src="/public/AmrithPalace/AP1.jpg" 
          alt="Luxor Villa Safety" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-12 transform -translate-y-1/2 z-20 max-w-lg">
          <h2 className="text-3xl font-playfair font-bold text-white mb-4">Safety Commitment</h2>
          <p className="text-white text-lg">
            We have implemented enhanced safety protocols across all our properties to ensure a worry-free stay for you and your loved ones.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-white text-[#D4AF37] rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            Our Safety Certification
          </motion.button>
        </div>
      </motion.div>

      {/* Safety Categories */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-16"
      >
        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8 text-center">Comprehensive Safety Measures</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safetyCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-[#F6F9FC] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-medium text-gray-800">{category.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* COVID-19 Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-[#F6F9FC] rounded-xl p-8 mb-16"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center shadow-md">
              <span className="text-5xl">😷</span>
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">COVID-19 Safety Protocols</h2>
            <p className="text-gray-700 mb-4">
              We continue to follow best practices to minimize risks related to COVID-19, ensuring that our villas are safe havens for your vacation.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">•</span>
                <span>Enhanced cleaning and disinfection between stays</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">•</span>
                <span>Contactless check-in options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">•</span>
                <span>Staff health screening and safety training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">•</span>
                <span>Hand sanitizer provided in all villas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">•</span>
                <span>Masks available upon request</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Emergency Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8 text-center">Nearby Medical Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {medicalResources.map((resource, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-medium text-[#D4AF37] mb-2">{resource.name}</h3>
              <p className="text-gray-700 mb-1"><span className="font-medium">Distance:</span> {resource.distance}</p>
              <p className="text-gray-700 mb-1"><span className="font-medium">Contact:</span> {resource.contact}</p>
              <p className="text-gray-700"><span className="font-medium">Address:</span> {resource.address}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-16"
      >
        <div className="bg-[#D4AF37] py-6 px-8">
          <h2 className="text-2xl font-playfair font-bold text-white">Travel Safety Tips</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Before Your Trip</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Research your destination's local regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Purchase travel insurance that includes medical coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Share your itinerary with a trusted friend or family member</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Make digital copies of important documents</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">During Your Stay</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Familiarize yourself with emergency exits upon arrival</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Keep our emergency contact information handy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Use the safe provided for valuables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">→</span>
                  <span className="text-gray-700">Follow posted safety guidelines for pools and amenities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8 text-center">Safety FAQ</h2>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              question: "Are your villas equipped with smoke detectors?",
              answer: "Yes, all our villas are equipped with smoke detectors, carbon monoxide detectors, and fire extinguishers that are regularly inspected and maintained."
            },
            {
              question: "Is there 24/7 security at the properties?",
              answer: "Our larger properties have dedicated security personnel on-site. All properties have security cameras in common areas and secure entry systems."
            },
            {
              question: "Do you provide childproofing options?",
              answer: "Yes, we offer childproofing kits upon request that include outlet covers, corner protectors, and cabinet locks. Please request these when booking if needed."
            },
            {
              question: "How often are pools cleaned and maintained?",
              answer: "Our pools are cleaned daily and undergo professional maintenance twice weekly. Water quality is tested daily to ensure safe swimming conditions."
            },
            {
              question: "What emergency backup systems do you have in case of power outages?",
              answer: "All our properties are equipped with backup generators that automatically activate during power outages to ensure essential systems remain operational."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-[#F6F9FC] rounded-xl p-8 text-center"
      >
        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">Have Safety Concerns?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Your safety is our top priority. If you have any specific safety concerns or requirements, 
          our team is ready to address them to ensure you have a worry-free stay.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/contact" className="px-6 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#BFA181] transition-colors duration-300 inline-block">
              Contact Our Safety Team
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a 
              href="tel:+918015924647"
              className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 inline-block"
            >
              Emergency Helpline
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SafetyInfo;
