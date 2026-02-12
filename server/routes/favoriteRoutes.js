const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticateToken } = require('../middlewares/authenticate');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// POST /api/favorites/:hotelId - Ajouter aux favoris
router.post('/:hotelId', favoriteController.addFavorite);

// DELETE /api/favorites/:hotelId - Retirer des favoris
router.delete('/:hotelId', favoriteController.removeFavorite);

// GET /api/favorites - Obtenir mes favoris
router.get('/', favoriteController.getUserFavorites);

// GET /api/favorites/check/:hotelId - Vérifier si en favoris
router.get('/check/:hotelId', favoriteController.checkFavorite);

module.exports = router;