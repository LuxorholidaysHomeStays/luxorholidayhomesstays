import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AuthGuard component to protect routes requiring authentication
 * Redirects to login if user is not authenticated
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading, refreshAuthStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!isAuthenticated) {
          // Try refreshing auth status first
          const isValid = await refreshAuthStatus();
          
          if (!isValid) {
            // Save current location for redirect after login
            localStorage.setItem("authRedirectUrl", location.pathname);
            // Redirect to login
            navigate("/sign-in", { 
              state: { from: location.pathname },
              replace: true
            });
          }
        }
        // Checking complete
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, loading, navigate, location.pathname, refreshAuthStatus]);
  
  // Show loading spinner while checking
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Verifying account...</p>
        </div>
      </div>
    );
  }
  
  // If we get here, user is authenticated
  return children;
};

export default AuthGuard;