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
      
      // Use the new endpoint for profile completion
      const response = await fetch(`${API_BASE_URL}/api/complete/profile/email/verify`, {
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
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification email');
      }
      
      setIsVerificationSent(true);
      setSuccess('Verification code sent to your email');
      
    } catch (error) {
      setError(error.message || 'Something went wrong');
      console.error('Error sending verification email:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit verification code');
      }
      
      // Use the new endpoint for profile update
      const response = await fetch(`${API_BASE_URL}/api/complete/profile/email/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          email,
          otp,
          phoneNumber,
          name
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      // Update user data in context and localStorage
      if (authToken) {
        setUserData({
          ...data.user,
          isEmailVerified: true
        });
      }
      
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
  
  // Function to handle cases where email verification is skipped
  const handleSkipVerification = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/complete/profile/email/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          email,
          phoneNumber,
          name,
          skipVerification: true
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      if (authToken) {
        setUserData({
          ...data.user,
          isEmailVerified: false
        });
      }
      
      setSuccess('Profile updated! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Failed to update profile');
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
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Verify Email'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="otp">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              <p className="mt-2 text-sm text-gray-600">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Complete Profile'}
              </button>
              
              <button
                type="button"
                onClick={handleSkipVerification}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                disabled={loading}
              >
                Complete profile without verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompleteProfile;