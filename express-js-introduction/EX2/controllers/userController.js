// Données simulées d'utilisateurs
const users = [
  {
    id: 1,
    name: "Alice Dupont",
    email: "alice@example.com",
    age: 28,
    city: "Paris",
  },
  {
    id: 2,
    name: "Bob Martin",
    email: "bob@example.com",
    age: 35,
    city: "Lyon",
  },
  {
    id: 3,
    name: "Claire Rousseau",
    email: "claire@example.com",
    age: 24,
    city: "Marseille",
  },
  {
    id: 4,
    name: "David Leroy",
    email: "david@example.com",
    age: 42,
    city: "Toulouse",
  },
];

const userController = {
  // Obtenir tous les utilisateurs
  getAllUsers: (req, res) => {
    res.render("users/list", {
      title: "Liste des utilisateurs",
      users: users,
    });
  },

  // Obtenir un utilisateur par ID
  getUserById: (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.render("users/detail", {
        title: `Profil de ${user.name}`,
        user: user,
      });
    } else {
      res.status(404).render("error", {
        title: "Utilisateur non trouvé",
        message: "L'utilisateur demandé n'existe pas.",
        error: { status: 404 },
      });
    }
  },

  // Créer un nouvel utilisateur (pour l'API)
  createUser: (req, res) => {
    const { name, email, age, city } = req.body;
    const newUser = {
      id: users.length + 1,
      name,
      email,
      age: parseInt(age),
      city,
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: newUser,
    });
  },
};

module.exports = userController;
