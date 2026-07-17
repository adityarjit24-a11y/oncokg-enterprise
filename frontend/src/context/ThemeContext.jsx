import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('oncokg_theme');
    return saved ? JSON.parse(saved) : true; // Default to dark mode for clinical/bioinformatics tools
  });

  useEffect(() => {
    localStorage.setItem('oncokg_theme', JSON.stringify(isDarkMode));
    document.body.style.backgroundColor = isDarkMode ? '#000c17' : '#f4f6f8';
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Custom Ant Design Tokens matching OncoKG Enterprise branding
  const customTokens = {
    token: {
      colorPrimary: '#00B5AD', // Medical Teal accent
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderRadius: 6,
    },
    algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    components: {
      Layout: {
        headerBg: isDarkMode ? '#001529' : '#ffffff',
        siderBg: isDarkMode ? '#001529' : '#001529', // Keep sidebar consistently dark navy
      },
      Card: {
        colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={customTokens}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);