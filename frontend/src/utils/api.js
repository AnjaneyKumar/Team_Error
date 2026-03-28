import axios from 'axios';

// Production: Use VITE_API_URL from Netlify environment variables
// Development: Use localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_ENDPOINT = `${API_BASE_URL}/api`;

console.log(`🔧 API Configuration:`);
console.log(`   Endpoint: ${API_ENDPOINT}`);
console.log(`   Environment: ${import.meta.env.MODE}`);
console.log(`   VITE_API_URL: ${import.meta.env.VITE_API_URL || 'not set (using localhost)'}`);

const api = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor - Log outgoing requests
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error.message);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - Log responses and errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error [${error.response.status}]: ${error.response.data?.message || error.message}`);
    } else if (error.request) {
      // Request made but no response
      console.error('❌ API Error: No response from server', error.message);
    } else {
      // Error in request setup
      console.error('❌ API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

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
