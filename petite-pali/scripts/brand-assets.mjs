/**
 * Markenzeichen aus dem gelieferten Bildschirmfoto.
 *
 * Es gibt (noch) keine Original-Logodatei, nur ein Bildschirmfoto der alten
 * Website, auf dem das Logo als Kreisscheibe auf buttergelbem Grund liegt.
 * Dieses Skript schneidet ausschließlich zu und färbt nichts um — die Grenzen
 * werden gemessen, nicht geschätzt:
 *
 *  1. Die Scheibe wird über ihre Farbe gefunden: sehr hell, mit deutlich
 *     niedrigerem Blau- als Rot-/Grünkanal. Das trifft den Butterton und nicht
 *     das Weiß der Seite.
 *  2. Innerhalb der Scheibe wird das Zeilenprofil der Tinte (alles spürbar
 *     dunkler als der Grund) ausgewertet. Zwischen Hasenmotiv und Schriftzug
 *     liegt eine tintenfreie Lücke; an der breitesten Lücke wird getrennt.
 *  3. Der Butterton der Scheibe wird freigestellt: Pixel nahe der Grundfarbe
 *     werden transparent, mit weichem Übergang, damit die Kanten nicht
 *     ausfransen. Ein rechteckiger Ausschnitt einer runden Scheibe brächte
 *     sonst die dunklen Ecken der Seite mit.
 *
 * Erzeugt:
 *   public/images/brand/petite-pali-scheibe.webp   Scheibe, außen transparent
 *   public/images/brand/petite-pali-marke.webp     Hasenmotiv, freigestellt
 *   public/images/brand/petite-pali-schriftzug.webp  Schriftzug, freigestellt
 *   src/app/icon.png (64px)  ·  src/app/apple-icon.png (180px)
 *
 * Aufruf:  node scripts/brand-assets.mjs <quelldatei.png>
 *
 * Die Auflösung des Bildschirmfotos ist die Obergrenze. Die Originaldatei
 * anzufordern steht als offener Punkt in CONTENT-TODO.md.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = process.argv[2];
if (!SRC) {
  console.error('Quelldatei fehlt.  node scripts/brand-assets.mjs <quelldatei.png>');
  process.exit(1);
}

const BRAND_DIR = path.join(process.cwd(), 'public', 'images', 'brand');
const APP_DIR = path.join(process.cwd(), 'src', 'app');

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

/* --- 1. Die Kreisscheibe finden ------------------------------------------ */
const isPlate = (r, g, b) => r > 238 && g > 238 && b > 205 && b < r - 12 && b < g - 12;

let x0 = Infinity;
let y0 = Infinity;
let x1 = -1;
let y1 = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    if (!isPlate(data[i], data[i + 1], data[i + 2])) continue;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
}
if (x1 < 0) {
  console.error('Keine Kreisscheibe gefunden — stimmt die Quelldatei?');
  process.exit(1);
}
const plate = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
console.log('Scheibe:', plate);

/* --- 2. Innerhalb der Scheibe: Hase von Schriftzug trennen ---------------- */
const rowInk = new Array(plate.height).fill(0);
for (let y = 0; y < plate.height; y++) {
  for (let x = 0; x < plate.width; x++) {
    const i = ((plate.top + y) * W + (plate.left + x)) * C;
    const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (l < 215) rowInk[y]++;
  }
}
// Nur der mittlere Bereich kommt als Trennstelle infrage: ganz oben und ganz
// unten ist die Scheibe ohnehin leer, das wäre keine Lücke zwischen zwei
// Elementen, sondern der Rand.
const searchFrom = Math.round(plate.height * 0.35);
const searchTo = Math.round(plate.height * 0.72);
const empty = (y) => rowInk[y] < plate.width * 0.01;

let gap = null;
let run = null;
for (let y = searchFrom; y <= searchTo; y++) {
  if (empty(y)) {
    if (run) run.end = y;
    else run = { start: y, end: y };
  } else {
    if (run && (!gap || run.end - run.start > gap.end - gap.start)) gap = run;
    run = null;
  }
}
if (run && (!gap || run.end - run.start > gap.end - gap.start)) gap = run;

const split = gap ? Math.round((gap.start + gap.end) / 2) : Math.round(plate.height * 0.5);
console.log('Trennlinie Hase/Schriftzug bei y =', split, gap ? `(Lücke ${gap.start}–${gap.end})` : '(keine Lücke gefunden, Mitte)');

