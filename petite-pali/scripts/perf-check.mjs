/**
 * LCP, CLS und Transfergewicht je Route.
 *
 * Die Gewichte stammen aus der Resource-Timing-API und nicht aus
 * Response-Headern: Next liefert JS und CSS komprimiert und ohne
 * `content-length`, eine Header-Auswertung meldete dafür stillschweigend null.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/perf-check.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const ROUTES = ['/', '/sortiment/', '/secondhand/', '/ueber-uns/', '/kontakt/'];

/** Schwellen, ab denen eine Seite auffällig wird. */
const BUDGET = { lcp: 2500, cls: 0.1, totalKb: 3000 };

const browser = await launchBrowser();
let failures = 0;
const rows = [];

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);

  const m = await page.evaluate(() => {
    const byType = {};
    let total = 0;
    for (const r of performance.getEntriesByType('resource')) {
      const size = r.transferSize || r.encodedBodySize || 0;
      const kind = r.initiatorType === 'img' ? 'Bild' : r.initiatorType;
      byType[kind] = (byType[kind] ?? 0) + size;
      total += size;
    }
    return {
      lcp: Math.round(window.__lcp),
      cls: Number(window.__cls.toFixed(3)),
      totalKb: Math.round(total / 1024),
      byType: Object.fromEntries(
        Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)]),
      ),
    };
  });

  const problems = [];
  if (m.lcp > BUDGET.lcp) problems.push(`LCP ${m.lcp}ms`);
  if (m.cls > BUDGET.cls) problems.push(`CLS ${m.cls}`);
  if (m.totalKb > BUDGET.totalKb) problems.push(`${m.totalKb} KB`);
  if (problems.length) failures++;

  rows.push({
    Route: route,
    'LCP ms': m.lcp,
    CLS: m.cls,
    'Gesamt KB': m.totalKb,
    Details: Object.entries(m.byType).map(([k, v]) => `${k} ${v}`).join(', '),
    Status: problems.length ? `FEHL: ${problems.join('; ')}` : 'OK',
  });
  await ctx.close();
}

await browser.close();
console.table(rows);
console.log(failures === 0 ? 'Alle Leistungsprüfungen im Budget.' : `${failures} Route(n) außerhalb des Budgets.`);
process.exit(failures === 0 ? 0 : 1);
