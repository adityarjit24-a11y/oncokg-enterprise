import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateSession = () => {
    const storedToken = localStorage.getItem('oncokg_access_token');
    const storedUser = localStorage.getItem('oncokg_user');

    if (!storedToken || !storedUser) {
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser)); 
    } catch (error) {
      setUser(null);
      localStorage.removeItem('oncokg_access_token');
      localStorage.removeItem('oncokg_user');
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
    
    // 🚨 ASLI FIX YAHAN HAI: Agar backend user data na bheje, toh crash hone ki jagah apna data khud bana lo
    const userData = response.data.user || { email: email, role: 'Researcher' };
    localStorage.setItem('oncokg_user', JSON.stringify(userData)); 
    
    setUser(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout sync failed');
    } finally {
      setUser(null);
      localStorage.removeItem('oncokg_access_token');
      localStorage.removeItem('oncokg_user');
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