await mkdir(BRAND_DIR, { recursive: true });

/* --- 3. Freistellen ------------------------------------------------------ */
/**
 * Mittlere Grundfarbe der Scheibe, gemessen in einem Ring knapp innerhalb des
 * Randes — dort ist die Scheibe garantiert leer.
 */
const cx = plate.left + plate.width / 2;
const cy = plate.top + plate.height / 2;
// Vier Pixel innerhalb des gemessenen Randes: der äußerste Ring der Scheibe ist
// die kantengeglättete Grenze zur Seite dahinter. Die Mischfarben dort liegen
// zu weit vom Butterton entfernt, um freigestellt zu werden, und blieben sonst
// als hauchdünner Bogen im Freisteller stehen.
const radius = plate.width / 2 - 4;

let pr = 0;
let pg = 0;
let pb = 0;
let n = 0;
for (let a = 0; a < 360; a += 2) {
  const rad = (a * Math.PI) / 180;
  const x = Math.round(cx + Math.cos(rad) * radius * 0.94);
  const y = Math.round(cy + Math.sin(rad) * radius * 0.94);
  const i = (y * W + x) * C;
  pr += data[i];
  pg += data[i + 1];
  pb += data[i + 2];
  n++;
}
pr /= n;
pg /= n;
pb /= n;
console.log('Grundfarbe der Scheibe:', [pr, pg, pb].map(Math.round));

/** Weicher Übergang, damit freigestellte Kanten nicht treppig werden. */
const SOLID_AT = 26;
const CLEAR_AT = 12;

/**
 * Schneidet eine Region aus, stellt den Butterton frei und beschneidet auf den
 * verbleibenden Inhalt. `circleOnly` behält zusätzlich die Scheibe als Ganzes
 * und macht nur alles außerhalb des Kreises transparent.
 */
async function cutout(region, { keepPlate = false } = {}) {
  const px = Buffer.alloc(region.width * region.height * 4);
  for (let y = 0; y < region.height; y++) {
    for (let x = 0; x < region.width; x++) {
      const sx = region.left + x;
      const sy = region.top + y;
      const si = (sy * W + sx) * C;
      const di = (y * region.width + x) * 4;
      const r = data[si];
      const g = data[si + 1];
      const b = data[si + 2];
      px[di] = r;
      px[di + 1] = g;
      px[di + 2] = b;

      const outsideCircle = Math.hypot(sx - cx, sy - cy) > radius;
      if (outsideCircle) {
        px[di + 3] = 0;
        continue;
      }
      if (keepPlate) {
        px[di + 3] = 255;
        continue;
      }
      const d = Math.hypot(r - pr, g - pg, b - pb);
      px[di + 3] =
        d >= SOLID_AT ? 255 : d <= CLEAR_AT ? 0 : Math.round(((d - CLEAR_AT) / (SOLID_AT - CLEAR_AT)) * 255);
    }
  }
  return sharp(px, { raw: { width: region.width, height: region.height, channels: 4 } }).trim({
    threshold: 0,
  });
}

const results = [];
const record = async (name, image) => {
  const out = await image.webp({ quality: 92, effort: 6, alphaQuality: 100 }).toFile(
    path.join(BRAND_DIR, `${name}.webp`),
  );
  results.push({ datei: `${name}.webp`, breite: out.width, hoehe: out.height, kb: Math.round(out.size / 1024) });
};

await record('petite-pali-scheibe', await cutout(plate, { keepPlate: true }));
await record(
  'petite-pali-marke',
  await cutout({ left: plate.left, top: plate.top, width: plate.width, height: split }),
);
await record(
  'petite-pali-schriftzug',
  await cutout({ left: plate.left, top: plate.top + split, width: plate.width, height: plate.height - split }),
);

/* --- 4. Favicons --------------------------------------------------------- */
// Die Scheibe bringt ihren eigenen Grund mit und ist rund — als Symbol taugt
// sie unverändert, es braucht keine untergelegte Fläche.
for (const [size, file] of [
  [64, path.join(APP_DIR, 'icon.png')],
  [180, path.join(APP_DIR, 'apple-icon.png')],
]) {
  const out = await (await cutout(plate, { keepPlate: true })).resize(size, size).png().toFile(file);
  results.push({ datei: path.basename(file), breite: out.width, hoehe: out.height, kb: Math.round(out.size / 1024) });
}

console.table(results);
