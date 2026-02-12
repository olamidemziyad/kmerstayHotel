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
            userId: decodedToken.id, // ID utilisateur
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

module.exports = {
    authenticateToken,
    requireAdmin,
};
