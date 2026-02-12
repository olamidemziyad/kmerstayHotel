const express = require('express');
const { upload } = require('../configurations/cloudinaryConfig');
const hotelController = require('../controllers/hotelController');
const { authenticateToken, requireAdmin, authorizeSelfOrAdmin } = require('../middlewares/authenticate'); // Importer les middlewares d'authentification si nécessaire
const roomController = require('../controllers/roomController'); // Importer le contrôleur des chambres
const router = express.Router();


//Routes des controlleurs Hotel
router.post('/create', authenticateToken, requireAdmin, hotelController.createHotel);   

// Route pour récupérer tous les hôtels
router.get('/', hotelController.getAllHotels);

// Route pour récupérer les hôtels via l'ID
router.get('/:id', hotelController.getHotelById);

// Route pour récupérer les chambres d'un hôtel par son ID
// Exemple dans routes/room.routes.js
router.get('/:hotelId/rooms', roomController.getRoomsByHotelId);
// Routes pour mettre à jour un hôtel
router.put('/:id', /*authenticateToken, requireAdmin,*/ hotelController.updateHotel);

//Routes pour supprimer un Hotel
router.delete ('/DELETE/:id', authenticateToken, requireAdmin, hotelController.deleteHotel);
// Tu uploades l'image via une requête POST privée (toi seulement)
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), hotelController.uploadImage);

// Routes pour rechercher des hôtels par nom
router.get('/search/name', hotelController.getHotelsByName);

// Routes pour rechercher des hôtels par ville
router.get('/search/by-city', hotelController.getHotelsByCity);

// Routes pour rechercher des hôtels par région
router.get('/search/byRegion', hotelController.getHotelsByRegion);

// Routes pour rechercher des hôtels par note

// Routes pur chercher des hotels par prix
router.get('/search/by-price', hotelController.getHotelsByPrice);

// Routes pour rechercher des hôtels par type d'hébergement
//router.get('/search/by-type', hotelController.getHotelsByType);

// Advanved search route
router.get('/search/advanced', hotelController.searchHotelsAdvanced);



module.exports = router;
