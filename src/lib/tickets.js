// Mock data para tickets
let tickets = [];
let lastId = 0;

// Recuperar tickets do localStorage
const loadTickets = () => {
  try {
    const storedTickets = localStorage.getItem('tickets');
    if (storedTickets) {
      tickets = JSON.parse(storedTickets);
      lastId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) : 0;
    }
  } catch (error) {
    console.error("Erro ao carregar tickets do localStorage:", error);
    tickets = [];
  }
};

// Salvar tickets no localStorage
const saveTickets = () => {
  try {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  } catch (error) {
    console.error("Erro ao salvar tickets no localStorage:", error);
  }
};

// Carregar tickets na inicialização
loadTickets();

export const addTicket = (ticketData) => {
  const newTicket = {
    id: ++lastId,
    purchaseDate: new Date().toISOString(),
    ...ticketData
  };
  
  tickets.push(newTicket);
  saveTickets();
  return newTicket;
};

export const getTicketsByUserId = (userId) => {
  return tickets.filter(ticket => ticket.userId === userId);
};

export const getTicketById = (ticketId) => {
  return tickets.find(ticket => ticket.id === ticketId);
};
