import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <motion.div 
      className="terms-container py-12 px-6 md:px-10 lg:px-20 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-playfair text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Terms & Conditions
        </motion.h1>
        <div className="w-20 h-1 bg-[#D4AF37]"></div>
        <motion.p 
          className="mt-4 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </motion.p>
      </div>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Introduction</h2>
        <p className="text-gray-600 mb-4">
          Welcome to Luxor Holiday Home Stays. These Terms and Conditions govern your use of our website and services. 
          By accessing or using our website, making a reservation, or availing our services, you agree to be bound by these Terms and Conditions.
        </p>
        <p className="text-gray-600">
          Please read these Terms and Conditions carefully before using our services. If you do not agree to these terms, please do not use our website or services.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Definitions</h2>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-2">
          <li><span className="font-medium">"Company"</span> refers to Luxor Holiday Home Stays, its owners, directors, officers, employees, and representatives.</li>
          <li><span className="font-medium">"Website"</span> refers to the website operated by Luxor Holiday Home Stays and accessible at www.luxorholidayhomestays.com</li>
          <li><span className="font-medium">"Services"</span> refers to the villa rentals, accommodations, and related services offered by the Company.</li>
          <li><span className="font-medium">"Customer"</span> or <span className="font-medium">"Guest"</span> refers to any individual or entity that makes a reservation, books, or utilizes the services offered by the Company.</li>
          <li><span className="font-medium">"Booking"</span> refers to the reservation of accommodation and services made by a Customer.</li>
        </ul>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Booking and Reservation Policy</h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Reservation Confirmation</h3>
        <p className="text-gray-600 mb-4">
          A booking is confirmed only upon receipt of the required payment and a written confirmation from the Company. 
          The Company reserves the right to decline any booking request at its discretion.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-6">Payment Terms</h3>
        <p className="text-gray-600 mb-4">
          To secure a reservation, a payment of 50% of the total amount is required at the time of booking. 
          The remaining balance must be paid at least 14 days prior to the check-in date. 
          For bookings made less than 14 days before the check-in date, full payment is required at the time of booking.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-6">Security Deposit</h3>
        <p className="text-gray-600 mb-4">
          A security deposit may be required at the time of check-in. This deposit will be refunded within 7 business days after check-out, 
          subject to deductions for damages, missing items, or additional services requested during the stay.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Cancellation and Modification Policy</h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Cancellation by Guest</h3>
        <p className="text-gray-600 mb-4">
          All cancellations must be made in writing to the Company. The following cancellation charges apply:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-1">
          <li>More than 30 days before check-in: 25% of the total booking amount</li>
          <li>15-30 days before check-in: 50% of the total booking amount</li>
          <li>Less than 15 days before check-in: 100% of the total booking amount</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-6">Modification of Booking</h3>
        <p className="text-gray-600 mb-4">
          Requests to modify a confirmed booking must be made in writing to the Company. Modifications are subject to availability and may incur additional charges. 
          The Company reserves the right to treat significant modifications as a cancellation and new booking.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-6">Force Majeure</h3>
        <p className="text-gray-600 mb-4">
          In the event of circumstances beyond our reasonable control (including but not limited to natural disasters, civil unrest, or pandemic restrictions), 
          the Company may offer a full refund or reschedule the booking without additional charges.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Check-in and Check-out</h2>
        <p className="text-gray-600 mb-4">
          The standard check-in time is 2:00 PM, and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, 
          subject to availability and additional charges.
        </p>
        <p className="text-gray-600 mb-4">
          Guests are required to present valid government-issued identification at the time of check-in. 
          The Company reserves the right to refuse accommodation to guests who fail to provide valid identification.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">House Rules and Guest Conduct</h2>
        <p className="text-gray-600 mb-4">
          Guests are expected to conduct themselves in a manner that respects the property, staff, and other guests. 
          The Company reserves the right to terminate a guest's stay without refund for disruptive behavior, excessive noise, 
          property damage, or violation of house rules.
        </p>
        <p className="text-gray-600 mb-4">
          Specific house rules will be provided at the time of check-in or may be found in the villa information folder. 
          These rules may include restrictions on parties, events, smoking, pets, and noise levels.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Liability and Insurance</h2>
        <p className="text-gray-600 mb-4">
          The Company shall not be liable for any loss, damage, injury, or illness suffered by guests or their visitors during their stay, 
          except where such loss, damage, injury, or illness is due to the negligence of the Company.
        </p>
        <p className="text-gray-600 mb-4">
          Guests are advised to take out adequate travel and personal insurance to cover their stay. 
          The Company does not provide insurance coverage for guests' personal belongings or travel-related risks.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Photography and Marketing</h2>
        <p className="text-gray-600 mb-4">
          The Company reserves the right to use photographs of the properties and guests (without identifying individuals) for marketing and promotional purposes. 
          If you object to this, please inform the Company in writing at the time of booking.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Jurisdiction and Governing Law</h2>
        <p className="text-gray-600 mb-4">
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India. 
          Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Changes to Terms and Conditions</h2>
        <p className="text-gray-600 mb-4">
          The Company reserves the right to modify these Terms and Conditions at any time without prior notice. 
          The latest version of these Terms and Conditions will be posted on our website with the effective date.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Contact Information</h2>
        <p className="text-gray-600 mb-6">
          If you have any questions regarding these Terms and Conditions, please contact us at:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-1"><span className="font-medium">Email:</span> support@luxorholidayhomestays.com</p>
          <p className="text-gray-700 mb-1"><span className="font-medium">Phone:</span> +91 8015924647</p>
          <p className="text-gray-700"><span className="font-medium">Address:</span> Luxor Holiday Home Stays, Chennai, Tamil Nadu, India</p>
        </div>
      </motion.section>

      <motion.div 
        className="mt-12 border-t border-gray-200 pt-8 flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Link to="/" className="text-[#D4AF37] hover:text-[#BFA181] transition-colors flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </Link>
        <Link to="/privacy" className="text-[#D4AF37] hover:text-[#BFA181] transition-colors">
          Privacy Policy
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default TermsConditions;
