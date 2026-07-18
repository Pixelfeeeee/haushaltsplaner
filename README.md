# Haushaltsplaner

Web-App fuer wiederkehrende Haushaltsaufgaben, gemeinsame Haushalte und humorvoll-vorwurfsvolle Erinnerungen.

## Projektziel

Die App soll im Alltag zeigen, welche Haushaltsaufgaben heute faellig sind. Aufgaben koennen aus einem Pool uebernommen oder selbst angelegt werden. Spaeter koennen mehrere Personen gemeinsam einen Haushalt nutzen, zum Beispiel als Paar oder WG.

## Tech Stack

- Next.js: React-Framework fuer Web-Apps mit Frontend- und Serverfunktionen.
- TypeScript: JavaScript mit Typpruefung.
- LESS: CSS-Vorprozessor fuer strukturierte Styles.
- pnpm: Paketmanager zum Installieren und Ausfuehren von Projektbefehlen.

## Lokale Entwicklung

```bash
pnpm dev
```

Danach laeuft die App normalerweise unter:

```text
http://localhost:3000
```

## Wichtige Befehle

```bash
pnpm styles
```

Kompiliert LESS nach CSS.

```bash
pnpm lint
```

Prueft den Code mit ESLint.

```bash
pnpm build
```

Baut die App fuer den produktiven Betrieb.

## LESS im Projekt

Wir schreiben Styles in:

```text
src/styles/*.less
```

Das Skript `pnpm styles` erzeugt daraus CSS-Dateien in:

```text
src/app/*.css
```

Warum: Next.js kann CSS direkt importieren. LESS wird deshalb vorher in normales CSS uebersetzt.

## Dokumentation

- `docs/produktkonzept.md`: Was die App koennen soll.
- `docs/sprintplan.md`: Geplante Entwicklung in Sprints.
- `docs/technische-entscheidungen.md`: Warum wir bestimmte technische Wege waehlen.
- `docs/begriffe.md`: Kurze Erklaerungen wichtiger Fachbegriffe.
- `docs/sprint-0.md`: Dokumentation des ersten Projektfundaments.

## Aktueller Stand

Sprint 0 ist das Fundament:

- Next.js Projekt angelegt
- TypeScript und ESLint aktiv
- LESS eingerichtet
- erste statische Startseite erstellt
- Dokumentation angelegt
