const jwt = require("jsonwebtoken");
const { users } = require("../data/sampleData");

const JWT_SECRET = "votre_secret_jwt_super_securise"; // En production, utilisez une variable d'environnement

// Middleware d'authentification
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token d'authentification requis",
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Token invalide",
    });
  }
};

// Middleware pour vérifier les droits administrateur
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Droits administrateur requis",
    });
  }
  next();
};

// Middleware pour vérifier que l'utilisateur accède à ses propres données
const requireOwnership = (req, res, next) => {
  const userId = req.params.id || req.params.userId;

  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      error: "Accès non autorisé",
    });
  }
  next();
};

// Fonction utilitaire pour générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

module.exports = {
  authenticate,
  requireAdmin,
  requireOwnership,
  generateToken,
  JWT_SECRET,
};
