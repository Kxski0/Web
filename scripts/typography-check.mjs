/**
 * Headline orphan check.
 *
 * Multi-line display headlines are intentional — the stacked look is the
 * composition. What is never intentional is a final line holding one short word
 * while the lines above run full width. This measures the rendered line boxes
 * and flags a last line narrower than a third of the widest one.
 */
import { chromium } from 'playwright';

const ORPHAN_RATIO = 0.34;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0;

for (const vp of [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const rows = await page.evaluate((ratio) => {
    const out = [];
    for (const h of document.querySelectorAll('h1, h2, h3')) {
      const range = document.createRange();
      range.selectNodeContents(h);

      // Group client rects into lines by their top edge.
      const byTop = new Map();
      for (const r of range.getClientRects()) {
        if (r.width === 0) continue;
        const key = Math.round(r.top);
        byTop.set(key, Math.max(byTop.get(key) ?? 0, r.right) - Math.min(r.left, byTop.has(key) ? r.left : r.left));
      }
      const widths = [...byTop.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([, w]) => Math.round(w));
      if (widths.length < 2) continue;

      const max = Math.max(...widths);
      const last = widths[widths.length - 1];
      out.push({
        text: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 44),
        lines: widths.length,
        lastRatio: +(last / max).toFixed(2),
        orphan: last / max < ratio,
      });
    }
    return out;
  }, ORPHAN_RATIO);

  console.log(`\n### ${vp.name}`);
  for (const row of rows) {
    if (row.orphan) failures++;
    console.log(
      `${row.orphan ? 'FAIL' : 'PASS'}  ${row.lines} lines, last=${row.lastRatio} of widest  "${row.text}"`,
    );
  }
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nNo orphaned headline lines.' : `\n${failures} orphan(s).`);
process.exit(failures === 0 ? 0 : 1);
