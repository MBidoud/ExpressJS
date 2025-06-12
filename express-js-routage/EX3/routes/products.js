const express = require("express");
const router = express.Router();
const { products, categories } = require("../data/sampleData");

// GET /products - Récupérer tous les produits avec pagination et filtrage
router.get("/", (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let filteredProducts = [...products];

    // Filtrage par catégorie
    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.categoryId === category
      );
    }

    // Filtrage par prix
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter((p) => p.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter((p) => p.price <= max);
      }
    }

    // Recherche textuelle
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Tri
    filteredProducts.sort((a, b) => {
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

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Ajouter les informations de catégorie à chaque produit
    const productsWithCategory = paginatedProducts.map((product) => {
      const category = categories.find((c) => c.id === product.categoryId);
      return {
        ...product,
        category: category || null,
      };
    });

    res.status(200).json({
      success: true,
      data: productsWithCategory,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredProducts.length / limitNum),
        totalItems: filteredProducts.length,
        itemsPerPage: limitNum,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        search,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des produits",
    });
  }
});

// GET /products/:id - Récupérer un produit spécifique
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const product = products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé",
      });
    }

    // Ajouter les informations de catégorie
    const category = categories.find((c) => c.id === product.categoryId);
    const productWithCategory = {
      ...product,
      category: category || null,
    };

    res.status(200).json({
      success: true,
      data: productWithCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du produit",
    });
  }
});

// GET /products/category/:categoryId - Récupérer les produits d'une catégorie
router.get("/category/:categoryId", (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Vérifier si la catégorie existe
    const category = categories.find((c) => c.id === categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Catégorie non trouvée",
      });
    }

    const categoryProducts = products.filter(
      (p) => p.categoryId === categoryId
    );

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
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des produits de la catégorie",
    });
  }
});

// GET /products/:id/related - Récupérer les produits similaires
router.get("/:id/related", (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const product = products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé",
      });
    }

    // Trouver des produits de la même catégorie
    const relatedProducts = products
      .filter((p) => p.id !== id && p.categoryId === product.categoryId)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: relatedProducts,
      count: relatedProducts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des produits similaires",
    });
  }
});

module.exports = router;
