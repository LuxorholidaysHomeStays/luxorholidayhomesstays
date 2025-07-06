"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { userData, loading, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has the specific email
    const checkAccess = () => {
      const isAuthenticated = checkAuthStatus();
      const hasAccess = userData?.email === "luxorholidayhomestays@gmail.com";

      if (!loading) {
        if (!isAuthenticated) {
          // Store the current path for redirection after login
          localStorage.setItem("authRedirectUrl", location.pathname);
          // Redirect to login if not authenticated
          navigate("/sign-in", { state: { from: location.pathname } });
        } else if (!hasAccess) {
          // Redirect to home if authenticated but not having the correct email
          navigate("/");
        }
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [userData, loading, navigate, location.pathname, checkAuthStatus]);

  // Show loading spinner while checking
  if (loading || isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-gray-300 border-t-yellow-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If we get here, user is authenticated and has the correct email
  return children;
};

export default ProtectedRoute;
