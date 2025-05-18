
// Mock tickets
let tickets = [];

export const addTicket = (ticket) => {
  const newTicket = {
    id: Date.now().toString(),
    purchaseDate: new Date(),
    ...ticket
  };
  
  tickets.push(newTicket);
  
  // Save tickets to localStorage
  const storedTickets = JSON.parse(localStorage.getItem('cuencosTickets') || '[]');
  storedTickets.push(newTicket);
  localStorage.setItem('cuencosTickets', JSON.stringify(storedTickets));
  
  return newTicket;
};

export const getTicketsByUserId = (userId) => {
  // Load tickets from localStorage
  const storedTickets = JSON.parse(localStorage.getItem('cuencosTickets') || '[]');
  
  return storedTickets.filter(ticket => ticket.userId === userId);
};

export const getTicketById = (ticketId) => {
  // Load tickets from localStorage
  const storedTickets = JSON.parse(localStorage.getItem('cuencosTickets') || '[]');
  
  return storedTickets.find(ticket => ticket.id === ticketId);
};
