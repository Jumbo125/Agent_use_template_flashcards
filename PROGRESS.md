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
- Feature 6 "User-Infos": Endpunkte `GET /api/user-info` und `POST /api/user-info` (beide nur für
  eingeloggte User) + neuer Accordion-Bereich im Frontend mit Formular für Username, Name und
  (optionales) neues Passwort, sowie Anzeige des zuletzt gespeicherten Login-Zeitstempels
  (lesbar formatiert mit `toLocaleString`); der Login-Zeitstempel wird bei jedem erfolgreichen
  Login in `users.json` aktualisiert und atomar geschrieben
- Feature 8 "Oberflächenstruktur": Header enthält jetzt nur noch den Titel; Login- und
  Impressum-Button sind in einen neuen Footer gewandert (`btn-info` / `btn-warning`, beide als
  Bootstrap-Modal ohne Seitenwechsel); neues Impressum-Modal mit Platzhaltertext ergänzt;
  vierter Accordion-Bereich "Feedback" (Farbe `bg-light`) als Platzhalter ergänzt, damit alle
  vier im Spec genannten Bereiche (Suche, Hinzufügen, User-Infos, Feedback) existieren
- Feature 7 "Feedback": Endpunkt `POST /api/feedback` (ohne Login nutzbar, Pflichtfelder Name und
  Nachricht) + atomares Schreiben in neue Datei `data/feedback.json`; echtes Formular im
  bestehenden Feedback-Accordion-Bereich ersetzt den Platzhaltertext, zeigt nach dem Absenden
  eine Erfolgsmeldung und setzt das Formular zurück

## Next

- Bearbeiten-Funktion für bestehende Einträge (aktuell nur Platzhalter auf der Detailseite)
- Echte Inhalte für das Impressum-Modal

## Decisions & notes

- Beschreibung aktuell als einfaches Textarea (kein TinyMCE), um Abhängigkeiten minimal zu halten
- Upload-Dateien liegen flach in uploads/ mit Zeitstempel-Prefix im Dateinamen (keine Unterordner)
- Beim Ändern des Usernamens in den User-Infos wird keine Prüfung auf doppelte Usernamen gemacht
  (aktuell existiert ohnehin nur ein Testuser)

## Known problems

- Bearbeiten-Button auf der Detailseite zeigt nur einen Platzhalter-Hinweis ("folgt in einem
  späteren Schritt"); ein echtes Bearbeiten-Formular/Endpunkt existiert noch nicht
- Das Impressum-Modal enthält nur einen Platzhaltertext; echte Kontaktdaten der Station fehlen
  noch