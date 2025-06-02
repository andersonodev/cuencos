const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Obter IDs dos favoritos do usuário
router.get('/:userId/ids', favoriteController.getUserFavoriteIds);

// Obter eventos favoritos completos do usuário
router.get('/:userId/events', favoriteController.getUserFavorites);

// Adicionar aos favoritos
router.post('/:userId', favoriteController.addToFavorites);

// Remover dos favoritos
router.delete('/:userId/:eventId', favoriteController.removeFromFavorites);

// Verificar se é favorito
router.get('/:userId/:eventId/check', favoriteController.checkIfFavorite);

module.exports = router;
