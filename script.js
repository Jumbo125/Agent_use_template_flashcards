const xpThresholds = [
  [25, 50, 75, 100], [50, 100, 150, 200], [75, 150, 225, 400],
  [125, 250, 375, 500], [250, 500, 750, 1100], [300, 600, 900, 1400],
  [350, 750, 1100, 1700], [450, 900, 1400, 2100], [550, 1100, 1600, 2400],
  [600, 1200, 1900, 2800], [800, 1600, 2400, 3600], [1000, 2000, 3000, 4500],
  [1100, 2200, 3400, 5100], [1250, 2500, 3800, 5700], [1400, 2800, 4300, 6400],
  [1600, 3200, 4800, 7200], [2000, 3900, 5900, 8800], [2100, 4200, 6300, 9500],
  [2400, 4900, 7300, 10900], [2800, 5700, 8500, 12700]
];

const difficultyIndexes = { easy: 0, medium: 1, hard: 2, deadly: 3 };
const form = document.querySelector("#encounter-form");
const generateButton = document.querySelector("#generate-button");
const resultPlaceholder = document.querySelector("#result-placeholder");
const encounterResult = document.querySelector("#encounter-result");
let monsters = [];
let previousEncounter = "";

// Liest eine CSV-Zeile und erstellt daraus ein Monster-Objekt.
function createMonster(line) {
  const values = line.split(",");
  return {
    name: values[0],
    cr: values[1],
    xp: Number(values[2]),
    type: values[3],
    environments: values[4].split(";")
  };
}

// Lädt die Monsterdaten beim Öffnen der Seite.
function loadMonsters() {
  fetch("monsters.csv")
    .then(function (response) {
      if (!response.ok) throw new Error("CSV konnte nicht geladen werden.");
      return response.text();
    })
    .then(prepareMonsters)
    .catch(showLoadingError);
}

// Wandelt den CSV-Text in eine nutzbare Monsterliste um.
function prepareMonsters(csvText) {
  const lines = csvText.trim().split("\n");
  monsters = [];
  for (let index = 1; index < lines.length; index++) {
    monsters.push(createMonster(lines[index].trim()));
  }
  generateButton.disabled = false;
  generateButton.textContent = "Begegnung vorschlagen!";
}

// Zeigt einen verständlichen Fehler beim Laden der CSV-Datei.
function showLoadingError() {
  resultPlaceholder.classList.add("error");
  resultPlaceholder.textContent = "Die Monsterdaten konnten nicht geladen werden. Starte die Seite über einen lokalen Webserver.";
  generateButton.textContent = "Monsterdaten fehlen";
}

// Gibt alle im Formular ausgewählten Umgebungen zurück.
function getSelectedEnvironments() {
  const checkedBoxes = document.querySelectorAll('input[name="environment"]:checked');
  const environments = [];
  for (const box of checkedBoxes) environments.push(box.value);
  return environments;
}

// Berechnet das XP-Budget aus Stufe, Spielerzahl und Schwierigkeit.
function calculateBudget(playerCount, groupLevel, difficulty) {
  const difficultyIndex = difficultyIndexes[difficulty];
  const xpPerPlayer = xpThresholds[groupLevel - 1][difficultyIndex];
  return xpPerPlayer * playerCount;
}

// Prüft, ob ein Monster in einer ausgewählten Umgebung vorkommt.
function hasMatchingEnvironment(monster, selectedEnvironments) {
  for (const environment of selectedEnvironments) {
    if (monster.environments.includes(environment)) return true;
  }
  return false;
}

// Filtert die Monsterliste nach den gewählten Umgebungen.
function filterMonsters(selectedEnvironments) {
  const filteredMonsters = [];
  for (const monster of monsters) {
    if (hasMatchingEnvironment(monster, selectedEnvironments)) filteredMonsters.push(monster);
  }
  return filteredMonsters;
}

// Wählt einen zufälligen Eintrag aus einer Liste aus.
function getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

// Gibt Monster zurück, die noch in das offene Budget passen.
function getAffordableMonsters(availableMonsters, remainingBudget) {
  const affordableMonsters = [];
  for (const monster of availableMonsters) {
    if (monster.xp <= remainingBudget) affordableMonsters.push(monster);
  }
  return affordableMonsters;
}

// Erstellt eine zufällige Begegnung, die möglichst nah am Budget liegt.
function createEncounter(availableMonsters, budget) {
  const encounter = [];
  let totalXp = 0;
  while (totalXp < budget * 0.9 && encounter.length < 30) {
    const affordable = getAffordableMonsters(availableMonsters, budget - totalXp);
    if (affordable.length === 0) break;
    const monster = getRandomItem(affordable);
    encounter.push(monster);
    totalXp += monster.xp;
  }
  if (encounter.length === 0) encounter.push(getCheapestMonster(availableMonsters));
  return encounter;
}

