/**
 * Bildaufbereitung: Instagram-Screenshots → Bild-Slots.
 *
 * Das Ausgangsmaterial sind Bildschirmfotos aus der Instagram-App, keine
 * Originaldateien. Um sie herum liegt App-Oberfläche — Statusleiste, Kopfzeile
 * mit Kontonamen, Aktionsleiste, Bildunterschrift. Die muss weg, und zwar
 * gemessen statt geschätzt:
 *
 *  1. Je Bildzeile werden Mittelwert und Standardabweichung der Luminanz
 *     bestimmt. Die App-Oberfläche ist praktisch schwarz und praktisch
 *     einfarbig — beides zusammen erkennt sie zuverlässig, während ein
 *     dunkler Bildinhalt (Fußmatte, Nachtaufnahme) eine hohe Streuung hat und
 *     nicht fälschlich weggeschnitten wird.
 *  2. Der längste zusammenhängende Block von Nicht-Oberflächenzeilen ist das
 *     Foto.
 *  3. Ränder, die im Mittel zu dunkel sind, werden noch abgezogen.
 *  4. Zuletzt wird auf das Seitenverhältnis der Quelle normiert: Instagram
 *     liefert Hochformat als 3:4. Was danach oben übrig ist, ist die Kopfzeile
 *     mit dem Kontonamen — heller Text auf Schwarz, den Schritt 1 nicht als
 *     Oberfläche erkennen kann, weil seine Streuung hoch ist. Sie sitzt immer
 *     über dem Foto, also wird von oben beschnitten.
 *
 * Aufruf:  node scripts/process-images.mjs <quellordner>
 *
 * Die Quelldateien liegen nicht im Repository, die erzeugten WebP schon.
 * Werden später Originalfotos geliefert, ersetzen sie dieselben Slots, ohne
 * dass eine Zeile Anwendungscode angefasst werden muss — Slots werden
 * ausschliesslich über src/lib/assets.ts konsumiert.
 */
import { readdirSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = process.argv[2];
if (!SRC_DIR) {
  console.error('Quellordner fehlt.  node scripts/process-images.mjs <quellordner>');
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), 'public', 'images');

/** Seitenverhältnis eines Instagram-Beitrags im Hochformat. */
const SOURCE_ASPECT = 3 / 4;

/**
 * Dateipräfix → Slot. Die Zuordnung stammt aus dem Bildinhalt, nicht aus dem
 * Dateinamen; der Kommentar hält fest, was zu sehen ist.
 */
const MAP = {
  // Ladentisch voller gefalteter Kinderkleidung, dahinter die Regalwand,
  // davor die Roller. Das dichteste Bild des Sortiments.
  '86f68fbc': 'laden-tisch',
  // Regal mit Kuscheltieren und Kinderrucksäcken, daneben eine Kleiderstange.
  '0072eb86': 'laden-regal',
  // Spieluhren als Stern, Fuchs und Wolke vor einer Reihe Strickjacken.
  '45e92a01': 'spieluhren',
  // Ladeneingang mit Fußmatte, davor ein Herbstoutfit und ein Puppenwagen.
  '0e27b393': 'eingang',
  // Dasselbe Outfit im Freien vor dem Laden, Herbstlaub im Hintergrund.
  '8b61245a': 'outfit-herbst',
  // Schaufenster mit großer roter Schleife, Winterdekoration.
  '45f45fce': 'schaufenster',
  // Zusammengestelltes Outfit auf der Schaufensterpuppe.
  'cbfdb467': 'outfit-mannequin',
};

/** Zeilenprofil: Mittelwert und Streuung der Luminanz je Bildzeile. */
function rowProfile(data, width, height, channels) {
  const rows = new Array(height);
  const step = 4;
  const samples = Math.ceil(width / step);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    let sumSq = 0;
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * channels;
      const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      sum += l;
      sumSq += l * l;
    }
    const mean = sum / samples;
    rows[y] = { mean, sd: Math.sqrt(Math.max(0, sumSq / samples - mean * mean)) };
  }
  return rows;
}

function photoBand(rows, width, height) {
  const isChrome = (r) => r.mean < 24 && r.sd < 10;

  let best = null;
  let run = null;
  for (let y = 0; y < height; y++) {
    if (isChrome(rows[y])) {
      if (run && (!best || run.end - run.start > best.end - best.start)) best = run;
      run = null;
    } else if (run) {
      run.end = y;
    } else {
      run = { start: y, end: y };
    }
  }
  if (run && (!best || run.end - run.start > best.end - best.start)) best = run;
  if (!best) return { top: 0, height };

  let { start, end } = best;
  while (start < end && rows[start].mean < 60) start++;
  while (end > start && rows[end].mean < 60) end--;

  const target = Math.round(width / SOURCE_ASPECT);
  if (end - start + 1 > target) start = end - target + 1;

  return { top: start, height: end - start + 1 };
}

const files = readdirSync(SRC_DIR);
await mkdir(OUT_DIR, { recursive: true });

const results = [];

for (const [prefix, slot] of Object.entries(MAP)) {
  const file = files.find((f) => f.startsWith(prefix) && /\.(png|jpe?g)$/i.test(f));
  if (!file) {
    console.warn(`QUELLE FEHLT für Slot "${slot}" (Präfix ${prefix})`);
    continue;
  }

  const src = path.join(SRC_DIR, file);
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rows = rowProfile(data, info.width, info.height, info.channels);
  const band = photoBand(rows, info.width, info.height);

  const target = path.join(OUT_DIR, `${slot}.webp`);
  const out = await sharp(src)
    .extract({ left: 0, top: band.top, width: info.width, height: band.height })
    .webp({ quality: 86, effort: 6 })
    .toFile(target);

  results.push({
    slot,
    breite: out.width,
    hoehe: out.height,
    verhaeltnis: (out.width / out.height).toFixed(3),
    kb: Math.round(out.size / 1024),
  });
}

console.table(results);
