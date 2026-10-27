import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { API_BASE_URL, requireApiBaseUrl } from "../config/api";
import { onUnauthorized } from "../utils/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("authToken");
  });
  const isRefreshing = useRef(false);

  const fetchWithBaseUrl = async (endpoint, options) => {
    requireApiBaseUrl();
    return fetch(`${API_BASE_URL}${endpoint}`, options);
  };

  // Send Email OTP
  const sendOTP = async (email) => {
    try {
      const response = await fetchWithBaseUrl("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || "Failed to send OTP",
        };
      }

      return {
        success: true,
        message: data.message || "Verification code sent to your email",
      };
    } catch (error) {
      console.error("sendOTP error:", error);
      return {
        success: false,
        message: "Failed to connect to authentication server. Please verify backend is running.",
      };
    }
  };

  // Verify Email OTP
  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetchWithBaseUrl("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.error || data.message || "Invalid or expired OTP",
        };
      }

      const token = data.token;
      const user = data.user || { email };
      // Admin status comes from the server's role claim only. Hardcoding email
      // addresses here handed an admin UI to anyone who could complete OTP
      // verification; the backend still gated the data, but the UI leaked.
      const isAdmin = user.role === "admin" || user.isAdmin === true;

      if (token) {
        localStorage.setItem("authToken", token);
        setAuthToken(token);
      }
      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
        setUserData(user);
      }
      setIsAuthenticated(true);

      return {
        success: true,
        token,
        user,
        isAdmin,
        message: data.message || "Verification successful",
      };
    } catch (error) {
      console.error("verifyOTP error:", error);
      return {
        success: false,
        message: "Verification failed. Please try again.",
      };
    }
  };

  // Password-based Login (Admin & credentialed users)
  const passwordLogin = async (email, password) => {
    try {
      const response = await fetchWithBaseUrl("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok || !data.token) {
        return {
          success: false,
          message: data.error || data.message || "Login failed",
        };
      }

      const token = data.token;
      const user = data.user || { email };
      updateAuthToken(token);
      updateUserData(user);

      return {
        success: true,
        token,
        user,
        message: data.message || "Login successful",
      };
    } catch (error) {
      console.error("passwordLogin error:", error);
      return {
        success: false,
        message: "Failed to connect to authentication server",
      };
    }
  };

  // Complete a password reset with the code emailed by forgot-password.
  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await fetchWithBaseUrl("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        return { success: false, message: data.error || data.message || "Could not reset the password" };
      }
      return { success: true, message: data.message || "Password reset. Please sign in." };
    } catch (error) {
      console.error("resetPassword error:", error);
      return { success: false, message: "Failed to connect to the authentication server" };
    }
  };

  // Profile update
  const updateUserProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      if (data.user) {
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
      }
      return { success: true, user: data.user };
    } catch (error) {
      console.error("updateUserProfile error:", error);
      return { success: false, message: error.message };
    }
  };

  // Refresh profile from Go backend. Returns whether the session is valid:
  // AuthGuard awaits this value, and returning nothing made every valid session
  // look invalid and bounce the user to the sign-in page.
  const refreshAuthStatus = useCallback(async () => {
    if (isRefreshing.current) return false;
    isRefreshing.current = true;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        setUserData(null);
        setAuthToken(null);
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setAuthToken(null);
          setUserData(null);
          setIsAuthenticated(false);
        }
        return false;
      }

      const data = await response.json();
      if (!data.user) return false;

      setUserData(data.user);
      localStorage.setItem("userData", JSON.stringify(data.user));
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error refreshing auth status:", error);
      return false;
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userId");
      // Leaving these behind carried a signed-out user's pending redirect and
      // language choice into the next session.
      localStorage.removeItem("authRedirectUrl");
      localStorage.removeItem("preferredLanguage");
      setAuthToken(null);
      setUserData(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateAuthToken = useCallback((token) => {
    if (token) {
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("authToken");
      setAuthToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUserData = useCallback((data) => {
    if (data) {
      localStorage.setItem("userData", JSON.stringify(data));
    } else {
      localStorage.removeItem("userData");
    }
    setUserData(data);
  }, []);

  // An expired token used to surface as "Failed to fetch" on every admin page
  // because nothing reacted to a 401.
  useEffect(() => {
    onUnauthorized(() => {
      logout();
    });
    return () => onUnauthorized(null);
  }, [logout]);

  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  // Derived from the server profile response, never from a list of email
  // addresses baked into the bundle.
  const isAdmin = useMemo(
    () => Boolean(userData) && (userData.role === "admin" || userData.isAdmin === true),
    [userData]
  );

  const value = useMemo(
    () => ({
      authToken,
      setAuthToken: updateAuthToken,
      userData,
      setUserData: updateUserData,
      user: userData,
      sendOTP,
      verifyOTP,
      login: verifyOTP,
      passwordLogin,
      resetPassword,
      updateUserProfile,
      logout,
      loading,
      isAuthenticated,
      isAdmin,
      checkAuthStatus: () => isAuthenticated,
      refreshAuthStatus,
    }),
    [
      authToken,
      userData,
      loading,
      isAuthenticated,
      isAdmin,
      logout,
      refreshAuthStatus,
      updateAuthToken,
      updateUserData,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
