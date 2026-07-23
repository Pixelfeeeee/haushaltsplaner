# Sprint 11: Online-Stabilisierung

## Ziel

Die App soll nach dem Vercel-Deploy im Online-Modus verstaendlicher und robuster wirken. Login und Supabase-Sync sollen nicht technisch aussehen, sondern klar sagen, was gerade passiert.

## Umsetzung

- Das Account-Menue zeigt jetzt einen konkreteren Sync-Status.
- Der Statuspunkt unterscheidet:
  - online
  - synchronisiert gerade
  - Fehler
  - nicht eingeloggt
  - lokaler Modus
- Beim ersten Login wird klarer gemeldet, wie viele lokale Aufgaben online gespeichert wurden.
- Wenn der Cloud-Haushalt schon Aufgaben hat, werden diese geladen und die lokalen Daten nicht erneut importiert.
- Login-Fehler werden in kurze deutsche Meldungen uebersetzt.
- Sync-Fehler werden freundlicher formuliert, damit nicht rohe Supabase-Fehlermeldungen in der UI stehen.
- Eingabefelder werden waehrend Login/Registrierung deaktiviert.

## Warum vor gemeinsamen Haushalten?

Gemeinsame Haushalte bauen auf Login, Haushalt und Sync auf. Wenn dieser Single-Haushalt schon unsauber wirkt, wird ein Zwei-Personen-Haushalt schnell verwirrend. Deshalb stabilisieren wir zuerst die Basis.

## Begriff kurz erklaert

Sync bedeutet Synchronisierung. Die App gleicht lokale Anzeige und Online-Datenbank ab, damit Aufgaben nach einem Neuladen oder auf einem anderen Geraet wieder da sind.

## Technische Pruefung

- `pnpm styles`
- `pnpm lint`
- `pnpm build`

Alle Checks laufen erfolgreich.
