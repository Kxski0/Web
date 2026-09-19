# PETITE PALI

Website für Petite Pali — Baby & Kinder Boutique, Karolingerring 5, Köln.

Eine Schaufenster-Website, kein Onlineshop: Sie soll Laufkundschaft in den
Laden holen. Deshalb gibt es Sortiment, Öffnungszeiten und Anfahrt — und
bewusst keinen Warenkorb.

## Verhältnis zum übrigen Repository

Dieses Verzeichnis ist eine **eigenständige Anwendung**. Im Wurzelverzeichnis
des Repositories liegt eine zweite, unabhängige Website (SolBauTec). Beide
teilen sich zur Laufzeit nichts:

- eigene `package.json`, eigenes Lockfile, eigener `node_modules`-Baum
- eigene Next-, TypeScript-, ESLint- und PostCSS-Konfiguration
- eigenes Vercel-Projekt mit Root Directory `petite-pali`
- **kein pnpm-Workspace** — ein Upgrade hier kann das andere Projekt nicht brechen

Wiederverwendbare Bausteine aus dem Schwesterprojekt wurden **kopiert und
angepasst, nicht importiert**. Das ist Absicht: ein gemeinsames Paket wäre genau
die Kopplung, die hier ausgeschlossen werden soll.

Am Wurzelverzeichnis wurden nur drei additive Änderungen vorgenommen, damit sich
die Projekte nicht gegenseitig in die Quere kommen: `petite-pali/` steht in den
`ignores` der Wurzel-ESLint-Config, im `exclude` der Wurzel-`tsconfig.json` und
in einer `.vercelignore`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP 3.15

## Entwicklung

```bash
cd petite-pali
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint
```

## Medienaufbereitung

Quelldateien liegen nicht im Repository, die erzeugten Dateien schon.

```bash
node scripts/media.mjs <screenshot-ordner> <video.mp4>   # alle Bild-Slots
node scripts/hero-video.mjs <quelldatei.mp4>             # Hero-Schleife + Poster
node scripts/brand-assets.mjs <quelldatei.png>           # Logo freistellen, Favicons
```

Alle drei messen, statt zu schätzen:

- `media.mjs` zieht Standbilder aus dem Ladenrundgang und Fotos aus den
  Instagram-Bildschirmfotos. Die Video-Frames sind nicht nach Gefühl gewählt:
  über den ganzen Clip wird je Sekunde die Varianz des Laplace-Operators
  gemessen, verwacklete Sekunden fallen dadurch heraus. Bei den Screenshots
  findet das Luminanz-Zeilenprofil die App-Oberfläche — praktisch schwarz *und*
  praktisch einfarbig, beides zusammen erkennt sie zuverlässig, ohne dunkle
  Bildinhalte wegzuschneiden —, danach wird auf das Quellformat 3:4 normiert.
  Zuletzt bekommt jeder Slot einen **bewussten Zuschnitt** aus dem MANIFEST
  (`focus`, `zoom`, `aspect`); die Rohbilder sind Schnappschüsse mit viel totem
  Boden und Straße.
- `brand-assets.mjs` findet die Logoscheibe über ihre Farbe, trennt Hasenmotiv
  und Schriftzug an der breitesten tintenfreien Lücke und stellt den Butterton
  frei. Es schneidet ausschließlich zu und färbt nichts um.
- `hero-video.mjs` schneidet einen Abschnitt heraus und blendet dessen Anfang
  über sein Ende, damit die Schleife keinen sichtbaren Schnitt hat. Ohne
  Tonspur, weil Autoplay nur stumm erlaubt ist.

Bild-Slots werden ausschließlich über `src/lib/assets.ts` angesprochen. Werden
später Originalfotos geliefert, ersetzen sie dieselben Dateien, ohne dass eine
Zeile Anwendungscode geändert werden muss.

Die Quellen sind 720 bzw. 828 px breit — das ist die Auflösungsgrenze. Für
halbseitige Flächen reicht sie, für vollflächige Bänder über 1440 px wird es
weich. Deshalb trägt der Hero Video statt Standbild.

## Prüfung

