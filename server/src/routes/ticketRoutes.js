const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

// Rotas públicas - não exigem autenticação para simplicidade
router.get('/user/:userId', ticketController.getUserTickets);
router.get('/:ticketId', ticketController.getTicketById);
router.post('/', ticketController.createTicket);
router.put('/:ticketId', ticketController.updateTicket);
router.delete('/:ticketId', ticketController.deleteTicket);
router.post('/:ticketId/validate', ticketController.validateTicket);

module.exports = router; 