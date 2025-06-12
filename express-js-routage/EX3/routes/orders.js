const express = require("express");
const router = express.Router();
const { orders, products } = require("../data/sampleData");
const { v4: uuidv4 } = require("uuid");

// GET /orders - Récupérer les commandes de l'utilisateur connecté
router.get("/", (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let userOrders = orders.filter((order) => order.userId === userId);

    // Filtrage par statut
    if (status) {
      userOrders = userOrders.filter((order) => order.status === status);
    }

    // Tri par date de création (plus récent en premier)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedOrders = userOrders.slice(startIndex, endIndex);

    // Enrichir les commandes avec les détails des produits
    const enrichedOrders = paginatedOrders.map((order) => {
      const enrichedItems = order.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          ...item,
          product: product
            ? {
                id: product.id,
                name: product.name,
                images: product.images,
              }
            : null,
        };
      });

      return {
        ...order,
        items: enrichedItems,
      };
    });

    res.status(200).json({
      success: true,
      data: enrichedOrders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(userOrders.length / limitNum),
        totalItems: userOrders.length,
        itemsPerPage: limitNum,
        hasNextPage: endIndex < userOrders.length,
        hasPrevPage: pageNum > 1,
      },
      filters: { status },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des commandes",
    });
  }
});

// POST /orders - Créer une nouvelle commande
router.post("/", (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress } = req.body;

    // Validation des données
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Au moins un article est requis",
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        error: "Adresse de livraison complète requise",
      });
    }

    // Valider et calculer le total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: "ID produit et quantité valide requis pour chaque article",
        });
      }

      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Produit ${item.productId} non trouvé`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuffisant pour ${product.name}. Stock disponible: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Mettre à jour le stock du produit
      product.stock -= item.quantity;
    }

    // Créer la nouvelle commande
    const newOrder = {
      id: uuidv4(),
      userId,
      items: validatedItems,
      totalAmount: Math.round(totalAmount * 100) / 100, // Arrondir à 2 décimales
      status: "pending",
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    // Enrichir la réponse avec les détails des produits
    const enrichedItems = newOrder.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        product: product
          ? {
              id: product.id,
              name: product.name,
              images: product.images,
            }
          : null,
      };
    });

    const enrichedOrder = {
      ...newOrder,
      items: enrichedItems,
    };

    res.status(201).json({
      success: true,
      data: enrichedOrder,
      message: "Commande créée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la création de la commande",
    });
  }
});

// GET /orders/:id - Récupérer une commande spécifique
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Commande non trouvée",
      });
    }

    // Vérifier que l'utilisateur peut accéder à cette commande
    if (order.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Accès non autorisé à cette commande",
      });
    }

    // Enrichir avec les détails des produits
    const enrichedItems = order.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        product: product
          ? {
              id: product.id,
              name: product.name,
              description: product.description,
              images: product.images,
            }
          : null,
      };
    });

    const enrichedOrder = {
      ...order,
      items: enrichedItems,
    };

    res.status(200).json({
      success: true,
      data: enrichedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de la commande",
    });
  }
});

// PUT /orders/:id/cancel - Annuler une commande
router.put("/:id/cancel", (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Commande non trouvée",
      });
    }

    const order = orders[orderIndex];

    // Vérifier que l'utilisateur peut modifier cette commande
    if (order.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Accès non autorisé à cette commande",
      });
    }

    // Vérifier que la commande peut être annulée
    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        error: "Cette commande est déjà annulée",
      });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        error: "Impossible d'annuler une commande déjà livrée",
      });
    }

    // Remettre en stock les produits
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    });

    // Mettre à jour le statut
    orders[orderIndex].status = "cancelled";
    orders[orderIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      data: orders[orderIndex],
      message: "Commande annulée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'annulation de la commande",
    });
  }
});

module.exports = router;
