let pairings = loadPairings();
let users = loadUsers();
let practiceIndex = 0;
let soundEnabled = false;
let practiceHistory = [];

// Lädt die gespeicherten Pairings aus dem lokalen Speicher.
function loadPairings() {
    const savedPairings = localStorage.getItem("vocabPairings");

    if (savedPairings === null) {
        return [];
    }

    return JSON.parse(savedPairings);
}

// Lädt alle Benutzer aus dem lokalen Speicher.
function loadUsers() {
    const savedUsers = localStorage.getItem("vocabUsers");

    if (savedUsers === null) {
        return [];
    }

    return JSON.parse(savedUsers);
}

// Berechnet den SHA-256-Hash eines Passworts.
async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const hashData = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hashData))
        .map(function (byte) {
            return byte.toString(16).padStart(2, "0");
        })
        .join("");
}

// Speichert alle Pairings als JSON im lokalen Speicher.
function savePairings() {
    const jsonData = JSON.stringify(pairings, null, 2);
    localStorage.setItem("vocabPairings", jsonData);
}

// Speichert die Benutzerliste als JSON im lokalen Speicher.
function saveUsers() {
    localStorage.setItem("vocabUsers", JSON.stringify(users, null, 2));
}

// Trennt eingegebene Synonyme am Semikolon und entfernt Leerzeichen.
function getSynonyms() {
    const synonymInput = document.getElementById("synonyms");
    const synonymText = synonymInput.value;
    const synonyms = synonymText.split(";");

    return synonyms
        .map(function (word) {
            return word.trim();
        })
        .filter(function (word) {
            return word !== "";
        });
}

// Prüft, ob ein Hauptwort oder ein Synonym bereits vorhanden ist.
function pairingExists(mainWord, synonyms) {
    for (let pairingIndex = 0; pairingIndex < pairings.length; pairingIndex++) {
        const pairing = pairings[pairingIndex];
        const editIndex = Number(document.getElementById("pairing-index").value);

        if (pairingIndex === editIndex) {
            continue;
        }

        if (pairing.mainWord.toLowerCase() === mainWord.toLowerCase()) {
            return true;
        }

        for (let synonymIndex = 0; synonymIndex < synonyms.length; synonymIndex++) {
            if (pairing.synonyms.includes(synonyms[synonymIndex])) {
                return true;
            }
        }
    }

    return false;
}

// Speichert ein neues Pairing oder aktualisiert ein bestehendes Pairing.
function savePairing(event) {
    event.preventDefault();

    const mainWordInput = document.getElementById("main-word");
    const editIndex = Number(document.getElementById("pairing-index").value);
    const mainWord = mainWordInput.value.trim();
    const synonyms = getSynonyms();
    const message = document.getElementById("message");

    if (mainWord === "" || synonyms.length === 0) {
        message.textContent = "Bitte Hauptwort und mindestens ein Synonym eingeben.";
        return;
    }

    if (pairingExists(mainWord, synonyms)) {
        message.textContent = "Dieses Pairing oder eines seiner Wörter ist bereits vorhanden.";
        return;
    }

    const pairing = {
        mainWord: mainWord,
        synonyms: synonyms
    };

    if (editIndex >= 0) {
        pairings[editIndex] = pairing;
        message.textContent = "Pairing wurde aktualisiert.";
    } else {
        pairings.push(pairing);
        message.textContent = "Pairing wurde gespeichert.";
    }

    savePairings();
    resetForm();
    showPairings();
}

// Setzt das Formular nach dem Speichern wieder zurück.
function resetForm() {
    document.getElementById("pairing-form").reset();
    document.getElementById("pairing-index").value = "-1";
    document.getElementById("save-button").textContent = "Pairing speichern";
}

// Füllt das Formular mit einem vorhandenen Pairing zum Bearbeiten.
function editPairing(index) {
    const pairing = pairings[index];

    document.getElementById("main-word").value = pairing.mainWord;
    document.getElementById("synonyms").value = pairing.synonyms.join("; ");
    document.getElementById("pairing-index").value = index;
    document.getElementById("save-button").textContent = "Änderungen speichern";
}

// Erstellt eine Kartenansicht für ein gespeichertes Pairing.
function createPairingCard(pairing, index) {
    const card = document.createElement("div");
    const text = document.createElement("div");
    const editButton = document.createElement("button");

    card.className = "pairing-card";
    text.textContent = pairing.mainWord + " → " + pairing.synonyms.join("; ");
    editButton.className = "edit-button btn btn-success btn-sm";
    editButton.innerHTML = '<i class="bi bi-pencil me-1"></i>Bearbeiten';
    editButton.type = "button";
    editButton.addEventListener("click", function () {
        editPairing(index);
    });

    card.appendChild(text);
    card.appendChild(editButton);
    return card;
}

