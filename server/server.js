const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = 3000;
const projectDirectory = path.resolve(__dirname, "..");
const publicDirectory = path.join(projectDirectory, "public");
const usersDirectory = path.join(projectDirectory, "data", "User");
const studiesDirectory = path.join(projectDirectory, "data", "Studies");
const sessions = new Map();

app.use(express.json());
app.use("/User", function (request, response) {
  response.sendStatus(404);
});
app.use("/data", function (request, response) {
  response.sendStatus(404);
});
app.use(express.static(publicDirectory));

// Create a simple, safe file name from a title or name.
function makeFileName(value) {
  const fileName = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (fileName === "") {
    return "item";
  }

  return fileName;
}

// Read all JSON files in a directory and return their values.
function readJsonDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(directoryPath)
    .filter(function (fileName) {
      return fileName.endsWith(".json");
    })
    .sort();
  const values = [];

  fileNames.forEach(function (fileName) {
    const filePath = path.join(directoryPath, fileName);
    values.push(JSON.parse(fs.readFileSync(filePath, "utf8")));
  });

  if (directoryPath === studiesDirectory) {
    const categoryOrder = { CED: 0, Liver: 1, Esophagus: 2 };

    values.sort(function (firstStudy, secondStudy) {
      let firstCategory = categoryOrder[firstStudy.category];
      let secondCategory = categoryOrder[secondStudy.category];

      if (firstCategory === undefined) {
        firstCategory = 99;
      }
      if (secondCategory === undefined) {
        secondCategory = 99;
      }

      if (firstCategory !== secondCategory) {
        return firstCategory - secondCategory;
      }

      return firstStudy.title.localeCompare(secondStudy.title);
    });
  }

  return values;
}

// Write one JavaScript value as a formatted JSON file.
function writeJsonFile(filePath, value) {
  const directoryPath = path.dirname(filePath);
  const temporaryPath = path.join(
    directoryPath,
    "." + crypto.randomBytes(8).toString("hex") + ".tmp"
  );

  fs.mkdirSync(directoryPath, { recursive: true });
  try {
    fs.writeFileSync(temporaryPath, JSON.stringify(value, null, 2), "utf8");
    fs.renameSync(temporaryPath, filePath);
  } catch (error) {
    if (fs.existsSync(temporaryPath)) {
      fs.unlinkSync(temporaryPath);
    }
    throw error;
  }
}

// Return the sorted JSON file paths used for study indexes.
function getStudyFilePaths() {
  if (!fs.existsSync(studiesDirectory)) {
    return [];
  }

  const studyFiles = fs.readdirSync(studiesDirectory)
    .filter(function (fileName) {
      return fileName.endsWith(".json");
    })
    .map(function (fileName) {
      const filePath = path.join(studiesDirectory, fileName);
      const study = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return { filePath: filePath, study: study };
    });

  const categoryOrder = { CED: 0, Liver: 1, Esophagus: 2 };
  studyFiles.sort(function (firstFile, secondFile) {
    let firstCategory = categoryOrder[firstFile.study.category];
    let secondCategory = categoryOrder[secondFile.study.category];

    if (firstCategory === undefined) {
      firstCategory = 99;
    }
    if (secondCategory === undefined) {
      secondCategory = 99;
    }

    if (firstCategory !== secondCategory) {
      return firstCategory - secondCategory;
    }

    return firstFile.study.title.localeCompare(secondFile.study.title);
  });

  return studyFiles.map(function (studyFile) {
    return studyFile.filePath;
  });
}

// Check whether the request contains a valid login token.
function isLoggedIn(request) {
  return getSession(request) !== undefined;
}

// Find the current session from the bearer token.
function getSession(request) {
  const authorization = request.headers.authorization || "";
  const token = authorization.replace(/^Bearer\s+/, "");
  return sessions.get(token);
}

// Find the JSON file that stores one user account.
function findUserFile(username) {
  const fileNames = fs.readdirSync(usersDirectory)
    .filter(function (fileName) {
      return fileName.endsWith(".json");
    });

  for (let index = 0; index < fileNames.length; index++) {
    const filePath = path.join(usersDirectory, fileNames[index]);
    const user = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (user.username === username) {
      return filePath;
    }
  }

  return null;
}

