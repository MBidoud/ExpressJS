# Express.js - Exercices de Routage Avancé

## 📋 Vue d'ensemble

Ce projet contient trois exercices progressifs démontrant les concepts avancés de routage avec Express.js, de l'API REST basique aux architectures modulaires complexes avec authentification et contrôle d'accès.

## 🏗️ Structure du Projet

```
express-js-routage/
├── EX1/                    # API REST basique - Gestion de tâches
├── EX2/                    # Routes paramétrées - API Blog
├── EX3/                    # Routeurs modulaires - API E-commerce
├── .vscode/
│   └── tasks.json         # Tâches VS Code pour tous les exercices
└── README.md              # Ce fichier
```

## 🚀 Exercices

### EX1 - API REST Basique (Port 3000)

**Objectif :** Maîtriser les bases du routage Express.js avec les opérations CRUD

**Fonctionnalités :**

- ✅ Routes CRUD complètes (GET, POST, PUT, DELETE)
- ✅ Gestion des erreurs HTTP
- ✅ Validation des données
- ✅ Génération d'UUID pour les identifiants
- ✅ Réponses JSON structurées

**Endpoints :**

- `GET /tasks` - Liste toutes les tâches
- `GET /tasks/:id` - Détails d'une tâche
- `POST /tasks` - Créer une nouvelle tâche
- `PUT /tasks/:id` - Modifier une tâche existante
- `DELETE /tasks/:id` - Supprimer une tâche

**Technologies :** Express.js, UUID, Nodemon

---

### EX2 - Routes Paramétrées (Port 3001)

**Objectif :** Exploiter les paramètres de route, les paramètres optionnels et le filtrage

**Fonctionnalités :**

- ✅ Paramètres de route dynamiques (`:year`, `:month?`)
- ✅ Paramètres optionnels avec `?`
- ✅ Filtrage par catégorie
- ✅ Validation des paramètres
- ✅ Gestion d'erreurs avancée

**Endpoints :**

- `GET /posts` - Tous les articles
- `GET /posts/:year` - Articles par année
- `GET /posts/:year/:month?` - Articles par année/mois (mois optionnel)
- `GET /categories` - Toutes les catégories
- `GET /categories/:categoryName/posts` - Articles par catégorie

**Technologies :** Express.js, Paramètres dynamiques, Filtrage

---

### EX3 - Routeurs Modulaires (Port 3002)

**Objectif :** Architecture modulaire complète avec authentification et contrôle d'accès

**Fonctionnalités :**

- ✅ **Architecture modulaire** avec routeurs séparés
- ✅ **Authentification JWT** sécurisée
- ✅ **Contrôle d'accès basé sur les rôles** (Customer/Admin)
- ✅ **Middleware personnalisés** pour l'auth et la gestion d'erreurs
- ✅ **API E-commerce complète** (users, products, orders, categories)
- ✅ **Panel d'administration** avec statistiques
- ✅ **Sécurité renforcée** (Helmet, CORS, Rate Limiting)

**Modules :**

- **auth.js** - Inscription, connexion, profils
- **users.js** - Gestion des utilisateurs (protégé)
- **products.js** - Catalogue avec pagination et filtres
- **orders.js** - Système de commandes (protégé)
- **categories.js** - Gestion des catégories
- **admin.js** - Panel administrateur (rôle admin requis)

**Technologies :** Express.js, JWT, Bcrypt, UUID, Helmet, CORS, Morgan

## 🛠️ Installation et Lancement

### Prérequis

- Node.js (version 14+)
- npm ou yarn
- VS Code (recommandé)

### Installation Globale

```bash
# Installer toutes les dépendances en une fois
cd express-js-routage
npm run install-all  # Via la tâche VS Code

# Ou manuellement pour chaque exercice
cd EX1 && npm install
cd ../EX2 && npm install
cd ../EX3 && npm install
```

### Lancement des Serveurs

#### Méthode 1 : Via VS Code Tasks (Recommandée)

1. Ouvrir VS Code dans le dossier `express-js-routage`
2. Utiliser `Ctrl+Shift+P` → "Tasks: Run Task"
3. Choisir :
   - "Start EX1 - Task Management API"
   - "Start EX2 - Blog API"
   - "Start EX3 - E-commerce API"

#### Méthode 2 : Terminal Manuel

```bash
# EX1 - API Tâches
cd EX1 && npm start

# EX2 - API Blog
cd EX2 && npm start

# EX3 - API E-commerce (mode dev avec nodemon)
cd EX3 && npm run dev
```

### Exécution des Tests

#### Via VS Code Tasks

- "Test EX1 API"
- "Test EX2 API"
- "Test EX3 API"

#### Via Terminal

```bash
# Tests EX1
cd EX1 && node test-api.js

# Tests EX2
cd EX2 && node test-routes.js

# Tests EX3 (s'assurer que le serveur EX3 est démarré)
cd EX3 && node test-api.js
```

## 📚 Documentation Détaillée

