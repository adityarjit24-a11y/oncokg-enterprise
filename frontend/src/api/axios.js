import axios from 'axios';

const api = axios.create({
  // Ensure /api/v1 is appended here!
  baseURL: 'https://oncokg-enterprise-production.up.railway.app/api/v1', 
  withCredentials: true,
  // ... rest of the code
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('oncokg_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops if the refresh endpoint itself fails
      if (originalRequest.url.includes('/auth/refresh')) {
        localStorage.removeItem('oncokg_access_token');
        localStorage.removeItem('oncokg_user');
        window.location.href = '/login?session_expired=true';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Silent request to backend; relies on HttpOnly cookie
        const { data } = await api.post('/auth/refresh');
        
        localStorage.setItem('oncokg_access_token', data.access_token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token;
        
        processQueue(null, data.access_token);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('oncokg_access_token');
        localStorage.removeItem('oncokg_user');
        window.location.href = '/login?session_expired=true';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;