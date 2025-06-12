const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const js2xmlparser = require("js2xmlparser");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5002;

// Sécurité
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite 100 requêtes par 15 minutes
  message: {
    error: "Trop de requêtes, veuillez réessayer plus tard.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiLimiter);
app.use(express.static("public"));

// Données simulées
let users = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean@example.com",
    age: 30,
    city: "Paris",
    profession: "Développeur",
    createdAt: "2024-01-15T10:30:00Z",
    isActive: true,
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie@example.com",
    age: 25,
    city: "Lyon",
    profession: "Designer",
    createdAt: "2024-01-20T14:45:00Z",
    isActive: true,
  },
  {
    id: "3",
    name: "Pierre Dubois",
    email: "pierre@example.com",
    age: 35,
    city: "Marseille",
    profession: "Manager",
    createdAt: "2024-01-25T09:15:00Z",
    isActive: false,
  },
];

let products = [
  {
    id: "1",
    name: "Laptop Pro",
    description: "Ordinateur portable haute performance",
    price: 1299.99,
    category: "Informatique",
    stock: 15,
    brand: "TechCorp",
    createdAt: "2024-01-10T08:00:00Z",
    features: ["SSD 512GB", "RAM 16GB", 'Écran 15.6"'],
  },
  {
    id: "2",
    name: "Smartphone X",
    description: "Téléphone intelligent dernière génération",
    price: 899.99,
    category: "Mobile",
    stock: 25,
    brand: "MobileInc",
    createdAt: "2024-01-12T12:30:00Z",
    features: ["Caméra 48MP", "Batterie 4000mAh", "5G"],
  },
  {
    id: "3",
    name: "Casque Audio",
    description: "Casque sans fil avec réduction de bruit",
    price: 299.99,
    category: "Audio",
    stock: 8,
    brand: "SoundTech",
    createdAt: "2024-01-15T16:20:00Z",
    features: ["Bluetooth 5.0", "Autonomie 30h", "Réduction bruit"],
  },
];

// Fonctions utilitaires pour les formats
const formatDate = (date) => moment(date).format("DD/MM/YYYY HH:mm:ss");

