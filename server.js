const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = 3000;
const projectDirectory = __dirname;
const usersFile = path.join(projectDirectory, "users.json");
const studiesFile = path.join(projectDirectory, "studies.json");
const sessions = new Map();

app.use(express.json());
app.use(express.static(projectDirectory));

// Read a JSON file and return an empty list if it does not exist.
function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Write a JavaScript value as formatted JSON.
function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

// Check whether the request contains a valid login token.
function isLoggedIn(request) {
  const authorization = request.headers.authorization || "";
  const token = authorization.replace("Bearer ", "");
  return sessions.has(token);
}

// Validate a login against the users JSON file.
app.post("/api/login", function (request, response) {
  const username = request.body.username;
  const passwordHash = request.body.passwordSha256;
  const users = readJsonFile(usersFile);
  const matchingUser = users.find(function (user) {
    return user.username === username &&
      user.passwordSha256 === passwordHash;
  });

  if (matchingUser === undefined) {
    response.status(401).json({ message: "Invalid username or password." });
    return;
  }

  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, matchingUser.username);
  response.json({ token: token, username: matchingUser.username });
});

// Return all studies.
app.get("/api/studies", function (request, response) {
  response.json(readJsonFile(studiesFile));
});

// Add a new study when logged in.
app.post("/api/studies", function (request, response) {
  if (!isLoggedIn(request)) {
    response.status(401).json({ message: "Login required." });
    return;
  }

  const studies = readJsonFile(studiesFile);
  studies.push(request.body);
  writeJsonFile(studiesFile, studies);
  response.status(201).json(request.body);
});

// Update a study by array index when logged in.
app.put("/api/studies/:index", function (request, response) {
  if (!isLoggedIn(request)) {
    response.status(401).json({ message: "Login required." });
    return;
  }

  const studies = readJsonFile(studiesFile);
  const index = Number(request.params.index);

  if (!Number.isInteger(index) || index < 0 || index >= studies.length) {
    response.status(404).json({ message: "Study not found." });
    return;
  }

  studies[index] = request.body;
  writeJsonFile(studiesFile, studies);
  response.json(request.body);
});

app.listen(port, function () {
  console.log("Clinical Study Finder running at http://localhost:" + port);
});
