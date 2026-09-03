# Nocturne — Studio-Website

Statischer Onepager für ein Gestaltungsstudio. Kein Build-Step, keine
Laufzeit-Abhängigkeiten: `index.html` mit einem Stylesheet, einer JavaScript-Datei
und selbst gehosteten Schriften. Direkt auf GitHub Pages, Vercel oder jedem
Webserver ausrollbar.

```
python3 -m http.server 8080   # oder: npm run serve
```

---

## ⚠ Was vor dem Livegang ersetzt werden muss

Diese Inhalte sind Platzhalter. Sie stammen nicht aus einem Briefing, sondern
sind gesetzt, damit die Seite vollständig ist:

| Was | Wo | Anmerkung |
|---|---|---|
| **Studioname „Nocturne"** | `index.html` (8 ×), `assets/fonts/LICENSE.txt` | Frei erfunden. Die Bildvorlage gab nur ein Monogramm „N" her. Suchen-und-Ersetzen genügt. |
| **E-Mail, Telefon, Adresse** | `index.html`, Abschnitt 05 | `nocturne.example` ist eine reservierte Beispieldomain, die Nummer ist keine echte. |
| **Impressum, Datenschutz** | `index.html`, Fußstreifen | Verweisen aktuell ins Leere. In Deutschland sind beide Seiten Pflicht (§ 5 DDG, Art. 13 DSGVO). |
| **Instagram, LinkedIn** | `index.html`, Abschnitt 05 | Nur Platzhalter-Verweise. |
| **„Gegründet 2014", „Team 6", „Köln"** | `index.html`, Abschnitt 03 | Erfundene Eckdaten. |
| **Fotos** | `assets/img/` | Zeigen Studioalltag, keine Projektarbeiten. Für ein echtes Portfolio gehören hier Fallbeispiele hin — siehe unten. |

Bewusst *nicht* erfunden wurden: Kundenliste, Projektnamen, Auszeichnungen und
Zahlen zu abgeschlossenen Aufträgen. Der Abschnitt „Aus dem Atelier" ist deshalb
als Blick in die Werkstatt formuliert und nicht als Referenzliste.

---

## Aufbau

```
index.html                  Alle fünf Abschnitte, semantisch ausgezeichnet
assets/css/site.css         Tokens → Reset → Base → Layout → Components → Motion (@layer)
assets/css/fonts.css        @font-face für die selbst gehosteten Schriften
assets/css/lqip.css         Erzeugt. Unscharfe Platzhalter als data-URI
assets/js/site.js           Reveals, Abschnittsanzeige, Bildansicht. Ohne Bibliotheken
assets/img/                 AVIF + WebP, je 1600/800/400 px, plus manifest.json
assets/fonts/               Archivo (variabel) und IBM Plex Mono, OFL
assets/brand/               Monogramm und Favicon als SVG
tools/optimize-images.mjs   Einmal-Skript für die Bildaufbereitung
tools/verify.mjs            Prüfrunde: vier Breiten, Zugänglichkeit, Gewicht
```

### Bilder austauschen

`tools/optimize-images.mjs` enthält oben eine Liste (`ROSTER`) aus Dateiname,
Kennung und Alternativtext. Quellbilder ablegen, Liste anpassen, dann:

```
npm install
SRC_DIR=/pfad/zu/den/originalen npm run images
```

Das Skript schreibt beide Formate in drei Breiten, erzeugt `manifest.json` und
gibt fertige `srcset`-Zeilen aus, damit die Breitenangaben nicht von Hand
abgetippt werden. Die Platzhalter in `lqip.css` werden aus dem Manifest erzeugt.
Originaldateien gehören nicht ins Repository — die sieben Ausgangsbilder wogen
zusammen 14,8 MB, die ausgelieferten Fassungen wiegen 1,2 MB.

---

## Gestalterische Festlegungen

**Modus: Experience.** Die Arbeit führt ab dem ersten Viewport, das Interface
tritt zurück. **Archetyp: Schweizer Raster × Editorial, dark-first** — bewusst
nicht „Maximalist/Brutalist", was für Portfolios oft empfohlen wird: die
Bildvorlage ist leise, und der Brief schlägt die Kategoriegewohnheit.

