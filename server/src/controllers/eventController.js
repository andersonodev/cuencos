const { PrismaClient } = require('@prisma/client');
const { eventSchema } = require('../validators/eventValidator');
const { mockEvents } = require('../../mockEventData');

const prisma = new PrismaClient();

// Função helper para obter eventos (primeiro do banco, depois do mock)
const getAllEventsFromSources = async () => {
  try {
    // Tentar buscar do banco primeiro
    const dbEvents = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents;
    }
    
    // Se não há eventos no banco, usar dados mock
    console.log('Usando dados mock como fallback');
    return mockEvents.filter(event => !event.isDraft);
  } catch (error) {
    console.error('Erro ao buscar eventos do banco, usando mock:', error);
    return mockEvents.filter(event => !event.isDraft);
  }
};

// Listar todos os eventos publicados
exports.getAllEvents = async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    location, 
    date, 
    q: searchTerm 
  } = req.query;

  // Converter para números
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    // Buscar eventos de todas as fontes
    let events = await getAllEventsFromSources();
    
    // Aplicar filtros
    if (category) {
      events = events.filter(event => event.category === category);
    }

    if (location) {
      events = events.filter(event => 
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (date) {
      events = events.filter(event => 
        event.date.toLowerCase().includes(date.toLowerCase())
      );
    }

    if (searchTerm) {
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar paginação
    const totalEvents = events.length;
    const paginatedEvents = events.slice(skip, skip + limitNumber);

    return res.json({
      events: paginatedEvents,
      pagination: {
        total: totalEvents,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(totalEvents / limitNumber)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Listar eventos em destaque
exports.getFeaturedEvents = async (req, res) => {
  const { limit = 5 } = req.query;
  const limitNumber = parseInt(limit);

  try {
    // Buscar eventos de todas as fontes
    const allEvents = await getAllEventsFromSources();
    
    // Filtrar apenas eventos em destaque
    const featuredEvents = allEvents
      .filter(event => event.featured)
      .slice(0, limitNumber);

    return res.json(featuredEvents);
  } catch (error) {
    console.error('Erro ao buscar eventos em destaque:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Obter evento pelo ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    // Tentar buscar do banco primeiro
    const dbEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (dbEvent) {
      return res.json(dbEvent);
    }

    // Buscar nos dados mock
    const mockEvent = mockEvents.find(event => event.id === parseInt(id));
    
    if (mockEvent) {
      return res.json(mockEvent);
    }

    return res.status(404).json({ message: 'Evento não encontrado' });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ...existing code...