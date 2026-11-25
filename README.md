# TikTok für Stationen 📱🏥

Das ist mein kleines Lernprojekt, bei dem ich mir Node.js, Express und ein bisschen Bootstrap
beibringe – anhand einer Idee, die direkt aus meinem Arbeitsalltag auf der Intensivstation kommt.

## Die Idee dahinter

Auf der Station gibt es immer wieder Interventionen, die man selten genug macht, um sie nicht
komplett im Kopf zu haben – externer Herzschrittmacher, Pleuradrainage, Aszitespunktion,
Kardioversion, TEE-Sonde, PDA und so weiter. Anstatt im entscheidenden Moment ein PDF zu suchen,
wollte ich etwas, das genauso schnell geht wie TikTok scrollen: ein kurzes Anleitungsvideo, direkt
am Gerät oder im Stationszimmer per QR-Code erreichbar. Scannen, anschauen, fertig.

Deshalb der Name – es soll sich genauso leicht bedienen lassen wie eine Social-Media-App, nur dass
der Inhalt eben "wie schließe ich eine Thoraxdrainage an" ist statt eines Tanzvideos.

## Was die Seite können soll

- **Ohne Login ansehen**: Jeder auf der Station kann Einträge suchen und sich Videos anschauen,
  kein Account nötig.
- **Mit Login bearbeiten**: Pflege und Ärzte mit Zugang können Einträge anlegen (Titel,
  Beschreibung, Video, Anhänge) und bestehende bearbeiten.
- **QR-Code pro Eintrag**: Jeder Eintrag bekommt automatisch eine eigene Detailseite mit eigenem
  QR-Code – der lässt sich ausdrucken und am Gerät aufhängen.
- **Suche**: Ab 4 Buchstaben wird direkt gesucht, Ergebnisse in einer scrollbaren Liste.
- **Feedback**: Jeder kann (auch ohne Login) kurz Rückmeldung geben, was fehlt oder nicht
  funktioniert.

Alles auf einer einzigen Seite mit einem Accordion (Suche, Hinzufügen, User-Infos, Feedback),
dazu Login- und Impressum-Modal im Footer – siehe [SPEC.md](SPEC.md) für die genauen Details.

## Warum so simpel gebaut

Das ist bewusst ein Einsteigerprojekt:

- **Backend**: nur Node.js + Express, keine Datenbank – alles liegt in JSON-Dateien unter `data/`.
- **Frontend**: HTML, CSS mit Bootstrap, ganz normales JavaScript (kein Framework).
- **Läuft nur im Stationsnetz**: kein Internet-Zugriff, nur localhost bzw. die IP des PCs im
  Intranet.

Ich will dabei vor allem verstehen, *wie* die Dinge funktionieren (Sessions, atomares Schreiben
von Dateien, Datei-Uploads, QR-Code-Erzeugung), nicht möglichst elegant oder "enterprise-ready"
programmieren. Die Regeln dazu stehen in [AGENTS.md](AGENTS.md).

## Wie weit ich bin

Den aktuellen Stand – was schon funktioniert, was als Nächstes kommt und was ich mir dabei
überlegt habe – trage ich laufend in [PROGRESS.md](PROGRESS.md) ein. Was ich dabei an Neuem
gelernt habe (Sessions, Hashing, Multer, atomare Writes, QR-Codes …), sammle ich in
[Insights.md](Insights.md).

## Selbst ausprobieren

```bash
npm install
npm start
```

Danach ist die Seite unter `http://localhost:8051` erreichbar.
