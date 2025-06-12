// Middleware de logging personnalisé
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("User-Agent") || "Unknown";

  console.log(`📝 [${timestamp}] ${method} ${url} - ${userAgent}`);

  // Enregistrer le temps de début de la requête
  req.startTime = Date.now();

  // Intercepter la fin de la réponse pour calculer le temps de traitement
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - req.startTime;
    console.log(
      `⏱️  [${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`
    );
    originalSend.call(this, data);
  };

  next();
};

module.exports = logger;
