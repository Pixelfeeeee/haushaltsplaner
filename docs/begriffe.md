# Begriffe

Dieses Dokument sammelt Fachbegriffe, die im Projekt auftauchen. Die Erklaerungen sind bewusst kurz gehalten.

## Scaffolden

Ein Projekt-Grundgeruest automatisch anlegen lassen. Dabei entstehen Ordner, Konfigurationsdateien und Beispielcode.

## PWA

Progressive Web App. Eine Web-App, die sich teilweise wie eine installierte App verhalten kann, zum Beispiel mit Homescreen-Icon oder Benachrichtigungen.

## Backend

Der Teil der App, der auf einem Server laeuft. Dort passieren zum Beispiel Datenbankzugriffe, Login-Pruefung und geplante Erinnerungen.

## Frontend

Der Teil der App, den Nutzerinnen und Nutzer im Browser sehen und bedienen.

## API

Eine definierte Schnittstelle, ueber die Programmteile miteinander sprechen. Das Frontend kann zum Beispiel eine API fragen: "Welche Aufgaben sind heute faellig?"

## Datenbank

Ein System zum strukturierten Speichern von Daten, zum Beispiel Nutzer, Haushalte, Aufgaben und Erledigungen.

## Migration

Eine nachvollziehbare Aenderung an der Datenbankstruktur. Beispiel: Eine neue Tabelle fuer Haushalte anlegen.

## SQL

Sprache fuer Datenbanken. Damit legt man Tabellen an, fragt Daten ab oder definiert Sicherheitsregeln.

## Policy

Eine Zugriffsregel in Supabase/Postgres. Beispiel: Nur Mitglieder eines Haushalts duerfen dessen Aufgaben sehen.

## Enum

Eine feste Liste erlaubter Werte. Beispiel: `low`, `medium`, `high` fuer Prioritaeten.

## anon key

Oeffentlicher Supabase-Schluessel fuer Browser-Apps. Er darf im Frontend genutzt werden, solange Row Level Security korrekt aktiv ist.

## service_role key

Privater Supabase-Admin-Schluessel. Er umgeht Sicherheitsregeln und darf niemals im Frontend oder als `NEXT_PUBLIC_` Variable gespeichert werden.

## Row Level Security

Datenbankregeln, die festlegen, welche Zeilen eine Person sehen oder bearbeiten darf. Wichtig, damit Nutzer nur ihre eigenen Haushaltsdaten sehen.

## Dependency

Eine Abhaengigkeit. Das ist ein externes Paket, das unser Projekt nutzt, zum Beispiel Next.js oder LESS.

## Package Manager

Ein Werkzeug zum Installieren und Aktualisieren von Dependencies. In diesem Projekt nutzen wir pnpm.

## Build

Der Schritt, bei dem Quellcode fuer den produktiven Betrieb vorbereitet wird.

## Linting

Automatische Code-Pruefung auf typische Fehler und Stilprobleme.

## TypeScript

JavaScript mit Typen. Typen beschreiben, welche Form Daten haben sollen, und helfen Fehler frueh zu finden.

## LESS

Ein CSS-Vorprozessor. Wir schreiben Styles in `.less` und uebersetzen sie danach in normales CSS.

## CSS-Variable

Ein benannter CSS-Wert, zum Beispiel `--background`. Damit koennen Farben zentral umgeschaltet werden.

## localStorage

Kleiner Speicher im Browser. Wir nutzen ihn, damit sich die App den gewaehlten Hell- oder Dunkelmodus merkt.

## Key

Ein eindeutiger Name fuer gespeicherte Daten. Beispiel: `haushaltsplaner.tasks`.

## Seed-Daten

Startdaten, die im Code mitgeliefert werden. Sie fuellen die App beim ersten Oeffnen, bevor eigene Daten gespeichert sind.

## Migration

Eine geordnete Umwandlung alter Daten in eine neue Struktur. Das wird wichtig, wenn sich unser Aufgabenmodell spaeter aendert.

## MVP

Minimum Viable Product. Die erste kleine Version, die wirklich nutzbar ist und den wichtigsten Nutzen liefert.

## Swipe

Eine Wischgeste auf Touch-Geraeten. Beispiel: Aufgabe nach rechts ziehen, um sie auf morgen zu verschieben.

## Dringlichkeit

Beschreibt, ob eine Aufgabe zeitnah passieren muss.

## Wichtigkeit

Beschreibt, ob eine Aufgabe echte Folgen hat, wenn sie liegen bleibt.

## Fokusmodus

Eine Ansicht, die nur eine Aufgabe auf einmal zeigt. Das reduziert Ueberforderung durch lange Listen.

## State

