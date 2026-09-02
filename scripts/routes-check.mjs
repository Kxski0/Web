/**
 * Route-level checks across every page: status, one h1, unique title and
 * description, canonical, no horizontal overflow, no broken internal links,
 * and no console errors.
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3100';
const ROUTES = [
  '/',
  '/photovoltaik/',
  '/stromspeicher/',
  '/waermepumpe/',
  '/energiemanagement/',
  '/klima/',
  '/carports-terrassenueberdachungen/',
  '/projekte/',
  '/ueber-uns/',
  '/kontakt/',
];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0;
const titles = new Map();
const descriptions = new Map();
const internalLinks = new Set();

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

  const response = await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const info = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    h1Count: document.querySelectorAll('h1').length,
    h1: document.querySelector('h1')?.textContent?.trim().slice(0, 40) ?? '',
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
    links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
    lang: document.documentElement.lang,
  }));

  info.links.forEach((l) => internalLinks.add(l.split('#')[0] || '/'));

  const problems = [];
  if (response.status() !== 200) problems.push(`status ${response.status()}`);
  if (info.h1Count !== 1) problems.push(`${info.h1Count} h1 elements`);
  if (!info.title) problems.push('no title');
  if (!info.description) problems.push('no meta description');
  if (!info.canonical) problems.push('no canonical');
  if (info.lang !== 'de') problems.push(`lang="${info.lang}"`);
  if (info.overflow > 1) problems.push(`horizontal overflow ${info.overflow}px`);
  if (info.jsonLd === 0) problems.push('no structured data');
  if (consoleErrors.length) problems.push(`console: ${consoleErrors[0].slice(0, 60)}`);
  if (titles.has(info.title)) problems.push(`title duplicates ${titles.get(info.title)}`);
  if (descriptions.has(info.description)) {
    problems.push(`description duplicates ${descriptions.get(info.description)}`);
  }
  titles.set(info.title, route);
  descriptions.set(info.description, route);

  if (problems.length) failures++;
  console.log(
    `${problems.length ? 'FAIL' : 'PASS'}  ${route.padEnd(36)} ${problems.join('; ') || `h1 "${info.h1}"`}`,
  );
  await ctx.close();
}

// Every internal link must resolve.
console.log('\n--- internal links ---');
for (const href of [...internalLinks].sort()) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const res = await page.goto(BASE + href, { waitUntil: 'domcontentloaded' }).catch(() => null);
  const status = res?.status() ?? 0;
  if (status !== 200) {
    failures++;
    console.log(`FAIL  ${href} -> ${status}`);
  } else {
    console.log(`PASS  ${href}`);
  }
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nAll route checks passed.' : `\n${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
