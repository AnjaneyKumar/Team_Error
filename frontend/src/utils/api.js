import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Routes API
export const routesAPI = {
  getAll: () => api.get('/routes'),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
  search: (query) => api.get('/routes/search', { params: { query } }),
  addStop: (routeId, stopId) => api.post(`/routes/${routeId}/stops/${stopId}`),
  removeStop: (routeId, stopId) => api.delete(`/routes/${routeId}/stops/${stopId}`)
};

// Stops API
export const stopsAPI = {
  getAll: () => api.get('/stops'),
  getById: (id) => api.get(`/stops/${id}`),
  create: (data) => api.post('/stops', data),
  update: (id, data) => api.put(`/stops/${id}`, data),
  delete: (id) => api.delete(`/stops/${id}`),
  search: (query) => api.get('/stops/search', { params: { query } }),
  getNearby: (latitude, longitude, radius) => 
    api.get('/stops/nearby', { params: { latitude, longitude, radius } })
};

// Buses API
export const busesAPI = {
  getAll: () => api.get('/buses'),
  getById: (id) => api.get(`/buses/${id}`),
  getByRoute: (routeId) => api.get(`/buses/route/${routeId}`),
  create: (data) => api.post('/buses', data),
  updateLocation: (id, data) => api.put(`/buses/${id}/location`, data),
  updateStatus: (id, data) => api.put(`/buses/${id}/status`, data),
  delete: (id) => api.delete(`/buses/${id}`)
};

export default api;
