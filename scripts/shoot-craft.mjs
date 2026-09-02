import { chromium } from 'playwright';
const OUT = process.env.SHOT_DIR;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

for (const vp of [{ name: 'desktop-1440', width: 1440, height: 900 }, { name: 'mobile-390', width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Walk down through the craft sequence so every reveal gets its turn.
  const figures = await page.evaluate(() => document.querySelectorAll('#handwerk figure').length);
  for (let i = 0; i < figures; i++) {
    await page.evaluate((idx) => {
      const f = document.querySelectorAll('#handwerk figure')[idx];
      const r = f.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY - window.innerHeight * 0.18);
    }, i);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/craft-${vp.name}-${i}.png` });
  }

  // The header while it sits over the off-white solutions section.
  await page.evaluate(() => {
    const el = document.querySelector('#loesungen');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 400);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/header-light-${vp.name}.png` });
  await ctx.close();
}
await browser.close();
console.log('craft shots done');
