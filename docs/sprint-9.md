# Sprint 9: Supabase-Planung fuer Login und gemeinsame Haushalte

## Ziel

Die App soll als naechstes von lokaler Browser-Speicherung zu echter Online-Speicherung wechseln. Dafuer planen wir Supabase, Login und gemeinsame Haushalte.

## Warum Planung zuerst?

Supabase betrifft Datenbank, Authentifizierung und Sicherheit. Wenn wir hier unklar starten, muessen wir spaeter viele Daten umbauen. Deshalb definieren wir zuerst das Datenmodell.

## Geplanter Umfang

- Nutzer koennen sich anmelden.
- Aufgaben werden nicht mehr nur in `localStorage` gespeichert.
- Ein Haushalt kann eine oder mehrere Personen haben.
- Aufgaben gehoeren zu einem Haushalt.
- Erledigungen werden gespeichert.
- Spaeter kann gespeichert werden, wer eine Aufgabe erledigt hat.

## Tabellenentwurf

### households

Speichert einen Haushalt, zum Beispiel "Zuhause".

- `id`
- `name`
- `created_at`

### household_members

Verknuepft Nutzer mit Haushalten.

- `household_id`
- `user_id`
- `role`
- `created_at`

### tasks

Speichert die Aufgaben eines Haushalts.

- `id`
- `household_id`
- `title`
- `room_id`
- `interval_days`
- `due_date`
- `urgency`
- `importance`
- `estimated_minutes`
- `status`
- `created_by`
- `created_at`
- `updated_at`

### task_completions

Speichert Erledigungen als Historie.

- `id`
- `task_id`
- `completed_by`
- `completed_at`

## Warum Erledigungen in eigener Tabelle?

Eine Aufgabe ist eine wiederkehrende Routine. Wenn man nur `completed_at` direkt an der Aufgabe speichert, kennt man immer nur die letzte Erledigung. Eine eigene Historie macht spaeter Statistiken moeglich, zum Beispiel "diese Woche erledigt" oder "wer hat was gemacht".

## Row Level Security

Row Level Security bedeutet: Die Datenbank prueft pro Datenzeile, ob ein Nutzer sie sehen oder bearbeiten darf.

Geplante Regel:

Ein Nutzer darf Haushaltsdaten nur sehen, wenn er Mitglied dieses Haushalts ist.

## Was wir vor der Umsetzung brauchen

- Supabase-Projekt anlegen oder eindeutig im Connector auswaehlen
- Project URL fuer `NEXT_PUBLIC_SUPABASE_URL`
- anon public key fuer `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Entscheidung: zuerst ein Single-User-Haushalt oder direkt Einladungen?

## Empfehlung

Wir starten technisch mit Haushalten, aber die UI kann erstmal automatisch einen Haushalt "Zuhause" erstellen. So bleibt die App einfach, waehrend das Datenmodell schon fuer Paare vorbereitet ist.

## Umgesetzt im Repo

Die Datenbankstruktur liegt als Migration im Projekt:

`supabase/migrations/20260719190000_create_household_schema.sql`

Die benoetigten Umgebungsvariablen stehen als Vorlage in:

`.env.example`

Diese Migration legt an:

- `profiles`
- `households`
- `household_members`
- `tasks`
- `task_completions`
- Enum-Typen fuer Rollen, Prioritaeten und Aufgabenstatus
- Indizes fuer typische Abfragen
- `updated_at` Trigger
- Row Level Security Policies

## Warum als Datei statt direkt nur im Dashboard?

Eine Migration im Repository ist nachvollziehbar und wiederholbar. Wenn spaeter etwas kaputtgeht oder wir eine zweite Umgebung brauchen, wissen wir genau, welche Datenbankstruktur zur App gehoert.

## Wie wird sie ausgefuehrt?

Variante A: Supabase Dashboard

1. Supabase-Projekt oeffnen.
2. SQL Editor oeffnen.
3. Inhalt der Migration einfuegen.
4. Ausfuehren.

Variante B: Supabase CLI

Wenn die Supabase CLI eingerichtet ist:

```bash
supabase db push
```

## Status

Die Migration ist vorbereitet, aber noch nicht in einer Cloud-Datenbank ausgefuehrt. Der aktuell sichtbare Lovable/Supabase-Connector zeigt kein Haushaltsplaner-Projekt an. Damit ich nicht versehentlich eine falsche Datenbank veraendere, brauchen wir die richtige Projekt-ID oder ein eindeutig verbundenes Supabase-Projekt.