```bash
pnpm build
PORT=3200 bash scripts/serve.sh                  # startet neu und wartet, bis er antwortet
export BASE=http://localhost:3200

node scripts/routes-check.mjs        # Status, ein h1, Titel/Description eindeutig, Canonical, JSON-LD, interne Links
node scripts/responsive-check.mjs    # 375–1920: Overflow, Textgröße, Klickziele
node scripts/a11y-check.mjs          # Skip-Link, Mobilmenü, Lightbox, reduzierte Bewegung, alt-Texte, Formularlabels
node scripts/audit.mjs               # Kontrast, inkl. Messung an echten Pixeln über Bild/Video
node scripts/console-check.mjs       # Konsolenfehler und 404er beim Durchscrollen
node scripts/typography-check.mjs    # verwaiste Überschriftenzeilen
node scripts/perf-check.mjs          # LCP, CLS, Transfergewicht je Route
node scripts/shoot.mjs /             # Screenshots über vier Breiten
```

Jedes Skript beendet sich bei Fehlern mit einem Exit-Code ungleich null.

Zwei Ausnahmen sind in den Skripten begründet und nicht stillschweigend
gesetzt: der Honigtopf des Kontaktformulars liegt absichtlich außerhalb des
Bildes, und Verweise mitten im Fließtext sind von der 24×24-Regel ausgenommen
(WCAG 2.2 SC 2.5.8, Ausnahme „Inline"). Die Ausnahme wird geprüft, nicht
behauptet: der Verweis muss inline gesetzt sein *und* in einem Block stehen,
der außer ihm noch Text enthält.

`typography-check.mjs` misst mit reduzierter Bewegung — bei eingeschalteter
Bewegung zerlegt SplitText die Überschrift in Zeilen-Container, deren Rechtecke
Zeilen vortäuschen, die es typografisch nicht gibt. Der Umbruch selbst ist in
beiden Fällen derselbe.

`audit.mjs` schätzt nicht, wo Text auf Bild oder Video steht: es schaltet die
Textstelle unsichtbar, fotografiert ihr Rechteck und wertet die Luminanz der
Fläche dahinter aus. Verglichen wird gegen das ungünstigste Perzentil. Ein
Abschnitt, der Bildmaterial unter Text legt, markiert sich dafür mit
`data-surface="media"`.

## Umgebungsvariablen

`cp .env.example .env.local`

- `CONTACT_WEBHOOK_URL` — Ziel für Formularanfragen. Nicht gesetzt:
  `/api/kontakt/` antwortet bewusst mit HTTP 503, statt einen Erfolg
  vorzutäuschen und echte Anfragen zu verlieren.
- `SITE_INDEXABLE` — nur `true` erlaubt Indexierung. Standard ist aus:
  `robots.txt` liefert dann ein vollständiges Disallow und jede Seite ein
  `noindex`.
- `NEXT_PUBLIC_SITE_URL` — kanonischer Ursprung. Ohne Angabe wird auf Vercel die
  Produktionsdomain verwendet.

## Seitenstruktur

Sie folgt der bestehenden Website, ist aber gestrafft: aus fünf gleichrangigen
Einzelseiten unter „Leistungen" wird ein Sortiment mit Unterseiten.

```
/                              Startseite
/sortiment/                    Übersicht
/sortiment/fruehchen/          ab Größe 44
/sortiment/baby-und-kind/      bis Größe 122
/sortiment/fuer-mama/          Schwangerschaft & Stillzeit
/sortiment/tragehilfen/        Tragehilfen & Trageberatung
/sortiment/kinderwagen/        BEQOONI®-Showroom
/sortiment/dies-das/           Geschenke & Accessoires
/shopping-termin/              Terminanfrage
/gutschein/                    Gutscheinanfrage
/ueber-uns/                    Nina und das Team
/galerie/                      Lightbox, tastaturbedienbar
/aktuelles/                    Journal
/kontakt/                      Öffnungszeiten, Anfahrt, Formular
/impressum/  /datenschutz/     noindex
```

Der Signature-Abschnitt der Startseite ist **„Grow with us"**: die Größenleiter
44 → 122, beim Scrollen durchlaufen — sie beantwortet die im Laden häufigste
Frage, bevor sie gestellt wird.

## Weiterführend

- `DESIGN.md` — verbindliches Designsystem: Farbe, Rundung, Typografie, Bewegung.
- `DEPLOY.md` — Vercel-Einrichtung, Umgebungsvariablen, Domain, Startblocker.
- `CONTENT-TODO.md` — was noch vom Laden kommen muss. Erfundene Fakten sind
  ausgeschlossen; fehlende Inhalte werden nicht gerendert.
