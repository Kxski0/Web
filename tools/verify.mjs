/**
 * Browserpruefung ueber alle Seiten und vier Breiten.
 *
 *   python3 tools/serve.py 8081     (in einer Sitzung)
 *   node tools/verify.mjs           (in einer zweiten)
 *
 * Nutzt das vorinstallierte Chromium, kein `playwright install` noetig.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:8081';
const SHOTS = process.env.SHOT_DIR ?? '/tmp/netzexpert-shots';
const BINARY = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const ROUTES = ['/', '/webdesign/', '/seo/', '/prozess/', '/ueber-uns/',
                '/kontakt/', '/impressum/', '/datenschutz/'];
const VIEWPORTS = [
  { name: '375',  width: 375,  height: 812 },
  { name: '768',  width: 768,  height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1920', width: 1920, height: 1080 },
];

const problems = [];
const notes = [];
const flag = (scope, m) => problems.push(`[${scope}] ${m}`);

function luminance([r, g, b]) {
  const ch = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}
function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/** In der Seite ausgefuehrt: loest jede CSS-Farbe ueber Canvas nach sRGB auf. */
const RESOLVE = (values) => {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const out = {};
  for (const [k, v] of Object.entries(values)) {
    if (!v) continue;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    out[k] = [d[0], d[1], d[2]];
  }
  return out;
};

async function auditPage(page, route, viewport) {
  const scope = `${viewport.name}${route}`;
  const consoleErrors = [];
  const failed = [];

  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const transferred = await page.evaluate(() =>
    performance.getEntriesByType('resource')
      .reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0));

  // Ganze Seite in Schritten durchscrollen, damit alle Reveals ausloesen
  // und die Choreografie ihre volle Strecke laeuft.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += Math.round(viewport.height * 0.5)) {
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(500);

  const audit = await page.evaluate((src) => {
    const resolve = new Function('return ' + src)();
    const r = { imgs: [], unrevealed: [], overflow: null, colors: {}, flyer: null };

    for (const img of document.querySelectorAll('img')) {
      const issues = [];
      const alt = img.getAttribute('alt');
      if (alt === null) issues.push('alt fehlt');
      else if (alt.trim().length < 8) issues.push('alt zu kurz');
      if (!img.getAttribute('width') || !img.getAttribute('height')) issues.push('width/height fehlt');
      if (img.naturalWidth === 0) issues.push('nicht geladen');
      if (issues.length) r.imgs.push({ src: (img.currentSrc || img.src).split('/').pop(), issues });
    }

    for (const el of document.querySelectorAll('[data-reveal], [data-rise]')) {
      if (!el.classList.contains('is-in')) r.unrevealed.push(el.className.slice(0, 40));
    }

    r.overflow = {
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    };

    const cs = getComputedStyle(document.body);
    const raw = { bg: cs.backgroundColor, text: cs.color };
    const q = (sel, key) => { const e = document.querySelector(sel); if (e) raw[key] = getComputedStyle(e).color; };
    q('.muted', 'muted');
    q('.eyebrow', 'eyebrow');
    q('.step p', 'stepP');
    q('.colophon a', 'footerLink');
    q('.nav-links a', 'navLink');
    q('.step-num', 'stepNum');
    r.colors = resolve(raw);

    const f = document.querySelector('.flyer');
    if (f) {
      const b = f.getBoundingClientRect();
      r.flyer = { w: Math.round(b.width), h: Math.round(b.height), op: getComputedStyle(f).opacity };
    }
    return r;
  }, RESOLVE.toString());

  for (const e of consoleErrors) flag(scope, 'Konsole: ' + e);
  for (const f of [...new Set(failed)]) flag(scope, 'Anfrage: ' + f);
  for (const i of audit.imgs) flag(scope, `Bild ${i.src}: ${i.issues.join(', ')}`);
  for (const u of audit.unrevealed) flag(scope, 'Reveal nicht ausgelöst: ' + u);
  if (audit.overflow.scroll > audit.overflow.client + 1) {
    flag(scope, `Waagerechter Überlauf: ${audit.overflow.scroll} > ${audit.overflow.client}`);
  }

  const bg = audit.colors.bg;
  for (const [label, val] of Object.entries(audit.colors)) {
    if (label === 'bg' || !val) continue;
    const ratio = contrast(val, bg);
    if (ratio < 4.5) flag(scope, `Kontrast ${label} ${ratio.toFixed(2)}:1 (mind. 4.5:1)`);
  }

  const kb = Math.round(transferred / 1024);
  if (kb > 1200) flag(scope, `${kb} kB übertragen (Ziel unter 1200 kB)`);
  if (route === '/') notes.push(`[${viewport.name}] Startseite ${kb} kB, Flyer ${JSON.stringify(audit.flyer)}`);

  page.removeAllListeners();
  return kb;
}

