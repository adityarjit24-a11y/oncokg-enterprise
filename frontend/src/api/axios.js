import axios from 'axios';

const api = axios.create({
  baseURL: 'https://oncokg-enterprise-production.up.railway.app/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Prevent infinite loops if already on the login page
      if (window.location.pathname !== '/login') {
        // Clear local storage defensively
        localStorage.removeItem('oncokg_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;