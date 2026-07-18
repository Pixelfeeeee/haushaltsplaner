# Sprint 1: Lokale Aufgabenlogik

## Ziel

Aus der statischen Startseite wird eine lokal interaktive Aufgabenansicht.

Lokal bedeutet: Die Aufgaben liegen aktuell noch im Frontend-Code und werden im Browser-Zustand veraendert. Es gibt noch keine Datenbank und keinen Login.

## Umgesetzt

- Aufgabenmodell mit TypeScript
- sortierte Tagesliste
- Dringlichkeit und Wichtigkeit pro Aufgabe
- geschaetzte Dauer pro Aufgabe
- Aufgaben erledigen
- Aufgaben auf morgen schieben
- Wochenzaehler fuer erledigte Aufgaben
- kompakte Demnaechst-Liste
- hydration-sicherer Theme-Schalter als Nebenfix

## Warum lokal?

Die wichtigste Frage ist zuerst: Fuehlt sich die Logik im Alltag richtig an?

Wenn wir sofort Supabase, Login und Datenbankregeln einbauen, wird jede kleine Produktentscheidung schwerer. Lokal koennen wir schneller testen:

- Welche Aufgaben sollen oben stehen?
- Ist "Morgen" leicht genug erreichbar?
- Hilft der Wochenzaehler mental?
- Bleibt die UI ruhig?

## Datenmodell

Eine Aufgabe enthaelt aktuell:

- `id`: eindeutige technische Kennung
- `title`: sichtbarer Aufgabenname
- `category`: Bereich im Haushalt
- `intervalDays`: Wiederholung in Tagen
- `dueDate`: Faelligkeitsdatum
- `urgency`: Dringlichkeit
- `importance`: Wichtigkeit
- `estimatedMinutes`: geschaetzte Dauer
- `status`: offen, erledigt oder verschoben
- `completedAt`: Datum der Erledigung
- `postponedUntil`: Datum, bis zu dem verschoben wurde

Warum diese Felder: Damit koennen wir Tagesliste, Roadmap, Wochenfortschritt und spaetere Wiederholungen berechnen.

## Sortierung der Tagesliste

Die Tagesliste wird nach einem einfachen Score sortiert:

- Dringlichkeit zaehlt staerker
- Wichtigkeit zaehlt danach
- bei Gleichstand kommen kuerzere Aufgaben zuerst

Score bedeutet: ein berechneter Wert, mit dem die App Aufgaben vergleichen und sortieren kann.

Warum: Wer chaotisch ist, braucht nicht nur eine Liste, sondern eine kleine Entscheidungshilfe.

## Noch nicht umgesetzt

- Aufgaben dauerhaft speichern
- Aufgaben aus Formular anlegen
- Aufgabenpool UI
- Fokusmodus
- Swipe-Geste
- echte Wiederholungsberechnung nach Erledigung

## Nebenfix: Theme-Hydration

Beim Testen fiel auf, dass der Theme-Schalter einen Hydration-Mismatch verursachen konnte.

Hydration bedeutet: React verbindet das vom Server gelieferte HTML im Browser mit echter Interaktivitaet.

Warum das wichtig ist: Wenn Server und Browser beim ersten Rendern unterschiedliche Texte oder Attribute sehen, kann React Teile der Seite neu erzeugen. Das macht Tests und Klickverhalten unzuverlaessig.

Loesung:

- Theme-Startscript laeuft ueber Next.js `Script`
- Theme-Zustand wird ueber `useSyncExternalStore` gelesen
- der Button folgt dem HTML-Theme, statt beim Start einen abweichenden Zustand zu rendern

## Nebenfix: Datumsberechnung fuer "Morgen"

Beim Testen fiel auf, dass `toISOString()` mit lokalen Mitternachtsdaten durch Zeitzonen auf den vorherigen UTC-Tag fallen kann.

UTC bedeutet: weltweite Referenzzeit, unabhaengig von der lokalen Zeitzone.

Warum das wichtig ist: Wenn aus `2026-07-18` beim Verschieben nicht sauber `2026-07-19` wird, bleibt die Aufgabe in der Heute-Liste.

Loesung:

- Datum in Jahr, Monat und Tag zerlegen
- naechsten Tag ueber `Date.UTC` berechnen
- daraus wieder ein ISO-Datum im Format `YYYY-MM-DD` erzeugen

## Naechster Schritt

Als naechstes sollte der Fokusmodus gebaut werden:

- Button "Fokus"
- nur eine Aufgabe anzeigen
- erledigen
- auf morgen schieben
- zur naechsten Aufgabe wechseln
