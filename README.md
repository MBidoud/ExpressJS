# Formation Express.js - Projets Pratiques

Cette collection regroupe une série complète d'exercices pratiques Express.js, organisés par thématiques progressives pour maîtriser le développement d'applications web modernes avec Node.js et Express.

## 📚 Table des Matières

- [I - Introduction à Express.js](#i---introduction-à-expressjs)
- [II - Routage avec Express.js](#ii---routage-avec-expressjs)
- [III - Middlewares Express.js](#iii---middlewares-expressjs)
- [IV - Gestion Request-Response](#iv---gestion-request-response)

---

# I - Introduction à Express.js

## Exercice 1 - Serveur Express.js Basique

**📁 Dossier :** `express-js-introduction/EX1/`  
**🚀 Port :** 3000  
**🎯 Objectif :** Découvrir les bases d'Express.js avec un serveur simple

### Fonctionnalités

- Route racine (`/`) affichant "Hello World"
- Route date (`/date`) affichant la date et l'heure actuelles
- Configuration Express.js minimale
- Gestion basique des routes GET

### Technologies utilisées

- Node.js
- Express.js 4.18+

### Commandes

```bash
cd express-js-introduction/EX1
npm install
npm start
```

---

## Exercice 2 - Application Express.js Complète avec Architecture MVC

**📁 Dossier :** `express-js-introduction/EX2/`  
**🚀 Port :** 3001  
**🎯 Objectif :** Comprendre l'architecture MVC et l'organisation d'un projet Express.js professionnel

### Fonctionnalités

- **Architecture MVC** complète avec séparation des responsabilités
- **Templates EJS** avec système de layout
- **Fichiers statiques** (CSS, JS, images)
- **API RESTful** pour la gestion des utilisateurs
- **Middlewares personnalisés** (logging, gestion d'erreurs)
- **Configuration centralisée** avec variables d'environnement
- **Pages web complètes** : accueil, à propos, contact, utilisateurs

### Structure du projet

```
├── config/           # Configuration centralisée
├── controllers/      # Logique métier (MVC)
├── middleware/       # Middlewares personnalisés
├── routes/          # Définition des routes
├── views/           # Templates EJS
├── public/          # Fichiers statiques (CSS, JS, images)
└── app.js           # Point d'entrée
```

### Technologies utilisées

- Express.js avec architecture MVC
- EJS (Embedded JavaScript templates)
- Fichiers statiques
- Middleware personnalisés
- Configuration dotenv

### Commandes

```bash
cd express-js-introduction/EX2
npm install
npm start
```

---

# II - Routage avec Express.js

## Exercice 1 - API REST Basique pour Gestion de Tâches

**📁 Dossier :** `express-js-routage/EX1/`  
**🚀 Port :** 3000  
**🎯 Objectif :** Maîtriser les bases du routage Express.js avec les opérations CRUD

### Fonctionnalités

- **CRUD complet** pour la gestion de tâches
- **Routes REST** : GET, POST, PUT, DELETE
- **Validation des données** côté serveur
- **Gestion des erreurs HTTP** (404, 400, 500)
- **Génération d'UUID** pour les identifiants uniques
- **Réponses JSON structurées**

### Endpoints disponibles

- `GET /tasks` - Récupérer toutes les tâches
- `GET /tasks/:id` - Récupérer une tâche spécifique
- `POST /tasks` - Créer une nouvelle tâche
- `PUT /tasks/:id` - Mettre à jour une tâche
- `DELETE /tasks/:id` - Supprimer une tâche

### Technologies utilisées

- Express.js Router
- UUID pour les identifiants
- Validation des données
- Gestion d'erreurs HTTP

### Commandes

```bash
cd express-js-routage/EX1
npm install
npm start
npm run test  # Tests d'API
```

---

## Exercice 2 - Routes Paramétrées - API Blog

**📁 Dossier :** `express-js-routage/EX2/`  
**🚀 Port :** 3001  
**🎯 Objectif :** Apprendre les routes paramétrées et la gestion des données relationnelles

### Fonctionnalités

- **Routes paramétrées** avec validation
- **Gestion des catégories** et articles de blog
- **Relations entre données** (articles ↔ catégories)
- **Filtrage et recherche** avancés
- **Pagination des résultats**
- **Validation des paramètres** d'URL

### Endpoints disponibles

- `GET /posts` - Liste des articles avec filtres
- `GET /posts/:id` - Article spécifique
- `GET /posts/category/:category` - Articles par catégorie
- `GET /categories` - Liste des catégories
- `GET /categories/:id/posts` - Articles d'une catégorie

### Technologies utilisées

- Express.js Router avancé
- Routes paramétrées
- Middleware de validation
- Données JSON simulées

### Commandes

```bash
cd express-js-routage/EX2
npm install
npm start
npm run test  # Tests des routes
```

---

## Exercice 3 - Routeurs Modulaires - API E-commerce

**📁 Dossier :** `express-js-routage/EX3/`  
**🚀 Port :** 3002  
**🎯 Objectif :** Maîtriser les routeurs modulaires et l'authentification

### Fonctionnalités

- **Architecture modulaire** avec routeurs séparés
- **Authentification JWT** et autorisation
- **Contrôle d'accès basé sur les rôles** (admin, user)
- **API E-commerce complète** (produits, commandes, utilisateurs)
- **Middleware d'authentification** personnalisé
- **Gestion d'erreurs centralisée**

### Modules disponibles

- **Authentification** : login, register, profile
- **Produits** : CRUD avec permissions admin
- **Commandes** : gestion des achats utilisateur
- **Administration** : statistiques et gestion

### Technologies utilisées

- Express.js Router modulaire
- JSON Web Tokens (JWT)
- Middleware d'authentification
- Contrôleur d'architecture
- Gestion des rôles utilisateur

### Commandes

```bash
cd express-js-routage/EX3
npm install
npm start
npm run test  # Tests API avec authentification
```

---

# III - Middlewares Express.js

## Exercice 1 - Middleware de Logging Personnalisé

**📁 Dossier :** `express-js-middlewares/EX1/`  
**🚀 Port :** 4000  
**🎯 Objectif :** Créer et utiliser des middlewares personnalisés pour le logging

### Fonctionnalités

- **Middleware de logging** personnalisé avec rotation automatique
- **Analyse statistique** des requêtes (méthodes, codes de statut)
- **Logs par fichier** avec horodatage
- **Métriques de performance** (temps de réponse)
- **Gestion des erreurs** avec logging détaillé

### Fonctionnalités de logging

- Logs d'accès quotidiens automatiques
- Logs d'erreurs séparés
- Statistiques de trafic en temps réel
- Analyse des performances par endpoint

### Technologies utilisées

- Middleware Express.js personnalisé
- Système de fichiers Node.js
- Rotation automatique des logs
- Formatage des données de log

### Commandes

```bash
cd express-js-middlewares/EX1
npm install
npm start
node test-logging.js  # Test du système de logging
```

---

## Exercice 2 - Middleware d'Authentification

**📁 Dossier :** `express-js-middlewares/EX2/`  
**🚀 Port :** 4001  
**🎯 Objectif :** Implémenter un système d'authentification complet avec JWT

### Fonctionnalités

- **Authentification JWT** complète
- **Autorisation basée sur les rôles** (admin, user, guest)
- **Gestion des tokens révoqués** (blacklist)
- **Middleware de protection** des routes
- **Logging des tentatives** d'authentification

### Fonctionnalités d'authentification

- Génération et validation de tokens JWT
- Système de rôles hiérarchique
- Protection automatique des routes sensibles
- Gestion des sessions et déconnexion sécurisée

### Technologies utilisées

- JSON Web Tokens (JWT)
- Middleware d'authentification personnalisé
- Système de rôles et permissions
- Gestion sécurisée des tokens

### Commandes

```bash
cd express-js-middlewares/EX2
npm install
npm start
node test-auth.js  # Test du système d'authentification
```

---

## Exercice 3 - Intégration de Middlewares Tiers

**📁 Dossier :** `express-js-middlewares/EX3/`  
**🚀 Port :** 4002  
**🎯 Objectif :** Intégrer et configurer des middlewares populaires de l'écosystème Express

### Fonctionnalités

- **Helmet.js** pour la sécurité HTTP
- **Rate limiting** contre les abus et attaques
- **Compression** automatique des réponses
- **CORS** configuré pour les API
- **Body parsing** avancé avec validation

### Middlewares intégrés

- **Sécurité** : Helmet, CORS, validation d'entrée
- **Performance** : Compression, cache headers
- **Limitation** : Rate limiting par IP et endpoint
- **Monitoring** : Logging combiné avec métriques

### Technologies utilisées

- Helmet.js (sécurité)
- Express-rate-limit
- Compression middleware
- CORS configuration
- Morgan logging

### Commandes

```bash
cd express-js-middlewares/EX3
npm install
npm start
node test-middlewares.js  # Test des middlewares intégrés
```

---

# IV - Gestion Request-Response

## Exercice 1 - Soumission de Formulaires et Validation

**📁 Dossier :** `express-js-request-response/EX1/`  
**🚀 Port :** 5000  
**🎯 Objectif :** Maîtriser la gestion des formulaires et la validation côté serveur

### Fonctionnalités

- **Gestion de formulaires** POST avec validation complète
- **Validation côté serveur** avec express-validator
- **Interface utilisateur moderne** avec feedback en temps réel
- **Sécurité renforcée** : hachage de mots de passe, rate limiting
- **Gestion des erreurs** avec messages utilisateur

### Fonctionnalités clés

- Formulaire d'inscription utilisateur complet
- Validation en temps réel des champs
- Hachage sécurisé des mots de passe (bcryptjs)
- Protection contre les attaques par force brute
- Interface responsive et accessible

### Technologies utilisées

- Express.js avec body parsing
- Express-validator pour la validation
- Bcryptjs pour le hachage
- Helmet.js pour la sécurité
- Express-rate-limit

### Commandes

```bash
cd express-js-request-response/EX1
npm install
npm start
npm test  # Tests de validation et sécurité
```

---

## Exercice 2 - Système de Téléchargement de Fichiers

**📁 Dossier :** `express-js-request-response/EX2/`  
**🚀 Port :** 5001  
**🎯 Objectif :** Implémenter un système complet de gestion de fichiers et d'images

### Fonctionnalités

- **Upload de fichiers** avec interface glisser-déposer
- **Traitement d'images** automatique (redimensionnement, miniatures)
- **Galerie interactive** avec recherche et filtres
- **Validation de fichiers** (type, taille, sécurité)
- **Gestion des métadonnées** et aperçus

### Fonctionnalités avancées

- Génération automatique de miniatures (Sharp)
- Interface de galerie moderne et responsive
- Validation sécurisée des types de fichiers
- Limitation de taille et protection contre les malwares
- Système de prévisualisation et téléchargement

### Technologies utilisées

- Multer pour l'upload de fichiers
- Sharp pour le traitement d'images
- Validation de types MIME
- Interface moderne HTML/CSS/JS
- Sécurité des fichiers uploadés

### Commandes

```bash
cd express-js-request-response/EX2
npm install
npm start
npm test  # Tests de gestion de fichiers
```

---

## Exercice 3 - API Multi-format avec Négociation de Contenu

**📁 Dossier :** `express-js-request-response/EX3/`  
**🚀 Port :** 5002  
**🎯 Objectif :** Maîtriser la négociation de contenu et les API multi-format

### Fonctionnalités

- **Négociation de contenu** automatique avec `res.format()`
- **Réponses multi-format** : JSON, XML, HTML
- **API RESTful complète** avec CRUD pour utilisateurs et produits
- **Interface web responsive** générée automatiquement
- **Fonctionnalités avancées** : pagination, recherche, statistiques

### Formats supportés

- **JSON** : Format par défaut pour les API clients
- **XML** : Sortie structurée avec js2xmlparser
- **HTML** : Interface web complète et responsive

### Fonctionnalités API

- Gestion complète des utilisateurs et produits
- Recherche globale inter-collections
- Pagination configurable
- Filtrage et tri avancés
- Statistiques et analytics

### Technologies utilisées

- Express.js res.format()
- js2xmlparser pour XML
- Interface HTML générative
- CORS et sécurité API
- Tests complets (Jest)

### Commandes

```bash
cd express-js-request-response/EX3
npm install
npm start
npm test  # Tests de négociation de contenu
```

---

## 🛠️ Installation Globale

### Prérequis

- **Node.js** 14+
- **npm** 6+
- **Git** (optionnel)

### Installation rapide de tous les projets

```bash
# Navigation vers le dossier principal
cd NodeJS

# Installation automatique pour tous les projets
for dir in express-js-*/; do
  echo "Installation de $dir..."
  cd "$dir"
  for subdir in EX*/; do
    if [ -d "$subdir" ]; then
      cd "$subdir"
      npm install
      cd ..
    fi
  done
  cd ..
done
```

### Démarrage des serveurs

Chaque exercice fonctionne sur un port différent, permettant l'exécution simultanée :

- **Introduction** : ports 3000-3001
- **Routage** : ports 3000-3002
- **Middlewares** : ports 4000-4002
- **Request-Response** : ports 5000-5002

---

## 📊 Progression Recommandée

### Niveau Débutant

1. **Introduction EX1** - Bases Express.js
2. **Introduction EX2** - Architecture MVC
3. **Routage EX1** - CRUD basique

### Niveau Intermédiaire

4. **Routage EX2** - Routes paramétrées
5. **Middlewares EX1** - Logging personnalisé
6. **Request-Response EX1** - Formulaires

### Niveau Avancé

7. **Routage EX3** - Authentification JWT
8. **Middlewares EX2-EX3** - Sécurité avancée
9. **Request-Response EX2-EX3** - Upload et API multi-format

---

## 🎯 Objectifs Pédagogiques

### Compétences acquises

- ✅ **Fondamentaux Express.js** : serveurs, routes, middlewares
- ✅ **Architecture MVC** : organisation professionnelle du code
- ✅ **API RESTful** : conception et implémentation complète
- ✅ **Sécurité web** : authentification, validation, protection
- ✅ **Gestion de fichiers** : upload, traitement, validation
- ✅ **Tests et qualité** : TDD, couverture de code
- ✅ **Bonnes pratiques** : organisation, documentation, déploiement

### Technologies maîtrisées

- Express.js (framework web)
- Node.js (runtime JavaScript)
- JSON Web Tokens (JWT)
- Validation et sécurité
- Traitement de fichiers
- Tests automatisés
- Architecture moderne

---

## 📝 Support et Documentation

### Documentation

- Chaque exercice contient un README détaillé
- Tests unitaires et d'intégration inclus
- Exemples d'utilisation et cas d'usage
- Configuration et déploiement

### Support

- Commentaires détaillés dans le code
- Gestion d'erreurs complète
- Logging pour le debugging
- Tests pour validation

---

**🏆 Projet complet** : 12 exercices Express.js couvrant tous les aspects du développement web moderne avec Node.js

**📈 Progression** : Du serveur basique aux API complexes avec authentification et sécurité

**✨ Production-ready** : Code professionnel avec tests, documentation et bonnes pratiques
