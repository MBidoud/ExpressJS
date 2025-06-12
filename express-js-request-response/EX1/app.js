const express = require("express");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 5000;

// Base de données simulée en mémoire
const users = [];

// Configuration de sécurité
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting pour les soumissions de formulaires
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 soumissions par IP par fenêtre
  message: {
    error: "Too many form submissions",
    message: "Trop de soumissions de formulaire. Réessayez dans 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Configuration du moteur de template (simple HTML)
app.set("view engine", "html");
app.engine("html", (filePath, options, callback) => {
  const fs = require("fs");
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);

    let html = content.toString();
    // Template simple: remplacer {{variable}} par la valeur
    for (const key in options) {
      const regex = new RegExp(`{{${key}}}`, "g");
      // Safely convert value to string, handling objects and arrays
      let value = options[key];
      if (value === null || value === undefined) {
        value = "";
      } else if (typeof value === "object") {
        value = JSON.stringify(value);
      } else {
        value = String(value);
      }
      html = html.replace(regex, value);
    }

    return callback(null, html);
  });
});

app.set("views", path.join(__dirname, "views"));

// Middleware de validation personnalisé
const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères")
    .matches(
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
    )
    .withMessage(
      "Le nom ne peut contenir que des lettres, espaces et caractères de ponctuation de base"
    ),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Veuillez entrer une adresse email valide")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("L'email ne peut pas dépasser 100 caractères")
    .custom(async (email) => {
      // Vérifier si l'email existe déjà
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        throw new Error("Cette adresse email est déjà utilisée");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Le mot de passe doit contenir entre 8 et 128 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Le mot de passe doit contenir au moins : 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial (@$!%*?&)"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("La confirmation du mot de passe ne correspond pas");
    }
    return true;
  }),

  body("age")
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage("L'âge doit être entre 13 et 120 ans"),

  body("terms")
    .equals("on")
    .withMessage("Vous devez accepter les conditions d'utilisation"),
];

// Routes

// Page d'accueil avec formulaire
app.get("/", (req, res) => {
  res.render("index", {
    title: "Formulaire d'inscription",
    errors: "",
    formData: JSON.stringify({}),
    success: "",
  });
});

// Traitement de la soumission du formulaire
app.post("/register", formLimiter, validateRegistration, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => `<div class="error-item">• ${error.msg}</div>`)
        .join("");

      return res.status(400).render("index", {
        title: "Formulaire d'inscription",
        errors: `<div class="error-container"><div class="error-item">• Erreur de validation</div>${errorMessages}</div>`,
        formData: JSON.stringify(req.body),
        success: "",
      });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Créer l'utilisateur
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age || null,
      createdAt: new Date().toISOString(),
      ipAddress: req.ip || req.connection.remoteAddress,
    };

    users.push(newUser);

    // Log de l'inscription
    console.log(
      `📝 Nouvelle inscription: ${newUser.name} (${newUser.email}) - ID: ${newUser.id}`
    ); // Réponse de succès
    res.status(200).render("success", {
      title: "Inscription réussie",
      userName: newUser.name,
      userEmail: newUser.email,
      userId: newUser.id,
      timestamp: new Date().toLocaleString("fr-FR"),
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);

    res.status(500).render("index", {
      title: "Formulaire d'inscription",
      errors:
        '<div class="error-container"><div class="error-item">• Erreur serveur. Veuillez réessayer plus tard.</div></div>',
      formData: JSON.stringify(req.body),
      success: "",
    });
  }
});

// API pour récupérer les utilisateurs (pour les tests)
app.get("/api/users", (req, res) => {
  const safeUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    createdAt: user.createdAt,
  }));

  res.json({
    message: "Liste des utilisateurs inscrits",
    count: safeUsers.length,
    users: safeUsers,
  });
});

