import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          // Token might be invalid, clear it
          localStorage.removeItem('authToken');
          setAuthToken(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authToken]);

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setAuthToken(null);
    setUserData(null);
  };

  // In the login function, add support for redirection
  const login = async (email, password) => {
    // ...existing login logic...

    // After successful login and setting userData/token

    // Check if there's a pending booking to return to
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      // Don't remove it here - we'll let the VillaDetails component handle it
      // This ensures the data is available when the component mounts
      console.log("Found pending booking after login");
    }

    // ...rest of the function...
  };

  const value = {
    authToken,
    setAuthToken,
    userData,
    setUserData,
    loading,
    logout,
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