# Sprintplan

## Arbeitsweise

Wir arbeiten in kleinen Sprints. Jeder Sprint hat ein klares Ziel, ein sichtbares Ergebnis und eine kurze Dokumentation. Dadurch bleibt die App nachvollziehbar und du kannst mitlernen, statt nur am Ende einen fertigen Block Code zu bekommen.

Ein Sprint besteht jeweils aus:

- Ziel
- Umfang
- technische Umsetzung
- Tests oder manuelle Pruefung
- Dokumentation

## Sprint 0: Projektfundament

### Ziel

Das Projekt wird technisch sauber angelegt und dokumentiert.

### Ergebnis

- Next.js Projekt mit TypeScript
- LESS eingerichtet
- Grundlayout
- erste Dokumentation im Repository
- Git Repository initialisiert

### Warum dieser Sprint wichtig ist

Ein gutes Fundament spart spaeter viel Frust. Gerade weil du selbst daran weiterentwickeln moechtest, sollten Struktur, Benennungen und Entscheidungen von Anfang an verstaendlich sein.

## Sprint 1: Datenmodell und lokale App-Logik

### Ziel

Die Kernlogik fuer Aufgaben funktioniert zuerst lokal in der App. Lokal bedeutet hier: Die Daten laufen erstmal im Frontend und noch nicht in Supabase.

### Ergebnis

- Aufgabenmodell
- Aufgabenpool als Seed-Daten
- eigene Aufgaben anlegen
- Aufgaben als erledigt markieren
- naechste Faelligkeit berechnen
- Heute-Ansicht
- Dringlichkeit und Wichtigkeit pro Aufgabe
- Aufgaben nach morgen schieben
- Diese-Woche-erledigt-Ueberblick

### Sprint-1-Schnitt

Zuerst wird "auf morgen schieben" als Button umgesetzt. Die Swipe-Geste folgt danach, weil sie mehr Interaktionslogik und mobile Tests braucht.

### Warum zuerst lokal?

So koennen wir die Produktlogik schnell pruefen, bevor Authentifizierung, Datenbankregeln und Serverjobs dazukommen. Das reduziert Komplexitaet im ersten Schritt.

## Sprint 1.5: Organizer-Modus

### Ziel

Die App hilft nicht nur beim Sammeln, sondern beim Sortieren des Tages.

### Ergebnis

- Fokusmodus
- Wechsel zur naechsten Aufgabe
- kompakte Tages-Roadmap
- kompakter Wochenblick als Vorschau

### Warum eigener Zwischensprint?

Diese Funktionen bestimmen stark, wie sich die App anfuehlt. Sie sollten frueh ausprobiert werden, bevor wir Backend und Login einbauen.

## Sprint 2: Supabase-Anbindung und Login

### Ziel

Nutzerinnen und Nutzer koennen sich anmelden und ihre eigenen Daten speichern.

### Ergebnis

- Supabase Projekt vorbereitet
- Authentifizierung
- Datenbanktabellen
- Row Level Security
- Aufgaben werden pro Nutzer oder Haushalt gespeichert

### Warum Supabase?

Supabase bringt Postgres, Auth und Row Level Security mit. Besonders RLS ist wichtig, damit Daten nicht versehentlich zwischen Nutzerinnen und Nutzern sichtbar werden.

## Sprint 3: Haushalte und gemeinsame Nutzung

### Ziel

Mehrere Personen koennen einem Haushalt angehoeren und gemeinsame Aufgaben sehen.

### Ergebnis

- Haushalte erstellen
- Mitglieder verwalten
- Aufgaben gehoeren zu einem Haushalt
- Aufgaben koennen optional einer Person zugewiesen werden
- Erledigungen speichern, inklusive "erledigt von"

### Warum frueh einplanen?

Wenn wir Haushalte erst sehr spaet einbauen, muessten wir viele Datenstrukturen umbauen. Deshalb kommt die gemeinsame Nutzung relativ frueh.

## Sprint 4: Erinnerungen

### Ziel

Die App erinnert morgens und abends an Aufgaben.

### Ergebnis

- Erinnerungseinstellungen
- morgendliche Nachricht
- abendliche Nachricht fuer offene Aufgaben
- Web Push, falls moeglich
- E-Mail-Fallback

### Warum E-Mail-Fallback?

Push-Benachrichtigungen sind auf Web-Apps nicht immer gleich verlaesslich. E-Mail ist technisch weniger elegant, aber robuster und als Fallback sinnvoll.

## Sprint 5: Aufgabenpool ausbauen und UX polieren

### Ziel

Die App fuehlt sich alltagstauglich an.

### Ergebnis

- groesserer Aufgabenpool
- Kategorien und Filter
- bessere leere Zustaende
- kleine humorvolle Texte
- responsive UI fuer Smartphone und Desktop

### Warum erst nach der Kernlogik?

Ein schoener Aufgabenpool bringt wenig, wenn Wiederholungen und Erledigungen nicht stimmen. Deshalb polieren wir, nachdem die Mechanik verlaesslich laeuft.

## Sprint 6: Deployment und Betriebsdokumentation

### Ziel

Die App kann online genutzt werden.

### Ergebnis

- Deployment vorbereitet
- Umgebungsvariablen dokumentiert
- Kostenuebersicht
- Backup- und Wartungshinweise
- Repository bereit fuer GitHub oder GitLab

### Warum separat?

Deployment ist nicht nur "hochladen". Es geht auch um Sicherheit, Konfiguration, Datenbankmigrationen und spaetere Wartung.
