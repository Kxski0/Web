# Designsystem — Petite Pali

Verbindlich. Wo dieses Dokument und eine allgemeine Empfehlung sich
widersprechen, gilt dieses Dokument.

## 1. Haltung

Eine kleine Boutique am Chlodwigplatz, in der Sachen einzeln ausgesucht werden.
Die Seite soll sich anfühlen wie der Laden: warm, hell, aufgeräumt, ohne
Marktschreierei. Verkauft wird nicht auf der Seite — verkauft wird im Laden. Die
Seite hat genau eine Aufgabe: jemanden dazu bringen, hinzugehen.

**Bewusste Gegenposition zum Schwesterprojekt im selben Repository.** Dort:
dunkles Graphit, Radius 0, Schweizer Präzision, Amber als Energiesignal. Hier
wäre das falsch. Kein Token, keine Regel und keine Komponente wurde von dort
übernommen, ohne für diesen Laden neu entschieden zu werden.

## 2. Farbe

| Token | Wert | Rolle |
| --- | --- | --- |
| `--color-cream` | `#faf6ef` | Seitengrund |
| `--color-butter` | `#fcfae3` | Logoscheibe, weiche Blöcke, Karten ohne Foto |
| `--color-linen` | `#f2eade` | erhöhte Fläche, getönte Abschnitte |
| `--color-caramel` | `#90592d` | Primärakzent, Fokusring, Aufzählungspunkte |
| `--color-cocoa` | `#7a5a3e` | Sekundärbraun, Fehlermeldungen |
| `--color-bark` | `#2f2823` | dunkle Fläche: Fuß, Signature-Abschnitt, CTA |
| `--color-ink` | `#332c25` | Fließtext |
| `--color-muted` | `#6f6459` | Sekundärtext auf hellem Grund |
| `--color-muted-on-dark` | `#b9ada0` | Sekundärtext auf Rinde |
| `--color-blush` | `#e7bcc2` | Zierfarbe |

Butter, Karamell und Altrosa sind aus dem Logo abgenommen — die Grundfarbe der
Scheibe wurde von `brand-assets.mjs` mit `[250, 254, 221]` gemessen, nicht
geschätzt.

### Gemessene Kontraste

Alle Werte sind nachgerechnet, nicht angenommen:

| Kombination | Verhältnis |
| --- | --- |
| Tinte auf Creme | 12,76:1 |
| Tinte auf Leinen | 11,52:1 |
| Tinte auf Butter | 13,04:1 |
| Muted auf Creme | 5,35:1 |
| Muted auf Leinen | 4,83:1 |
| Karamell auf Creme | 5,34:1 |
| Karamell auf Leinen | 4,82:1 |
| Karamell auf Butter | 5,45:1 |
| Kakao auf Creme | 5,80:1 |
| Creme auf Rinde | 13,46:1 |
| Muted-auf-Dunkel auf Rinde | 6,59:1 |
| Altrosa auf Rinde | 8,54:1 |
| **Altrosa auf Creme** | **1,58:1 — unbrauchbar für Text** |

Karamell war zunächst `#a26a38` und erreichte damit nur 4,19:1. Es wurde auf
`#90592d` abgedunkelt, bis es auf **allen drei** hellen Flächen über 4,5:1 liegt.
Der Farbton stimmt, die Zahl war falsch — geändert wurde die Zahl.

`--color-muted` misst auf Rinde nur 2,51:1. Deshalb gibt es
`--color-muted-on-dark` als eigenes Token. Eine Deckkraftangabe an dieser Stelle
wäre eine Schätzung, kein Wert.

### Die Altrosa-Regel

Altrosa erscheint in **genau drei Rollen**:

1. Ziffernmarke der Abschnittsmarke (`Eyebrow`)
2. Unterstrich der aktiven Navigation
3. aktive Pille in der Lebensphasen-Leiste (dort auf Rinde, 8,54:1)

Nie als Textfarbe. Nie als Fokusring. Nie großflächig. Und nie als *einziges*
Signal: die aktive Navigation trägt zusätzlich `aria-current`, die aktive Phase
zusätzlich eine gefüllte Fläche.

## 3. Rundung

Das Gegenstück zu `border-radius: 0` im Schwesterprojekt. Hier ist die Rundung
die Marke:

- `--radius-soft: 14px` — Karten, Eingabefelder, Hinweise
- `--radius-image: 22px` — Bildrahmen, große Flächen
- `--radius-pill: 999px` — Knöpfe, Pillen, Marken, Punkte

Ein rechtwinkliges Element ist die Ausnahme und braucht einen Grund.

## 4. Typografie

**Fraunces** (variabel, Achsen `SOFT`, `WONK`, `opsz`) als Anzeigeschrift:
weich und leicht eigenwillig, kann neben dem handgezeichneten Logo bestehen,
ohne es nachzuahmen. **Nunito Sans** für den Fließtext. Beide über `next/font`
selbst gehostet — es geht keine Anfrage an einen fremden Server.

