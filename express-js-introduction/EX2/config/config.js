// Configuration de l'application Express
const config = {
  // Configuration de base
  app: {
    name: process.env.APP_NAME || "Express Complete Project",
    version: "1.0.0",
    description: "Projet ExpressJS complet avec structure MVC",
  },

  // Configuration du serveur
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    environment: process.env.NODE_ENV || "development",
  },

  // Configuration des vues
  views: {
    engine: "ejs",
    cache: process.env.NODE_ENV === "production",
  },

  // Configuration des logs
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.NODE_ENV === "development" ? "dev" : "combined",
  },

  // Configuration de sécurité
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    },
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limite de 100 requêtes par fenêtre
    },
  },

  // Configuration de la base de données (pour usage futur)
  database: {
    type: process.env.DB_TYPE || "memory",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || "express_app",
    username: process.env.DB_USERNAME || "user",
    password: process.env.DB_PASSWORD || "password",
  },

  // Configuration des uploads (pour usage futur)
  uploads: {
    maxSize: process.env.UPLOAD_MAX_SIZE || "10mb",
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    destination: process.env.UPLOAD_DEST || "./public/uploads",
  },

  // Configuration des emails (pour usage futur)
  email: {
    host: process.env.EMAIL_HOST || "localhost",
    port: process.env.EMAIL_PORT || 587,
    username: process.env.EMAIL_USERNAME || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "noreply@example.com",
  },
};

// Validation de la configuration
function validateConfig() {
  const required = ["server.port"];
  const missing = [];

  required.forEach((key) => {
    const keys = key.split(".");
    let value = config;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        missing.push(key);
        break;
      }
    }
  });

  if (missing.length > 0) {
    throw new Error(`Configuration manquante: ${missing.join(", ")}`);
  }
}

// Fonction pour obtenir une valeur de configuration
function get(key, defaultValue = null) {
  const keys = key.split(".");
  let value = config;

  for (const k of keys) {
    value = value[k];
    if (value === undefined) {
      return defaultValue;
    }
  }

  return value;
}

// Fonction pour définir une valeur de configuration
function set(key, value) {
  const keys = key.split(".");
  let obj = config;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in obj)) {
      obj[k] = {};
    }
    obj = obj[k];
  }

  obj[keys[keys.length - 1]] = value;
}

// Affichage de la configuration au démarrage
function displayConfig() {
  console.log("📋 Configuration de l'application:");
  console.log(`   Nom: ${config.app.name}`);
  console.log(`   Version: ${config.app.version}`);
  console.log(`   Environnement: ${config.server.environment}`);
  console.log(`   Port: ${config.server.port}`);
  console.log(`   Moteur de vues: ${config.views.engine}`);
}

module.exports = {
  config,
  validateConfig,
  get,
  set,
  displayConfig,
};
