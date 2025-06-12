// Middleware global de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
  console.error("Erreur capturée:", err);

  // Erreurs de validation JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Token JWT invalide",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token JWT expiré",
    });
  }

  // Erreurs de parsing JSON
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: "Format JSON invalide",
    });
  }

  // Erreurs de taille de payload
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Payload trop volumineux",
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
