const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// Route page d'accueil
router.get("/", indexController.home);

// Route à propos
router.get("/about", indexController.about);

// Route contact
router.get("/contact", indexController.contact);

// Route pour traiter le formulaire de contact
router.post("/contact", indexController.submitContact);

module.exports = router;
