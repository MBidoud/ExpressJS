const express = require("express");
const path = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

// Import des routes
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/users");
const apiRoutes = require("./routes/api");

// Import des middlewares personnalisés
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// Middlewares globaux
app.use(morgan("combined")); // Logger HTTP
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded
app.use(express.static(path.join(__dirname, "public"))); // Fichiers statiques

// Middleware personnalisé pour logger
app.use(logger);

// Routes
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/api", apiRoutes);

// Middleware de gestion d'erreur 404
app.use((req, res, next) => {
  res.status(404).render("error", {
    title: "Page non trouvée",
    message: "La page que vous cherchez n'existe pas.",
    error: { status: 404 },
  });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur ExpressJS démarré sur http://localhost:${PORT}`);
  console.log(`📁 Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log("📋 Routes disponibles:");
  console.log("   GET  /              - Page d'accueil");
  console.log("   GET  /about         - À propos");
  console.log("   GET  /contact       - Contact");
  console.log("   GET  /users         - Liste des utilisateurs");
  console.log("   GET  /users/:id     - Détails d'un utilisateur");
  console.log("   GET  /api/status    - Statut de l'API");
  console.log("   GET  /api/users     - API utilisateurs");
});

module.exports = app;
