# Designsystem — Petite Pali

Verbindlich. Wo dieses Dokument und eine allgemeine Empfehlung sich
widersprechen, gilt dieses Dokument.

## 1. Haltung

Ein hochwertiges Remake, kein Rebranding. Marke, Inhalte und Charakter von
Petite Pali bleiben; was sich ändert, ist die Qualität der digitalen Darstellung.

Die Seite soll sich anfühlen wie ein Blick in eine echte Boutique: persönlich,
warm, ruhig, hochwertig, europäisch, redaktionell. Sie darf nie wie ein großer
anonymer Onlineshop wirken — und auch nicht wie eine Luxusmarke, die sich
verstellt.

**Bewusste Gegenposition zum Schwesterprojekt im selben Repository.** Dort:
dunkles Graphit, Amber als Energiesignal, Swiss-Präzision. Kein Token und keine
Regel wurde von dort übernommen, ohne für diesen Laden neu entschieden zu werden.

## 2. Farbe

| Token | Wert | Rolle |
| --- | --- | --- |
| `--color-bg` | `#f7f3ec` | Seitengrund |
| `--color-surface` | `#efe9df` | getönter Abschnitt |
| `--color-sand` | `#dccdba` | Fläche, Akzent auf Dunkel |
| `--color-primary` | `#332b27` | dunkle Fläche, Knöpfe, Fokusring |
| `--color-text` | `#302a27` | Fließtext |
| `--color-muted` | `#5c544d` | Sekundärtext |
| `--color-border` | `#d8d0c5` | Haarlinien |
| `--color-rose` | `#c8a9a2` | Zierfarbe |
| `--color-sage` | `#aab2a0` | Zierfarbe |

### Zwei Korrekturen am vorgegebenen System, beide gemessen

**Muted.** Vorgegeben war `#7c746d`. Gemessen erreicht das auf dem Seitengrund
nur **4,15:1** und auf Sand **2,95:1** — unter der AA-Schwelle für Fließtext.
Abgedunkelt auf `#5c544d`: 6,71:1 (Grund), 6,14:1 (Surface), 4,76:1 (Sand). Der
Ton bleibt, die Zahl stimmt jetzt.

**Rosé und Salbei sind Zierfarben, keine Textfarben.** Auf dem Seitengrund
messen sie 1,97:1 und 1,98:1. Sie erscheinen als Fläche, als feine Linie und auf
dunklem Grund (dort 6,37:1 bzw. 6,32:1) — nie als Träger einer Information, nie
als Fokusring.

### Weitere gemessene Werte

| Kombination | Verhältnis |
| --- | --- |
| Text auf Grund | 12,78:1 |
| Text auf Surface | 11,70:1 |
| Text auf Sand | 9,07:1 |
| Grund auf Primary | 12,53:1 |
| Sand auf Primary | 8,90:1 |

## 3. Kante statt Rundung

`border-radius: 0` als Standard, global gesetzt. Durchgehend abgerundete Karten
und Pillen sind das Kennzeichen der Template-Optik, die diese Seite vermeiden
soll. Die Kante ist hier das redaktionelle Mittel: Haarlinien gliedern, Flächen
stoßen aneinander, Knöpfe sind Rechtecke.

Rundung ist die begründete Ausnahme und steht dann örtlich im jeweiligen Modul.

## 4. Typografie

**Serif trägt Emotion, Sans trägt Information.** Keine Ausnahmen.

- **Cormorant Garamond** (300/400, auch kursiv) für Hero-Headlines, große
  Aussagen, Kategorienamen, Größenzahlen. Bewusst nur leichte Schnitte: die
  Schrift lebt von feinen Strichen, fett verliert sie genau das. Betonung
  entsteht über Größe und Raum, nicht über Gewicht.
- **DM Sans** für Navigation, Fließtext, Knöpfe, Formulare, Labels.

Beide über `next/font` selbst gehostet — es geht keine Anfrage an einen fremden
Server, und es gibt keinen Grund für einen Einwilligungsbanner.

Überschriften mit mehreren Zeilen werden **gesetzt, nicht dem Zufall
überlassen** (`PageHero` nimmt ein `lines`-Array, der Hero setzt seine beiden
Sätze einzeln). Das Leerzeichen am Zeilenende ist dabei nicht kosmetisch: die
Zeilen sind Blöcke, der zugängliche Name der Überschrift ist aber reiner Text —
ohne es liest ein Screenreader „Was im Ladensteht".

`typography-check.mjs` meldet Überschriften, deren letzte Zeile als Waise
stehen bleibt.

## 5. Raster

12 Spalten, `--container-page: 1560px`, Rinne `clamp(1.25rem, 4vw, 5.5rem)`.

Asymmetrisch und wechselnd. `EditorialSection` setzt 6/5 und kehrt sich
abwechselnd um; ein durchgehendes „Bild links, Text rechts" wäre genau die
Template-Anmutung, die vermieden werden soll.

Das Kategorienraster setzt die Spaltenbreiten **bewusst**: 4+2, 2+4, 3+3. Jede
Reihe füllt die sechs Spalten vollständig, jede hat eine andere Aufteilung. Zu
jeder Breite gehört ein eigenes Bildformat (3:2, 4:5, 4:3) — sonst stünden Hoch-
und Querformate zufällig nebeneinander.

## 6. Bewegung

| Art | Dauer |
| --- | --- |
| Tastendruck | 140 ms |
| Bedienelement | 260 ms |
| redaktionelle Einblendung | 900 ms |

