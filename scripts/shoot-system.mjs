import { chromium } from 'playwright';

const OUT = process.env.SHOT_DIR;
const BASE = 'http://127.0.0.1:3100';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-390', width: 390, height: 844 },
];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: process.env.REDUCED === '1' ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const box = await page.evaluate(() => {
    const el = document.querySelector('#system');
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
  });

  const tag = process.env.REDUCED === '1' ? 'sysreduced' : 'sys';
  const steps = process.env.REDUCED === '1' ? [0, 0.35, 0.7] : [0.02, 0.3, 0.58, 0.86, 0.98];
  for (const [i, p] of steps.entries()) {
    const y = box.top + (box.height - box.vh) * p;
    await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${OUT}/${tag}-${vp.name}-${i}.png` });
  }
  await ctx.close();
}
await browser.close();
console.log('system shots done');
