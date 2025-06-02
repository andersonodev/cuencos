import axios from 'axios';

// Configuração base do cliente Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== EVENTOS =====

export const getAllEvents = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.q) params.append('q', filters.q);
    if (filters.location) params.append('location', filters.location);
    if (filters.date) params.append('date', filters.date);
    if (filters.category) params.append('category', filters.category);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/events?${params.toString()}`);
    return response.data.events;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar evento ${id}:`, error);
    throw error;
  }
};

export const getFeaturedEvents = async (limit = 5) => {
  try {
    const response = await api.get(`/events/featured?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar eventos em destaque:', error);
    throw error;
  }
};

export const searchEvents = async (query) => {
  try {
    const response = await api.get(`/events?q=${encodeURIComponent(query)}`);
    return response.data.events;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar evento ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir evento ${id}:`, error);
    throw error;
  }
};

// ===== FAVORITOS =====

export const getUserFavoriteIds = async (userId) => {
  try {
    const response = await api.get(`/favorites/${userId}/ids`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar IDs dos favoritos:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const response = await api.get(`/favorites/${userId}/events`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar eventos favoritos:', error);
    throw error;
  }
};

export const addToFavorites = async (userId, eventId) => {
  try {
    const response = await api.post(`/favorites/${userId}`, { eventId });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar aos favoritos:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId, eventId) => {
  try {
    await api.delete(`/favorites/${userId}/${eventId}`);
    return true;
  } catch (error) {
    console.error('Erro ao remover dos favoritos:', error);
    throw error;
  }
};

export const checkIfFavorite = async (userId, eventId) => {
  try {
    const response = await api.get(`/favorites/${userId}/${eventId}/check`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    throw error;
  }
};

// ===== HEALTH CHECK =====

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar health da API:', error);
    return { status: 'offline' };
  }
};

export default api;
