# Haushaltsplaner: Produktkonzept

## Ziel

Wir bauen zuerst eine Web-App fuer Haushaltsaufgaben. Die App soll privat und klein starten, aber technisch so geplant sein, dass mehrere Personen sie nutzen koennen. Wichtig ist: Es gibt keine geteilten Konten. Jede Person meldet sich mit einem eigenen Konto an.

Die App soll zwei Nutzungsarten abdecken:

- Eine Person nutzt die App alleine.
- Mehrere Personen nutzen gemeinsam einen Haushalt, zum Beispiel als Paar oder WG.

## Warum zuerst als Web-App?

Eine Web-App ist fuer den Start sinnvoll, weil wir damit schneller ein gutes erstes Produkt bauen koennen. Sie funktioniert auf Desktop und Smartphone und kann spaeter als Progressive Web App erweitert werden. Eine native App fuer iOS oder Android waere aufwendiger, weil Build-Prozesse, App Stores und plattformspezifische Benachrichtigungen dazukommen.

Die Web-App ist also kein Kompromiss im schlechten Sinn, sondern ein pragmatischer Start:

- schneller entwickelbar
- leichter zu testen
- guenstiger zu betreiben
- spaeter erweiterbar

Wenn wir irgendwann merken, dass native Handy-Funktionen unverzichtbar werden, koennen wir die Web-App mit Capacitor oder einer aehnlichen Loesung in Richtung native App bringen.

## Kernfunktionen fuer die erste Version

### Aufgaben fuer heute

Die Startseite zeigt alles, was heute faellig ist. Dazu gehoeren:

- heutige Aufgaben
- ueberfaellige Aufgaben
- bereits erledigte Aufgaben des Tages
- schnelle Aktion zum Abhaken

Warum: Die App soll im Alltag nicht wie ein Verwaltungsmonster wirken. Die wichtigste Frage ist jeden Tag: "Was ist heute dran?"

### Wiederkehrende Aufgaben

Aufgaben sollen nach Zeitspannen wiederkehren, zum Beispiel:

- alle 7 Tage
- alle 14 Tage
- alle 30 Tage
- alle 3 Monate
- frei definierte Intervalle

Beispiele:

- Bettwaesche wechseln
- Kuehlschrank auswischen
- Bad Deep Clean
- Waschmaschine reinigen
- Vorratsschrank pruefen

Warum: Haushaltsaufgaben sind selten einmalige Aufgaben. Der eigentliche Wert liegt darin, dass die App die naechste Faelligkeit automatisch berechnet.

### Aufgabenpool

Die App soll einen umfangreichen Pool vorbereiteter Aufgaben enthalten. Nutzerinnen und Nutzer koennen daraus Aufgaben uebernehmen, statt alles selbst ausdenken zu muessen.

Der Pool enthaelt pro Aufgabe idealerweise:

- Titel
- Kategorie
- empfohlene Wiederholung
- kurze Beschreibung
- geschaetzte Dauer
- optionale Hinweise

Warum: Ein leerer Aufgabenplaner ist anstrengend. Ein guter Aufgabenpool hilft beim Start und macht die App sofort nuetzlich.

### Eigene Aufgaben

Nutzerinnen und Nutzer koennen eigene Aufgaben anlegen, wenn etwas Spezielles fehlt.

Beispiele:

- Aquariumfilter reinigen
- Pflanzen duengen
- Katzenklo komplett reinigen
- Balkonmoebel pflegen

Warum: Kein Haushalt ist identisch. Der Aufgabenpool darf helfen, aber nicht begrenzen.

### Haushalte und Gruppen

Die App soll Haushalte unterstuetzen. Ein Haushalt kann eine oder mehrere Personen haben.

Beispiele:

- Einzelperson
- Paar
- WG
- Familie

Alle Mitglieder eines Haushalts sehen die gemeinsamen Aufgaben. Aufgaben koennen optional einer Person zugewiesen werden, muessen es aber nicht.

Warum: So funktioniert die App allein und gemeinsam. Wir muessen spaeter nicht alles umbauen, wenn aus Einzelbetrieb ein Paar- oder WG-Betrieb wird.

### Erinnerungen

Es soll morgens und abends Erinnerungen geben.

Morgens:

- Erinnerung an faellige Aufgaben
- bewusst mit leichtem Druck und Humor

Abends:

- nur, wenn Aufgaben noch offen sind
- staerker vorwurfsvoll, aber witzig

Wenn Push-Benachrichtigungen nicht moeglich oder nicht erlaubt sind, soll E-Mail als Fallback genutzt werden.

Warum: Web Push ist praktisch, aber nicht auf jedem Geraet und in jeder Browser-Situation verlaesslich. E-Mail ist weniger elegant, aber robuster.

## Ton der App

Die App soll nicht trocken und buerokratisch wirken. Sie darf freundlich, ein bisschen frech und humorvoll sein.

Beispiel fuer morgens:

"Guten Morgen. Der Haushalt hat bereits eine kleine Liste mit Beschwerden eingereicht."

Beispiel fuer abends:

"Die offenen Aufgaben sind noch da. Sie haben sich inzwischen zusammengerottet und wirken enttaeuscht."

Wichtig: Der Ton soll motivieren, nicht wirklich beschamen. Humor ja, echte Gemeinheit nein.

## Nicht in der ersten Version

Diese Dinge sind interessant, aber nicht fuer den ersten Sprint noetig:

- native iOS-/Android-App
- komplexe Gamification
- Punkte, Level oder Ranglisten
- Kalender-Synchronisation
- KI-generierte Aufgabenplaene
- wiederkehrende Einkaufslisten
- App-Store-Vertrieb

Warum: Der erste Fokus muss auf dem verlaesslichen Kern liegen: Aufgaben, Wiederholung, Haushalt, Heute-Ansicht und Erinnerungen.
