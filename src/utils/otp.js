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
export const setupRecaptcha = (elementId) => {
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
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'normal', // Make it visible for testing
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
    
    throw error;
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
    
    const result = await confirmationResult.confirm(otp);
    console.log('OTP verified successfully');
    return result;
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

export { auth };
export default otpApp;