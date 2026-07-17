import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // App start hotay hi localStorage check karega ki user logged in hai ya nahi
    const storedUser = localStorage.getItem('oncokg_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  // FIX: Ab ye function sirf details save karega, doosri API call nahi karega.
  const login = (email, role) => {
    const userData = { email, role };
    setUser(userData); // React ki state update kar di
    localStorage.setItem('oncokg_user', JSON.stringify(userData)); // Browser mein save kar diya
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oncokg_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);