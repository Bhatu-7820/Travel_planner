import api from './api';

export const cityService = {
  getCities: async (q = '') => (await api.get('/api/cities', { params: { q } })).data,
};
