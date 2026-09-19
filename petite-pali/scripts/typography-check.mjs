/**
 * Meldet Überschriften, deren letzte Zeile als kurze Waise stehen bleibt.
 *
 * Mehrzeilige Überschriften sind gewollt — eine gestrandete Restzeile aus einem
 * oder zwei kurzen Wörtern ist es nicht. Gemessen wird über Range-Rechtecke:
 * damit steht fest, wo der Browser tatsächlich umbrochen hat, statt es aus der
 * Zeichenzahl zu schätzen.
 *
 * Gemessen wird mit reduzierter Bewegung. Nicht um etwas zu umgehen: bei
 * eingeschalteter Bewegung zerlegt SplitText die Überschrift in Zeilen-Container,
 * und deren Rechtecke sind so breit wie der Block — die Messung sähe dann
 * Zeilen, die es typografisch nicht gibt. Der Umbruch selbst ist in beiden
 * Fällen derselbe.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/typography-check.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const ROUTES = ['/', '/sortiment/', '/sortiment/fruehchen/', '/sortiment/tragehilfen/', '/shopping-termin/', '/gutschein/', '/ueber-uns/', '/galerie/', '/aktuelles/', '/kontakt/'];
const WIDTHS = [375, 768, 1280, 1920];

const browser = await launchBrowser();
let failures = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const orphans = await page.evaluate(() => {
      const found = [];
      for (const h of document.querySelectorAll('h1, h2')) {
        const text = h.textContent.trim();
        if (!text) continue;

        // Zeilen über Range-Rechtecke bestimmen: das ist der echte Umbruch.
        const range = document.createRange();
        range.selectNodeContents(h);
        const rects = [...range.getClientRects()].filter((r) => r.width > 0);
        if (rects.length < 2) continue;

        const tops = [...new Set(rects.map((r) => Math.round(r.top)))].sort((a, b) => a - b);
        if (tops.length < 2) continue;

        const lastTop = tops[tops.length - 1];
        const lastWidth = rects
          .filter((r) => Math.round(r.top) === lastTop)
          .reduce((sum, r) => sum + r.width, 0);
        const widest = Math.max(...rects.map((r) => r.width));

        // Waise: letzte Zeile unter einem Viertel der breitesten Zeile.
        if (lastWidth < widest * 0.25) {
          found.push(`„${text.slice(0, 34)}“ letzte Zeile ${Math.round(lastWidth)}px von ${Math.round(widest)}px`);
        }
      }
      return found;
    });

    if (orphans.length) failures++;
    console.log(
      `${orphans.length ? 'FEHL' : ' OK '}  ${route.padEnd(16)} ${String(width).padStart(4)}  ${orphans.join(' | ')}`,
    );
    await ctx.close();
  }
}

await browser.close();
console.log(failures === 0 ? '\nKeine verwaisten Überschriftenzeilen.' : `\n${failures} Fall/Fälle.`);
process.exit(failures === 0 ? 0 : 1);
