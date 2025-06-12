# API de Gestion de Tâches

Une API RESTful simple pour gérer une liste de tâches, construite avec Express.js.

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

Le serveur sera accessible sur `http://localhost:3000`

## Endpoints de l'API

### GET /tasks

Récupérer toutes les tâches.

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Apprendre Express.js",
      "description": "Comprendre les bases du framework Express.js",
      "completed": false,
      "createdAt": "2025-06-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### GET /tasks/:id

Récupérer une tâche spécifique par son ID.

**Paramètres :**

- `id` (string) : L'identifiant unique de la tâche

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Apprendre Express.js",
    "description": "Comprendre les bases du framework Express.js",
    "completed": false,
    "createdAt": "2025-06-01T10:00:00.000Z"
  }
}
```

### POST /tasks

Créer une nouvelle tâche.

**Corps de la requête :**

```json
{
  "title": "Nouvelle tâche",
  "description": "Description de la tâche",
  "completed": false
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "title": "Nouvelle tâche",
    "description": "Description de la tâche",
    "completed": false,
    "createdAt": "2025-06-01T10:00:00.000Z",
    "updatedAt": "2025-06-01T10:00:00.000Z"
  },
  "message": "Tâche créée avec succès"
}
```

### PUT /tasks/:id

Mettre à jour une tâche existante.

**Paramètres :**

- `id` (string) : L'identifiant unique de la tâche

**Corps de la requête :**

```json
{
  "title": "Titre mis à jour",
  "description": "Description mise à jour",
  "completed": true
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Titre mis à jour",
    "description": "Description mise à jour",
    "completed": true,
    "createdAt": "2025-06-01T10:00:00.000Z",
    "updatedAt": "2025-06-01T10:15:00.000Z"
  },
  "message": "Tâche mise à jour avec succès"
}
```

### DELETE /tasks/:id

Supprimer une tâche.

**Paramètres :**

- `id` (string) : L'identifiant unique de la tâche

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Tâche supprimée",
    "description": "Description de la tâche supprimée",
    "completed": false,
    "createdAt": "2025-06-01T10:00:00.000Z"
  },
  "message": "Tâche supprimée avec succès"
}
```

## Codes de statut HTTP

- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide
- `404` : Ressource non trouvée
- `500` : Erreur interne du serveur

## Structure des données

Une tâche contient les propriétés suivantes :

- `id` (string) : Identifiant unique généré automatiquement
- `title` (string) : Titre de la tâche (requis)
- `description` (string) : Description détaillée de la tâche
- `completed` (boolean) : État d'achèvement de la tâche
- `createdAt` (string) : Date de création au format ISO
- `updatedAt` (string) : Date de dernière modification au format ISO

## Exemples d'utilisation avec curl

### Récupérer toutes les tâches

```bash
curl -X GET http://localhost:3000/tasks
```

### Créer une nouvelle tâche

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ma nouvelle tâche","description":"Description de la tâche"}'
```

### Mettre à jour une tâche

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Supprimer une tâche

```bash
curl -X DELETE http://localhost:3000/tasks/1
```
