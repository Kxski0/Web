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

## Temporär hosten (Kundenvorschau)

Die Website ist rein statisch und läuft daher auf jedem Webspace.

### Empfohlen: GitHub Pages

Kostenlos, weil das Repository öffentlich ist, mit sauberer URL und automatischer Aktualisierung bei jedem Push. Der Workflow `.github/workflows/pages.yml` liegt bereits im Repository und übernimmt das Veröffentlichen.

**GitHub Pages muss einmalig eingeschaltet werden** – das kann kein Skript und kein Automatisierungs-Token, GitHub verlangt dafür den Repository-Besitzer:

1. https://github.com/Kxski0/Web/settings/pages öffnen
2. Unter *Build and deployment* → *Source*: **GitHub Actions** wählen
3. Unter *Actions* den Workflow „Vorschau veröffentlichen" erneut starten
   (oder einfach den nächsten Push abwarten)

Danach ist die Seite erreichbar unter **https://kxski0.github.io/Web/**

### Ohne Einrichtung: Direktlink über einen CDN-Spiegel

Funktioniert sofort, ohne Klick, weil das Repository öffentlich ist:

```
https://rawcdn.githack.com/Kxski0/Web/f1ce492453fac9101db1bfcabbea20526c9ef99b/index.html
```

Der Link zeigt fest auf diesen einen Stand. Nach neuen Commits braucht man einen neuen Link mit der aktuellen Commit-ID (`git rev-parse HEAD`). Für eine schnelle Rückmeldung reicht das; für die Kundenpräsentation ist GitHub Pages die bessere Wahl.

### Später: eigene Domain

Sobald die Domain steht, den Inhalt des Repositorys per FTP auf den Webspace laden – oder bei GitHub Pages unter *Settings → Pages → Custom domain* die Domain eintragen und beim Domain-Anbieter einen CNAME auf `kxski0.github.io` setzen.

**Hinweis zur Suchmaschine:** Die Canonical-Tags zeigen bereits auf die spätere Domain, dadurch indexiert Google die Vorschau-URL in aller Regel nicht. Wer ganz sichergehen will, setzt für die Dauer der Vorschau in `robots.txt` ein `Disallow: /` und entfernt es vor dem Livegang wieder.

## Vor dem Livegang

1. **Kontaktdaten ersetzen:** Telefonnummer (`0170 123 45 67`) und E-Mail-Adresse stehen in allen HTML-Dateien sowie im Schema.org-Block der Startseite.
2. **Domain anpassen:** Canonical-URLs, Open-Graph-Bilder, `sitemap.xml` und `robots.txt` zeigen auf `www.hausmeisterservice-nowak.de`.
3. **Formular anbinden:** Das Kontaktformular öffnet aktuell eine vorausgefüllte E-Mail. Für den Live-Betrieb einen Dienst wie Formspree oder ein serverseitiges Skript in `js/main.js` anbinden.
4. **Impressum & Datenschutz ausfüllen:** Platzhalter in eckigen Klammern ersetzen und rechtlich prüfen lassen.
5. **Webfonts lokal hosten:** Bricolage Grotesque und Figtree werden aktuell von Google Fonts geladen – für DSGVO-Konformität lokal einbinden und den Hinweis im Datenschutztext streichen.
6. **Adresse ergänzen:** Im Schema.org-Block der Startseite fehlt `address` und `geo`, sobald die echte Anschrift feststeht – das verbessert die lokale Sichtbarkeit deutlich.
