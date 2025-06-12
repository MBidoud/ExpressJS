const express = require("express");
const router = express.Router();

// Route API pour le statut
router.get("/status", (req, res) => {
  res.json({
    status: "OK",
    message: "API fonctionne correctement",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Route API pour les utilisateurs
router.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice Dupont", email: "alice@example.com" },
    { id: 2, name: "Bob Martin", email: "bob@example.com" },
    { id: 3, name: "Claire Rousseau", email: "claire@example.com" },
  ];

  res.json({
    success: true,
    data: users,
    total: users.length,
  });
});

// Route API pour obtenir un utilisateur par ID
router.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const users = [
    { id: 1, name: "Alice Dupont", email: "alice@example.com" },
    { id: 2, name: "Bob Martin", email: "bob@example.com" },
    { id: 3, name: "Claire Rousseau", email: "claire@example.com" },
  ];

  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Utilisateur non trouvé",
    });
  }
});

module.exports = router;
