const express = require("express");
const app = express();
const port = 3000;

// Route principale qui répond "Hello World"
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route qui affiche la date et l'heure actuelles
app.get("/date", (req, res) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  res.send(`Date et heure actuelles : ${formattedDate}`);
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur ExpressJS démarré sur http://localhost:${port}`);
  console.log("Routes disponibles :");
  console.log("- GET / : Hello World");
  console.log("- GET /date : Date et heure actuelles");
});
