const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:4000";

// Couleurs pour les logs
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction pour attendre
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testLoggingMiddleware() {
  try {
    log("\n🧪 Test du Middleware de Logging Personnalisé", "cyan");
    log("=" * 60, "cyan");

    // Test 1: Vérifier que le serveur est accessible
    log("\n📡 Test 1: Connexion au serveur", "blue");
    const healthResponse = await axios.get(`${BASE_URL}/`);
    log("✅ Serveur accessible", "green");
    console.log("Message:", healthResponse.data.message);

    // Test 2: Requête GET simple
    log("\n👥 Test 2: Requête GET - Liste des utilisateurs", "blue");
    const usersResponse = await axios.get(`${BASE_URL}/users`);
    log("✅ Requête GET réussie", "green");
    console.log("Nombre d'utilisateurs:", usersResponse.data.count);

    // Test 3: Requête POST avec body
    log("\n➕ Test 3: Requête POST - Création utilisateur", "blue");
    const newUser = {
      name: "Test User",
      email: "test@example.com",
    };
    const createResponse = await axios.post(`${BASE_URL}/users`, newUser);
    log("✅ Requête POST réussie", "green");
    console.log("Utilisateur créé:", createResponse.data.data.name);

    // Test 4: Requête avec paramètres
    log("\n🔍 Test 4: Requête avec paramètres - Détails produit", "blue");
    const productId = 123;
    const productResponse = await axios.get(
      `${BASE_URL}/products/${productId}`
    );
    log("✅ Requête avec paramètres réussie", "green");
    console.log("Produit:", productResponse.data.data.name);

    // Test 5: Requête lente pour tester les temps de réponse
    log("\n⏱️ Test 5: Requête lente (2 secondes)", "blue");
    const startTime = Date.now();
    const slowResponse = await axios.get(`${BASE_URL}/slow`);
    const responseTime = Date.now() - startTime;
    log("✅ Requête lente réussie", "green");
    console.log(`Temps de réponse: ${responseTime}ms`);

    // Test 6: Erreur 400
    log("\n❌ Test 6: Erreur 400 - POST sans données", "blue");
    try {
      await axios.post(`${BASE_URL}/users`, {});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        log("✅ Erreur 400 correctement loggée", "green");
      }
    }

    // Test 7: Erreur 404
    log("\n❓ Test 7: Erreur 404 - Route inexistante", "blue");
    try {
      await axios.get(`${BASE_URL}/route-inexistante`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        log("✅ Erreur 404 correctement loggée", "green");
      }
    }

    // Test 8: Erreur 500
    log("\n💥 Test 8: Erreur 500 - Erreur serveur", "blue");
    try {
      await axios.get(`${BASE_URL}/error`);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        log("✅ Erreur 500 correctement loggée", "green");
      }
    }

    // Test 9: Paramètre invalide
    log("\n🔢 Test 9: Paramètre invalide - ID produit non numérique", "blue");
    try {
      await axios.get(`${BASE_URL}/products/abc`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        log("✅ Paramètre invalide correctement loggé", "green");
      }
    }

    // Attendre un peu pour que tous les logs soient écrits
    await sleep(1000);

    // Test 10: Analyser les logs générés
    log("\n📊 Test 10: Analyse des logs générés", "blue");
    try {
      const analysisResponse = await axios.get(`${BASE_URL}/logs/analysis`);
      log("✅ Analyse des logs réussie", "green");

      const analysis = analysisResponse.data.analysis;
      console.log("Statistiques des logs:");
      console.log(`- Total des requêtes: ${analysis.totalRequests}`);
      console.log("- Méthodes HTTP:", analysis.methodCounts);
      console.log("- Codes de statut:", analysis.statusCounts);

      if (analysis.responseTimes) {
        console.log("- Temps de réponse:");
        console.log(`  • Moyenne: ${analysis.responseTimes.average}ms`);
        console.log(`  • Médiane: ${analysis.responseTimes.median}ms`);
        console.log(`  • Min: ${analysis.responseTimes.min}ms`);
        console.log(`  • Max: ${analysis.responseTimes.max}ms`);
        console.log(
          `  • 95e percentile: ${analysis.responseTimes.percentile95}ms`
        );
      }
    } catch (error) {
      log(`❌ Erreur lors de l'analyse: ${error.message}`, "red");
    }

    // Test 11: Vérifier les fichiers de logs
    log("\n📁 Test 11: Vérification des fichiers de logs", "blue");
    const logsDir = path.join(__dirname, "logs");

    if (fs.existsSync(logsDir)) {
      const logFiles = fs.readdirSync(logsDir);
      log("✅ Dossier de logs créé", "green");
      console.log("Fichiers de logs:", logFiles);

      // Vérifier le contenu du fichier de log principal
      const today = new Date().toISOString().substring(0, 10);
      const accessLogFile = path.join(logsDir, `access-${today}.log`);

      if (fs.existsSync(accessLogFile)) {
        const logContent = fs.readFileSync(accessLogFile, "utf8");
        const logLines = logContent.split("\n").filter((line) => line.trim());
        log(
          `✅ Fichier access-${today}.log contient ${logLines.length} entrées`,
          "green"
        );

        // Afficher les 3 dernières lignes de log
        console.log("\nDernières entrées de log:");
        logLines.slice(-3).forEach((line, index) => {
          console.log(`${index + 1}. ${line}`);
        });
      }
    } else {
      log("❌ Dossier de logs non trouvé", "red");
    }

    // Test 12: Test des logs bruts
    log("\n📝 Test 12: Récupération des logs bruts", "blue");
    try {
      const rawLogsResponse = await axios.get(`${BASE_URL}/logs/raw`);
      log("✅ Logs bruts récupérés", "green");
      console.log(
        `Nombre de lignes récupérées: ${rawLogsResponse.data.logs.length}`
      );
    } catch (error) {
      log(`❌ Erreur logs bruts: ${error.message}`, "red");
    }

    log("\n🎉 Tous les tests du middleware de logging terminés!", "green");
    log("=" * 60, "cyan");

    // Recommandations
    log("\n💡 Points à vérifier:", "yellow");
    log("1. Fichiers de logs créés dans le dossier ./logs/", "yellow");
    log("2. Rotation quotidienne des logs fonctionnelle", "yellow");
    log("3. Différents formats de log disponibles", "yellow");
    log("4. Logging des erreurs séparé", "yellow");
    log("5. Analyse statistique des logs", "yellow");
  } catch (error) {
    log(`❌ Erreur dans les tests: ${error.message}`, "red");
    if (error.response) {
      console.log("Statut:", error.response.status);
      console.log("Données:", error.response.data);
    }
  }
}

// Vérifier si le serveur est démarré
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  log("🔍 Vérification de la disponibilité du serveur...", "yellow");

  const serverRunning = await checkServer();
  if (!serverRunning) {
    log("❌ Le serveur n'est pas démarré. Veuillez lancer: npm start", "red");
    log("   ou en mode développement: npm run dev", "yellow");
    process.exit(1);
  }

  log("✅ Serveur disponible, démarrage des tests...", "green");
  await sleep(1000);

  await testLoggingMiddleware();
}

if (require.main === module) {
  main();
}

module.exports = { testLoggingMiddleware, checkServer };
