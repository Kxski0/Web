# Referenzen

Eine kleine Web-App, um inspirierende Websites zu sammeln: **Link + Screenshot vom Hero-Bereich + kurze Notiz**.
Gedacht als schneller Ideenspeicher für neue Webdesign-Aufträge.

## Funktionen

- **Hinzufügen** – Link, Hero-Screenshot (ziehen, ⌘V einfügen oder auswählen), Titel, Beschreibung, Tags
- **Übersicht** – Karten-Grid, ein Klick öffnet die Website in einem neuen Tab
- **Finden** – Volltextsuche und Tag-Filter, Sortierung nach neu/alt/Titel
- **Bearbeiten & Löschen** – über den Stift oben rechts auf jeder Karte
- **Backup** – Export und Import als JSON-Datei (inklusive Bilder)
- **Installierbar** – als App auf iPad, iPhone und Desktop; funktioniert offline

## Datenhaltung

Alles bleibt lokal im Browser (IndexedDB), es gibt keinen Server und keine externen Requests.
Screenshots werden beim Hinzufügen automatisch auf max. 1600 px verkleinert und als WebP gespeichert.

Wichtig: Die Daten hängen am jeweiligen Browser bzw. Gerät. Für einen Umzug oder als Sicherung das
Backup unter „⋯ → Backup exportieren“ nutzen.

## Installieren

- **iPad / iPhone (Safari):** Seite öffnen → Teilen-Symbol → „Zum Home-Bildschirm“
- **PC (Chrome/Edge):** Seite öffnen → Installations-Symbol in der Adressleiste → „Installieren“

## Tastenkürzel

| Taste | Aktion |
| --- | --- |
| `N` | Neue Referenz |
| `⌘/Strg + K` | Suche fokussieren |
| `⌘/Strg + ⏎` | Sichern |
| `Esc` | Schließen |
| `⌘/Strg + V` | Screenshot aus der Zwischenablage einfügen |

## Aufbau

Statische Seite ohne Build-Schritt:

```
index.html             Struktur
styles.css             Design (Light/Dark, Apple-nah)
app.js                 Logik, IndexedDB, Bildverarbeitung
sw.js                  Service Worker (Offline)
manifest.webmanifest   PWA-Manifest
icons/                 App-Icons
```

Lokal starten: `python3 -m http.server 8000` und `http://localhost:8000` öffnen.
