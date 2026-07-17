// frontend/src/api/axios.js
import axios from 'axios';

// Create a central instance
const api = axios.create({
    // FIX: Add /api/v1 here so all calls automatically get the correct prefix
    baseURL: 'https://oncokg-enterprise-production.up.railway.app/api/v1',
    withCredentials: true 
});

// Response Interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired. Redirecting to login.");
            localStorage.removeItem('user_data');
            
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;