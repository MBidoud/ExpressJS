const express = require("express");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

// Route de base
app.get("/", (req, res) => {
  res.json({
    message: "API de gestion de tâches",
    endpoints: {
      "GET /tasks": "Récupérer toutes les tâches",
      "GET /tasks/:id": "Récupérer une tâche spécifique",
      "POST /tasks": "Créer une nouvelle tâche",
      "PUT /tasks/:id": "Mettre à jour une tâche existante",
      "DELETE /tasks/:id": "Supprimer une tâche",
    },
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Middleware pour les routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}`);
});

module.exports = app;
