/**
 * Scrollt jede Seite vollständig durch und meldet Konsolenfehler, Warnungen und
 * fehlgeschlagene Requests. Das Durchscrollen ist der Punkt: lazy geladene
 * Bilder und scrollgesteuerte Abschnitte kommen sonst nie an die Reihe.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/console-check.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const ROUTES = ['/', '/sortiment/', '/secondhand/', '/ueber-uns/', '/kontakt/', '/impressum/', '/datenschutz/'];

const browser = await launchBrowser();
let failures = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const problems = [];

  page.on('pageerror', (e) => problems.push(`JS: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on('requestfailed', (r) => {
    problems.push(`Request: ${r.url().slice(0, 80)} — ${r.failure()?.errorText}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`${r.status()}: ${r.url().slice(0, 80)}`);
  });

  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);

  if (problems.length) failures++;
  console.log(`${problems.length ? 'FEHL' : ' OK '}  ${route.padEnd(16)} ${problems.slice(0, 3).join(' | ')}`);
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nKeine Konsolenfehler.' : `\n${failures} Seite(n) mit Meldungen.`);
process.exit(failures === 0 ? 0 : 1);
