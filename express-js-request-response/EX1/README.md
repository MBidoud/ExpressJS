# EX1 - Formulaire d'inscription avec validation

## Description

Application Express.js complète pour la soumission et validation de formulaires d'inscription avec sécurité renforcée.

## Fonctionnalités

### 🔐 Sécurité

- **Helmet.js** : Protection contre les vulnérabilités communes
- **Rate Limiting** : Limitation des tentatives (5 soumissions par 15 minutes)
- **Hachage des mots de passe** : bcrypt avec salt de niveau 12
- **Validation des entrées** : Sanitisation et validation côté serveur
- **Protection CSRF** : Headers de sécurité appropriés

### ✅ Validation complète

- **Nom** : 2-50 caractères, lettres uniquement
- **Email** : Format valide, unicité, normalisation
- **Mot de passe** : 8+ caractères, complexité requise
- **Âge** : Optionnel, 13-120 ans
- **Conditions** : Acceptation obligatoire

### 🎨 Interface utilisateur

- Design moderne et responsive
- Validation en temps réel côté client
- Indicateur de force du mot de passe
- États de chargement et feedback utilisateur
- Préservation des données en cas d'erreur

## Installation

```bash
cd EX1
npm install
```

## Démarrage

```bash
npm start
# ou
npm run dev  # Mode développement avec nodemon
```

L'application sera accessible sur http://localhost:5000

## API Endpoints

### Pages Web

- `GET /` - Formulaire d'inscription
- `GET /test-form` - Formulaire pré-rempli pour tests
- `GET /info` - Informations sur l'application

### API REST

- `GET /api/users` - Liste des utilisateurs inscrits
- `GET /api/check-email/:email` - Vérification de disponibilité email
- `POST /api/reset` - Réinitialisation de la base de données
- `POST /register` - Soumission du formulaire

## Tests

```bash
npm test
```

Tests inclus :

- Tests de validation des formulaires
- Tests des endpoints API
- Tests de sécurité
- Tests de limitation du taux

## Structure du projet

```
EX1/
├── app.js              # Application principale
├── package.json        # Dépendances et scripts
├── views/
│   ├── index.html      # Formulaire d'inscription
│   ├── success.html    # Page de succès
│   └── error.html      # Page d'erreur
├── test/
│   └── app.test.js     # Suite de tests
└── README.md          # Documentation
```

## Technologies utilisées

- **Express.js** - Framework web
- **express-validator** - Validation des données
- **bcryptjs** - Hachage des mots de passe
- **helmet** - Sécurité HTTP
- **express-rate-limit** - Limitation du taux
- **jest** & **supertest** - Tests
- **nodemon** - Développement

## Fonctionnalités avancées

### Moteur de templates personnalisé

- Substitution de variables dans les fichiers HTML
- Support des conditions et boucles simples
- Rendu optimisé et mise en cache

### Stockage en mémoire

- Base de données utilisateurs temporaire
- API de gestion des données
- Réinitialisation pour les tests

### Logging et monitoring

- Logging détaillé des requêtes
- Métriques de performance
- Suivi des erreurs de validation

## Utilisation

1. **Inscription normale** : Accédez à `/` et remplissez le formulaire
2. **Test rapide** : Utilisez `/test-form` avec des données pré-remplies
3. **Vérification** : Consultez `/api/users` pour voir les utilisateurs
4. **Réinitialisation** : POST vers `/api/reset` pour vider la base

## Notes de sécurité

- Les mots de passe sont hachés avec bcrypt
- Validation stricte côté serveur
- Protection contre les attaques XSS et CSRF
- Rate limiting pour éviter le spam
- Headers de sécurité configurés
