import api from './api';

export const authService = {
  login: async (credentials) => (await api.post('/api/auth/login', credentials)).data,
  register: async (payload) => (await api.post('/api/auth/register', payload)).data,
  logout: async () => (await api.get('/api/auth/logout')).data,
  me: async () => (await api.get('/api/auth/me')).data,
  updateMe: async (data) => (await api.put('/api/auth/me', data)).data,
  deleteMe: async () => (await api.delete('/api/auth/me')).data,
  updatePassword: async (passwords) => (await api.put('/api/auth/updatepassword', passwords)).data,
  firebaseLogin: async (idToken) => (await api.post('/api/auth/firebase', { idToken })).data,
};
