const express = require("express");
const router = express.Router();
const { categories, products } = require("../data/sampleData");

// GET /categories - Récupérer toutes les catégories
router.get("/", (req, res) => {
  try {
    // Ajouter le nombre de produits par catégorie
    const categoriesWithStats = categories.map((category) => {
      const categoryProducts = products.filter(
        (p) => p.categoryId === category.id
      );
      const productCount = categoryProducts.length;

      // Calculer les statistiques de prix
      const prices = categoryProducts.map((p) => p.price);
      const avgPrice =
        prices.length > 0
          ? Math.round(
              (prices.reduce((sum, price) => sum + price, 0) / prices.length) *
                100
            ) / 100
          : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

      return {
        ...category,
        stats: {
          productCount,
          avgPrice,
          minPrice,
          maxPrice,
        },
      };
    });

    res.status(200).json({
      success: true,
      data: categoriesWithStats,
      count: categoriesWithStats.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des catégories",
    });
  }
});

// GET /categories/:id - Récupérer une catégorie spécifique
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const category = categories.find((c) => c.id === id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Catégorie non trouvée",
      });
    }

    // Récupérer les produits de cette catégorie
    const categoryProducts = products.filter((p) => p.categoryId === id);

    // Calculer les statistiques
    const productCount = categoryProducts.length;
    const prices = categoryProducts.map((p) => p.price);
    const avgPrice =
      prices.length > 0
        ? Math.round(
            (prices.reduce((sum, price) => sum + price, 0) / prices.length) *
              100
          ) / 100
        : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Produits les plus populaires (simulé - dans une vraie app, basé sur les ventes)
    const topProducts = categoryProducts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.images,
      }));

    const enrichedCategory = {
      ...category,
      stats: {
        productCount,
        avgPrice,
        minPrice,
        maxPrice,
      },
      topProducts,
    };

    res.status(200).json({
      success: true,
      data: enrichedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de la catégorie",
    });
  }
});

// GET /categories/:id/products - Récupérer les produits d'une catégorie (alias vers /products/category/:id)
router.get("/:id/products", (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Vérifier si la catégorie existe
    const category = categories.find((c) => c.id === id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Catégorie non trouvée",
      });
    }

    let categoryProducts = products.filter((p) => p.categoryId === id);

    // Tri
    categoryProducts.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "price") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedProducts,
      category: category,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(categoryProducts.length / limitNum),
        totalItems: categoryProducts.length,
        itemsPerPage: limitNum,
        hasNextPage: endIndex < categoryProducts.length,
        hasPrevPage: pageNum > 1,
      },
      sort: {
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des produits de la catégorie",
    });
  }
});

module.exports = router;
