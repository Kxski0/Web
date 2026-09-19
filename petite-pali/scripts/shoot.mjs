/**
 * Screenshots über vier Viewports. Misst nichts, sondern zeigt — die messenden
 * Prüfungen stehen in den *-check-Skripten.
 *
 * Aufruf:  BASE=http://localhost:3200 SHOT_DIR=./shots node scripts/shoot.mjs <pfad...>
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const SHOT_DIR = process.env.SHOT_DIR ?? './shots';
const ROUTES = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ['/'];

const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

await mkdir(SHOT_DIR, { recursive: true });
const browser = await launchBrowser();

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    // Bewegung ausschalten: ein Screenshot mitten in einer Einblendung zeigt
    // einen Zustand, den nie jemand sieht.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // 'load' statt 'networkidle': ein Hero-Video und lazy nachgeladene Bilder
    // sorgen dafür, dass das Netz nie ruhig wird. Stattdessen wird gezielt auf
    // die Schriften gewartet — ohne sie zeigt der Screenshot die Ersatzschrift.
    await page.goto(BASE + route, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const slug = route === '/' ? 'start' : route.replace(/\//g, '-').replace(/^-|-$/g, '');
    await page.screenshot({
      path: path.join(SHOT_DIR, `${slug}-${vp.name}.png`),
      fullPage: process.env.FULL !== '0',
    });
    await page.close();
  }
}

await browser.close();
console.log(`Screenshots in ${SHOT_DIR}`);
