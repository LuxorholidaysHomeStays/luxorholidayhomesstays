import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ForgotPassword = () => {
  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate email format
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      
      // Call the forgot password API endpoint
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process your request");
      }
      
      // Show success message
      setIsSubmitted(true);
      
      // Store email in session for OTP verification
      sessionStorage.setItem('verificationEmail', email);
      
      // Show success popup
      Swal.fire({
        icon: 'success',
        title: 'Verification Code Sent',
        text: 'We have sent a verification code to your email. Please check your inbox.',
        confirmButtonColor: '#10b981',
        timer: 5000
      }).then(() => {
        // Redirect to OTP verification page for password reset
        navigate('/verify-otp', { 
          state: { 
            email, 
            isPasswordReset: true 
          } 
        });
      });
      
    } catch (error) {
      console.error("Forgot password error:", error);
      
      // Show error popup with appropriate message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 px-4 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" data-aos="fade-up">
        <div className="p-8 lg:p-10">
          <div className="mb-6">
            <Link to="/sign-in" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">
              Enter your email and we'll send you a verification code to reset your password
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100" data-aos="fade-up">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-4">
                We have sent a verification code to <span className="font-medium">{email}</span>
              </p>
              <Link 
                to="/verify-otp" 
                state={{ email, isPasswordReset: true }}
                className="inline-block w-full py-3 px-4 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-300"
              >
                Enter Verification Code
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div data-aos="fade-up" data-aos-delay="100">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Please enter the email address associated with your account
                </p>
              </div>
              
              <div data-aos="fade-up" data-aos-delay="200">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                    loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 text-center text-sm text-gray-600" data-aos="fade-up" data-aos-delay="300">
            Remember your password? 
            <Link to="/sign-in" className="ml-1 font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;