# Sprint 3: Fokusmodus und Aufgaben anlegen

## Ziel

Die App soll nicht nur Aufgaben anzeigen, sondern zwei zentrale Alltagsaktionen wirklich koennen:

- eine Aufgabe fokussiert anzeigen
- eine eigene Aufgabe schnell anlegen

## Umgesetzt

- echter Fokusmodus ueber den Button `Fokus`
- Fokus zeigt eine Aufgabe auf einmal
- Fokus kann zur naechsten Aufgabe wechseln
- Fokus kann eine Aufgabe erledigen
- Fokus kann eine heute faellige Aufgabe auf morgen schieben
- `Aufgabe anlegen` oeffnet ein kompaktes Formular
- neue Aufgaben werden lokal in den aktuellen App-State eingefuegt
- neue Aufgaben starten als heute faellig
- heutiges Datum wird lokal berechnet

## Warum Fokus als eigener Modus?

Lange Listen koennen schnell ueberfordern. Der Fokusmodus reduziert die Entscheidung auf eine einzige Frage: Mache ich diese Aufgabe jetzt, verschiebe ich sie, oder nehme ich die naechste?

Das passt zum Ziel der App: weniger organisieren muessen, mehr sanft gefuehrt werden.

## Warum das Formular klein bleibt

Eine Aufgabe soll mit moeglichst wenig Tippen entstehen.

Deshalb gibt es aktuell nur:

- Name
- Raum
- Wiederholung in Tagen
- geschaetzte Minuten
- Dringlichkeit
- Wichtigkeit

Alles andere bekommt Defaults. Default bedeutet: ein voreingestellter Wert, den man nur aendert, wenn er nicht passt.

## Warum neue Aufgaben sofort heute faellig sind

Wenn man eine Aufgabe spontan anlegt, hat man sie meistens gerade im Kopf. Deshalb erscheint sie direkt in `Heute`.

Spaeter koennen wir ein Faelligkeitsdatum ergaenzen. Fuer den ersten Schritt ist "heute" schneller und weniger Formulararbeit.

## Technische Notiz: lokales Datum

Vorher war das heutige Datum hart im Code gesetzt. Jetzt wird es beim Start der Komponente aus dem lokalen Browserdatum berechnet.

Wichtig: Wir bauen das Datum aus Jahr, Monat und Tag zusammen. Dadurch vermeiden wir die bekannte `toISOString()`-Zeitzonenfalle.

## Noch nicht umgesetzt

- Aufgabe bearbeiten
- Aufgabe loeschen
- Faelligkeitsdatum beim Anlegen waehlen
- eigene Raumfarben ueber UI setzen
- Daten dauerhaft speichern
- Swipe-Geste
