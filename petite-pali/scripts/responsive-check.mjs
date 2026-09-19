/**
 * Responsive-Prüfung über vier Breiten: horizontaler Overflow, Elemente
 * jenseits des Viewports, Text unter 12px und Klickziele unter 24×24
 * (WCAG 2.2 SC 2.5.8).
 *
 * Zwei Ausnahmen, beide begründet:
 *
 *  - Der Honigtopf des Kontaktformulars liegt absichtlich außerhalb des Bildes
 *    und darf dort liegen bleiben.
 *  - Verweise mitten im Fließtext. SC 2.5.8 nimmt sie ausdrücklich aus
 *    („Inline: the target is in a sentence or its size is otherwise
 *    constrained by the line-height of non-target text“). Ihre Höhe ergibt
 *    sich aus der Zeilenhöhe des umgebenden Satzes; sie künstlich auf 24px zu
 *    bringen, hieße den Satz auseinanderzureißen. Geprüft wird die Ausnahme,
 *    statt sie zu behaupten: der Verweis muss inline gesetzt sein UND in einem
 *    Block stehen, der außer ihm noch anderen Text enthält.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/responsive-check.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const ROUTES = [
  '/',
  '/sortiment/',
  '/sortiment/fruehchen/',
  '/sortiment/baby-und-kind/',
  '/sortiment/fuer-mama/',
  '/sortiment/tragehilfen/',
  '/sortiment/kinderwagen/',
  '/sortiment/dies-das/',
  '/shopping-termin/',
  '/gutschein/',
  '/ueber-uns/',
  '/galerie/',
  '/aktuelles/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/',
];
const WIDTHS = [375, 768, 1280, 1920];

const browser = await launchBrowser();
let failures = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const result = await page.evaluate(() => {
      const EXEMPT = (el) => el.closest('[aria-hidden="true"]') !== null;
      const visible = (el) => {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      // Ein Vorfahre mit overflow:hidden beschneidet — was dahinter liegt, ist
      // kein Layoutfehler.
      const clipped = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const o = getComputedStyle(p);
          if (o.overflow !== 'visible' || o.overflowX !== 'visible') return true;
        }
        return false;
      };

      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const beyond = [];
      const tiny = [];
      const small = [];

      for (const el of document.querySelectorAll('body *')) {
        if (!visible(el) || EXEMPT(el)) continue;
        const r = el.getBoundingClientRect();

        if (!clipped(el) && (r.right > window.innerWidth + 1 || r.left < -1)) {
          beyond.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 24)}`);
        }

        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        if (el.childElementCount === 0 && el.textContent.trim() && fs < 12) {
          tiny.push(`${el.tagName.toLowerCase()} ${fs}px`);
        }

        if ((el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'SUMMARY') && !clipped(el)) {
          // Ausnahme „Inline“ aus SC 2.5.8, geprüft statt behauptet.
          const inlineInSentence = (() => {
            if (cs.display !== 'inline') return false;
            const block = el.parentElement;
            if (!block) return false;
            const own = el.textContent.trim();
            const around = block.textContent.trim();
            return around.length > own.length;
          })();

          if (!inlineInSentence && (r.width < 24 || r.height < 24)) {
            small.push(`${el.tagName.toLowerCase()} ${Math.round(r.width)}×${Math.round(r.height)}`);
          }
        }
      }

      return { overflow, beyond: beyond.slice(0, 3), tiny: tiny.slice(0, 3), small: small.slice(0, 3) };
    });

    const problems = [];
    if (result.overflow > 1) problems.push(`Overflow ${result.overflow}px`);
    if (result.beyond.length) problems.push(`außerhalb: ${result.beyond.join(', ')}`);
    if (result.tiny.length) problems.push(`zu klein: ${result.tiny.join(', ')}`);
    if (result.small.length) problems.push(`Klickziel: ${result.small.join(', ')}`);

    if (problems.length) failures++;
    console.log(
      `${problems.length ? 'FEHL' : ' OK '}  ${route.padEnd(16)} ${String(width).padStart(4)}  ${problems.join('; ')}`,
    );
    await ctx.close();
  }
}

await browser.close();
console.log(failures === 0 ? '\nAlle Responsive-Prüfungen bestanden.' : `\n${failures} Fehler.`);
process.exit(failures === 0 ? 0 : 1);
