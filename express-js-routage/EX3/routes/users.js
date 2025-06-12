const express = require("express");
const router = express.Router();
const { users } = require("../data/sampleData");
const { requireOwnership } = require("../middleware/auth");

// GET /users/:id - Récupérer un utilisateur spécifique
router.get("/:id", requireOwnership, (req, res) => {
  try {
    const { id } = req.params;

    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de l'utilisateur",
    });
  }
});

// PUT /users/:id - Mettre à jour un utilisateur
router.put("/:id", requireOwnership, (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, address } = req.body;

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    // Validation des données
    if (firstName !== undefined && firstName.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Le prénom ne peut pas être vide",
      });
    }

    if (lastName !== undefined && lastName.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Le nom ne peut pas être vide",
      });
    }

    // Mettre à jour les champs fournis
    if (firstName !== undefined) users[userIndex].firstName = firstName;
    if (lastName !== undefined) users[userIndex].lastName = lastName;
    if (phone !== undefined) users[userIndex].phone = phone;
    if (address !== undefined) {
      users[userIndex].address = { ...users[userIndex].address, ...address };
    }

    users[userIndex].updatedAt = new Date().toISOString();

    const { password, ...userWithoutPassword } = users[userIndex];

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: "Utilisateur mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour de l'utilisateur",
    });
  }
});

// DELETE /users/:id - Supprimer un utilisateur
router.delete("/:id", requireOwnership, (req, res) => {
  try {
    const { id } = req.params;

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    // Empêcher l'auto-suppression sauf pour les admins
    if (req.user.id === id && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        error: "Vous ne pouvez pas supprimer votre propre compte",
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    const { password, ...userWithoutPassword } = deletedUser;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de l'utilisateur",
    });
  }
});

// GET /users/:id/orders - Récupérer les commandes d'un utilisateur
router.get("/:id/orders", requireOwnership, (req, res) => {
  try {
    const { id } = req.params;
    const { orders } = require("../data/sampleData");

    const userOrders = orders.filter((order) => order.userId === id);

    res.status(200).json({
      success: true,
      data: userOrders,
      count: userOrders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des commandes",
    });
  }
});

module.exports = router;
