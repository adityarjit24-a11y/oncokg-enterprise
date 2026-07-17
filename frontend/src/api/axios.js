import axios from 'axios';

// Enterprise Base Configuration
const api = axios.create({
  // Ye tumhara backend URL hai jo tumne AuthContext mein use kiya tha
  baseURL: 'https://oncokg-enterprise-production.up.railway.app', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// REQUEST INTERCEPTOR: Har API call se pehle automatically Token lagayega
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('oncokg_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData && userData.token) {
        config.headers['Authorization'] = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Global Error Handling
api.interceptors.response.use(
  (response) => {
    // Agar response success hai, toh aage badhne do
    return response;
  },
  (error) => {
    // 1. Agar Backend se 401 Unauthorized (Token Expired) aata hai
    if (error.response && error.response.status === 401) {
      
      // 2. Loop Check: Kya hum pehle se hi login page par hain?
      const isLoginPage = window.location.pathname === '/login';
      
      if (!isLoginPage) {
        console.warn("Security Alert: Session expired or invalid token. Logging out.");
        
        // 3. User ka purana data clear karo
        localStorage.removeItem('oncokg_user');
        
        // 4. User ko Login par bhejo aur URL mein '?expired=true' laga do taaki UI message dikha sake
        window.location.href = '/login?expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;