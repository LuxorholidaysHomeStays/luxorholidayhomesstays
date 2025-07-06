import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const OTPVerification = () => {
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

  // Alert and redirect if no email is provided
  useEffect(() => {
    if (!email) {        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No email provided for verification',
          confirmButtonColor: '#ca8a04'
        }).then(() => {
        navigate('/sign-in');
      });
    }
  }, [email, navigate]);
  
  // OTP input state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(60);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
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

  // Clear error when OTP changes
  useEffect(() => {
    if (error && otp.some(digit => digit !== '')) {
      setError('');
    }
  }, [otp, error]);
  
  // Handle OTP input changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (value && !/^\d+$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Take only one character
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };
  
  // Handle backspace and arrow key navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        otpInputs.current[index - 1].focus();
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };
  
  // Handle paste event for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d+$/.test(pastedData)) {
      // Only use digits and limit to 6 characters
      const otpDigits = pastedData.slice(0, 6).split('');
      const newOtp = [...otp];
      
      otpDigits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      
      setOtp(newOtp);
      
      // Focus on appropriate input after paste
      const lastIndex = Math.min(otpDigits.length, 5);
      if (otpInputs.current[lastIndex]) {
        otpInputs.current[lastIndex].focus();
      }
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Get complete OTP string
      const otpString = otp.join('');
      
      // Validate OTP format
      if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
        throw new Error('Please enter a complete 6-digit verification code');
      }
      
      let endpoint, requestData;
      
      // Choose the right endpoint and data structure based on the purpose
      if (isPasswordReset) {
        // Validate password for reset flow
        if (!newPassword) {
          throw new Error('Please enter a new password');
        }
        
        if (newPassword.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        endpoint = '/api/auth/verify-reset-otp';
        requestData = { email, otp: otpString, newPassword };
        
      } else if (isRegistration) {
        // For registration verification
        endpoint = '/api/auth/verify-registration-otp'; 
        requestData = { email, otp: otpString };
        
      } else {
        // For login verification
        endpoint = '/api/auth/verify-otp';
        requestData = { email, otp: otpString, purpose: 'login' };
      }
      
      console.log(`Sending verification request to ${endpoint}:`, requestData);
      
      // Make the API request
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      // Check for non-JSON response
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Non-JSON response:", responseText);
        throw new Error("Server returned an invalid response format");
      }
      
      const data = await response.json();
      console.log("Verification response:", data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to verify code');
      }
      
      // Handle success based on verification type
      if (isPasswordReset) {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'Your password has been reset successfully. Please sign in with your new password.',
          confirmButtonColor: '#ca8a04'
        }).then(() => {
          sessionStorage.removeItem('verificationEmail');
          navigate('/sign-in');
        });
      } else {
        // For login/registration success
        // Store auth token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user._id || data.user.id);
        localStorage.setItem('userEmail', data.user.email);
        
        // Update auth context
        setAuthToken(data.token);
        setUserData(data.user);
        
        // Show success message and redirect
        Swal.fire({
          icon: 'success',
          title: isRegistration ? 'Registration Complete' : 'Verification Complete',
          text: isRegistration 
            ? 'Your account has been successfully created and verified.' 
            : 'Your account has been verified successfully.',
          confirmButtonColor: '#ca8a04'
        }).then(() => {
          sessionStorage.removeItem('verificationEmail');
          navigate('/');
        });
      }
      
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.message);
      
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.message || 'Invalid verification code. Please try again.',
        confirmButtonColor: '#ca8a04'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      // Clear existing OTP
      setOtp(['', '', '', '', '', '']);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          purpose: isPasswordReset ? 'password-reset' : (isRegistration ? 'registration' : 'login')
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }
      
      // Reset resend timer
      setResendTimeout(60);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Verification Code Sent',
        text: 'A new verification code has been sent to your email.',
        confirmButtonColor: '#ca8a04',
        timer: 3000,
        timerProgressBar: true
      });
      
      // Focus on first OTP input
      if (otpInputs.current[0]) {
        otpInputs.current[0].focus();
      }
      
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.message);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to resend verification code',
        confirmButtonColor: '#ca8a04'
      });
    } finally {
      setResendLoading(false);
    }
  };    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-yellow-50 px-4 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-700 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isPasswordReset ? 'Reset Your Password' : 'Verify Your Email'}
            </h2>
            <p className="text-gray-600">
              {isPasswordReset 
                ? 'Enter the verification code sent to your email and create a new password' 
                : 'Enter the verification code sent to your email to complete your ' + (isRegistration ? 'registration' : 'login')}
            </p>
            <p className="text-sm font-medium text-yellow-700 mt-2">{email}</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div data-aos="fade-up" data-aos-delay="100">
              <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700 mb-3">
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
                    aria-label={`Digit ${index + 1} of verification code`}
                    className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
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
                      className="font-medium text-yellow-700 hover:text-yellow-600 transition-colors"
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
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                      placeholder="••••••••"
                      required={isPasswordReset}
                      minLength={8}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters
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
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
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
                  : 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg hover:shadow-xl'
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
                  isPasswordReset ? 'Reset Password' : 'Verify Code'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;