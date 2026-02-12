const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Récupère le token depuis les headers
    const secret = process.env.JWT_SECRET; // Clé secrète pour la vérification

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        // Vérifie et décode le token
        const decodedToken = jwt.verify(token, secret);
        req.user = {
            id: decodedToken.id, // ID utilisateur
            role: decodedToken.role, // Rôle (ajouté si nécessaire dans le payload du token)
        };
        next(); // Passe au middleware suivant
    } catch (error) {
        console.error("Erreur de vérification du token :", error.message);
        return res.status(403).json({ message: 'Token invalide.' });
    }
};

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : Administrateurs uniquement.' });
    }
    next();
};

// middlewares/authorizeSelfOrAdmin.js
const authorizeSelfOrAdmin = (req, res, next) => {
  const userIdFromParams = req.params.id;
  const userIdFromToken = req.user.id;
  const role = req.user.role;

  console.log("🧠 DEBUG authorizeSelfOrAdmin");
  console.log("→ userIdFromParams:", userIdFromParams);
  console.log("→ userIdFromToken :", userIdFromToken);
  console.log("→ role :", role);

  if (role === 'admin' || userIdFromParams === userIdFromToken) {
    return next();
  }

  return res.status(403).json({ message: "Accès interdit : non autorisé à modifier cet utilisateur." });
};

// middlewares/auth.js - Ajoutez cette fonction

const authorizeBookingAccess = async (req, res, next) => {
  try {
    const bookingId = req.params.id; // L'ID de la réservation depuis l'URL
    const userIdFromToken = req.user.id;
    const role = req.user.role;

    console.log("🧠 DEBUG authorizeBookingAccess");
    console.log("→ bookingIdFromParams:", bookingId);
    console.log("→ userIdFromToken :", userIdFromToken);
    console.log("→ role :", role);

    // Si admin, accès granted
    if (role === 'admin') {
      return next();
    }

    // ICI : Ajoutez la logique pour vérifier si l'user est le propriétaire de la réservation
    // Vous devez importer votre modèle Booking et faire une requête en base
    const Booking = require('../models/Booking'); // Adjust path as needed

    const booking = await Booking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    // Si l'utilisateur est le propriétaire de la réservation, accès granted
    if (booking.userId === userIdFromToken) {
      return next();
    }

    // Sinon, accès denied
    return res.status(403).json({ 
      message: "Accès interdit : vous n'êtes pas le propriétaire de cette réservation." 
    });

  } catch (error) {
    console.error("Error in authorizeBookingAccess:", error);
    return res.status(500).json({ message: "Erreur serveur lors de l'autorisation." });
  }
};

// N'oubliez pas de l'exporter
module.exports = {
    authenticateToken,
    requireAdmin,
    authorizeSelfOrAdmin,
    authorizeBookingAccess 
};
