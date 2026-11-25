import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "./AuthContext";

const ServerStatusContext = createContext({
  isServerDown: false,
  checking: false,
  checkServerHealth: async () => true,
});

export const useServerStatus = () => useContext(ServerStatusContext);

export const ServerStatusProvider = ({ children }) => {
  const [isServerDown, setIsServerDown] = useState(false);
  const [checking, setChecking] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const isServerDownRef = useRef(false);

  const handleServerDown = useCallback(() => {
    if (!isServerDownRef.current) {
      isServerDownRef.current = true;
      setIsServerDown(true);
    }
    // Automatically log out active user session when server goes down
    if (localStorage.getItem("authToken") || isAuthenticated) {
      try {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        if (typeof logout === "function") {
          logout();
        }
      } catch (e) {
        console.error("Error clearing session on server down:", e);
      }
    }
  }, [isAuthenticated, logout]);

  const checkServerHealth = useCallback(async () => {
    if (!API_BASE_URL) return false;
    setChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const doFetch = window.__luxorRawFetch || fetch;
      const res = await doFetch(`${API_BASE_URL}/`, { method: "GET", signal: controller.signal, cache: "no-store" });
      clearTimeout(timeoutId);

      if (res && (res.ok || res.status < 500)) {
        isServerDownRef.current = false;
        setIsServerDown(false);
        return true;
      }
      if (res && (res.status === 502 || res.status === 503 || res.status === 504)) {
        handleServerDown();
        return false;
      }
      return true;
    } catch {
      handleServerDown();
      return false;
    } finally {
      setChecking(false);
    }
  }, [handleServerDown]);

  // Intercept global fetch calls to API_BASE_URL to detect backend outage immediately
  useEffect(() => {
    if (!API_BASE_URL || window.__luxorFetchPatched) return;
    const rawFetch = window.fetch.bind(window);
    window.__luxorRawFetch = rawFetch;
    window.__luxorFetchPatched = true;

    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input?.url || "";
      const isApiCall = url.startsWith(API_BASE_URL);
      try {
        const res = await rawFetch(input, init);
        if (isApiCall) {
          if (res.status === 502 || res.status === 503 || res.status === 504) {
            window.dispatchEvent(new CustomEvent("luxor:server-status", { detail: { isDown: true } }));
          } else if (res.ok && isServerDownRef.current) {
            window.dispatchEvent(new CustomEvent("luxor:server-status", { detail: { isDown: false } }));
          }
        }
        return res;
      } catch (err) {
        if (isApiCall && err?.name !== "AbortError") {
          window.dispatchEvent(new CustomEvent("luxor:server-status", { detail: { isDown: true } }));
        }
        throw err;
      }
    };
  }, []);

  useEffect(() => {
    const onStatusEvent = (e) => {
      if (e.detail?.isDown) {
        handleServerDown();
      } else {
        isServerDownRef.current = false;
        setIsServerDown(false);
      }
    };
    window.addEventListener("luxor:server-status", onStatusEvent);
    return () => window.removeEventListener("luxor:server-status", onStatusEvent);
  }, [handleServerDown]);

  // Initial check + periodic polling (6s when down, 25s when healthy)
  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(() => {
      checkServerHealth();
    }, isServerDown ? 6000 : 25000);
    return () => clearInterval(interval);
  }, [checkServerHealth, isServerDown]);

  return (
    <ServerStatusContext.Provider value={{ isServerDown, checking, checkServerHealth }}>
      {children}
    </ServerStatusContext.Provider>
  );
};
