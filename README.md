# RuhrCargo GmbH — Website

Moderne, conversionstarke Website für ein Speditions- und Logistikunternehmen.
Statisches HTML/CSS/JS, keine Build-Tools, keine Abhängigkeiten, keine externen Requests.

**Designwelt:** „Signal & Asphalt" — Asphaltschwarz, Signalrot, große Grotesk-Typografie,
technische Mono-Annotationen und Route-/GPS-Motive. Dunkle und helle Sektionen wechseln
sich ab, damit Fahrzeugbilder maximal wirken.

---

## Vor dem Livegang — Checkliste

| # | Aufgabe | Wo |
|---|---|---|
| 1 | **Telefonnummer eintragen** — § 5 DDG verlangt sie zwingend | `tools/content.py` → `phone_display`, `phone_href`, dann `phone_is_placeholder` auf `False` |
| 2 | **Domain prüfen** — steuert Canonicals, Sitemap, robots.txt, Open Graph | `tools/content.py` → `SITE["domain"]` |
| 3 | **USt-IdNr.** ergänzen, sobald sie vorliegt | `tools/legal.py` |
| 4 | **Aufsichtsbehörde** für den Güterkraftverkehr ergänzen | `tools/legal.py` |
| 5 | **Öffnungszeiten** bestätigen | `tools/content.py` → `hours` |
| 6 | **Datenschutzerklärung** juristisch prüfen lassen | `tools/legal.py` |
| 7 | **Formular-Empfang** einrichten | `js/main.js` → `CONFIG.formEndpoint` |
| 8 | **AV-Vertrag** mit dem Hoster abschließen | organisatorisch |
| 9 | **Kundenlogos** einsetzen oder Bereich entfernen | `tools/build.py` → `build_unternehmen` |
| 10 | Sitemap in der **Google Search Console** einreichen | `https://…/sitemap.xml` |

Nach jeder Änderung an `tools/` muss `python3 tools/build.py` laufen.

Alle Platzhalter finden:

```bash
grep -rn "TODO:" tools/ && grep -rn "000 00 00" *.html
```

### Firmendaten (Stand: bestätigt)

```
RuhrCargo GmbH
Florianstraße 15-21, 44139 Dortmund
Geschäftsführer: Melih Arik
Amtsgericht Dortmund, HRB 38662
info@ruhrcargo.net
Telefon: fehlt noch
```

## Bildmaterial

Alle Fotos und das Logo stammen vom Kunden und sind eingebunden. Die Kontaktbögen
wurden in Einzelbilder zerlegt, motivgerecht auf die Zielformate zugeschnitten und
für das Web komprimiert.

### Logo

| Datei | Verwendung |
|---|---|
| `assets/logo-wordmark-light.png` | Header — Chevrons + „RuhrCargo", weiß, für dunklen Grund |
| `assets/logo-wordmark.png` | dieselbe Wortmarke in Originalfarben, für hellen Grund |
| `assets/logo-light.png` | vollständige Wort-Bild-Marke inkl. Claim, weiß — Footer |
| `assets/logo.png` | vollständige Wort-Bild-Marke in Originalfarben |
| `assets/logo-mark.png` | nur die Chevrons — Wasserzeichen im Kontaktbereich |
| `assets/favicon.png` | Browser-Tab |
| `assets/og-image.jpg` | Vorschaubild für Social Media und WhatsApp |

Die hellen Varianten sind aus dem Original abgeleitet: Schwarz wurde zu Weiß, Rot
blieb unverändert. Bei einem Logo-Update alle Varianten neu erzeugen.

### Fotos

