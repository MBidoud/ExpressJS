const { v4: uuidv4 } = require("uuid");

// Données de test pour les articles de blog
const posts = [
  {
    id: uuidv4(),
    title: "Introduction à Express.js",
    content: "Express.js est un framework web minimaliste pour Node.js...",
    category: "tech",
    author: "Alice Dupont",
    publishedAt: "2024-01-15T10:00:00.000Z",
    tags: ["express", "nodejs", "web"],
  },
  {
    id: uuidv4(),
    title: "Les meilleures pratiques en JavaScript",
    content:
      "Dans cet article, nous allons explorer les meilleures pratiques...",
    category: "tech",
    author: "Bob Martin",
    publishedAt: "2024-01-22T14:30:00.000Z",
    tags: ["javascript", "best-practices", "coding"],
  },
  {
    id: uuidv4(),
    title: "Comment créer une API REST",
    content: "Une API REST est une interface de programmation...",
    category: "tech",
    author: "Charlie Wilson",
    publishedAt: "2024-02-10T09:15:00.000Z",
    tags: ["api", "rest", "web-services"],
  },
  {
    id: uuidv4(),
    title: "Guide du développeur débutant",
    content: "Si vous débutez en développement, cet article est pour vous...",
    category: "education",
    author: "Diana Smith",
    publishedAt: "2024-02-28T16:45:00.000Z",
    tags: ["beginner", "guide", "development"],
  },
  {
    id: uuidv4(),
    title: "Les tendances tech de 2024",
    content: "Découvrez les principales tendances technologiques...",
    category: "tech",
    author: "Eve Johnson",
    publishedAt: "2024-03-05T11:20:00.000Z",
    tags: ["trends", "2024", "technology"],
  },
  {
    id: uuidv4(),
    title: "Équilibre vie professionnelle et personnelle",
    content:
      "Comment maintenir un bon équilibre entre travail et vie privée...",
    category: "lifestyle",
    author: "Frank Brown",
    publishedAt: "2024-03-12T13:00:00.000Z",
    tags: ["work-life-balance", "wellness", "productivity"],
  },
  {
    id: uuidv4(),
    title: "Cuisiner sainement en 30 minutes",
    content: "Des recettes rapides et saines pour votre quotidien...",
    category: "lifestyle",
    author: "Grace Lee",
    publishedAt: "2024-04-18T12:30:00.000Z",
    tags: ["cooking", "healthy", "quick-recipes"],
  },
  {
    id: uuidv4(),
    title: "Intelligence Artificielle et éthique",
    content: "Les questions éthiques soulevées par l'IA moderne...",
    category: "tech",
    author: "Henry Davis",
    publishedAt: "2024-05-22T15:45:00.000Z",
    tags: ["ai", "ethics", "technology"],
  },
  {
    id: uuidv4(),
    title: "Voyage et découvertes",
    content: "Les plus belles destinations à découvrir cette année...",
    category: "lifestyle",
    author: "Iris Taylor",
    publishedAt: "2024-06-01T08:00:00.000Z",
    tags: ["travel", "destinations", "adventure"],
  },
  {
    id: uuidv4(),
    title: "Sécurité en développement web",
    content: "Les principales vulnérabilités et comment les éviter...",
    category: "tech",
    author: "Jack Miller",
    publishedAt: "2023-12-15T17:30:00.000Z",
    tags: ["security", "web", "vulnerabilities"],
  },
];

// Catégories disponibles
const categories = [
  {
    name: "tech",
    displayName: "Technologie",
    description:
      "Articles sur la technologie, le développement et l'innovation",
  },
  {
    name: "lifestyle",
    displayName: "Style de vie",
    description: "Articles sur le bien-être, les voyages et la vie quotidienne",
  },
  {
    name: "education",
    displayName: "Éducation",
    description: "Articles éducatifs et guides d'apprentissage",
  },
];

module.exports = {
  posts,
  categories,
};
