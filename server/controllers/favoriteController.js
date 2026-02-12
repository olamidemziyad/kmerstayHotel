const Favorite = require('../models/favorite');
const Hotel = require('../models/hotel');
const User = require('../models/user');

const favoriteController = {
  // Ajouter un hôtel aux favoris
  addFavorite: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const userId = req.user.id; // Vient du middleware authenticate

      // Vérifier si l'hôtel existe
      const hotel = await Hotel.findByPk(hotelId);
      if (!hotel) {
        return res.status(404).json({ 
          success: false, 
          message: 'Hôtel non trouvé' 
        });
      }

      // Vérifier si déjà en favoris
      const existingFavorite = await Favorite.findOne({
        where: { user_id: userId, hotel_id: hotelId }
      });

      if (existingFavorite) {
        return res.status(409).json({ 
          success: false, 
          message: 'Hôtel déjà en favoris' 
        });
      }

      // Créer le favori
      const favorite = await Favorite.create({
        user_id: userId,
        hotel_id: hotelId
      });

      res.status(201).json({ 
        success: true, 
        message: 'Hôtel ajouté aux favoris',
        data: favorite
      });

    } catch (error) {
      console.error('Erreur addFavorite:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur interne du serveur' 
      });
    }
  },

  // Retirer un hôtel des favoris
  removeFavorite: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const userId = req.user.id;

      const favorite = await Favorite.findOne({
        where: { user_id: userId, hotel_id: hotelId }
      });

      if (!favorite) {
        return res.status(404).json({ 
          success: false, 
          message: 'Favori non trouvé' 
        });
      }

      await favorite.destroy();

      res.json({ 
        success: true, 
        message: 'Hôtel retiré des favoris' 
      });

    } catch (error) {
      console.error('Erreur removeFavorite:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur interne du serveur' 
      });
    }
  },

  // Obtenir tous les favoris d'un utilisateur
  getUserFavorites: async (req, res) => {
    try {
      const userId = req.user.id;

      // Première version simple sans include
      const favorites = await Favorite.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']]
      });

      // Si tu veux les infos des hôtels, on peut les récupérer séparément
      const favoritesWithHotels = [];
      
      for (const favorite of favorites) {
        const hotel = await Hotel.findByPk(favorite.hotel_id);
        favoritesWithHotels.push({
          ...favorite.toJSON(),
          hotel: hotel
        });
      }

      res.json({ 
        success: true, 
        data: favoritesWithHotels 
      });

    } catch (error) {
      console.error('Erreur getUserFavorites:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur interne du serveur' 
      });
    }
  },

  // Vérifier si un hôtel est en favoris
  checkFavorite: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const userId = req.user.id;

      const favorite = await Favorite.findOne({
        where: { user_id: userId, hotel_id: hotelId }
      });

      res.json({ 
        success: true, 
        isFavorite: !!favorite 
      });

    } catch (error) {
      console.error('Erreur checkFavorite:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur interne du serveur' 
      });
    }
  }
};

module.exports = favoriteController;