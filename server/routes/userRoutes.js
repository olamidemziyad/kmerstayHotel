const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const {
  authenticateToken,
  requireAdmin,
  authorizeSelfOrAdmin,
} = require('../middlewares/authenticate');

// ----------------------   
// 🔐 Authentification
// ----------------------
router.post('/create', user.createUser);        // Inscription
router.post('/login', user.loginUser);          // Connexion
router.post('/forgot-password', user.forgotPassword);

// NOUVELLES ROUTES pour mot de passe oublié
router.post('/forgot-password', user.forgotPassword);
router.post('/reset-password', user.resetPassword);
router.post('/validate-reset-token', user.validateResetToken);

// Route de test email (optionnelle, pour le développement)
router.post('/test-email', user.testEmail);

// ----------------------
// 👤 Routes utilisateur connecté (profil)
// ----------------------
router.get('/me', authenticateToken, user.getOwnProfile);                 // Voir son profil
router.put('/me', authenticateToken, user.updateOwnProfile);             // Modifier son profil
router.put('/me/password', authenticateToken, user.changeOwnPassword);   // Modifier mot de passe
router.delete('/me', authenticateToken, user.deleteOwnAccount);          // Supprimer son compte

// ----------------------
// 🛡️ Routes admin
// ----------------------
router.get('/', authenticateToken, requireAdmin, user.getAllUsers);       // Tous les utilisateurs
router.get('/count', authenticateToken, requireAdmin, user.countUsers);  // Stat : nombre total

router.get('/:id', authenticateToken, requireAdmin, user.getUserById);   // Voir un utilisateur
router.put('/:id', authenticateToken, requireAdmin, user.updateUserByAdmin); // Modifier un utilisateur
router.delete('/:id', authenticateToken, requireAdmin, user.deleteUser); // Supprimer un utilisateur

module.exports = router;