// Validate a login against the users JSON file.
app.post("/api/login", function (request, response) {
  const username = request.body.username;
  const passwordHash = request.body.passwordSha256;
  const users = readJsonDirectory(usersDirectory);
  const matchingUser = users.find(function (user) {
    return user.username === username &&
      user.passwordSha256 === passwordHash;
  });

  if (matchingUser === undefined) {
    response.status(401).json({ message: "Invalid username or password." });
    return;
  }

  const token = crypto.randomBytes(24).toString("hex");
  const role = matchingUser.role ||
    (matchingUser.username === "admin" ? "admin" : "user");
  sessions.set(token, { username: matchingUser.username, role: role });
  response.json({
    token: token,
    username: matchingUser.username,
    role: role
  });
});

// Return the current admin account name to an authenticated admin.
app.get("/api/admin/account", function (request, response) {
  const session = getSession(request);

  if (session === undefined || session.role !== "admin") {
    response.status(session === undefined ? 401 : 403)
      .json({ message: "Admin access required." });
    return;
  }

  response.json({ username: session.username });
});

// Update the admin account name and optionally its password hash.
app.put("/api/admin/account", function (request, response) {
  const session = getSession(request);

  if (session === undefined || session.role !== "admin") {
    response.status(session === undefined ? 401 : 403)
      .json({ message: "Admin access required." });
    return;
  }

  const body = request.body || {};
  const username = typeof body.username === "string"
    ? body.username.trim()
    : "";
  const passwordHash = body.passwordSha256;

  if (username === "") {
    response.status(400).json({ message: "Username is required." });
    return;
  }

  if (passwordHash !== undefined && passwordHash !== "" &&
      !/^[a-f0-9]{64}$/i.test(passwordHash)) {
    response.status(400).json({ message: "Invalid password hash." });
    return;
  }

  const users = readJsonDirectory(usersDirectory);
  const duplicateUser = users.find(function (user) {
    return user.username === username && user.username !== session.username;
  });

  if (duplicateUser !== undefined) {
    response.status(409).json({ message: "That username is already in use." });
    return;
  }

  const oldFilePath = findUserFile(session.username);
  if (oldFilePath === null) {
    response.status(404).json({ message: "Admin account not found." });
    return;
  }

  const newFilePath = path.join(
    usersDirectory,
    makeFileName(username) + ".json"
  );
  if (oldFilePath !== newFilePath && fs.existsSync(newFilePath)) {
    response.status(409).json({ message: "That user file already exists." });
    return;
  }

  const oldUser = JSON.parse(fs.readFileSync(oldFilePath, "utf8"));
  const updatedUser = {
    username: username,
    passwordSha256: passwordHash || oldUser.passwordSha256,
    role: "admin"
  };

  writeJsonFile(newFilePath, updatedUser);
  if (oldFilePath !== newFilePath) {
    fs.rmSync(oldFilePath);
  }

  session.username = username;
  response.json({ username: username });
});

// Return all studies.
app.get("/api/studies", function (request, response) {
  response.json(readJsonDirectory(studiesDirectory));
});

// Add a new study when logged in.
app.post("/api/studies", function (request, response) {
  if (!isLoggedIn(request)) {
    response.status(401).json({ message: "Login required." });
    return;
  }

  const fileName = makeFileName(request.body.title) + ".json";
  const filePath = path.join(studiesDirectory, fileName);

  writeJsonFile(filePath, request.body);
  response.status(201).json(request.body);
});

// Update a study by array index when logged in.
app.put("/api/studies/:index", function (request, response) {
  if (!isLoggedIn(request)) {
    response.status(401).json({ message: "Login required." });
    return;
  }

  const studyFiles = getStudyFilePaths();
  const index = Number(request.params.index);

  if (!Number.isInteger(index) || index < 0 || index >= studyFiles.length) {
    response.status(404).json({ message: "Study not found." });
    return;
  }

  const oldFilePath = studyFiles[index];
  const newFileName = makeFileName(request.body.title) + ".json";
  const newFilePath = path.join(studiesDirectory, newFileName);

  writeJsonFile(newFilePath, request.body);
  if (oldFilePath !== newFilePath) {
    fs.rmSync(oldFilePath);
  }
  response.json(request.body);
});

app.listen(port, function () {
  console.log("Clinical Study Finder running at http://localhost:" + port);
});
