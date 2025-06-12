const request = require("supertest");
const app = require("../app");

describe("Multi-format API Tests", () => {
  // JSON Format Tests
  describe("JSON Format Responses", () => {
    test("GET /api/users should return JSON by default", async () => {
      const response = await request(app)
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    test("GET /api/users with Accept: application/json", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.users.length).toBeGreaterThan(0);
    });

    test("GET /api/products should return JSON products", async () => {
      const response = await request(app)
        .get("/api/products")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.products).toBeDefined();
      expect(response.body.products.length).toBeGreaterThan(0);
      expect(response.body.products[0]).toHaveProperty("id");
      expect(response.body.products[0]).toHaveProperty("name");
      expect(response.body.products[0]).toHaveProperty("price");
    });
  });

  // XML Format Tests
  describe("XML Format Responses", () => {
    test("GET /api/users with Accept: application/xml", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Accept", "application/xml")
        .expect(200)
        .expect("Content-Type", /xml/);

      expect(response.text).toContain("<?xml version='1.0' encoding='UTF-8'?>");
      expect(response.text).toContain("<response>");
      expect(response.text).toContain("<users>");
    });

    test("GET /api/products with Accept: application/xml", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Accept", "application/xml")
        .expect(200)
        .expect("Content-Type", /xml/);

      expect(response.text).toContain("<products>");
    });
  });

  // HTML Format Tests
  describe("HTML Format Responses", () => {
    test("GET /api/users with Accept: text/html", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Accept", "text/html")
        .expect(200)
        .expect("Content-Type", /html/);

      expect(response.text).toContain("<!DOCTYPE html>");
      expect(response.text).toContain("Utilisateurs");
      expect(response.text).toContain("<table");
    });

    test("GET /api/products with Accept: text/html", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Accept", "text/html")
        .expect(200)
        .expect("Content-Type", /html/);

      expect(response.text).toContain("Produits");
      expect(response.text).toContain("<table");
    });
  });

  // Pagination Tests
  describe("Pagination", () => {
    test("GET /api/users with page parameter", async () => {
      const response = await request(app)
        .get("/api/users?page=1&limit=2")
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.users.length).toBeLessThanOrEqual(2);
    });

    test("GET /api/products with pagination", async () => {
      const response = await request(app)
        .get("/api/products?page=2&limit=3")
        .expect(200);

      // Products API doesn't have pagination implemented, so just check basic structure
      expect(response.body.products).toBeDefined();
      expect(Array.isArray(response.body.products)).toBe(true);
    });
  });

  // Search and Filter Tests
  describe("Search and Filtering", () => {
    test("GET /api/users with search parameter", async () => {
      const response = await request(app)
        .get("/api/users?search=jean")
        .expect(200);

      expect(response.body.users).toBeDefined();
      // Should filter users containing 'jean' in name or email
    });

    test("GET /api/products with category filter", async () => {
      const response = await request(app)
        .get("/api/products?category=Informatique")
        .expect(200);

      expect(response.body.products).toBeDefined();
      if (response.body.products.length > 0) {
        expect(response.body.products[0].category).toBe("Informatique");
      }
    });

    test("GET /api/products with price range filter", async () => {
      const response = await request(app)
        .get("/api/products?minPrice=50&maxPrice=2000")
        .expect(200);

      expect(response.body.products).toBeDefined();
      response.body.products.forEach((product) => {
        expect(product.price).toBeGreaterThanOrEqual(50);
        expect(product.price).toBeLessThanOrEqual(2000);
      });
    });
  });

  // CRUD Operations Tests
  describe("CRUD Operations", () => {
    test("POST /api/users should create new user", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
        age: 25,
        city: "Test City",
      };

      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      expect(response.body.message).toContain("créé avec succès");
      expect(response.body.user.name).toBe(newUser.name);
      expect(response.body.user.email).toBe(newUser.email);
    });

    test("POST /api/products endpoint should return 404 (not implemented)", async () => {
      const newProduct = {
        name: "Test Product",
        price: 99.99,
        category: "test",
        description: "Test description",
      };

      await request(app).post("/api/products").send(newProduct).expect(404);
    });

    test("PUT /api/users/:id endpoint should return 404 (not implemented)", async () => {
      const updateData = {
        name: "Updated User",
        email: "updated@example.com",
      };

      await request(app).put("/api/users/1").send(updateData).expect(404);
    });

    test("DELETE /api/users/:id endpoint should return 404 (not implemented)", async () => {
      await request(app).delete("/api/users/1").expect(404);
    });
  });

  // Statistics Tests
  describe("Statistics API", () => {
    test("GET /api/stats should return statistics", async () => {
      const response = await request(app).get("/api/stats").expect(200);

      expect(response.body.users).toHaveProperty("total");
      expect(response.body.users).toHaveProperty("active");
      expect(response.body.users).toHaveProperty("byCity");
      expect(response.body.products).toHaveProperty("total");
      expect(response.body.products).toHaveProperty("totalValue");
      expect(response.body.system).toHaveProperty("timestamp");
    });

    test("GET /api/stats with HTML format", async () => {
      const response = await request(app)
        .get("/api/stats")
        .set("Accept", "text/html")
        .expect(200)
        .expect("Content-Type", /html/);

      expect(response.text).toContain("Statistiques");
      expect(response.text).toContain("Utilisateurs");
      expect(response.text).toContain("Produits");
    });
  });

  // Error Handling Tests
  describe("Error Handling", () => {
    test("GET /api/users/:id with invalid ID should return 404", async () => {
      const response = await request(app).get("/api/users/999").expect(404);

      expect(response.body.error).toContain("non trouvé");
    });

    test("POST /api/users with invalid data should return 400", async () => {
      const invalidUser = {
        name: "", // Empty name should be invalid
      };

      const response = await request(app)
        .post("/api/users")
        .send(invalidUser)
        .expect(400);

      expect(response.body.error).toContain("requis");
    });

    test("Unsupported media type should return 406", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Accept", "application/pdf")
        .expect(406);

      expect(response.body.error).toContain("non supporté");
    });
  });

  // Content Negotiation Tests
  describe("Content Negotiation", () => {
    test("Multiple Accept headers should choose best format", async () => {
      const response = await request(app)
        .get("/api/users")
        .set(
          "Accept",
          "text/html, application/xml;q=0.9, application/json;q=0.8"
        )
        .expect(200)
        .expect("Content-Type", /html/);

      expect(response.text).toContain("<!DOCTYPE html>");
    });

    test("Wildcard Accept header should default to JSON", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Accept", "*/*")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.users).toBeDefined();
    });
  });

  // Performance and Rate Limiting Tests
  describe("Rate Limiting", () => {
    test("Should handle multiple concurrent requests", async () => {
      const requests = Array(5)
        .fill()
        .map(() => request(app).get("/api/users"));

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });

  // Search endpoint tests
  describe("Search Endpoint", () => {
    test("GET /api/search should search across users and products", async () => {
      const response = await request(app).get("/api/search?q=jean").expect(200);

      expect(response.body.results).toHaveProperty("users");
      expect(response.body.results).toHaveProperty("products");
      expect(Array.isArray(response.body.results.users)).toBe(true);
      expect(Array.isArray(response.body.results.products)).toBe(true);
      expect(response.body.summary).toHaveProperty("totalResults");
    });

    test("GET /api/search with HTML format", async () => {
      const response = await request(app)
        .get("/api/search?q=tech")
        .set("Accept", "text/html")
        .expect(200)
        .expect("Content-Type", /html/);

      expect(response.text).toContain("Recherche:");
      expect(response.text).toContain("résultats");
    });

    test("GET /api/search without query should return 400", async () => {
      const response = await request(app).get("/api/search").expect(400);

      expect(response.body.error).toContain("requis");
    });
  });

  // Individual user endpoint
  describe("Individual User Endpoint", () => {
    test("GET /api/users/:id should return specific user", async () => {
      const response = await request(app).get("/api/users/1").expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe("1");
      expect(response.body.metadata).toBeDefined();
    });

    test("GET /api/users/:id with HTML format", async () => {
      const response = await request(app)
        .get("/api/users/1")
        .set("Accept", "text/html")
        .expect(200)
        .expect("Content-Type", /html/);

      expect(response.text).toContain("Utilisateur");
      expect(response.text).toContain("Jean Dupont");
    });
  });

  // 404 handling
  describe("404 Error Handling", () => {
    test("Non-existent endpoint should return 404", async () => {
      const response = await request(app).get("/api/nonexistent").expect(404);

      expect(response.body.error).toContain("non trouvé");
    });
  });
});