Chaque exercice contient sa propre documentation complète :

- **[EX1/README.md](./EX1/README.md)** - Guide complet de l'API REST basique
- **[EX2/README.md](./EX2/README.md)** - Documentation des routes paramétrées
- **[EX3/README.md](./EX3/README.md)** - Architecture modulaire et authentification

## 🧪 Tests Automatisés

### EX1 Tests

- ✅ CRUD complet sur les tâches
- ✅ Validation des données
- ✅ Gestion d'erreurs HTTP

### EX2 Tests

- ✅ Routes paramétrées avec années/mois
- ✅ Paramètres optionnels
- ✅ Filtrage par catégorie
- ✅ Validation des paramètres

### EX3 Tests (16 tests complets)

- ✅ Documentation et santé API
- ✅ Authentification (inscription/connexion)
- ✅ Gestion utilisateurs (profil, mise à jour)
- ✅ Catalogue produits (liste, détails, catégories)
- ✅ Système commandes (création, consultation)
- ✅ Panel administration (CRUD, statistiques)
- ✅ Contrôle d'accès (vérification rôles)
- ✅ Gestion erreurs (routes inexistantes, accès refusé)

## 🔧 Développement

### Structure Modulaire

```
EX3/                          # Exemple d'architecture modulaire
├── app.js                    # Point d'entrée avec middleware globaux
├── routes/                   # Routeurs modulaires par domaine
│   ├── auth.js              # Authentification
│   ├── users.js             # Gestion utilisateurs
│   ├── products.js          # Catalogue produits
│   ├── orders.js            # Système commandes
│   ├── categories.js        # Gestion catégories
│   └── admin.js             # Panel administration
├── middleware/              # Middlewares personnalisés
│   ├── auth.js             # JWT, rôles, ownership
│   └── errorHandler.js     # Gestion centralisée erreurs
└── data/                   # Données de test
    └── sampleData.js       # Échantillons users/products/orders
```

### Middleware d'Authentification

```javascript
// Exemple d'utilisation des middlewares EX3
app.use("/users", auth.authenticate, userRoutes); // Protégé
app.use("/orders", auth.authenticate, orderRoutes); // Protégé
app.use("/admin", auth.authenticate, auth.requireAdmin, adminRoutes); // Admin seulement
```

### Ports par Défaut

- **EX1** : http://localhost:3000
- **EX2** : http://localhost:3001
- **EX3** : http://localhost:3002

## 📊 Progression Pédagogique

| Exercice | Niveau        | Concepts Clés                     | Complexité |
| -------- | ------------- | --------------------------------- | ---------- |
| EX1      | Débutant      | Routes de base, CRUD, HTTP        | ⭐⭐       |
| EX2      | Intermédiaire | Paramètres, filtrage, validation  | ⭐⭐⭐     |
| EX3      | Avancé        | Modularité, auth, sécurité, rôles | ⭐⭐⭐⭐⭐ |

## 🔐 Sécurité (EX3)

### Fonctionnalités Sécurisées

- **JWT** avec expiration (24h)
- **Bcrypt** pour hachage mots de passe
- **Helmet** contre vulnérabilités communes
- **CORS** configuré
- **Rate Limiting** (100 req/15min/IP)
- **Validation** données entrée
- **Contrôle accès** basé rôles

### Exemple de Requête Authentifiée

```bash
curl -X GET http://localhost:3002/users/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚨 Résolution de Problèmes

### Erreurs Communes

**"Port already in use"**

```bash
# Trouver le processus utilisant le port
netstat -ano | findstr :3000
# Terminer le processus
taskkill /PID <PID> /F
```

**"Module not found"**

```bash
# Réinstaller les dépendances
cd [EX1|EX2|EX3]
rm -rf node_modules package-lock.json
npm install
```

**Tests échouent - "ECONNREFUSED"**

```bash
# S'assurer que le serveur correspondant est démarré
# EX3 doit être en cours d'exécution pour tester EX3
cd EX3 && npm run dev
# Puis dans un autre terminal :
cd EX3 && node test-api.js
```

## 📈 Évolutions Possibles

### Améliorations Techniques

- Base de données réelle (MongoDB/PostgreSQL)
- Tests unitaires avec Jest
- Documentation OpenAPI/Swagger
- Conteneurisation Docker
- CI/CD GitHub Actions
- Monitoring Prometheus

### Fonctionnalités Additionnelles

- Upload fichiers/images
- Cache Redis
- WebSocket temps réel
- Intégration paiement
- Système notifications
- API recherche Elasticsearch

## 🤝 Contribution

Ces exercices sont conçus pour l'apprentissage progressif d'Express.js. Les améliorations et suggestions sont les bienvenues !

## 📄 Licence

Projet éducatif - Libre d'utilisation pour l'apprentissage.

---

**Auteur :** Express.js Routing Exercises  
**Date :** Juin 2025  
**Technologies :** Node.js, Express.js, JWT, Bcrypt  
**Version :** 1.0.0
