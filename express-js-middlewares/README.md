# Express.js Middlewares - Exercices Pratiques

Ce projet contient trois exercices progressifs pour apprendre et maîtriser les middlewares Express.js.

## 📋 Vue d'ensemble

### EX1 - Custom Logging Middleware

**Port: 4000**

- Middleware de logging personnalisé
- Rotation automatique des logs
- Analyse statistique des requêtes
- Gestion des erreurs et métriques

### EX2 - Authentication Middleware

**Port: 4001**

- Authentification JWT
- Autorisation basée sur les rôles
- Gestion des tokens révoqués
- Logging des tentatives d'authentification

### EX3 - Third-party Middlewares Integration

**Port: 4002**

- Intégration de middlewares populaires
- Configuration de sécurité (Helmet)
- Rate limiting et compression
- Validation et sessions

## 🚀 Installation et Démarrage

### Installation globale des dépendances

```bash
# Aller dans chaque dossier et installer les dépendances
cd EX1 && npm install
cd ../EX2 && npm install
cd ../EX3 && npm install
```

### Démarrage des serveurs

#### EX1 - Custom Logging

```bash
cd EX1
npm run dev    # Mode développement avec nodemon
# ou
npm start      # Mode production
```

#### EX2 - Authentication

```bash
cd EX2
npm run dev    # Mode développement avec nodemon
# ou
npm start      # Mode production
```

#### EX3 - Third-party Middlewares

```bash
cd EX3
npm run dev    # Mode développement avec nodemon
# ou
npm start      # Mode production
```

## 🧪 Tests

Chaque exercice inclut une suite de tests automatisés :

```bash
# Tester EX1 (serveur doit être en cours sur port 4000)
cd EX1 && npm test

# Tester EX2 (serveur doit être en cours sur port 4001)
cd EX2 && npm test

# Tester EX3 (serveur doit être en cours sur port 4002)
cd EX3 && npm test
```

## 📖 Détails des Exercices

### EX1 - Custom Logging Middleware

**Objectifs pédagogiques :**

- Comprendre la structure d'un middleware Express.js
- Implémenter un système de logging personnalisé
- Gérer la rotation des fichiers de logs
- Créer des outils d'analyse de logs

**Fonctionnalités :**

- 🔧 **5 formats de logs** : combined, common, short, tiny, dev
- 📁 **Rotation automatique** : par date et taille (10MB max)
- 📊 **Analyse statistique** : temps de réponse, codes de statut
- 🔍 **Extraction d'IP** : support proxy et load balancer
- ⚡ **Performance** : temps de réponse calculé avec précision

**Endpoints de test :**

- `GET /` - Page d'accueil
- `GET /users` - Liste d'utilisateurs (simulation)
- `POST /users` - Création d'utilisateur
- `GET /products/:id` - Détail produit
- `GET /error` - Génération d'erreur 500
- `GET /slow` - Réponse lente (test performance)
- `GET /logs/analysis` - Analyse des logs
- `GET /logs/raw` - Logs bruts

### EX2 - Authentication Middleware

**Objectifs pédagogiques :**

- Implémenter un système d'authentification JWT
- Comprendre les middlewares d'autorisation
- Gérer les tokens et leur révocation
- Sécuriser les routes sensibles

**Fonctionnalités :**

- 🔑 **JWT Authentication** : génération et validation de tokens
- 👥 **Autorisation par rôles** : admin, user, guest
- 🚫 **Révocation de tokens** : logout sécurisé
- 📝 **Logging d'authentification** : tentatives de connexion
- 🛡️ **Protection avancée** : middleware optionnel, gestion d'erreurs

**Credentials de test :**

- `admin/admin123` (rôle: admin)
- `user/user123` (rôle: user)
- `guest/guest123` (rôle: guest)

**Endpoints principaux :**

- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `GET /auth/verify` - Vérification token
- `GET /protected` - Route protégée basique
- `GET /admin/users` - Route admin uniquement
- `GET /user/data` - Route admin/user

### EX3 - Third-party Middlewares Integration

**Objectifs pédagogiques :**

- Intégrer et configurer des middlewares populaires
- Comprendre l'ordre d'exécution des middlewares
- Optimiser les performances et la sécurité
- Gérer les interactions entre middlewares

**Middlewares intégrés :**

- 🛡️ **Helmet** : headers de sécurité
- 📝 **Morgan** : logging HTTP avancé
- 🌐 **CORS** : gestion cross-origin
- 🗜️ **Compression** : compression gzip
- 🚦 **Rate Limiting** : limitation de débit
- ⏳ **Slow Down** : ralentissement progressif
- ✅ **Express Validator** : validation de données
- 🍪 **Cookie Parser** : gestion des cookies
- 📄 **Express Session** : gestion des sessions

**Endpoints de démonstration :**

