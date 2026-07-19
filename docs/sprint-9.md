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

- Supabase-Projekt anlegen
- Project URL
- anon public key
- Entscheidung: zuerst ein Single-User-Haushalt oder direkt Einladungen?

## Empfehlung

Wir starten technisch mit Haushalten, aber die UI kann erstmal automatisch einen Haushalt "Zuhause" erstellen. So bleibt die App einfach, waehrend das Datenmodell schon fuer Paare vorbereitet ist.

