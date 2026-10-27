
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated, isAdmin, authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !authToken) {
      // Store the current path for redirection after login
      localStorage.setItem("authRedirectUrl", location.pathname);
      navigate("/sign-in", { state: { from: location.pathname } });
    } else if (!isAdmin) {
      // Admin status comes from the server profile response, not from a list of
      // email addresses compiled into the bundle.
      navigate("/");
    }
  }, [loading, isAuthenticated, authToken, isAdmin, navigate, location.pathname]);

  // Show loading spinner until the session is resolved, and never render the
  // admin tree before a token exists.
  if (loading || !isAuthenticated || !isAdmin || !authToken) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-gray-300 border-t-yellow-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
