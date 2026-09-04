/**
 * Core Web Vitals and transfer weight per route.
 *
 * Measured in the browser rather than estimated from bundle stats: LCP and CLS
 * are what the field metric actually reports, and a bundle graph cannot say
 * which element painted last or whether the layout moved while it did.
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3100';
const ROUTES = ['/', '/photovoltaik/', '/stromspeicher/', '/kontakt/', '/energiemanagement-augsburg/'];

// LCP 2500ms and CLS 0.1 are the "good" thresholds for Core Web Vitals.
const BUDGET = { lcp: 2500, cls: 0.1, jsKb: 300, totalKb: 1400 };

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(BASE + route, { waitUntil: 'networkidle' });

  /*
   * Weights come from Resource Timing, not from response headers. Next serves
   * its JS and CSS compressed and chunked, with no content-length, so a
   * header-based tally silently reported zero for exactly the bytes that matter.
   * transferSize is what actually crossed the wire.
   */
  const weights = await page.evaluate(() => {
    const acc = { js: 0, css: 0, img: 0, font: 0, other: 0, doc: 0 };
    for (const r of performance.getEntriesByType('resource')) {
      const size = r.transferSize || r.encodedBodySize || 0;
      const kind =
        r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name)
          ? 'js'
          : r.initiatorType === 'link' && /\.css(\?|$)/.test(r.name)
            ? 'css'
            : /\.(woff2?|ttf)(\?|$)/.test(r.name)
              ? 'font'
              : r.initiatorType === 'img' || /_next\/image|\.(webp|avif|png|jpe?g|svg)(\?|$)/.test(r.name)
                ? 'img'
                : 'other';
      acc[kind] += size;
    }
    const nav = performance.getEntriesByType('navigation')[0];
    acc.doc = nav ? nav.transferSize || 0 : 0;
    return acc;
  });

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;
        let lcpElement = '';
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            lcp = entry.startTime;
            const el = entry.element;
            lcpElement = el ? el.tagName.toLowerCase() : '?';
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          resolve({
            lcp: Math.round(lcp),
            cls: Number(cls.toFixed(4)),
            lcpElement,
            ttfb: Math.round(nav ? nav.responseStart : 0),
          });
        }, 2500);
      }),
  );

  const kb = (n) => Math.round(n / 1024);
  const totalKb = kb(
    weights.js + weights.css + weights.img + weights.font + weights.other + weights.doc,
  );
  const problems = [];
  if (vitals.lcp > BUDGET.lcp) problems.push(`LCP ${vitals.lcp}ms`);
  if (vitals.cls > BUDGET.cls) problems.push(`CLS ${vitals.cls}`);
  if (kb(weights.js) > BUDGET.jsKb) problems.push(`JS ${kb(weights.js)}kb`);
  if (totalKb > BUDGET.totalKb) problems.push(`total ${totalKb}kb`);
  if (problems.length) failures++;

  console.log(
    `${problems.length ? 'FAIL' : 'PASS'}  ${route.padEnd(18)} ` +
      `LCP ${String(vitals.lcp).padStart(4)}ms <${vitals.lcpElement}>  CLS ${vitals.cls}  TTFB ${vitals.ttfb}ms  |  ` +
      `html ${kb(weights.doc)} js ${kb(weights.js)} css ${kb(weights.css)} img ${kb(weights.img)} font ${kb(weights.font)} = ${totalKb}kb` +
      (problems.length ? `  -> over: ${problems.join('; ')}` : ''),
  );
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nAll routes within budget.' : `\n${failures} route(s) over budget.`);
process.exit(failures === 0 ? 0 : 1);
