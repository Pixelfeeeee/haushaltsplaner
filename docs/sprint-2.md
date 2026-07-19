# Sprint 2: Raeume und Navigation

## Ziel

Die App soll im Alltag schneller erfassbar werden. Aufgaben werden nicht nur als Tagesliste gezeigt, sondern koennen auch nach Raeumen betrachtet werden.

## Umgesetzt

- mobile-first Aufbau der Hauptoberflaeche
- Bottom-Navigation mit vier Bereichen
- Heute-Ansicht bleibt als reduziertes Dashboard ohne Demnaechst-Vorschau
- Morgen-Ansicht zeigt vertagte oder fuer morgen geplante Aufgaben
- Raeume-Ansicht gruppiert Aufgaben nach Kueche, Bad, Schlafzimmer, Wohnzimmer, Waesche, Flur und Allgemein
- Alle-Ansicht zeigt alle offenen Aufgaben als Basis fuer spaetere Bearbeitung
- jede Aufgabe hat ein `roomId`
- jeder Raum hat Name und Farbe
- Raumfarbe wird als kleiner Punkt bzw. Tag dargestellt
- "auf morgen schieben" wird als kompakter Pfeil statt als Textbutton gezeigt
- Theme-Script aus dem Layout entfernt, damit keine Script-/Hydration-Issues entstehen

## Warum eine Bottom-Navigation?

Die App soll vor allem auf dem Smartphone schnell bedienbar sein. Eine Navigation am unteren Rand ist dort leichter erreichbar als ein Menue oben.

Die vier Bereiche sind bewusst knapp:

- `Heute`: Was ist jetzt dran?
- `Morgen`: Was wurde verschoben oder ist morgen dran?
- `Raeume`: Was steht in einem bestimmten Bereich der Wohnung an?
- `Alle`: Welche Aufgaben gibt es insgesamt?

## Mobile-first

Mobile-first bedeutet: Die Basis-Styles sind fuer kleine Bildschirme geschrieben. Groessere Bildschirme bekommen nur Zusatzregeln.

Warum: Die App soll im Alltag vor allem am Handy funktionieren. Deshalb darf Desktop nicht die Hauptperspektive sein.

## Warum keine Demnaechst-Liste in Heute?

Die Heute-Ansicht soll nicht ueberfordern. Wenn dort auch morgen und spaetere Aufgaben sichtbar sind, entsteht schnell das Gefuehl, dass alles gleichzeitig dran ist.

Deshalb gilt:

- Heute zeigt nur heute faellige Aufgaben und kleine Kennzahlen
- Morgen hat eine eigene Ansicht
- weitere Aufgaben liegen in `Alle` oder in `Raeume`

## Warum Raeume?

Haushalt wird oft raeumlich gedacht. Wenn man in der Kueche steht, ist eine Kuechenliste praktischer als eine globale Aufgabenliste.

Ausserdem hilft die Raumstruktur spaeter bei:

- Aufgabenpool
- Filtern
- gemeinsamen Haushalten
- Erinnerungen
- Statistiken

## Raumfarben

Die Farben liegen zentral in `rooms`.

Das ist wichtig, weil eine spaetere Funktion "Raumfarbe bearbeiten" dann nur die Raumdefinition aendern muss. Die Aufgaben behalten ihr `roomId` und zeigen automatisch die neue Farbe.

Noch nicht umgesetzt ist ein Einstellungsdialog fuer eigene Raumfarben. Das ist bewusst ein Folgeschritt, weil zuerst die Grundnavigation stabil sein soll.

## Warum nur ein subtiler Punkt?

Die Oberflaeche soll ruhig bleiben. Volle farbige Karten wuerden schnell unruhig wirken. Ein kleiner Punkt oder Tag reicht, damit das Auge Raeume schneller erkennt.

## Nebenfix: Theme ohne Inline-Script

Die vorherige Loesung nutzte ein Theme-Script im Layout. Im Next.js-Entwicklungsmodus entstanden dadurch Script-Hinweise.

Die neue Loesung:

- kein Script mehr im Layout
- Theme wird in der Client-Komponente initialisiert
- `useSyncExternalStore` liest den aktuellen Theme-Zustand

Der kleine Nachteil: Beim allerersten Laden kann fuer einen sehr kurzen Moment das Standard-Theme sichtbar sein. Dafuer ist die HTML-Struktur sauber und Next.js meldet keine Script-Probleme mehr.

## Noch nicht umgesetzt

- Aufgaben bearbeiten
- Raeume bearbeiten
- eigene Raumfarben ueber UI waehlen
- Swipe-Geste nach rechts als bequemere Variante fuer "auf morgen schieben"
- Fokusmodus als echte Ein-Aufgaben-Ansicht
- persistente Speicherung in Datenbank
