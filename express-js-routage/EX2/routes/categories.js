const express = require("express");
const router = express.Router();
const { posts, categories } = require("../data/blogData");

// GET /categories - Récupérer toutes les catégories
router.get("/", (req, res) => {
  try {
    // Ajouter le nombre d'articles par catégorie
    const categoriesWithCounts = categories.map((category) => {
      const postCount = posts.filter(
        (post) => post.category === category.name
      ).length;
      return {
        ...category,
        postCount,
      };
    });

    res.status(200).json({
      success: true,
      data: categoriesWithCounts,
      count: categoriesWithCounts.length,
      message: "Catégories récupérées avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des catégories",
    });
  }
});

// GET /categories/:categoryName/posts - Récupérer les articles d'une catégorie spécifique
router.get("/:categoryName/posts", (req, res) => {
  try {
    const { categoryName } = req.params;

    // Convertir le nom de catégorie en minuscules pour la comparaison
    const normalizedCategoryName = categoryName.toLowerCase();

    // Vérifier si la catégorie existe
    const categoryExists = categories.some(
      (cat) => cat.name === normalizedCategoryName
    );

    if (!categoryExists) {
      const availableCategories = categories.map((cat) => cat.name);
      return res.status(404).json({
        success: false,
        error: `Catégorie '${categoryName}' non trouvée`,
        availableCategories: availableCategories,
      });
    }

    // Filtrer les articles par catégorie
    let filteredPosts = posts.filter(
      (post) => post.category.toLowerCase() === normalizedCategoryName
    );

    // Trier par date de publication (plus récent en premier)
    filteredPosts = filteredPosts.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // Récupérer les informations de la catégorie
    const categoryInfo = categories.find(
      (cat) => cat.name === normalizedCategoryName
    );

    res.status(200).json({
      success: true,
      data: filteredPosts,
      count: filteredPosts.length,
      category: categoryInfo,
      message: `Articles de la catégorie '${categoryInfo.displayName}' récupérés avec succès`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des articles de la catégorie",
    });
  }
});

// GET /categories/:categoryName - Récupérer les informations d'une catégorie spécifique
router.get("/:categoryName", (req, res) => {
  try {
    const { categoryName } = req.params;
    const normalizedCategoryName = categoryName.toLowerCase();

    // Trouver la catégorie
    const category = categories.find(
      (cat) => cat.name === normalizedCategoryName
    );

    if (!category) {
      const availableCategories = categories.map((cat) => cat.name);
      return res.status(404).json({
        success: false,
        error: `Catégorie '${categoryName}' non trouvée`,
        availableCategories: availableCategories,
      });
    }

    // Compter les articles dans cette catégorie
    const postCount = posts.filter(
      (post) => post.category === category.name
    ).length;

    // Récupérer les tags les plus utilisés dans cette catégorie
    const categoryPosts = posts.filter(
      (post) => post.category === category.name
    );
    const allTags = categoryPosts.flatMap((post) => post.tags);
    const tagCounts = {};
    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    res.status(200).json({
      success: true,
      data: {
        ...category,
        postCount,
        topTags,
      },
      message: `Informations de la catégorie '${category.displayName}' récupérées avec succès`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des informations de la catégorie",
    });
  }
});

module.exports = router;
