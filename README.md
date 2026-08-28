# Energie Zentrum Saar — Web

Website für Energie Zentrum Saar, eine Marke der EZS GmbH in Saarwellingen.
Next.js 15 (App Router) mit Tailwind v4.

## Positionierung

Die Website verkauft keine Photovoltaik, sondern **einen Ansprechpartner**:
Analyse → Beratung → Lösung → Umsetzung → Betreuung. Photovoltaik ist einer
von zehn Leistungsbereichen, nicht die Geschichte. Wer das beim Weiterbauen
umdreht, bricht die Positionierung.

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
| `ProzessSequenz` | Hierarchie über Farbstufen | Inaktive Schritte über Deckkraft abzudunkeln wäre ein schöner Fokuseffekt, aber nicht mehr lesbar |

Ergänzt wurden außerdem Interaktionszustände, mobile Navigation und ein
Fokusring — die Vorgabe definiert davon nichts, ohne sie ist die Seite aber
nicht bedienbar.

Statt `--color-mercury` für gedämpften Text wird `--color-text-muted`
verwendet (Carbon mit 65 % Deckkraft). Mercury erreicht auf Vellum nur
2.96:1 und verfehlt damit WCAG AA.

## Inhalte

Alle Inhalte liegen zentral in `content/`:

| Datei | Inhalt |
|---|---|
| `unternehmen.ts` | Name, Anschrift, Kontakt — einzige Quelle, wird überall referenziert |
| `leistungen.ts` | Alle zehn Leistungen mit SEO-Title, Description, Umfang und FAQ; steuert Übersicht, Landingpages, Footer und Sitemap |
| `prozess.ts` | Die fünf Schritte der Scroll-Sequenz |
| `startseite.ts` | Texte der Startseite |
| `referenzen.ts` | Kundennamen |
| `media.ts` | Alle Bildquellen |

### Was noch fehlt

**Bilder.** Die Bildebene tragen derzeit gezeichnete Szenen
(`components/szenen.tsx`): technische Architekturzeichnungen in der Farbwelt
der Marke. Es liegen keine eigenen Aufnahmen vor, und aus der
Entwicklungsumgebung ist kein Bildhost erreichbar (Unsplash, Pexels, Picsum
und Pixabay antworten alle nicht).

Umstellung auf echte Fotos: in `content/media.ts` beim jeweiligen Eintrag
`foto` statt `szene` setzen. `<Bild>` nimmt beides, und der Absatz zu
Drittanbieter-Bildern in der Datenschutzerklärung schaltet sich über
`nutztExterneBilder` selbst zu. `images.unsplash.com` ist in
`next.config.ts` bereits freigeschaltet.

**Kundenstimmen.** `content/referenzen.ts` enthält nur die Namen. Zitate sind
bewusst leer: Der Wortlaut der echten Aussagen liegt nicht vor, und erfundene
Zitate namentlich genannten Unternehmen zuzuschreiben wäre eine
Falschdarstellung. Sobald `zitat` gefüllt ist, schaltet `ReferenzStrip`
selbstständig von der Namensliste auf die Zitatdarstellung um.

**Registerdaten im Impressum** und offene Stellen auf `/jobs`.

**Formularversand.** Setzen Sie `CONTACT_WEBHOOK_URL` — die Serveraktion sendet
die Anfrage als JSON dorthin. Ohne die Variable meldet das Formular das
ehrlich und verweist auf Telefon und E-Mail, statt Eingaben zu verwerfen.
Ebenfalls zu setzen: `NEXT_PUBLIC_SITE_URL` für Sitemap und Canonicals.

## Rechtliches

`/impressum` und `/datenschutz` sind für eine deutsche Unternehmenswebsite
Pflicht. Beide Seiten stehen strukturell, die Inhalte sind Platzhalter und
müssen vom Unternehmen kommen und rechtlich geprüft werden.

Die Schrift wird über `next/font/google` eingebunden; Next lädt die Dateien zur
Build-Zeit und liefert sie von der eigenen Domain — es entsteht keine
Laufzeitverbindung zu Google.

## Fallstricke beim Weiterbauen

**Button-Farben nie per `className` überschreiben.** Konkurrieren zwei
Tailwind-Utilities für dieselbe Eigenschaft, entscheidet die Reihenfolge im
erzeugten Stylesheet — nicht die im Attribut. Genau daran war der
Abschluss-CTA einmal weiß auf weiß und damit unsichtbar. Für dunkle Flächen
gibt es die Varianten `invers` und `ghostInvers`.

**Der versteckte Startzustand der Einblendungen gilt nur unter
`[data-js='true']`.** Ohne diese Absicherung bliebe ohne JavaScript der halbe
Seiteninhalt dauerhaft auf `opacity: 0`. Wer die Regel in `globals.css`
anfasst, muss das mitdenken.

**`clip-path` niemals auf das Element legen, das ein IntersectionObserver
beobachtet.** Der Zuschnitt fließt in die Sichtbarkeitsberechnung ein: Ein
zugeklapptes Bild meldet sich nie als sichtbar und bleibt damit für immer zu.
Deshalb sitzt die Maske in `Bild.tsx` auf einem inneren Element
(`.bildmaske`), beobachtet wird der äußere Container.

**Die Zeilen-Enthüllung (`enthuellen` an `DisplayHeading`) braucht eine
`<Reveal>`-Hülle.** Ohne sie bliebe die Überschrift aus ihrer Maske geschoben
und wäre unsichtbar. Die CSS-Regel ist deshalb auf `.reveal .zeile` begrenzt —
eine Überschrift ohne Hülle steht einfach da, statt zu verschwinden.

**Keine erfundenen Zahlen, Zitate oder Registerdaten.** Die Vertrauens-Section
argumentiert bewusst qualitativ statt numerisch, solange keine belastbaren
Unternehmenszahlen vorliegen.
