// LuxorStay/src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

// Firebase must never throw at import time: this module is reached transitively
// from main.jsx, so a single unset env var would white-screen the whole public
// site. Instead we warn once and keep the Firebase features degraded/disabled.
let app = null;
let analytics = null;
let auth = null;
let googleProvider = null;

if (missingVars.length > 0) {
  console.warn(
    `[firebase] Google sign-in disabled: missing environment variables: ${missingVars.join(', ')}`
  );
} else {
  // Initialize Firebase
  app = initializeApp(firebaseConfig, 'luxor-main');

  // Only initialize analytics in the browser environment
  if (typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    analytics = getAnalytics(app);
  }

  // Initialize Firebase Auth
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

// Google Sign-In method
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Google sign-in is not available right now. Please use another sign-in method.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log("Firebase Google auth successful:", user);
    
    return {
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
      uid: user.uid,
      phoneNumber: user.phoneNumber
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Get current authenticated user
export const getCurrentUser = () => {
  return auth ? auth.currentUser : null;
};

export { app, auth, analytics };