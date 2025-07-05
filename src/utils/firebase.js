// LuxorStay/src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5kBbalHfhAVDmwMyuX56BDJ64nX-drA4",
  authDomain: "luxorstayhomes.firebaseapp.com",
  projectId: "luxorstayhomes",
  storageBucket: "luxorstayhomes.firebasestorage.app",
  messagingSenderId: "583547923942",
  appId: "1:583547923942:web:2a6190ea978452543cba27",
  measurementId: "G-JCER68LZ3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;

// Only initialize analytics in the browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In method
export const signInWithGoogle = async () => {
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
  return auth.currentUser;
};

export { app, auth, analytics };