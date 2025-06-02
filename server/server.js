const express = require('express');
const cors = require('cors');
const path = require('path');
const { mockEvents } = require('./mockEventData');

// Inicializar o app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (para imagens)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Rota básica de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Mock do Cuencos funcionando!' });
});

// GET /api/events - Listar todos os eventos (não rascunhos)
app.get('/api/events', (req, res) => {
  // Extrair parâmetros de consulta
  const { category, location, q } = req.query;
  
  // Filtrar eventos que não são rascunhos
  let filteredEvents = mockEvents.filter(event => !event.isDraft);
  
  // Aplicar filtros adicionais se fornecidos
  if (category) {
    filteredEvents = filteredEvents.filter(event => 
      event.category && event.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (location) {
    filteredEvents = filteredEvents.filter(event => 
      event.location && event.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (q) {
    filteredEvents = filteredEvents.filter(event => 
      (event.title && event.title.toLowerCase().includes(q.toLowerCase())) || 
      (event.description && event.description.toLowerCase().includes(q.toLowerCase()))
    );
  }
  
  res.json(filteredEvents);
});

// GET /api/events/featured - Listar eventos em destaque
app.get('/api/events/featured', (req, res) => {
  const featuredEvents = mockEvents.filter(event => event.featured && !event.isDraft);
  res.json(featuredEvents);
});

// GET /api/events/:id - Obter detalhes de um evento específico
app.get('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = mockEvents.find(event => event.id === eventId);
  
  if (!event) {
    return res.status(404).json({ message: 'Evento não encontrado' });
  }
  
  res.json(event);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
