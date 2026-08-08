# ClearWay Gebäudeservice – Website

Statische Premium-Website für ClearWay Gebäudeservice, Ludwigsburg.
Design-Leitidee: **Glas** – Transparenz, Licht, Blur und Klarheit („ClearWay Glass").

## Struktur

```
clearway/
├── *.html              generierte Seiten (direkt nutzbar, kein Build nötig)
├── css/style.css       Designsystem mit zentralen Tokens (:root)
├── js/main.js          Interaktionen (Nav, Slider, Reveals – dependency-frei)
├── assets/img/         optimierte WebP-Bilder (aus den Original-Collagen zugeschnitten)
├── assets/fonts/       lokal gehostete Variable Fonts (Sora, Inter – SIL OFL)
├── robots.txt / sitemap.xml
└── _src/               Quelle & Werkzeuge
    ├── build.py        Generator: setzt Header/Footer/SEO/Schema zentral ein
    ├── validate.py     Qualitätsprüfung (H1, Alt-Texte, Links, Meta, NAP …)
    ├── base.html       Seiten-Grundgerüst
    ├── partials/       Header & Footer
    └── pages/          Inhalt der einzelnen Seiten (mit META-Block)
```

## Arbeiten am Projekt

Änderungen **immer** in `_src/` machen, dann neu bauen – nie direkt in den
generierten HTML-Dateien:

```bash
cd clearway
python3 _src/build.py      # Seiten neu generieren
python3 _src/validate.py   # Qualitätsprüfung (Exit-Code 1 bei Fehlern)
python3 -m http.server     # lokal ansehen: http://localhost:8000
```

## Vor dem Livegang zu ergänzen (bewusst nicht erfunden)

In `_src/build.py` oben zentral eintragen und neu bauen:

1. **Telefonnummer** (`COMPANY["phone"]` / `phone_display`) – erscheint dann
   automatisch in Navigation, Footer, Kontaktseite und Schema.
2. **E-Mail-Adresse** (`COMPANY["email"]`).
3. **Domain** (`BASE_URL`) – aktiviert Canonical-Tags, og:url und absolute
   Sitemap-URLs.
4. **Impressum & Datenschutz**: Platzhalter in `_src/pages/impressum.html`
   und `datenschutz.html` ausfüllen und rechtlich prüfen lassen.
5. Optional: Chef-/Inhaber-Bilder und -Name für einen persönlichen Bereich
   auf „Über uns" (Material lag beim Bau noch nicht vor).

## Kontaktformular anbinden

Die Kontaktseite enthält ein vollständiges Formular (Validierung, Honeypot-
Spamschutz, Datenschutz-Checkbox). Es täuscht **keinen** Versand vor: Solange
kein Backend verbunden ist, informiert es ehrlich und bietet an, die Anfrage
als Text zu kopieren.

Zum Scharfschalten in `js/main.js` die Konstante `FORM_ENDPOINT` mit der URL
eines Formular-Backends füllen (eigener Server, Formspree, Web3Forms o. ä.):

```js
var FORM_ENDPOINT = 'https://…';  // POST, FormData, Accept: application/json
```

Danach sendet das Formular per `fetch` und zeigt echte Erfolgs-/Fehlerzustände.
Vor dem Livegang: Datenschutzerklärung um den Formular-Abschnitt ergänzen.
