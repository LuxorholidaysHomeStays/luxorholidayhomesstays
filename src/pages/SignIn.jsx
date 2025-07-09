import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { signInWithGoogle } from '../utils/firebase';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '../context/ToastContext';
import { setupRecaptcha, sendOTP, verifyOTP } from '../utils/otp';

const SignIn = () => {
  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); // Default to India
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [firebaseUserData, setFirebaseUserData] = useState(null);
  const [isEmailStep, setIsEmailStep] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  const { setAuthToken, setUserData, handleGoogleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isRedirectFromBooking = searchParams.get('redirect') === 'booking';
  const { addToast } = useToast();

  // Country codes list
  const countryCodes = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
    { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+977', name: 'Nepal', flag: '🇳🇵' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+51', name: 'Peru', flag: '🇵🇪' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷' },
    { code: '+98', name: 'Iran', flag: '🇮🇷' },
    { code: '+964', name: 'Iraq', flag: '🇮🇶' },
    { code: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', name: 'Austria', flag: '🇦🇹' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+48', name: 'Poland', flag: '🇵🇱' },
    { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
    { code: '+36', name: 'Hungary', flag: '🇭🇺' },
    { code: '+30', name: 'Greece', flag: '🇬🇷' },
  ];
  
  // Function to handle post-login navigation
  const handleSuccessfulLogin = () => {
    // First check for auth redirect URL
    const redirectUrl = localStorage.getItem("authRedirectUrl");
    if (redirectUrl) {
      localStorage.removeItem("authRedirectUrl");
      navigate(redirectUrl);
      return;
    }
    
    // Then check for location state redirect
    const fromLocation = location.state?.from;
    if (fromLocation) {
      navigate(fromLocation);
      return;
    }
    
    // Then check for pending booking redirect
    const pendingBooking = localStorage.getItem('pendingBooking');
    
    if (pendingBooking && isRedirectFromBooking) {
      try {
        const bookingData = JSON.parse(pendingBooking);
        
        if (bookingData.returnUrl) {
          // Navigate back to the specific villa details page
          navigate(bookingData.returnUrl);
          return;
        } else if (bookingData.villaId) {
          // If no return URL but we have villa ID, construct the URL
          navigate(`/villas/${bookingData.villaId}`);
          return;
        }
      } catch (error) {
        console.error("Error parsing pending booking data:", error);
      }
    }
    
    // Default redirect to home
    navigate('/');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validation
      if (!isLogin && password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }
      
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Add special handling for user not found
        if (data.code === 'USER_NOT_FOUND') {
          addToast('User does not exist. Please sign up instead.', 'error');
          // Optional: Switch to sign up mode
          setIsLogin(false);
          return;
        }
        
        throw new Error(data.error || 'Authentication failed');
      }
      
      // Check if OTP verification is required
      if (data.requiresVerification) {
        // Store email in session storage for OTP verification page
        sessionStorage.setItem('verificationEmail', email);
        
        // If registration requires verification (OTP), redirect to verification page
        setSuccess("Verification code sent to your email.");
        
        // Add a small delay before navigation to show the success message
        setTimeout(() => {
          navigate('/verify-otp', { state: { email, isRegistration: !isLogin } });
        }, 1000);
        return;
      }
      
      // If no verification required, proceed with normal login
      
      // Store auth token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user._id || data.user.id);
      localStorage.setItem('userEmail', data.user.email);
      
      // Update auth context
      setAuthToken(data.token);
      setUserData(data.user);
      
      // Show success message
      setSuccess(isLogin ? "Login successful!" : "Account created successfully!");
      
      // Add a small delay before navigation to show the success message
      setTimeout(() => {
        handleSuccessfulLogin();
      }, 1000);
      
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Google sign-in handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await handleGoogleSignIn();
      console.log("Google sign-in result:", result); // Debug log
      
      if (result.success) {
        // Add a success toast message
        addToast(result.isAdmin ? 'Admin login successful!' : 'Login successful!', 'success');
        
        // Special handling for admin users
        if (result.isAdmin) {
          console.log("Admin detected, navigating to admin dashboard");
          // Use /owner instead of /dashboard (adjust this to match your actual admin route)
          setTimeout(() => {
            navigate('/owner');
          }, 500);
        } else {
          // Regular user flow
          handleSuccessfulLogin();
        }
      } else {
        addToast(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      addToast('An error occurred during login', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setPhoneNumber('');
    setCountryCode('+91'); // Reset to default
    setOtp('');
    setShowOtpInput(false);
    setConfirmationResult(null);
  };

  // Toggle between email and phone authentication
  const toggleAuthMethod = () => {
    setAuthMethod(authMethod === 'email' ? 'phone' : 'email');
    setError('');
    setSuccess('');
    setPhoneNumber('');
    setCountryCode('+91'); // Reset to default
    setShowOtpInput(false);
    setConfirmationResult(null);
  };

  // Handle phone number submission and OTP sending
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate phone number
      const expectedLength = getExpectedPhoneLength();
      if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < expectedLength) {
        throw new Error(`Please enter a valid ${expectedLength}-digit phone number for ${countryCodes.find(c => c.code === countryCode)?.name || 'selected country'}`);
      }

      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Create full phone number with country code
      const fullPhoneNumber = `${countryCode}${cleanPhone}`;
      
      console.log('Sending OTP to:', fullPhoneNumber);

      // Setup reCAPTCHA
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      
      // Send OTP with full phone number
      const confirmationResult = await sendOTP(fullPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmationResult);
      setShowOtpInput(true);
      setSuccess('OTP sent successfully! Please check your phone.');
      
    } catch (error) {
      console.error('Phone auth error:', error);
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!confirmationResult) {
        throw new Error('Please request a new OTP first');
      }

      console.log('Verifying OTP with Firebase...');
      const result = await verifyOTP(confirmationResult, otp);
      const firebaseUser = result.user;

      console.log('✅ OTP verified with Firebase successfully');
      console.log('Firebase User:', firebaseUser.phoneNumber);

      // Save the firebase user data
      setFirebaseUserData(firebaseUser);
      
      // Check if this is a first-time user or existing user
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check-phone-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: firebaseUser.phoneNumber }),
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.isNewUser || !data.hasEmail) {
            // Show the email collection form
            setIsFirstTimeUser(true);
            setIsEmailStep(true);
            setLoading(false);
            return;
          }
        }
      } catch (checkError) {
        console.warn('Error checking if user is new:', checkError);
        // Continue with normal flow if the check fails
      }

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Send to backend for verification and user login
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/phone-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken,
            phoneNumber: firebaseUser.phoneNumber,
            name: name || firebaseUser.displayName || `User_${firebaseUser.phoneNumber.slice(-4)}`
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Phone authentication failed');
        }

        // Store auth token
        localStorage.setItem('authToken', data.token);
        setAuthToken(data.token);
        setUserData(data.user);
        
        // Navigate to home page
        setSuccess('Phone verification successful!');
        setTimeout(() => navigate('/'), 1000);
        
      } catch (error) {
        console.error('Error during backend verification:', error);
        setError('Login failed: ' + (error.message || 'Server error'));
      }
      
    } catch (error) {
      console.error('OTP verification error:', error);
      
      if (error.code === 'auth/code-expired') {
        setError('Verification code has expired. Please request a new code.');
      } else {
        setError(error.message || 'Verification failed. Please try again.');
      }
      
      clearRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  // Add function to handle email and name submission
  const handleEmailNameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate email and name
      if (!userEmail || !userEmail.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!userName || userName.trim().length < 2) {
        throw new Error('Please enter your name (minimum 2 characters)');
      }
      
      if (!firebaseUserData) {
        throw new Error('Phone verification data is missing. Please try again.');
      }
      
      // Get ID token from Firebase
      const idToken = await firebaseUserData.getIdToken();
      
      // Update the user with email and name
      const response = await fetch(`${API_BASE_URL}/api/auth/phone-verify-with-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          phoneNumber: firebaseUserData.phoneNumber,
          email: userEmail,
          name: userName,
          isEmailVerified: true // For simplicity, we're not verifying email in this flow
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user information');
      }
      
      // Store auth token
      localStorage.setItem('authToken', data.token);
      setAuthToken(data.token);
      setUserData(data.user);
      
      // Show success and navigate to home
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/'), 1000);
      
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(error.message || 'Failed to update user information');
    } finally {
      setLoading(false);
    }
  };

  // Add function to skip the email step
  const handleSkipEmailStep = async () => {
    try {
      if (!firebaseUserData) {
        throw new Error('Phone verification data is missing. Please try again.');
      }
      
      // Get ID token from Firebase
      const idToken = await firebaseUserData.getIdToken();
      
      // Just do the normal phone verification without email/name
      const response = await fetch(`${API_BASE_URL}/api/auth/phone-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          phoneNumber: firebaseUserData.phoneNumber,
          name: `User_${firebaseUserData.phoneNumber.slice(-4)}`
        }),
      });
      
      const data = await response.json();
      
      // Store auth token
      localStorage.setItem('authToken', data.token);
      setAuthToken(data.token);
      setUserData(data.user);
      
      // Navigate to home
      setSuccess('Phone verification successful!');
      setTimeout(() => navigate('/'), 1000);
      
    } catch (error) {
      console.error('Error skipping email step:', error);
      setError('Failed to complete login. Please try again.');
    }
  };

  // Get placeholder text based on country code
  const getPhoneNumberPlaceholder = () => {
    switch (countryCode) {
      case '+1': return '(555) 123-4567';
      case '+44': return '7700 900123';
      case '+91': return '9876543210';
      case '+86': return '138 0013 8000';
      case '+81': return '90 1234 5678';
      case '+49': return '30 12345678';
      case '+33': return '6 12 34 56 78';
      case '+39': return '312 345 6789';
      case '+7': return '912 345 67 89';
      case '+55': return '11 99999 9999';
      case '+61': return '412 345 678';
      case '+34': return '612 34 56 78';
      case '+82': return '10 1234 5678';
      case '+65': return '8123 4567';
      case '+971': return '50 123 4567';
      case '+966': return '50 123 4567';
      case '+60': return '12 345 6789';
      case '+66': return '81 234 5678';
      case '+84': return '912 345 678';
      case '+62': return '812 3456 789';
      case '+63': return '917 123 4567';
      case '+880': return '1712 345678';
      case '+94': return '71 234 5678';
      case '+977': return '981 234 5678';
      case '+92': return '301 234 5678';
      default: return 'Phone number';
    }
  };

  // Get expected phone number length based on country code
  const getExpectedPhoneLength = () => {
    switch (countryCode) {
      case '+1': return 10;
      case '+44': return 10;
      case '+91': return 10;
      case '+86': return 11;
      case '+81': return 10;
      case '+49': return 10;
      case '+33': return 9;
      case '+39': return 10;
      case '+7': return 10;
      case '+55': return 11;
      case '+61': return 9;
      case '+34': return 9;
      case '+82': return 10;
      case '+65': return 8;
      case '+971': return 9;
      case '+966': return 9;
      case '+60': return 9;
      case '+66': return 9;
      case '+84': return 9;
      case '+62': return 10;
      case '+63': return 10;
      case '+880': return 10;
      case '+94': return 9;
      case '+977': return 10;
      case '+92': return 10;
      default: return 10;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-yellow-50 px-4 py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Indicator if redirected from booking */}
      {isRedirectFromBooking && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-md z-20">
          Log in to continue your booking
        </div>
      )}
      
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side: Auth form */}
        <div className="bg-white w-full md:w-1/2 p-8 lg:p-12" data-aos="fade-right">
          <div className="mb-8">
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-2 text-gray-600 hover:text-gray-800">Back to Home</span>
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mb-8">
            {isLogin ? 'Sign in to access your account' : 'Sign up to get started with Luxor Stays'}
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded" data-aos="fade-up">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded" data-aos="fade-up">
              <p className="font-medium">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          )}
          
          {/* Auth Method Toggle */}
          <div className="mb-6" data-aos="fade-up">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  authMethod === 'email'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  authMethod === 'phone'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Phone
              </button>
            </div>
          </div>

          {/* Phone Authentication Form */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              {!showOtpInput ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  {!isLogin && (
                    <div data-aos="fade-up" data-aos-delay="100">
                      <label htmlFor="phone-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="phone-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                          placeholder="John Smith"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div data-aos="fade-up" data-aos-delay="200">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex space-x-2">
                      {/* Country Code Selector */}
                      <div className="relative">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-3 pr-8 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 text-sm font-medium"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Phone Number Input */}
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                          placeholder={getPhoneNumberPlaceholder()}
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your phone number (format: {getPhoneNumberPlaceholder()})
                    </p>
                  </div>
                  
                  <div data-aos="fade-up" data-aos-delay="300">
                    {/* reCAPTCHA container */}
                    <div id="recaptcha-container" className="flex justify-center mb-4"></div>
                    
                    <button
                      type="submit"
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                        loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg hover:shadow-xl'
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          Sending OTP...
                        </div>
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOtpVerification} className="space-y-4">
                  <div data-aos="fade-up" data-aos-delay="100">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 text-center text-lg tracking-widest"
                        placeholder="000000"
                        maxLength="6"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter the 6-digit OTP sent to {countryCode} {phoneNumber}</p>
                  </div>
                  
                  <div className="flex space-x-3" data-aos="fade-up" data-aos-delay="200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpInput(false);
                        setOtp('');
                        setConfirmationResult(null);
                      }}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                        loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg hover:shadow-xl'
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          Verifying...
                        </div>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Email Authentication Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div data-aos="fade-up" data-aos-delay="100">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                      placeholder="John Smith"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div data-aos="fade-up" data-aos-delay={isLogin ? "100" : "200"}>
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
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>
              
              <div data-aos="fade-up" data-aos-delay={isLogin ? "200" : "300"}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              {!isLogin && (
                <div data-aos="fade-up" data-aos-delay="400">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
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
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              {isLogin && (
                <div className="flex items-center justify-between" data-aos="fade-up" data-aos-delay="300">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              )}
              
              <div data-aos="fade-up" data-aos-delay={isLogin ? "400" : "500"}>
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                    loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg hover:shadow-xl'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 text-center" data-aos="fade-up" data-aos-delay={isLogin ? "500" : "600"}>
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
          
          {/* Social Login Section */}
          <div className="mt-6" data-aos="fade-up" data-aos-delay="600">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors items-center"
                disabled={loading}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side: Image */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1561501900-3701fa6a0864?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')`
        }} data-aos="fade-left">
          <div className="w-full h-full bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-12">
            <div className="text-white" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl font-bold mb-3">Luxurious Villa Experiences</h3>
              <p className="mb-6">Experience the finest luxury villas and exceptional service with Luxor Holiday Home Stays.</p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 40}.jpg`}
                        alt={`User ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium">Joined by 10,000+ customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

