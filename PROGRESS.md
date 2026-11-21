# Progress

## Done

- Planung der Abläufe (Login, Eintrag anlegen, Suche, Detailseite, Feedback)
- Skizzierung der Web-UI-Fenster mit Stift und Papier
- AGENTS.md angepasst (Node.js/Express-Backend, Bootstrap-Frontend)
- SPEC.md angepasst (Features, Acceptance Criteria, Out of Scope aus der Projektidee übernommen)
- Login-Modal mit Session (inkl. "Angemeldet bleiben") umgesetzt
- Feature 2 "Eintrag hinzufügen": Endpunkt `POST /api/entries` (mit Video-/Anhang-Upload via multer,
  atomarem Schreiben in data/entries.json) + Formular im Frontend, nur sichtbar für eingeloggte User
- Feature 3 "Suche": Endpunkt `GET /api/entries/search?q=...` (ab 4 Zeichen) + Such-Bereich im Accordion
  mit scrollbarer Trefferliste; Treffer-Titel verlinkt auf `/entry.html?id=...` (Detailseite folgt),
  roter Edit-Button nur für eingeloggte User sichtbar
- Feature 4 "Detailseite": Endpunkt `GET /api/entries/:id` + eigene Seite `public/entry.html` mit
  eigener URL, zeigt Video, Beschreibung, Autor, Anhänge-Liste und QR-Code (QRCode.js) zu dieser Seite;
  roter Bearbeiten-Button nur sichtbar, wenn eine Session besteht
- Feature 5 "QR-Code nach dem Speichern": nach erfolgreichem Speichern eines Eintrags zeigt das
  Formular "Eintrag hinzufügen" direkt den Link zur neuen Detailseite und einen QR-Code dazu
  (QRCode.js), ohne Reload der Seite

## Next

- Feature 6: User-Infos (Username, Name, Passwort ändern, Login-Zeitstempel)
- Feature 7: Feedback-Formular

## Decisions & notes

- Beschreibung aktuell als einfaches Textarea (kein TinyMCE), um Abhängigkeiten minimal zu halten
- Upload-Dateien liegen flach in uploads/ mit Zeitstempel-Prefix im Dateinamen (keine Unterordner)

## Known problems

- Bearbeiten-Button auf der Detailseite zeigt nur einen Platzhalter-Hinweis ("folgt in einem
  späteren Schritt"); ein echtes Bearbeiten-Formular/Endpunkt existiert noch nicht