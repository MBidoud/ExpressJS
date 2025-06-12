const express = require("express");
const postsRoutes = require("./routes/posts");
const categoriesRoutes = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware pour parser le JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/posts", postsRoutes);
app.use("/categories", categoriesRoutes);

// Route de base avec documentation
app.get("/", (req, res) => {
  res.json({
    message: "API de Blog avec Routes Paramétrées",
    endpoints: {
      "GET /posts/:year/:month?":
        "Récupérer les articles d'une année et optionnellement d'un mois spécifique",
      "GET /categories/:categoryName/posts":
        "Récupérer les articles d'une catégorie spécifique",
      "GET /posts": "Récupérer tous les articles",
      "GET /categories": "Récupérer toutes les catégories",
    },
    exemples: {
      "Articles de 2024": "/posts/2024",
      "Articles de janvier 2024": "/posts/2024/01",
      "Articles de la catégorie tech": "/categories/tech/posts",
      "Articles de la catégorie lifestyle": "/categories/lifestyle/posts",
    },
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Erreur interne du serveur",
  });
});

// Middleware pour les routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}`);
});

module.exports = app;
