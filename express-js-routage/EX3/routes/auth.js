const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const { users } = require("../data/sampleData");
const { generateToken } = require("../middleware/auth");

// POST /auth/register - Inscription d'un nouvel utilisateur
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address, role } =
      req.body;

    // Validation des champs requis
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: "Email, mot de passe, prénom et nom sont requis",
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Un utilisateur avec cet email existe déjà",
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Format d'email invalide",
      });
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10); // Créer le nouvel utilisateur
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role === "admin" ? "admin" : "customer",
      phone: phone || "",
      address: address || {},
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Générer un token JWT
    const token = generateToken(newUser.id);

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la création de l'utilisateur",
    });
  }
});

// POST /auth/login - Connexion d'un utilisateur
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email et mot de passe requis",
      });
    }

    // Trouver l'utilisateur
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    // Générer un token JWT
    const token = generateToken(user.id);

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la connexion",
    });
  }
});

// GET /auth/profile - Obtenir le profil de l'utilisateur connecté
router.get(
  "/profile",
  require("../middleware/auth").authenticate,
  (req, res) => {
    try {
      const { password, ...userWithoutPassword } = req.user;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération du profil",
      });
    }
  }
);

module.exports = router;
