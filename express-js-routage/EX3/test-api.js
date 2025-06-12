const axios = require("axios");

const BASE_URL = "http://localhost:3002";
let authToken = "";
let adminToken = "";
let userId = "";
let productId = "";
let orderId = "";

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

// Fonction pour faire une pause
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testAPI() {
  try {
    log("\n🚀 Test de l'API E-commerce - Routeurs Modulaires", "cyan");
    log("=" * 60, "cyan");

    // Test 1: Route racine
    log("\n📋 Test 1: Route racine", "blue");
    const rootResponse = await axios.get(`${BASE_URL}/`);
    log("✅ Route racine OK", "green");
    console.log("Documentation:", rootResponse.data.documentation);

    // Test 2: Santé du serveur
    log("\n🏥 Test 2: Santé du serveur", "blue");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    log("✅ Santé du serveur OK", "green");
    console.log("Uptime:", Math.floor(healthResponse.data.uptime), "secondes");

    // Test 3: Inscription d'un utilisateur normal
    log("\n👤 Test 3: Inscription utilisateur", "blue");
    const registerData = {
      email: "user@test.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Dupont",
    };
    const registerResponse = await axios.post(
      `${BASE_URL}/auth/register`,
      registerData
    );
    authToken = registerResponse.data.data.token;
    userId = registerResponse.data.data.user.id;
    log("✅ Inscription utilisateur OK", "green");
    console.log("Token reçu:", authToken.substring(0, 20) + "...");

    // Test 4: Inscription d'un admin
    log("\n👑 Test 4: Inscription admin", "blue");
    const adminData = {
      email: "admin@test.com",
      password: "admin123",
      firstName: "Marie",
      lastName: "Admin",
      role: "admin",
    };
    const adminRegisterResponse = await axios.post(
      `${BASE_URL}/auth/register`,
      adminData
    );
    adminToken = adminRegisterResponse.data.data.token;
    log("✅ Inscription admin OK", "green");

    // Test 5: Connexion utilisateur
    log("\n🔐 Test 5: Connexion utilisateur", "blue");
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: "user@test.com",
      password: "password123",
    });
    log("✅ Connexion utilisateur OK", "green");

    // Test 6: Récupération du profil utilisateur
    log("\n👤 Test 6: Profil utilisateur", "blue");
    const profileResponse = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    log("✅ Profil utilisateur OK", "green");
    console.log(
      "Utilisateur:",
      profileResponse.data.data.firstName,
      profileResponse.data.data.lastName
    ); // Test 7: Récupération des catégories
    log("\n📂 Test 7: Liste des catégories", "blue");
    const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
    log("✅ Liste des catégories OK", "green");
    console.log("Nombre de catégories:", categoriesResponse.data.data.length); // Test 8: Récupération des produits
    log("\n📦 Test 8: Liste des produits", "blue");
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    productId = productsResponse.data.data[0].id;
    log("✅ Liste des produits OK", "green");
    console.log("Nombre de produits:", productsResponse.data.data.length); // Test 9: Détails d'un produit
    log("\n🔍 Test 9: Détails du produit", "blue");
    const productResponse = await axios.get(
      `${BASE_URL}/products/${productId}`
    );
    log("✅ Détails du produit OK", "green");
    console.log("Produit:", productResponse.data.data.name); // Test 10: Création d'une commande
    log("\n🛒 Test 10: Création de commande", "blue");
    const orderData = {
      items: [{ productId: productId, quantity: 2 }],
      shippingAddress: {
        street: "123 Rue de Test",
        city: "Test City",
        postalCode: "12345",
        country: "France",
      },
    };

    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    orderId = orderResponse.data.data.id;
    log("✅ Création de commande OK", "green");
    console.log("Commande ID:", orderId); // Test 11: Récupération des commandes utilisateur
    log("\n📋 Test 11: Commandes utilisateur", "blue");
    const userOrdersResponse = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    log("✅ Commandes utilisateur OK", "green");
    console.log("Nombre de commandes:", userOrdersResponse.data.data.length);

    // Test 12: Création d'un produit (admin)
    log("\n👑 Test 12: Création produit (admin)", "blue");
    const newProductData = {
      name: "Produit Test",
      description: "Un produit créé pour les tests",
      price: 29.99,
      categoryId: categoriesResponse.data.data[0].id,
      stock: 50,
    };
    const newProductResponse = await axios.post(
      `${BASE_URL}/admin/products`,
      newProductData,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    log("✅ Création produit admin OK", "green");
    console.log("Nouveau produit:", newProductResponse.data.data.name);

    // Test 13: Liste des utilisateurs (admin)
    log("\n👥 Test 13: Liste utilisateurs (admin)", "blue");
    const usersListResponse = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    log("✅ Liste utilisateurs admin OK", "green");
    console.log("Nombre d'utilisateurs:", usersListResponse.data.data.length);

    // Test 14: Statistiques admin
    log("\n📊 Test 14: Statistiques admin", "blue");
    const statsResponse = await axios.get(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    log("✅ Statistiques admin OK", "green");
    console.log("Stats:", statsResponse.data.stats);

    // Test 15: Test d'accès non autorisé
    log("\n🚫 Test 15: Accès non autorisé", "blue");
    try {
      await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${authToken}` }, // Token utilisateur normal
      });
      log("❌ Échec: accès admin autorisé avec token utilisateur", "red");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        log("✅ Accès admin correctement refusé", "green");
      } else {
        log("❌ Erreur inattendue:", error.message, "red");
      }
    }

    // Test 16: Route inexistante
    log("\n❓ Test 16: Route inexistante", "blue");
    try {
      await axios.get(`${BASE_URL}/route-inexistante`);
      log("❌ Échec: route inexistante trouvée", "red");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        log("✅ Route inexistante correctement gérée", "green");
      } else {
        log("❌ Erreur inattendue:", error.message, "red");
      }
    }

    log("\n🎉 Tous les tests terminés avec succès!", "green");
    log("=" * 60, "cyan");
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
    await axios.get(`${BASE_URL}/health`);
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

  await testAPI();
}

// Ajouter axios comme dépendance si pas installé
if (require.main === module) {
  main();
}

module.exports = { testAPI, checkServer };
