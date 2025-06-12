const express = require("express");
const router = express.Router();
const { posts } = require("../data/blogData");

// Fonction utilitaire pour valider une année
const isValidYear = (year) => {
  const yearNum = parseInt(year);
  return (
    !isNaN(yearNum) &&
    yearNum >= 2000 &&
    yearNum <= new Date().getFullYear() + 1
  );
};

// Fonction utilitaire pour valider un mois
const isValidMonth = (month) => {
  const monthNum = parseInt(month);
  return !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12;
};

// Fonction utilitaire pour formater un mois en deux chiffres
const formatMonth = (month) => {
  return month.toString().padStart(2, "0");
};

// GET /posts - Récupérer tous les articles (route de base)
router.get("/", (req, res) => {
  try {
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    res.status(200).json({
      success: true,
      data: sortedPosts,
      count: sortedPosts.length,
      message: "Articles récupérés avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des articles",
    });
  }
});

// GET /posts/:year/:month? - Récupérer les articles d'une année et optionnellement d'un mois
router.get("/:year/:month?", (req, res) => {
  try {
    const { year, month } = req.params;

    // Validation de l'année
    if (!isValidYear(year)) {
      return res.status(400).json({
        success: false,
        error:
          "Année invalide. Veuillez fournir une année entre 2000 et " +
          (new Date().getFullYear() + 1),
      });
    }

    // Validation du mois si fourni
    if (month && !isValidMonth(month)) {
      return res.status(400).json({
        success: false,
        error: "Mois invalide. Veuillez fournir un mois entre 1 et 12",
      });
    }

    // Filtrer les articles par année et mois
    let filteredPosts = posts.filter((post) => {
      const postDate = new Date(post.publishedAt);
      const postYear = postDate.getFullYear();
      const postMonth = postDate.getMonth() + 1; // getMonth() retourne 0-11

      if (month) {
        // Filtrer par année ET mois
        return postYear === parseInt(year) && postMonth === parseInt(month);
      } else {
        // Filtrer seulement par année
        return postYear === parseInt(year);
      }
    });

    // Trier par date de publication (plus récent en premier)
    filteredPosts = filteredPosts.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    // Préparer la réponse
    let message = `Articles de l'année ${year}`;
    if (month) {
      const monthNames = [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ];
      message = `Articles de ${monthNames[parseInt(month) - 1]} ${year}`;
    }

    res.status(200).json({
      success: true,
      data: filteredPosts,
      count: filteredPosts.length,
      filters: {
        year: parseInt(year),
        month: month ? parseInt(month) : null,
      },
      message: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des articles",
    });
  }
});

module.exports = router;
