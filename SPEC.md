# Spec: DnD encounter randomizer

## Goal (one or two sentences)

Als Spielleiter gebe ich Spieleranzahl, Gruppenstufe, Schwierigkeit und Umgebung ein und bekomme sofort einen fairen, zufälligen Gegner-Vorschlag (Begegnung) mit passendem XP-Budget vorgeschlagen, ohne selbst rechnen zu müssen.

## Users

Ich selbst als Spielleiter von Dungeons & Dragons (5. Edition), zur Vorbereitung von Spielrunden.

## Features (numbered, so prompts can refer to them)

1. Eingabeformular (links): Zahlenfeld Anzahl Spieler, Zahlenfeld Stufe der Gruppe (1–20), Auswahlliste Schwierigkeit (Leicht, Mittel, Schwer, Tödlich), Ankreuzfelder Umgebung (Mehrfachauswahl, z. B. Wald, Berge, Dungeon), Button "Begegnung vorschlagen!".
2. Monsterliste als CSV-Datei (name, cr, xp, typ, umgebung; mehrere Umgebungen mit Strichpunkt getrennt), die beim Laden der Seite eingelesen wird.
3. Regeltabelle: XP-Budget pro Spieler, abhängig von Gruppenstufe und Schwierigkeit (nach Spielleiterhandbuch-Regeln).
4. Berechnung: Gesamt-XP-Budget = XP-Budget pro Spieler × Anzahl Spieler.
5. Filterung: Nur Monster anzeigen, deren Umgebung zur gewählten Umgebung passt.
6. Zufallsauswahl: Gegner zufällig aus den gefilterten Monstern wählen, bis das Budget fast erreicht ist.
7. Ausgabe (rechts): Budget-Anzeige als Text ("XP-Budget: X XP | Begegnung: Y XP"), Balkengrafik (grün = passt, gelb = knapp drüber, rot = deutlich zu stark), Tabelle der Gegner (Spalten: Gegner, Anzahl, CR, XP-Anteil mit Mini-Balken), Gesamtsumme ("Gesamt-XP: Y von X").
8. Neuer Vorschlag per erneutem Klick auf den Button, ohne dass die Seite neu lädt (nur rechter Bereich ändert sich).

## Acceptance criteria (how I know a feature works)

- Nach Klick auf "Begegnung vorschlagen!" erscheint rechts ein Vorschlag mit mindestens einem Monster, dessen Umgebung zu mindestens einer gewählten Umgebung passt.
- Die Summe der XP-Werte der vorgeschlagenen Monster entspricht ungefähr dem berechneten Budget (nicht deutlich drüber, außer bewusst als "rot" markiert).
- Das XP-Budget ändert sich korrekt, wenn ich Spieleranzahl, Stufe oder Schwierigkeit ändere.
- Die Balkenfarbe passt zum Budgetverbrauch: grün bei Budget erreicht/leicht darunter, gelb bei leicht darüber, rot bei deutlich darüber.
- Ein zweiter Klick auf den Button liefert einen anderen Vorschlag mit denselben Formular-Einstellungen, ohne dass die Seite neu lädt.
- Wird keine Umgebung angehakt oder passt kein Monster, zeigt die Seite eine verständliche Meldung statt leerer/fehlerhafter Ausgabe.

## Out of scope (do NOT build)

- Keine Anbindung an externe APIs (z. B. dnd5eapi.co) außer der API die in der DunD_api.txt Datei enthalten ist.
- Kein Login, keine Benutzerkonten, kein Speichern in einer Datenbank.
- Kein Bearbeiten/Hochladen eigener Monster direkt auf der Seite (siehe "Mögliche Erweiterungen").
- Kein Filter nach Monstertyp (z. B. nur Untote) in der ersten Version.
- Kein "Als Text kopieren"-Button in der ersten Version.
- Keine Frameworks, Build-Tools oder Bibliotheken – nur HTML, CSS, JavaScript (siehe AGENTS.md).

## Look & feel

- Zwei Spalten: links Eingabeformular, rechts Vorschlag.
- Einfach und übersichtlich, ähnlich der Skizze aus der Idee-PDF: Formular oben links, Button darunter; rechts Budget-Anzeige, großer Budget-Balken, Gegner-Tabelle mit Mini-Balken je Zeile, Gesamtsumme unten.
- Klare Ampelfarben für den Budget-Balken: Grün, Gelb, Rot.
- Schlicht gehalten, keine aufwendigen Animationen oder Grafiken nötig.
