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

// Every section that actually renders, by its anchor or component landmark.
const TARGETS = ['#loesungen', '#handwerk', '#ablauf', '#kontakt', 'footer'];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Section 02 sits between the hero and the energy system.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.15));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/page-${vp.name}-02-invisible.png` });

  for (const sel of TARGETS) {
    const found = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return false;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
      return true;
    }, sel);
    if (!found) {
      console.log(`skip ${sel} (not rendered)`);
      continue;
    }
    await page.waitForTimeout(1100);
    const tag = sel.replace(/[#]/g, '');
    await page.screenshot({ path: `${OUT}/page-${vp.name}-${tag}.png` });
  }

  // Mid-scroll through the horizontal process track.
  await page.evaluate(() => {
    const el = document.querySelector('#ablauf');
    const r = el.getBoundingClientRect();
    window.scrollTo(0, r.top + window.scrollY + (r.height - window.innerHeight) * 0.6);
  });
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${OUT}/page-${vp.name}-ablauf-mid.png` });

  await ctx.close();
}
await browser.close();
console.log('page shots done');