Erlaubt sind `transform`, `opacity`, `clip-path`. **Nie `transition: all`.**
Hover nur hinter `@media (hover: hover) and (pointer: fine)`. Bildvergrößerung
beim Überfahren höchstens 1,03.

Wo das Markup selbst abweichen muss, entscheidet `useReducedMotion`:

- Der Hero lädt bei reduzierter Bewegung **gar kein Video** — nicht ein
  verstecktes. Wer Bewegung reduziert hat, soll die 1,2 MB nicht bezahlen.
  Dafür gibt es `useHydrated`: das Video wird erst nach der Hydration
  eingehängt, weil ein Video-Element im Serverausgabe seine Datei lädt, bevor
  React entscheiden könnte, es zu entfernen.
- „Grow with us" rendert alle sechs Abschnitte untereinander statt gepinnt.

`visibility` gehört in keinen Übergang. Sie ist eine diskrete Eigenschaft und
springt mitten in der Dauer um — ein `.focus()` direkt nach dem Öffnen läuft
dann ins Leere. Mobilmenü und Lightbox arbeiten mit `opacity`, `pointer-events`
und `inert`.

## 7. Der Signature-Moment

**Grow with us**: die Größenleiter 44 → 122, beim Scrollen durchlaufen. Er ist
nicht Dekoration, sondern beantwortet die im Laden häufigste Frage („habt ihr
das auch in Größe …?") und zeigt, was die Boutique ausmacht: sie deckt die
ganze Strecke ab.

Technisch schlicht: `position: sticky` plus ein auf einen Frame gedrosselter
Scroll-Handler, der die Position in einen Index auflöst; alles Sichtbare läuft
über CSS-Transitions. Kein GSAP-Pinning, kein WebGL.

## 8. Text auf Bild — gemessen, nicht geschätzt

Text darf über Bild oder Video stehen, aber nur mit einem Schleier, dessen
Wirkung nachgewiesen ist. `scripts/audit.mjs` schaltet die Textstelle
unsichtbar, fotografiert ihr Rechteck und wertet die Luminanz der Fläche
dahinter aus — verglichen wird gegen das ungünstigste Perzentil (bei heller
Schrift gegen die hellsten Pixel).

Aktuelle Messwerte auf der Startseite: Hero-Kicker 10,20:1, Unterzeile 7,81:1,
Hero-Knopf 9,03:1, Navigation 6,07–11,61:1, Marke 16,48:1.

Wo ein Abschnitt Bildmaterial unter Text legt, trägt er `data-surface="media"`.
Das ist keine Dekoration: der Prüfer nimmt es als Grenze und misst ab dort an
Pixeln statt gegen die Seitenfarbe.

## 9. Fotografie

Zwei Quellen, beide vom Laden selbst:

1. **Der einminütige Ladenrundgang** (720×1280). Die Frames sind nicht nach
   Gefühl gewählt: über den ganzen Clip wurde je Sekunde die Varianz des
   Laplace-Operators gemessen und aus den schärfsten Sekunden nach Bildinhalt
   ausgewählt. Verwacklete Frames kommen gar nicht erst in die Auswahl.
2. **Bildschirmfotos des eigenen Instagram-Auftritts** (828 px). Die
   App-Oberfläche wird über das Luminanz-Zeilenprofil entfernt.

Jeder Slot bekommt einen **bewussten Zuschnitt** (`focus`, `zoom`, `aspect` im
MANIFEST von `scripts/media.mjs`). Die Rohbilder sind Schnappschüsse mit viel
totem Boden, Straße und Autos; ohne Zuschnitt sähe die Seite danach aus.

**Auflösungsgrenze, offen benannt:** 720 bzw. 828 px. Für halbseitige und
kleinere Flächen reicht das; für vollflächige Bänder über 1440 px wird es weich.
Deshalb trägt der Hero Video statt Standbild — und deshalb steht
„Originaldateien anfordern" in `CONTENT-TODO.md`.

Bilder werden über **Slots** angesprochen (`src/lib/assets.ts`), nie über Pfade.

## 10. Bedienbarkeit

- Klickziele mindestens 24×24 (WCAG 2.2 SC 2.5.8), Knöpfe 48 px hoch.
  Ausgenommen sind Verweise mitten im Satz — die Ausnahme steht in der Norm und
  wird im Prüfskript *geprüft*, nicht angenommen.
- Fokusring in Primary, 2 px, 3 px Abstand.
- Mobilmenü und Galerie-Lightbox sind Dialoge mit Fokusfalle, Escape,
  Fokusrückgabe und Scrollsperre; geschlossen nimmt `inert` sie aus
  Tabreihenfolge und Hilfsmittelbaum. Die Lightbox blättert zusätzlich mit den
  Pfeiltasten.
- In „Grow with us" sind alle sechs Abschnitte im Hilfsmittelbaum, obwohl
  visuell nur einer sichtbar ist.

## 11. Bewusst nicht verwendet

Karussells · Popups und Newsletter-Overlays · eingebettete Instagram-Feeds
(verlinkt statt eingebettet) · eingebettete Karten-iframes · Cookie-Banner (es
gibt keine Cookies, also nichts einzuwilligen) · Farbverläufe als Flächen ·
Glasflächen · Neon · 3D · WebGL · animierte Körnung · eigene Mauszeiger ·
durchgehend abgerundete Karten · gleichförmige Sechser-Raster · Stockfotos ·
KI-Bilder.
