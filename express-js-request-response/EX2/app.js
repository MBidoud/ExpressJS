const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sharp = require("sharp");

const app = express();
const PORT = process.env.PORT || 5001;

// Sécurité
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    },
  })
);

// Rate limiting
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limite 10 uploads par 15 minutes
  message: "Trop d'uploads, veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Créer les dossiers nécessaires
const uploadsDir = path.join(__dirname, "uploads");
const thumbnailsDir = path.join(__dirname, "uploads", "thumbnails");
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(thumbnailsDir);

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filtres de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Type de fichier non autorisé. Seuls JPEG, PNG et GIF sont acceptés."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // Maximum 5 fichiers
  },
  fileFilter: fileFilter,
});

// Stockage des métadonnées des images
let gallery = [];

// Fonction pour créer une miniature
async function createThumbnail(imagePath, filename) {
  try {
    const thumbnailPath = path.join(thumbnailsDir, filename);
    await sharp(imagePath)
      .resize(200, 200, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    return thumbnailPath;
  } catch (error) {
    console.error("Erreur création miniature:", error);
    return null;
  }
}

// Template engine simple
app.engine("html", (filePath, options, callback) => {
  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) return callback(err);
    Object.keys(options).forEach((key) => {
      const regex = new RegExp(`{${key}}`, "g");
      // Safely convert value to string, handling objects and arrays
      let value = options[key];
      if (value === null || value === undefined) {
        value = "";
      } else if (typeof value === "object") {
        value = JSON.stringify(value);
      } else {
        value = String(value);
      }
      content = content.replace(regex, value);
    });

    return callback(null, content);
  });
});

app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// Routes

// Page d'accueil avec formulaire d'upload
app.get("/", (req, res) => {
  res.render("index", {
    title: "Galerie d'images - Upload",
    totalImages: gallery.length,
    recentImages: gallery.slice(-3).reverse(),
    maxSize: "5MB",
    allowedTypes: "JPEG, PNG, GIF",
  });
});

// Upload de fichiers
app.post(
  "/upload",
  uploadLimiter,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).render("error", {
          title: "Erreur d'upload",
          message: "Aucun fichier sélectionné.",
          error: "Veuillez sélectionner au moins une image.",
        });
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        // Créer une miniature
        const thumbnailPath = await createThumbnail(
          file.path,
          `thumb_${file.filename}`
        );

        const imageData = {
          id: Date.now() + Math.random(),
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          thumbnailPath: thumbnailPath,
          size: file.size,
          mimetype: file.mimetype,
          uploadDate: new Date(),
          description: req.body.description || "",
          tags: req.body.tags
            ? req.body.tags.split(",").map((tag) => tag.trim())
            : [],
        };

        gallery.push(imageData);
        uploadedFiles.push(imageData);
      }

      res.render("upload-success", {
        title: "Upload réussi",
        uploadedFiles: uploadedFiles,
        totalFiles: uploadedFiles.length,
        totalSize: uploadedFiles.reduce((total, file) => total + file.size, 0),
      });
    } catch (error) {
      console.error("Erreur upload:", error);
      res.status(500).render("error", {
        title: "Erreur d'upload",
        message: "Une erreur est survenue lors de l'upload.",
        error: error.message,
      });
    }
  }
);

