# Hausmeisterservice Nowak – Website

Premium-Website für den Hausmeisterservice Nowak: regionaler Rundum-Dienstleister für Haus, Garten und Grundstück. Das Konzept steht in `CLAUDE.md`.

## Aufbau

Statische Website ohne Build-Schritt:

- `index.html` – Startseite (One-Pager mit allen Sektionen)
- `impressum.html` / `datenschutz.html` – rechtliche Seiten (Platzhalter, vor Livegang ausfüllen)
- `css/styles.css` – komplettes Styling (Farbwelt, Glassmorphism, Animationen, Responsive)
- `js/main.js` – Scroll-Animationen, Zähler, mobiles Menü, Kontaktformular
- `assets/favicon.svg` – Favicon mit Blatt-Logo
- `assets/img/` – Fotos (aus den gelieferten Collagen zugeschnitten und als JPG optimiert)

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Oder `index.html` direkt im Browser öffnen.

## Vor dem Livegang

1. **Kontaktdaten prüfen:** Telefonnummer und E-Mail-Adresse in `index.html` (Hero, Kontakt, Footer) durch die echten Daten ersetzen.
2. **Formular anbinden:** Das Kontaktformular öffnet aktuell eine vorausgefüllte E-Mail. Für den Live-Betrieb einen Dienst wie Formspree oder ein serverseitiges Skript in `js/main.js` anbinden.
3. **Impressum & Datenschutz ausfüllen:** Platzhalter in eckigen Klammern ersetzen und rechtlich prüfen lassen.
4. **Webfonts lokal hosten:** Google Fonts werden aktuell extern geladen – für DSGVO-Konformität lokal einbinden.
