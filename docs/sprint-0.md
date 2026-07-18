# Sprint 0: Projektfundament

## Ziel

In Sprint 0 legen wir das technische Fundament der Web-App an.

## Ergebnis

- Next.js Projekt angelegt
- TypeScript aktiviert
- ESLint aktiviert
- LESS eingerichtet
- erste Startseite mit statischen Beispieldaten
- Dokumentationsordner angelegt

## Wichtige Begriffe

- Next.js: React-Framework fuer Web-Apps mit Frontend- und Serverfunktionen.
- TypeScript: JavaScript mit Typpruefung.
- ESLint: Werkzeug zur automatischen Code-Pruefung.
- LESS: CSS-Vorprozessor fuer besser strukturierte Styles.
- Statische Daten: Daten, die fest im Code stehen und noch nicht aus einer Datenbank kommen.

## Warum wir mit statischen Daten starten

Statische Daten machen den Anfang leichter. Wir koennen Layout, Aufgabenstruktur und Bedienlogik pruefen, bevor Login, Datenbank und Berechtigungen dazukommen.

Das ist besonders beim Lernen hilfreich, weil die App nicht sofort aus vielen beweglichen Teilen besteht.

## LESS-Entscheidung

Next.js verarbeitet CSS direkt. LESS ist kein offizieller Standardweg in Next.js. Deshalb schreiben wir die Styles in `src/styles/*.less` und kompilieren sie mit dem Skript `pnpm styles` nach `src/app/*.css`.

Das bedeutet:

- geschrieben wird in LESS
- Next.js importiert die erzeugten CSS-Dateien
- die CSS-Dateien sind technische Ausgabe aus unseren LESS-Dateien

## Naechster Sprint

Sprint 1 baut die echte Aufgabenlogik:

- Aufgaben-Datentypen
- Aufgabenpool
- eigene Aufgaben
- Erledigen
- naechste Faelligkeit berechnen

## Nachtrag: Reduzierte Startseite

Die Startseite wurde nach der ersten Sichtung bewusst reduziert.

Geaendert wurde:

- keine verschachtelten Karten um Aufgaben
- keine zusaetzlichen Spruchzeilen pro Aufgabe
- kein Status-Badge wie "Morgendruck aktiv"
- Aufgaben werden als klare Liste mit Linien dargestellt
- Kennzahlen stehen kompakt neben oder unter der Liste

Warum: Die App soll im Alltag schnell bedienbar sein. Humor und smarte Erinnerungen gehoeren eher in Benachrichtigungen und E-Mails, nicht in jede einzelne Aufgabenzeile.
