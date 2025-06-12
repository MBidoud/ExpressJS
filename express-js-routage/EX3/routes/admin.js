const express = require("express");
const router = express.Router();
const { products, categories, users, orders } = require("../data/sampleData");
const { v4: uuidv4 } = require("uuid");

// GET /admin/dashboard - Tableau de bord administrateur
router.get("/dashboard", (req, res) => {
  try {
    // Statistiques générales
    const totalUsers = users.filter((u) => u.role === "customer").length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Commandes par statut
    const ordersByStatus = {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    // Produits populaires (basé sur les commandes)
    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = 0;
        }
        productSales[item.productId] += item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return {
          product: product
            ? {
                id: product.id,
                name: product.name,
                price: product.price,
              }
            : null,
          quantitySold: quantity,
        };
      });

    // Statistiques par catégorie
    const categoryStats = categories.map((category) => {
      const categoryProducts = products.filter(
        (p) => p.categoryId === category.id
      );
      const categoryOrders = orders.filter((order) =>
        order.items.some((item) =>
          categoryProducts.some((p) => p.id === item.productId)
        )
      );

      return {
        category: category.name,
        productCount: categoryProducts.length,
        orderCount: categoryOrders.length,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
        },
        ordersByStatus,
        topProducts,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du tableau de bord",
    });
  }
});

// GET /admin/users - Récupérer tous les utilisateurs
router.get("/users", (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;

    let filteredUsers = users;

    // Filtrage par rôle
    if (role) {
      filteredUsers = users.filter((u) => u.role === role);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Supprimer les mots de passe des réponses
    const usersWithoutPasswords = paginatedUsers.map(
      ({ password, ...user }) => user
    );

    res.status(200).json({
      success: true,
      data: usersWithoutPasswords,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredUsers.length / limitNum),
        totalItems: filteredUsers.length,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des utilisateurs",
    });
  }
});

// GET /admin/orders - Récupérer toutes les commandes
router.get("/orders", (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    let filteredOrders = [...orders];

    // Filtrage par statut
    if (status) {
      filteredOrders = filteredOrders.filter((o) => o.status === status);
    }

    // Filtrage par utilisateur
    if (userId) {
      filteredOrders = filteredOrders.filter((o) => o.userId === userId);
    }

    // Tri par date de création (plus récent en premier)
    filteredOrders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Enrichir avec les informations utilisateur
    const enrichedOrders = paginatedOrders.map((order) => {
      const user = users.find((u) => u.id === order.userId);
      return {
        ...order,
        user: user
          ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data: enrichedOrders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredOrders.length / limitNum),
        totalItems: filteredOrders.length,
        itemsPerPage: limitNum,
      },
      filters: { status, userId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des commandes",
    });
  }
});

// POST /admin/products - Créer un nouveau produit
router.post("/products", (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      stock,
      images,
      features,
      weight,
      dimensions,
    } = req.body;

    // Validation des champs requis
    if (!name || !description || !price || !categoryId || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Nom, description, prix, catégorie et stock sont requis",
      });
    }

    // Vérifier que la catégorie existe
    const category = categories.find((c) => c.id === categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: "Catégorie invalide",
      });
    }

    // Validation du prix et du stock
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        error: "Le prix doit être un nombre positif",
      });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        error: "Le stock doit être un nombre positif ou zéro",
      });
    }

    // Créer le nouveau produit
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price: parseFloat(price),
      categoryId,
      stock: parseInt(stock),
      images: images || [],
      features: features || [],
      weight: weight || null,
      dimensions: dimensions || null,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Produit créé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la création du produit",
    });
  }
});

// PUT /admin/products/:id - Mettre à jour un produit
router.put("/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé",
      });
    }

    // Validation des mises à jour
    if (
      updates.price !== undefined &&
      (isNaN(updates.price) || updates.price <= 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Le prix doit être un nombre positif",
      });
    }

    if (
      updates.stock !== undefined &&
      (isNaN(updates.stock) || updates.stock < 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Le stock doit être un nombre positif ou zéro",
      });
    }

    if (
      updates.categoryId &&
      !categories.find((c) => c.id === updates.categoryId)
    ) {
      return res.status(400).json({
        success: false,
        error: "Catégorie invalide",
      });
    }

    // Appliquer les mises à jour
    const allowedFields = [
      "name",
      "description",
      "price",
      "categoryId",
      "stock",
      "images",
      "features",
      "weight",
      "dimensions",
    ];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        products[productIndex][field] = updates[field];
      }
    });

    products[productIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      data: products[productIndex],
      message: "Produit mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du produit",
    });
  }
});

// DELETE /admin/products/:id - Supprimer un produit
router.delete("/products/:id", (req, res) => {
  try {
    const { id } = req.params;

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé",
      });
    }

    // Vérifier s'il y a des commandes en cours avec ce produit
    const activeOrders = orders.filter(
      (order) =>
        order.status !== "cancelled" &&
        order.status !== "delivered" &&
        order.items.some((item) => item.productId === id)
    );

    if (activeOrders.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Impossible de supprimer un produit avec des commandes en cours",
      });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: "Produit supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression du produit",
    });
  }
});

// PUT /admin/orders/:id/status - Mettre à jour le statut d'une commande
router.put("/orders/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Statut invalide. Statuts valides: " + validStatuses.join(", "),
      });
    }

    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Commande non trouvée",
      });
    }

    // Mettre à jour le statut
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    // Ajouter le numéro de suivi si fourni
    if (trackingNumber && status === "shipped") {
      orders[orderIndex].trackingNumber = trackingNumber;
    }

    res.status(200).json({
      success: true,
      data: orders[orderIndex],
      message: "Statut de la commande mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du statut de la commande",
    });
  }
});

// GET /admin/stats - Statistiques générales (alias pour dashboard.overview)
router.get("/stats", (req, res) => {
  try {
    // Statistiques générales
    const totalUsers = users.filter((u) => u.role === "customer").length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques",
    });
  }
});

module.exports = router;
