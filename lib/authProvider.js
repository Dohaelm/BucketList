'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = () => {
      const authState = sessionStorage.getItem('constellation_auth');
      if (authState === 'authenticated') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (password) => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        if (password === '3iw@benzizi6/6') {
          setIsAuthenticated(true);
          sessionStorage.setItem('constellation_auth', 'authenticated');
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Wrong password!' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('constellation_auth');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};