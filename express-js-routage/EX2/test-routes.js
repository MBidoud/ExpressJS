// Tests pour l'API de blog avec routes paramétrées
// Exécuter ces commandes dans un terminal pour tester l'API

console.log("=== API de Blog - Tests des Routes Paramétrées ===\n");

// Tests de base
console.log("1. Route racine:");
console.log("curl -X GET http://localhost:3001/\n");

console.log("2. Tous les articles:");
console.log("curl -X GET http://localhost:3001/posts\n");

console.log("3. Toutes les catégories:");
console.log("curl -X GET http://localhost:3001/categories\n");

// Tests des routes paramétrées - Articles par année
console.log("=== Tests Routes Paramétrées - Articles par Année ===");
console.log("4. Articles de 2024:");
console.log("curl -X GET http://localhost:3001/posts/2024\n");

console.log("5. Articles de 2023:");
console.log("curl -X GET http://localhost:3001/posts/2023\n");

// Tests des routes paramétrées - Articles par année et mois
console.log("=== Tests Routes Paramétrées - Articles par Année et Mois ===");
console.log("6. Articles de janvier 2024:");
console.log("curl -X GET http://localhost:3001/posts/2024/01\n");

console.log("7. Articles de février 2024:");
console.log("curl -X GET http://localhost:3001/posts/2024/02\n");

console.log("8. Articles de mars 2024:");
console.log("curl -X GET http://localhost:3001/posts/2024/3\n");

console.log("9. Articles de juin 2024:");
console.log("curl -X GET http://localhost:3001/posts/2024/06\n");

// Tests des routes paramétrées - Articles par catégorie
console.log("=== Tests Routes Paramétrées - Articles par Catégorie ===");
console.log("10. Articles de la catégorie tech:");
console.log("curl -X GET http://localhost:3001/categories/tech/posts\n");

console.log("11. Articles de la catégorie lifestyle:");
console.log("curl -X GET http://localhost:3001/categories/lifestyle/posts\n");

console.log("12. Articles de la catégorie education:");
console.log("curl -X GET http://localhost:3001/categories/education/posts\n");

// Tests avec casse différente
console.log("13. Test insensibilité à la casse - TECH:");
console.log("curl -X GET http://localhost:3001/categories/TECH/posts\n");

console.log("14. Test insensibilité à la casse - Lifestyle:");
console.log("curl -X GET http://localhost:3001/categories/Lifestyle/posts\n");

// Tests d'erreurs
console.log("=== Tests de Validation et Gestion d'Erreurs ===");
console.log("15. Année invalide (trop ancienne):");
console.log("curl -X GET http://localhost:3001/posts/1999\n");

console.log("16. Année invalide (future):");
console.log("curl -X GET http://localhost:3001/posts/2030\n");

console.log("17. Mois invalide (0):");
console.log("curl -X GET http://localhost:3001/posts/2024/0\n");

console.log("18. Mois invalide (13):");
console.log("curl -X GET http://localhost:3001/posts/2024/13\n");

console.log("19. Catégorie inexistante:");
console.log("curl -X GET http://localhost:3001/categories/sports/posts\n");

console.log("20. Route inexistante:");
console.log("curl -X GET http://localhost:3001/inexistant\n");

// Tests des informations de catégories
console.log("=== Tests Informations Catégories ===");
console.log("21. Informations catégorie tech:");
console.log("curl -X GET http://localhost:3001/categories/tech\n");

console.log("22. Informations catégorie lifestyle:");
console.log("curl -X GET http://localhost:3001/categories/lifestyle\n");

console.log("=== Fin des Tests ===");