| Datei | Format | Motiv |
|---|---|---|
| `hero.jpg` | 1600 × 899 | Zwei Mitarbeiter vor dem Koffer-LKW |
| `band-unterwegs.jpg` | 1700 × 728 | Kleintransporter in der Stadt — Band „Deutschlandweit unterwegs" |
| `about.jpg` | 1100 × 879 | Das Team vor dem Betriebsgelände |
| `karte-deutschland.jpg` | 1000 × 625 | Streckennetz — Hintergrund im Kontaktbereich |
| `leistung-neumoebel.jpg` | 720 × 900 | Verpacktes Sofa wird in einen Wohnraum getragen |
| `leistung-elektrogeraete.jpg` | 720 × 899 | Waschmaschine über die Rampe in den Transporter |
| `leistung-stueckgut.jpg` | 720 × 899 | Gabelstapler mit folierter Palette |
| `leistung-kurier.jpg` | 720 × 901 | Zustellung an einem Bürogebäude |
| `leistung-umzuege.jpg` | 720 × 901 | Matratze im Treppenhaus |
| `fuhrpark-kofferlkw.jpg` | 1100 × 757 | Koffer-LKW mit Ladebordwand |
| `fuhrpark-moebelkoffer.jpg` | 1100 × 757 | Möbelkoffer beim Verladen |
| `fuhrpark-transporter.jpg` | 1500 × 642 | Kleintransporter bei der Zustellung |
| `kopf-*.jpg` (5 Stück) | 1500 × 643 | Breite Kopfbilder der Leistungs-Detailseiten |
| `kopf-fuhrpark.jpg` | 1500 × 643 | Kopfbild der Fuhrparkseite |

In `assets/img/reserve/` liegen die nicht verwendeten Motive — darunter alle
Bilder der entfernten Bereiche (Reifenlogistik, Messe- & Ladenbau,
Reha-Hilfsmittel, LKW) sowie das frühere Hero- und Bandmotiv mit dem Sattelzug.
Zum Zurückholen einfach über die gleichnamige Datei in `assets/img/` kopieren.

### Zur Auflösung

Die Fotos kamen als Kontaktbögen, die Einzelbilder waren daher nur rund
440–770 Pixel breit. Für die kleinen Formate reicht das aus. Beim **Hero, dem
Band und den beiden breiten Fuhrpark-Karten** wurde um Faktor zwei hochskaliert
und nachgeschärft — auf normalen Bildschirmen sichtbar sauber, auf sehr großen
4K-Displays etwas weich. Falls die Originaldateien in voller Auflösung
vorliegen, lohnt sich für diese vier Bilder ein Austausch:

```
assets/img/hero.jpg                  möglichst 2400 × 1350
assets/img/band-unterwegs.jpg        möglichst 2400 × 1029
assets/img/fuhrpark-lkw.jpg          möglichst 2100 × 900
assets/img/fuhrpark-transporter.jpg  möglichst 2100 × 900
```

Gleiche Dateinamen verwenden — dann muss am Code nichts geändert werden.
Die `width`/`height`-Attribute im HTML sollten zum neuen Seitenverhältnis passen,
sind aber unkritisch, solange das Verhältnis stimmt.

### Video statt Foto im Hero

In `index.html` das `<img>` im Block `.hero__media` ersetzen durch:

```html
<video autoplay muted loop playsinline poster="assets/img/hero.jpg">
  <source src="assets/video/hero.mp4" type="video/mp4">
</video>
```

Empfehlung: max. 8–10 Sekunden, unter 3 MB, ohne Ton. Das CSS ist bereits vorbereitet.

### Kundenlogos

Im Referenzbereich stehen noch sechs leere Slots. In `index.html` im Block
`<div class="logos">` je Slot ersetzen:

```html
<div class="logo-slot">
  <img src="assets/img/kunde-01.svg" alt="Firmenname" width="140" height="40">
</div>
```

Am besten einfarbig dunkles SVG oder PNG. Slots, die leer bleiben, einfach löschen —
das Raster passt sich automatisch an. **Nur Logos verwenden, für die eine Freigabe des
Kunden vorliegt.**

## Anfrageformular anbinden

Standardmäßig öffnet das Formular eine vorausgefüllte E-Mail im Mailprogramm des
Besuchers. Das funktioniert überall, ist aber nicht die beste Conversion. Für echten
Serverempfang in `js/main.js` ganz oben eintragen:

```js
var CONFIG = {
  formEndpoint: 'https://formspree.io/f/DEINE-ID',   // oder '/anfrage.php'
  contactEmail: 'info@ruhrcargo.de'
};
```