Zwei Eigenheiten, beide aus den Fotos abgeleitet:

1. **Blindprägung als Typo-Behandlung.** Die Abschnittsziffern sind in den Grund
   eingelassen — Schatten oben, Lichtkante unten — wie das geprägte Monogramm
   auf Notizbuch und Visitenkarte.
2. **Kontaktbogen-Raster.** Ein Kader fällt aus der Spalte (`.frame-offset`).
   Bilder erscheinen als Clip-Path-Wisch von oben nach unten über ihrem
   unscharfen Platzhalter — der Abzug, der in der Schale sichtbar wird.

**Farbe** folgt 60/30/10: warmes Fast-Schwarz als Grund, Papierweiß und Graphit
als Träger, ein Oxidton als Akzent an genau drei Stellen (aktive Abschnitts­anzeige,
Link-Unterstreichung, Fokusring). Alle Werte in `oklch`.

**Bewegung** ist absichtlich sparsam: keine GSAP-Kinematik, kein eigener Cursor,
keine magnetischen Schaltflächen, kein Lenis. Reveals laufen über einen einzigen
`IntersectionObserver` mit `unobserve` nach dem ersten Auslösen, alles über
CSS-Transitions statt Keyframes (unterbrechbar und retargetbar). Das Korn ist
statisch — eine Endlosschleife ohne Zweck kostet dauerhaft Rechenzeit.

### Zwei Entscheidungen, die Erklärung verdienen

**Schriften werden selbst ausgeliefert, nicht über die Google-Fonts-CDN.** Das
vermeidet eine Drittanbieter-Verbindung samt IP-Übertragung beim Seitenaufruf —
in Deutschland ein reales Abmahnrisiko (LG München I, 3 O 17493/20). Nebeneffekt:
ein blockierender Fremdrequest weniger. Ausgeliefert wird nur die Latin-Teilmenge,
zusammen 112 kB.

**`clip-path` liegt auf dem Bild, nicht auf dem beobachteten Kasten.** Das ist
kein Stilfrage, sondern notwendig: `clip-path` auf dem Zielelement kappt dessen
Schnittrechteck für den `IntersectionObserver` auf null — das Element versteckt
sich so, dass der Beobachter es nie sehen kann und das Reveal nie auslöst.

---

## Prüfung

```
npm run serve      # in einer Sitzung
npm run verify     # in einer zweiten
```

`tools/verify.mjs` fährt 375, 768, 1280 und 1920 px an, scrollt jede Seite
vollständig durch, legt Screenshots ab und prüft: Konsolenfehler, fehlgeschlagene
Anfragen, `alt`/`width`/`height` an jedem Bild, ausgelöste Reveals, waagerechten
Überlauf, Überschriftenordnung, Kontrast nach WCAG 2.1, sichtbaren Fokus über
einen echten Tab-Durchlauf, Bewegungsreduktion und das Gewicht der Startansicht.
Es nutzt das vorinstallierte Chromium; `playwright install` ist nicht nötig.

Letzter Stand — **0 Befunde**:

| Messwert | Ergebnis |
|---|---|
| Startansicht | 156–198 kB |
| Kontrast Fließtext | 16,44 : 1 |
| Kontrast Sekundärtext | 6,43 : 1 |
| Kontrast Fußstreifen | 4,71 : 1 |
| Bilder gesamt | 1,2 MB (aus 14,8 MB) |
| Laufzeit-Abhängigkeiten | keine |

### Zugänglichkeit

Ohne JavaScript bleibt die Seite vollständig lesbar: die Reveal-Zustände hängen
an einer `.js`-Klasse, die erst ein Inline-Skript setzt. Bei
`prefers-reduced-motion: reduce` bleiben Deckkraft und Farbe erhalten, Bewegung
und Clip-Path entfallen. Die Bildansicht nutzt `<dialog>` und damit die
eingebaute Fokusfalle, Escape-Behandlung und Fokusrückgabe.

---

## Lizenz

Die Schriften stehen unter der SIL Open Font License 1.1, siehe
`assets/fonts/LICENSE.txt`. Für die Fotos ist keine Lizenz hinterlegt — sie
wurden als Vorlage beigestellt. Vor einer Veröffentlichung sind die Nutzungs­rechte
zu klären.
