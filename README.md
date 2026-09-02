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
```

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

## Weiterführend

- `DESIGN.md` — verbindliches Designsystem: Farbe, Typografie, Raster, Motion.
- `CONTENT-TODO.md` — Inhalte, die noch von SolBauTec kommen müssen. Erfundene
  Fakten sind ausgeschlossen; fehlende Inhalte werden nicht gerendert.
