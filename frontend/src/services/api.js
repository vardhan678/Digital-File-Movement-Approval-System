import axios from 'axios';

// No baseURL — all requests go through Vite's dev proxy (/api → http://localhost:5000)
// This avoids CORS issues during development
const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('digitalfile_auth');
    if (stored) {
      try {
        const { token } = JSON.parse(stored);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 if NOT already on the login/register page
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login') &&
      !window.location.pathname.includes('/register')
    ) {
      localStorage.removeItem('digitalfile_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
