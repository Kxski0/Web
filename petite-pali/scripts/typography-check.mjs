/**
 * Zwei typografische Prüfungen:
 *
 *  1. Satzspiegel — Zeichen je Zeile im Fließtext. Gezählt werden echte
 *     Zeichen über Range-Rechtecke, nicht aus der Breite geschätzt: `ch` ist
 *     die Breite der Ziffer Null und bei DM Sans deutlich breiter als das
 *     durchschnittliche Zeichen. 62ch ergaben gemessene 89 Zeichen — eine
 *     Schätzung hätte diesen Fehler nie gezeigt.
 *  2. Waisen — Überschriften, deren letzte Zeile als kurzer Rest stehen bleibt.
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

/** Obergrenze für Fließtext. Darüber verliert das Auge beim Zeilenwechsel den Anschluss. */
const MAX_CHARS_PER_LINE = 68;

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

    const measure = await page.evaluate((limit) => {
      function charsPerLine(el) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const perLine = new Map();
        const range = document.createRange();
        let node;
        while ((node = walker.nextNode())) {
          const text = node.textContent;
          for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') continue;
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rect = range.getClientRects()[0];
            if (!rect) continue;
            const key = Math.round(rect.top);
            perLine.set(key, (perLine.get(key) ?? 0) + 1);
          }
        }
        const lines = [...perLine.values()];
        if (lines.length < 2) return null;
        // Die letzte Zeile ist immer kurz und verfälscht den Schnitt.
        lines.pop();
        return Math.round(lines.reduce((a, b) => a + b, 0) / lines.length);
      }

      return [...document.querySelectorAll('p, li')]
        .filter((el) => el.textContent.trim().length > 150)
        .map((el) => ({ chars: charsPerLine(el), text: el.textContent.trim().slice(0, 30) }))
        .filter((x) => x.chars && x.chars > limit);
    }, MAX_CHARS_PER_LINE);

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

    const measureProblems = measure.map((m) => `${m.chars} Zeichen/Zeile „${m.text}…"`);
    const all = [...measureProblems, ...orphans];
    if (all.length) failures++;
    console.log(
      `${all.length ? 'FEHL' : ' OK '}  ${route.padEnd(28)} ${String(width).padStart(4)}  ${all.join(' | ')}`,
    );
    await ctx.close();
  }
}

await browser.close();
console.log(
  failures === 0
    ? `\nSatzspiegel überall unter ${MAX_CHARS_PER_LINE} Zeichen, keine verwaisten Überschriftenzeilen.`
    : `\n${failures} Fall/Fälle.`,
);
process.exit(failures === 0 ? 0 : 1);
