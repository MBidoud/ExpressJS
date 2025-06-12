const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route pour lister tous les utilisateurs
router.get("/", userController.getAllUsers);

// Route pour afficher un utilisateur spécifique
router.get("/:id", userController.getUserById);

// Route pour créer un nouvel utilisateur
router.post("/", userController.createUser);

module.exports = router;
