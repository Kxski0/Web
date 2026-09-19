/**
 * Bedienbarkeit, gemessen statt behauptet.
 *
 *  1. Skip-Link: vorhanden, per Tab erreichbar, zeigt auf ein existierendes
 *     Ziel und wird im Fokus sichtbar.
 *  2. Mobilmenü: Fokus wandert hinein, Tab bleibt drinnen (Falle), Escape
 *     schließt, der Fokus kehrt auf den auslösenden Knopf zurück, die Seite
 *     dahinter ist gegen Scrollen gesperrt.
 *  3. Reduzierte Bewegung: der Hero lädt kein Video, der Phasen-Abschnitt
 *     rendert alle Phasen ausgeschrieben.
 *  4. Bilder ohne alt-Attribut.
 *  5. Formularfelder ohne zugängliche Beschriftung.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/a11y-check.mjs
 */
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const browser = await launchBrowser();
let failures = 0;

const report = (name, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? ' OK ' : 'FEHL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

/* --- 1. Skip-Link ---------------------------------------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.keyboard.press('Tab');
  // Der Link fährt über einen Übergang ein; mitten hinein gemessen steht er
  // noch außerhalb des Bildes.
  await page.waitForTimeout(500);

  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el.tagName !== 'A') return null;
    const href = el.getAttribute('href') ?? '';
    const rect = el.getBoundingClientRect();
    return {
      href,
      text: el.textContent.trim(),
      targetExists: !!document.querySelector(href),
      // Sichtbar heißt: im Bild, nicht nur nicht display:none.
      visible: rect.top >= 0 && rect.left >= 0 && rect.height > 0,
    };
  });

  report('Skip-Link ist das erste Tab-Ziel', skip !== null, skip ? `„${skip.text}“` : 'kein Link fokussiert');
  if (skip) {
    report('Skip-Link-Ziel existiert', skip.targetExists, skip.href);
    report('Skip-Link wird im Fokus sichtbar', skip.visible);
  }
  await ctx.close();
}

/* --- 2. Mobilmenü ---------------------------------------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const trigger = page.locator('button[aria-controls="mobile-menu"]');
  await trigger.click();
  await page.waitForTimeout(400);

  const opened = await page.evaluate(() => {
    const menu = document.getElementById('mobile-menu');
    return {
      open: menu?.getAttribute('data-open') === 'true',
      focusInside: menu?.contains(document.activeElement) ?? false,
      scrollLocked: getComputedStyle(document.body).overflow === 'hidden',
      expanded: document.querySelector('button[aria-controls="mobile-menu"]')?.getAttribute('aria-expanded'),
    };
  });
  report('Menü öffnet', opened.open);
  report('Fokus springt ins Menü', opened.focusInside);
  report('Seite dahinter ist scrollgesperrt', opened.scrollLocked);
  report('aria-expanded ist true', opened.expanded === 'true');

  // Fokusfalle: über das letzte Element hinaustabben muss wieder hineinführen.
  const count = await page.evaluate(
    () => document.getElementById('mobile-menu').querySelectorAll('a[href], button:not([disabled])').length,
  );
  for (let i = 0; i < count + 2; i++) await page.keyboard.press('Tab');
  const stillInside = await page.evaluate(
    () => document.getElementById('mobile-menu').contains(document.activeElement),
  );
  report('Fokus bleibt im Menü gefangen', stillInside);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.evaluate(() => ({
    open: document.getElementById('mobile-menu')?.getAttribute('data-open') === 'true',
    focusOnTrigger: document.activeElement?.getAttribute('aria-controls') === 'mobile-menu',
    scrollFree: getComputedStyle(document.body).overflow !== 'hidden',
  }));
  report('Escape schließt das Menü', !closed.open);
  report('Fokus kehrt auf den Menüknopf zurück', closed.focusOnTrigger);
  report('Scrollsperre wird aufgehoben', closed.scrollFree);
  await ctx.close();
}

/* --- 3. Reduzierte Bewegung ------------------------------------------------ */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const videoRequests = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'media' || r.url().endsWith('.mp4')) videoRequests.push(r.url());
  });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  const state = await page.evaluate(() => ({
    videoEls: document.querySelectorAll('video').length,
    // Ausgeschriebene Fassung: alle sechs Phasen stehen gleichzeitig da.
    phaseHeadings: document.querySelectorAll('#phasen h3').length,
  }));
  report('Kein Video-Element bei reduzierter Bewegung', state.videoEls === 0, `${state.videoEls} gefunden`);
  report('Video wird gar nicht erst angefordert', videoRequests.length === 0, videoRequests.join(', '));
  report('Phasen stehen ausgeschrieben', state.phaseHeadings === 6, `${state.phaseHeadings} Überschriften`);
  await ctx.close();
}

/* --- 4./5. Bilder und Formularfelder --------------------------------------- */
for (const route of ['/', '/sortiment/', '/kontakt/']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const issues = await page.evaluate(() => {
    const noAlt = [...document.querySelectorAll('img')]
      .filter((img) => img.getAttribute('alt') === null)
      .map((img) => img.getAttribute('src')?.slice(0, 50));

    const unlabelled = [...document.querySelectorAll('input, textarea, select')]
      .filter((el) => {
        if (el.type === 'hidden') return false;
        if (el.closest('[aria-hidden="true"]')) return false;
        if (el.getAttribute('aria-label')) return false;
        if (el.id && document.querySelector(`label[for="${el.id}"]`)) return false;
        if (el.closest('label')) return false;
        return true;
      })
      .map((el) => `${el.tagName.toLowerCase()}[name=${el.name}]`);

    return { noAlt, unlabelled };
  });

  report(`Bilder mit alt — ${route}`, issues.noAlt.length === 0, issues.noAlt.join(', '));
  report(`Formularfelder beschriftet — ${route}`, issues.unlabelled.length === 0, issues.unlabelled.join(', '));
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nAlle Bedienbarkeitsprüfungen bestanden.' : `\n${failures} Fehler.`);
process.exit(failures === 0 ? 0 : 1);
