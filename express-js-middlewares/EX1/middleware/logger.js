const fs = require("fs");
const path = require("path");

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Fonction utilitaire pour formater la date
const formatDate = (date) => {
  return date.toISOString().replace("T", " ").substring(0, 19);
};

// Fonction utilitaire pour obtenir l'adresse IP réelle
const getClientIP = (req) => {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    "0.0.0.0"
  );
};

// Middleware de logging personnalisé
const customLogger = (options = {}) => {
  const {
    logFile = "access.log",
    format = "combined", // 'combined', 'common', 'short', 'tiny', 'dev'
    includeBody = false,
    includeHeaders = false,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    rotateDaily = true,
  } = options;

  // Fonction pour obtenir le nom du fichier de log avec rotation
  const getLogFileName = () => {
    if (rotateDaily) {
      const date = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
      const ext = path.extname(logFile);
      const name = path.basename(logFile, ext);
      return path.join(logsDir, `${name}-${date}${ext}`);
    }
    return path.join(logsDir, logFile);
  };

  // Fonction pour faire la rotation des logs par taille
  const rotateLogFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const ext = path.extname(filePath);
        const name = path.basename(filePath, ext);
        const dir = path.dirname(filePath);
        const newName = path.join(dir, `${name}-${timestamp}${ext}`);
        fs.renameSync(filePath, newName);
      }
    }
  };

  // Formateurs de logs selon le format
  const formatters = {
    combined: (req, res, responseTime, timestamp) => {
      const ip = getClientIP(req);
      const userAgent = req.get("User-Agent") || "-";
      const referer = req.get("Referer") || "-";
      return `${ip} - - [${timestamp}] "${req.method} ${req.originalUrl} HTTP/${
        req.httpVersion
      }" ${res.statusCode} ${
        res.get("Content-Length") || "-"
      } "${referer}" "${userAgent}" ${responseTime}ms`;
    },

    common: (req, res, responseTime, timestamp) => {
      const ip = getClientIP(req);
      return `${ip} - - [${timestamp}] "${req.method} ${req.originalUrl} HTTP/${
        req.httpVersion
      }" ${res.statusCode} ${res.get("Content-Length") || "-"}`;
    },

    short: (req, res, responseTime, timestamp) => {
      const ip = getClientIP(req);
      return `${ip} ${req.method} ${req.originalUrl} HTTP/${req.httpVersion} ${
        res.statusCode
      } ${res.get("Content-Length") || "-"} - ${responseTime}ms`;
    },

    tiny: (req, res, responseTime, timestamp) => {
      return `${req.method} ${req.originalUrl} ${res.statusCode} ${
        res.get("Content-Length") || "-"
      } - ${responseTime}ms`;
    },

    dev: (req, res, responseTime, timestamp) => {
      const colorCode =
        res.statusCode >= 500
          ? "\x1b[31m" // Rouge pour 5xx
          : res.statusCode >= 400
          ? "\x1b[33m" // Jaune pour 4xx
          : res.statusCode >= 300
          ? "\x1b[36m" // Cyan pour 3xx
          : res.statusCode >= 200
          ? "\x1b[32m" // Vert pour 2xx
          : "\x1b[0m"; // Défaut
      const resetColor = "\x1b[0m";
      return `${req.method} ${req.originalUrl} ${colorCode}${
        res.statusCode
      }${resetColor} ${res.get("Content-Length") || "-"} - ${responseTime}ms`;
    },
  };

  return (req, res, next) => {
    const startTime = Date.now();
    const timestamp = formatDate(new Date());

    // Capturer le body de la requête si demandé
    let requestBody = "";
    if (includeBody && req.body) {
      requestBody = JSON.stringify(req.body);
    }

    // Intercepter la fin de la réponse
    const originalSend = res.send;
    res.send = function (data) {
      const responseTime = Date.now() - startTime;

      // Choisir le formateur
      const formatter = formatters[format] || formatters.combined;
      let logEntry = formatter(req, res, responseTime, timestamp);

      // Ajouter le body si demandé
      if (includeBody && requestBody) {
        logEntry += ` | Body: ${requestBody}`;
      }

      // Ajouter les headers si demandé
      if (includeHeaders) {
        const headers = JSON.stringify(req.headers);
        logEntry += ` | Headers: ${headers}`;
      }

      logEntry += "\n";

      // Écrire dans le fichier de log
      const logFilePath = getLogFileName();

      // Vérifier la rotation par taille
      rotateLogFile(logFilePath);

      // Écrire le log
      fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture du log:", err);
        }
      });

      // Afficher aussi en console pour le format dev
      if (format === "dev") {
        console.log(logEntry.trim());
      }

      // Appeler la méthode send originale
      originalSend.call(this, data);
    };

    next();
  };
};

// Middleware de logging des erreurs
const errorLogger = (options = {}) => {
  const { logFile = "error.log" } = options;

  return (err, req, res, next) => {
    const timestamp = formatDate(new Date());
    const ip = getClientIP(req);
    const errorEntry = `[${timestamp}] ERROR ${ip} ${req.method} ${req.originalUrl} - ${err.message}\nStack: ${err.stack}\n\n`;

    const errorLogPath = path.join(logsDir, logFile);

    fs.appendFile(errorLogPath, errorEntry, (writeErr) => {
      if (writeErr) {
        console.error("Erreur lors de l'écriture du log d'erreur:", writeErr);
      }
    });

    next(err);
  };
};

// Middleware pour analyser les logs
const logAnalyzer = {
  // Compter les requêtes par méthode HTTP
  countByMethod: (logContent) => {
    const methods = {};
    const lines = logContent.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      const methodMatch = line.match(/^\S+\s+(\w+)\s+/);
      if (methodMatch) {
        const method = methodMatch[1];
        methods[method] = (methods[method] || 0) + 1;
      }
    });

    return methods;
  },

  // Compter les codes de statut
  countByStatus: (logContent) => {
    const statuses = {};
    const lines = logContent.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      const statusMatch = line.match(/HTTP\/[\d.]+"\s+(\d+)\s+/);
      if (statusMatch) {
        const status = statusMatch[1];
        statuses[status] = (statuses[status] || 0) + 1;
      }
    });

    return statuses;
  },

  // Analyser les temps de réponse
  analyzeResponseTimes: (logContent) => {
    const times = [];
    const lines = logContent.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      const timeMatch = line.match(/(\d+)ms$/);
      if (timeMatch) {
        times.push(parseInt(timeMatch[1]));
      }
    });

    if (times.length === 0) return null;

    times.sort((a, b) => a - b);
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const median = times[Math.floor(times.length / 2)];

    return {
      count: times.length,
      min: times[0],
      max: times[times.length - 1],
      average: Math.round(avg * 100) / 100,
      median: median,
      percentile95: times[Math.floor(times.length * 0.95)],
    };
  },
};

module.exports = {
  customLogger,
  errorLogger,
  logAnalyzer,
  getClientIP,
  formatDate,
};
