const request = require("supertest");
const app = require("../app");

describe("Form Submission Tests", () => {
  test("GET / should return registration form", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Formulaire d'inscription");
  });
  test("POST /register with valid data should succeed", async () => {
    const validData = {
      name: "Jean Dupont",
      email: "jean@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      age: "25",
      terms: "on",
    };

    const res = await request(app).post("/register").send(validData);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Inscription réussie");
  });

  test("POST /register with invalid email should fail", async () => {
    const invalidData = {
      name: "Jean Dupont",
      email: "invalid-email",
      password: "Password123!",
      terms: "on",
    };

    const res = await request(app).post("/register").send(invalidData);

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain("Erreur de validation");
  });

  test("POST /register with weak password should fail", async () => {
    const invalidData = {
      name: "Jean Dupont",
      email: "jean2@example.com",
      password: "123",
      terms: "on",
    };

    const res = await request(app).post("/register").send(invalidData);

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain("Erreur de validation");
  });

  test("GET /api/users should return users list", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  test("GET /api/check-email/:email should check email availability", async () => {
    const res = await request(app).get("/api/check-email/test@example.com");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("available");
    expect(typeof res.body.available).toBe("boolean");
  });

  test("POST /api/reset should reset users database", async () => {
    const res = await request(app).post("/api/reset");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Base de données réinitialisée");
  });

  test("GET /test-form should return pre-filled form", async () => {
    const res = await request(app).get("/test-form");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("john.doe@example.com");
  });

  test("GET /info should return app information", async () => {
    const res = await request(app).get("/info");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("endpoints");
  });
});

describe("Rate Limiting Tests", () => {
  test("Should allow initial requests", async () => {
    const validData = {
      name: "Test User",
      email: "ratelimit@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      terms: "on",
    };

    const res = await request(app).post("/register").send(validData);

    expect(res.statusCode).toBe(200);
  });
});

describe("Security Tests", () => {
  test("Should have security headers", async () => {
    const res = await request(app).get("/");
    expect(res.headers).toHaveProperty("x-content-type-options");
    expect(res.headers).toHaveProperty("x-frame-options");
  });

  test("Should sanitize input data", async () => {
    const maliciousData = {
      name: '<script>alert("xss")</script>',
      email: "test@example.com",
      password: "Password123!",
      terms: "on",
    };

    const res = await request(app).post("/register").send(maliciousData);

    expect(res.statusCode).toBe(400);
  });
});
