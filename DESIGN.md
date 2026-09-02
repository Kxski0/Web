# SOLBAUTEC — Design System

Binding reference for this codebase. Where this document and a general
best-practice recommendation disagree, this document wins; where this document
and the SolBauTec Master Concept disagree, the Master Concept wins.

---

## Positioning

**Energie, die weiterdenkt.**

SolBauTec is presented as a planner and builder of energy *systems*, not as a
seller of individual products. Photovoltaics, storage, heat pump and energy
management are shown as one connected system throughout.

## Direction

Swiss precision in dark graphite, with editorial photography as the only warm
element. Large left-aligned display type against generous empty space. A single
amber accent that means energy and nothing else. It should read like an
architecture practice's technical documentation, brought to life.

**Signature moment:** the energy system — a pinned, phase-stepped architectural
section of a house that assembles itself into a working energy system while a
single amber pulse travels the actual conductor paths.

## The logo, and where it can go

The supplied logo is drawn for light backgrounds. Measured against the site's
graphite ground, **50.2% of its visible artwork falls below 3:1 contrast** — the
"Bau" of the wordmark, the house and the module are all near-black and vanish,
leaving "Sol Tec" floating under a sun.

The artwork is therefore never recoloured, and never placed on graphite:

- **Footer** — off-white ground, full lockup including the descriptor. The footer
  runs light specifically so the mark has one surface where it reads correctly.
- **Header over a light section** — the compact lockup (mark plus wordmark,
  without the descriptor, which renders around five pixels tall in a header bar).
- **Header over a dark section** — a typographic wordmark, as an interim.
- **Icons** — the mark centred on an off-white plate; a favicon supplies its own
  ground anyway.

The proper fix is the official negative version of the logo. Until it exists,
the typographic fallback stands. See CONTENT-TODO.md.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--color-graphite` | `#101211` | Primary ground |
| `--color-graphite-raised` | `#171a18` | Raised surfaces |
| `--color-offwhite` | `#f1f0eb` | Primary text, structural strokes |
| `--color-grey` | `#858883` | Secondary text, diagram captions |
| `--color-amber` | `#d7a843` | See rule below |
| `--color-hairline` | `rgb(241 240 235 / 0.12)` | Dividers — used instead of shadows |

### The amber rule

`--color-amber` appears in exactly four roles:

1. energy flow,
2. focus rings,
3. active state,
4. the CTA arrow and eyebrow index.

No amber surface wider than about 2px of stroke. No amber fills, no amber
gradients, no amber icons. When everything is an accent, nothing is.

## Type

- **Display — Geist.** Tight fit and flat terminals hold up at 150px.
- **Body — Manrope.** Wider apertures read better at 16px.

Both self-hosted via `next/font`: no third-party request, no swap shift.

Headlines are left-aligned. Line breaks in the hero are authored, not left to
the browser — the three-line stack is the composition.

## Grid

12 columns, `max-width: 1600px`, gutters `clamp(1.25rem, 4vw, 6rem)`.
Asymmetric splits are the default (4/8, 7/5). Avoid repeated three-column card
grids and repeated 50/50 splits.

**One deliberate rule break per page.** On the home page it is the hero's closing
line, which runs past its text column into the image channel. It only reads as
intent because everything around it obeys the grid.

## Motion

Two budgets, and they are not interchangeable:

| Kind | Duration | Easing |
| --- | --- | --- |
| Press feedback | 140ms | `--ease-out` |
| UI micro-interaction (hover, menu, toggle) | ≤ 250ms | `--ease-out` |
| Editorial reveal (headline, image) | 700–1000ms | `power3.out` / `--ease-out` |

Rules:

- Animate `transform`, `opacity`, `clip-path` and `stroke-dashoffset` only.
- Never `transition: all` — name the properties.
- Never animate from `scale(0)`; things have a shape before they arrive.
- Gate hover behind `@media (hover: hover) and (pointer: fine)`.
- Text reveals are mask reveals (`translateY(100%)` out of an overflow box), not
  fades.