Skala: `display` → `headline` → `title` → `lede` → `body` → `eyebrow`, alle als
`clamp()`. Untergrenze für Text: 12px, maschinell geprüft.

Überschriften mit mehreren Zeilen werden **gesetzt, nicht dem Zufall
überlassen** (`PageHero` nimmt ein `lines`-Array). Das letzte Wort darf nicht als
Waise stehen bleiben; `typography-check.mjs` misst das über Range-Rechtecke.

Bei gesetzten Zeilen steht am Zeilenende ein Leerzeichen. Das ist nicht
kosmetisch: die Zeilen sind Blöcke, der zugängliche Name der Überschrift ist
aber reiner Text — ohne das Leerzeichen liest ein Screenreader „Was im
Ladensteht".

## 5. Raster

12 Spalten, `--container-page: 1440px`, Rinne als `clamp(1.25rem, 4vw, 5rem)`.
Asymmetrische Aufteilungen (5/6, 7/5, 4/6) statt Halbierungen.

## 6. Bewegung

Zwei getrennte Budgets:

| Art | Dauer |
| --- | --- |
| Tastendruck | 140ms |
| Bedienelement | 240ms |
| redaktionelle Einblendung | 780ms |

Erlaubt sind nur `transform`, `opacity` und `clip-path`. **Nie `transition: all`.**
Hover nur hinter `@media (hover: hover) and (pointer: fine)`.

Bei `prefers-reduced-motion` gilt: weniger und sanfter, nicht nichts. Deckkraft
und Farbe tragen weiter Bedeutung, die Bewegung geht.

Wo das Markup selbst abweichen muss, entscheidet `useReducedMotion`:

- Der Hero lädt dann **gar kein Video** — nicht ein verstecktes. Wer Bewegung
  reduziert hat, soll die 1,2 MB nicht bezahlen.
- Die Lebensphasen-Leiste rendert alle sechs Phasen ausgeschrieben
  untereinander, ohne Pinning.

`visibility` gehört in keinen Übergang. Sie ist eine diskrete Eigenschaft und
springt mitten in der Dauer um — ein `.focus()` direkt nach dem Öffnen läuft
dann ins Leere. Das Mobilmenü arbeitet stattdessen mit `opacity`,
`pointer-events` und `inert`.

## 7. Fotografie

Alle Ladenaufnahmen stammen aus dem Instagram-Auftritt des Geschäfts und liegen
im Hochformat **3:4** vor. Das ist das Format der Quelle, keine Wahl — und der
Grund, warum `MediaBand` unter 48rem auf 4:3 wechselt statt einen 16:10-Streifen
herauszuschneiden, von dem bei einem Hochformat nichts übrig bliebe.

Bilder werden über **Slots** angesprochen (`src/lib/assets.ts`), nie über Pfade.
Jeder Slot hält Eigengröße, Bildschwerpunkt und einen deutschen, beschreibenden
Alternativtext.

## 8. Text auf Bild

**Text steht nie auf bewegtem Bild.** Der Hero legt seinen Text auf eine eigene
Cremefläche, statt ihn über das Video zu setzen. Das ist eine
Gestaltungsentscheidung und zugleich die einzige verlässliche: Schrift auf einem
hellen, ständig wechselnden Video hat keinen messbaren Kontrast, Tinte auf Creme
hat 12,76:1.

Aus demselben Grund liegt die Kopfleiste immer auf getrübtem Creme — auch ganz
oben. Eine durchsichtige Leiste über dem Video wäre schöner und wäre nicht
lesbar.

`audit.mjs` meldet jede Textstelle über Bildmaterial eigens. Diese Meldung soll
leer bleiben; sie ist die Kontrolle für diese Regel.

## 9. Bedienbarkeit

- Klickziele mindestens 24×24 (WCAG 2.2 SC 2.5.8), Knöpfe 44px hoch.
  Ausgenommen sind Verweise mitten im Satz — die Ausnahme steht in der Norm und
  wird im Prüfskript *geprüft*, nicht angenommen.
- Fokusring in Karamell, 2px, 3px Abstand.
- Das Mobilmenü ist ein Dialog mit Fokusfalle, Escape, Fokusrückgabe und
  Scrollsperre. Geschlossen nimmt `inert` es aus Tabreihenfolge und
  Hilfsmittelbaum.
- Im Signature-Abschnitt sind alle sechs Phasen im Baum für Hilfsmittel, obwohl
  visuell nur eine sichtbar ist: wer sie vorgelesen bekommt, bekommt sie
  vollständig vorgelesen, statt auf Scrollen angewiesen zu sein.

## 10. Bewusst nicht verwendet

Karussells auf der Startseite · Popups und Newsletter-Overlays · eingebettete
Instagram-Feeds (verlinkt statt eingebettet — spart Skripte Dritter und die
Einwilligung) · eingebettete Karten-iframes · Zählerbalken und Rabatt-Störer ·
animierte Körnung · Cookie-Banner (es gibt keine Cookies, also nichts
einzuwilligen) · eigene Mauszeiger · Parallax über mehrere Abschnitte.
