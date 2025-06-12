// Middleware de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
  console.error("❌ Erreur:", err.stack);

  // Erreur de validation
  if (err.name === "ValidationError") {
    return res.status(400).render("error", {
      title: "Erreur de validation",
      message: "Les données fournies ne sont pas valides.",
      error: { status: 400 },
    });
  }

  // Erreur par défaut (500)
  res.status(err.status || 500).render("error", {
    title: "Erreur serveur",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur interne s'est produite.",
    error: process.env.NODE_ENV === "development" ? err : { status: 500 },
  });
};

module.exports = errorHandler;
