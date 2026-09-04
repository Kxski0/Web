/**
 * Derives the brand assets from the supplied logo.
 *
 * The artwork itself is NOT altered — no recolouring, no recomposition. Only
 * cropping to the lockup's own regions and, for the icons, placing the mark on
 * an off-white plate. The logo is drawn for light backgrounds, and a favicon
 * supplies its own ground anyway.
 *
 * Region boundaries were measured from the file's alpha profile, not guessed:
 * rows 47-531 hold the mark, 540-786 the wordmark, 821-857 the descriptor.
 */
import path from 'node:path';
import sharp from 'sharp';

const SRC = process.argv[2];
const OUT = path.join(process.cwd(), 'public', 'images', 'brand');
const APP = path.join(process.cwd(), 'src', 'app');

const OFFWHITE = { r: 0xf1, g: 0xf0, b: 0xeb, alpha: 1 };

const LOCKUP = { left: 45, top: 47, width: 1685, height: 811 };
const MARK = { left: 422, top: 47, width: 1012, height: 485 };
/*
 * Mark plus wordmark, without the descriptor line. At header size the descriptor
 * renders around five pixels tall and reads as noise. Dropping it for small
 * applications is ordinary brand practice, but it is still an adaptation of a
 * supplied asset — noted in CONTENT-TODO.md for confirmation.
 */
const COMPACT = { left: 45, top: 47, width: 1685, height: 740 };

const results = [];
const record = async (label, pipeline, file) => {
  const info = await pipeline.toFile(file);
  results.push({ label, file: path.basename(file), size: `${info.width}x${info.height}`, kb: Math.round(info.size / 1024) });
};

/*
 * Full lockup and mark, transparent, for use on light surfaces.
 *
 * WebP with alpha rather than PNG: the source is a soft-gradient illustration,
 * which PNG stores badly (the untouched crop is nearly a megabyte). Capped at
 * 1200px because nothing on the site displays the lockup wider than about 400.
 */
await record(
  'lockup',
  sharp(SRC).extract(LOCKUP).resize({ width: 1200 }).webp({ quality: 92, alphaQuality: 100, effort: 6 }),
  path.join(OUT, 'solbautec-logo.webp'),
);
await record(
  'compact',
  sharp(SRC).extract(COMPACT).resize({ width: 900 }).webp({ quality: 92, alphaQuality: 100, effort: 6 }),
  path.join(OUT, 'solbautec-logo-compact.webp'),
);
await record(
  'mark',
  sharp(SRC).extract(MARK).resize({ width: 800 }).webp({ quality: 92, alphaQuality: 100, effort: 6 }),
  path.join(OUT, 'solbautec-mark.webp'),
);

/**
 * Icons: the mark centred on an off-white plate with breathing room. The mark is
 * roughly 2:1, so it is fitted by width and padded vertically rather than
 * stretched.
 */
async function icon(size, file) {
  const inner = Math.round(size * 0.82);
  const mark = await sharp(SRC)
    .extract(MARK)
    .resize({ width: inner, fit: 'inside' })
    .png()
    .toBuffer();
  const plate = sharp({
    create: { width: size, height: size, channels: 4, background: OFFWHITE },
  });
  await record(`icon ${size}`, plate.composite([{ input: mark, gravity: 'center' }]).png(), file);
}

await icon(64, path.join(APP, 'icon.png'));
await icon(180, path.join(APP, 'apple-icon.png'));

console.table(results);