// Zeigt alle gespeicherten Pairings auf der Seite an.
function showPairings() {
    const pairingList = document.getElementById("pairing-list");
    pairingList.innerHTML = "";

    for (let index = 0; index < pairings.length; index++) {
        const card = createPairingCard(pairings[index], index);
        pairingList.appendChild(card);
    }
}

// Erstellt einen neuen Benutzer mit gehashtem Passwort.
async function createUser(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("user-message");
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === "" || password === "") {
        message.textContent = "Bitte Benutzername und Passwort eingeben.";
        return;
    }

    if (findUser(username) !== -1) {
        message.textContent = "Dieser Benutzername existiert bereits.";
        return;
    }

    const passwordHash = await hashPassword(password);
    users.push({ username: username, passwordHash: passwordHash, progress: 0 });
    saveUsers();
    document.getElementById("user-form").reset();
    message.textContent = "Benutzer wurde erstellt.";
}

// Sucht einen Benutzer anhand seines Namens.
function findUser(username) {
    for (let index = 0; index < users.length; index++) {
        if (users[index].username.toLowerCase() === username.toLowerCase()) {
            return index;
        }
    }

    return -1;
}

// Löscht einen Benutzer nach erfolgreicher Passwortprüfung.
async function deleteUser(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("delete-username");
    const passwordInput = document.getElementById("delete-password");
    const message = document.getElementById("user-message");
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const userIndex = findUser(username);

    if (userIndex === -1) {
        message.textContent = "Benutzer existiert nicht.";
        return;
    }

    const passwordHash = await hashPassword(password);

    if (users[userIndex].passwordHash !== passwordHash) {
        message.textContent = "Passwort ist falsch.";
        return;
    }

    users.splice(userIndex, 1);
    saveUsers();
    document.getElementById("delete-user-form").reset();
    message.textContent = "Benutzer wurde gelöscht.";
}

// Wechselt zwischen der Pairing-, Benutzer- und Übungsansicht.
function showSection(sectionName) {
    const pairingsSection = document.getElementById("pairings-section");
    const usersSection = document.getElementById("users-section");
    const practiceSection = document.getElementById("practice-section");
    const pairingsButton = document.getElementById("show-pairings-button");
    const usersButton = document.getElementById("show-users-button");
    const practiceButton = document.getElementById("show-practice-button");

    pairingsSection.classList.add("d-none");
    usersSection.classList.add("d-none");
    practiceSection.classList.add("d-none");
    pairingsButton.className = "btn btn-outline-primary";
    usersButton.className = "btn btn-outline-primary";
    practiceButton.className = "btn btn-outline-primary";

    if (sectionName === "pairings") {
        pairingsSection.classList.remove("d-none");
        pairingsButton.className = "btn btn-primary";
    }

    if (sectionName === "users") {
        usersSection.classList.remove("d-none");
        usersButton.className = "btn btn-primary";
    }

    if (sectionName === "practice") {
        practiceSection.classList.remove("d-none");
        practiceButton.className = "btn btn-primary";
        showPracticeUsers();
    }
}

// Aktualisiert die Auswahl der Benutzer für die Übungsansicht.
function showPracticeUsers() {
    const select = document.getElementById("practice-username");
    select.innerHTML = "";

    if (users.length === 0) {
        const option = document.createElement("option");
        option.textContent = "Bitte zuerst einen Benutzer erstellen";
        select.appendChild(option);
        return;
    }

    for (let index = 0; index < users.length; index++) {
        const option = document.createElement("option");
        option.value = users[index].username;
        option.textContent = users[index].username;
        select.appendChild(option);
    }

    showPracticeCard();
}

// Zeigt die aktuelle Karte oder eine Abschlussmeldung.
function showPracticeCard() {
    const front = document.getElementById("flashcard-front");
    const back = document.getElementById("flashcard-back");
    const card = document.getElementById("flashcard");
    const message = document.getElementById("practice-message");

    card.classList.remove("is-flipped");

    if (pairings.length === 0) {
        front.textContent = "Keine Karte vorhanden";
        back.textContent = "Bitte zuerst Pairings erstellen";
        message.textContent = "Es sind keine Vokabeln verfügbar.";
        return;
    }

    if (practiceIndex >= pairings.length) {
        front.textContent = "Challenge beendet";
        back.textContent = "Gut gemacht!";
        message.textContent = "Alle Karten wurden bearbeitet.";
        return;
    }

    front.textContent = pairings[practiceIndex].mainWord;
    back.textContent = pairings[practiceIndex].synonyms.join("; ");
    message.textContent = "Karte " + (practiceIndex + 1) + " von " + pairings.length;
}

// Dreht die Karte um und spielt bei Bedarf einen kurzen Ton.
function flipCard() {
    const card = document.getElementById("flashcard");
    card.classList.toggle("is-flipped");

    if (soundEnabled) {
        playFlipSound();
    }
}

// Gibt einen einfachen lokalen Ton beim Flip aus.
function playFlipSound() {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = 440;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
}

// Schaltet den Flip-Ton ein oder aus.
function toggleSound() {
    soundEnabled = !soundEnabled;

    document.getElementById("sound-icon").className = soundEnabled
        ? "bi bi-volume-up me-1"
        : "bi bi-volume-mute me-1";
    document.getElementById("sound-text").textContent = soundEnabled
        ? "Ton an"
        : "Ton aus";
}

// Speichert den Fortschritt des ausgewählten Benutzers.
function updateProgress() {
    const select = document.getElementById("practice-username");
    const username = select.value;
    let progress = 0;

    if (pairings.length > 0) {
        progress = Math.round((practiceIndex / pairings.length) * 100);
    }

    if (progress > 100) {
        progress = 100;
    }

    const userIndex = findUser(username);
    if (userIndex !== -1) {
        users[userIndex].progress = progress;
        saveUsers();
    }

    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = progress + "%";
    progressBar.textContent = progress + "%";
}

// Bewertet die aktuelle Karte als gewusst oder nicht gewusst.
function answerCard(answerType) {
    if (pairings.length === 0 || practiceIndex >= pairings.length) {
        return;
    }

    const history = {
        index: practiceIndex,
        answerType: answerType
    };
    practiceHistory.push(history);
    practiceIndex++;

    document.getElementById("back-button").disabled = false;
    updateProgress();
    showPracticeCard();
}

// Macht genau einen Bewertungs-Schritt rückgängig.
function goBackOneStep() {
    if (practiceHistory.length === 0) {
        return;
    }

    practiceHistory.pop();
    practiceIndex--;

    if (practiceIndex < 0) {
        practiceIndex = 0;
    }

    document.getElementById("back-button").disabled = practiceHistory.length === 0;
    updateProgress();
    showPracticeCard();
}

// Lädt den gespeicherten Fortschritt des ausgewählten Benutzers.
function loadSelectedProgress() {
    const select = document.getElementById("practice-username");
    const userIndex = findUser(select.value);

    if (userIndex === -1) {
        return;
    }

    let progress = users[userIndex].progress;

    if (progress === undefined) {
        progress = 0;
    }

    practiceIndex = 0;

    if (pairings.length > 0) {
        practiceIndex = Math.round((progress / 100) * pairings.length);
    }

    practiceHistory = [];
    document.getElementById("back-button").disabled = true;
    updateProgress();
    showPracticeCard();
}

const pairingForm = document.getElementById("pairing-form");
const userForm = document.getElementById("user-form");
const deleteUserForm = document.getElementById("delete-user-form");
const pairingsButton = document.getElementById("show-pairings-button");
const usersButton = document.getElementById("show-users-button");
const practiceButton = document.getElementById("show-practice-button");
const flashcard = document.getElementById("flashcard");
const soundButton = document.getElementById("sound-button");
const backButton = document.getElementById("back-button");
const knownButton = document.getElementById("known-button");
const unknownButton = document.getElementById("unknown-button");
const practiceUsername = document.getElementById("practice-username");
pairingForm.addEventListener("submit", savePairing);
userForm.addEventListener("submit", createUser);
deleteUserForm.addEventListener("submit", deleteUser);
pairingsButton.addEventListener("click", function () {
    showSection("pairings");
});
usersButton.addEventListener("click", function () {
    showSection("users");
});
practiceButton.addEventListener("click", function () {
    showSection("practice");
});
flashcard.addEventListener("click", flipCard);
soundButton.addEventListener("click", toggleSound);
backButton.addEventListener("click", goBackOneStep);
knownButton.addEventListener("click", function () {
    answerCard("known");
});
unknownButton.addEventListener("click", function () {
    answerCard("unknown");
});
practiceUsername.addEventListener("change", loadSelectedProgress);
showPairings();
showPracticeUsers();
