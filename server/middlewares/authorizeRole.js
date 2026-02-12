// middlewares/authorizeRole.js

exports.authorizeRole = (roles = []) => {
  // Si un seul rôle est passé sous forme de string, on le convertit en tableau
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit : rôle insuffisant" });
    }
    next();
  };
};
