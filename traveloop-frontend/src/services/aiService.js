import api from './api';

export const aiService = {
  chatWithAI: async (message, context) => {
    const response = await api.post('/api/ai/chat', { message, context });
    return response.data;
  },
  getChatHistory: async () => {
    const response = await api.get('/api/ai/chat/history');
    return response.data;
  },
  clearChatHistory: async () => {
    const response = await api.delete('/api/ai/chat/history');
    return response.data;
  },
  generateItinerary: async (payload) => {
    const response = await api.post('/api/ai/itinerary', payload);
    return response.data;
  },
  generateBudget: async (payload) => {
    const response = await api.post('/api/ai/budget', payload);
    return response.data;
  },
  recommendDestinations: async (payload) => {
    const response = await api.post('/api/ai/destination', payload);
    return response.data;
  },
  recommendHotels: async (payload) => {
    const response = await api.post('/api/ai/hotels', payload);
    return response.data;
  },
  generatePackingList: async (payload) => {
    const response = await api.post('/api/ai/packing', payload);
    return response.data;
  },
  optimizeTrip: async (payload) => {
    const response = await api.post('/api/ai/optimize', payload);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/api/ai/analytics');
    return response.data;
  },
  generateActivities: async (payload) => {
    const response = await api.post('/api/ai/generate', payload);
    return response.data;
  }
};

export default aiService;
