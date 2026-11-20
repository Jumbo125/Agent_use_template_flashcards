# Spezifikation: Vokabel-Flashcards

## Ziel

Die Webanwendung ermöglicht es Benutzerinnen und Benutzern, Vokabel-Flashcards zu testen.

- Wird eine Karte gewusst, kommt sie auf den rechten Stapel.
- Wird eine Karte nicht gewusst, kommt sie auf den linken Stapel.

## Benutzer

- Die Anwendung unterstützt mehrere Benutzer.
- Jeder Benutzer wird über Benutzername und Passwort identifiziert.

## Funktionen

1. Die Pairings müssen zuvor via formular eingebgen und gespeichert werden können. Dabei muss auf bereitsvorhandensein geachtet werden und es muss auch einen edit button geben, um alle Pairings nachträglich bearbeiten zu können. Mehrere passende Wörter (Snyonyme) werden mit Semilikon getrennt und in der json verschachtelt gepsiechert.
2. Bootstrap und Bootstrap Icons werden für die Gestaltung verwendet.
3. Die benötigten Framework-Dateien werden lokal bereitgestellt:
   - CSS-Dateien in `assets/css/`
   - JavaScript-Dateien in `assets/js/`
   - Die Dateien können über `curl` oder `winget` heruntergeladen werden.
4. Passwörter werden als SHA-256-Hash gespeichert und niemals im Klartext abgelegt.
5. Ein Benutzer kann nur mit seinem Benutzernamen und seinem korrekten Passwort gelöscht werden.
6. Die Karten besitzen einen Flip-Effekt.
7. Der Benutzer kann genau einen Schritt zurückgehen.
8. Der Flip-Ton ist standardmäßig stummgeschaltet und kann über eine Bedienelement ein- und ausgeschaltet werden.
9. Benutzer- und Fortschrittsdaten werden in JSON-Dateien gespeichert.
10. Der Lernfortschritt wird als Prozentwert angezeigt.
11. Eine JSON-Datei enthält den Benutzernamen und den aktuellen Fortschritt.
12. Beim Start werden die Optionen **New Challenge** und **Resume** angeboten.
13. Nach der Auswahl wird ein Benutzername eingegeben:
    - Bei **New Challenge** wird ein nicht vorhandener Benutzer neu angelegt.
    - Bei einem vorhandenen Benutzer wird kein weiterer Benutzer angelegt.
    - Bei **Resume** wird ein vorhandener Benutzer am gespeicherten Fortschritt fortgesetzt.
14. Wird bei **Resume** ein unbekannter Benutzer eingegeben, wird eine Fehlermeldung mit der Frage angezeigt, ob ein neuer Benutzer angelegt werden soll.
15. Bei Zustimmung werden die vorhandenen Funktionen zum Erstellen eines neuen Challenges und eines neuen Benutzers verwendet.
16. Anzeigetexte werden in HTML durch Platzhalter dargestellt.
17. Eine `int18.js`-Funktion lädt Texte aus Sprachdateien für Sprachen wie Deutsch oder Englisch und speichert sie in einem JavaScript-Objekt.
18. Die Texte sind anschließend über `window.obj.lang` verfügbar, sodass die Sprachdateien nicht bei jeder Verwendung erneut gelesen werden müssen.
19. JSON-Dateien werden atomar geschrieben.
20. Achte auf Responsive-Design


## Akzeptanzkriterien

### Bootstrap und Bootstrap Icons

- Bootstrap und Bootstrap Icons werden lokal geladen.
- Alle erforderlichen Dateien liegen unter `assets/css/` und `assets/js/`.
- Die Anwendung funktioniert vollständig ohne Internetverbindung.

### Passwort

- Passwörter werden ausschließlich als Hash gespeichert.
- Das ursprüngliche Passwort darf in keiner JSON-Datei im Klartext vorhanden sein.

### Benutzer löschen

- Ein Benutzer kann nur gelöscht werden, wenn sowohl Benutzername als auch Passwort korrekt sind.
- Bei falschen Zugangsdaten bleibt der Benutzer erhalten.

### Flip-Effekt

- Der Flip-Effekt funktioniert zuverlässig.
- Der Benutzer kann genau einen Schritt zurückgehen.

### Flip-Sound

- Der Ton ist beim ersten Start standardmäßig deaktiviert.
- Der Benutzer kann den Ton aktivieren und wieder deaktivieren.

### JSON-Speicherung

- Benutzerinformationen und Fortschritte werden in JSON-Dateien gespeichert.
- Die Daten können nach einem Neustart der Anwendung geladen werden.

### Fortschrittsanzeige

- Der Fortschritt wird als Prozentwert zwischen 0 % und 100 % angezeigt.
- Nach jedem abgeschlossenen Schritt wird die Anzeige aktualisiert.

### New Challenge

- Beim Start einer neuen Challenge kann ein Benutzername eingegeben werden.
- Ist der Benutzer noch nicht vorhanden, wird ein neuer Benutzer mit 0 % Fortschritt erstellt.
- Ein vorhandener Benutzer wird nicht doppelt angelegt.

### Resume

- Nach Auswahl von **Resume** wird ein vorhandener Benutzer am zuletzt gespeicherten Fortschritt fortgesetzt.

### Unbekannter Benutzer

- Wird bei **Resume** ein unbekannter Benutzer eingegeben, erscheint eine Fehlermeldung.
- Die Anwendung fragt, ob ein neuer Benutzer erstellt werden soll.
- Bei Zustimmung werden die vorhandenen Funktionen für **New Challenge** und **New User** wiederverwendet.

### Datenkonsistenz

- Nach einem Neustart bleiben alle gespeicherten Benutzer und Fortschritte unverändert erhalten.
- JSON-Dateien werden vollständig und atomar aktualisiert.

## Nicht enthalten

- Keine Datenbank wie SQL, NoSQL oder SQLite.
- Keine Datenbankverbindung oder ORM.
- Ausschließlich lokale JSON-Dateien für die dauerhafte Datenspeicherung.

## Erscheinungsbild

- Modernes, übersichtliches und minimalistisches Design.
- Bootstrap 5 und Bootstrap Icons.
- Responsives Layout für Desktop, Tablet und Smartphone.
- Mobile-First-Ansatz.
- Flüssige Animationen und Übergänge, insbesondere beim Flip-Effekt.
- Zentrierte Inhalte mit klarer Navigation und intuitiver Bedienung.
- Moderne Karten mit abgerundeten Ecken und dezenten Schatten.
- Einheitliche Farben, Abstände und Schriftarten.
- Animierte Fortschrittsanzeige mit dem aktuellen Wert in Prozent.
- Klare visuelle Rückmeldungen bei Erfolgen, Fehlern und Benutzeraktionen.
- Keine unnötigen Bedienelemente oder visuelle Überladung.
- Ein einheitliches Design in allen Ansichten.