// Galerie d'images
app.get("/gallery", (req, res) => {
  const sortBy = req.query.sort || "date";
  const order = req.query.order || "desc";
  const search = req.query.search || "";

  let filteredGallery = gallery;

  // Filtrage par recherche
  if (search) {
    filteredGallery = gallery.filter(
      (img) =>
        img.originalName.toLowerCase().includes(search.toLowerCase()) ||
        img.description.toLowerCase().includes(search.toLowerCase()) ||
        img.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Tri
  filteredGallery.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.originalName.toLowerCase();
        bValue = b.originalName.toLowerCase();
        break;
      case "size":
        aValue = a.size;
        bValue = b.size;
        break;
      case "date":
      default:
        aValue = new Date(a.uploadDate);
        bValue = new Date(b.uploadDate);
        break;
    }

    if (order === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  res.render("gallery", {
    title: "Galerie d'images",
    images: filteredGallery,
    totalImages: filteredGallery.length,
    search: search,
    sortBy: sortBy,
    order: order,
    totalSize: gallery.reduce((total, img) => total + img.size, 0),
  });
});

// Voir une image en détail
app.get("/image/:id", (req, res) => {
  const image = gallery.find((img) => img.id == req.params.id);

  if (!image) {
    return res.status(404).render("error", {
      title: "Image non trouvée",
      message: "L'image demandée n'existe pas.",
      error: "Image introuvable",
    });
  }

  res.render("image-detail", {
    title: `Image - ${image.originalName}`,
    image: image,
    formattedSize: (image.size / 1024 / 1024).toFixed(2),
    formattedDate: image.uploadDate.toLocaleDateString("fr-FR"),
  });
});

// Supprimer une image
app.delete("/image/:id", async (req, res) => {
  try {
    const imageIndex = gallery.findIndex((img) => img.id == req.params.id);

    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Image non trouvée" });
    }

    const image = gallery[imageIndex];

    // Supprimer les fichiers
    await fs.remove(image.path);
    if (image.thumbnailPath) {
      await fs.remove(image.thumbnailPath);
    }

    // Retirer de la galerie
    gallery.splice(imageIndex, 1);

    res.json({ success: true, message: "Image supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de la suppression" });
  }
});

// API - Liste des images
app.get("/api/images", (req, res) => {
  res.json({
    success: true,
    total: gallery.length,
    images: gallery.map((img) => ({
      id: img.id,
      originalName: img.originalName,
      filename: img.filename,
      size: img.size,
      mimetype: img.mimetype,
      uploadDate: img.uploadDate,
      description: img.description,
      tags: img.tags,
    })),
  });
});

// API - Statistiques
app.get("/api/stats", (req, res) => {
  const totalSize = gallery.reduce((total, img) => total + img.size, 0);
  const typeStats = gallery.reduce((stats, img) => {
    const type = img.mimetype.split("/")[1];
    stats[type] = (stats[type] || 0) + 1;
    return stats;
  }, {});

  res.json({
    success: true,
    totalImages: gallery.length,
    totalSize: totalSize,
    averageSize:
      gallery.length > 0 ? Math.round(totalSize / gallery.length) : 0,
    typeStats: typeStats,
    recentUploads: gallery.slice(-5).reverse(),
  });
});

// Réinitialiser la galerie
app.post("/api/reset", async (req, res) => {
  try {
    // Supprimer tous les fichiers uploadés
    for (const image of gallery) {
      await fs.remove(image.path);
      if (image.thumbnailPath) {
        await fs.remove(image.thumbnailPath);
      }
    }

    // Vider la galerie
    gallery = [];

    res.json({
      success: true,
      message: "Galerie réinitialisée avec succès",
    });
  } catch (error) {
    console.error("Erreur réinitialisation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation",
    });
  }
});

// Gestion des erreurs Multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).render("error", {
        title: "Fichier trop volumineux",
        message: "Le fichier dépasse la taille maximale autorisée (5MB).",
        error: error.message,
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).render("error", {
        title: "Trop de fichiers",
        message: "Vous ne pouvez upload que 5 fichiers maximum.",
        error: error.message,
      });
    }
  }

  if (error.message.includes("Type de fichier non autorisé")) {
    return res.status(400).render("error", {
      title: "Type de fichier non autorisé",
      message: "Seuls les fichiers JPEG, PNG et GIF sont acceptés.",
      error: error.message,
    });
  }

  res.status(500).render("error", {
    title: "Erreur serveur",
    message: "Une erreur inattendue est survenue.",
    error: error.message,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(
    `🚀 Serveur EX2 (Upload de fichiers) démarré sur http://localhost:${PORT}`
  );
  console.log(`📁 Dossier uploads: ${uploadsDir}`);
  console.log(`🖼️  Miniatures: ${thumbnailsDir}`);
});

module.exports = app;
