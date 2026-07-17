// frontend/src/api/axios.js
import axios from 'axios';

// Create a central instance
const api = axios.create({
    baseURL: 'https://oncokg-enterprise-production.up.railway.app',
    withCredentials: true // CRITICAL: Allows Axios to send httpOnly cookies
});

// Response Interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if error is 401 Unauthorized (Token expired or missing)
        if (error.response && error.response.status === 401) {
            // Optional: If you have a refresh token endpoint, you would call it here.
            // Otherwise, force logout.
            console.warn("Session expired. Redirecting to login.");
            
            // Clear any frontend user state (e.g., Zustand, Redux, or Context)
            localStorage.removeItem('user_data'); // Only non-sensitive data
            
            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;