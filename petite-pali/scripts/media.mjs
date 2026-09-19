/**
 * Medienaufbereitung: Quellen → redaktionell zugeschnittene Bild-Slots.
 *
 * Zwei Quellarten:
 *
 *  1. Der einminütige Ladenrundgang (720×1280). Das ist das beste vorhandene
 *     Originalmaterial — echter Laden, keine App-Oberfläche, keine fremde
 *     Lizenz. Die Frames wurden nicht nach Gefühl gewählt: über den ganzen
 *     Clip wurde je Sekunde die Varianz des Laplace-Operators gemessen und aus
 *     den schärfsten Sekunden nach Bildinhalt ausgewählt. Verwacklete Frames
 *     kommen so gar nicht erst in die Auswahl.
 *
 *  2. Bildschirmfotos aus der Instagram-App. Um sie herum liegt App-Oberfläche;
 *     sie wird über das Luminanz-Zeilenprofil entfernt (praktisch schwarz UND
 *     praktisch einfarbig — beides zusammen erkennt sie, ohne dunkle
 *     Bildinhalte wegzuschneiden), danach wird auf das Quellformat 3:4
 *     normiert.
 *
 * Danach — und das ist der eigentliche Punkt dieses Skripts — bekommt jeder
 * Slot einen BEWUSSTEN Zuschnitt. Die Rohbilder sind Schnappschüsse: viel
 * toter Boden, Straße, Autos, das Motiv klein im Bild. Jeder Eintrag im
 * MANIFEST sagt deshalb, auf welchen Punkt zugeschnitten wird (`focus`), wie
 * eng (`zoom`) und in welches Seitenverhältnis (`aspect`).
 *
 * Auflösungsgrenze, offen benannt: die Quellen sind 720 bzw. 828 Pixel breit.
 * Für halbseitige und kleinere Flächen reicht das; für vollflächige Bänder
 * über 1440px wird es weich. Deshalb trägt der Hero Video statt Standbild, und
 * deshalb steht „Originaldateien anfordern" in CONTENT-TODO.md.
 *
 * Aufruf:  node scripts/media.mjs <screenshot-ordner> [pfad/zum/video.mp4]
 */
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const SHOT_DIR = process.argv[2];
const VIDEO = process.argv[3];
if (!SHOT_DIR) {
  console.error('Aufruf: node scripts/media.mjs <screenshot-ordner> [video.mp4]');
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), 'public', 'images');
const SOURCE_ASPECT = 3 / 4;

const ASPECTS = {
  hoch: 4 / 5,
  quer: 3 / 2,
  breit: 16 / 9,
  quadrat: 1,
};

/**
 * Jeder Eintrag ist eine Bildentscheidung, kein Automatismus.
 * `focus` ist der Punkt, der im Ausschnitt bleiben muss (0–1 je Achse).
 * `zoom` > 1 schneidet enger — so verschwindet toter Raum.
 */
const MANIFEST = [
  // --- Ladenrundgang -----------------------------------------------------
  {
    slot: 'boutique-fenster',
    video: 8,
    aspect: 'quer',
    focus: { x: 0.5, y: 0.44 },
    note: 'Schaufensterfront mit Auslagetisch, Büchern und Tageslicht. Der wärmste Blick in den Laden.',
  },
  {
    slot: 'boutique-eingang',
    video: 2,
    aspect: 'hoch',
    focus: { x: 0.46, y: 0.52 },
    zoom: 1.12,
    note: 'Eingangsbereich mit Tresen und Fußmatte.',
  },
  {
    slot: 'boutique-regalwand',
    video: 18,
    aspect: 'hoch',
    focus: { x: 0.52, y: 0.42 },
    zoom: 1.15,
    note: 'Regalwand mit gefalteter Strickware und Karten. Schärfster Frame des Clips.',
  },
  {
    slot: 'boutique-gang',
    video: 22,
    aspect: 'quer',
    focus: { x: 0.5, y: 0.5 },
    note: 'Gang zwischen den Stangen, Holzlamellenwand rechts.',
  },
  {
    slot: 'boutique-auswahl',
    video: 26,
    aspect: 'hoch',
    focus: { x: 0.5, y: 0.46 },
    zoom: 1.1,
    note: 'Regale und Stangen dicht an dicht — das handverlesene Sortiment.',
  },
  {
    slot: 'boutique-detail',
    video: 35,
    aspect: 'quadrat',
    focus: { x: 0.52, y: 0.27 },
    zoom: 1.75,
    note: 'Kuscheltier auf dem Regal über der Kleiderstange. Eng geschnitten — der erste Versuch zeigte das halbe Regal statt des Motivs.',
  },
  {
    slot: 'boutique-mitte',
    video: 57,
    aspect: 'quer',
    focus: { x: 0.5, y: 0.56 },
    zoom: 1.08,
    note: 'Mitteltisch mit gefalteter Ware, darunter die Roller.',
  },
  {
    slot: 'boutique-beratung',
    video: 15,
    aspect: 'hoch',
    focus: { x: 0.55, y: 0.44 },
    zoom: 1.18,
    note: 'Kleiner Tisch zwischen den Stangen — hier wird beraten.',
  },

  // --- Instagram-Bildschirmfotos -----------------------------------------
  {
    slot: 'ware-tisch',
    shot: '86f68fbc',
    aspect: 'quer',
    focus: { x: 0.5, y: 0.42 },
    zoom: 1.15,
    note: 'Verkaufstisch voller gefalteter Kinderkleidung.',
  },
  {
    slot: 'ware-spieluhren',
    shot: '45e92a01',
    aspect: 'hoch',
    focus: { x: 0.44, y: 0.46 },
    zoom: 1.1,
    note: 'Spieluhren als Stern, Fuchs und Wolke.',
  },
  {
    slot: 'ware-regal',
    shot: '0072eb86',
    aspect: 'hoch',
    focus: { x: 0.42, y: 0.44 },
    zoom: 1.12,
    note: 'Regal mit Kuscheltieren und Kinderrucksäcken.',
  },
  {
    // Bewusst NICHT als „Für Mama" geführt: auf dem Bild ist ein
    // Weihnachtsschaufenster mit Schleife zu sehen, und ob die dunklen Kleider
    // Umstandsmode sind, ist daraus nicht belegt. Ein Bild falsch zu
    // etikettieren wäre eine erfundene Tatsache.
    slot: 'schaufenster-winter',
    shot: '45f45fce',
    aspect: 'quer',
    focus: { x: 0.5, y: 0.4 },
    zoom: 1.2,
    note: 'Schaufenster mit roter Samtschleife — saisonal, deshalb nur dort einsetzen, wo Saison passt.',
  },
  {
    slot: 'outfit-kind',
    shot: 'cbfdb467',
    aspect: 'hoch',
    focus: { x: 0.5, y: 0.36 },
    zoom: 1.22,
    note: 'Zusammengestelltes Kinderoutfit — eng geschnitten, ohne den leeren Boden darunter.',
  },
  {
    slot: 'outfit-herbst',
    shot: '8b61245a',
    aspect: 'hoch',
    focus: { x: 0.42, y: 0.5 },
    zoom: 1.5,
    note: 'Herbstoutfit — eng auf die Kleidung geschnitten, ohne Straße und Autos.',
  },
  {
    slot: 'tuer',
    shot: '0e27b393',
    aspect: 'quadrat',
    focus: { x: 0.42, y: 0.56 },
    zoom: 1.2,
    note: 'Ladeneingang mit Fußmatte.',
  },
];