Das Formular sendet dann `POST` mit JSON-Body und erwartet einen `2xx`-Status.
Enthaltene Felder: `ladung`, `von`, `nach`, `name`, `firma`, `email`, `telefon`,
`termin`, `nachricht`. Ein unsichtbares Honeypot-Feld filtert einfache Bots.

Wenn ein Dienstleister wie Formspree eingesetzt wird, muss das in der
Datenschutzerklärung ergänzt werden (Auftragsverarbeitung, Drittlandtransfer).

---

## Lokal ansehen

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Ein `file://`-Aufruf funktioniert nicht zuverlässig (Schriften, `fetch`).

## Veröffentlichen

Alle Dateien in das Web-Root des Hosters laden — fertig. Es gibt keinen Build-Schritt.
Funktioniert ebenso auf Netlify, Vercel, GitHub Pages oder klassischem FTP-Webspace.

---

## Aufbau

```
index.html              Startseite — verdichtet, verweist auf die Unterseiten
leistungen.html         Alle acht Leistungen im Überblick
leistungen/*.html       Fünf Detailseiten, eine je Leistung
fuhrpark.html           Fuhrpark ausführlich
unternehmen.html        Über RuhrCargo, Entwicklung, Gründe, Referenzen
ablauf.html             Prozess ausführlich + Konfigurator
kontakt.html            Kontaktdaten + Anfrageformular
impressum.html          Rechtstext (ausfüllen!)
datenschutz.html        Rechtstext (prüfen lassen!)

css/style.css           Designsystem + alle Komponenten
css/fonts.css           Selbst gehostete Schriften
js/main.js              Interaktion, Scroll-Animationen, Formular
tools/                  Generator (siehe unten)
assets/                 Schriften, Logo, Bilder
```

14 Seiten insgesamt (13 indexierbare plus die 404-Seite). Die Startseite nennt nur die wichtigsten Punkte und verlinkt
jeweils in die Tiefe — die Ausführlichkeit steckt in den Unterseiten.

### Seiten pflegen

Die HTML-Dateien werden aus `tools/content.py` erzeugt. Alle Texte stehen dort an
einer Stelle, die Seitenhülle (Kopf, Navigation, Fuß) nur einmal in `tools/build.py`.

```bash
python3 tools/build.py      # erzeugt alle Seiten, sitemap.xml und robots.txt neu
```

**Wichtig:** Änderungen direkt im HTML gehen beim nächsten Lauf verloren. Für
Textänderungen also `tools/content.py` bearbeiten und neu erzeugen. Wer den
Generator nicht nutzen will, kann ihn löschen und die HTML-Dateien von Hand
pflegen — sie sind eigenständig und brauchen ihn zum Betrieb nicht.

Eine neue Leistung ergänzen: einen Eintrag in `SERVICES` anlegen (Slug, Titel,
Icon, Bild, Texte, FAQ, verwandte Leistungen), Bilder unter den passenden Namen
in `assets/img/` legen, `python3 tools/build.py` ausführen. Navigation, Untermenü,
Fußzeile, Konfigurator-Chips und Übersichtsseite ziehen automatisch nach.

### Animation und Bewegung

Alles läuft ausschließlich über `transform`, `opacity` und `clip-path`, damit die
GPU die Arbeit macht:

- Wort-für-Wort-Einblendung der Hero-Überschrift beim Laden
- Gestaffelte Scroll-Einblendungen für nahezu jeden Abschnitt
- Bilder werden per `clip-path` von unten aufgedeckt statt nur eingeblendet
- Dezente Tiefenstaffelung (Parallax) auf Hero- und Kopfbildern
- Hochzählende Kennzahlen
- Rot durchlaufende Prozesslinie, waagerecht auf der Startseite, senkrecht auf `ablauf.html`
- Laufband der Leistungen unter dem Hero
- Untermenü mit weichem Auf- und Zuklappen
- FAQ-Akkordeon mit animierter Höhe
- Fahrzeug- und Leistungskarten heben sich beim Überfahren an
- Weiche Seitenübergänge über die View-Transitions-API, wo der Browser sie kennt

`prefers-reduced-motion: reduce` schaltet jede Bewegung ab, ohne dass Inhalte
verschwinden.

