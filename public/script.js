// script.js - Login-Logik für die Startseite

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

// Zeigt den Namen des eingeloggten Users neben dem Login-Button an.
function showLoggedInUser(user) {
  const statusSpan = document.getElementById("loginStatus");
  statusSpan.textContent = `Eingeloggt als ${user.name}`;
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

document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit);
checkExistingSession();
