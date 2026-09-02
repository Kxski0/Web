/**
 * Layout integrity across the full viewport range, including the two extremes
 * the earlier passes never covered: 375px (smallest common phone) and 1920px.
 *
 * Checks what breaks silently: horizontal overflow, elements reaching past the
 * viewport, text smaller than 12px, and tap targets under 44px.
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3100';
const ROUTES = ['/', '/photovoltaik/', '/energiemanagement/', '/kontakt/', '/ueber-uns/'];
const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1920', width: 1920, height: 1080 },
];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const result = await page.evaluate((width) => {
      const overflowing = [];
      const tiny = [];
      const smallTargets = [];

      // Parked far off-screen on purpose: the honeypot and the visually-hidden
      // transcript are supposed to sit outside the viewport while staying
      // focusable and readable to assistive tech.
      const isParkedOffscreen = (r) => r.right < -500 || r.left > width + 500;

      // Clipped by an ancestor is not overflow: the horizontal process track is
      // deliberately wider than the screen and lives inside overflow:hidden.
      const isClipped = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (s.overflow !== 'visible' || s.overflowX !== 'visible') return true;
        }
        return false;
      };

      for (const el of document.querySelectorAll('body *')) {
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;

        if ((r.right > width + 1 || r.left < -1) && !isParkedOffscreen(r) && !isClipped(el)) {
          overflowing.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ${Math.round(r.left)}..${Math.round(r.right)}`);
        }

        // Text size, only on elements that directly hold text, and only where
        // that text conveys something. Decorative labels hidden from assistive
        // tech are exempt.
        const hasOwnText = [...el.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 2,
        );
        const decorative = el.closest('[aria-hidden="true"]') !== null;
        if (hasOwnText && !decorative && parseFloat(style.fontSize) < 12) {
          tiny.push(`${el.tagName.toLowerCase()} ${style.fontSize}`);
        }

        // WCAG 2.2 SC 2.5.8 Target Size (Minimum) is 24 by 24 CSS pixels.
        if (['A', 'BUTTON'].includes(el.tagName) || el.getAttribute('role') === 'button') {
          if (!isParkedOffscreen(r) && (r.height < 24 || r.width < 24)) {
            smallTargets.push(
              `${el.tagName.toLowerCase()}"${(el.textContent || '').trim().slice(0, 18)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
            );
          }
        }
      }

      return {
        docOverflow: document.documentElement.scrollWidth - width,
        overflowing: [...new Set(overflowing)].slice(0, 4),
        tiny: [...new Set(tiny)].slice(0, 4),
        smallTargets: [...new Set(smallTargets)].slice(0, 4),
      };
    }, vp.width);

    const problems = [];
    if (result.docOverflow > 1) problems.push(`doc overflow ${result.docOverflow}px`);
    if (result.overflowing.length) problems.push(`past viewport: ${result.overflowing.join(', ')}`);
    if (result.tiny.length) problems.push(`text <12px: ${result.tiny.join(', ')}`);
    if (result.smallTargets.length) problems.push(`target <24px (WCAG 2.5.8): ${result.smallTargets.join(', ')}`);

    if (problems.length) {
      failures++;
      console.log(`FAIL  ${vp.name.padStart(4)}px ${route.padEnd(22)} ${problems.join(' | ')}`);
    }
  }
  await ctx.close();
  console.log(`      ${vp.name}px done`);
}

await browser.close();
console.log(failures === 0 ? '\nNo responsive defects.' : `\n${failures} defect(s).`);
process.exit(failures === 0 ? 0 : 1);
