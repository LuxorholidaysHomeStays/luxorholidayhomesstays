import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      // Admin authentication - handle it locally without backend
      if (email === 'admin@gmail.com' && password === 'admin321') {
        const adminData = {
          email: 'admin@gmail.com',
          name: 'Admin',
          isAdmin: true,
          role: 'admin'
        };
        
        const adminToken = 'admin-token-' + Date.now();
        
        // Save to localStorage
        localStorage.setItem('authToken', adminToken);
        localStorage.setItem('userData', JSON.stringify(adminData));
        
        // Update state
        setAuthToken(adminToken);
        setUserData(adminData);
        return { success: true, isAdmin: true };
      }

      // For regular users, continue with your existing logic
      // ...existing login code...
      
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if the email is the admin email
      if (result.user.email === 'luxorholidayhomestays@gmail.com') {
        const adminData = {
          email: result.user.email,
          name: result.user.displayName,
          isAdmin: true,
          role: 'admin',
          photoURL: result.user.photoURL
        };
        
        const adminToken = result.user.accessToken;
        
        // Save to localStorage
        localStorage.setItem('authToken', adminToken);
        localStorage.setItem('userData', JSON.stringify(adminData));
        
        // Update state
        setAuthToken(adminToken);
        setUserData(adminData);
        return { success: true, isAdmin: true };
      }

      // For regular users
      const userData = {
        email: result.user.email,
        name: result.user.displayName,
        isAdmin: false,
        role: 'user',
        photoURL: result.user.photoURL
      };

      setUserData(userData);
      setAuthToken(result.user.accessToken);
      localStorage.setItem('authToken', result.user.accessToken);
      localStorage.setItem('userData', JSON.stringify(userData));

      return { success: true, isAdmin: false };
    } catch (error) {
      console.error('Google Sign-in error:', error);
      return { success: false, message: 'Google Sign-in failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setAuthToken(null);
    setUserData(null);
    auth.signOut();
  };

  const value = {
    authToken,
    setAuthToken,
    userData,
    setUserData,
    user: userData,
    login,
    handleGoogleSignIn,
    logout,
    loading,
    isAuthenticated: !!authToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// In your SignIn component
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const result = await login(email, password);
    
    if (result.success) {
      if (result.isAdmin) {
        // Admin login successful
        navigate('/dashboard');
        return;
      }
      
      // Regular user login success
      handleSuccessfulLogin();
    } else {
      setError(result.message || 'Invalid email or password');
    }
  } catch (err) {
    setError('An error occurred during login');
  } finally {
    setLoading(false);
  }
};