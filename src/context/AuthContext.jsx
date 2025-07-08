import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this state

  // This effect runs once on component mount and when auth token changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem("authToken");
        const userDataStr = localStorage.getItem("userData");
        
        let isValid = false;
        let parsedUserData = null;
        
        if (token && token !== "null" && token !== "undefined") {
          // Try to parse user data
          if (userDataStr) {
            try {
              parsedUserData = JSON.parse(userDataStr);
              setUserData(parsedUserData);
            } catch (err) {
              console.error("Error parsing user data:", err);
            }
          }
          
          // If we have a token and either user data or userId, consider auth valid
          isValid = !!token && (!!parsedUserData || localStorage.getItem("userId"));
        }
        
        // Update authentication state
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, [authToken]); // Only depend on authToken

  // Define checkAuthStatus as a function that returns the current state
  // but DOESN'T update state (to avoid infinite loops)
  const checkAuthStatus = () => {
    return isAuthenticated;
  };
  
  const login = async (email, password) => {
    try {
      // Admin authentication - handle it locally without backend
      if (email === "admin@gmail.com" && password === "admin321") {
        const adminData = {
          email: "admin@gmail.com",
          name: "Admin",
          isAdmin: true,
          role: "admin"
        };
        
        const adminToken = "admin-token-" + Date.now();
        
        // Save to localStorage
        localStorage.setItem("authToken", adminToken);
        localStorage.setItem("userData", JSON.stringify(adminData));
        
        // Update state
        setAuthToken(adminToken);
        setUserData(adminData);
        return { success: true, isAdmin: true };
      }

      // For regular users, continue with your existing logic
      // ...existing login code...
      
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    }
  };

  // Update handleGoogleSignIn in AuthContext.jsx to better handle admin detection
  const handleGoogleSignIn = async () => {
    try {
      // Get Google user info
      const googleUserInfo = await signInWithPopup(auth, new GoogleAuthProvider());
      
      if (!googleUserInfo || !googleUserInfo.user.email) {
        console.error("Failed to get user info from Google");
        return { success: false, message: "Google authentication failed" };
      }
      
      console.log("Google auth success for email:", googleUserInfo.user.email);
      
      // Call your backend's syncUser endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: googleUserInfo.user.email,
          name: googleUserInfo.user.displayName || googleUserInfo.user.email.split('@')[0]
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store authentication data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Update auth context
        setAuthToken(data.token);
        setUserData(data.user);
        
        // Check if admin
        const isAdmin = data.isAdmin || data.user.role === 'admin';
        console.log("Is admin user:", isAdmin);
        
        return {
          success: true,
          isAdmin: isAdmin,
          message: isAdmin ? 'Admin login successful' : 'Login successful'
        };
      } else {
        console.error("Backend authentication failed:", data.error);
        return { success: false, message: data.error || "Authentication failed" };
      }
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { success: false, message: "An error occurred during authentication" };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setAuthToken(null);
    setUserData(null);
    auth.signOut();
  };

  // When setting auth token, also update localStorage
  const updateAuthToken = (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
  };
  
  // When updating user data, also update localStorage
  const updateUserData = (data) => {
    if (data) {
      localStorage.setItem("userData", JSON.stringify(data));
    } else {
      localStorage.removeItem("userData");
    }
    setUserData(data);
  };
  
  // Add a refreshAuthStatus function to your AuthContext
  const refreshAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setAuthToken(null);
      setUserData(null);
      setLoading(false);
      return false;
    }
    
    try {
      // Verify token is valid with backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setAuthToken(token);
        setLoading(false);
        return true;
      } else {
        // Token invalid, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setAuthToken(null);
        setUserData(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error refreshing auth status:', error);
      setLoading(false);
      return false;
    }
  };

  // Use this in the useEffect of your AuthProvider
  useEffect(() => {
    refreshAuthStatus();
  }, []);

  // Now provide the value object with our state and functions
  const value = {
    authToken,
    setAuthToken: updateAuthToken, // Use our wrapped function
    userData,
    setUserData: updateUserData, // Use our wrapped function
    user: userData,
    handleGoogleSignIn,
    logout,
    loading,
    isAuthenticated, // Just use the state
    checkAuthStatus, // Provide the function for compatibility
    refreshAuthStatus, // Add this
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// In your SignIn component
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const result = await login(email, password);
    
    if (result.success) {
      if (result.isAdmin) {
        // Admin login successful
        navigate("/dashboard");
        return;
      }
      
      // Regular user login success
      handleSuccessfulLogin();
    } else {
      setError(result.message || "Invalid email or password");
    }
  } catch (err) {
    setError("An error occurred during login");
  } finally {
    setLoading(false);
  }
};



