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

## 5. Kontaktformular scharf schalten — blockiert Anfragen

Das Formular unter `/kontakt/` ist vollständig gebaut, validiert serverseitig und
hat einen Honeypot gegen Bots. **Es stellt aber nichts zu**, weil kein Ziel
konfiguriert ist: `/api/kontakt` antwortet mit HTTP 503 und einer klaren Meldung,
statt einen Erfolg vorzutäuschen und echte Anfragen zu verlieren.

Zum Freischalten `CONTACT_WEBHOOK_URL` setzen (siehe `.env.example`) — ein
Endpunkt, der einen JSON-POST annimmt. Kein Codeänderung nötig.

Offen bleibt außerdem, wo hochgeladene Fotos gespeichert werden sollen. Aktuell
werden nur Dateiname, Größe und Typ weitergereicht, nicht die Datei selbst. Das
ist auch eine Datenschutzentscheidung und gehört vor die Freischaltung.

## 6. Rechtliche Seiten — blockiert den Livegang

`/impressum/` und `/datenschutz/` existieren, sind aber **bewusst unvollständig**
und mit einem sichtbaren Hinweis versehen. Beide sind auf `noindex` gesetzt.

- **Impressum:** Firmierung, Rechtsform, Anschrift, Vertretungsberechtigte,
  Registergericht und -nummer, USt-IdNr. Eine unvollständige Anbieterkennzeichnung
  ist in Deutschland abmahnfähig — die Seite darf so nicht öffentlich gehen.
- **Datenschutz:** Verantwortlicher, Hosting-Dienstleister und AV-Vertrag nach
  Art. 28 DSGVO. Die technischen Abschnitte sind gegen den tatsächlichen Code
  geschrieben (keine Cookies, kein Tracking, selbst gehostete Schriften) und
  stimmen. Vor Veröffentlichung dennoch juristisch prüfen lassen.

## 7. Regionale SEO-Landingpages — noch nicht gebaut

Das Master Concept nennt `/photovoltaik-augsburg/` und drei weitere. Sie sind
bewusst **nicht** gebaut: §9 verbietet kopierte Local-SEO-Seiten, und ohne
belegte lokale Inhalte wären 1.000–1.800 Wörter pro Seite entweder generischer
Text im Regionalkostüm oder erfundene Fakten.

Belastbar wären zum Beispiel: typische Dachformen und Bauweisen in Ihren
Einsatzgebieten, der zuständige Netzbetreiber und dessen Anmeldepraxis,
Erfahrungen mit Gestaltungssatzungen und Denkmalschutz in bestimmten Vierteln,
sowie regionale Referenzen. Liefern Sie dazu Material, entstehen daraus echte
Seiten.

## 8. Logo — Negativfassung fehlt

Das echte Logo ist eingebaut. Der Platzhalter ist entfernt.

**Das Problem:** Das Logo ist für helle Hintergründe gezeichnet. Gemessen gegen
den Graphit-Grund der Seite liegen **50,2 % der sichtbaren Logofläche unter 3:1
Kontrast** — das „Bau" im Schriftzug, das Haus und das Modul sind nahezu
schwarz und verschwinden. Übrig bliebe „Sol Tec" unter einer Sonne.

Die Grafik wurde deshalb **nicht** umgefärbt. Stattdessen:

- **Footer** — helle Fläche, volles Lockup mit Claim. Der Footer läuft eigens
  hell, damit die Marke eine Fläche hat, auf der sie funktioniert.
- **Header über heller Section** — kompaktes Lockup ohne Claim.
- **Header über dunkler Section** — typografischer Schriftzug als Übergang.
- **Favicon und App-Icon** — Bildmarke auf hellem Grund.

**Benötigt:** die offizielle Negativfassung des Logos für dunkle Hintergründe
(als SVG, mit heller Wortmarke und hellem Haus). Damit ersetzen wir den
typografischen Übergang, und das Logo wird auf der ganzen Seite sichtbar.

**Zur Bestätigung:** Für den Header nutzen wir eine Fassung **ohne die Zeile
SMART · NACHHALTIG · ZUKUNFTSSTARK**, weil sie in einer Kopfleiste etwa fünf
Pixel hoch würde und als Rauschen liest. Das Weglassen des Claims bei kleinen
Anwendungen ist üblich, ist aber eine Anpassung an einem gelieferten Asset —
bitte kurz bestätigen oder widersprechen.

Alle Ableitungen entstehen reproduzierbar aus der Originaldatei über
`node scripts/brand-assets.mjs <pfad-zum-logo>`; es wird nur zugeschnitten,
nie umgefärbt.

## 9. Produktionsdomain

`SITE.url` in `src/content/site.ts` steht auf `https://www.solbautec.de`. Bei
abweichender Domain hier ändern — Canonical, Open Graph, Sitemap und robots.txt
leiten sich daraus ab.
