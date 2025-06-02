const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obter favoritos do usuário (apenas IDs)
exports.getUserFavoriteIds = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { eventId: true }
    });
    
    const favoriteIds = favorites.map(fav => fav.eventId);
    return res.json(favoriteIds);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Obter eventos favoritos completos do usuário
exports.getUserFavorites = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        event: {
          where: { isDraft: false } // Apenas eventos publicados
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Filtrar apenas favoritos com eventos válidos (não nulos)
    const validFavorites = favorites
      .filter(fav => fav.event !== null)
      .map(fav => fav.event);
    
    return res.json(validFavorites);
  } catch (error) {
    console.error('Erro ao buscar eventos favoritos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Adicionar evento aos favoritos
exports.addToFavorites = async (req, res) => {
  const { userId } = req.params;
  const { eventId } = req.body;
  
  try {
    // Verificar se o evento existe
    const eventExists = await prisma.event.findUnique({
      where: { id: parseInt(eventId) }
    });
    
    if (!eventExists) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Tentar criar o favorito (ignora se já existe devido ao unique constraint)
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_eventId: {
          userId,
          eventId: parseInt(eventId)
        }
      },
      update: {}, // Não atualiza nada se já existe
      create: {
        userId,
        eventId: parseInt(eventId)
      }
    });
    
    return res.status(201).json({ 
      message: 'Evento adicionado aos favoritos',
      favorite 
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Remover evento dos favoritos
exports.removeFromFavorites = async (req, res) => {
  const { userId, eventId } = req.params;
  
  try {
    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId,
        eventId: parseInt(eventId)
      }
    });
    
    if (deleted.count === 0) {
      return res.status(404).json({ message: 'Favorito não encontrado' });
    }
    
    return res.json({ message: 'Evento removido dos favoritos' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Verificar se um evento é favorito
exports.checkIfFavorite = async (req, res) => {
  const { userId, eventId } = req.params;
  
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: parseInt(eventId)
        }
      }
    });
    
    return res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