// API pour vérifier si un email existe
app.get("/api/check-email/:email", (req, res) => {
  const email = req.params.email.toLowerCase();
  const exists = users.some((user) => user.email.toLowerCase() === email);

  res.json({
    email: email,
    exists: exists,
    available: !exists,
    message: exists ? "Email déjà utilisé" : "Email disponible",
  });
});

// Route de test pour remplir le formulaire automatiquement
app.get("/test-form", (req, res) => {
  const testData = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "TestPass123!",
    confirmPassword: "TestPass123!",
    age: "25",
    terms: "on",
  };

  res.render("index", {
    title: "Formulaire d'inscription - Test",
    errors: "",
    formData: JSON.stringify(testData),
    success: "",
  });
});

// Route pour réinitialiser les données
app.post("/api/reset", (req, res) => {
  users.length = 0; // Vider le tableau
  res.json({
    message: "Base de données réinitialisée",
    timestamp: new Date().toISOString(),
  });
});

// Page d'informations
app.get("/info", (req, res) => {
  res.json({
    name: "Formulaire d'inscription Express.js",
    version: "1.0.0",
    message: "Informations sur l'application de formulaire",
    features: [
      "Validation complète des données de formulaire",
      "Hashage sécurisé des mots de passe (bcrypt)",
      "Protection contre le spam (rate limiting)",
      "Validation côté serveur robuste",
      "Gestion d'erreurs détaillée",
      "Interface utilisateur responsive",
    ],
    endpoints: {
      "GET /": "Afficher le formulaire d'inscription",
      "POST /register": "Traiter la soumission du formulaire",
      "GET /api/users": "Lister les utilisateurs inscrits",
      "GET /api/check-email/:email": "Vérifier la disponibilité d'un email",
      "GET /test-form": "Formulaire pré-rempli pour les tests",
      "POST /api/reset": "Réinitialiser la base de données",
    },
    validation: {
      name: "Requis, 2-50 caractères, lettres uniquement",
      email: "Requis, format email valide, unique",
      password:
        "Requis, 8+ caractères, avec majuscule, minuscule, chiffre et caractère spécial",
      confirmPassword: "Doit correspondre au mot de passe",
      age: "Optionnel, entre 13 et 120 ans",
      terms: "Requis, doit être accepté",
    },
    security: [
      "Helmet.js pour les headers de sécurité",
      "Rate limiting (5 soumissions/15min)",
      "Validation et sanitisation des entrées",
      "Hash bcrypt avec salt de 12",
    ],
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("Erreur:", err);

  res.status(err.status || 500).render("error", {
    title: "Erreur",
    errorMessage: err.message || "Une erreur inattendue s'est produite",
    errorCode: err.status || 500,
    timestamp: new Date().toLocaleString("fr-FR"),
  });
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).render("error", {
    title: "Page non trouvée",
    errorMessage: `La page ${req.originalUrl} n'existe pas`,
    errorCode: 404,
    timestamp: new Date().toLocaleString("fr-FR"),
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("🚀 EX1 - Formulaire d'inscription Express.js");
  console.log("=".repeat(60));
  console.log(`📡 Serveur démarré sur http://localhost:${PORT}`);
  console.log("");
  console.log("📋 Routes disponibles:");
  console.log("  GET  /                      - Formulaire d'inscription");
  console.log("  POST /register              - Traiter l'inscription");
  console.log("  GET  /test-form             - Formulaire pré-rempli");
  console.log("  GET  /api/users             - Liste des utilisateurs");
  console.log("  GET  /api/check-email/:email - Vérifier email");
  console.log("  POST /api/reset             - Réinitialiser données");
  console.log("  GET  /info                  - Informations de l'app");
  console.log("");
  console.log("🔒 Sécurité activée:");
  console.log("  - Helmet.js (headers sécurisés)");
  console.log("  - Rate limiting (5 soumissions/15min)");
  console.log("  - Validation robuste des données");
  console.log("  - Hash bcrypt des mots de passe");
  console.log("");
  console.log("🧪 Tests: npm test");
  console.log("=".repeat(60));
});

module.exports = app;
