# Sprint 13: Einladungslinks fuer gemeinsame Haushalte

## Ziel

Die User-ID-Loesung aus Sprint 12 funktioniert technisch, ist aber fuer echte Nutzung sperrig. In diesem Sprint bekommt der Haushalt deshalb Einladungslinks.

## Umsetzung

- Owner koennen im Account-Menue einen Einladungslink erzeugen.
- Der Link wird direkt in die Zwischenablage kopiert.
- Offene Links werden kompakt im Account-Menue angezeigt.
- Offene Links koennen kopiert oder widerrufen werden.
- Wer einen Link oeffnet, bekommt beim Login den Hinweis, dass eine Einladung erkannt wurde.
- Nach dem Login wird die Einladung angenommen und die Person wird Mitglied des Haushalts.
- Beim Beitritt werden lokale Aufgaben nicht automatisch importiert, damit ein fremder Haushalt nicht versehentlich mit lokalen Aufgaben gefuellt wird.

## Datenbank

Neue Tabelle:

- `household_invites`

Wichtige Felder:

- `household_id`: Zu welchem Haushalt gehoert die Einladung?
- `token`: Geheimer Code im Link.
- `created_by`: Wer hat eingeladen?
- `accepted_by`: Wer hat angenommen?
- `accepted_at`: Wann wurde angenommen?
- `expires_at`: Wann laeuft der Link ab?

Neue Datenbankfunktionen:

- `get_household_invite`
- `accept_household_invite`

Die Annahme laeuft ueber eine Funktion, damit der Beitritt in einem kontrollierten Datenbankschritt passiert.

## Sicherheit

- RLS ist auf der Einladungstabelle aktiv.
- Nur Haushaltsmitglieder koennen vorhandene Einladungen lesen.
- Nur Owner koennen Einladungen erstellen.
- Nur Owner koennen offene Einladungen widerrufen.
- Anonymous Nutzer duerfen SECURITY DEFINER Funktionen nicht mehr ausfuehren.
- Supabase Security Advisor wurde nach der Migration ausgefuehrt.

## Begriffe kurz erklaert

Token: Ein zufaelliger geheimer Code. In unserem Fall ist er Teil des Einladungslinks.

RPC: Eine Datenbankfunktion, die aus der App aufgerufen werden kann. RPC steht fuer Remote Procedure Call.

SECURITY DEFINER: Eine Datenbankfunktion laeuft mit den Rechten ihres Erstellers. Das ist maechtig und muss deshalb eng begrenzt werden.

## Technische Pruefung

- Migrationen auf Supabase angewendet
- Tabelle und Funktionen in Supabase geprueft
- Supabase Security Advisor ausgefuehrt
- `pnpm lint`
- `pnpm build`

Alle App-Checks laufen erfolgreich.
