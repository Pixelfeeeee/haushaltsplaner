# Sprint 10: Schlankes Account-Menue

## Ziel

Der Login soll nicht mehr mitten im Aufgabeninhalt stehen. Die Startseite bleibt dadurch ruhiger und konzentriert sich wieder auf die heutigen Aufgaben.

## Umsetzung

- Der Login wurde in ein kleines Account-Icon oben rechts verschoben.
- Ein farbiger Punkt zeigt den Status:
  - gruen: eingeloggt und Cloud-Sync aktiv
  - orange: Login moeglich, aber noch nicht eingeloggt
  - grau: lokaler Modus, Supabase noch nicht konfiguriert
- Beim Klick oeffnet sich ein kompaktes Overlay.
- Das Overlay schliesst sich beim Klick ausserhalb oder mit der Escape-Taste.
- Login, Registrierung, Sync-Status und Logout bleiben funktional gleich.

## Warum so?

Die App ist mobile-first und soll im Alltag nicht ueberfordern. Login ist wichtig, aber nicht die Hauptaufgabe der App. Deshalb gehoert er in eine Account-Ebene, waehrend die Aufgabenliste frei bleibt.

## Begriff kurz erklaert

Overlay: Eine kleine Ebene, die ueber der aktuellen Ansicht liegt. Sie ist gut fuer kurze Aktionen wie Login, Einstellungen oder Account-Status, ohne eine eigene Seite zu brauchen.

## Technische Pruefung

- `pnpm lint`
- `pnpm build`

Beide Checks laufen erfolgreich.
