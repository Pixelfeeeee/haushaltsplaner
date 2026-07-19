# Sprint 6: Vorlagenpool fuer Haushaltsaufgaben

## Ziel

Neue Aufgaben sollen schneller angelegt werden koennen. Statt jede Aufgabe komplett selbst auszudenken, gibt es jetzt einen kleinen Pool typischer Haushaltsaufgaben.

## Ergebnis

- Aufgaben-Vorlagen sind zentral in `src/lib/tasks.ts` definiert.
- Jede Vorlage hat Raum, Rhythmus, Dringlichkeit, Wichtigkeit und geschaetzte Dauer.
- Im Formular wird zuerst der Raum gewaehlt.
- Danach zeigt die App passende Vorlagen fuer diesen Raum.
- Ein Klick auf eine Vorlage fuellt das Formular aus.
- Speichern bleibt ein bewusster zweiter Schritt.

## Warum Vorlagen nicht direkt speichern?

Ein direkter Klick waere zwar schneller, aber auch fehleranfaelliger. Mit dem Formular dazwischen kann man Startdatum, Rhythmus oder Dringlichkeit noch kurz pruefen. Das passt besser zur Idee: wenig Tippen, aber trotzdem Kontrolle.

## Technische Umsetzung

Die neuen Vorlagen nutzen den Typ `TaskTemplate`.

Eine Vorlage ist bewusst kleiner als eine echte Aufgabe:

```ts
export type TaskTemplate = {
  id: string;
  title: string;
  roomId: RoomId;
  intervalDays: number;
  urgency: PriorityLevel;
  importance: PriorityLevel;
  estimatedMinutes: number;
};
```

Eine echte Aufgabe bekommt erst beim Speichern zusaetzliche Werte wie:

- `id`
- `dueDate`
- `status`
- optional `completedAt`

## Warum zentral in `src/lib/tasks.ts`?

Der Pool ist Produktlogik, nicht nur UI. Spaeter koennen diese Vorlagen in eine Datenbank wandern oder fuer mehrere Haushalte unterschiedlich angeboten werden. Solange wir noch lokal arbeiten, ist `src/lib/tasks.ts` der passende Ort.

## UI-Entscheidung

Die Vorlagen sind als horizontal scrollbare Buttons umgesetzt. Das ist auf dem Smartphone schnell erreichbar, nimmt wenig Hoehe ein und zwingt nicht zu einer langen zweiten Liste.

## Pruefung

- LESS wurde neu zu CSS gebaut.
- Linting wurde ausgefuehrt.
- Production-Build wurde ausgefuehrt.

