import axios from 'axios';

const api = axios.create({
  baseURL: '', // Use relative paths to leverage Vite proxy and same-origin cookies
  withCredentials: true, // Crucial for sending httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('traveloop_user');
    }
    return Promise.reject(error);
  }
);

export default api;
