# Sprint 12: Gemeinsamer Haushalt als erste Version

## Ziel

Ein Haushalt soll nicht mehr nur fuer eine Person gedacht sein. Zwei registrierte Personen sollen denselben Haushalt nutzen koennen.

## Umsetzung

- Das Account-Menue zeigt die Mitglieder des Haushalts.
- Die eigene User-ID kann kopiert werden.
- Ein Owner kann eine weitere registrierte Person per User-ID hinzufuegen.
- Ein Owner kann andere Mitglieder wieder entfernen.
- Die App laedt nach dem Hinzufuegen oder Entfernen die Mitgliederliste neu.

## Warum User-ID statt E-Mail?

Supabase-Auth-Nutzerdaten sind nicht einfach oeffentlich durchsuchbar. Das ist gut, weil E-Mail-Adressen sensible Daten sind. Eine komfortable Einladung per E-Mail braucht deshalb einen sicheren Serverweg oder eine eigene Einladungstabelle.

Fuer diese erste Version ist die User-ID der einfachste sichere Weg:

1. Person A kopiert ihre User-ID.
2. Person A schickt sie Person B.
3. Person B fuegt diese User-ID im eigenen Haushalt hinzu.

## Was ist noch nicht perfekt?

- Die User-ID ist technisch und nicht besonders schoen.
- Es gibt noch keine Einladung per Link.
- Es gibt noch keine Rollenverwaltung in der UI.
- Mitglieder werden noch nicht mit Namen angezeigt, sondern nur als gekuerzte ID.

## Warum trotzdem sinnvoll?

Die wichtigste technische Grundlage ist jetzt da: mehrere Personen koennen in einem Haushalt Mitglied sein und dieselben Aufgaben sehen. Die komfortable Einladung kann darauf aufbauen.

## Begriff kurz erklaert

Owner bedeutet Besitzerin oder Besitzer eines Haushalts. In unserer App darf der Owner Mitglieder hinzufuegen oder entfernen.

## Technische Pruefung

- Supabase-Tabelle `household_members` in der echten Datenbank geprueft
- `pnpm styles`
- `pnpm lint`
- `pnpm build`

Alle Checks laufen erfolgreich.