async function main() {
  if (!existsSync(BINARY)) { console.error('Chromium fehlt: ' + BINARY); process.exit(1); }
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch({ executablePath: BINARY });

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1, locale: 'de-DE',
    });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      await auditPage(page, route, vp);
      const name = route === '/' ? 'start' : route.replace(/\//g, '');
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${SHOTS}/${vp.name}--${name}.png`, fullPage: route !== '/' });
    }
    await ctx.close();
  }

  /* ── Choreografie des Zeichens ──────────────────────────────────────── */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const stages = [];
  const track = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const frac of [0, 0.06, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(track * frac * 0.55));
    await page.waitForTimeout(160);
    stages.push(await page.evaluate(() => {
      const f = document.querySelector('.flyer');
      const rev = document.querySelector('.composition-reveal');
      const b = f ? f.getBoundingClientRect() : null;
      return {
        y: Math.round(window.scrollY),
        size: b ? Math.round(b.width) : null,
        x: b ? Math.round(b.left) : null,
        vis: f ? getComputedStyle(f).visibility : null,
        clip: rev ? rev.style.clipPath || 'keiner' : null,
      };
    }));
    await page.screenshot({ path: `${SHOTS}/flug-${Math.round(frac * 100)}.png` });
  }

  const sizes = stages.map((s) => s.size).filter((v) => v !== null);
  if (!sizes.length) flag('choreografie', 'Kein fliegendes Zeichen gefunden');
  else if (Math.max(...sizes) <= Math.min(...sizes) + 20) {
    flag('choreografie', `Zeichen wächst nicht: Größen ${sizes.join(', ')}`);
  }
  const clips = stages.map((s) => s.clip);
  if (!clips.some((c) => c && c !== 'keiner' && !c.includes('0%'))) {
    notes.push('[choreografie] Blende erreichte keinen Zwischenwert, bitte Bilder prüfen');
  }
  notes.push('[choreografie] ' + JSON.stringify(stages));
  await ctx.close();

  /* ── Menü auf kleinen Geräten ───────────────────────────────────────── */
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto(BASE + '/', { waitUntil: 'load' });
  await mp.locator('#nav-toggle').click();
  await mp.waitForTimeout(400);
  const menuOpen = await mp.evaluate(() => ({
    open: document.getElementById('nav-menu').dataset.open,
    expanded: document.getElementById('nav-toggle').getAttribute('aria-expanded'),
    visible: getComputedStyle(document.getElementById('nav-menu')).visibility,
  }));
  if (menuOpen.open !== 'true' || menuOpen.visible !== 'visible') {
    flag('menü', 'Menü öffnet nicht: ' + JSON.stringify(menuOpen));
  }
  if (menuOpen.expanded !== 'true') flag('menü', 'aria-expanded nicht gesetzt');
  await mp.screenshot({ path: `${SHOTS}/menue-offen.png` });
  await mp.keyboard.press('Escape');
  await mp.waitForTimeout(350);
  const closed = await mp.evaluate(() => document.getElementById('nav-menu').dataset.open);
  if (closed !== 'false') flag('menü', 'Escape schließt das Menü nicht');
  notes.push('[menü] öffnet und schließt, aria-expanded gesetzt');
  await mctx.close();

  /* ── Bewegungsreduktion ─────────────────────────────────────────────── */
  const rctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const rp = await rctx.newPage();
  await rp.goto(BASE + '/', { waitUntil: 'load' });
  await rp.evaluate(() => document.fonts.ready);
  await rp.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
  await rp.waitForTimeout(500);
  const rm = await rp.evaluate(() => ({
    flyer: !!document.querySelector('.flyer'),
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    word: (() => { const w = document.querySelector('.word-mask > span');
                   return w ? getComputedStyle(w).translate : null; })(),
    clip: (() => { const p = document.querySelector('[data-reveal] > picture');
                   return p ? getComputedStyle(p).clipPath : null; })(),
  }));
  if (rm.flyer) flag('reduced-motion', 'Fliegendes Zeichen läuft trotzdem');
  if (rm.scroll !== 'auto') flag('reduced-motion', 'scroll-behavior ' + rm.scroll);
  if (rm.clip && rm.clip !== 'none') flag('reduced-motion', 'Clip-Path aktiv: ' + rm.clip);
  notes.push('[reduced-motion] ' + JSON.stringify(rm));
  await rp.screenshot({ path: `${SHOTS}/reduced-motion.png` });
  await rctx.close();

  /* ── Ohne JavaScript ────────────────────────────────────────────────── */
  const nctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
  const np = await nctx.newPage();
  await np.goto(BASE + '/', { waitUntil: 'load' });
  await np.waitForTimeout(400);
  const nojs = await np.evaluate(() => 0).catch(() => null);
  const visible = await np.locator('.composition-grid figure').first().isVisible();
  const heroVisible = await np.locator('h1').first().isVisible();
  if (!visible) flag('ohne-js', 'Komposition unsichtbar ohne JavaScript');
  if (!heroVisible) flag('ohne-js', 'Überschrift unsichtbar ohne JavaScript');
  notes.push(`[ohne-js] Hero sichtbar ${heroVisible}, Komposition sichtbar ${visible}`);
  await np.screenshot({ path: `${SHOTS}/ohne-js.png`, fullPage: false });
  await nctx.close();

  await browser.close();

  console.log('──── Hinweise ────');
  for (const n of notes) console.log('  ' + n);
  console.log(`\n──── Befunde: ${problems.length} ────`);
  for (const p of problems) console.log('  ✗ ' + p);
  if (!problems.length) console.log('  Keine.');
  console.log(`\nScreenshots: ${SHOTS}`);
  process.exit(problems.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
