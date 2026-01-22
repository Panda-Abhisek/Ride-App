import api from './axios.js';
import React, { createContext, useContext, useState, useEffect } from 'react';

export const login = async (credentials) => {
  const response = await api.post('/api/auth/signin', credentials);
  console.log("Response: ", response);
  console.log("Response Data: ", response.data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/auth/signout');
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/api/auth/user');
  return response.data;
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      
      // Small delay to ensure server session is fully established
      await new Promise(resolve => setTimeout(resolve, 50));
      
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};