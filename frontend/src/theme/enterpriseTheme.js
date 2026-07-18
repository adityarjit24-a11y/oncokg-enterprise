// src/theme/enterpriseTheme.js
export const enterpriseTheme = {
  token: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorPrimary: '#5e6ad2', // Linear-like purple/blue
    colorInfo: '#5e6ad2',
    colorSuccess: '#2ea043', // GitHub Enterprise green
    colorWarning: '#d29922',
    colorError: '#f85149',
    borderRadius: 8,
    wireframe: false,
    colorBgBase: '#0d1117', // Deep dark background (GitHub Dark/Vercel)
    colorTextBase: '#c9d1d9',
  },
  components: {
    Card: {
      colorBgContainer: 'rgba(22, 27, 34, 0.6)', // Glassmorphism base
      colorBorderSecondary: '#30363d',
      backdropFilter: 'blur(12px)',
      borderRadiusLG: 12,
    },
    Layout: {
      colorBgHeader: 'rgba(13, 17, 23, 0.8)', // Translucent header
      colorBgBody: '#0d1117',
      colorBgTrigger: '#161b22',
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemText: '#8b949e',
      colorItemTextHover: '#c9d1d9',
      colorItemTextSelected: '#ffffff',
      colorItemBackgroundSelected: 'rgba(94, 106, 210, 0.15)', // Premium subtle highlight
    },
    Table: {
      colorBgContainer: 'transparent',
      colorBorderSecondary: '#30363d',
      colorFillAlter: 'rgba(22, 27, 34, 0.4)', // Alternate row color
    }
  }
};