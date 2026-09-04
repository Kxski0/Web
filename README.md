# SOLBAUTEC

Website für SolBauTec — Energie- und Gebäudetechnik, Augsburg.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP 3.15

## Entwicklung

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Produktionsbuild
pnpm lint
```

## Bildverarbeitung

Quellbilder liegen nicht im Repository. Aus einem Quellordner erzeugen:

```bash
node scripts/process-images.mjs <quellordner>   # Slots als WebP
node scripts/hero-variants.mjs                  # AVIF/WebP-Varianten für den Hero
node scripts/brand-assets.mjs <logo.png>        # Lockups, Bildmarke, Favicon
```

`brand-assets.mjs` schneidet ausschließlich zu und färbt nichts um. Die
Zuschnittgrenzen stammen aus dem Alpha-Profil der Datei, nicht aus Schätzung.

Die Zuordnung Quelle → Slot steht in `scripts/process-images.mjs` und wurde
anhand des Bildinhalts vorgenommen, nicht anhand der Dateinamen.

## Visuelle Prüfung

```bash
pnpm build && PORT=3100 pnpm start &
SHOT_DIR=./shots node scripts/shoot.mjs pass     # Screenshots, vier Viewports
node scripts/audit.mjs                           # Headline-Kontrast + Overflow
node scripts/a11y-check.mjs                      # Reduced Motion, Fokus, Skip-Link
node scripts/typography-check.mjs                # verwaiste Headline-Zeilen
node scripts/console-check.mjs                   # Konsolenfehler, 404er
node scripts/routes-check.mjs                    # jede Route: Status, h1, Meta, Links
node scripts/responsive-check.mjs                # 375-1920: Overflow, Textgröße, Klickziele
node scripts/perf-check.mjs                      # LCP, CLS, Transfergewicht je Route
```

Alle vier Skripte messen statt zu schätzen und geben bei Fehlern einen
Exit-Code ungleich null zurück:

- `audit.mjs` — Kontrast der Hero-Headline gegen die tatsächlich dahinterliegenden
  Pixel, gemessen über die Glyphenausdehnung, plus horizontaler Overflow.
- `a11y-check.mjs` — Reduced Motion, Fokusfalle im Mobilmenü, Escape,
  Fokusrückgabe, Scroll-Lock, Skip-Link.
- `typography-check.mjs` — meldet Headlines, deren letzte Zeile als kurze Waise
  stehen bleibt. Mehrzeilige Headlines sind gewollt, eine gestrandete
  Restzeile nicht.
- `console-check.mjs` — scrollt die Seite komplett durch und meldet
  Konsolenfehler, Warnungen und fehlgeschlagene Requests.
- `routes-check.mjs` — prüft jede Route auf Status 200, genau ein `h1`,
  eindeutigen Title und eindeutige Description, Canonical, strukturierte Daten,
  `lang="de"` und horizontalen Overflow. Zusätzlich der Wortumfang gegen das
  Budget aus §38 (Startseite 700–1200, Leistungsseiten 900–1500, regionale
  Seiten 1000–1800); FAQ-Antworten werden dafür aufgeklappt, weil `innerText`
  geschlossene `<details>` überspringt. Danach werden alle internen Links
  aufgerufen und müssen 200 liefern.
- `responsive-check.mjs` — 375, 768, 1280 und 1920px: horizontaler Overflow,
  Elemente jenseits des Viewports, Text unter 12px und Klickziele unter 24×24
  (WCAG 2.2 SC 2.5.8). Bewusst ausgenommen: der Honeypot und der
  visuell versteckte Transkript-Block, die absichtlich außerhalb liegen, sowie
  alles, was ein Vorfahre mit `overflow: hidden` beschneidet.
- `perf-check.mjs` — LCP, CLS, TTFB und Transfergewicht je Ressourcentyp.
  Die Gewichte kommen aus der Resource-Timing-API, nicht aus Response-Headern:
  Next liefert JS und CSS komprimiert und ohne `content-length`, eine
  Header-Auswertung meldet dafür stillschweigend null.

## Umgebungsvariablen

`cp .env.example .env.local`.

- `CONTACT_WEBHOOK_URL` — Ziel für Formularanfragen. Nicht gesetzt: `/api/kontakt`
  antwortet bewusst mit HTTP 503, statt einen Erfolg vorzutäuschen.
- `SITE_INDEXABLE` — nur `true` erlaubt Indexierung. Standard ist aus:
  `robots.txt` liefert dann ein vollständiges Disallow und jede Seite ein
  `noindex`.
- `NEXT_PUBLIC_SITE_URL` — kanonischer Ursprung. Ohne Angabe wird auf Vercel die
  Produktionsdomain verwendet.

Deployment auf Vercel: siehe `DEPLOY.md`.

## Seitenstruktur

```
/                                     Startseite, Story 01-09
/photovoltaik/                        Leistungsseiten, je eigene Komposition
/stromspeicher/                       mit Tageskurve als Signature-Grafik
/waermepumpe/
/energiemanagement/                   mit Prioritätsleiter
/klima/
/carports-terrassenueberdachungen/
/projekte/                            rendert Referenzen, sobald belegt
/ueber-uns/
/kontakt/                             Formular, serverseitig validiert
/impressum/  /datenschutz/            noindex, siehe CONTENT-TODO.md

/photovoltaik-augsburg/               regionale Seiten. Sie existieren nur dort,
/waermepumpe-augsburg/                wo es belegbaren lokalen Inhalt gibt:
/stromspeicher-augsburg/              Netzbetreiber, bayerisches Bau- und
/energiemanagement-augsburg/          Denkmalrecht, kommunale Wärmeplanung.
```

Die regionalen Seiten sind bewusst keine Textkopien mit ausgetauschtem
Ortsnamen. Jede regionale oder rechtliche Aussage darauf steht am Seitenende in
einem Belege-Register mit der Stelle, die sie veröffentlicht (`SourceList`) —
Regeln und Planungsstände ändern sich, und eine Behauptung ohne Quelle lässt
sich nicht nachprüfen. Eine weitere Region bekommt erst dann eine Seite, wenn es
für sie eigene belegbare Fakten gibt.

## Weiterführend

- `DESIGN.md` — verbindliches Designsystem: Farbe, Typografie, Raster, Motion.
- `DEPLOY.md` — Vercel-Setup, Umgebungsvariablen, Domain, Sicherheits-Header
  und die Punkte, die vor dem Livegang zu klären sind.
- `CONTENT-TODO.md` — Inhalte, die noch von SolBauTec kommen müssen. Erfundene
  Fakten sind ausgeschlossen; fehlende Inhalte werden nicht gerendert.
