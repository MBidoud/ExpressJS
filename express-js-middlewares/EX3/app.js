const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4002;

// ================================
// 1. MIDDLEWARE DE SÉCURITÉ (HELMET)
// ================================
console.log("🛡️  Configuring security middleware (Helmet)...");

// Configuration Helmet pour la sécurité
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
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// ================================
// 2. MIDDLEWARE DE LOGGING (MORGAN)
// ================================
console.log("📝 Configuring logging middleware (Morgan)...");

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Configuration de Morgan avec rotation de logs
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

// Format personnalisé pour Morgan
morgan.format(
  "custom",
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
);

// Utilisation de Morgan
app.use(
  morgan("custom", {
    stream: accessLogStream,
    skip: function (req, res) {
      // Skip les logs pour les assets statiques
      return req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/);
    },
  })
);

// Morgan pour la console (mode développement)
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/);
    },
  })
);

// ================================
// 3. MIDDLEWARE CORS
// ================================
console.log("🌐 Configuring CORS middleware...");

// Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des domaines autorisés
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:4000",
      "http://localhost:4001",
      "http://localhost:4002",
      "https://example.com",
    ];

    // Permettre les requêtes sans origin (ex: applications mobiles, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count", "X-Rate-Limit-Remaining"],
};

app.use(cors(corsOptions));

// ================================
// 4. MIDDLEWARE DE COMPRESSION
// ================================
console.log("🗜️  Configuring compression middleware...");

// Configuration de la compression
app.use(
  compression({
    filter: (req, res) => {
      // Ne pas compresser les réponses marquées comme non compressibles
      if (req.headers["x-no-compression"]) {
        return false;
      }
      // Utiliser le filtre par défaut de compression
      return compression.filter(req, res);
    },
    level: 6, // Niveau de compression (1-9)
    threshold: 1024, // Compresser seulement si > 1kb
  })
);

// ================================
// 5. MIDDLEWARE DE RATE LIMITING
// ================================
console.log("🚦 Configuring rate limiting middleware...");

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par IP par fenêtre
  message: {
    error: "Too many requests",
    message: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true, // Retourner les headers rate limit
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
    });
  },
});

// Rate limiting pour l'API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: "API rate limit exceeded",
    message: "Too many API requests, please try again later.",
  },
});

// Rate limiting strict pour certaines routes sensibles
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Strict rate limit exceeded",
    message: "Too many requests to sensitive endpoint.",
  },
});

// Slow down middleware (ralentit progressivement)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10, // Ralentir après 10 requêtes
  delayMs: 500, // Ajouter 500ms de délai pour chaque requête
  maxDelayMs: 5000, // Délai maximum de 5 secondes
});

// Application des limiteurs
app.use(globalLimiter);
app.use("/api/", apiLimiter);
app.use(speedLimiter);

// ================================
// 6. MIDDLEWARES DE PARSING
// ================================
console.log("📄 Configuring parsing middlewares...");

// Parsing JSON et URL-encoded
app.use(
  express.json({
    limit: "10mb",
    type: ["application/json", "text/plain"],
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Cookie parser
app.use(cookieParser("secret-key-for-signed-cookies"));

// Session middleware
app.use(
  session({
    secret: "session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true en production avec HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    },
  })
);

// ================================
// 7. MIDDLEWARE DE VALIDATION
// ================================
console.log("✅ Configuring validation middleware...");

// Middleware de validation personnalisé
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation error",
      details: errors.array(),
    });
  }
  next();
};

// ================================
// 8. MIDDLEWARE PERSONNALISÉ POUR MÉTRIQUES
// ================================
console.log("📊 Configuring metrics middleware...");

const metrics = {
  requests: 0,
  responses: { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 },
  totalResponseTime: 0,
  averageResponseTime: 0,
};

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  metrics.requests++;

  // Intercept response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    metrics.totalResponseTime += duration;
    metrics.averageResponseTime = metrics.totalResponseTime / metrics.requests;

    const statusCategory = `${Math.floor(res.statusCode / 100)}xx`;
    if (metrics.responses[statusCategory] !== undefined) {
      metrics.responses[statusCategory]++;
    }

    res.setHeader("X-Response-Time", `${duration}ms`);
    originalSend.call(this, data);
  };

  next();
};

app.use(metricsMiddleware);

// ================================
// ROUTES DE DÉMONSTRATION
// ================================

// Route de base
app.get("/", (req, res) => {
  res.json({
    message: "Third-party Middlewares Integration Demo",
    timestamp: new Date().toISOString(),
    middlewares: [
      "helmet (security)",
      "morgan (logging)",
      "cors (cross-origin)",
      "compression (gzip)",
      "rate-limiting (throttling)",
      "express-validator (validation)",
      "cookie-parser (cookies)",
      "express-session (sessions)",
    ],
    endpoints: {
      "/": "This page",
      "/api/data": "Protected API endpoint",
      "/api/upload": "File upload simulation",
      "/sensitive": "Strict rate limited endpoint",
      "/test/compression": "Compression test",
      "/test/cors": "CORS test",
      "/test/cookies": "Cookies test",
      "/test/session": "Session test",
      "/metrics": "Application metrics",
      "/health": "Health check",
    },
  });
});

