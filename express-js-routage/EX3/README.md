# EX3 - Application E-commerce avec Routeurs Modulaires

## 📋 Description

Cette application démontre l'utilisation avancée des routeurs modulaires Express.js dans le contexte d'une API e-commerce complète. Elle illustre l'organisation du code, l'authentification JWT, le contrôle d'accès basé sur les rôles, et les meilleures pratiques de sécurité.

## 🚀 Fonctionnalités

### Architecture Modulaire

- **Routeurs séparés** par domaine fonctionnel
- **Middlewares personnalisés** pour l'authentification et la gestion d'erreurs
- **Structure organisée** en couches (routes, middleware, data, utils)

### Authentification & Sécurité

- **JWT (JSON Web Tokens)** pour l'authentification
- **Bcrypt** pour le hachage des mots de passe
- **Contrôle d'accès basé sur les rôles** (Customer/Admin)
- **Rate limiting** pour prévenir les abus
- **Middlewares de sécurité** (Helmet, CORS)

### API E-commerce Complète

- **Gestion des utilisateurs** (inscription, connexion, profil)
- **Catalogue de produits** avec catégories
- **Système de commandes** avec gestion du stock
- **Panel d'administration** pour la gestion
- **Statistiques** et monitoring

## 📁 Structure du Projet

```
EX3/
├── app.js                 # Point d'entrée principal
├── package.json           # Dépendances et scripts
├── test-api.js           # Tests complets de l'API
├── README.md             # Documentation
│
├── routes/               # Routeurs modulaires
│   ├── auth.js          # Authentification (register/login)
│   ├── users.js         # Gestion des utilisateurs
│   ├── products.js      # Catalogue de produits
│   ├── orders.js        # Système de commandes
│   ├── categories.js    # Catégories de produits
│   └── admin.js         # Panel d'administration
│
├── middleware/          # Middlewares personnalisés
│   ├── auth.js         # Authentification JWT & rôles
│   └── errorHandler.js # Gestion centralisée des erreurs
│
├── data/               # Données de test
│   └── sampleData.js   # Données échantillon
│
├── controllers/        # Contrôleurs (structure future)
└── utils/             # Utilitaires (structure future)
```

## 🛠️ Installation et Démarrage

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (gestionnaire de paquets)

### Installation

```bash
# Cloner ou naviguer vers le dossier EX3
cd EX3

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Ou démarrer en mode production
npm start
```

Le serveur démarrera sur le port **3002**.

## 📚 Documentation de l'API

### Base URL

```
http://localhost:3002
```

### Routes Publiques

#### Authentification

- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion utilisateur

#### Produits et Catégories

- `GET /products` - Liste tous les produits (avec pagination)
- `GET /products/:id` - Détails d'un produit
- `GET /products/category/:categoryId` - Produits par catégorie
- `GET /categories` - Liste toutes les catégories
- `GET /categories/:id` - Détails d'une catégorie

#### Utilitaires

- `GET /` - Documentation de l'API
- `GET /health` - Statut de santé du serveur

### Routes Protégées (Authentification requise)

#### Gestion des Utilisateurs

- `GET /users/:id` - Profil utilisateur (propriétaire uniquement)
- `PUT /users/:id` - Mise à jour du profil (propriétaire uniquement)

#### Commandes

- `GET /orders` - Liste des commandes de l'utilisateur
- `POST /orders` - Créer une nouvelle commande
- `GET /orders/:id` - Détails d'une commande (propriétaire uniquement)
- `PUT /orders/:id/status` - Mettre à jour le statut (propriétaire uniquement)

### Routes Administrateur (Rôle admin requis)

#### Gestion des Produits

- `POST /admin/products` - Créer un nouveau produit
- `PUT /admin/products/:id` - Modifier un produit
- `DELETE /admin/products/:id` - Supprimer un produit

#### Gestion des Utilisateurs

- `GET /admin/users` - Liste tous les utilisateurs
- `PUT /admin/users/:id/role` - Modifier le rôle d'un utilisateur

#### Gestion des Commandes

- `GET /admin/orders` - Liste toutes les commandes
- `PUT /admin/orders/:id/status` - Mettre à jour le statut d'une commande

#### Statistiques

- `GET /admin/stats` - Statistiques de l'application

## 🔐 Authentification

### Format des Tokens

