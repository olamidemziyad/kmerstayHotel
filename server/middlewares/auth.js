// Middleware très simple pour simuler une authentification admin
module.exports = function(req, res, next) {
  // Exemple simple : on vérifie un header "x-admin-token"
  const adminToken = req.headers['x-admin-token'];
  if (adminToken === 'mon_secret_admin_token') {
    next();
  } else {
    res.status(401).json({ error: 'Non autorisé, token admin invalide' });
  }
};
// Note: This is a very basic example. In a real application, you would want to use a more secure method of authentication, such as JWT or OAuth.