// script.js - Login-, Eintrags- und Such-Logik für die Startseite

let isLoggedIn = false;

// Schickt die Login-Daten an den Server und zeigt Erfolg oder Fehler an.
async function handleLoginSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  const errorBox = document.getElementById("loginError");

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, rememberMe }),
  });

  const data = await response.json();

  if (!response.ok) {
    errorBox.textContent = data.error;
    return;
  }

  errorBox.textContent = "";
  showLoggedInUser(data);
  closeLoginModal();
}

// Zeigt den Namen des eingeloggten Users neben dem Login-Button an
// und blendet die Bereiche ein, die nur für eingeloggte User gedacht sind.
function showLoggedInUser(user) {
  const statusSpan = document.getElementById("loginStatus");
  statusSpan.textContent = `Eingeloggt als ${user.name}`;
  document.getElementById("addEntrySection").style.display = "block";
  isLoggedIn = true;
}

// Schließt das Login-Modal nach erfolgreichem Login.
function closeLoginModal() {
  const modalElement = document.getElementById("loginModal");
  const modal = bootstrap.Modal.getInstance(modalElement);
  modal.hide();
}

// Fragt beim Laden der Seite den Server, ob bereits eine Session besteht.
async function checkExistingSession() {
  const response = await fetch("/api/session");
  const user = await response.json();
  if (user.username) {
    showLoggedInUser(user);
  }
}

// Schickt den neuen Eintrag (mit Video und Anhängen) an den Server.
async function handleAddEntrySubmit(event) {
  event.preventDefault();

  const title = document.getElementById("entryTitle").value;
  const description = document.getElementById("entryDescription").value;
  const videoFile = document.getElementById("entryVideo").files[0];
  const attachmentFiles = document.getElementById("entryAttachments").files;
  const errorBox = document.getElementById("addEntryError");
  const successBox = document.getElementById("addEntrySuccess");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("video", videoFile);
  for (const file of attachmentFiles) {
    formData.append("attachments", file);
  }

  const response = await fetch("/api/entries", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    successBox.textContent = "";
    errorBox.textContent = data.error;
    return;
  }

  errorBox.textContent = "";
  successBox.textContent = `Eintrag "${data.title}" wurde gespeichert.`;
  document.getElementById("addEntryForm").reset();
}

// Schickt den Suchbegriff an den Server und zeigt die Treffer an.
async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = document.getElementById("searchInput").value;
  const resultsBox = document.getElementById("searchResults");

  if (query.length < 4) {
    resultsBox.innerHTML = '<div class="list-group-item text-muted">Bitte mindestens 4 Zeichen eingeben.</div>';
    return;
  }

  const response = await fetch("/api/entries/search?q=" + encodeURIComponent(query));
  const entries = await response.json();
  renderSearchResults(entries);
}

// Baut die Trefferliste aus den gefundenen Einträgen auf.
function renderSearchResults(entries) {
  const resultsBox = document.getElementById("searchResults");
  resultsBox.innerHTML = "";

  if (entries.length === 0) {
    resultsBox.innerHTML = '<div class="list-group-item text-muted">Keine Treffer.</div>';
    return;
  }

  for (const entry of entries) {
    const row = document.createElement("div");
    row.className = "list-group-item d-flex justify-content-between align-items-center";

    const titleButton = document.createElement("button");
    titleButton.type = "button";
    titleButton.className = "btn btn-link p-0 text-start";
    titleButton.textContent = entry.title;
    titleButton.addEventListener("click", () => {
      window.location.href = "/entry.html?id=" + entry.id;
    });
    row.appendChild(titleButton);

    if (isLoggedIn) {
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-sm btn-danger";
      editButton.textContent = "Bearbeiten";
      editButton.addEventListener("click", () => {
        window.location.href = "/entry.html?id=" + entry.id + "&edit=1";
      });
      row.appendChild(editButton);
    }

    resultsBox.appendChild(row);
  }
}

document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit);
document.getElementById("addEntryForm").addEventListener("submit", handleAddEntrySubmit);
document.getElementById("searchForm").addEventListener("submit", handleSearchSubmit);
checkExistingSession();
