# Sprint 8: Pool-UX und bessere Vorschlaege

## Ziel

Der grosse Aufgabenpool soll schnell nutzbar bleiben. Viele Vorlagen sind nur hilfreich, wenn man sie ohne Suchen, Scrollen und Nachdenken findet.

## Ergebnis

- Das Aufgabe-anlegen-Formular hat Filterchips fuer Vorlagen.
- Filter: `Raum`, `Alle`, `Schnell`, `Deep Clean`, `Selten`.
- Vorschlaege werden nach Relevanz sortiert.
- Vorlagen aus dem gewaehlten Raum werden bevorzugt.
- Bereits angelegte Aufgaben werden nicht erneut vorgeschlagen.
- Die Vorschlaege bleiben auf maximal 10 Treffer begrenzt.

## Warum Filterchips?

Filterchips sind kleine, schnelle Umschalter. Sie passen gut auf Smartphones, weil sie wenig Hoehe brauchen und mit dem Daumen leicht erreichbar sind.

## Warum doppelte Aufgaben ausblenden?

Wenn eine Aufgabe schon existiert, ist ein erneuter Vorschlag meistens Stoerung statt Hilfe. Die App soll beim Organisieren helfen und keine Dubletten erzeugen.

## Technische Umsetzung

Die zentrale Funktion ist `getSuggestedTemplates` in `src/components/task-organizer.tsx`.

Sie kombiniert:

- Suchtext aus dem Namensfeld
- aktiven Filter
- gewaehlten Raum
- bereits vorhandene Aufgaben

## Begriffe

- Relevanzsortierung: besser passende Treffer erscheinen weiter vorne.
- Filterchip: kompakter Button, der eine Liste eingrenzt.
- Dublette: ein doppelter Eintrag.

## Pruefung

- LESS wurde neu zu CSS gebaut.
- Linting wurde ausgefuehrt.
- Production-Build wurde ausgefuehrt.

