const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// Fonction pour hasher les mots de passe
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Utilisateurs de test
const users = [
  {
    id: "1",
    email: "admin@ecommerce.com",
    password: hashPassword("admin123"),
    firstName: "Admin",
    lastName: "System",
    role: "admin",
    phone: "+33123456789",
    address: {
      street: "123 Rue Admin",
      city: "Paris",
      zipCode: "75001",
      country: "France",
    },
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    email: "john.doe@email.com",
    password: hashPassword("password123"),
    firstName: "John",
    lastName: "Doe",
    role: "customer",
    phone: "+33987654321",
    address: {
      street: "456 Rue Client",
      city: "Lyon",
      zipCode: "69000",
      country: "France",
    },
    createdAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "3",
    email: "jane.smith@email.com",
    password: hashPassword("password123"),
    firstName: "Jane",
    lastName: "Smith",
    role: "customer",
    phone: "+33555666777",
    address: {
      street: "789 Avenue User",
      city: "Marseille",
      zipCode: "13000",
      country: "France",
    },
    createdAt: "2024-02-01T14:20:00.000Z",
  },
];

// Catégories de produits
const categories = [
  {
    id: "1",
    name: "Électronique",
    description: "Appareils électroniques et gadgets",
    slug: "electronique",
  },
  {
    id: "2",
    name: "Vêtements",
    description: "Mode et vêtements pour tous",
    slug: "vetements",
  },
  {
    id: "3",
    name: "Livres",
    description: "Livres et littérature",
    slug: "livres",
  },
  {
    id: "4",
    name: "Maison & Jardin",
    description: "Articles pour la maison et le jardin",
    slug: "maison-jardin",
  },
];

// Produits
const products = [
  {
    id: "1",
    name: "Smartphone Pro Max",
    description:
      "Le dernier smartphone avec toutes les fonctionnalités avancées",
    price: 999.99,
    categoryId: "1",
    stock: 50,
    images: ["smartphone1.jpg", "smartphone2.jpg"],
    features: ["128GB de stockage", "Appareil photo 48MP", "5G", "Écran OLED"],
    weight: 200,
    dimensions: "15.7 x 7.6 x 0.8 cm",
    createdAt: "2024-01-10T09:00:00.000Z",
  },
  {
    id: "2",
    name: "Laptop Gaming Elite",
    description: "Ordinateur portable haute performance pour le gaming",
    price: 1499.99,
    categoryId: "1",
    stock: 25,
    images: ["laptop1.jpg", "laptop2.jpg"],
    features: ["Intel i7", "16GB RAM", "RTX 4060", "SSD 1TB"],
    weight: 2500,
    dimensions: "35.6 x 23.4 x 2.0 cm",
    createdAt: "2024-01-12T11:30:00.000Z",
  },
  {
    id: "3",
    name: "T-shirt Premium",
    description: "T-shirt en coton bio de haute qualité",
    price: 29.99,
    categoryId: "2",
    stock: 100,
    images: ["tshirt1.jpg"],
    features: ["100% coton bio", "Coupe moderne", "Lavable en machine"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blanc", "Noir", "Bleu", "Rouge"],
    createdAt: "2024-01-20T16:45:00.000Z",
  },
  {
    id: "4",
    name: "Guide de Programmation JavaScript",
    description: "Manuel complet pour apprendre JavaScript moderne",
    price: 45.99,
    categoryId: "3",
    stock: 75,
    images: ["book1.jpg"],
    features: ["500 pages", "Exemples pratiques", "ES6+", "Projets inclus"],
    author: "Expert Dev",
    publisher: "Tech Éditions",
    createdAt: "2024-01-25T13:15:00.000Z",
  },
  {
    id: "5",
    name: "Cafetière Automatique",
    description: "Cafetière programmable avec broyeur intégré",
    price: 199.99,
    categoryId: "4",
    stock: 30,
    images: ["coffee1.jpg", "coffee2.jpg"],
    features: ["Broyeur intégré", "Programmable", "12 tasses", "Écran LCD"],
    warranty: "2 ans",
    createdAt: "2024-02-01T08:20:00.000Z",
  },
];

// Commandes
const orders = [
  {
    id: "1",
    userId: "2",
    items: [
      { productId: "1", quantity: 1, price: 999.99 },
      { productId: "3", quantity: 2, price: 29.99 },
    ],
    totalAmount: 1059.97,
    status: "pending",
    shippingAddress: {
      street: "456 Rue Client",
      city: "Lyon",
      zipCode: "69000",
      country: "France",
    },
    createdAt: "2024-03-01T10:00:00.000Z",
    updatedAt: "2024-03-01T10:00:00.000Z",
  },
  {
    id: "2",
    userId: "3",
    items: [
      { productId: "4", quantity: 1, price: 45.99 },
      { productId: "5", quantity: 1, price: 199.99 },
    ],
    totalAmount: 245.98,
    status: "shipped",
    shippingAddress: {
      street: "789 Avenue User",
      city: "Marseille",
      zipCode: "13000",
      country: "France",
    },
    trackingNumber: "FR123456789",
    createdAt: "2024-02-28T15:30:00.000Z",
    updatedAt: "2024-03-02T09:15:00.000Z",
  },
];

module.exports = {
  users,
  categories,
  products,
  orders,
  hashPassword,
};
