import axios from 'axios';

// Configuração base da API para tickets
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptador para adicionar token de autenticação
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Busca todos os tickets de um usuário
 * @param {String} userId - ID do usuário
 * @returns {Promise<Array>} - Lista de tickets do usuário
 */
export const fetchUserTickets = async (userId) => {
  try {
    const response = await api.get(`/tickets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tickets do usuário:', error);
    throw error;
  }
};

/**
 * Busca um ticket específico por ID
 * @param {Number} ticketId - ID do ticket
 * @returns {Promise<Object>} - Dados do ticket
 */
export const fetchTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Cria um novo ticket
 * @param {Object} ticketData - Dados do ticket
 * @returns {Promise<Object>} - Ticket criado
 */
export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw error;
  }
};

/**
 * Atualiza um ticket existente
 * @param {Number} ticketId - ID do ticket
 * @param {Object} ticketData - Novos dados do ticket
 * @returns {Promise<Object>} - Ticket atualizado
 */
export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.put(`/tickets/${ticketId}`, ticketData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Exclui um ticket
 * @param {Number} ticketId - ID do ticket
 * @returns {Promise<void>}
 */
export const deleteTicket = async (ticketId) => {
  try {
    await api.delete(`/tickets/${ticketId}`);
  } catch (error) {
    console.error(`Erro ao excluir ticket ${ticketId}:`, error);
    throw error;
  }
};

/**
 * Valida um ticket
 * @param {Number} ticketId - ID do ticket
 * @param {String} validationCode - Código de validação
 * @returns {Promise<Object>} - Resultado da validação
 */
export const validateTicket = async (ticketId, validationCode) => {
  try {
    const response = await api.post(`/tickets/${ticketId}/validate`, {
      validationCode
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao validar ticket ${ticketId}:`, error);
    throw error;
  }
};