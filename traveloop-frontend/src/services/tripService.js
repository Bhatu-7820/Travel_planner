import api from './api';

export const tripService = {
  getTrips: async () => (await api.get('/api/trips')).data,
  getTripById: async (id) => (await api.get(`/api/trips/${id}`)).data,
  createTrip: async (payload) => (await api.post('/api/trips', payload)).data,
  updateTrip: async (id, payload) => (await api.put(`/api/trips/${id}`, payload)).data,
  deleteTrip: async (id) => (await api.delete(`/api/trips/${id}`)).data,
  addStop: async (tripId, payload) => (await api.post(`/api/trips/${tripId}/stops`, payload)).data,
  updateStop: async (tripId, stopId, payload) => (await api.put(`/api/trips/${tripId}/stops/${stopId}`, payload)).data,
  deleteStop: async (tripId, stopId) => (await api.delete(`/api/trips/${tripId}/stops/${stopId}`)).data,
  reorderStops: async (tripId, order) => (await api.put(`/api/trips/${tripId}/stops/reorder`, { order })).data,
  addActivityToStop: async (tripId, stopId, payload) => (await api.post(`/api/trips/${tripId}/stops/${stopId}/activities`, payload)).data,
  updatePacking: async (tripId, packing) => (await api.put(`/api/trips/${tripId}/packing`, packing)).data,
  getBudget: async (tripId) => (await api.get(`/api/trips/${tripId}/budget`)).data,
  copyTrip: async (tripId) => (await api.post(`/api/trips/copy/${tripId}`)).data,
  getNotes: async (tripId) => (await api.get(`/api/trips/${tripId}/notes`)).data,
  addNote: async (tripId, payload) => (await api.post(`/api/trips/${tripId}/notes`, payload)).data,
  updateNote: async (tripId, payload) => (await api.put(`/api/trips/${tripId}/notes`, payload)).data,
  deleteNote: async (tripId, payload) => (await api.delete(`/api/trips/${tripId}/notes`, { data: payload })).data,
  uploadImages: async (tripId, images) => (await api.post(`/api/trips/${tripId}/images`, { images })).data,
  getTripImages: async (tripId) => (await api.get(`/api/trips/${tripId}/images`)).data,
};
