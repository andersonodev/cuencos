const fs = require('fs').promises;
const path = require('path');

// Arquivo para armazenar favoritos (simulando banco de dados)
const FAVORITES_FILE = path.join(__dirname, '../../data/favorites.json');

// Garantir que o diretório data existe
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(FAVORITES_FILE);
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Carregar favoritos do arquivo
const loadFavorites = async () => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(FAVORITES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existe, retornar objeto vazio
    return {};
  }
};

// Salvar favoritos no arquivo
const saveFavorites = async (favorites) => {
  try {
    await ensureDataDirectory();
    await fs.writeFile(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error);
    throw error;
  }
};

// GET /api/favorites/:userId - Obter favoritos de um usuário
exports.getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await loadFavorites();
    
    // Retornar lista de IDs dos eventos favoritos do usuário
    const userFavorites = favorites[userId] || [];
    
    return res.json({
      userId,
      favorites: userFavorites
    });
  } catch (error) {
    console.error('Erro ao obter favoritos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// POST /api/favorites/:userId/:eventId - Adicionar evento aos favoritos
exports.addToFavorites = async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const eventIdNum = parseInt(eventId);
    
    if (!userId || isNaN(eventIdNum)) {
      return res.status(400).json({ message: 'Parâmetros inválidos' });
    }
    
    const favorites = await loadFavorites();
    
    // Inicializar array do usuário se não existir
    if (!favorites[userId]) {
      favorites[userId] = [];
    }
    
    // Adicionar evento se não estiver já nos favoritos
    if (!favorites[userId].includes(eventIdNum)) {
      favorites[userId].push(eventIdNum);
      await saveFavorites(favorites);
    }
    
    return res.status(201).json({
      message: 'Evento adicionado aos favoritos',
      userId,
      eventId: eventIdNum,
      favorites: favorites[userId]
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// DELETE /api/favorites/:userId/:eventId - Remover evento dos favoritos
exports.removeFromFavorites = async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const eventIdNum = parseInt(eventId);
    
    if (!userId || isNaN(eventIdNum)) {
      return res.status(400).json({ message: 'Parâmetros inválidos' });
    }
    
    const favorites = await loadFavorites();
    
    // Se o usuário não tem favoritos, retornar sucesso
    if (!favorites[userId]) {
      return res.json({
        message: 'Evento removido dos favoritos',
        userId,
        eventId: eventIdNum,
        favorites: []
      });
    }
    
    // Remover evento dos favoritos
    favorites[userId] = favorites[userId].filter(id => id !== eventIdNum);
    await saveFavorites(favorites);
    
    return res.json({
      message: 'Evento removido dos favoritos',
      userId,
      eventId: eventIdNum,
      favorites: favorites[userId]
    });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// GET /api/favorites/:userId/events - Obter detalhes dos eventos favoritos
exports.getUserFavoriteEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await loadFavorites();
    const userFavorites = favorites[userId] || [];
    
    if (userFavorites.length === 0) {
      return res.json([]);
    }
    
    // Importar eventos para buscar detalhes
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      // Buscar eventos favoritos no banco
      const favoriteEvents = await prisma.event.findMany({
        where: {
          id: { in: userFavorites },
          isDraft: false
        },
        orderBy: {
          date: 'asc'
        }
      });
      
      return res.json(favoriteEvents);
    } catch (dbError) {
      // Fallback para dados mock se não houver banco
      console.warn('Banco não disponível, usando dados mock');
      const { mockEvents } = require('../../mockEventData');
      const favoriteEvents = mockEvents.filter(event => 
        userFavorites.includes(event.id) && !event.isDraft
      );
      
      return res.json(favoriteEvents);
    }
  } catch (error) {
    console.error('Erro ao obter eventos favoritos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
