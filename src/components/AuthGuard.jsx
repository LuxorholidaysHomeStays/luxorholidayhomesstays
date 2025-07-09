import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AuthGuard component to protect routes requiring authentication
 * Redirects to login if user is not authenticated
 * @param {boolean} redirectOnAuthenticated - If true, redirects authenticated users away from this route
 * @param {string} redirectPath - Path to redirect to if redirectOnAuthenticated is true (default: "/")
 */
const AuthGuard = ({ children, redirectOnAuthenticated = true, redirectPath = "/" }) => {
  const { isAuthenticated, loading, refreshAuthStatus, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        // Check if user is not authenticated
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
        // If redirectOnAuthenticated is false and we're on the complete-profile route,
        // check if the user is already verified and should be redirected
        else if (redirectOnAuthenticated === false && location.pathname === '/complete-profile') {
          // Check if user has already completed their profile (has verified email)
          if (userData && userData.email && !userData.email.includes('@phone.luxor.com') && userData.isEmailVerified) {
            navigate(redirectPath, { replace: true });
          }
        }
        // If redirectOnAuthenticated is true, behave normally (keep protected route)
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [loading, isAuthenticated, navigate, location, redirectOnAuthenticated, redirectPath, refreshAuthStatus, userData]);
  
  if (loading || isChecking) {
    // Show a loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-yellow-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default AuthGuard;