Les tokens JWT doivent être envoyés dans l'en-tête Authorization :

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Exemple de Payload JWT

```json
{
  "userId": "uuid-here",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## 📝 Exemples d'Utilisation

### 1. Inscription d'un utilisateur

```bash
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "Jean",
    "lastName": "Dupont"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Récupérer les produits

```bash
curl -X GET http://localhost:3002/products
```

### 4. Créer une commande (authentifié)

```bash
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "products": [
      {
        "productId": "product-uuid",
        "quantity": 2
      }
    ]
  }'
```

### 5. Créer un produit (admin)

```bash
curl -X POST http://localhost:3002/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Nouveau Produit",
    "description": "Description du produit",
    "price": 29.99,
    "categoryId": "category-uuid",
    "stock": 100
  }'
```

## 🧪 Tests

### Exécuter les tests automatisés

```bash
# S'assurer que le serveur est démarré
npm run dev

# Dans un autre terminal, exécuter les tests
node test-api.js
```

### Tests inclus

- ✅ Routes publiques (documentation, santé)
- ✅ Authentification (inscription, connexion)
- ✅ Gestion des utilisateurs (profil, mise à jour)
- ✅ Catalogue de produits (liste, détails, catégories)
- ✅ Système de commandes (création, consultation)
- ✅ Panel d'administration (CRUD produits, stats)
- ✅ Contrôle d'accès (vérification des rôles)
- ✅ Gestion d'erreurs (routes inexistantes, accès refusé)

## 🔒 Sécurité

### Middlewares de Sécurité

- **Helmet** : Protection contre les vulnérabilités communes
- **CORS** : Contrôle des accès cross-origin
- **Rate Limiting** : 100 requêtes par IP toutes les 15 minutes
- **Validation** : Validation des données d'entrée
- **JWT** : Tokens sécurisés avec expiration

### Bonnes Pratiques Implémentées

- Hachage des mots de passe avec bcrypt
- Validation des rôles sur les routes sensibles
- Gestion centralisée des erreurs
- Logging des requêtes avec Morgan
- Limitation de la taille des requêtes JSON (10MB)

## 📊 Monitoring

### Logs

Les logs incluent :

- Timestamp de chaque requête
- Méthode HTTP et URL
- Adresse IP du client
- Temps de réponse et statut

### Métriques Disponibles

- Nombre d'utilisateurs actifs
- Nombre de produits en stock
- Nombre de commandes
- Statistiques de ventes (via `/admin/stats`)

## 🚨 Gestion d'Erreurs

### Codes d'Erreur Standard

- `400` : Requête malformée
- `401` : Non authentifié
- `403` : Accès interdit (rôle insuffisant)
- `404` : Ressource non trouvée
- `409` : Conflit (ex: email déjà utilisé)
- `422` : Données de validation invalides
- `500` : Erreur serveur interne

### Format des Réponses d'Erreur

```json
{
  "success": false,
  "error": "Message d'erreur descriptif",
  "details": "Détails supplémentaires si disponibles"
}
```

## 🔧 Configuration

### Variables d'Environnement

```env
PORT=3002                    # Port du serveur
JWT_SECRET=your-secret-key   # Clé secrète JWT
NODE_ENV=development         # Environnement
```

### Personnalisation

- Modifier les limites de rate limiting dans `app.js`
- Ajuster la durée d'expiration des tokens JWT dans `middleware/auth.js`
- Configurer les données échantillon dans `data/sampleData.js`

## 📈 Évolutions Possibles

### Fonctionnalités Additionnelles

- Base de données réelle (MongoDB, PostgreSQL)
- Upload d'images pour les produits
- Système de panier persistant
- Notifications en temps réel
- Intégration de paiement
- API de recherche avancée
- Cache Redis pour les performances

### Architecture

- Séparation en microservices
- Conteneurisation avec Docker
- Tests unitaires et d'intégration
- Documentation Swagger/OpenAPI
- Monitoring avancé avec Prometheus

## 🤝 Contribution

Ce projet est un exercice éducatif démontrant les concepts avancés d'Express.js. Les améliorations et suggestions sont les bienvenues !

## 📄 Licence

Projet éducatif - Libre d'utilisation pour l'apprentissage.

---

**Auteur** : Exercice Express.js - Routeurs Modulaires  
**Date** : Juin 2025  
**Version** : 1.0.0
