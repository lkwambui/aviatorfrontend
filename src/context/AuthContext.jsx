import React, { createContext, useState, useCallback, useEffect, useContext } from "react";
import * as authAPI from "../api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(phone, password);
      setUser(data.user || { phone_number: phone });
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register(phone, password);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
