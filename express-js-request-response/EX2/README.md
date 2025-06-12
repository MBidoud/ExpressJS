# EX2 - Système d'upload de fichiers et galerie d'images

## Description

Application Express.js complète pour l'upload de fichiers images avec galerie interactive, miniatures automatiques et gestion avancée des métadonnées.

## Fonctionnalités

### 📤 Upload de fichiers

- **Drag & Drop** : Interface intuitive de glisser-déposer
- **Multi-upload** : Jusqu'à 5 fichiers simultanément
- **Validation** : Types autorisés (JPEG, PNG, GIF), taille max 5MB
- **Prévisualisation** : Aperçu en temps réel avant upload
- **Métadonnées** : Ajout de descriptions et tags

### 🖼️ Galerie interactive

- **Affichage en grille** : Layout responsive et moderne
- **Miniatures automatiques** : Générées avec Sharp
- **Recherche avancée** : Par nom, description ou tags
- **Tri dynamique** : Par date, nom ou taille
- **Mode plein écran** : Visualisation optimisée

### 🛡️ Sécurité et performance

- **Rate limiting** : 10 uploads par 15 minutes
- **Helmet.js** : Protection contre les vulnérabilités
- **Validation stricte** : Types MIME et taille des fichiers
- **Gestion d'erreurs** : Messages détaillés et récupération

### 🎨 Interface utilisateur

- Design moderne avec animations CSS
- Interface responsive (mobile-friendly)
- Feedback visuel en temps réel
- Navigation intuitive

## Installation

```bash
cd EX2
npm install
```

## Démarrage

```bash
npm start
# ou
npm run dev  # Mode développement avec nodemon
```

L'application sera accessible sur http://localhost:5001

## Structure du projet

```
EX2/
├── app.js              # Application principale
├── package.json        # Dépendances et scripts
├── uploads/            # Dossier des fichiers uploadés
│   └── thumbnails/     # Miniatures générées
├── views/
│   ├── index.html      # Page d'upload
│   ├── gallery.html    # Galerie d'images
│   ├── image-detail.html # Détail d'une image
│   ├── upload-success.html # Confirmation d'upload
│   └── error.html      # Page d'erreur
├── test/
│   └── app.test.js     # Suite de tests
└── README.md          # Documentation
```

## API Endpoints

### Pages Web

- `GET /` - Page d'upload avec formulaire
- `GET /gallery` - Galerie d'images avec filtres
- `GET /image/:id` - Détail d'une image

### Upload et gestion

- `POST /upload` - Upload de fichiers (avec rate limiting)
- `DELETE /image/:id` - Suppression d'une image

### API REST

- `GET /api/images` - Liste de toutes les images
- `GET /api/stats` - Statistiques de la galerie
- `POST /api/reset` - Réinitialisation complète

### Fichiers statiques

- `/uploads/*` - Accès aux images originales
- `/uploads/thumbnails/*` - Accès aux miniatures

## Technologies utilisées

- **Express.js** - Framework web
- **Multer** - Gestion d'upload de fichiers
- **Sharp** - Traitement et redimensionnement d'images
- **Helmet** - Sécurité HTTP
- **express-rate-limit** - Limitation du taux
- **fs-extra** - Opérations fichiers étendues
- **jest** & **supertest** - Tests

## Fonctionnalités avancées

### Traitement d'images

- Génération automatique de miniatures (200x200px)
- Optimisation JPEG avec qualité 80%
- Préservation du ratio d'aspect

### Stockage et métadonnées

- Stockage organisé par dossiers
- Métadonnées complètes (taille, type, date, tags)
- Noms de fichiers uniques avec timestamp

### Interface utilisateur avancée

- Animations CSS3 et transitions fluides
- Indicateurs de progression d'upload
- Modal plein écran pour visualisation
- Système de tags colorés

## Utilisation

### Upload d'images

1. Accédez à la page d'accueil
2. Glissez-déposez vos images ou cliquez pour sélectionner
3. Ajoutez description et tags (optionnel)
4. Cliquez sur "Uploader les images"

### Navigation dans la galerie

1. Utilisez la barre de recherche pour filtrer
2. Sélectionnez le tri (date, nom, taille)
3. Cliquez sur une image pour voir les détails
4. Utilisez les boutons d'action (voir, supprimer)

### Gestion des images

- **Visualisation** : Mode plein écran disponible
- **Téléchargement** : Bouton de téléchargement direct
- **Partage** : Fonction de partage natif ou copie d'URL
- **Suppression** : Confirmation requise

## Configuration

### Limites par défaut

- Taille maximum : 5MB par fichier
- Nombre maximum : 5 fichiers par upload
- Types autorisés : JPEG, PNG, GIF
- Rate limit : 10 uploads par 15 minutes

### Personnalisation

Modifiez les constantes dans `app.js` :

```javascript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];
```

## Tests

```bash
npm test
```

Tests inclus :

- Upload de fichiers valides/invalides
- Validation des types et tailles
- API de gestion des images
- Fonctionnalités de sécurité

## Notes techniques

### Sécurité

- Validation stricte des types MIME
- Rate limiting pour éviter le spam
- Headers de sécurité avec Helmet
- Sanitisation des noms de fichiers

### Performance

- Miniatures générées à la volée
- Compression d'images optimisée
- Mise en cache des ressources statiques
- Layout responsive pour tous les appareils

### Gestion des erreurs

- Messages d'erreur détaillés
- Récupération gracieuse en cas d'échec
- Logging des erreurs pour debugging
- Interface utilisateur informative
