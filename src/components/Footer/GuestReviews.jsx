import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';

const GuestReviews = () => {
  const { userData, authToken } = useAuth();
  const navigate = useNavigate();
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [newReviews, setNewReviews] = useState([]);
  const [formData, setFormData] = useState({
    villaName: '',
    daysStayed: '',
    rating: 5,
    reviewText: ''
  });

  // Fetch new reviews from API on component mount
  useEffect(() => {
    const fetchNewReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reviews`);
        if (response.ok) {
          const data = await response.json();
          setNewReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchNewReviews();
  }, [reviewSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!authToken) {
      // Save the current location to redirect back after login
      localStorage.setItem('redirectAfterLogin', '/reviews');
      navigate('/sign-in');
      return;
    }

    setIsSubmittingReview(true);
    setSubmissionError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          villaName: formData.villaName,
          daysStayed: parseInt(formData.daysStayed),
          rating: parseInt(formData.rating),
          reviewText: formData.reviewText,
          userId: userData?._id || ''
        })
      });

      if (response.ok) {
        setReviewSubmitted(true);
        setFormData({
          villaName: '',
          daysStayed: '',
          rating: 5,
          reviewText: ''
        });
        
        // Show success for 3 seconds
        setTimeout(() => {
          setReviewSubmitted(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setSubmissionError(errorData.message || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmissionError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Static review data as fallback
  const staticReviews = [
    {
      id: 1,
      name: "Aarav Sharma",
      location: "New Delhi",
      date: "June 15, 2025",
      rating: 5,
      property: "Amrith Palace",
      review: "We had an incredible stay at Amrith Palace. The 9 AC rooms were perfect for our extended family gathering. The private swimming pool was a big hit with the kids, and the beach access just 800m away was very convenient. The staff was attentive and helped us arrange a small family celebration. Will definitely recommend to friends and family!",
      image: "/public/AmrithPalace/AP1.jpg"
    },
    {
      id: 2,
      name: "Priya Patel",
      location: "Mumbai",
      date: "May 23, 2025",
      rating: 5,
      property: "Empire Anand Villa Samudra",
      review: "The Empire Anand Villa exceeded all our expectations. The spacious modern interiors and high-end amenities made our stay truly luxurious. We loved the private beach access and spent most evenings enjoying the stunning sea views. Perfect for a family getaway. The caretaker was extremely helpful throughout our stay.",
      image: "/public/empireanandvillasamudra/anandvilla1.jpg"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      location: "Bangalore",
      date: "April 10, 2025",
      rating: 4,
      property: "East Coast Villa",
      review: "East Coast Villa was perfect for our weekend getaway. The private swimming pool and JBL party speaker made our evenings enjoyable. We also made good use of the BBQ setup and compact party lawn. The 3 AC rooms were comfortable and well-maintained. The only minor issue was that the WiFi was a bit slow at times.",
      image: "/public/eastcoastvilla/EC1.jpg"
    },
    {
      id: 4,
      name: "Ananya Reddy",
      location: "Hyderabad",
      date: "July 1, 2025",
      rating: 5,
      property: "Ram Water Villa",
      review: "Ram Water Villa was an excellent choice for our family vacation. The 5 AC rooms were spacious and comfortable. We loved the private beach access and spent most of our time between the beach and the private swimming pool. The caretaker was very attentive and made sure we had everything we needed.",
      image: "/public/ramwatervilla/villa1.jpg"
    },
    {
      id: 5,
      name: "Vikram Mehta",
      location: "Chennai",
      date: "June 7, 2025",
      rating: 4,
      property: "Amrith Palace",
      review: "We booked Amrith Palace for a corporate retreat and it was a fantastic experience. The 9 AC rooms accommodated our entire team comfortably. The outdoor games kept everyone engaged during free time. The caretaker helped us arrange all our meals and was very responsive to our requests. Highly recommended for large groups!",
      image: "/public/AmrithPalace/AP2.jpg"
    },
    {
      id: 6,
      name: "Divya Singh",
      location: "Kolkata",
      date: "May 18, 2025",
      rating: 5,
      property: "East Coast Villa",
      review: "East Coast Villa was perfect for our small family gathering. The kids loved the swimming pool and the adults enjoyed the BBQ setup. The power backup was helpful as there was a brief power outage in the area during our stay. Overall a very comfortable and enjoyable experience.",
      image: "/public/eastcoastvilla/EC2.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={index < rating ? 'text-[#D4AF37]' : 'text-gray-300'}>★</span>
    ));
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-playfair font-bold text-gray-800 mb-4"
        >
          Guest Reviews
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-gray-600 max-w-3xl mx-auto"
        >
          Discover what our guests have to say about their experiences staying at our luxury properties.
          Authentic feedback from travelers who have enjoyed our premium accommodations and services.
        </motion.p>
      </div>

      {/* Review Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="bg-[#F6F9FC] rounded-xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between"
      >
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-playfair font-bold text-gray-800">4.9<span className="text-lg text-gray-500 font-normal">/5</span></h2>
          <div className="text-xl text-[#D4AF37] my-2">★★★★★</div>
          <p className="text-gray-600">Based on 120+ reviews</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-12">
          {[
            { label: "Cleanliness", value: "4.9" },
            { label: "Location", value: "4.8" },
            { label: "Value", value: "4.7" },
            { label: "Amenities", value: "4.9" },
            { label: "Staff", value: "4.9" },
            { label: "Overall", value: "4.9" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-medium text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        {/* Combine API reviews with static reviews */}
        {[...newReviews, ...staticReviews].map((review) => (
          <motion.div 
            key={review.id} 
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="h-56 overflow-hidden">
              <img 
                src={review.image} 
                alt={review.property} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg text-gray-800">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">{renderStars(review.rating)}</span>
                <span className="text-gray-600 text-sm">for {review.property}</span>
              </div>
              
              <p className="text-gray-700 mt-4">{review.review}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Submit Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-[#D4AF37] rounded-xl p-8 text-white mb-16"
      >
        <h2 className="text-2xl font-playfair font-bold mb-4 text-center">Share Your Experience</h2>
        <p className="mb-6 max-w-2xl mx-auto text-center">
          Have you stayed with us recently? We'd love to hear about your experience.
          Your feedback helps us improve and assists other travelers in making their decision.
        </p>

        {/* Review Form Card */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {!authToken && (
            <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-amber-700 text-sm">Please sign in to submit a review</p>
              </div>
              <Link to="/sign-in" className="text-sm font-medium text-[#D4AF37] hover:text-[#BFA181] transition-colors">
                Sign In
              </Link>
            </div>
          )}

          {reviewSubmitted && (
            <div className="bg-green-50 border-b border-green-100 p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="text-green-700">Thank you! Your review has been submitted successfully.</p>
              </div>
            </div>
          )}

          {submissionError && (
            <div className="bg-red-50 border-b border-red-100 p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-red-700">{submissionError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="villaName" className="block text-sm font-medium text-gray-700 mb-1">Villa Name*</label>
                <select
                  id="villaName"
                  name="villaName"
                  value={formData.villaName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  required
                >
                  <option value="">Select villa</option>
                  <option value="Amrith Palace">Amrith Palace</option>
                  <option value="Ram Water Villa">Ram Water Villa</option>
                  <option value="East Coast Villa">East Coast Villa</option>
                  <option value="Empire Anand Villa">Empire Anand Villa</option>
                  <option value="Lavish Villa 1">Lavish Villa 1</option>
                  <option value="Lavish Villa 2">Lavish Villa 2</option>
                  <option value="Lavish Villa 3">Lavish Villa 3</option>
                </select>
              </div>
              <div>
                <label htmlFor="daysStayed" className="block text-sm font-medium text-gray-700 mb-1">Days Stayed*</label>
                <input
                  type="number"
                  id="daysStayed"
                  name="daysStayed"
                  min="1"
                  max="90"
                  value={formData.daysStayed}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Number of days"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating*</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${formData.rating >= star ? 'text-[#D4AF37]' : 'text-gray-300'} transition-colors`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Average"}
                  {formData.rating === 4 && "Good"}
                  {formData.rating === 5 && "Excellent"}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">Your Review*</label>
              <textarea
                id="reviewText"
                name="reviewText"
                rows="5"
                value={formData.reviewText}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                placeholder="Share your experience at our luxury villa..."
                required
                minLength="20"
                maxLength="500"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {formData.reviewText.length}/500 characters
              </p>
            </div>

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmittingReview || !authToken}
                whileHover={{ scale: authToken ? 1.02 : 1 }}
                whileTap={{ scale: authToken ? 0.98 : 1 }}
                className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                  !authToken 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#D4AF37] text-white hover:bg-[#BFA181] transition-colors'
                }`}
              >
                {isSubmittingReview ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Review Policy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden max-w-3xl mx-auto"
      >
        <div className="p-8">
          <h2 className="text-xl font-playfair font-bold text-gray-800 mb-4">Our Review Policy</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-1">✓</span>
              <span className="text-gray-700">All reviews are from verified guests who have stayed at our properties</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-1">✓</span>
              <span className="text-gray-700">Reviews are published without any editing, though we reserve the right to remove inappropriate content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-1">✓</span>
              <span className="text-gray-700">We respond to all reviews, especially those highlighting areas for improvement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] mt-1">✓</span>
              <span className="text-gray-700">Reviews are published within 14 days of submission after verification</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default GuestReviews;
