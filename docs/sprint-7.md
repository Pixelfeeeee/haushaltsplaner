# Sprint 7: Groesserer Aufgabenpool und Suchvorschlaege

## Ziel

Der Aufgabenpool soll im Alltag wirklich helfen. Beim Anlegen einer Aufgabe soll man nicht lange nachdenken muessen, sondern typische Haushaltsroutinen schnell finden und uebernehmen koennen.

## Ergebnis

- Der Vorlagenpool wurde deutlich erweitert.
- Vorlagen decken Kueche, Bad, Schlafzimmer, Wohnzimmer, Waesche, Flur und allgemeine Aufgaben ab.
- Beim Tippen im Namensfeld filtert die App passende Vorschlaege.
- Ohne Suchtext zeigt die App die wichtigsten Vorlagen fuer den gewaehlten Raum.
- Eine ausgewaehlte Vorlage fuellt weiterhin nur das Formular.
- Speichern bleibt ein bewusster Schritt.

## Warum kein eigener Pool-Screen?

Ein eigener Screen waere schnell zu viel. Der Pool soll beim Anlegen helfen, nicht ein weiterer Ort werden, den man verwalten muss. Darum sitzt er direkt am Eingabefeld.

## Technische Umsetzung

Die Vorlagen liegen weiter in `taskTemplates` in `src/lib/tasks.ts`.

Die Suchlogik liegt in `src/components/task-organizer.tsx`:

- `getSuggestedTemplates` waehlt passende Vorlagen aus.
- `normalizeSearchTerm` macht die Suche robuster fuer Gross-/Kleinschreibung und Umlaute.

Beispiel: Aus `Kuehlschrank` und `Kühlschrank` wird fuer die Suche ein vergleichbarer Text.

## Warum maximal 10 Vorschlaege?

Auf dem Smartphone sollen Vorschlaege schnell wirken und nicht wie eine riesige zweite Liste. Mehr Treffer koennen spaeter ueber Filter oder Kategorien erreichbar werden, falls wir das brauchen.

## Pruefung

- LESS wurde neu zu CSS gebaut.
- Linting wurde ausgefuehrt.
- Production-Build wurde ausgefuehrt.

