import * as ticketService from '../services/ticketService';

const TICKETS_STORAGE_KEY = 'cuencos_user_tickets';

// Cache local
let ticketsCache = null;

// Gerar ID único para ticket
const generateTicketId = () => {
  return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Carregar tickets do localStorage
const loadTickets = () => {
  try {
    if (ticketsCache) {
      return ticketsCache;
    }
    
    const stored = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (stored) {
      ticketsCache = JSON.parse(stored);
      return ticketsCache;
    }
    
    ticketsCache = [];
    return ticketsCache;
  } catch (error) {
    console.error('Erro ao carregar tickets:', error);
    ticketsCache = [];
    return ticketsCache;
  }
};

// Salvar tickets no localStorage
const saveTickets = (tickets) => {
  try {
    ticketsCache = tickets;
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error('Erro ao salvar tickets:', error);
  }
};

// Adicionar novo ticket
export const addTicket = async (ticketData) => {
  try {
    const tickets = loadTickets();
    
    const newTicket = {
      id: generateTicketId(),
      userId: ticketData.userId,
      eventId: parseInt(ticketData.eventId),
      eventTitle: ticketData.eventTitle,
      eventImage: ticketData.eventImage,
      eventImageData: ticketData.eventImageData, // Incluir imageData
      eventDate: ticketData.eventDate,
      eventLocation: ticketData.eventLocation,
      ticketType: ticketData.ticketType,
      quantity: parseInt(ticketData.quantity) || 1,
      attendeeName: ticketData.attendeeName,
      attendeeEmail: ticketData.attendeeEmail,
      attendeePhone: ticketData.attendeePhone || '',
      purchaseDate: ticketData.purchaseDate || new Date().toISOString(),
      status: ticketData.status || 'active',
      createdAt: new Date().toISOString()
    };
    
    tickets.push(newTicket);
    saveTickets(tickets);
    
    console.log('Ticket criado:', newTicket);
    return newTicket;
  } catch (error) {
    console.error('Erro ao adicionar ticket:', error);
    throw error;
  }
};

// Obter tickets por usuário
export const getTicketsByUserId = async (userId) => {
  try {
    const tickets = loadTickets();
    return tickets.filter(ticket => ticket.userId === userId);
  } catch (error) {
    console.error('Erro ao obter tickets do usuário:', error);
    return [];
  }
};

// Obter ticket por ID
export const getTicketById = async (ticketId) => {
  try {
    const tickets = loadTickets();
    return tickets.find(ticket => ticket.id === ticketId);
  } catch (error) {
    console.error('Erro ao obter ticket por ID:', error);
    return null;
  }
};

// Atualizar status do ticket
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const tickets = loadTickets();
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex !== -1) {
      tickets[ticketIndex].status = status;
      tickets[ticketIndex].updatedAt = new Date().toISOString();
      saveTickets(tickets);
      return tickets[ticketIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao atualizar status do ticket:', error);
    throw error;
  }
};

// Deletar ticket
export const deleteTicket = async (ticketId) => {
  try {
    const tickets = loadTickets();
    const filteredTickets = tickets.filter(ticket => ticket.id !== ticketId);
    saveTickets(filteredTickets);
    return true;
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    throw error;
  }
};

// Obter todos os tickets (admin)
export const getAllTickets = async () => {
  try {
    return loadTickets();
  } catch (error) {
    console.error('Erro ao obter todos os tickets:', error);
    return [];
  }
};

// Verificar se usuário tem ticket para evento
export const hasTicketForEvent = async (userId, eventId) => {
  try {
    const tickets = await getTicketsByUserId(userId);
    return tickets.some(ticket => 
      ticket.eventId == eventId && ticket.status === 'active'
    );
  } catch (error) {
    console.error('Erro ao verificar ticket do evento:', error);
    return false;
  }
};

// Limpar cache
export const clearTicketsCache = () => {
  ticketsCache = null;
};

// Estatísticas dos tickets
export const getTicketStats = async (userId) => {
  try {
    const tickets = await getTicketsByUserId(userId);
    return {
      total: tickets.length,
      active: tickets.filter(t => t.status === 'active').length,
      used: tickets.filter(t => t.status === 'used').length,
      cancelled: tickets.filter(t => t.status === 'cancelled').length
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas dos tickets:', error);
    return { total: 0, active: 0, used: 0, cancelled: 0 };
  }
};
