// server.js - Express-Server für "TikTok für Stationen"
const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8051;
const USERS_FILE = path.join(__dirname, "data", "users.json");
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "geheimes-stationen-passwort", // nur für lokale Nutzung im Intranet
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: undefined }, // ohne "Angemeldet bleiben": Cookie endet mit dem Browser
  })
);

// Liest die Liste der Benutzer aus der users.json-Datei.
function readUsers() {
  const content = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(content);
}

// Wandelt ein Passwort in seinen SHA-256-Hash (als Hex-Text) um.
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Prüft Benutzername und Passwort und startet bei Erfolg eine Session.
app.post("/api/login", (req, res) => {
  const { username, password, rememberMe } = req.body;
  const users = readUsers();
  const passwordHash = hashPassword(password);

  const user = users.find(
    (u) => u.username === username && u.passwordHash === passwordHash
  );

  if (!user) {
    res.status(401).json({ error: "Benutzername oder Passwort ist falsch." });
    return;
  }

  if (rememberMe) {
    req.session.cookie.maxAge = THIRTY_DAYS_IN_MS;
  }

  req.session.username = user.username;
  req.session.name = user.name;
  res.json({ username: user.username, name: user.name });
});

// Gibt den aktuell eingeloggten Benutzer zurück, falls eine Session besteht.
app.get("/api/session", (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username, name: req.session.name });
  } else {
    res.json({ username: null });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
