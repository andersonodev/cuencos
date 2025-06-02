require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importação das rotas
const eventRoutes = require('./routes/eventRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// Middleware de erro
const errorHandler = require('./middlewares/errorHandler');

// Inicializa o app Express
const app = express();

// Middlewares básicos
app.use(helmet()); // Segurança
app.use(cors()); // CORS para permitir requisições do frontend
app.use(express.json()); // Parse de JSON
app.use(morgan('dev')); // Logging

// Rotas da API
app.use('/api/events', eventRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/tickets', ticketRoutes);

// Rota básica para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Cuencos API está funcionando!' });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
