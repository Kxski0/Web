/**
 * Prüfung je Route: Status, genau ein h1, eindeutiger Titel und eindeutige
 * Beschreibung, Canonical, strukturierte Daten, lang="de", kein horizontaler
 * Overflow, keine Konsolenfehler. Danach werden alle internen Links aufgerufen
 * und müssen 200 liefern.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/routes-check.mjs
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

const browser = await launchBrowser();
let failures = 0;
const titles = new Map();
const descriptions = new Map();
const internalLinks = new Set();

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });

  const response = await page.goto(BASE + route, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

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
  if (response.status() !== 200) problems.push(`Status ${response.status()}`);
  if (info.h1Count !== 1) problems.push(`${info.h1Count} h1-Elemente`);
  if (!info.title) problems.push('kein Titel');
  if (!info.description) problems.push('keine Meta-Beschreibung');
  if (!info.canonical) problems.push('kein Canonical');
  if (info.lang !== 'de') problems.push(`lang="${info.lang}"`);
  if (info.overflow > 1) problems.push(`horizontaler Overflow ${info.overflow}px`);
  if (info.jsonLd === 0) problems.push('keine strukturierten Daten');
  if (consoleErrors.length) problems.push(`Konsole: ${consoleErrors[0].slice(0, 70)}`);
  if (titles.has(info.title)) problems.push(`Titel doppelt zu ${titles.get(info.title)}`);
  if (descriptions.has(info.description)) {
    problems.push(`Beschreibung doppelt zu ${descriptions.get(info.description)}`);
  }
  titles.set(info.title, route);
  descriptions.set(info.description, route);

  if (problems.length) failures++;
  console.log(
    `${problems.length ? 'FEHL' : ' OK '}  ${route.padEnd(18)} ${problems.join('; ') || `h1 „${info.h1}“`}`,
  );
  await ctx.close();
}

console.log('\n--- interne Links ---');
for (const href of [...internalLinks].sort()) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const res = await page.goto(BASE + href, { waitUntil: 'domcontentloaded' }).catch(() => null);
  const status = res?.status() ?? 0;
  if (status !== 200) {
    failures++;
    console.log(`FEHL  ${href} -> ${status}`);
  } else {
    console.log(` OK   ${href}`);
  }
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nAlle Routenprüfungen bestanden.' : `\n${failures} Fehler.`);
process.exit(failures === 0 ? 0 : 1);
