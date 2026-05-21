import axios from 'axios';

// In production (Netlify), VITE_API_URL points to Railway backend.
// In local dev, empty string uses Vite's proxy (/api → localhost:3001).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true, // Crucial for sending httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('traveloop_user');
      localStorage.removeItem('traveloop_token');
    }
    return Promise.reject(error);
  }
);

export default api;
