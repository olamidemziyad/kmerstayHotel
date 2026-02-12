const express = require('express');
const router = express.Router();
const { User, Hotel, Favorite } = require('../models');

// Endpoint test complet
router.get('/test-associations/all', async (req, res) => {
  try {
    // Tous les utilisateurs avec leurs favoris et les hôtels liés
    const users = await User.findAll({
      include: [
        {
          model: Favorite,
          as: 'favorites',
          include: ['hotel'], // Chaque favorite inclut l'hôtel
        },
      ],
    });

    // Tous les hôtels avec leurs favoris et les utilisateurs liés
    const hotels = await Hotel.findAll({
      include: [
        {
          model: Favorite,
          as: 'favorites',
          include: ['user'], // Chaque favorite inclut l'utilisateur
        },
      ],
    });

    res.json({ users, hotels });
  } catch (err) {
    console.error('Erreur test-associations/all :', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
