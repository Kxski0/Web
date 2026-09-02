# Inhalte, die von SolBauTec kommen müssen

Das Master Concept (§43) verbietet erfundene Fakten. Alles hier Aufgeführte
fehlt derzeit und wird deshalb **nicht gerendert** — die entsprechenden Datenfelder
sind leer, und die Komponenten geben bei leerer Eingabe nichts aus. Es gibt
keine Platzhalter-Referenzen und keine erfundenen Zahlen.

Hintergrund: `solbautec.de` ist aus der Build-Umgebung nicht erreichbar
(Egress-Policy der Organisation, 403 auf CONNECT). Die bestehenden Inhalte
konnten daher nicht ausgelesen werden.

---

## 1. Impressums- und Kontaktdaten — blockiert das LocalBusiness-Schema

Datei: `src/content/site.ts`

Benötigt:

- vollständige Firmierung inkl. Rechtsform
- Straße, PLZ, Ort
- Telefon
- E-Mail
- Geschäftsführung
- Handelsregister und Registergericht
- USt-IdNr.

Sobald bestätigt: Werte in `CONTACT` eintragen und `verified: true` setzen. Erst
dann gibt `src/lib/schema.ts` `LocalBusiness` statt `Organization` aus.

> In `CONTACT_CANDIDATES_UNVERIFIED` liegen Kontaktdaten aus einer Websuche
> (Höchstetterstraße 12, 86154 Augsburg · +49 152 14764440 · info@solbautec.de).
> Das ist eine **Zusammenfassung Dritter, keine Primärquelle**. Sie wird nirgends
> ausgegeben. Bitte prüfen, bevor sie übernommen wird.

## 2. Referenzprojekte

Datei: `src/content/projects.ts`

Pro Projekt:

- Standort (Ort genügt)
- Gebäudetyp und Baujahr
- tatsächlich verbaute Komponenten
- Umsetzungszeitraum
- Ergebnis in einem Satz, belegbar
- Foto plus schriftliche Freigabe des Eigentümers

## 3. Vertrauensbelege

Datei: `src/content/trust.ts`

- **Bewertungen:** Wortlaut, Name (oder Kürzel), Plattform und Link zur
  öffentlich prüfbaren Quelle.
- **Zertifikate:** Bezeichnung und ausstellende Stelle.
- **Partner/Hersteller:** nur solche mit tatsächlicher Geschäftsbeziehung, plus
  Logo-Nutzungsrecht.
- **Kennzahlen:** jede Zahl braucht eine Grundlage (Feld `basis`). Eine Zahl ohne
  nachvollziehbare Herkunft ist eine erfundene Zahl und wird nicht eingebaut.

## 4. Bildmaterial — offener Slot

14 der 15 in §24 genannten Motive sind geliefert und zugeordnet. Nicht geliefert:

- `installation-tools` — Werkzeug-Stillleben ohne Person.

Wird in Push 1 nicht gebraucht. Falls es nachkommt: in
`scripts/process-images.mjs` unter `MAP` ergänzen und `pnpm images <quellordner>`
laufen lassen.

## 5. Logo

`src/app/icon.svg` ist ein **Platzhalter**, kein Firmenlogo. Es ist aus der
Bildsprache der Seite gezeichnet (Giebel und Modulfläche aus dem
Energiesystem-Diagramm), weil kein Logo vorlag und ein erfundenes ausgeschlossen
ist. Bitte durch das echte Markenzeichen ersetzen — idealerweise als SVG plus
eine Fassung für kleine Größen.

## 6. Produktionsdomain

`SITE.url` in `src/content/site.ts` steht auf `https://www.solbautec.de`. Bei
abweichender Domain hier ändern — Canonical, Open Graph, Sitemap und robots.txt
leiten sich daraus ab.
