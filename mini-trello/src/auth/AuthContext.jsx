import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logout as apiLogout, refreshTokens } from "../api/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = useCallback((tokens, userData) => {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await apiLogout();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      navigate("/login");
    }
  }, [accessToken, navigate]);

  // Handle token expiration and auto-refresh
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!accessToken || !refreshToken) return;

      try {
        const [, payloadBase64] = accessToken.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        const expiry = payload.exp * 1000;
        const now = Date.now();
        const buffer = 30000; // 30 seconds buffer

        if (expiry - now < buffer) {
          const response = await refreshTokens(refreshToken);
          login({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          }, user);
        }
      } catch (error) {
        console.error("Token check failed:", error);
        logout();
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [accessToken, refreshToken, user, login, logout]);

  return (
    <AuthContext.Provider value={{ 
      accessToken, 
      refreshToken,
      user,
      login, 
      logout, 
      isAuthenticated: !!accessToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};