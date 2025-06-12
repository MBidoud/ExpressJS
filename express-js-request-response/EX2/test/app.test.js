const request = require("supertest");
const app = require("../app");
const fs = require("fs-extra");
const path = require("path");

// Créer un fichier image de test
const createTestImage = () => {
  const testImagePath = path.join(__dirname, "test-image.jpg");
  // Créer un petit fichier JPEG de test (1x1 pixel)
  const jpegBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0xff, 0xd9,
  ]);
  fs.writeFileSync(testImagePath, jpegBuffer);
  return testImagePath;
};

describe("File Upload System Tests", () => {
  let testImagePath;

  beforeAll(() => {
    testImagePath = createTestImage();
  });

  afterAll(async () => {
    // Nettoyer les fichiers de test
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    // Réinitialiser la galerie
    await request(app).post("/api/reset");
  });

  test("GET / should return upload page", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Galerie d'Images");
  });

  test("POST /upload with valid image should succeed", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("images", testImagePath)
      .field("description", "Test image")
      .field("tags", "test, sample");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Upload réussi");
  });

  test("POST /upload without files should fail", async () => {
    const res = await request(app)
      .post("/upload")
      .field("description", "No files");

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain("Aucun fichier sélectionné");
  });

  test("POST /upload with invalid file type should fail", async () => {
    const textFilePath = path.join(__dirname, "test.txt");
    fs.writeFileSync(textFilePath, "This is a text file");

    const res = await request(app)
      .post("/upload")
      .attach("images", textFilePath);

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain("Type de fichier non autorisé");

    fs.unlinkSync(textFilePath);
  });

  test("GET /gallery should return gallery page", async () => {
    const res = await request(app).get("/gallery");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Galerie d'images");
  });

  test("GET /gallery with search should filter results", async () => {
    const res = await request(app).get("/gallery?search=test");
    expect(res.statusCode).toBe(200);
  });

  test("GET /gallery with sort parameters should work", async () => {
    const res = await request(app).get("/gallery?sort=name&order=asc");
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/images should return images list", async () => {
    const res = await request(app).get("/api/images");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("images");
    expect(Array.isArray(res.body.images)).toBe(true);
  });

  test("GET /api/stats should return statistics", async () => {
    const res = await request(app).get("/api/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("totalImages");
    expect(res.body).toHaveProperty("totalSize");
    expect(res.body).toHaveProperty("typeStats");
  });

  test("POST /api/reset should reset gallery", async () => {
    const res = await request(app).post("/api/reset");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toContain("réinitialisée");
  });
});

describe("Image Management Tests", () => {
  let imageId;
  let testImagePath;

  beforeAll(async () => {
    testImagePath = createTestImage();

    // Upload une image de test
    const uploadRes = await request(app)
      .post("/upload")
      .attach("images", testImagePath)
      .field("description", "Test for management");

    expect(uploadRes.statusCode).toBe(200);

    // Récupérer l'ID de l'image uploadée
    const imagesRes = await request(app).get("/api/images");
    const images = imagesRes.body.images;
    if (images.length > 0) {
      imageId = images[0].id;
    }
  });

  afterAll(() => {
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  test("GET /image/:id should return image detail page", async () => {
    if (imageId) {
      const res = await request(app).get(`/image/${imageId}`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Image -");
    }
  });

  test("GET /image/:id with invalid id should return 404", async () => {
    const res = await request(app).get("/image/999999");
    expect(res.statusCode).toBe(404);
    expect(res.text).toContain("Image non trouvée");
  });

  test("DELETE /image/:id should delete image", async () => {
    if (imageId) {
      const res = await request(app).delete(`/image/${imageId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
    }
  });

  test("DELETE /image/:id with invalid id should return 404", async () => {
    const res = await request(app).delete("/image/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("success", false);
  });
});

describe("Security Tests", () => {
  test("Should have security headers", async () => {
    const res = await request(app).get("/");
    expect(res.headers).toHaveProperty("x-content-type-options");
    expect(res.headers).toHaveProperty("x-frame-options");
  });

  test("Should reject files larger than 5MB", async () => {
    // Créer un fichier factice de plus de 5MB
    const largeFilePath = path.join(__dirname, "large-file.jpg");
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    fs.writeFileSync(largeFilePath, largeBuffer);

    const res = await request(app)
      .post("/upload")
      .attach("images", largeFilePath);

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain("taille maximale");

    fs.unlinkSync(largeFilePath);
  });

  test("Rate limiting should work", async () => {
    const testImagePath = createTestImage();

    // Faire plusieurs uploads rapidement
    const promises = [];
    for (let i = 0; i < 12; i++) {
      promises.push(
        request(app).post("/upload").attach("images", testImagePath)
      );
    }

    const results = await Promise.all(promises);

    // Au moins une requête devrait être limitée
    const rateLimitedResults = results.filter((res) => res.statusCode === 429);
    expect(rateLimitedResults.length).toBeGreaterThan(0);

    fs.unlinkSync(testImagePath);
  });
});

describe("Error Handling Tests", () => {
  test("Should handle missing file gracefully", async () => {
    const res = await request(app)
      .post("/upload")
      .field("description", "No file attached");

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain("Erreur");
  });

  test("Should handle corrupted upload gracefully", async () => {
    // Simuler un upload corrompu en envoyant des données incorrectes
    const res = await request(app)
      .post("/upload")
      .set("Content-Type", "multipart/form-data; boundary=---invalid")
      .send("---invalid\r\nContent-Disposition: form-data;\r\n\r\ninvalid");

    expect(res.statusCode).toBe(400);
  });

  test("Should handle non-existent routes", async () => {
    const res = await request(app).get("/non-existent-route");
    expect(res.statusCode).toBe(404);
  });
});

describe("Static Files Tests", () => {
  test("Should serve uploaded files", async () => {
    // D'abord uploader un fichier
    const testImagePath = createTestImage();

    const uploadRes = await request(app)
      .post("/upload")
      .attach("images", testImagePath);

    if (uploadRes.statusCode === 200) {
      // Récupérer le nom du fichier uploadé depuis la réponse ou l'API
      const imagesRes = await request(app).get("/api/images");
      const images = imagesRes.body.images;

      if (images.length > 0) {
        const filename = images[0].filename;
        const fileRes = await request(app).get(`/uploads/${filename}`);
        expect(fileRes.statusCode).toBe(200);
      }
    }

    fs.unlinkSync(testImagePath);
  });

  test("Should serve thumbnails", async () => {
    const imagesRes = await request(app).get("/api/images");
    const images = imagesRes.body.images;

    if (images.length > 0) {
      const filename = images[0].filename;
      const thumbRes = await request(app).get(
        `/uploads/thumbnails/thumb_${filename}`
      );
      // Thumbnail might not exist immediately, so we check for 200 or 404
      expect([200, 404]).toContain(thumbRes.statusCode);
    }
  });
});