// Add this to your auth context or utility file
export const storePhoneUserLocally = (firebaseUser, name) => {
  const phoneUserData = {
    _id: firebaseUser.uid,
    name: name || firebaseUser.displayName || `User_${firebaseUser.phoneNumber.slice(-4)}`,
    phoneNumber: firebaseUser.phoneNumber,
    email: `${firebaseUser.uid}@phone.local`,
    isVerified: true,
    isPhoneVerified: true,
    userType: 'phone',
    createdAt: new Date().toISOString(),
    firebaseUid: firebaseUser.uid
  };
  
  // Store in localStorage
  const existingPhoneUsers = JSON.parse(localStorage.getItem('phoneUsers') || '[]');
  const existingUserIndex = existingPhoneUsers.findIndex(u => u.phoneNumber === firebaseUser.phoneNumber);
  
  if (existingUserIndex >= 0) {
    existingPhoneUsers[existingUserIndex] = phoneUserData;
  } else {
    existingPhoneUsers.push(phoneUserData);
  }
  
  localStorage.setItem('phoneUsers', JSON.stringify(existingPhoneUsers));
  localStorage.setItem('currentPhoneUser', JSON.stringify(phoneUserData));
  
  return phoneUserData;
};

// Add this component to collect email and name from first-time phone users
const FirstTimePhoneUserForm = ({ firebaseUser, onComplete, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
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
        throw new Error('Please enter your full name');
      }
      
      // Send verification email
      const response = await fetch(`${API_BASE_URL}/api/auth/send-email-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          phoneNumber: firebaseUser.phoneNumber,
          name
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification email');
      }
      
      setVerificationSent(true);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!verificationCode || verificationCode.length !== 6) {
        throw new Error('Please enter the 6-digit verification code');
      }
      
      // Verify the email verification code
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          otp: verificationCode,
          phoneNumber: firebaseUser.phoneNumber,
          name,
          firebaseUid: firebaseUser.uid
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      // Pass the updated user data back
      onComplete({
        name,
        email,
        phoneNumber: firebaseUser.phoneNumber,
        isEmailVerified: true
      });
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-4 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Complete Your Profile
      </h3>
      <p className="text-gray-600 mb-6">
        Please provide your name and email to complete your account setup.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {!verificationSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="John Smith"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="example@email.com"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength="6"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code sent to {email}</p>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setVerificationSent(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};