## SEO

Alles, was sich technisch prüfen lässt, ist umgesetzt:

- **Pro Seite** eigener Title (≤ 60 Zeichen), eigene Description (110–165 Zeichen),
  Canonical, Open Graph inklusive `og:url`, Twitter Card, genau eine `h1`
- **Strukturierte Daten** als JSON-LD: `LocalBusiness` auf der Startseite,
  `Service` und `FAQPage` auf den Leistungsseiten, `BreadcrumbList` auf allen
  Unterseiten. Nur belegte Angaben — Telefon und Öffnungszeiten bleiben draußen,
  solange sie Platzhalter sind
- **sitemap.xml** und **robots.txt** werden mitgeneriert, Prioritäten gestaffelt
- **404-Seite** mit `noindex`, Weg zurück und Leistungsübersicht
- **URLs** nach Suchintention: `/leistungen/stueckguttransport.html`,
  `/leistungen/neumoebel-lieferung.html`, `/leistungen/kurierdienst.html`.
  Alte Adressen werden über `vercel.json` dauerhaft weitergeleitet
- **Bilder** als WebP mit sprechenden Dateinamen, `width`/`height` werden beim
  Bauen aus der Datei gelesen — sie können nie vom Bild abweichen
- **Interne Verlinkung** mit konkreten Ankertexten statt „Mehr erfahren"

Die Sitemap muss nach dem Livegang einmalig in der Google Search Console
eingereicht werden. Eine Position in den Suchergebnissen lässt sich damit nicht
zusichern — die technische Grundlage stimmt, den Rest entscheidet Google.

## Technische Entscheidungen

**Schriften selbst gehostet.** Kein Google-Fonts-Request. In Deutschland wurden
Websites für das Einbinden von Google Fonts abgemahnt; lokale Auslieferung vermeidet
das Problem und ist zusätzlich schneller. Nur die Subsets `latin` und `latin-ext`
sind enthalten (~268 KB gesamt).

**Keine Cookies, kein Tracking.** Deshalb ist kein Cookie-Banner nötig. Wird später
Analytics oder eine Kartenanbindung ergänzt, ändert sich das.

**Animationen.** Ausschließlich `transform` und `opacity`, damit alles auf der GPU
läuft. Eigene, kräftigere Easing-Kurven statt der schwachen CSS-Defaults. Scroll-Reveals
laufen über einen `IntersectionObserver`, der Elemente nach dem Auslösen abmeldet.
`prefers-reduced-motion: reduce` schaltet jede Bewegung ab, ohne dass Inhalte
verschwinden.

**Hover-Effekte** sind hinter `@media (hover: hover) and (pointer: fine)` gekapselt,
damit sie auf Touchgeräten nicht beim Antippen hängen bleiben. Die Leistungskarten
zeigen ihr Bild auf Touchgeräten dauerhaft statt beim Hover.

**Barrierefreiheit.** Semantische Landmarks, Skip-Link, sichtbare Fokusringe,
Tastaturbedienung im Konfigurator (Pfeiltasten), `aria-live` für Formularmeldungen,
Kontraste nach WCAG AA.

**Performance.** Hero-Bild wird vorgeladen, alle weiteren Bilder `loading="lazy"`
mit festen `width`/`height` gegen Layout-Shift.

---

## Bekannte Platzhalter

Diese Inhalte sind bewusst neutral gehalten und müssen vom Unternehmen bestätigt
oder ersetzt werden:

- **Telefon, E-Mail, Anschrift, Handelsregister, USt-IdNr.** — durchgehend Platzhalter
- **Timeline** — vier Etappen ohne Jahreszahlen, damit nichts Falsches behauptet wird
- **Kundenlogos** — leere Slots statt erfundener Referenzen
- **Branchenliste** — abgeleitet aus den Leistungsbereichen, bitte gegenprüfen
- **„Mo – Fr, 07:00 – 18:00 Uhr"** — angenommene Erreichbarkeit, bitte anpassen

Kennzahlen (20+ Fahrzeuge, 20+ Jahre Erfahrung, deutschlandweit, 8 Leistungsbereiche)
stammen aus der Projektvorgabe.
