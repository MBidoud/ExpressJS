const axios = require("axios");

const BASE_URL = "http://localhost:4001";
let authToken = "";

// Configuration des couleurs pour le terminal
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "white") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "cyan");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

// Tests d'authentification
async function runAuthTests() {
  console.log("\n" + "=".repeat(60));
  log("🧪 TESTS D'AUTHENTIFICATION MIDDLEWARE", "bold");
  console.log("=".repeat(60));

  let testsPassed = 0;
  let totalTests = 0;

  async function runTest(testName, testFunction) {
    totalTests++;
    try {
      log(`\n${totalTests}. ${testName}`, "blue");
      await testFunction();
      logSuccess("Test réussi");
      testsPassed++;
    } catch (error) {
      logError(`Test échoué: ${error.message}`);
    }
  }

  // Test 1: Vérifier que le serveur est accessible
  await runTest("Connexion au serveur", async () => {
    const response = await axios.get(`${BASE_URL}/public`);
    if (response.status !== 200) {
      throw new Error(`Serveur inaccessible: ${response.status}`);
    }
    logInfo("Serveur accessible");
  });

  // Test 2: Route publique accessible sans auth
  await runTest("Accès route publique sans authentification", async () => {
    const response = await axios.get(`${BASE_URL}/public`);
    if (response.status !== 200 || !response.data.message) {
      throw new Error("Route publique inaccessible");
    }
    logInfo(`Réponse: ${response.data.message}`);
  });

  // Test 3: Route protégée refuse l'accès sans token
  await runTest("Route protégée refuse accès sans token", async () => {
    try {
      await axios.get(`${BASE_URL}/protected`);
      throw new Error("Route protégée accessible sans token");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logInfo("Accès refusé comme attendu");
      } else {
        throw new Error(`Erreur inattendue: ${error.message}`);
      }
    }
  });

  // Test 4: Login avec credentials invalides
  await runTest("Login avec credentials invalides", async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: "invalid",
        password: "invalid",
      });
      throw new Error("Login réussi avec credentials invalides");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logInfo("Login refusé comme attendu");
      } else {
        throw new Error(`Erreur inattendue: ${error.message}`);
      }
    }
  });

  // Test 5: Login avec credentials valides
  await runTest("Login avec credentials valides (admin)", async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: "admin",
      password: "admin123",
    });

    if (response.status !== 200 || !response.data.token) {
      throw new Error("Login échoué avec credentials valides");
    }

    authToken = response.data.token;
    logInfo(`Token reçu: ${authToken.substring(0, 20)}...`);
    logInfo(
      `User: ${response.data.user.username} (${response.data.user.role})`
    );
  });

  // Test 6: Accès route protégée avec token valide
  await runTest("Accès route protégée avec token valide", async () => {
    const response = await axios.get(`${BASE_URL}/protected`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.status !== 200) {
      throw new Error("Accès refusé avec token valide");
    }

    logInfo(`Accès accordé à: ${response.data.user.username}`);
  });

  // Test 7: Vérification du token
  await runTest("Vérification du token", async () => {
    const response = await axios.get(`${BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.status !== 200 || !response.data.tokenInfo.valid) {
      throw new Error("Token invalide");
    }

    logInfo(`Token valide pour: ${response.data.tokenInfo.user.username}`);
  });

  // Test 8: Accès route admin avec token admin
  await runTest("Accès route admin avec token admin", async () => {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.status !== 200) {
      throw new Error("Accès admin refusé");
    }

    logInfo(`Nombre d'utilisateurs: ${response.data.users.length}`);
  });

  // Test 9: Login user normal et test d'autorisation
  await runTest("Login user normal et test autorisation", async () => {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: "user",
      password: "user123",
    });

    const userToken = loginResponse.data.token;

    // Test accès route user
    const userResponse = await axios.get(`${BASE_URL}/user/data`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    if (userResponse.status !== 200) {
      throw new Error("Accès user refusé");
    }

    // Test refus accès admin
    try {
      await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      throw new Error("User a accès aux routes admin");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        logInfo("Accès admin refusé pour user (correct)");
      } else {
        throw new Error(`Erreur inattendue: ${error.message}`);
      }
    }
  });

  // Test 10: Route avec authentification optionnelle
  await runTest("Route avec authentification optionnelle", async () => {
    // Sans token
    const publicResponse = await axios.get(`${BASE_URL}/public/personalized`);
    if (
      publicResponse.status !== 200 ||
      !publicResponse.data.message.includes("anonymous")
    ) {
      throw new Error("Route optionnelle ne fonctionne pas sans token");
    }

    // Avec token
    const authResponse = await axios.get(`${BASE_URL}/public/personalized`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (
      authResponse.status !== 200 ||
      !authResponse.data.message.includes("admin")
    ) {
      throw new Error("Route optionnelle ne fonctionne pas avec token");
    }

    logInfo("Authentification optionnelle fonctionne");
  });

  // Test 11: Token avec format incorrect
  await runTest("Token avec format incorrect", async () => {
    try {
      await axios.get(`${BASE_URL}/protected`, {
        headers: { Authorization: "InvalidToken" },
      });
      throw new Error("Token invalide accepté");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logInfo("Token invalide refusé comme attendu");
      } else {
        throw new Error(`Erreur inattendue: ${error.message}`);
      }
    }
  });

  // Test 12: Logout et test token révoqué
  await runTest("Logout et test token révoqué", async () => {
    // Logout
    const logoutResponse = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (logoutResponse.status !== 200) {
      throw new Error("Logout échoué");
    }

    // Test accès avec token révoqué
    try {
      await axios.get(`${BASE_URL}/protected`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      throw new Error("Token révoqué encore accepté");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logInfo("Token révoqué refusé comme attendu");
      } else {
        throw new Error(`Erreur inattendue: ${error.message}`);
      }
    }
  });

  // Résultats
  console.log("\n" + "=".repeat(60));
  log("📊 RÉSULTATS DES TESTS", "bold");
  console.log("=".repeat(60));

  if (testsPassed === totalTests) {
    logSuccess(`Tous les tests sont passés! (${testsPassed}/${totalTests})`);
    log(
      "🎉 Le middleware d'authentification fonctionne parfaitement!",
      "green"
    );
  } else {
    logWarning(`${testsPassed}/${totalTests} tests réussis`);
    if (testsPassed > totalTests * 0.8) {
      log("⚠️ La plupart des fonctionnalités marchent bien", "yellow");
    } else {
      logError("❌ Plusieurs problèmes détectés dans le middleware");
    }
  }

  console.log("=".repeat(60));
}

// Fonction pour vérifier que le serveur est démarré
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/public`);
    return true;
  } catch (error) {
    return false;
  }
}

// Démarrage des tests
async function main() {
  log("🔍 Vérification de la connexion au serveur...", "cyan");

  const serverRunning = await checkServer();

  if (!serverRunning) {
    logError("❌ Serveur non accessible");
    logInfo("💡 Assurez-vous que le serveur est démarré avec: npm run dev");
    logInfo("💡 Le serveur doit être accessible sur http://localhost:4001");
    process.exit(1);
  }

  logSuccess("✅ Serveur accessible");

  try {
    await runAuthTests();
  } catch (error) {
    logError(`Erreur lors des tests: ${error.message}`);
    process.exit(1);
  }
}

// Gestion des erreurs globales
process.on("unhandledRejection", (reason, promise) => {
  logError(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

main();
