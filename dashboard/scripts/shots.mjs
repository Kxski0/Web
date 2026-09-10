/**
 * Erzeugt Bildschirmfotos der wichtigsten Ansichten in mehreren Größen.
 * Dient der Sichtprüfung – die Dateien landen in dashboard/.shots/ und werden
 * nicht eingecheckt.
 *
 * Aufruf: node dashboard/scripts/shots.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, '.shots');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let filePath = path.join(root, decodeURIComponent(url.pathname));
  if (url.pathname === '/') filePath = path.join(root, 'index.html');
  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
  res.end(await readFile(filePath));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const SIZES = [
  { name: 'ipad-quer', width: 1194, height: 834 },
  { name: 'ipad-hoch', width: 834, height: 1194 },
  { name: 'iphone', width: 390, height: 844 },
];

const VIEWS = [
  { name: 'dashboard', nav: 'Dashboard' },
  { name: 'auftraege', nav: 'Aufträge' },
  { name: 'kunden', nav: 'Kunden' },
  { name: 'rechnungen', nav: 'Rechnungen' },
  { name: 'finanzen', nav: 'Finanzen' },
  { name: 'websites', nav: 'Meine Websites' },
  { name: 'inspiration', nav: 'Inspiration' },
  { name: 'aufgaben', nav: 'Aufgaben' },
  { name: 'einstellungen', nav: 'Einstellungen' },
];

for (const size of SIZES) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 2,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.app');

  // Demodaten laden, damit die Ansichten Inhalt zeigen.
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch { /* privater Modus – dann bleibt es beim Speicher */ }
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.app');

  const openMenuIfNeeded = async (label) => {
    const item = page.locator(`.nav-item:has-text("${label}")`).first();
    await item.waitFor({ state: 'visible' });
    let box = await item.boundingBox();
    if (!box || box.x < 0) {
      // Kurz warten: nach einem Groessenwechsel zieht das Layout nach.
      await page.waitForTimeout(300);
      box = await item.boundingBox();
    }
    if (!box || box.x < 0) {
      const menu = page.locator('.topbar .btn-icon').first();
      if (await menu.isVisible()) {
        await menu.click();
        await page.waitForTimeout(320);
      }
    }
    await item.click();
    await page.waitForTimeout(280);
  };

  await openMenuIfNeeded('Einstellungen');
  const demoBtn = page.locator('.settings-actions .btn:has-text("Demodaten laden")').first();
  await demoBtn.scrollIntoViewIfNeeded();
  await demoBtn.click();
  await page.waitForSelector('.modal');
  await page.locator('.modal-foot .btn:has-text("Demodaten laden")').click();
  await page.waitForSelector('.modal', { state: 'detached' });
  await page.waitForTimeout(500);

  for (const view of VIEWS) {
    await openMenuIfNeeded(view.nav);
    await page.waitForTimeout(220);
    await page.screenshot({ path: path.join(outDir, `${size.name}-${view.name}.png`) });
  }

  // Eine Detailseite und ein Dialog
  await openMenuIfNeeded('Kunden');
  // Schmal ist die Tabelle ausgeblendet und die Kartenliste sichtbar.
  await page.locator('.table tbody tr:visible, .card-row:visible').first().click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outDir, `${size.name}-kundendetail.png`), fullPage: true });

  await openMenuIfNeeded('Aufträge');
  await page.locator('.page-actions .btn:has-text("Auftrag anlegen")').click();
  await page.waitForSelector('.modal');
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, `${size.name}-dialog.png`) });

  await context.close();
  console.log(`${size.name}: ${VIEWS.length + 2} Bilder`);
}

await browser.close();
server.close();
console.log(`\nBilder in ${outDir}`);
