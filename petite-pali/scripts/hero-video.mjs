/**
 * Hero-Video aus dem gelieferten Ladenrundgang.
 *
 * Die Quelle ist ein einminütiger Handyclip im Hochformat (720×1280, 30 fps,
 * ~12,7 MB) mit Musikspur. Für einen Hintergrund im Hero ist das in dieser Form
 * unbrauchbar: zu lang, zu schwer, und Ton verhindert Autoplay.
 *
 * Aufbereitung:
 *
 *  - Ausschnitt statt ganzem Clip. SEGMENT wählt den Abschnitt aus, in dem die
 *    Kamera ruhig durch den Laden geht.
 *  - Nahtlose Schleife. Der Anfang des Ausschnitts wird über sein Ende geblendet
 *    (xfade), sodass der Rücksprung auf Frame 0 keinen sichtbaren Schnitt hat.
 *    Ohne das springt jede Wiederholung.
 *  - Keine Tonspur. Autoplay ist nur stumm erlaubt, und eine Tonspur, die nie
 *    zu hören ist, wäre nur Gewicht.
 *  - Zwei Formate: WebM/VP9 und MP4/H.264. Das WebM ist etwas schwerer
 *    (rund 1456 KB gegen 1215 KB) — das kostet aber niemanden etwas, weil ein
 *    Browser genau eine Quelle lädt und die andere nie anfragt.
 *
 *    Ein Format allein reicht nicht: H.264 ist ein lizenzpflichtiger Codec und
 *    fehlt in quelloffenen Chromium-Bauten vollständig. Dort meldet das
 *    Video-Element `DEMUXER_ERROR_NO_SUPPORTED_STREAMS` und bleibt bei
 *    readyState 0 stehen — der Hero zeigt dann dauerhaft nur das Poster, ohne
 *    dass irgendetwas nach einem Fehler aussieht. Genau dieser Fall ist hier
 *    beim Prüfen aufgetreten.
 *
 *    Dazu ein Poster, das vor dem ersten Frame steht und bei reduzierter
 *    Bewegung an die Stelle des Videos tritt.
 *
 * Aufruf:  node scripts/hero-video.mjs <quelldatei.mp4>
 */
import { execFileSync } from 'node:child_process';
import { mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const SRC = process.argv[2];
if (!SRC) {
  console.error('Quelldatei fehlt.  node scripts/hero-video.mjs <quelldatei.mp4>');
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), 'public', 'video');
const POSTER = path.join(process.cwd(), 'public', 'images', 'hero-poster.webp');

/** Ausgewählter Abschnitt des Rundgangs, in Sekunden. */
const SEGMENT = { start: 22, duration: 15 };
/** Länge der Überblendung, mit der die Schleife geschlossen wird. */
const FADE = 1;
/** Ausgabegröße. Hochformat wie die Quelle; der Hero deckt daraus zu. */
const SIZE = { width: 720, height: 1280 };

const body = SEGMENT.duration - FADE;
const offset = body - FADE;

/**
 * Schneidet den Abschnitt heraus und legt seinen Anfang über sein Ende.
 * Ergebnislänge ist `body`; danach ist das Bild identisch mit Frame 0.
 */
const FILTER = [
  `[0:v]trim=${SEGMENT.start}:${SEGMENT.start + SEGMENT.duration},setpts=PTS-STARTPTS`,
  `scale=${SIZE.width}:${SIZE.height}:flags=lanczos,fps=25,split[a][b]`,
  `;[a]trim=0:${body},setpts=PTS-STARTPTS[koerper]`,
  `;[b]trim=0:${FADE},setpts=PTS-STARTPTS[anfang]`,
  `;[koerper][anfang]xfade=transition=fade:duration=${FADE}:offset=${offset}[v]`,
].join(',').replace(/,;/g, ';');

const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

await mkdir(OUT_DIR, { recursive: true });

run([
  '-i', SRC,
  '-filter_complex', FILTER,
  '-map', '[v]',
  '-an',
  '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '31',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  path.join(OUT_DIR, 'hero.mp4'),
]);

run([
  '-i', SRC,
  '-filter_complex', FILTER,
  '-map', '[v]',
  '-an',
  '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1',
  '-deadline', 'good', '-cpu-used', '2',
  path.join(OUT_DIR, 'hero.webm'),
]);

// Poster: der erste Frame des Ausschnitts — genau das Bild, das das Video
// zeigt, bevor es läuft, und das Standbild bei reduzierter Bewegung.
const framePng = path.join(OUT_DIR, '.poster.png');
run([
  '-ss', String(SEGMENT.start),
  '-i', SRC,
  '-frames:v', '1',
  '-vf', `scale=${SIZE.width}:${SIZE.height}:flags=lanczos`,
  framePng,
]);
await sharp(framePng).webp({ quality: 82, effort: 6 }).toFile(POSTER);
await rm(framePng);

const rows = [];
for (const f of ['hero.webm', 'hero.mp4']) {
  rows.push({ datei: f, kb: Math.round((await stat(path.join(OUT_DIR, f))).size / 1024) });
}
rows.push({ datei: 'hero-poster.webp', kb: Math.round((await stat(POSTER)).size / 1024) });
rows.push({ datei: `(Schleifenlänge ${body}s bei ${SIZE.width}×${SIZE.height})`, kb: '' });
console.table(rows);
