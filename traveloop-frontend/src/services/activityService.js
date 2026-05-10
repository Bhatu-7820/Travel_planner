import api from './api';

export const activityService = {
  getActivities: async (filters = {}) => (await api.get('/api/activities', { params: filters })).data,
};
