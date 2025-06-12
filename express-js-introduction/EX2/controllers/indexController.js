// Contrôleur pour les pages principales
const indexController = {
  // Page d'accueil
  home: (req, res) => {
    res.render("index", {
      title: "Accueil",
      message: "Bienvenue sur notre projet ExpressJS complet!",
      currentTime: new Date().toLocaleString("fr-FR"),
    });
  },

  // Page à propos
  about: (req, res) => {
    res.render("about", {
      title: "À propos",
      description:
        "Ce projet démontre une structure ExpressJS complète avec MVC.",
      features: [
        "Architecture MVC",
        "Gestion des fichiers statiques",
        "Moteur de template EJS",
        "Middleware personnalisés",
        "API RESTful",
        "Gestion d'erreurs",
      ],
    });
  },

  // Page contact
  contact: (req, res) => {
    res.render("contact", {
      title: "Contact",
      message: null,
    });
  },

  // Traitement du formulaire de contact
  submitContact: (req, res) => {
    const { name, email, message } = req.body;

    // Simulation de traitement
    console.log("📧 Nouveau message de contact:", { name, email, message });

    res.render("contact", {
      title: "Contact",
      message: `Merci ${name}, votre message a été envoyé avec succès!`,
    });
  },
};

module.exports = indexController;
