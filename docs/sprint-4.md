# Sprint 4: Wiederholung, Ueberspringen und Bearbeiten

## Ziel

Wiederkehrende Aufgaben sollen sich wie echte Routinen verhalten. Eine erledigte Aufgabe verschwindet nicht dauerhaft, sondern bekommt automatisch ihren naechsten Termin.

## Umgesetzt

- `Erledigt` berechnet eine neue Faelligkeit ab heute
- `Ueberspringen` berechnet den naechsten Termin im bestehenden Rhythmus
- Aufgaben koennen in der Ansicht `Alle` bearbeitet werden
- Aufgaben koennen in der Ansicht `Alle` geloescht werden
- das Formular wird fuer Anlegen und Bearbeiten wiederverwendet
- Aufgaben haben im Formular ein Startdatum als erste Faelligkeit
- der Wochenzaehler nutzt `completedAt`, auch wenn die Aufgabe wieder offen fuer die Zukunft ist

## Unterschied: Erledigt, Morgen, Ueberspringen

### Erledigt

Die Aufgabe wurde wirklich gemacht. Die naechste Faelligkeit wird ab heute berechnet.

Beispiel: Eine Aufgabe mit 30-Tage-Rhythmus wird heute erledigt. Dann ist sie wieder in 30 Tagen faellig.

### Morgen

Die Aufgabe bleibt dieselbe offene Aufgabe, wird aber auf morgen verschoben.

Das ist fuer Tage gedacht, an denen man wirklich keine Zeit hat.

### Ueberspringen

Die Aufgabe wird heute nicht gemacht, aber der urspruengliche Rhythmus bleibt erhalten.

Beispiel: Eine Aufgabe waere am 18. faellig und wiederholt sich alle 7 Tage. Wenn sie am 19. uebersprungen wird, springt sie auf den 25. statt auf den 26.

## Warum Bearbeiten und Loeschen in `Alle`?

Die Heute-Ansicht soll ruhig bleiben. Bearbeiten und Loeschen sind Verwaltungsaktionen, keine Tagesaktionen.

Deshalb:

- `Heute`: machen, verschieben, ueberspringen
- `Alle`: verwalten, bearbeiten, loeschen

## Technische Notiz

Die Datumslogik liegt in `src/lib/tasks.ts`.

Das ist wichtig, weil Wiederholung spaeter auch im Backend oder in Tests gebraucht wird. Wenn die Logik nur in der UI steckt, wird sie schwerer wiederzuverwenden.

## Startdatum

Das Startdatum ist die erste Faelligkeit einer Aufgabe.

Beispiel: Wenn eine neue Aufgabe erst naechste Woche starten soll, wird sie nicht heute angezeigt, sondern erst ab diesem Datum faellig.

## Noch nicht umgesetzt

- Loeschen mit Rueckfrage
- Bearbeiten des Faelligkeitsdatums
- Aufgabe pausieren
- Historie einzelner Erledigungen
- dauerhafte Speicherung in Supabase
