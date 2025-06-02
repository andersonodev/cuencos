const express = require('express');
const favoritesController = require('../controllers/favoritesController');

const router = express.Router();

// Rotas públicas - não exigem autenticação para simplicidade
router.get('/:userId', favoritesController.getUserFavorites);
router.get('/:userId/events', favoritesController.getUserFavoriteEvents);
router.post('/:userId/:eventId', favoritesController.addToFavorites);
router.delete('/:userId/:eventId', favoritesController.removeFromFavorites);

module.exports = router;
