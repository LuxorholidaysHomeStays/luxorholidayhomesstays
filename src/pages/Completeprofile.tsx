import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import auth context

const CompleteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneNumber, authToken, currentName, currentEmail, idToken } = location.state || {};
  const { setUserData, setAuthToken } = useAuth(); // Get auth context methods
  
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
      navigate('/login');
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
      
      // Send verification email
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-email-verification`, {
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
      
      // Verify OTP
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/phone-verify-with-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          phoneNumber,
          name,
          idToken, // Send Firebase token if available
          isEmailVerified: true
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
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
    } finally {
      setLoading(false);
    }
  };
  
  // Handle skip button with proper state management
  const handleSkip = () => {
    if (authToken) {
      // If we have an auth token, just navigate
      navigate('/');
    } else {
      // If we don't have auth token, we need to do basic phone verification
      handleBasicPhoneVerification();
    }
  };
  
  // Fallback for users who skip email verification
  const handleBasicPhoneVerification = async () => {
    try {
      setLoading(true);
      
      if (!idToken || !phoneNumber) {
        throw new Error('Missing verification data');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/phone-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          phoneNumber,
          name: name || currentName || `User_${phoneNumber.slice(-4)}`
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      // Store token and update context
      localStorage.setItem('authToken', data.token);
      setAuthToken(data.token);
      setUserData(data.user);
      
      navigate('/');
      
    } catch (error) {
      setError('Failed to complete profile: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
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
            {loading ? 'Sending...' : 'Verify Email'}
          </button>
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
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition duration-200"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Complete Profile'}
          </button>
        </form>
      )}
      
      <div className="mt-4 text-center">
        <button
          onClick={handleSkip}
          className="text-yellow-600 hover:text-yellow-700"
          disabled={loading}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;