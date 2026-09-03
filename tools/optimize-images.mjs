/**
 * Einmal-Skript. Wandelt die Studio-Fotos in AVIF + WebP um und erzeugt
 * ein Manifest samt LQIP-Platzhaltern. Die Ausgabe wird committet, die
 * PNG-Originale nicht: sie wiegen zusammen knapp 15 MB.
 *
 *   npm install && npm run images
 *
 * Quelle ueberschreibbar via SRC_DIR, falls die Originale woanders liegen.
 */
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const SRC_DIR = process.env.SRC_DIR
  ?? '/root/.claude/uploads/2bd92bfa-1069-5014-bd9e-3cad9ef55415';
const OUT_DIR = resolve('assets/img');

/** Reihenfolge = Reihenfolge auf der Seite. */
const ROSTER = [
  { id: 'abnahme',      src: 'bd1aafb9-image.png', alt: 'Zwei Gestalter beugen sich ueber ausgelegte Schwarzweiss-Abzuege und Layoutboegen auf einem schwarzen Tisch.' },
  { id: 'kontaktbogen', src: 'f8a6b29a-image.png', alt: 'Kontaktboegen und Druckproben ueberlappen auf einer schwarzen Tischplatte, daneben ein aufgeklappter Laptop und eine dunkle Mappe mit Praegung.' },
  { id: 'atelier',      src: 'bb2e6e18-image.png', alt: 'Weiter Blick ins Studio: ein Gestalter am Eichentisch vor einem Monitor mit Bildraster, dahinter Betonwand und Fensterfront.' },
  { id: 'skizze',       src: '81d54987-image.png', alt: 'Ueber die Schulter fotografiert: eine Hand zeichnet Wireframes ins Skizzenbuch, ringsum liegen Abzuege, im Hintergrund ein Monitor voller Bildkader.' },
  { id: 'entwurf',      src: 'c04c22b8-image.png', alt: 'Ein Gestalter arbeitet im Profil an Layoutboegen mit Diagrammen, daneben Laptop und ein praegegestempeltes Notizbuch.' },
  { id: 'praegung',     src: 'aa8dc228-image.png', alt: 'Detailaufnahme: das blindgepraegte Monogramm auf einem schwarzen Notizbuch und einer schwarzen Visitenkarte, daneben Druckbleistift und Stahllineal.' },
  { id: 'portrait',     src: '65aa8ef5-image.png', alt: 'Portrait eines Gestalters am Fenster, im Ruecken eine Wand mit aufgehaengten Schwarzweiss-Abzuegen.' },
];

/** Nie hochskalieren — die Quellen sind 1536 bzw. 1122 px breit. */
const TARGET_WIDTHS = [1600, 800, 400];

const bytes = (n) => `${(n / 1024).toFixed(0)} kB`;

async function main() {
  let available;
  try {
    available = new Set(await readdir(SRC_DIR));
  } catch {
    console.error(`Quellverzeichnis nicht lesbar: ${SRC_DIR}`);
    console.error('Setze SRC_DIR auf den Ordner mit den PNG-Originalen.');
    process.exit(1);
  }

  const missing = ROSTER.filter((e) => !available.has(e.src));
  if (missing.length) {
    console.error(`Fehlende Quelldateien in ${SRC_DIR}:`);
    for (const m of missing) console.error(`  ${m.src}  (${m.id})`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const manifest = {};
  let total = 0;

  for (const entry of ROSTER) {
    const input = join(SRC_DIR, entry.src);
    const meta = await sharp(input).metadata();
    const record = {
      alt: entry.alt,
      width: meta.width,
      height: meta.height,
      ratio: +(meta.width / meta.height).toFixed(4),
      avif: [],
      webp: [],
    };

    for (const target of TARGET_WIDTHS) {
      // withoutEnlargement kappt auf die Quellbreite; der reale Wert
      // landet im Dateinamen, damit die srcset-Deskriptoren stimmen.
      const base = sharp(input).resize({ width: target, withoutEnlargement: true });

      for (const [format, options, list] of [
        ['avif', { quality: 50, effort: 6 }, record.avif],
        ['webp', { quality: 80, effort: 5 }, record.webp],
      ]) {
        const { data, info } = await base
          .clone()[format](options)
          .toBuffer({ resolveWithObject: true });

        // Bei gekappter Breite entstehen sonst zwei identische Dateien.
        if (list.some((v) => v.w === info.width)) continue;

        const file = `${entry.id}-${info.width}.${format}`;
        await writeFile(join(OUT_DIR, file), data);
        list.push({ w: info.width, file, bytes: data.length });
        total += data.length;
      }
    }

    // 20 px breiter Platzhalter, inline als data-URI im CSS.
    const lqip = await sharp(input)
      .resize({ width: 20 })
      .blur(1.2)
      .webp({ quality: 40 })
      .toBuffer();
    record.lqip = `data:image/webp;base64,${lqip.toString('base64')}`;

    manifest[entry.id] = record;

    const widths = record.webp.map((v) => v.w).join('/');
    const weight = [...record.avif, ...record.webp].reduce((a, v) => a + v.bytes, 0);
    console.log(`${entry.id.padEnd(13)} ${meta.width}x${meta.height}  ->  ${widths}  ${bytes(weight)}  lqip ${lqip.length} B`);
  }

  await writeFile(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`\nGesamt: ${bytes(total)} in ${Object.keys(manifest).length} Motiven.`);

  // Fertige srcset-Zeilen, damit die Deskriptoren nicht von Hand abgetippt werden.
  console.log('\n--- srcset ---');
  for (const [id, rec] of Object.entries(manifest)) {
    for (const format of ['avif', 'webp']) {
      const set = rec[format].map((v) => `assets/img/${v.file} ${v.w}w`).join(', ');
      console.log(`${id}.${format}: ${set}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
