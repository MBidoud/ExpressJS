const jwt = require("jsonwebtoken");

// Configuration - Dans un vrai projet, utilisez des variables d'environnement
const JWT_SECRET = "your-super-secret-jwt-key-change-in-production";
const TOKEN_EXPIRY = "1h";

// Stockage en mémoire pour les utilisateurs (dans un vrai projet, utilisez une base de données)
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" },
  { id: 3, username: "guest", password: "guest123", role: "guest" },
];

// Stockage en mémoire pour les tokens révoqués
const revokedTokens = new Set();

/**
 * Middleware d'authentification simple
 * Vérifie la présence et la validité du token JWT
 */
function authenticate(req, res, next) {
  try {
    // 1. Extraire le token des headers
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied",
        message: "No authorization header provided",
      });
    }

    // 2. Vérifier le format du header (Bearer token)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: "Access denied",
        message: "No token provided",
      });
    }

    // 3. Vérifier si le token est révoqué
    if (revokedTokens.has(token)) {
      return res.status(401).json({
        error: "Access denied",
        message: "Token has been revoked",
      });
    }

    // 4. Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5. Ajouter les informations utilisateur à la requête
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Access denied",
        message: "Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Access denied",
        message: "Invalid token",
      });
    } else {
      return res.status(500).json({
        error: "Server error",
        message: "Token verification failed",
      });
    }
  }
}

/**
 * Middleware d'autorisation basé sur les rôles
 * @param {string[]} allowedRoles - Rôles autorisés
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not authenticated",
      });
    }

    if (allowedRoles.length === 0) {
      // Si aucun rôle spécifié, l'authentification suffit
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
}

/**
 * Middleware optionnel d'authentification
 * Ajoute les informations utilisateur si le token est valide, sinon continue
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (!token || revokedTokens.has(token)) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.token = token;
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    console.log("Optional auth failed:", error.message);
  }

  next();
}

/**
 * Fonction utilitaire pour générer un token JWT
 * @param {Object} user - Informations utilisateur
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Fonction utilitaire pour valider les credentials
 * @param {string} username
 * @param {string} password
 */
function validateCredentials(username, password) {
  return users.find(
    (user) => user.username === username && user.password === password
  );
}

/**
 * Fonction pour révoquer un token
 * @param {string} token
 */
function revokeToken(token) {
  revokedTokens.add(token);

  // Nettoyer les tokens expirés après 24h (optionnel)
  setTimeout(() => {
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        revokedTokens.delete(token);
      }
    }
  }, 24 * 60 * 60 * 1000);
}

/**
 * Middleware de logging des tentatives d'authentification
 */
function authLogger(req, res, next) {
  const originalSend = res.send;

  res.send = function (data) {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const userAgent = req.get("User-Agent") || "unknown";

    if (res.statusCode === 401 || res.statusCode === 403) {
      console.log(
        `[${timestamp}] AUTH FAILED - IP: ${ip} - ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - User-Agent: ${userAgent}`
      );
    } else if (req.user) {
      console.log(
        `[${timestamp}] AUTH SUCCESS - User: ${req.user.username} (${req.user.role}) - IP: ${ip} - ${req.method} ${req.originalUrl}`
      );
    }

    originalSend.call(this, data);
  };

  next();
}

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  generateToken,
  validateCredentials,
  revokeToken,
  authLogger,
  users, // Export pour les tests
};
