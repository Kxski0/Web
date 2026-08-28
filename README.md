# EnergieSaar — Web

Website für EnergieSaar. Next.js 15 (App Router) mit Tailwind v4.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktionsbuild, prüft zugleich Typen und Lint
```

## Designsystem

Alle Gestaltungsentscheidungen leiten sich aus `EnergieSaarDESIGN.md` ab. Die
Token liegen vollständig in `app/globals.css` im `@theme`-Block — Farben,
Typografie, Radien, Layout. Neue Farbwerte gehören nicht dorthin: Das System
ist monochrom, und die Abwesenheit von Farbe ist beabsichtigt.

Drei Merkmale tragen das Erscheinungsbild und dürfen nicht verwässert werden:

1. Display-Überschriften in Gewicht 300 bei Zeilenhöhe 1.0 — nie fett.
2. Das 4px-Quadrat vor jedem Section-Label (`components/SectionLabel.tsx`).
3. Der große Radius auf allen Bildcontainern (`components/ImageCard.tsx`).

Dazu gilt: keine Schatten, keine Icons, keine Akzentfarbe.

### Bewusste Abweichungen von der Vorgabe

Vier Stellen weichen ab, jeweils im Code begründet:

| Stelle | Abweichung | Grund |
|---|---|---|
| `--text-display` | fluide statt fest 52px | Deutsche Komposita brechen sonst auf schmalen Viewports; Decke bleibt exakt 52px |
| `--radius-image` | fluide statt fest 80px | 80px auf 375px Breite wirkt wie ein Kreis; Decke bleibt exakt 80px |
| `Hero` | schwacher Verlauf hinter dem Text | Ohne ihn ist weißer Text in Gewicht 300 auf beliebigen Fotos nicht garantiert lesbar |
| `Nav` | helle Hairline | Eine reine Carbon-Fläche verschwindet auf dunklen Fotos; Rahmen statt Schatten |

Ergänzt wurden außerdem Interaktionszustände, mobile Navigation und ein
Fokusring — die Vorgabe definiert davon nichts, ohne sie ist die Seite aber
nicht bedienbar.

Statt `--color-mercury` für gedämpften Text wird `--color-text-muted`
verwendet (Carbon mit 65 % Deckkraft). Mercury erreicht auf Vellum nur
2.96:1 und verfehlt damit WCAG AA.

## Inhalte

Sämtliche Texte liegen in `content/site.ts`, sämtliche Bildquellen in
`content/media.ts`. Beides sind derzeit **Platzhalter**.

Bilder sollen von Unsplash kommen; `images.unsplash.com` ist in
`next.config.ts` bereits freigeschaltet. Vorerst stehen tonale Platzhalter aus
`public/platzhalter/` in `content/media.ts`, weil sich konkrete Foto-URLs aus
der Entwicklungsumgebung heraus nicht prüfen ließen. Umstellung = Strings in
dieser einen Datei ersetzen.

## Rechtliches

`/impressum` und `/datenschutz` sind für eine deutsche Unternehmenswebsite
Pflicht. Beide Seiten stehen strukturell, die Inhalte sind Platzhalter und
müssen vom Unternehmen kommen und rechtlich geprüft werden.

Die Schrift wird über `next/font/google` eingebunden; Next lädt die Dateien zur
Build-Zeit und liefert sie von der eigenen Domain — es entsteht keine
Laufzeitverbindung zu Google.
