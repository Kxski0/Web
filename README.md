# Hausmeisterservice Nowak – Website

Premium-Website für den Hausmeisterservice Nowak: regionaler Rundum-Dienstleister für Haus, Garten und Grundstück. Das inhaltliche Konzept steht in `CLAUDE.md`.

Statische Website ohne Build-Schritt – HTML, CSS und ein wenig JavaScript.

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite mit Überblick, Leistungsmosaik und Vorher/Nachher-Showcase |
| `gartenpflege.html` | Gartenpflege im Jahreslauf |
| `winterdienst.html` | Winterdienst mit Räumpflicht und Einsatzprotokoll |
| `objektbetreuung.html` | Objektbetreuung für Vermieter und Hausverwaltungen |
| `renovierung.html` | Kleinreparaturen und Renovierung |
| `entruempelung.html` | Entrümpelung und Haushaltsauflösung |
| `treppenhausreinigung.html` | Treppenhausreinigung im festen Turnus |
| `baumschnitt.html` | Hecken- und Baumschnitt mit Schnittkalender |
| `grundstueckspflege.html` | Grundstückspflege mit Pflegepaketen |
| `impressum.html`, `datenschutz.html` | Rechtliches (Platzhalter, vor Livegang ausfüllen) |

## Aufbau

- `css/styles.css` – Design-System: Farbtokens, Typografie, Komponenten, Responsive. Seitenspezifische Animationen stehen als kleiner `<style>`-Block im Kopf der jeweiligen Unterseite, damit jede Seite nur lädt, was sie braucht.
- `js/main.js` – Navigation, Scroll-Reveals, Zähler, Parallax, Vorher/Nachher-Showcase, Sticky-Timeline, Scroll-Scrub und Sequenzen.
- `assets/img/` – Fotos als JPG und WebP.
- `sitemap.xml`, `robots.txt` – für die Suchmaschinen.

### Wiederverwendbare Animations-Hooks

| Attribut | Wirkung |
| --- | --- |
| `data-parallax="0.16"` | Element bewegt sich beim Scrollen mit dem angegebenen Faktor |
| `data-scrub` | Setzt die CSS-Variable `--scrub` (0–1) nach Scroll-Fortschritt |
| `data-sequence="180"` | Aktiviert enthaltene `.seq`-Kinder nacheinander im angegebenen Abstand |
| `data-tilt` | Leichte 3D-Neigung zur Mausposition |
| `data-magnet` | Button folgt der Maus ein paar Pixel |
| `data-showcase` | Vorher/Nachher-Showcase mit Ziehen, Reitern und weicher Kante |

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Vor dem Livegang

1. **Kontaktdaten ersetzen:** Telefonnummer (`0170 123 45 67`) und E-Mail-Adresse stehen in allen HTML-Dateien sowie im Schema.org-Block der Startseite.
2. **Domain anpassen:** Canonical-URLs, Open-Graph-Bilder, `sitemap.xml` und `robots.txt` zeigen auf `www.hausmeisterservice-nowak.de`.
3. **Formular anbinden:** Das Kontaktformular öffnet aktuell eine vorausgefüllte E-Mail. Für den Live-Betrieb einen Dienst wie Formspree oder ein serverseitiges Skript in `js/main.js` anbinden.
4. **Impressum & Datenschutz ausfüllen:** Platzhalter in eckigen Klammern ersetzen und rechtlich prüfen lassen.
5. **Webfonts lokal hosten:** Bricolage Grotesque und Figtree werden aktuell von Google Fonts geladen – für DSGVO-Konformität lokal einbinden und den Hinweis im Datenschutztext streichen.
6. **Adresse ergänzen:** Im Schema.org-Block der Startseite fehlt `address` und `geo`, sobald die echte Anschrift feststeht – das verbessert die lokale Sichtbarkeit deutlich.
