# Express.js Introduction

Un serveur ExpressJS simple qui démontre les bases du développement web avec Node.js et Express.

## 📋 Description

Ce projet contient un serveur ExpressJS basique avec deux routes principales :

- Route racine (`/`) qui affiche "Hello World"
- Route date (`/date`) qui affiche la date et l'heure actuelles

## 🚀 Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)

### Étapes d'installation

1. Clonez ou téléchargez ce projet
2. Naviguez vers le répertoire du projet :

   ```bash
   cd express-js-introduction
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```

## 🏃‍♂️ Utilisation

### Démarrer le serveur

```bash
npm start
```

Ou directement avec Node.js :

```bash
node server.js
```

### Démarrer en mode développement (avec redémarrage automatique)

```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:3000`

## 🛣️ Routes disponibles

| Route   | Méthode | Description                                             |
| ------- | ------- | ------------------------------------------------------- |
| `/`     | GET     | Affiche "Hello World"                                   |
| `/date` | GET     | Affiche la date et l'heure actuelles au format français |

### Exemples d'utilisation

- **Route principale** :

  - URL : `http://localhost:3000/`
  - Réponse : `Hello World`

- **Route date** :
  - URL : `http://localhost:3000/date`
  - Réponse : `Date et heure actuelles : dimanche 1 juin 2025 à 20:38:10 UTC+2`

## 📁 Structure du projet

```
express-js-introduction/
├── package.json          # Configuration du projet et dépendances
├── server.js             # Serveur ExpressJS principal
├── README.md             # Documentation du projet
├── node_modules/         # Dépendances installées (généré automatiquement)
└── EX1/                  # Dossier pour exercices supplémentaires
```

## 🛠️ Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web minimaliste pour Node.js
- **JavaScript ES6+** - Langage de programmation

## 📝 Scripts npm

- `npm start` - Démarre le serveur en mode production
- `npm run dev` - Démarre le serveur en mode développement avec nodemon

## 🔧 Configuration

Le serveur est configuré pour écouter sur le port `3000`. Pour changer le port, modifiez la variable `port` dans `server.js` :

```javascript
const port = 3000; // Changez cette valeur selon vos besoins
```

## 📚 Exercices

Ce projet fait partie d'une série d'exercices sur Express.js. D'autres exercices peuvent être trouvés dans le dossier `EX1/`.

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier `package.json` pour plus de détails.

## 👨‍💻 Auteur

Projet créé dans le cadre d'un TP sur Node.js et Express.js

---

**Note** : Ce projet est à des fins éducatives pour apprendre les bases d'Express.js