- Image reveals start at `scale(1.04)`, never more.
- Reduced motion means fewer and gentler, not zero: opacity and colour survive,
  movement goes, and anything that depends on scroll position becomes static.

**No perpetual loops without a message.** The two that exist earn it: the hero
scroll hint is an affordance, and the energy pulse indicates direction of flow.
Both stop under `prefers-reduced-motion`.

## Photography

Editorial documentary: real German residential settings, real technicians,
natural light, natural depth of field. The set must read as one commissioned
series.

Components reference an **asset slot**, never a file path — see
`src/lib/assets.ts`, which holds the filename, intrinsic size, focal point and a
descriptive German `alt` for each. Sources are mapped to slots by visual content,
not by filename.

The hero is served through `<picture>` rather than `next/image` because the two
viewports need two different **crops**, not two sizes.

## Scrims

Legibility over photography is measured, never eyeballed. `scripts/audit.mjs`
samples the real pixels behind each headline line — using the glyph extent, not
the line box — and reports the worst-case contrast ratio.

Current worst case: **6.09:1**, which clears WCAG AAA for large text on every
tested viewport.

Scrims are art-directed per viewport. A single angled gradient that works on a
wide frame will destroy a narrow one, because the gradient line is long relative
to the box. Wide layouts get a horizontal scrim that clears the building; narrow
layouts get a vertical one that only covers the text.

## Surfaces

The page alternates grounds — dark, image, light, dark — which is the rhythm the
brief asks for. Two consequences are load-bearing:

- Any section on the off-white ground carries `data-surface="light"`. The fixed
  header observes those sections and inverts over them; a dark glass bar on an
  off-white ground reads as a grey slab dropped onto the page.
- Photographs on the graphite ground get a hairline frame. The darkest images in
  the set are near-black, and without an edge they dissolve into the background
  and their captions appear to label nothing.

## Headlines

Display line breaks are authored, not left to the browser. That only works if
the text fits its column, so `scripts/typography-check.mjs` measures the
rendered line boxes and fails when a final line is narrower than a third of the
widest — a stacked headline is the composition, a stranded word is a defect.

## Targets and text size

Interactive targets meet WCAG 2.2 SC 2.5.8: at least 24 by 24 CSS pixels. Text
links in navigation contexts therefore carry `min-height: 24px` with
`inline-flex` centring rather than relying on their line box, which measured 19
pixels. The header's menu button is 44px, a comfortable thumb target.

`--text-eyebrow` sits at 0.75rem. It was 0.72rem, which renders at 11.52px and
reads as cramped in tracked uppercase at phone size.

`scripts/responsive-check.mjs` asserts both across 375 to 1920px.

## Facts

Nothing in `src/content/` may be invented. Projects, reviews, certificates,
partners, team size and any figure stay empty until documented, and consumers
render nothing on empty input. Structured data degrades from `LocalBusiness` to
`Organization` while the address is unconfirmed. See `CONTENT-TODO.md`.

## Vendor prefixes

Never hand-write them. Writing `-webkit-backdrop-filter` beside the standard
property made the build's CSS minifier collapse the pair and ship only the
prefixed form, which current Chromium does not implement — the glass header
silently stopped blurring in production, while both the markup and the source
CSS still looked correct. The build adds whatever prefixes the target browsers
need. `scripts/a11y-check.mjs` now asserts the computed blur so this cannot
return unnoticed.

## Deliberately not used

Mesh gradients, aurora backgrounds, glassmorphism as a surface language, custom
cursors, magnetic buttons, animated grain, three-column icon card grids,
decorative 3D. Each was considered and rejected as generic, as noise, or as
working against the Master Concept.

**No WebGL for the energy system.** The brief asks for high-grade information
visualisation, not a 3D scene. An SVG section drawing stays sharp at any pixel
density, weighs a few kilobytes rather than a few hundred, carries a real
accessible description, and can be drawn to actual architectural proportions.
