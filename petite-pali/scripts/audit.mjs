/**
 * Kontrastprüfung gegen die tatsächlich gerenderte Seite.
 *
 * Für jedes Element mit eigenem Text wird die Textfarbe genommen und der
 * Hintergrund durch Hochlaufen der Elternkette bestimmt — halbdurchsichtige
 * Flächen werden dabei übereinandergelegt, statt sie zu ignorieren. Gemessen
 * wird gegen die WCAG-Schwellen: 4,5:1 für Fließtext, 3:1 ab 24px bzw. ab
 * 18,66px fett.
 *
 * Text, der über Bild oder Video steht, lässt sich so nicht beurteilen. Solche
 * Stellen werden nicht stillschweigend übersprungen, sondern eigens gemeldet —
 * die Gestaltung dieser Seite stellt Text bewusst nie auf bewegtes Bild, und
 * diese Meldung ist die Kontrolle dafür.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/audit.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const ROUTES = ['/', '/sortiment/', '/secondhand/', '/ueber-uns/', '/kontakt/', '/impressum/', '/datenschutz/'];

const browser = await launchBrowser();
let failures = 0;
let overMedia = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const result = await page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n));
      return { r, g, b, a };
    };
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });
    const lum = ({ r, g, b }) => {
      const f = (v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
      const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
      return (hi + 0.05) / (lo + 0.05);
    };

    const problems = [];
    const media = [];

    for (const el of document.querySelectorAll('body *')) {
      // Nur Elemente mit eigenem Textinhalt.
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;

      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (el.closest('[aria-hidden="true"]')) continue;

      const fg = parse(cs.color);
      if (!fg) continue;

      // Hintergrund aus der Elternkette zusammensetzen.
      let bg = null;
      let onMedia = false;
      for (let p = el; p; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.backgroundImage && ps.backgroundImage !== 'none') onMedia = true;
        const c = parse(ps.backgroundColor);
        if (c && c.a > 0) {
          bg = bg ? over(bg, c) : c;
          if (bg.a >= 0.999) break;
        }
      }
      // Liegt ein Video oder Bild als Geschwister darunter?
      if (el.closest('[data-surface="media"]') && !bg) onMedia = true;

      if (onMedia && (!bg || bg.a < 0.999)) {
        media.push(`${el.tagName.toLowerCase()} „${el.textContent.trim().slice(0, 24)}“`);
        continue;
      }
      if (!bg) bg = { r: 255, g: 255, b: 255, a: 1 };

      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      const r = ratio(fg, bg);

      if (r < need) {
        problems.push(
          `${el.tagName.toLowerCase()} „${el.textContent.trim().slice(0, 28)}“ ${r.toFixed(2)}:1 < ${need}`,
        );
      }
    }
    return { problems: problems.slice(0, 6), media: media.slice(0, 4), mediaCount: media.length };
  });

  if (result.problems.length) failures++;
  if (result.mediaCount) overMedia += result.mediaCount;

  console.log(
    `${result.problems.length ? 'FEHL' : ' OK '}  ${route.padEnd(16)} ${result.problems.join(' | ')}`,
  );
  if (result.mediaCount) {
    console.log(`      über Bild/Video, nicht messbar: ${result.media.join(', ')}`);
  }
  await ctx.close();
}

await browser.close();
if (overMedia) console.log(`\nHinweis: ${overMedia} Textstelle(n) über Bildmaterial — bitte ansehen.`);
console.log(failures === 0 ? '\nAlle Kontrastprüfungen bestanden.' : `\n${failures} Seite(n) mit zu geringem Kontrast.`);
process.exit(failures === 0 ? 0 : 1);
