import axios from 'axios';

// Configuração base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
});

// Interceptador para adicionar token de autenticação quando disponível
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador para tratamento de erros de resposta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.warn('API timeout ou sem conexão:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Verifica se a API está disponível
 */
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/`, { timeout: 5000 });
    return { status: 'online', message: response.data?.message || 'API online' };
  } catch (error) {
    return { status: 'offline', message: error.message };
  }
};

/**
 * Busca todos os eventos
 * @param {Object} filters - Filtros de busca
 * @returns {Promise<Array>} - Lista de eventos
 */
export const fetchEvents = async (filters = {}) => {
  try {
    // Construir query string para filtros
    const queryParams = new URLSearchParams();
    
    if (filters.q) queryParams.append('q', filters.q);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const response = await api.get(`/events?${queryParams.toString()}`);
    return response.data.events || response.data;
  } catch (error) {
    console.warn('Erro ao buscar eventos da API:', error.message);
    throw error;
  }
};

/**
 * Busca eventos em destaque
 * @param {Number} limit - Limite de eventos a retornar
 * @returns {Promise<Array>} - Lista de eventos em destaque
 */
export const fetchFeaturedEvents = async (limit = 5) => {
  try {
    const response = await api.get(`/events/featured?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.warn('Erro ao buscar eventos em destaque da API:', error.message);
    throw error;
  }
};

/**
 * Busca um evento pelo ID
 * @param {Number} id - ID do evento
 * @returns {Promise<Object>} - Evento encontrado
 */
export const fetchEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Erro ao buscar evento ${id} da API:`, error.message);
    throw error;
  }
};

/**
 * Busca eventos de um organizador
 * @param {String} organizerId - ID do organizador (opcional)
 * @returns {Promise<Array>} - Lista de eventos do organizador
 */
export const fetchOrganizerEvents = async (organizerId) => {
  try {
    let url = '/events/all';
    if (organizerId) {
      url += `?createdBy=${organizerId}`;
    }
    const response = await api.get(url);
    return response.data.events || response.data;
  } catch (error) {
    console.warn('Erro ao buscar eventos do organizador da API:', error.message);
    // Se é erro de autenticação, retornar null em vez de throw
    if (error.response && error.response.status === 401) {
      return null;
    }
    throw error;
  }
};

/**
 * Cria um novo evento
 * @param {Object} eventData - Dados do evento
 * @returns {Promise<Object>} - Evento criado
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.warn('Erro ao criar evento na API:', error.message);
    throw error;
  }
};

/**
 * Atualiza um evento existente
 * @param {Number} id - ID do evento
 * @param {Object} eventData - Novos dados do evento
 * @returns {Promise<Object>} - Evento atualizado
 */
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.warn(`Erro ao atualizar evento ${id} na API:`, error.message);
    throw error;
  }
};

/**
 * Exclui um evento
 * @param {Number} id - ID do evento
 * @returns {Promise<void>}
 */
export const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`);
  } catch (error) {
    console.warn(`Erro ao excluir evento ${id} na API:`, error.message);
    throw error;
  }
};

/**
 * Busca eventos por termo de pesquisa
 * @param {String} query - Termo de pesquisa
 * @returns {Promise<Array>} - Eventos encontrados
 */
export const searchEvents = async (query) => {
  try {
    const response = await api.get(`/events?q=${encodeURIComponent(query)}`);
    return response.data.events || response.data;
  } catch (error) {
    console.warn('Erro ao buscar eventos na API:', error.message);
    throw error;
  }
};
