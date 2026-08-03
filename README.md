# Hausmeisterservice Nowak – Website

Premium-Website für den Hausmeisterservice Nowak: regionaler Rundum-Dienstleister für Haus, Garten und Grundstück. Das Konzept steht in `CLAUDE.md`.

## Aufbau

Statische Website ohne Build-Schritt:

- `index.html` – Startseite (One-Pager mit allen Sektionen)
- `impressum.html` / `datenschutz.html` – rechtliche Seiten (Platzhalter, vor Livegang ausfüllen)
- `css/styles.css` – komplettes Styling (Farbwelt, Glassmorphism, Animationen, Responsive)
- `js/main.js` – Scroll-Animationen, Zähler, mobiles Menü, Kontaktformular
- `assets/favicon.svg` – Favicon mit Blatt-Logo

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Oder `index.html` direkt im Browser öffnen.

## Vor dem Livegang

1. **Echte Fotos einsetzen:** Die SVG-Illustrationen im Hero (`.hero__image`) und im Über-uns-Bereich (`.about__image`) sind Platzhalter. Echte Fotos vom Team und von Einsätzen wirken deutlich stärker.
2. **Kontaktdaten prüfen:** Telefonnummer und E-Mail-Adresse in `index.html` (Hero, Kontakt, Footer) durch die echten Daten ersetzen.
3. **Formular anbinden:** Das Kontaktformular öffnet aktuell eine vorausgefüllte E-Mail. Für den Live-Betrieb einen Dienst wie Formspree oder ein serverseitiges Skript in `js/main.js` anbinden.
4. **Impressum & Datenschutz ausfüllen:** Platzhalter in eckigen Klammern ersetzen und rechtlich prüfen lassen.
5. **Webfonts lokal hosten:** Google Fonts werden aktuell extern geladen – für DSGVO-Konformität lokal einbinden.
