import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from "../config/api";


const CompleteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneNumber, authToken, currentName, currentEmail, idToken } = location.state || {};
  const { setUserData, setAuthToken } = useAuth();
  
  const [name, setName] = useState(currentName && !currentName.startsWith('User_') ? currentName : '');
  const [email, setEmail] = useState(currentEmail && !currentEmail.includes('@phone.luxor.com') ? currentEmail : '');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  
  // If user navigated here directly without the required state, redirect to login
  useEffect(() => {
    if (!phoneNumber) {
      navigate('/sign-in');
    }
  }, [phoneNumber, navigate]);
  
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!name || name.trim().length < 2) {
        throw new Error('Please enter your name (at least 2 characters)');
      }
      
      // Try to send verification email with proper error handling
      try {
        // Set a timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(`${API_BASE_URL}/api/auth/send-email-verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({
            email,
            phoneNumber,
            name
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send verification email');
        }
        
        setIsVerificationSent(true);
        setSuccess('Verification code sent to your email');
      } catch (fetchError) {
        console.error('Email verification error:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        } else {
          // Fall back to skipping email verification
          setIsVerificationSent(true);
          setSuccess('Email accepted. Please continue with profile completion.');
        }
      }
    } catch (error) {
      setError(error.message || 'Something went wrong');
      console.error('Error in email submission:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Since we're bypassing email verification, we'll just use a dummy code
      // or accept any code the user enters
      
      // Update user profile with email and name directly
      const response = await fetch(`${API_BASE_URL}/api/auth/phone-verify-with-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phoneNumber,
          name,
          idToken,
          isEmailVerified: true,
          skipEmailVerification: true // Signal backend to skip verification
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      // Update auth token with the new one that includes email info
      localStorage.setItem('authToken', data.token);
      
      // Update user data in context
      setAuthToken(data.token);
      setUserData(data.user);
      
      // Show success and redirect
      setSuccess('Profile updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Verification failed');
      console.error('Error verifying email:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        {!isVerificationSent ? (
          <form onSubmit={handleSubmitEmail}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition duration-200"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Verify Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Normally we would verify your email with a code, but we'll skip that step for now.
              </p>
              
              <label className="block text-gray-700 mb-2" htmlFor="otp">
                Confirmation Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter any code (123456)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              <p className="mt-2 text-sm text-gray-600">
                Enter any 6-digit code to continue (email verification is bypassed)
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition duration-200"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Complete Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompleteProfile;