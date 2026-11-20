let pairings = loadPairings();

// Lädt die gespeicherten Pairings aus dem lokalen Speicher.
function loadPairings() {
    const savedPairings = localStorage.getItem("vocabPairings");

    if (savedPairings === null) {
        return [];
    }

    return JSON.parse(savedPairings);
}

// Speichert alle Pairings als JSON im lokalen Speicher.
function savePairings() {
    const jsonData = JSON.stringify(pairings, null, 2);
    localStorage.setItem("vocabPairings", jsonData);
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
    editButton.className = "edit-button";
    editButton.textContent = "Bearbeiten";
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

const pairingForm = document.getElementById("pairing-form");
pairingForm.addEventListener("submit", savePairing);
showPairings();
