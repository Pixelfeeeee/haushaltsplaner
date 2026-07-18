# Technische Entscheidungen

## Entscheidung 1: Web-App statt native App

Wir starten mit einer Web-App. Das ist fuer den aktuellen Bedarf sinnvoller als eine native iOS- oder Android-App.

### Gruende

- geringerer Entwicklungsaufwand
- schneller testbar
- funktioniert auf Desktop und Smartphone
- keine App-Store-Abhaengigkeit
- spaeter als PWA erweiterbar

### Nachteil

Push-Benachrichtigungen sind in Web-Apps etwas empfindlicher als in nativen Apps. Deshalb planen wir E-Mail als Fallback ein.

## Entscheidung 2: Next.js mit TypeScript

Next.js eignet sich gut, weil wir UI, Serverlogik und API-Routen in einem Projekt halten koennen. TypeScript hilft, Datenmodelle und Funktionen sicherer zu entwickeln.

### Warum TypeScript?

Bei einer App mit Aufgaben, Wiederholungen, Haushalten und Berechtigungen entstehen viele Datenstrukturen. TypeScript hilft dabei, Fehler frueh zu erkennen.

## Entscheidung 3: LESS fuer Styling

Wir verwenden LESS, wenn wir CSS schreiben.

### Warum LESS?

LESS erlaubt Variablen, Verschachtelung und wiederverwendbare Styling-Strukturen. Das macht groessere Stylesheets lesbarer als reines CSS.

## Entscheidung 4: Supabase fuer Backend und Datenbank

Supabase ist fuer diesen App-Typ passend, weil es Authentifizierung, Postgres-Datenbank und Row Level Security kombiniert.

### Wichtig

Die App darf Daten nicht nur im Frontend filtern. Die Datenbank selbst muss absichern, welche Person welche Daten sehen darf. Dafuer verwenden wir Row Level Security.

## Entscheidung 5: Haushalte als zentrale Einheit

Aufgaben gehoeren nicht nur direkt einem Nutzer, sondern einem Haushalt.

### Warum?

Damit funktioniert die App fuer:

- Einzelpersonen
- Paare
- WGs
- Familien

Eine Einzelperson hat einfach einen Haushalt mit nur einem Mitglied.

## Entscheidung 6: Aufgabenpool getrennt von Nutzeraufgaben

Vorlagen aus dem Aufgabenpool werden nicht direkt bearbeitet. Wenn jemand eine Vorlage uebernimmt, entsteht daraus eine eigene Aufgabe im Haushalt.

### Warum?

So kann jede Person oder jeder Haushalt die Aufgabe individuell anpassen, ohne die globale Vorlage zu veraendern.

## Entscheidung 7: E-Mail-Fallback fuer Erinnerungen

Wir planen Web Push, aber verlassen uns nicht ausschliesslich darauf.

### Warum?

Web Push braucht Browser-Unterstuetzung, Berechtigung des Nutzers und korrekte Service-Worker-Konfiguration. Wenn das nicht klappt, muss die Erinnerung trotzdem funktionieren.

## Offene Entscheidungen

Diese Punkte entscheiden wir spaeter, wenn wir sie wirklich brauchen:

- konkreter E-Mail-Anbieter
- Hosting-Anbieter
- genaue Push-Implementierung
- ob Aufgaben mehreren Personen gleichzeitig zugewiesen werden koennen
- ob erledigte Aufgaben kommentiert werden koennen
- ob es eine Kalenderansicht gibt
