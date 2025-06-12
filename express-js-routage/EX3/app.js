const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import des routeurs modulaires
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const categoryRoutes = require("./routes/categories");
const adminRoutes = require("./routes/admin");

// Import des middlewares
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3002;

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par IP par fenêtre
  message: {
    success: false,
    error: "Trop de requêtes, veuillez réessayer plus tard",
  },
});

// Middlewares globaux
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(morgan("combined")); // Logging
app.use(limiter); // Rate limiting
app.use(express.json({ limit: "10mb" })); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Middleware de logging personnalisé
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip}`
  );
  next();
});

// Routes publiques
app.get("/", (req, res) => {
  res.json({
    message: "API E-commerce avec Routeurs Modulaires",
    version: "1.0.0",
    documentation: {
      auth: "POST /auth/register, POST /auth/login",
      users: "GET /users/:id, PUT /users/:id (authentifié)",
      products:
        "GET /products, GET /products/:id, GET /products/category/:categoryId",
      orders: "GET /orders, POST /orders, GET /orders/:id (authentifié)",
      categories: "GET /categories, GET /categories/:id",
      admin:
        "POST /admin/products, PUT /admin/products/:id, DELETE /admin/products/:id (admin)",
    },
    endpoints: {
      public: ["/auth/*", "/products/*", "/categories/*"],
      authenticated: ["/users/*", "/orders/*"],
      admin: ["/admin/*"],
    },
  });
});

// Montage des routeurs modulaires
app.use("/auth", authRoutes);
app.use("/users", auth.authenticate, userRoutes); // Routes protégées
app.use("/products", productRoutes);
app.use("/orders", auth.authenticate, orderRoutes); // Routes protégées
app.use("/categories", categoryRoutes);
app.use("/admin", auth.authenticate, auth.requireAdmin, adminRoutes); // Routes admin

// Route de santé
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

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
  console.log(`🚀 Serveur e-commerce démarré sur le port ${PORT}`);
  console.log(`📚 Documentation disponible sur http://localhost:${PORT}`);
  console.log(`🏥 Santé du serveur: http://localhost:${PORT}/health`);
});

module.exports = app;
