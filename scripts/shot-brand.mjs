import { chromium } from 'playwright';
const OUT = process.env.SHOT_DIR;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const vp of [{ name: 'desktop-1440', width: 1440, height: 900 }, { name: 'mobile-390', width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3100/kontakt/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/brand-footer-${vp.name}.png` });

  // Header over the off-white solutions section: the real lockup should show.
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.querySelector('#loesungen');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 500);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/brand-header-light-${vp.name}.png`, clip: { x: 0, y: 0, width: vp.width, height: 260 } });
  await ctx.close();
}
await browser.close();
console.log('brand shots done');
