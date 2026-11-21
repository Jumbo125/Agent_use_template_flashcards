## Step 1 – Login mit Session

### What was new to me

- Eine Session ist ein kleiner Speicher auf dem Server, der sich merkt, wer eingeloggt ist. Der
  Browser bekommt dafür nur ein Cookie mit einer ID, die eigentlichen Daten (Username, Name)
  bleiben auf dem Server.
- Passwörter sollte man nie im Klartext speichern. Stattdessen wird beim Login ein Hash (SHA-256)
  berechnet und nur dieser Hash mit dem gespeicherten Hash verglichen.
- Ein Bootstrap-Modal kann man ganz ohne Seitenwechsel öffnen/schließen (`data-bs-toggle="modal"`),
  das Formular darin funktioniert wie jedes andere Formular.

### New things I did learn

- `express-session` übernimmt das Setzen des Cookies und das Verwalten der Session automatisch.
- Über `cookie.maxAge` lässt sich steuern, ob die Session nach dem Schließen des Browsers endet
  (kein Wert gesetzt) oder länger bestehen bleibt ("Angemeldet bleiben" → 30 Tage).
- `crypto.createHash("sha256")` reicht aus, um ein Passwort sicher genug für dieses lokale Projekt
  zu hashen.

## Step 2 – Eintrag hinzufügen

### What was new to me

- Datei-Uploads (Video, Anhänge) laufen über `multipart/form-data`, nicht über normales JSON. Im
  Frontend braucht man dafür ein `FormData`-Objekt statt `JSON.stringify`.
- "Atomar schreiben" heißt: zuerst in eine Temp-Datei schreiben, dann erst umbenennen. So bleibt
  die alte Datei erhalten, falls der Server genau beim Schreiben abstürzt.
- Ein Endpunkt kann mit einer eigenen Funktion (`requireLogin`) vor unbefugtem Zugriff geschützt
  werden, bevor die eigentliche Logik läuft.

### New things I did learn

- `multer` übernimmt das Entgegennehmen und Speichern von hochgeladenen Dateien und gibt im
  Backend fertige Dateinamen/Pfade zurück (`req.files`).
- `fs.renameSync` ist der Trick für atomares Schreiben: Umbenennen ist auf den meisten Dateisystemen
  eine einzelne, nicht unterbrechbare Operation.
- Mit `crypto.randomUUID()` lässt sich einfach eine eindeutige ID für jeden neuen Eintrag erzeugen.

## Step 3 – Suche

### What was new to me

- Eine Suche muss nicht bei jedem Tastendruck laufen – hier erst ab 4 Zeichen, um unnötige Anfragen
  zu vermeiden.
- Trefferlisten mit fester Höhe und Scrollbalken lassen sich einfach mit CSS (`max-height` +
  `overflow-y: auto`) lösen, ganz ohne JavaScript.
- Buttons, die nur für eingeloggte User sichtbar sein sollen, kann man im Frontend einfach je nach
  Login-Status ein- oder ausblenden (`isLoggedIn`-Variable).

### New things I did learn

- Query-Parameter (`?q=...`) sind der übliche Weg, um Suchbegriffe an einen GET-Endpunkt zu
  schicken; `req.query.q` liest sie im Backend aus.
- `.toLowerCase().includes(...)` reicht für eine einfache, nicht case-sensitive Volltextsuche über
  Titel.
- Elemente, die per JavaScript erzeugt werden (`document.createElement`), lassen sich genauso mit
  `addEventListener` verknüpfen wie Elemente aus dem HTML.

## Step 4 – Detailseite

### What was new to me

- Eine eigene Seite mit eigener URL (`entry.html?id=...`) ist etwas anderes als ein Bereich auf der
  Startseite – sie kann direkt aufgerufen werden, z. B. durch Scannen eines QR-Codes.
- Die ID eines Eintrags lässt sich ganz einfach aus der URL lesen, mit `URLSearchParams`.
- Ein QR-Code ist nichts anderes als eine grafische Darstellung eines Textes (hier: eine URL), die
  eine Kamera-App wieder zurück in Text verwandeln kann.

### New things I did learn

- Mit `:id` in der Express-Route (`/api/entries/:id`) lässt sich ein Teil der URL als Parameter
  auslesen (`req.params.id`).
- `QRCode.js` braucht nur ein leeres `<div>` und erzeugt den QR-Code direkt per JavaScript
  (`new QRCode(element, { text: ..., width: ..., height: ... })`).
- Elemente lassen sich mit `style.display = "none"` bzw. `"block"` ein- und ausblenden, z. B. der
  Bearbeiten-Button je nach Login-Status.

## Step 5 – QR-Code-Anzeige direkt nach dem Speichern

### What was new to me

- Der gleiche QR-Code-Mechanismus (QRCode.js) lässt sich wiederverwenden – nicht nur auf der
  Detailseite, sondern auch direkt nach dem Speichern eines neuen Eintrags auf der Startseite.
- "Ohne Reload" bedeutet: Die Antwort des Servers (`data.id`) wird direkt im JavaScript
  weiterverwendet, um Link und QR-Code einzublenden, statt die Seite neu zu laden.
- Ein zuvor leerer `<div>` lässt sich mit `innerHTML = ""` leeren, bevor ein neuer QR-Code erzeugt
  wird – sonst würden sich bei mehrfachem Speichern mehrere QR-Codes übereinander stapeln.

### New things I did learn

- `window.location.origin` liefert "Protokoll + Host + Port" (z. B. `http://localhost:8051`), damit
  man daraus eine vollständige, klickbare URL zur Detailseite zusammensetzen kann.
- Die Antwort eines POST-Requests (hier: der neu angelegte Eintrag inkl. `id`) kann man direkt
  weiterverwenden, ohne die Daten erneut vom Server abzufragen.
- Gleicher Code (QR-Code erzeugen) lässt sich an zwei Stellen im Projekt einsetzen, ohne dass man
  etwas am Server ändern muss – reine Frontend-Logik.
