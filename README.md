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
```

`scripts/audit.mjs` misst den Kontrast der Hero-Headline gegen die tatsächlich
dahinterliegenden Pixel und meldet den ungünstigsten Wert je Zeile.

## Weiterführend

- `DESIGN.md` — verbindliches Designsystem: Farbe, Typografie, Raster, Motion.
- `CONTENT-TODO.md` — Inhalte, die noch von SolBauTec kommen müssen. Erfundene
  Fakten sind ausgeschlossen; fehlende Inhalte werden nicht gerendert.
