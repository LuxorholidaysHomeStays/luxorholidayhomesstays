import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const VerifyOTP = () => {
  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthToken, setUserData } = useAuth();
  
  // Get state params or fallback to sessionStorage
  const email = location.state?.email || sessionStorage.getItem('verificationEmail') || '';
  const isRegistration = location.state?.isRegistration ?? false;
  const isPasswordReset = location.state?.isPasswordReset ?? false;
  
  if (!email) {
    // Redirect to sign-in if no email is provided
    useEffect(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No email provided for verification',
        confirmButtonColor: '#10b981'
      }).then(() => {
        navigate('/sign-in');
      });
    }, [navigate]);
  }
  
  // OTP input state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(60); // 60 seconds timeout
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(isPasswordReset);
  
  // References for OTP inputs
  const otpInputs = useRef([]);
  
  // Timer for resend OTP button
  useEffect(() => {
    let timer;
    if (resendTimeout > 0) {
      timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimeout]);
  
  // Handler for OTP input
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    
    // Allow only numeric input
    if (value && !/^\d+$/.test(value)) return;
    
    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Take only one character
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };
  
  // Handle key events for navigation between inputs
  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };
  
  // Handle OTP paste (e.g., from email)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d+$/.test(pastedData)) { // Check if it contains only digits
      const otpDigits = pastedData.slice(0, 6).split('');
      
      // Fill the available OTP inputs
      const newOtp = [...otp];
      otpDigits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      
      setOtp(newOtp);
      
      // Focus on the next empty input or the last one
      const lastFilledIndex = Math.min(otpDigits.length, 5);
      if (otpInputs.current[lastFilledIndex]) {
        otpInputs.current[lastFilledIndex].focus();
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convert OTP array to string
      const otpString = otp.join('');
      
      if (otpString.length !== 6) {
        throw new Error('Please enter the complete 6-digit verification code');
      }
      
      if (isPasswordReset) {
        // Additional validation for password reset
        if (!newPassword) {
          throw new Error('Please enter a new password');
        }
        
        if (newPassword.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Verify OTP and reset password
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            otp: otpString,
            newPassword
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify code or reset password');
        }
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'Your password has been reset successfully. Please sign in with your new password.',
          confirmButtonColor: '#10b981'
        }).then(() => {
          // Clear verification email from session
          sessionStorage.removeItem('verificationEmail');
          // Navigate to sign in page
          navigate('/sign-in');
        });
        
      } else {
        // Verify OTP for registration
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            otp: otpString,
            purpose: isRegistration ? 'registration' : 'login'
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Invalid verification code');
        }
        
        // Store auth token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user._id || data.user.id);
        localStorage.setItem('userEmail', data.user.email);
        
        // Update auth context
        setAuthToken(data.token);
        setUserData(data.user);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: isRegistration ? 'Registration Complete' : 'Verification Complete',
          text: isRegistration 
            ? 'Your account has been successfully created and verified.' 
            : 'Your account has been verified successfully.',
          confirmButtonColor: '#10b981'
        }).then(() => {
          // Clear verification email from session
          sessionStorage.removeItem('verificationEmail');
          // Navigate to home page
          navigate('/');
        });
      }
      
    } catch (error) {
      console.error("Verification error:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.message || 'Invalid verification code. Please try again.',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          purpose: isPasswordReset ? 'password-reset' : 'registration'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }
      
      // Reset OTP inputs
      setOtp(['', '', '', '', '', '']);
      
      // Reset resend timer
      setResendTimeout(60);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Verification Code Sent',
        text: 'A new verification code has been sent to your email.',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true
      });
      
    } catch (error) {
      console.error("Resend OTP error:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to resend verification code',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setResendLoading(false);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isPasswordReset ? 'Reset Your Password' : 'Verify Your Email'}
            </h2>
            <p className="text-gray-600">
              {isPasswordReset 
                ? 'Enter the verification code sent to your email and set a new password' 
                : 'Enter the verification code sent to your email'}
            </p>
            <p className="text-sm font-medium text-emerald-600 mt-2">{email}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div data-aos="fade-up" data-aos-delay="100">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <div className="flex gap-2 justify-center mb-1">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={el => otpInputs.current[index] = el}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : null}
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    required
                  />
                ))}
              </div>
              <div className="text-center mt-3">
                <p className="text-sm text-gray-500">
                  Didn't receive the code?{' '}
                  {resendTimeout > 0 ? (
                    <span className="text-gray-400">
                      Resend in {resendTimeout}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendLoading}
                      className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                      {resendLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </p>
              </div>
            </div>
            
            {isPasswordReset && (
              <>
                <div data-aos="fade-up" data-aos-delay="200">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      placeholder="••••••••"
                      required={isPasswordReset}
                      minLength={8}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div data-aos="fade-up" data-aos-delay="300">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      placeholder="••••••••"
                      required={isPasswordReset}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div data-aos="fade-up" data-aos-delay={isPasswordReset ? "400" : "200"}>
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
                    Verifying...
                  </div>
                ) : (
                  isPasswordReset ? 'Reset Password' : 'Verify Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;