const generateHtmlTable = (data, title) => {
  if (!Array.isArray(data) || data.length === 0) {
    return `<p>Aucune donnée disponible pour ${title.toLowerCase()}</p>`;
  }

  const headers = Object.keys(data[0]);
  const headerRow = headers.map((h) => `<th>${h}</th>`).join("");
  const rows = data
    .map((item) => {
      const cells = headers
        .map((h) => {
          let value = item[h];
          if (Array.isArray(value)) {
            value = value.join(", ");
          }
          if (h.includes("At") && value) {
            value = formatDate(value);
          }
          return `<td>${value}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
        <table border="1" cellpadding="10" cellspacing="0">
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
};

const generateHtmlPage = (title, content, metadata = {}) => {
  const stats = {
    timestamp: new Date().toISOString(),
    totalUsers: users.length,
    totalProducts: products.length,
    activeUsers: users.filter((u) => u.isActive).length,
    ...metadata,
  };

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - API Multi-Format</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; 
            padding: 20px; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        h1 { 
            color: #2d3436; 
            margin-bottom: 20px; 
            text-align: center;
            font-size: 2.5em;
        }
        .nav { 
            text-align: center; 
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 15px;
        }
        .nav a { 
            display: inline-block;
            margin: 0 10px; 
            padding: 10px 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .nav a:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .content { 
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 15px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        th { 
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px;
            font-weight: bold;
        }
        td { 
            padding: 12px 15px; 
            border-bottom: 1px solid #eee;
        }
        tr:hover { 
            background-color: #f8f9fa;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: rgba(102, 126, 234, 0.1);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid rgba(102, 126, 234, 0.3);
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #636e72;
            font-size: 0.9em;
        }
        .format-info {
            background: rgba(255, 193, 7, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 4px solid #ffc107;
        }
        .api-endpoint {
            background: rgba(40, 167, 69, 0.1);
            padding: 10px 15px;
            border-radius: 8px;
            font-family: monospace;
            margin: 10px 0;
            border-left: 3px solid #28a745;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 ${title}</h1>
        
        <div class="nav">
            <a href="/api/users">👥 Utilisateurs</a>
            <a href="/api/products">📦 Produits</a>
            <a href="/api/stats">📊 Statistiques</a>
            <a href="/">🏠 Accueil</a>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${stats.totalUsers}</div>
                <div class="stat-label">Utilisateurs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalProducts}</div>
                <div class="stat-label">Produits</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.activeUsers}</div>
                <div class="stat-label">Utilisateurs actifs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${formatDate(stats.timestamp)}</div>
                <div class="stat-label">Dernière MAJ</div>
            </div>
        </div>

        <div class="format-info">
            <strong>💡 Astuce :</strong> Utilisez les headers Accept pour changer le format de réponse :
            <div class="api-endpoint">Accept: application/json</div>
            <div class="api-endpoint">Accept: application/xml</div>
            <div class="api-endpoint">Accept: text/html</div>
        </div>

        <div class="content">
            ${content}
        </div>
    </div>
</body>
</html>`;
};

// Routes principales

// Page d'accueil
app.get("/", (req, res) => {
  const content = `
        <h2>🚀 API Multi-Format avec Express.js</h2>
        <p>Cette API démontre l'utilisation de <code>res.format()</code> pour servir du contenu en différents formats selon le header Accept.</p>
        
        <h3>📡 Endpoints disponibles :</h3>
        <div class="api-endpoint">GET /api/users - Liste des utilisateurs</div>
        <div class="api-endpoint">GET /api/users/:id - Détail d'un utilisateur</div>
        <div class="api-endpoint">POST /api/users - Créer un utilisateur</div>
        <div class="api-endpoint">PUT /api/users/:id - Modifier un utilisateur</div>
        <div class="api-endpoint">DELETE /api/users/:id - Supprimer un utilisateur</div>
        <br>
        <div class="api-endpoint">GET /api/products - Liste des produits</div>
        <div class="api-endpoint">GET /api/products/:id - Détail d'un produit</div>
        <div class="api-endpoint">POST /api/products - Créer un produit</div>
        <div class="api-endpoint">PUT /api/products/:id - Modifier un produit</div>
        <div class="api-endpoint">DELETE /api/products/:id - Supprimer un produit</div>
        <br>
        <div class="api-endpoint">GET /api/stats - Statistiques globales</div>
        <div class="api-endpoint">GET /api/search?q=terme - Recherche</div>
        
        <h3>🎯 Formats supportés :</h3>
        <ul>
            <li><strong>JSON</strong> - Format par défaut pour les APIs</li>
            <li><strong>XML</strong> - Format structuré pour l'interopérabilité</li>
            <li><strong>HTML</strong> - Format pour les navigateurs web</li>
        </ul>
    `;

  res.send(generateHtmlPage("Accueil", content));
});

// API Utilisateurs
app.get("/api/users", (req, res) => {
  const { page = 1, limit = 10, active } = req.query;

  let filteredUsers = users;
  if (active !== undefined) {
    filteredUsers = users.filter((u) => u.isActive === (active === "true"));
  }

  const startIndex = (page - 1) * limit;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + parseInt(limit)
  );

  const response = {
    users: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  };

  res.format({
    "application/json": () => {
      res.json(response);
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("response", response, {
        declaration: { encoding: "UTF-8" },
      });
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const tableHtml = generateHtmlTable(paginatedUsers, "Utilisateurs");
      const content = `
                <h2>👥 Liste des Utilisateurs</h2>
                <p>Page ${page} sur ${Math.ceil(
        filteredUsers.length / limit
      )} - Total: ${filteredUsers.length} utilisateurs</p>
                ${tableHtml}
            `;
      res.send(
        generateHtmlPage("Utilisateurs", content, {
          filteredCount: filteredUsers.length,
        })
      );
    },

    default: () => {
      res.status(406).json({ error: "Format non supporté" });
    },
  });
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).format({
      "application/json": () => {
        res.json({ error: "Utilisateur non trouvé", id: req.params.id });
      },
      "application/xml": () => {
        const xmlData = js2xmlparser.parse("error", {
          message: "Utilisateur non trouvé",
          id: req.params.id,
        });
        res.set("Content-Type", "application/xml");
        res.send(xmlData);
      },
      "text/html": () => {
        const content = `
                    <h2>❌ Utilisateur non trouvé</h2>
                    <p>L'utilisateur avec l'ID <strong>${req.params.id}</strong> n'existe pas.</p>
                `;
        res.send(generateHtmlPage("Erreur 404", content));
      },
    });
  }

  const response = {
    user: user,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  };

  res.format({
    "application/json": () => {
      res.json(response);
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("response", response);
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const content = `
                <h2>👤 Détail de l'utilisateur</h2>
                ${generateHtmlTable([user], "Utilisateur")}
            `;
      res.send(generateHtmlPage(`Utilisateur - ${user.name}`, content));
    },

    default: () => {
      res.status(406).json({ error: "Format non supporté" });
    },
  });
});

app.post("/api/users", (req, res) => {
  const { name, email, age, city, profession } = req.body;

  if (!name || !email) {
    return res.status(400).format({
      "application/json": () => {
        res.json({ error: "Nom et email requis" });
      },
      "application/xml": () => {
        const xmlData = js2xmlparser.parse("error", {
          message: "Nom et email requis",
        });
        res.set("Content-Type", "application/xml");
        res.send(xmlData);
      },
      "text/html": () => {
        const content = `
                    <h2>❌ Erreur de validation</h2>
                    <p>Les champs nom et email sont obligatoires.</p>
                `;
        res.send(generateHtmlPage("Erreur 400", content));
      },
    });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    age: age || null,
    city: city || null,
    profession: profession || null,
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  users.push(newUser);

  const response = {
    message: "Utilisateur créé avec succès",
    user: newUser,
    metadata: {
      timestamp: new Date().toISOString(),
      totalUsers: users.length,
    },
  };

  res.status(201).format({
    "application/json": () => {
      res.json(response);
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("response", response);
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const content = `
                <h2>✅ Utilisateur créé</h2>
                <p>L'utilisateur <strong>${
                  newUser.name
                }</strong> a été créé avec succès.</p>
                ${generateHtmlTable([newUser], "Nouvel utilisateur")}
            `;
      res.send(generateHtmlPage("Création réussie", content));
    },

    default: () => {
      res.status(406).json({ error: "Format non supporté" });
    },
  });
});

// API Produits
app.get("/api/products", (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseFloat(maxPrice)
    );
  }

  const response = {
    products: filteredProducts,
    filters: { category, minPrice, maxPrice },
    metadata: {
      timestamp: new Date().toISOString(),
      totalAvailable: filteredProducts.reduce((sum, p) => sum + p.stock, 0),
    },
  };

  res.format({
    "application/json": () => {
      res.json(response);
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("response", response);
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const tableHtml = generateHtmlTable(filteredProducts, "Produits");
      const content = `
                <h2>📦 Liste des Produits</h2>
                <p>Total: ${filteredProducts.length} produits trouvés</p>
                ${
                  category
                    ? `<p><strong>Catégorie filtrée:</strong> ${category}</p>`
                    : ""
                }
                ${
                  minPrice
                    ? `<p><strong>Prix minimum:</strong> ${minPrice}€</p>`
                    : ""
                }
                ${
                  maxPrice
                    ? `<p><strong>Prix maximum:</strong> ${maxPrice}€</p>`
                    : ""
                }
                ${tableHtml}
            `;
      res.send(
        generateHtmlPage("Produits", content, {
          filteredCount: filteredProducts.length,
        })
      );
    },

    default: () => {
      res.status(406).json({ error: "Format non supporté" });
    },
  });
});

