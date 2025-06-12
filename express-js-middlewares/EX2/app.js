const express = require("express");
const {
  authenticate,
  authorize,
  optionalAuth,
  generateToken,
  validateCredentials,
  revokeToken,
  authLogger,
} = require("./middleware/auth");

const app = express();
const PORT = 4001;

// Middlewares de base
app.use(express.json());
app.use(authLogger);

// Route de connexion (login)
app.post("/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Bad request",
        message: "Username and password are required",
      });
    }

    const user = validateCredentials(username, password);

    if (!user) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid username or password",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: "Login failed",
    });
  }
});

// Route de déconnexion (logout)
app.post("/auth/logout", authenticate, (req, res) => {
  try {
    revokeToken(req.token);

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: "Logout failed",
    });
  }
});

// Route publique
app.get("/public", (req, res) => {
  res.json({
    message: "This is a public endpoint",
    timestamp: new Date().toISOString(),
    access: "public",
  });
});

// Route avec authentification optionnelle
app.get("/public/personalized", optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      message: `Hello ${req.user.username}! This is personalized content.`,
      user: req.user,
      access: "authenticated",
    });
  } else {
    res.json({
      message: "Hello anonymous user! This is generic content.",
      access: "anonymous",
    });
  }
});

// Route protégée - authentification requise
app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Access granted to protected resource",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Route pour les utilisateurs authentifiés
app.get("/user/profile", authenticate, (req, res) => {
  res.json({
    message: "User profile data",
    profile: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      lastLogin: new Date().toISOString(),
    },
  });
});

// Route pour admin seulement
app.get("/admin/users", authenticate, authorize(["admin"]), (req, res) => {
  const { users } = require("./middleware/auth");

  res.json({
    message: "Admin access - Users list",
    users: users.map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    })),
  });
});

// Route pour admin et user
app.get(
  "/user/data",
  authenticate,
  authorize(["admin", "user"]),
  (req, res) => {
    res.json({
      message: "User data access granted",
      data: {
        someData: "This is sensitive user data",
        accessLevel: req.user.role,
        timestamp: new Date().toISOString(),
      },
    });
  }
);

// Route POST protégée
app.post(
  "/protected/action",
  authenticate,
  authorize(["admin", "user"]),
  (req, res) => {
    res.json({
      message: "Protected action executed",
      action: req.body.action || "default",
      executedBy: req.user.username,
      timestamp: new Date().toISOString(),
    });
  }
);

// Route de test de performance avec auth
app.get("/test/performance", authenticate, (req, res) => {
  const start = Date.now();

  // Simulation d'une opération
  setTimeout(() => {
    const duration = Date.now() - start;
    res.json({
      message: "Performance test completed",
      duration: `${duration}ms`,
      user: req.user.username,
    });
  }, Math.random() * 100);
});

// Route d'information sur le token
app.get("/auth/verify", authenticate, (req, res) => {
  res.json({
    message: "Token is valid",
    tokenInfo: {
      user: req.user,
      issuedAt: new Date(req.user.iat * 1000).toISOString(),
      valid: true,
    },
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong",
  });
});

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 EX2 - Authentication Middleware Server");
  console.log("=".repeat(50));
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log("");
  console.log("📋 Available endpoints:");
  console.log("");
  console.log("🔓 Public routes:");
  console.log("  GET  /public                    - Public endpoint");
  console.log(
    "  GET  /public/personalized       - Personalized content (optional auth)"
  );
  console.log("");
  console.log("🔑 Authentication:");
  console.log("  POST /auth/login                - Login (get token)");
  console.log("  POST /auth/logout               - Logout (revoke token)");
  console.log("  GET  /auth/verify               - Verify token");
  console.log("");
  console.log("🔒 Protected routes:");
  console.log("  GET  /protected                 - Basic protected route");
  console.log("  GET  /user/profile              - User profile");
  console.log("  GET  /user/data                 - User data (admin/user)");
  console.log(
    "  POST /protected/action          - Protected action (admin/user)"
  );
  console.log("  GET  /test/performance          - Performance test");
  console.log("");
  console.log("👤 Admin only:");
  console.log("  GET  /admin/users               - Users list (admin only)");
  console.log("");
  console.log("🧪 Test credentials:");
  console.log("  admin/admin123 (role: admin)");
  console.log("  user/user123   (role: user)");
  console.log("  guest/guest123 (role: guest)");
  console.log("");
  console.log("🔧 Run tests: npm run test");
  console.log("=".repeat(50));
});

module.exports = app;
