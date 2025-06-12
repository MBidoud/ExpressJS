# API de Blog avec Routes Paramétrées

Une API RESTful pour un système de blog démontrant l'utilisation de routes paramétrées avec Express.js.

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Démarrer le serveur :

```bash
npm start
```

Ou en mode développement avec nodemon :

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3001`

## Routes Principales

### Routes Paramétrées

#### GET /posts/:year/:month?

Récupère les articles d'une année et optionnellement d'un mois spécifique.

**Paramètres :**

- `year` (obligatoire) : L'année (format YYYY, entre 2000 et année courante + 1)
- `month` (optionnel) : Le mois (format MM ou M, entre 1 et 12)

**Exemples :**

- `/posts/2024` - Tous les articles de 2024
- `/posts/2024/01` - Articles de janvier 2024
- `/posts/2024/3` - Articles de mars 2024

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Titre de l'article",
      "content": "Contenu de l'article...",
      "category": "tech",
      "author": "Nom de l'auteur",
      "publishedAt": "2024-01-15T10:00:00.000Z",
      "tags": ["express", "nodejs", "web"]
    }
  ],
  "count": 1,
  "filters": {
    "year": 2024,
    "month": 1
  },
  "message": "Articles de janvier 2024"
}
```

#### GET /categories/:categoryName/posts

Récupère les articles d'une catégorie spécifique.

**Paramètres :**

- `categoryName` (obligatoire) : Le nom de la catégorie (tech, lifestyle, education)

**Exemples :**

- `/categories/tech/posts` - Articles de la catégorie technologie
- `/categories/lifestyle/posts` - Articles de la catégorie style de vie
- `/categories/education/posts` - Articles de la catégorie éducation

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Introduction à Express.js",
      "content": "Express.js est un framework web...",
      "category": "tech",
      "author": "Alice Dupont",
      "publishedAt": "2024-01-15T10:00:00.000Z",
      "tags": ["express", "nodejs", "web"]
    }
  ],
  "count": 5,
  "category": {
    "name": "tech",
    "displayName": "Technologie",
    "description": "Articles sur la technologie, le développement et l'innovation"
  },
  "message": "Articles de la catégorie 'Technologie' récupérés avec succès"
}
```

### Routes Supplémentaires

#### GET /posts

Récupère tous les articles triés par date de publication.

#### GET /categories

Récupère toutes les catégories avec le nombre d'articles.

#### GET /categories/:categoryName

Récupère les informations détaillées d'une catégorie.

## Validation des Paramètres

### Année

- Doit être un nombre entier
- Comprise entre 2000 et (année courante + 1)
- Exemples valides : 2020, 2024, 2025

### Mois

- Doit être un nombre entier
- Compris entre 1 et 12
- Peut être fourni avec ou sans zéro initial
- Exemples valides : 1, 01, 12

### Nom de Catégorie

- Insensible à la casse
- Doit correspondre à une catégorie existante
- Catégories disponibles : tech, lifestyle, education

## Gestion d'Erreurs

### Codes de Statut

- `200` : Succès
- `400` : Paramètres invalides
- `404` : Ressource non trouvée
- `500` : Erreur interne du serveur

### Exemples d'Erreurs

**Année invalide :**

```json
{
  "success": false,
  "error": "Année invalide. Veuillez fournir une année entre 2000 et 2025"
}
```

**Mois invalide :**

```json
{
  "success": false,
  "error": "Mois invalide. Veuillez fournir un mois entre 1 et 12"
}
```

**Catégorie non trouvée :**

```json
{
  "success": false,
  "error": "Catégorie 'sports' non trouvée",
  "availableCategories": ["tech", "lifestyle", "education"]
}
```

## Exemples d'Utilisation avec curl

### Récupérer tous les articles de 2024

```bash
curl -X GET http://localhost:3001/posts/2024
```

### Récupérer les articles de mars 2024

```bash
curl -X GET http://localhost:3001/posts/2024/03
```

### Récupérer les articles de technologie

```bash
curl -X GET http://localhost:3001/categories/tech/posts
```

### Récupérer toutes les catégories

```bash
curl -X GET http://localhost:3001/categories
```

### Récupérer les informations d'une catégorie

```bash
curl -X GET http://localhost:3001/categories/tech
```

## Structure des Données

### Article

```javascript
{
  id: "uuid",
  title: "Titre de l'article",
  content: "Contenu complet de l'article...",
  category: "tech",
  author: "Nom de l'auteur",
  publishedAt: "2024-01-15T10:00:00.000Z",
  tags: ["tag1", "tag2", "tag3"]
}
```

### Catégorie

```javascript
{
  name: "tech",
  displayName: "Technologie",
  description: "Description de la catégorie"
}
```

## Fonctionnalités Avancées

- **Tri automatique** : Les articles sont toujours triés par date de publication (plus récent en premier)
- **Validation robuste** : Validation complète des paramètres avec messages d'erreur explicites
- **Insensibilité à la casse** : Les noms de catégories sont traités de manière insensible à la casse
- **Statistiques** : Informations sur le nombre d'articles par catégorie et tags populaires
- **Logging** : Logging automatique de toutes les requêtes avec horodatage