// API Statistiques
app.get("/api/stats", (req, res) => {
  const stats = {
    users: {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      byCity: users.reduce((acc, user) => {
        if (user.city) {
          acc[user.city] = (acc[user.city] || 0) + 1;
        }
        return acc;
      }, {}),
      averageAge:
        users.filter((u) => u.age).reduce((sum, u) => sum + u.age, 0) /
        users.filter((u) => u.age).length,
    },
    products: {
      total: products.length,
      totalValue: products.reduce((sum, p) => sum + p.price, 0),
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      byCategory: products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {}),
      averagePrice:
        products.reduce((sum, p) => sum + p.price, 0) / products.length,
    },
    system: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      node_version: process.version,
    },
  };

  res.format({
    "application/json": () => {
      res.json(stats);
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("statistics", stats);
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const content = `
                <h2>📊 Statistiques Globales</h2>
                
                <h3>👥 Utilisateurs</h3>
                <ul>
                    <li><strong>Total:</strong> ${stats.users.total}</li>
                    <li><strong>Actifs:</strong> ${stats.users.active}</li>
                    <li><strong>Âge moyen:</strong> ${stats.users.averageAge.toFixed(
                      1
                    )} ans</li>
                    <li><strong>Répartition par ville:</strong> ${Object.entries(
                      stats.users.byCity
                    )
                      .map(([city, count]) => `${city}: ${count}`)
                      .join(", ")}</li>
                </ul>
                
                <h3>📦 Produits</h3>
                <ul>
                    <li><strong>Total:</strong> ${stats.products.total}</li>
                    <li><strong>Valeur totale:</strong> ${stats.products.totalValue.toFixed(
                      2
                    )}€</li>
                    <li><strong>Stock total:</strong> ${
                      stats.products.totalStock
                    } unités</li>
                    <li><strong>Prix moyen:</strong> ${stats.products.averagePrice.toFixed(
                      2
                    )}€</li>
                    <li><strong>Répartition par catégorie:</strong> ${Object.entries(
                      stats.products.byCategory
                    )
                      .map(([cat, count]) => `${cat}: ${count}`)
                      .join(", ")}</li>
                </ul>
                
                <h3>⚙️ Système</h3>
                <ul>
                    <li><strong>Version:</strong> ${stats.system.version}</li>
                    <li><strong>Node.js:</strong> ${
                      stats.system.node_version
                    }</li>
                    <li><strong>Uptime:</strong> ${(
                      stats.system.uptime / 60
                    ).toFixed(2)} minutes</li>
                    <li><strong>Dernière MAJ:</strong> ${formatDate(
                      stats.system.timestamp
                    )}</li>
                </ul>
            `;
      res.send(generateHtmlPage("Statistiques", content, stats));
    },

    default: () => {
      res.status(406).json({ error: "Format non supporté" });
    },
  });
});

