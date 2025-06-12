// Tests manuels pour l'API de gestion de tâches
// Exécuter ces commandes dans un autre terminal pour tester l'API

// 1. Tester la route racine
// curl -X GET http://localhost:3000

// 2. Récupérer toutes les tâches
// curl -X GET http://localhost:3000/tasks

// 3. Récupérer une tâche spécifique
// curl -X GET http://localhost:3000/tasks/1

// 4. Créer une nouvelle tâche
// curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Nouvelle tâche\",\"description\":\"Description de test\"}"

// 5. Mettre à jour une tâche
// curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"completed\":true}"

// 6. Supprimer une tâche
// curl -X DELETE http://localhost:3000/tasks/2

// 7. Tester une route inexistante
// curl -X GET http://localhost:3000/tasks/999

console.log("API de gestion de tâches - Tests disponibles");
console.log(
  "Consultez les commentaires de ce fichier pour les commandes curl de test"
);