// Route API avec validation
app.post(
  "/api/data",
  [
    body("name")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Must be a valid email"),
    body("age")
      .isInt({ min: 0, max: 120 })
      .withMessage("Age must be between 0 and 120"),
    validateRequest,
  ],
  (req, res) => {
    req.session.lastAction = "data_submitted";

    res.json({
      message: "Data received and validated",
      data: req.body,
      sessionId: req.sessionID,
      timestamp: new Date().toISOString(),
    });
  }
);

// Route sensible avec rate limiting strict
app.get("/sensitive", strictLimiter, (req, res) => {
  res.json({
    message: "Access to sensitive resource granted",
    remainingRequests: req.rateLimit.remaining,
    resetTime: new Date(req.rateLimit.resetTime).toISOString(),
  });
});

// Test de compression
app.get("/test/compression", (req, res) => {
  const largeData = {
    message: "This is a compression test",
    data: new Array(1000).fill("This is some data to compress. ").join(""),
    metadata: {
      size: "large",
      purpose: "compression testing",
      timestamp: new Date().toISOString(),
    },
  };

  res.json(largeData);
});

// Test CORS
app.get("/test/cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.get("Origin") || "No origin header",
    headers: req.headers,
    method: req.method,
  });
});

// Test des cookies
app.get("/test/cookies", (req, res) => {
  // Set some cookies
  res.cookie("testCookie", "testValue", { maxAge: 900000, httpOnly: true });
  res.cookie("signedCookie", "signedValue", { signed: true });

  res.json({
    message: "Cookies test",
    receivedCookies: req.cookies,
    signedCookies: req.signedCookies,
    setCookies: ["testCookie", "signedCookie"],
  });
});

// Test des sessions
app.get("/test/session", (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;

  res.json({
    message: "Session test",
    sessionId: req.sessionID,
    views: req.session.views,
    lastAction: req.session.lastAction || "none",
  });
});

// Métriques de l'application
app.get("/metrics", (req, res) => {
  res.json({
    message: "Application metrics",
    metrics: {
      totalRequests: metrics.requests,
      responsesByStatus: metrics.responses,
      averageResponseTime: `${metrics.averageResponseTime.toFixed(2)}ms`,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.version,
    middlewares: "all loaded",
  });
});

// Route pour tester la performance
app.get("/test/performance", (req, res) => {
  const start = Date.now();

  // Simulation d'une opération
  setTimeout(() => {
    const duration = Date.now() - start;
    res.json({
      message: "Performance test completed",
      processingTime: `${duration}ms`,
      serverLoad: process.cpuUsage(),
      timestamp: new Date().toISOString(),
    });
  }, Math.random() * 200);
});

// ================================
// MIDDLEWARE DE GESTION D'ERREURS
// ================================

// Gestion des erreurs CORS
app.use((error, req, res, next) => {
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed by CORS policy",
      origin: req.get("Origin"),
    });
  }
  next(error);
});

// Gestion générale des erreurs
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);

  res.status(err.status || 500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong",
    timestamp: new Date().toISOString(),
  });
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /",
      "POST /api/data",
      "GET /sensitive",
      "GET /test/compression",
      "GET /test/cors",
      "GET /test/cookies",
      "GET /test/session",
      "GET /metrics",
      "GET /health",
    ],
  });
});

// ================================
// DÉMARRAGE DU SERVEUR
// ================================

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 EX3 - Third-party Middlewares Integration Server");
  console.log("=".repeat(60));
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log("");
  console.log("🔧 Loaded middlewares:");
  console.log("  🛡️  Helmet         - Security headers");
  console.log("  📝 Morgan          - HTTP request logging");
  console.log("  🌐 CORS           - Cross-origin resource sharing");
  console.log("  🗜️  Compression    - Response compression (gzip)");
  console.log("  🚦 Rate Limiting  - Request throttling");
  console.log("  ⏳ Slow Down      - Progressive delay");
  console.log("  ✅ Validator      - Request validation");
  console.log("  🍪 Cookie Parser  - Cookie handling");
  console.log("  📄 Sessions       - Session management");
  console.log("  📊 Metrics        - Custom metrics tracking");
  console.log("");
  console.log("📋 Available endpoints:");
  console.log("  GET  /                     - Welcome page");
  console.log("  POST /api/data             - Validated API endpoint");
  console.log("  GET  /sensitive            - Strict rate limited");
  console.log("  GET  /test/compression     - Compression test");
  console.log("  GET  /test/cors            - CORS test");
  console.log("  GET  /test/cookies         - Cookies test");
  console.log("  GET  /test/session         - Session test");
  console.log("  GET  /test/performance     - Performance test");
  console.log("  GET  /metrics              - Application metrics");
  console.log("  GET  /health               - Health check");
  console.log("");
  console.log("🧪 Run tests: npm run test");
  console.log("📝 Logs saved to: ./logs/access.log");
  console.log("=".repeat(60));
});

module.exports = app;
