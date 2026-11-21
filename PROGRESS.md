# Progress

## Done
- Projekt-Idee festgelegt: D&D Begegnungs-Generator für Spielleiter (siehe Idee-PDF).
- Grundgerüst aus dem Template vorhanden (index.html, style.css, script.js, SPEC.md, AGENTS.md) – noch alle leer.
- Erste Notizen zur dnd5eapi.co in DunD_api.txt (Beispiel-Request), aber noch nicht genutzt.

## Next
- SPEC.md ausfüllen (Goal, Users, Features, Akzeptanzkriterien, Out of scope, Look & feel) basierend auf der Idee-PDF.
- Entscheiden: Monsterdaten aus eigener CSV-Datei (wie in der PDF beschrieben) oder über dnd5eapi.co beziehen.
- HTML-Grundgerüst für das Formular (Anzahl Spieler, Stufe, Schwierigkeit, Umgebung, Button) bauen.
- Regeltabelle (XP-Budget pro Spieler/Schwierigkeit/Stufe) anlegen.

## Decisions & notes
- Zielgruppe: Spielleiter, der schnell faire D&D-5e-Begegnungen vorschlagen will.
- Eingaben: Spieleranzahl, Gruppenstufe (1–20), Schwierigkeit (Leicht/Mittel/Schwer/Tödlich), Umgebung (Mehrfachauswahl).
- Ausgabe: XP-Budget-Balken (grün/gelb/rot), Gegner-Tabelle mit Mini-Balken pro Gegner, Gesamtsumme.
- Monsterliste als CSV-Format geplant (name, cr, xp, typ, umgebung).
- Zufalls-Button soll neuen Vorschlag mit gleichen Einstellungen erzeugen, ohne Seite neu zu laden.
- Spätere Erweiterungen (nicht jetzt): Filter nach Monstertyp, "Als Text kopieren"-Button, eigene Monster direkt hinzufügen.

## Known problems
- Noch keine Monsterdaten-Quelle festgelegt (eigene CSV vs. dnd5eapi.co).
- Noch kein Code vorhanden – reine Konzeptphase.
