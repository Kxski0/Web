import { chromium } from 'playwright';
const OUT = process.env.SHOT_DIR;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ROUTES = ['/photovoltaik/', '/stromspeicher/', '/energiemanagement/', '/kontakt/'];
for (const vp of [{ name: 'desktop-1440', width: 1440, height: 900 }, { name: 'mobile-390', width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto('http://127.0.0.1:3100' + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const tag = route.replace(/\//g, '') || 'home';
    await page.screenshot({ path: `${OUT}/route-${vp.name}-${tag}-top.png` });
    // A second frame further down, where the page's own signature block sits.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/route-${vp.name}-${tag}-mid.png` });
  }
  await ctx.close();
}
await browser.close();
console.log('route shots done');
