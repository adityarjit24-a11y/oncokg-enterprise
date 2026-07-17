import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateSession = async () => {
    const storedToken = localStorage.getItem('oncokg_access_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/auth/me');
      setUser(response.data); // Should contain { id, email, role: 'Admin' | 'Researcher' | 'Viewer' }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('oncokg_access_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateSession();
  }, []);

  const login = async (email, password, rememberMe) => {
    const response = await api.post('/auth/login', { email, password, remember_me: rememberMe });
    localStorage.setItem('oncokg_access_token', response.data.access_token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Tells backend to destroy HttpOnly cookie
    } catch (error) {
      console.error('Logout sync failed');
    } finally {
      setUser(null);
      localStorage.removeItem('oncokg_access_token');
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hydrateSession }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);