import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateSession = () => {
    const storedToken = localStorage.getItem('oncokg_access_token');
    const storedUser = localStorage.getItem('oncokg_user'); // Yahan add kiya

    if (!storedToken || !storedUser) {
      setLoading(false);
      return;
    }

    try {
      // Backend ki fake /auth/me API call hata di. 
      // Ab hum seedha saved user data use karenge.
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
    
    // Token ke saath ab user ki details bhi save hongi
    localStorage.setItem('oncokg_access_token', response.data.access_token);
    localStorage.setItem('oncokg_user', JSON.stringify(response.data.user)); 
    
    setUser(response.data.user);
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
      localStorage.removeItem('oncokg_user'); // Yahan bhi remove karega
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