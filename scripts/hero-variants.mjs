/**
 * The hero is the LCP element and needs art direction, not just scaling: a
 * downscaled landscape frame loses the building on a phone (§42). next/image
 * cannot express two different crops, so the hero is served through <picture>
 * and its variants are generated here instead.
 */
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.join(process.cwd(), 'public', 'images');
const LANDSCAPE = path.join(OUT, 'hero-energy-system.webp');
const PORTRAIT = path.join(OUT, 'hero-energy-system-portrait.webp');

const JOBS = [
  { src: LANDSCAPE, name: 'hero-energy-system', widths: [1536, 1152, 768] },
  { src: PORTRAIT, name: 'hero-energy-system-portrait', widths: [768, 512] },
];

const results = [];

for (const job of JOBS) {
  for (const width of job.widths) {
    for (const format of ['avif', 'webp']) {
      const out = path.join(OUT, `${job.name}-${width}.${format}`);
      const pipeline = sharp(job.src).resize({ width });
      const info = await (format === 'avif'
        ? pipeline.avif({ quality: 55, effort: 6 })
        : pipeline.webp({ quality: 84, effort: 6 })
      ).toFile(out);
      results.push({ file: path.basename(out), kb: Math.round(info.size / 1024) });
    }
  }
}

console.table(results);