// Findet das Monster mit dem niedrigsten XP-Wert.
function getCheapestMonster(availableMonsters) {
  let cheapestMonster = availableMonsters[0];
  for (const monster of availableMonsters) {
    if (monster.xp < cheapestMonster.xp) cheapestMonster = monster;
  }
  return cheapestMonster;
}

// Fasst gleiche Monster für die Ausgabe in einer Tabellenzeile zusammen.
function groupEncounter(encounter) {
  const groups = [];
  for (const monster of encounter) {
    const group = groups.find(function (item) { return item.name === monster.name; });
    if (group) group.count += 1;
    else groups.push({ name: monster.name, cr: monster.cr, xp: monster.xp, count: 1 });
  }
  return groups;
}

// Berechnet die gesamten XP einer Begegnung.
function getTotalXp(encounter) {
  let totalXp = 0;
  for (const monster of encounter) totalXp += monster.xp;
  return totalXp;
}

// Bestimmt anhand der Budgetüberschreitung die Balkenfarbe.
function getBudgetColor(totalXp, budget) {
  if (totalXp <= budget) return "green";
  if (totalXp <= budget * 1.1) return "yellow";
  return "red";
}

// Erstellt die Tabellenzeile und den Mini-Balken für eine Monstergruppe.
function createTableRow(group, budget) {
  const row = document.createElement("tr");
  const groupXp = group.xp * group.count;
  const width = Math.min((groupXp / budget) * 100, 100);
  row.innerHTML = `<td>${group.name}</td><td>${group.count}</td><td>${group.cr}</td>
    <td><div class="mini-bar" title="${groupXp} XP"><div class="mini-fill" style="width: ${width}%"></div></div></td>`;
  return row;
}

// Füllt die Gegnertabelle mit der aktuellen Begegnung.
function displayTable(encounter, budget) {
  const tableBody = document.querySelector("#encounter-table");
  tableBody.innerHTML = "";
  const groups = groupEncounter(encounter);
  for (const group of groups) tableBody.appendChild(createTableRow(group, budget));
}

// Zeigt Balken, Summen und Tabelle für den neuen Vorschlag an.
function displayEncounter(encounter, budget) {
  const totalXp = getTotalXp(encounter);
  const percentage = Math.min((totalXp / budget) * 100, 100);
  const budgetFill = document.querySelector("#budget-fill");
  document.querySelector("#budget-text").textContent = `XP-Budget: ${budget} XP | Begegnung: ${totalXp} XP`;
  document.querySelector("#total-text").textContent = `Gesamt-XP: ${totalXp} von ${budget}`;
  budgetFill.style.width = percentage + "%";
  budgetFill.className = "budget-fill " + getBudgetColor(totalXp, budget);
  displayTable(encounter, budget);
  resultPlaceholder.hidden = true;
  encounterResult.hidden = false;
}

// Zeigt eine Meldung anstelle einer leeren Begegnung an.
function showMessage(message) {
  encounterResult.hidden = true;
  resultPlaceholder.hidden = false;
  resultPlaceholder.classList.add("error");
  resultPlaceholder.textContent = message;
}

// Erstellt für identische Einstellungen möglichst einen neuen Vorschlag.
function createDifferentEncounter(availableMonsters, budget) {
  let encounter = createEncounter(availableMonsters, budget);
  let signature = encounter.map(function (monster) { return monster.name; }).sort().join("|");
  for (let attempt = 0; attempt < 5 && signature === previousEncounter; attempt++) {
    encounter = createEncounter(availableMonsters, budget);
    signature = encounter.map(function (monster) { return monster.name; }).sort().join("|");
  }
  previousEncounter = signature;
  return encounter;
}

// Verarbeitet das Formular und erzeugt einen neuen Begegnungsvorschlag.
function handleFormSubmit(event) {
  event.preventDefault();
  const environments = getSelectedEnvironments();
  if (environments.length === 0) {
    showMessage("Bitte wähle mindestens eine Umgebung aus.");
    return;
  }
  const availableMonsters = filterMonsters(environments);
  if (availableMonsters.length === 0) {
    showMessage("Für diese Umgebung wurden keine passenden Monster gefunden.");
    return;
  }
  const players = Number(document.querySelector("#player-count").value);
  const level = Number(document.querySelector("#group-level").value);
  const difficulty = document.querySelector("#difficulty").value;
  const budget = calculateBudget(players, level, difficulty);
  displayEncounter(createDifferentEncounter(availableMonsters, budget), budget);
}

form.addEventListener("submit", handleFormSubmit);
loadMonsters();