- `GET /` - Page d'accueil avec infos
- `POST /api/data` - API avec validation
- `GET /sensitive` - Route avec rate limiting strict
- `GET /test/compression` - Test compression
- `GET /test/cors` - Test CORS
- `GET /test/cookies` - Test cookies
- `GET /test/session` - Test sessions
- `GET /metrics` - Métriques application
- `GET /health` - Health check

## 🔧 Configuration et Personnalisation

### EX1 - Configuration du logging

```javascript
// Dans middleware/logger.js
const logger = customLogger({
  format: "combined", // Format de log
  enableRotation: true, // Rotation activée
  maxFileSize: 10485760, // 10MB max
  logBody: false, // Log du body des requêtes
  logHeaders: false, // Log des headers
});
```

### EX2 - Configuration JWT

```javascript
// Dans middleware/auth.js
const JWT_SECRET = "your-super-secret-jwt-key";
const TOKEN_EXPIRY = "1h";
```

### EX3 - Configuration des middlewares

```javascript
// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
});

// CORS
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
};
```

## 📁 Structure du Projet

```
express-js-middlewares/
├── EX1/                          # Custom Logging Middleware
│   ├── middleware/
│   │   └── logger.js            # Middleware de logging personnalisé
│   ├── logs/                    # Dossier des logs (créé automatiquement)
│   ├── app.js                   # Application Express
│   ├── test-logging.js          # Tests automatisés
│   └── package.json             # Dépendances EX1
├── EX2/                          # Authentication Middleware
│   ├── middleware/
│   │   └── auth.js              # Middleware d'authentification
│   ├── app.js                   # Application Express
│   ├── test-auth.js             # Tests automatisés
│   └── package.json             # Dépendances EX2
├── EX3/                          # Third-party Middlewares
│   ├── logs/                    # Logs Morgan (créé automatiquement)
│   ├── app.js                   # Application Express
│   ├── test-middlewares.js      # Tests automatisés
│   └── package.json             # Dépendances EX3
└── README.md                     # Cette documentation
```

## 🎯 Objectifs d'Apprentissage

### Concepts Middlewares

1. **Structure et fonctionnement** des middlewares Express.js
2. **Ordre d'exécution** et chaînage des middlewares
3. **Gestion d'erreurs** et middleware d'erreur
4. **Performance** et optimisation des middlewares

### Sécurité

1. **Authentification JWT** et gestion des tokens
2. **Autorisation** basée sur les rôles
3. **Headers de sécurité** avec Helmet
4. **Rate limiting** et protection contre les attaques

### Monitoring et Debugging

1. **Logging HTTP** avec Morgan et middlewares personnalisés
2. **Métriques** de performance et monitoring
3. **Rotation des logs** et gestion des fichiers
4. **Analyse statistique** des requêtes

### Intégration

1. **Middlewares tiers** populaires et leur configuration
2. **CORS** et gestion des requêtes cross-origin
3. **Compression** et optimisation des réponses
4. **Sessions et cookies** pour la gestion d'état

## 🚨 Dépannage

### Erreurs communes

**Port déjà utilisé :**

```bash
# Vérifier les processus sur les ports
netstat -ano | findstr :4000
netstat -ano | findstr :4001
netstat -ano | findstr :4002

# Tuer un processus (remplacer PID)
taskkill /PID 1234 /F
```

**Dépendances manquantes :**

```bash
cd EXn && npm install
```

**Tests qui échouent :**

- Vérifiez que le serveur correspondant est démarré
- Attendez quelques secondes après le démarrage avant de lancer les tests
- Vérifiez les ports dans les fichiers de test

### Logs et Debugging

**EX1 - Logs :**

- Fichiers dans `EX1/logs/`
- Format configurable dans `middleware/logger.js`

**EX2 - Authentification :**

- Logs d'auth dans la console
- Tokens JWT valides 1 heure

**EX3 - Middlewares :**

- Logs Morgan dans `EX3/logs/access.log`
- Métriques sur `/metrics`

## 🔗 Ressources Utiles

### Documentation

- [Express.js Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)
- [Morgan Logger](https://github.com/expressjs/morgan)
- [Helmet Security](https://helmetjs.github.io/)
- [JSON Web Tokens](https://jwt.io/)

### Middlewares Populaires

- **Sécurité :** helmet, cors, express-rate-limit
- **Logging :** morgan, winston
- **Validation :** express-validator, joi
- **Parsing :** body-parser, cookie-parser, multer
- **Compression :** compression
- **Sessions :** express-session

## 🎉 Conclusion

Ces exercices couvrent les aspects essentiels des middlewares Express.js :

- Création de middlewares personnalisés
- Intégration de middlewares tiers
- Sécurité et authentification
- Performance et monitoring

Chaque exercice peut être étudié indépendamment et inclut des tests complets pour valider l'implémentation.

Bon apprentissage ! 🚀
