import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <motion.div 
      className="privacy-policy-container py-12 px-6 md:px-10 lg:px-20 max-w-6xl mx-auto"
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
          Privacy Policy
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
          Welcome to Luxor Holiday Home Stays. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
        </p>
        <p className="text-gray-600">
          Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Information We Collect</h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Personal Information</h3>
        <p className="text-gray-600 mb-4">
          We may collect personal information that you voluntarily provide to us when you:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-1">
          <li>Register on our website</li>
          <li>Make a booking or reservation</li>
          <li>Subscribe to our newsletter</li>
          <li>Request information or assistance</li>
          <li>Participate in promotions or surveys</li>
          <li>Submit a review</li>
        </ul>
        <p className="text-gray-600 mb-4">
          This information may include:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-1">
          <li>Name, email address, phone number, and postal address</li>
          <li>Payment information</li>
          <li>Guest preferences and special requests</li>
          <li>Demographic information</li>
          <li>Identity verification information</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-6">Automatically Collected Information</h3>
        <p className="text-gray-600 mb-4">
          When you visit our website, we may automatically collect certain information about your device, including:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-1">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Pages visited and time spent</li>
          <li>Referral sources</li>
          <li>Device information</li>
        </ul>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">How We Use Your Information</h2>
        <p className="text-gray-600 mb-4">
          We may use the information we collect for various purposes, including:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-1">
          <li>Processing and confirming your reservations</li>
          <li>Providing customer service and support</li>
          <li>Sending transactional emails and booking confirmations</li>
          <li>Processing payments and preventing fraud</li>
          <li>Sending promotional communications and newsletters (if you've opted in)</li>
          <li>Improving our website, services, and customer experience</li>
          <li>Conducting research and analysis</li>
          <li>Complying with legal obligations</li>
        </ul>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Cookies and Tracking Technologies</h2>
        <p className="text-gray-600 mb-4">
          We use cookies and similar tracking technologies to collect information about your browsing activities. 
          Cookies help us enhance your experience on our site, analyze usage patterns, and deliver personalized content.
        </p>
        <p className="text-gray-600">
          You can set your browser to refuse all or some browser cookies or to alert you when cookies are being sent. 
          However, if you disable or refuse cookies, some parts of our website may become inaccessible or not function properly.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Third-Party Disclosure</h2>
        <p className="text-gray-600 mb-4">
          We may share your personal information with:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-1">
          <li>Service providers who perform services on our behalf</li>
          <li>Villa owners and property managers to fulfill your booking</li>
          <li>Payment processors to complete transactions</li>
          <li>Analytics and search engine providers to improve our website</li>
          <li>Legal authorities when required by law</li>
        </ul>
        <p className="text-gray-600">
          We do not sell, trade, or otherwise transfer your personal information to outside parties unless we provide you with advance notice.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Data Security</h2>
        <p className="text-gray-600 mb-4">
          We implement appropriate security measures to protect your personal information from accidental loss, unauthorized access, 
          disclosure, alteration, and destruction. However, no internet transmission is ever completely secure or error-free.
        </p>
        <p className="text-gray-600">
          While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Your Rights</h2>
        <p className="text-gray-600 mb-4">
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-600 space-y-1">
          <li>Right to access the personal information we hold about you</li>
          <li>Right to rectify inaccurate personal information</li>
          <li>Right to request deletion of your personal information</li>
          <li>Right to restrict or object to processing of your personal information</li>
          <li>Right to data portability</li>
          <li>Right to withdraw consent</li>
        </ul>
        <p className="text-gray-600">
          To exercise any of these rights, please contact us using the information provided below.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Changes to This Privacy Policy</h2>
        <p className="text-gray-600">
          We may update our privacy policy from time to time. Any changes will be posted on this page with an updated revision date. 
          We encourage you to review this privacy policy periodically for any changes.
        </p>
      </motion.section>

      <motion.section 
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-2xl font-playfair text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          If you have any questions or concerns about this privacy policy or our practices, please contact us at:
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
        transition={{ delay: 1.3 }}
      >
        <Link to="/" className="text-[#D4AF37] hover:text-[#BFA181] transition-colors flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </Link>
        <Link to="/terms" className="text-[#D4AF37] hover:text-[#BFA181] transition-colors">
          Terms & Conditions
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyPolicy;
