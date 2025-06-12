const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  customLogger,
  errorLogger,
  logAnalyzer,
} = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware pour parser JSON
app.use(express.json());

// Configuration du middleware de logging personnalisé
// Vous pouvez changer le format ici : 'combined', 'common', 'short', 'tiny', 'dev'
app.use(
  customLogger({
    format: "combined",
    logFile: "access.log",
    includeBody: true,
    includeHeaders: false,
    rotateDaily: true,
  })
);

// Routes de test pour démontrer le logging
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API de démonstration du middleware de logging",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET / - Cette page",
      "GET /users - Liste des utilisateurs",
      "POST /users - Créer un utilisateur",
      "GET /products/:id - Détails d'un produit",
      "GET /error - Déclencher une erreur",
      "GET /slow - Requête lente (2s)",
      "GET /logs/analysis - Analyser les logs",
    ],
  });
});

// Route avec données mockées
app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice Dupont", email: "alice@example.com" },
    { id: 2, name: "Bob Martin", email: "bob@example.com" },
    { id: 3, name: "Claire Durand", email: "claire@example.com" },
  ];

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// Route POST pour tester le logging du body
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Nom et email requis",
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    message: "Utilisateur créé avec succès",
    data: newUser,
  });
});

// Route avec paramètres
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: "ID de produit invalide",
    });
  }

  const product = {
    id: parseInt(id),
    name: `Produit ${id}`,
    price: Math.floor(Math.random() * 1000) + 10,
    description: `Description du produit ${id}`,
  };

  res.json({
    success: true,
    data: product,
  });
});

// Route pour déclencher une erreur (test du logging d'erreur)
app.get("/error", (req, res) => {
  throw new Error("Erreur de test pour démontrer le logging d'erreur");
});

// Route lente pour tester les temps de réponse
app.get("/slow", (req, res) => {
  setTimeout(() => {
    res.json({
      message: "Réponse après 2 secondes",
      timestamp: new Date().toISOString(),
    });
  }, 2000);
});

// Route pour analyser les logs
app.get("/logs/analysis", (req, res) => {
  const logsDir = path.join(__dirname, "logs");
  const today = new Date().toISOString().substring(0, 10);
  const logFile = path.join(logsDir, `access-${today}.log`);

  try {
    if (!fs.existsSync(logFile)) {
      return res.status(404).json({
        success: false,
        error: "Aucun fichier de log trouvé pour aujourd'hui",
      });
    }

    const logContent = fs.readFileSync(logFile, "utf8");

    const analysis = {
      totalRequests: logContent.split("\n").filter((line) => line.trim())
        .length,
      methodCounts: logAnalyzer.countByMethod(logContent),
      statusCounts: logAnalyzer.countByStatus(logContent),
      responseTimes: logAnalyzer.analyzeResponseTimes(logContent),
      logFile: logFile,
    };

    res.json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'analyse des logs: " + error.message,
    });
  }
});

// Route pour voir les logs bruts
app.get("/logs/raw", (req, res) => {
  const { date } = req.query;
  const logsDir = path.join(__dirname, "logs");
  const logDate = date || new Date().toISOString().substring(0, 10);
  const logFile = path.join(logsDir, `access-${logDate}.log`);

  try {
    if (!fs.existsSync(logFile)) {
      return res.status(404).json({
        success: false,
        error: `Aucun fichier de log trouvé pour la date ${logDate}`,
      });
    }

    const logContent = fs.readFileSync(logFile, "utf8");
    const lines = logContent.split("\n").filter((line) => line.trim());

    res.json({
      success: true,
      date: logDate,
      totalLines: lines.length,
      logs: lines.slice(-50), // Dernières 50 lignes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la lecture des logs: " + error.message,
    });
  }
});

// Middleware de gestion d'erreur avec logging
app.use(errorLogger());

app.use((err, req, res, next) => {
  console.error("Erreur capturée:", err.message);

  res.status(500).json({
    success: false,
    error: "Erreur interne du serveur",
    timestamp: new Date().toISOString(),
  });
});

// Middleware pour les routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
    method: req.method,
    url: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Serveur de démonstration du middleware de logging démarré sur le port ${PORT}`
  );
  console.log(
    `📝 Logs sauvegardés dans le dossier: ${path.join(__dirname, "logs")}`
  );
  console.log(`🌐 Accédez à l'API: http://localhost:${PORT}`);
  console.log(`📊 Analyse des logs: http://localhost:${PORT}/logs/analysis`);
});

module.exports = app;