Der aktuelle Zustand einer Komponente. Beispiel: Welche Aufgaben sind offen, erledigt oder auf morgen verschoben?

## Props

Daten, die von einer React-Komponente an eine untergeordnete Komponente weitergegeben werden. Beispiel: `todayIso` wird an die Aufgabenliste gereicht.

## Default

Ein voreingestellter Wert. Beim Aufgabe-anlegen setzen wir zum Beispiel Dringlichkeit erstmal auf `mittel`.

## Vorlage

Ein vorbereiteter Datensatz, der ein Formular fuellen kann. Beispiel: "Kuehlschrank auswischen" bringt Raum, Rhythmus und Dauer schon mit.

## Preset

Englisches Wort fuer Vorlage oder Voreinstellung. Im Code kann ein Preset helfen, gleiche Eingaben nicht immer wieder neu zu tippen.

## Autocomplete

Automatische Vorschlaege waehrend der Eingabe. Beispiel: Beim Tippen von "Kueh" schlaegt die App "Kuehlschrank auswischen" vor.

## Typeahead

Sehr aehnlich wie Autocomplete. Gemeint ist eine Suche, die schon beim Tippen Treffer zeigt, bevor man das komplette Wort geschrieben hat.

## Filterchip

Ein kleiner Umschalt-Button, der eine Liste eingrenzt. Beispiel: `Schnell` zeigt nur kurze Aufgaben.

## Relevanzsortierung

Treffer werden nicht nur alphabetisch sortiert, sondern danach, wie gut sie zur Eingabe passen.

## Dublette

Ein doppelter Eintrag. Beispiel: dieselbe Aufgabe zweimal im gleichen Raum.

## Formular

Eine Eingabeflaeche fuer Daten. In unserer App nutzt das Formular wenige Felder, damit neue Aufgaben schnell angelegt werden koennen.

## Wiederholungslogik

Code, der berechnet, wann eine wiederkehrende Aufgabe das naechste Mal faellig ist.

## Ueberspringen

Eine Aufgabe heute auslassen, ohne den Grundrhythmus zu verschieben.

## Rhythmus

Der geplante Abstand einer Aufgabe, zum Beispiel alle 7 oder alle 30 Tage.

## Score

Ein berechneter Wert, mit dem die App Aufgaben sortieren kann. Hier nutzt die App Dringlichkeit, Wichtigkeit und Dauer.

## Faelligkeit

Das Datum, an dem eine Aufgabe dran ist.

## Startdatum

Das erste Faelligkeitsdatum einer wiederkehrenden Aufgabe.

## Hydration

React verbindet serverseitig erzeugtes HTML im Browser mit Interaktivitaet. Wenn Server- und Browserzustand nicht zusammenpassen, entstehen Hydration-Fehler.

## useSyncExternalStore

React-Hook zum Lesen eines Zustands ausserhalb von React. Wir nutzen ihn fuer das Theme, das am HTML-Element und im Browser-Speicher liegt.

## UTC

Weltweite Referenzzeit. Hilft, Datumsberechnungen stabil zu machen, weil sie nicht von der lokalen Zeitzone verschoben werden.

## Tab

Ein umschaltbarer Bereich innerhalb derselben Seite. In unserer App sind `Heute`, `Raeume` und `Alle` solche Tabs.

## Bottom-Navigation

Navigation am unteren Bildschirmrand. Auf Smartphones ist sie gut erreichbar, weil der Daumen dort natuerlich liegt.

## Mobile-first

Die Gestaltung und CSS-Regeln starten beim kleinen Smartphone-Bildschirm. Desktop wird danach als Erweiterung behandelt.

## Datenmodell

Die festgelegte Struktur unserer Daten. Beispiel: Eine Aufgabe hat Titel, Faelligkeit, Status und Raum.

## ID

Eine technische Kennung. Nutzer sehen meist den Namen, der Code nutzt aber eine stabile ID, zum Beispiel `kitchen`.

## CSS Custom Property

Eine CSS-Variable. Wir nutzen sie zum Beispiel, um die Raumfarbe als `--room-color` an ein Element zu geben.

## Token

Ein zufaelliger geheimer Code. Bei Einladungslinks steckt der Token in der URL und beweist, dass jemand die Einladung besitzt.

## RPC

Remote Procedure Call. In Supabase bedeutet das meistens: Die App ruft eine Datenbankfunktion auf, statt direkt eine Tabelle zu veraendern.

## SECURITY DEFINER

Eine Datenbankfunktion laeuft mit den Rechten ihres Erstellers. Das ist nuetzlich fuer kontrollierte Spezialfaelle, aber sicherheitskritisch. Deshalb begrenzen wir genau, wer diese Funktion ausfuehren darf.
