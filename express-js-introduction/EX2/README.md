# Express.js Complete Project (EX2)

Un projet ExpressJS complet avec architecture MVC, gestion des fichiers statiques, et API RESTful.

## 🏗️ Architecture du projet

Ce projet suit les meilleures pratiques d'organisation d'une application Express.js :

```
EX2/
├── app.js                    # Point d'entrée de l'application
├── package.json              # Configuration npm et dépendances
├── .env                      # Variables d'environnement
├── config/
│   └── config.js            # Configuration centralisée
├── routes/                   # Définition des routes
│   ├── index.js             # Routes principales
│   ├── users.js             # Routes utilisateurs
│   └── api.js               # Routes API
├── controllers/              # Logique métier (MVC)
│   ├── indexController.js   # Contrôleur pages principales
│   └── userController.js    # Contrôleur utilisateurs
├── middleware/               # Middlewares personnalisés
│   ├── errorHandler.js      # Gestion des erreurs
│   └── logger.js            # Logging personnalisé
├── views/                    # Templates EJS
│   ├── layout.ejs           # Layout principal
│   ├── index.ejs            # Page d'accueil
│   ├── about.ejs            # Page à propos
│   ├── contact.ejs          # Page contact
│   ├── error.ejs            # Page d'erreur
│   └── users/               # Templates utilisateurs
│       ├── list.ejs         # Liste des utilisateurs
│       └── detail.ejs       # Détail utilisateur
└── public/                   # Fichiers statiques
    ├── css/
    │   └── style.css        # Styles personnalisés
    ├── js/
    │   └── main.js          # JavaScript client
    └── images/              # Images statiques
```

## 🚀 Fonctionnalités

### ✨ **Fonctionnalités principales**

- **Architecture MVC** complète et organisée
- **Gestion des fichiers statiques** (CSS, JS, images)
- **Moteur de template EJS** avec layouts
- **API RESTful** avec endpoints JSON
- **Middleware personnalisés** (logging, gestion d'erreurs)
- **Configuration centralisée** avec variables d'environnement
- **Interface responsive** avec Bootstrap 5

### 🛣️ **Routes Web disponibles**

| Route            | Description                        |
| ---------------- | ---------------------------------- |
| `GET /`          | Page d'accueil avec présentation   |
| `GET /about`     | Page à propos du projet            |
| `GET /contact`   | Formulaire de contact              |
| `POST /contact`  | Traitement du formulaire           |
| `GET /users`     | Liste de tous les utilisateurs     |
| `GET /users/:id` | Détail d'un utilisateur spécifique |

### 🔌 **API Endpoints**

| Endpoint         | Méthode | Description                   |
| ---------------- | ------- | ----------------------------- |
| `/api/status`    | GET     | Statut de l'API               |
| `/api/users`     | GET     | Liste des utilisateurs (JSON) |
| `/api/users/:id` | GET     | Détail utilisateur (JSON)     |
| `/api/users`     | POST    | Créer un nouvel utilisateur   |

## 📦 Installation

### Prérequis

- Node.js (version 14+)
- npm

### Installation des dépendances

```bash
cd EX2
npm install
```

## 🏃‍♂️ Utilisation

### Démarrage en mode développement

```bash
npm run dev
```

### Démarrage en mode production

```bash
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## 🛠️ Technologies utilisées

- **Express.js** - Framework web Node.js
- **EJS** - Moteur de template
- **Morgan** - Logger HTTP
- **dotenv** - Gestion des variables d'environnement
- **Bootstrap 5** - Framework CSS
- **Nodemon** - Redémarrage automatique (dev)

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
PORT=3000
NODE_ENV=development
APP_NAME=Express Complete Project
```

### Configuration avancée

Le fichier `config/config.js` permet de configurer :

- Paramètres du serveur
- Configuration des vues
- Paramètres de logging
- Configuration de sécurité
- Base de données (futur)
- Upload de fichiers (futur)
- Configuration email (futur)

## 📝 Exemples d'utilisation

### Tester les routes Web

- **Accueil** : `http://localhost:3000/`
- **Utilisateurs** : `http://localhost:3000/users`
- **Contact** : `http://localhost:3000/contact`

### Tester l'API

```bash
# Statut de l'API
curl http://localhost:3000/api/status

# Liste des utilisateurs
curl http://localhost:3000/api/users

# Détail d'un utilisateur
curl http://localhost:3000/api/users/1

# Créer un utilisateur
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Nouveau User","email":"user@example.com","age":25,"city":"Paris"}'
```

## 🔧 Développement

### Structure des contrôleurs

Les contrôleurs suivent le pattern MVC :

```javascript
const controller = {
  methodName: (req, res) => {
    // Logique métier
    res.render("view", { data });
  },
};
```

### Ajout de nouvelles routes

1. Créer le fichier de route dans `routes/`
2. Créer le contrôleur correspondant dans `controllers/`
3. Créer les vues dans `views/`
4. Importer et utiliser dans `app.js`

### Middleware personnalisés

Les middlewares sont dans le dossier `middleware/` :

- `errorHandler.js` - Gestion centralisée des erreurs
- `logger.js` - Logging personnalisé des requêtes

## 📊 Fonctionnalités avancées

### Gestion d'erreurs

- Page d'erreur personnalisée
- Logging des erreurs
- Différenciation dev/production

### Interface utilisateur

- Design responsive Bootstrap 5
- Animations CSS personnalisées
- Interface interactive avec JavaScript
- Modales pour prévisualisation API

### Logging

- Logger HTTP avec Morgan
- Logger personnalisé pour les interactions
- Mesure du temps de réponse

## 🚀 Déploiement

### Variables d'environnement production

```env
NODE_ENV=production
PORT=80
APP_NAME=Mon App Express
```

### Optimisations production

- Cache des vues activé
- Logs en format combiné
- Gestion d'erreurs simplifiée

## 📚 Exercices suggérés

1. **Ajouter une base de données** (MongoDB, PostgreSQL)
2. **Implémenter l'authentification** (sessions, JWT)
3. **Ajouter des tests** (Jest, Mocha)
4. **Implémenter le cache** (Redis)
5. **Ajouter la validation** (Joi, express-validator)

## 🤝 Contribution

1. Fork du projet
2. Créer une branche feature
3. Commit des modifications
4. Push vers la branche
5. Créer une Pull Request

## 📄 Licence

ISC License - Voir package.json

---

**Projet réalisé dans le cadre du TP Express.js** 🎓
