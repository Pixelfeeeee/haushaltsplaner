# Sprint 5: Lokale Speicherung

## Ziel

Die App soll Aufgaben nicht mehr vergessen, wenn die Seite neu geladen wird.

## Umgesetzt

- Aufgaben werden beim Start aus `localStorage` geladen
- Aenderungen an Aufgaben werden automatisch gespeichert
- gespeicherte Daten haben eine Version
- Seed-Daten bleiben als Startpunkt erhalten, wenn noch nichts gespeichert ist

## Warum lokale Speicherung vor Supabase?

Supabase ist spaeter wichtig fuer Login, gemeinsame Haushalte und mehrere Geraete.

Fuer den jetzigen Entwicklungsstand bringt lokale Speicherung aber sofort Mehrwert:

- eigene Aufgaben bleiben erhalten
- bearbeitete Aufgaben bleiben erhalten
- erledigte, uebersprungene und verschobene Termine bleiben erhalten
- die App fuehlt sich weniger wie ein Prototyp an

## Technische Notiz

Gespeichert wird unter dem Key `haushaltsplaner.tasks`.

Key bedeutet: ein eindeutiger Name, unter dem Daten im Browser-Speicher abgelegt werden.

Die gespeicherten Daten haben aktuell diese Form:

```ts
{
  version: 1,
  tasks: HouseholdTask[]
}
```

Die Version hilft spaeter, wenn sich das Datenmodell veraendert. Dann koennen wir alte gespeicherte Daten gezielt migrieren.

## Grenze von localStorage

`localStorage` ist nur lokal im aktuellen Browser.

Das bedeutet:

- kein Teilen mit anderen Personen
- keine automatische Synchronisation zwischen Handy und Laptop
- kein echtes Backup

Genau dafuer kommt spaeter Supabase.

## Noch nicht umgesetzt

- Datenbank
- Login
- Synchronisation zwischen Geraeten
- gemeinsamer Haushalt
- Export oder Backup
