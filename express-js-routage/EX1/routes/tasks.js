const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Stockage en mémoire des tâches (pour la démonstration)
let tasks = [
  {
    id: "1",
    title: "Apprendre Express.js",
    description: "Comprendre les bases du framework Express.js",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Créer une API REST",
    description: "Développer une API complète avec Express",
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

// GET /tasks - Récupérer toutes les tâches
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des tâches",
    });
  }
});

// GET /tasks/:id - Récupérer une tâche spécifique
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de la tâche",
    });
  }
});

// POST /tasks - Créer une nouvelle tâche
router.post("/", (req, res) => {
  try {
    const { title, description, completed = false } = req.body;

    // Validation des données
    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Le titre est requis",
      });
    }

    const newTask = {
      id: uuidv4(),
      title,
      description: description || "",
      completed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask,
      message: "Tâche créée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la création de la tâche",
    });
  }
});

// PUT /tasks/:id - Mettre à jour une tâche existante
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    // Validation des données
    if (!title && description === undefined && completed === undefined) {
      return res.status(400).json({
        success: false,
        error: "Au moins un champ doit être fourni pour la mise à jour",
      });
    }

    // Mise à jour des champs fournis
    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      data: tasks[taskIndex],
      message: "Tâche mise à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour de la tâche",
    });
  }
});

// DELETE /tasks/:id - Supprimer une tâche
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Tâche non trouvée",
      });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.status(200).json({
      success: true,
      data: deletedTask,
      message: "Tâche supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de la tâche",
    });
  }
});

module.exports = router;