/* --- Instagram-Oberfläche entfernen --------------------------------------- */

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
    } else if (run) run.end = y;
    else run = { start: y, end: y };
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

/* --- Zuschnitt ------------------------------------------------------------ */

/**
 * Größtmöglicher Ausschnitt im Zielverhältnis, um `zoom` verengt und so
 * verschoben, dass `focus` im Bild bleibt — ohne über den Rand zu laufen.
 */
function cropRect(width, height, aspect, focus, zoom = 1) {
  let w = width;
  let h = Math.round(w / aspect);
  if (h > height) {
    h = height;
    w = Math.round(h * aspect);
  }
  w = Math.round(w / zoom);
  h = Math.round(h / zoom);

  const left = Math.round(Math.min(Math.max(focus.x * width - w / 2, 0), width - w));
  const top = Math.round(Math.min(Math.max(focus.y * height - h / 2, 0), height - h));
  return { left, top, width: w, height: h };
}

/* --- Lauf ----------------------------------------------------------------- */

await mkdir(OUT_DIR, { recursive: true });
const work = await mkdtemp(path.join(tmpdir(), 'pp-media-'));
const shots = readdirSync(SHOT_DIR);
const results = [];

for (const entry of MANIFEST) {
  let source;

  if (entry.video !== undefined) {
    if (!VIDEO) {
      console.warn(`ÜBERSPRUNGEN (kein Video übergeben): ${entry.slot}`);
      continue;
    }
    source = path.join(work, `${entry.slot}.png`);
    execFileSync(ffmpeg, [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-ss', String(entry.video), '-i', VIDEO, '-frames:v', '1', source,
    ]);
  } else {
    const file = shots.find((f) => f.startsWith(entry.shot) && /\.(png|jpe?g)$/i.test(f));
    if (!file) {
      console.warn(`QUELLE FEHLT für Slot "${entry.slot}" (Präfix ${entry.shot})`);
      continue;
    }
    const raw = path.join(SHOT_DIR, file);
    const { data, info } = await sharp(raw).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const band = photoBand(rowProfile(data, info.width, info.height, info.channels), info.width, info.height);
    source = path.join(work, `${entry.slot}.png`);
    await sharp(raw).extract({ left: 0, top: band.top, width: info.width, height: band.height }).toFile(source);
  }

  const meta = await sharp(source).metadata();
  const rect = cropRect(meta.width, meta.height, ASPECTS[entry.aspect], entry.focus, entry.zoom);

  const out = await sharp(source)
    .extract(rect)
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(OUT_DIR, `${entry.slot}.webp`));

  results.push({
    slot: entry.slot,
    quelle: entry.video !== undefined ? `Video ${entry.video}s` : `Foto ${entry.shot}`,
    format: entry.aspect,
    px: `${out.width}×${out.height}`,
    kb: Math.round(out.size / 1024),
  });
}

await rm(work, { recursive: true, force: true });
console.table(results);
