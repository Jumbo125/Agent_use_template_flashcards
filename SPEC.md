# Spec: Gebrauchsanweisung – "TikTok für Stationen" mit QR-Code

## Goal (one or two sentences)

Eine einzige, responsive Webseite für Intensivstation/IMCU/CCU/Anästhesie, auf der kurze Anleitungsvideos zu
Interventionen (z. B. externer Herzschrittmacher, Pleuradrainage, Aszitespunktion, Kardioversion, TEE-Sonde, PDA)
gelistet sind. Jeder Eintrag hat einen eigenen Link mit QR-Code, der am Gerät oder im Stationszimmer aufgehängt
werden kann – Mitarbeitende scannen und bekommen in kurzer Zeit einen groben Überblick, wie bei TikTok über ein
kurzes Anleitungsvideo.

## Users

- **Alle Mitarbeitenden der Station**: können Einträge ansehen und suchen, ohne Login.
- **Eingeloggte User** (Pflege/Ärzte mit Zugang): können zusätzlich Einträge anlegen und bearbeiten, und ihre
  User-Infos einsehen.

## Features (numbered, so prompts can refer to them)

1. **Login** – Modal (Bootstrap) mit Username, Passwort, Checkbox "Angemeldet bleiben". Button `btn btn-sm btn-info`.
2. **Eintrag hinzufügen** (nur eingeloggt) – Titel, Beschreibung (Editor, evtl. TinyMCE), Video-Upload,
   Anhänge-Upload. Autor wird automatisch aus dem eingeloggten User übernommen. Speichern-Button `btn-success`.
3. **Suche** – Suchbegriff, sucht ab mehr als 3 Buchstaben. Ergebnisliste in einem Bereich mit fester Maximalhöhe
   und Scrollbalken. Jeder Treffer: Titel-Button öffnet die Detailseite, daneben ein kleiner Edit-Button
   (`btn btn-sm btn-danger`), nur sichtbar für eingeloggte User.
4. **Detailseite** – eigene Seite mit eigener URL (auch direkt über den QR-Code erreichbar). Zeigt Video,
   Beschreibung der Intervention, Anhänge und den QR-Code zu dieser Seite, dazu einen roten Edit-Button
   (`btn-danger`), nur für eingeloggte User sichtbar.
5. **QR-Code-Erzeugung** – nach dem Speichern eines Eintrags wird der Link zum neuen Eintrag und ein QR-Code dazu
   angezeigt (JS-Library QRCode.js).
6. **User-Infos** (nur eingeloggt) – Username, Name, Passwort ändern. Zeitstempel (z. B. letzter Login) lesbar
   formatiert, nur Anzeige.
7. **Feedback** – Formular mit Name und Nachricht, für alle (auch ohne Login) nutzbar. Absenden-Button `btn-success`.
8. **Oberflächenstruktur** – eine einzige Seite: Header mit Titel, ein Accordion mit vier Bereichen (Suche,
   Hinzufügen, User-Infos, Feedback), Footer mit zwei Buttons (Login `btn-info`, Impressum `btn-warning`, beide
   als Bootstrap-Modal ohne Seitenwechsel).
9. **Speichern** – Einträge, Benutzer und Medien werden über einen Node.js/Express-API-Endpunkt persistiert,
   atomar (erst in Temp-Datei schreiben, dann umbenennen).

## Acceptance criteria (how I know a feature works)

- Login mit korrekten Zugangsdaten setzt eine Session; falsche Zugangsdaten zeigen eine Fehlermeldung, kein Login.
- "Angemeldet bleiben" hält die Session über einen Browser-Neustart hinweg aktiv.
- Ein neuer Eintrag ist nur erstellbar, wenn eingeloggt; Titel, Beschreibung und Video sind Pflichtfelder.
- Nach dem Speichern erscheinen Link und QR-Code zum neuen Eintrag auf der Seite, ohne Reload.
- Die Suche liefert erst ab 4 eingegebenen Zeichen Treffer; Treffer-Titel öffnet die passende Detailseite.
- Der Edit-Button in Suche und Detailseite ist für nicht eingeloggte User unsichtbar, für eingeloggte sichtbar
  und öffnet den Eintrag zum Bearbeiten.
- Die Detailseite ist über eine eigene URL direkt aufrufbar (z. B. durch Scannen des QR-Codes) und zeigt Video,
  Beschreibung, Anhänge und QR-Code.
- User-Infos zeigen den zuletzt gespeicherten Login-Zeitstempel lesbar formatiert an.
- Feedback-Formular zeigt nach dem Absenden eine Erfolgsmeldung.
- Passwörter werden nie im Klartext gespeichert, sondern als SHA-256-Hash in der Benutzer-JSON-Datei.
- Alle Schreibvorgänge (Einträge, Benutzer) sind atomar: bei einem Absturz während des Schreibens bleibt die
  vorherige Datei intakt.

## Out of scope (do NOT build)

- Keine Datenbank (kein MariaDB, kein SQLite) – Speicherung ausschließlich in JSON-Dateien und auf dem Dateisystem.
- Kein PHP-/XAMPP-Backend, kein NGINX – Backend ausschließlich Node.js mit Express.js.
- Keine Mehrbenutzer-Rollen/-Rechte jenseits "eingeloggt" vs. "nicht eingeloggt" (kein Admin, kein Rechte-System).
- Kein öffentlicher Internet-Zugriff vorgesehen – Zugriff nur über localhost oder die IP des PCs im Intranet, Port 8051.

## Look & feel

- HTML, CSS mit Bootstrap, Vanilla JS + Bootstrap JS, Bootstrap Icons.
- Eine responsive Single-Page-Anwendung: Header, Accordion mit vier Bereichen, Footer.
- Login- und Impressum-Modal (Bootstrap), ohne Seitenwechsel.
- Farbcodierung: Speichern-/Suchen-/Absenden-Buttons grün (`btn-success`); Edit-Buttons klein und rot
  (`btn btn-sm btn-danger`), nur für eingeloggte User sichtbar; Login-Button `btn btn-sm btn-info`;
  Impressum-Button `btn btn-sm btn-warning`.
- Detailseite als eigene Seite mit eigener URL, damit der QR-Code direkt dorthin führt.
