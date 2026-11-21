// server.js - Express-Server für "TikTok für Stationen"
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8051;
const USERS_FILE = path.join(__dirname, "data", "users.json");
const ENTRIES_FILE = path.join(__dirname, "data", "entries.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(UPLOADS_DIR));

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

// Liest die Liste der Einträge aus der entries.json-Datei.
function readEntries() {
  const content = fs.readFileSync(ENTRIES_FILE, "utf8");
  return JSON.parse(content);
}

// Schreibt die Einträge atomar: erst in eine Temp-Datei, dann umbenennen,
// damit bei einem Absturz während des Schreibens die alte Datei erhalten bleibt.
function writeEntriesAtomic(entries) {
  const tempFile = ENTRIES_FILE + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(entries, null, 2));
  fs.renameSync(tempFile, ENTRIES_FILE);
}

// Schreibt die Benutzerliste atomar: erst in eine Temp-Datei, dann umbenennen.
function writeUsersAtomic(users) {
  const tempFile = USERS_FILE + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(users, null, 2));
  fs.renameSync(tempFile, USERS_FILE);
}

// Lässt nur eingeloggte User weitermachen, sonst Fehler 401.
function requireLogin(req, res, next) {
  if (!req.session.username) {
    res.status(401).json({ error: "Bitte zuerst einloggen." });
    return;
  }
  next();
}

// Speichert hochgeladene Dateien im uploads-Ordner mit eindeutigem Dateinamen.
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, callback) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      callback(null, uniqueName);
    },
  }),
});

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

  user.lastLogin = new Date().toISOString();
  writeUsersAtomic(users);

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

// Gibt Username, Name und letzten Login des eingeloggten Users zurück.
app.get("/api/user-info", requireLogin, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.username === req.session.username);
  res.json({ username: user.username, name: user.name, lastLogin: user.lastLogin || null });
});

// Ändert Username, Name und/oder Passwort des eingeloggten Users.
app.post("/api/user-info", requireLogin, (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name) {
    res.status(400).json({ error: "Benutzername und Name sind Pflichtfelder." });
    return;
  }

  const users = readUsers();
  const user = users.find((u) => u.username === req.session.username);

  user.username = username;
  user.name = name;
  if (password) {
    user.passwordHash = hashPassword(password);
  }

  writeUsersAtomic(users);

  req.session.username = user.username;
  req.session.name = user.name;

  res.json({ username: user.username, name: user.name, lastLogin: user.lastLogin || null });
});

// Sucht Einträge, deren Titel den Suchbegriff enthält (ohne Groß-/Kleinschreibung).
app.get("/api/entries/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase();
  if (query.length < 4) {
    res.json([]);
    return;
  }

  const entries = readEntries();
  const matches = entries.filter((entry) => entry.title.toLowerCase().includes(query));
  res.json(matches);
});

// Gibt einen einzelnen Eintrag anhand seiner ID zurück (für die Detailseite).
app.get("/api/entries/:id", (req, res) => {
  const entries = readEntries();
  const entry = entries.find((e) => e.id === req.params.id);

  if (!entry) {
    res.status(404).json({ error: "Eintrag nicht gefunden." });
    return;
  }

  res.json(entry);
});

// Legt einen neuen Eintrag an (nur für eingeloggte User).
app.post(
  "/api/entries",
  requireLogin,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "attachments", maxCount: 10 },
  ]),
  (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.files.video ? req.files.video[0] : null;

    if (!title || !description || !videoFile) {
      res.status(400).json({ error: "Titel, Beschreibung und Video sind Pflichtfelder." });
      return;
    }

    const attachmentFiles = req.files.attachments || [];
    const entry = {
      id: crypto.randomUUID(),
      title,
      description,
      author: req.session.name,
      videoPath: "/uploads/" + videoFile.filename,
      attachments: attachmentFiles.map((file) => "/uploads/" + file.filename),
      createdAt: new Date().toISOString(),
    };

    const entries = readEntries();
    entries.push(entry);
    writeEntriesAtomic(entries);

    res.json(entry);
  }
);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
