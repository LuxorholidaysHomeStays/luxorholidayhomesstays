// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase configuration for OTP/Phone authentication from environment variables
const otpFirebaseConfig = {
  apiKey: import.meta.env.VITE_OTP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_OTP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_OTP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_OTP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_OTP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_OTP_FIREBASE_APP_ID
};

// Validate OTP Firebase environment variables
const requiredOtpEnvVars = [
  'VITE_OTP_FIREBASE_API_KEY',
  'VITE_OTP_FIREBASE_AUTH_DOMAIN',
  'VITE_OTP_FIREBASE_PROJECT_ID',
  'VITE_OTP_FIREBASE_STORAGE_BUCKET',
  'VITE_OTP_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_OTP_FIREBASE_APP_ID'
];

const missingOtpVars = requiredOtpEnvVars.filter(varName => !import.meta.env[varName]);
if (missingOtpVars.length > 0) {
  console.error('Missing OTP Firebase environment variables:', missingOtpVars);
  throw new Error(`Missing required OTP Firebase environment variables: ${missingOtpVars.join(', ')}`);
}

// Initialize Firebase OTP app (singleton pattern to prevent duplicate apps)
let otpApp;
const OTP_APP_NAME = 'luxor-otp';

try {
  // Check if the OTP app is already initialized
  const existingApps = getApps();
  const existingOtpApp = existingApps.find(app => app.name === OTP_APP_NAME);
  
  if (existingOtpApp) {
    otpApp = existingOtpApp;
  } else {
    otpApp = initializeApp(otpFirebaseConfig, OTP_APP_NAME);
  }
} catch (error) {
  console.error('Firebase OTP app initialization error:', error);
  // Try to get the existing app as fallback
  try {
    otpApp = getApp(OTP_APP_NAME);
  } catch (getAppError) {
    console.error('Failed to get existing OTP app:', getAppError);
    throw new Error('Failed to initialize Firebase OTP app');
  }
}

const auth = getAuth(otpApp);

// Phone authentication functions
export const setupRecaptcha = (elementId, options = {}) => {
  try {
    // Clear existing recaptcha verifier if it exists
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (clearError) {
        console.log('Previous recaptcha cleared');
      }
      window.recaptchaVerifier = null;
    }
    
    // Check if element exists in DOM
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }
    
    // Default to invisible for OTP verification step
    const size = options.invisible ? 'invisible' : 'normal';
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: size, // Can be 'invisible' or 'normal'
      theme: 'light',
      badge: 'bottomright',
      callback: (response) => {
        console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
      'error-callback': (error) => {
        console.error('reCAPTCHA error:', error);
      }
    });
    
    return window.recaptchaVerifier;
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    throw error;
  }
};

export const sendOTP = async (phoneNumber, recaptchaVerifier) => {
  try {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      throw new Error('Invalid phone number');
    }
    
    // Format phone number - should already include country code from frontend
    let formattedPhone = phoneNumber;
    
    // Ensure it starts with + if not already
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }
    
    console.log('Sending OTP to:', formattedPhone);
    
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    console.log('OTP sent successfully');
    
    // Store timestamp to track session lifetime
    const sessionTimestamp = Date.now();
    confirmationResult._sessionTimestamp = sessionTimestamp;
    
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Clear recaptcha on error to allow retry
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      } catch (clearError) {
        console.log('Recaptcha cleared after error');
      }
    }
    
    // Enhance error messages for common Firebase errors
    if (error.code === 'auth/captcha-check-failed') {
      throw new Error('Captcha verification failed. Please try again.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('The phone number format is incorrect. Please check and try again.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('Too many requests. Please try again later.');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This phone number has been disabled. Please contact support.');
    } else {
      throw error;
    }
  }
};

export const verifyOTP = async (confirmationResult, otp) => {
  try {
    if (!confirmationResult) {
      throw new Error('No confirmation result available');
    }
    
    if (!otp || otp.length !== 6) {
      throw new Error('Invalid OTP format');
    }
    
    // Try to confirm the OTP
    try {
      const result = await confirmationResult.confirm(otp);
      console.log('OTP verified successfully');
      return result;
    } catch (confirmError) {
      // Check for specific Firebase error codes
      if (confirmError.code === 'auth/session-expired') {
        console.error('Firebase session expired during OTP verification');
        // Create a clearer error with the SESSION_EXPIRED code for our app
        const sessionError = new Error('Your verification session has expired. Please request a new code.');
        sessionError.code = 'auth/session-expired';
        throw sessionError;
      } else if (confirmError.code === 'auth/code-expired') {
        console.error('Firebase OTP code expired');
        const codeError = new Error('Your verification code has expired. Please request a new code.');
        codeError.code = 'auth/code-expired';
        throw codeError;
      } else {
        // For other errors, just rethrow
        throw confirmError;
      }
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Cleanup function to clear recaptcha
export const clearRecaptcha = () => {
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  } catch (error) {
    console.log('Recaptcha cleanup completed');
  }
};

// Helper to check if a session might be expired (Firebase sessions typically last 1 hour)
export const isSessionLikelyExpired = (confirmationResult) => {
  if (!confirmationResult || !confirmationResult._sessionTimestamp) {
    // No timestamp found, conservatively assume it might be expired
    return true;
  }
  
  const now = Date.now();
  const sessionAge = now - confirmationResult._sessionTimestamp;
  const MAX_SESSION_AGE_MS = 55 * 60 * 1000; // 55 minutes (just under Firebase's 1 hour)
  
  return sessionAge > MAX_SESSION_AGE_MS;
};

// Setup a hidden recaptcha for verification step
export const setupHiddenRecaptcha = (elementId) => {
  return setupRecaptcha(elementId, { invisible: true });
};

export { auth };
export default otpApp;