// API Recherche
app.get("/api/search", (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).format({
      "application/json": () => {
        res.json({ error: 'Paramètre de recherche "q" requis' });
      },
      "application/xml": () => {
        const xmlData = js2xmlparser.parse("error", {
          message: 'Paramètre de recherche "q" requis',
        });
        res.set("Content-Type", "application/xml");
        res.send(xmlData);
      },
      "text/html": () => {
        const content = `
                    <h2>❌ Erreur de recherche</h2>
                    <p>Le paramètre de recherche "q" est requis.</p>
                `;
        res.send(generateHtmlPage("Erreur 400", content));
      },
    });
  }

  const searchTerm = q.toLowerCase();

  const matchingUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      (user.city && user.city.toLowerCase().includes(searchTerm)) ||
      (user.profession && user.profession.toLowerCase().includes(searchTerm))
  );

  const matchingProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
  );

  const response = {
    query: q,
    results: {
      users: matchingUsers,
      products: matchingProducts,
    },
    summary: {
      totalResults: matchingUsers.length + matchingProducts.length,
      usersFound: matchingUsers.length,
      productsFound: matchingProducts.length,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      searchTime: new Date().getTime(),
    },
  };

  res.format({
    "application/json": () => {
      res.json(response);
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("searchResults", response);
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const usersTable = generateHtmlTable(
        matchingUsers,
        "Utilisateurs trouvés"
      );
      const productsTable = generateHtmlTable(
        matchingProducts,
        "Produits trouvés"
      );

      const content = `
                <h2>🔍 Résultats de recherche pour "${q}"</h2>
                <p><strong>Total:</strong> ${response.summary.totalResults} résultats trouvés</p>
                
                <h3>👥 Utilisateurs (${matchingUsers.length})</h3>
                ${usersTable}
                
                <h3>📦 Produits (${matchingProducts.length})</h3>
                ${productsTable}
            `;
      res.send(generateHtmlPage(`Recherche: ${q}`, content, response.summary));
    },

    default: () => {
      res.status(406).json({ error: "Format non supporté" });
    },
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).format({
    "application/json": () => {
      res.json({
        error: "Endpoint non trouvé",
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
      });
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("error", {
        message: "Endpoint non trouvé",
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
      });
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const content = `
                <h2>❌ Page non trouvée (404)</h2>
                <p>L'endpoint <strong>${req.method} ${req.path}</strong> n'existe pas.</p>
                <p>Consultez la <a href="/">page d'accueil</a> pour voir les endpoints disponibles.</p>
            `;
      res.send(generateHtmlPage("Erreur 404", content));
    },

    default: () => {
      res.json({ error: "Endpoint non trouvé" });
    },
  });
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);

  res.status(500).format({
    "application/json": () => {
      res.json({
        error: "Erreur interne du serveur",
        message: err.message,
        timestamp: new Date().toISOString(),
      });
    },

    "application/xml": () => {
      const xmlData = js2xmlparser.parse("error", {
        message: "Erreur interne du serveur",
        details: err.message,
        timestamp: new Date().toISOString(),
      });
      res.set("Content-Type", "application/xml");
      res.send(xmlData);
    },

    "text/html": () => {
      const content = `
                <h2>❌ Erreur serveur (500)</h2>
                <p>Une erreur interne est survenue.</p>
                <p><strong>Détails:</strong> ${err.message}</p>
            `;
      res.send(generateHtmlPage("Erreur 500", content));
    },

    default: () => {
      res.json({ error: "Erreur interne du serveur" });
    },
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(
    `🚀 Serveur EX3 (API Multi-Format) démarré sur http://localhost:${PORT}`
  );
  console.log(`📡 Formats supportés: JSON, XML, HTML`);
  console.log(
    `🔧 Utilisez les headers Accept pour changer le format de réponse`
  );
  console.log(`📚 Documentation disponible sur http://localhost:${PORT}`);
});

module.exports = app;
