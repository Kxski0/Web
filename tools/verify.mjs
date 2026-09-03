/**
 * Gebuendelte Pruefrunde: vier Breiten, Screenshots und die Kontrollen,
 * die man sonst von Hand vergisst. Ein Durchlauf, ein Bericht.
 *
 *   npm run verify
 *
 * Nutzt das vorinstallierte Chromium. Kein `playwright install` noetig.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:8080/';
const SHOTS = process.env.SHOT_DIR ?? '/tmp/nocturne-shots';
const BINARY = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const VIEWPORTS = [
  { name: '375-mobil',   width: 375,  height: 812 },
  { name: '768-tablet',  width: 768,  height: 1024 },
  { name: '1280-laptop', width: 1280, height: 800 },
  { name: '1920-desktop', width: 1920, height: 1080 },
];

const problems = [];
const notes = [];
const flag = (scope, message) => problems.push(`[${scope}] ${message}`);

/* ── Kontrast nach WCAG 2.1 ─────────────────────────────────────────────── */
function relativeLuminance([r, g, b]) {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
function contrastRatio(fg, bg) {
  const [a, b] = [relativeLuminance(fg), relativeLuminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
/** In der Seite ausgefuehrt: loest jede CSS-Farbe ueber Canvas nach sRGB auf. */
const RESOLVE_COLORS = (values) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const out = {};
  for (const [key, value] of Object.entries(values)) {
    if (!value) continue;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    out[key] = [r, g, b];
  }
  return out;
};

async function main() {
  if (!existsSync(BINARY)) {
    console.error(`Chromium nicht gefunden: ${BINARY}`);
    process.exit(1);
  }
  await mkdir(SHOTS, { recursive: true });

  const browser = await chromium.launch({ executablePath: BINARY });

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      locale: 'de-DE',
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const failedRequests = [];
    let transferred = 0;

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.url()} — ${req.failure()?.errorText ?? 'unbekannt'}`);
    });
    page.on('response', async (res) => {
      const status = res.status();
      if (status >= 400) failedRequests.push(`${status} ${res.url()}`);
    });

    await page.goto(BASE, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);

    // Gewicht der Startansicht, bevor gescrollt wird.
    transferred = await page.evaluate(() =>
      performance.getEntriesByType('resource')
        .reduce((sum, r) => sum + (r.transferSize || r.encodedBodySize || 0), 0));

    // Erst je ein Bild pro Abschnitt, dann in Schritten durch die ganze
    // Seite: nur so werden auch Elemente unterhalb eines Abschnittskopfs
    // erreicht und ihre Reveals ausgeloest.
    for (const id of ['atelier', 'studio', 'prozess', 'kontakt']) {
      await page.evaluate((target) => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, id);
      await page.waitForTimeout(420);
      await page.screenshot({ path: `${SHOTS}/${viewport.name}--${id}.png` });
    }

    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < pageHeight; y += Math.round(viewport.height * 0.6)) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SHOTS}/${viewport.name}--voll.png`, fullPage: true });

    /* ── Kontrollen in der Seite ─────────────────────────────────────── */
    const audit = await page.evaluate((resolveSource) => {
      const resolveColors = new Function('return ' + resolveSource)();
      const result = { images: [], unrevealed: [], overflow: null, colors: {}, headings: [], focusables: 0 };

      for (const img of document.querySelectorAll('img')) {
        const dialog = img.closest('dialog');
        if (dialog && !dialog.open) continue;
        const issues = [];
        if (!img.hasAttribute('alt')) issues.push('alt fehlt');
        else if (img.closest('[aria-hidden="true"]') === null && img.alt.trim() === '') issues.push('alt leer');
        if (!img.getAttribute('width') || !img.getAttribute('height')) issues.push('width/height fehlt');
        if (img.naturalWidth === 0) issues.push('nicht geladen');
        if (issues.length) result.images.push({ src: img.currentSrc || img.src, issues });
      }

      for (const el of document.querySelectorAll('[data-reveal], [data-rise]')) {
        if (!el.classList.contains('is-revealed')) {
          result.unrevealed.push(el.className || el.tagName);
        }
      }

      result.overflow = {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };

      const styles = getComputedStyle(document.body);
      const raw = { bodyBg: styles.backgroundColor, bodyFg: styles.color };
      const muted = document.querySelector('.step p');
      if (muted) raw.mutedFg = getComputedStyle(muted).color;
      const eyebrow = document.querySelector('.eyebrow');
      if (eyebrow) raw.eyebrowFg = getComputedStyle(eyebrow).color;
      const caption = document.querySelector('.caption');
      if (caption) raw.captionFg = getComputedStyle(caption).color;
      const railCurrent = document.querySelector('.rail-mobile a[aria-current="true"], .rail a[aria-current="true"]');
      if (railCurrent) raw.railCurrent = getComputedStyle(railCurrent).color;
      const colophon = document.querySelector('.colophon');
      if (colophon) raw.colophonFg = getComputedStyle(colophon).color;
      result.colors = resolveColors(raw);

      result.headings = [...document.querySelectorAll('h1,h2,h3,h4')]
        .map((h) => Number(h.tagName[1]));

      result.focusables = document.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ).length;

      return result;
    }, RESOLVE_COLORS.toString());

    const scope = viewport.name;

    for (const err of consoleErrors) flag(scope, `Konsole: ${err}`);
    for (const req of [...new Set(failedRequests)]) flag(scope, `Anfrage: ${req}`);
    for (const img of audit.images) flag(scope, `Bild ${img.src.split('/').pop()}: ${img.issues.join(', ')}`);
    for (const el of audit.unrevealed) flag(scope, `Reveal nicht ausgeloest: ${el}`);

    if (audit.overflow.scrollWidth > audit.overflow.clientWidth + 1) {
      flag(scope, `Waagerechter Ueberlauf: ${audit.overflow.scrollWidth} > ${audit.overflow.clientWidth}`);
    }

    // Ueberschriftenordnung darf keine Stufe ueberspringen.
    let previous = 0;
    for (const level of audit.headings) {
      if (previous && level > previous + 1) {
        flag(scope, `Ueberschrift springt von h${previous} auf h${level}`);
      }
      previous = level;
    }

    const bg = audit.colors.bodyBg;
    for (const [label, value] of Object.entries(audit.colors)) {
      if (label === 'bodyBg' || !value) continue;
      const ratio = contrastRatio(value, bg);
      const line = `${label} ${ratio.toFixed(2)}:1`;
      if (ratio < 4.5) flag(scope, `Kontrast zu gering — ${line} (mind. 4.5:1)`);
      else notes.push(`[${scope}] Kontrast ${line}`);
    }

    const kb = Math.round(transferred / 1024);
    if (kb > 1024) flag(scope, `Startansicht ${kb} kB (Ziel unter 1024 kB)`);
    else notes.push(`[${scope}] Startansicht ${kb} kB, ${audit.focusables} fokussierbare Elemente`);

    /* ── Fokus: echter Tab-Durchlauf ──────────────────────────────────
       Programmatisches focus() loest :focus-visible in Chromium nicht
       verlaesslich aus. Nur die Tastatur zeigt den tatsaechlichen Zustand. */
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.keyboard.press('Tab');
    const seen = new Set();
    const missingFocus = [];
    const expected = await page.evaluate(() =>
      document.querySelectorAll('a[href], button:not([disabled])').length);

    for (let i = 0; i < expected + 4; i += 1) {
      const state = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
        const shadow = style.boxShadow !== 'none';
        const underline = style.backgroundSize.includes('100%');
        const all = [...document.querySelectorAll('a[href], button:not([disabled])')];
        return {
          id: `${all.indexOf(el)}:${el.className || el.textContent.trim().slice(0, 24) || el.tagName}`,
          visible: outline || shadow || underline,
        };
      });
      if (state) {
        if (seen.has(state.id) && i > expected - 1) break;
        seen.add(state.id);
        if (!state.visible) missingFocus.push(state.id);
      }
      await page.keyboard.press('Tab');
    }
    for (const el of [...new Set(missingFocus)]) flag(scope, `Kein sichtbarer Fokus: ${el}`);
    notes.push(`[${scope}] Tab erreichte ${seen.size} von ${expected} Elementen`);

    await context.close();
  }

  /* ── Bewegungsreduktion ───────────────────────────────────────────────── */
  const reducedContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(BASE, { waitUntil: 'load' });
  await reducedPage.evaluate(() => document.fonts.ready);
  await reducedPage.waitForTimeout(600);

  const motion = await reducedPage.evaluate(() => {
    const plate = document.querySelector('.plate[data-reveal]');
    const word = document.querySelector('.word-mask > span');
    const scroll = getComputedStyle(document.documentElement).scrollBehavior;
    return {
      plateClip: plate ? getComputedStyle(plate).clipPath : null,
      plateOpacity: plate ? getComputedStyle(plate).opacity : null,
      wordTranslate: word ? getComputedStyle(word).translate : null,
      scrollBehavior: scroll,
    };
  });

  const still = (v) => !v || v === 'none' || /^0(px)?( 0(px)?)*$/.test(v.trim());
  if (!still(motion.wordTranslate)) {
    flag('reduced-motion', `Wortlauf bewegt sich weiterhin: translate ${motion.wordTranslate}`);
  }
  if (motion.plateClip && motion.plateClip !== 'none') {
    flag('reduced-motion', `Clip-Path aktiv: ${motion.plateClip}`);
  }
  if (motion.scrollBehavior !== 'auto') {
    flag('reduced-motion', `scroll-behavior ist ${motion.scrollBehavior}, erwartet auto`);
  }
  notes.push(`[reduced-motion] clip-path ${motion.plateClip}, translate ${motion.wordTranslate}, scroll ${motion.scrollBehavior}`);

  await reducedPage.screenshot({ path: `${SHOTS}/reduced-motion.png` });
  await reducedContext.close();

  /* ── Bildansicht oeffnen und schliessen ───────────────────────────────── */
  const dialogContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dialogPage = await dialogContext.newPage();
  const dialogErrors = [];
  dialogPage.on('pageerror', (err) => dialogErrors.push(err.message));
  await dialogPage.goto(BASE, { waitUntil: 'load' });
  await dialogPage.locator('[data-plate="kontaktbogen"]').click();
  await dialogPage.waitForTimeout(600);

  const openState = await dialogPage.evaluate(() => {
    const d = document.getElementById('lightbox');
    return { open: d.open, src: document.getElementById('lightbox-img').getAttribute('src'), active: document.activeElement?.tagName };
  });
  if (!openState.open) flag('lightbox', 'Dialog oeffnet nicht');
  if (!openState.src) flag('lightbox', 'Kein Bild im Dialog gesetzt');
  await dialogPage.screenshot({ path: `${SHOTS}/lightbox.png` });

  await dialogPage.keyboard.press('Escape');
  await dialogPage.waitForTimeout(400);
  const closedState = await dialogPage.evaluate(() => {
    const d = document.getElementById('lightbox');
    return { open: d.open, focus: document.activeElement?.dataset?.plate ?? null };
  });
  if (closedState.open) flag('lightbox', 'Escape schliesst nicht');
  if (closedState.focus !== 'kontaktbogen') flag('lightbox', `Fokus kehrt nicht zurueck (aktiv: ${closedState.focus})`);
  for (const err of dialogErrors) flag('lightbox', `Fehler: ${err}`);
  notes.push(`[lightbox] geoeffnet ${openState.open}, Quelle ${openState.src?.split('/').pop()}, Fokus zurueck auf ${closedState.focus}`);

  await dialogContext.close();
  await browser.close();

  /* ── Bericht ──────────────────────────────────────────────────────────── */
  console.log('\n──── Hinweise ────');
  for (const note of notes) console.log('  ' + note);

  console.log(`\n──── Befunde: ${problems.length} ────`);
  for (const problem of problems) console.log('  ✗ ' + problem);
  if (!problems.length) console.log('  Keine.');
  console.log(`\nScreenshots: ${SHOTS}`);

  process.exit(problems.length ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(2); });
