import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Use the configured interceptor instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem('oncokg_user');
      if (storedUser) {
        try {
          // Silent ping to backend to verify cookie validity
          // Replace '/auth/verify' with your actual health/me endpoint
          await api.get('/auth/verify'); 
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // If 401, the interceptor will handle the redirect, but we must clear state
          setUser(null);
          localStorage.removeItem('oncokg_user');
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = (email, role) => {
    const userData = { email, role };
    setUser(userData);
    localStorage.setItem('oncokg_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Must tell backend to destroy the HTTP-only cookie
      await api.post('/auth/logout'); 
    } catch (error) {
      console.error("Logout request failed, clearing local state anyway");
    } finally {
      setUser(null);
      localStorage.removeItem('oncokg_user');
      window.location.href = '/login'; // Hard flush to clear React memory
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);