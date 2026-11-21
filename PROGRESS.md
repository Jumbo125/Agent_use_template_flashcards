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

## Next

- Feature 4: Detailseite (entry.html) mit Video, Beschreibung, Anhängen und QR-Code
- Feature 5: QR-Code-Anzeige direkt nach dem Speichern eines neuen Eintrags
- Feature 6: User-Infos (Username, Name, Passwort ändern, Login-Zeitstempel)
- Feature 7: Feedback-Formular

## Decisions & notes

- Beschreibung aktuell als einfaches Textarea (kein TinyMCE), um Abhängigkeiten minimal zu halten
- Upload-Dateien liegen flach in uploads/ mit Zeitstempel-Prefix im Dateinamen (keine Unterordner)

## Known problems

- Edit-Button in der Suche verlinkt bereits auf `/entry.html?id=...&edit=1`, diese Seite existiert
  noch nicht (kommt mit Feature 4)