const express = require('express');
const router = express.Router();
const { upload } = require('../configurations/cloudinaryConfig');
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');
const { authenticateToken, requireAdmin } = require('../middlewares/authenticate');


// Route pour créer une chambre
router.post('/', /*authenticateToken,*/ /*requireAdmin,*/ upload.single('image'), roomController.createRoom);

// Route pour récupérer toutes les chambres
router.get('/', roomController.getAllRooms);

//router.post('/create', roomController.createRoom);

// Route pour récupérer une chambre par son ID
router.get('/:id',/* authenticateUser, authorizeRole('admin'), */roomController.getRoomById);

// Route pour récupérer le prix d'une chambre par son ID
router.get('/:id/price', roomController.getRoomPriceById);

// Route pour vérifier la disponibilité d'une chambre
router.get('/:roomId/availability', bookingController.checkAvailability); // Droit etre dans roomRoutes.js
// Route pour mettre à jour une chambre
router.put('/:id',  authenticateToken, requireAdmin, upload.single('image'), roomController.updateRoom);

// Route pour METTRE a JOUR les chambres d'un hôtel 
router.patch('/:id/price',  authenticateToken, requireAdmin, roomController.updateRoomPrice);

// Route pour mettre a jour l'image d'une chambre
router.patch('/:id/image',  authenticateToken, requireAdmin, upload.single('image'), roomController.updateRoomImage);

// Route pour supprimer une chambre
router.delete('/:id',  authenticateToken, requireAdmin, roomController.deleteRoom);

module.exports = router;
  