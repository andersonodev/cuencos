const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obter tickets de um usuário
exports.getUserTickets = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    return res.json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets do usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Obter um ticket específico
exports.getTicketById = async (req, res) => {
  const { ticketId } = req.params;
  
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(ticketId) }
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    
    return res.json(ticket);
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Criar um novo ticket
exports.createTicket = async (req, res) => {
  const ticketData = req.body;
  
  try {
    const ticket = await prisma.ticket.create({
      data: {
        ...ticketData,
        id: undefined, // Deixa o Prisma gerar o ID
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    return res.status(201).json(ticket);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar um ticket
exports.updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const ticketData = req.body;
  
  try {
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(ticketId) },
      data: {
        ...ticketData,
        id: undefined, // Não permite atualizar o ID
        updatedAt: new Date()
      }
    });
    
    return res.json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Excluir um ticket
exports.deleteTicket = async (req, res) => {
  const { ticketId } = req.params;
  
  try {
    await prisma.ticket.delete({
      where: { id: parseInt(ticketId) }
    });
    
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir ticket:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Validar um ticket
exports.validateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { validationCode } = req.body;
  
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(ticketId) }
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    
    // Aqui você pode implementar sua lógica de validação
    // Por enquanto, apenas retornamos que o ticket é válido
    return res.json({
      isValid: true,
      ticket
    });
  } catch (error) {
    console.error('Erro ao validar ticket:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 