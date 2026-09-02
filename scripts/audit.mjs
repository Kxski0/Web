/**
 * Measures the two things that are easy to get wrong by eye:
 *
 * 1. Headline contrast against the ACTUAL pixels behind it. The photograph is
 *    hidden-then-sampled per headline line box, and the worst (brightest) pixel
 *    in that box is used — an average would hide a blown highlight under a
 *    single letter.
 * 2. Horizontal overflow: any element reaching past the viewport edge.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

const FG = luminance(0xf1, 0xf0, 0xeb); // --color-offwhite

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // --- overflow -------------------------------------------------------------
  const overflow = await page.evaluate((width) => {
    const bad = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') continue;
      if (r.right > width + 1 || r.left < -1) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 44),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
    return { bad, docOverflow: document.documentElement.scrollWidth - width };
  }, vp.width);

  // Guard: a hero image that failed to load would make every contrast reading
  // a measurement of the flat background instead of the photograph.
  const heroLoaded = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-image]');
    return img ? { complete: img.complete, natural: img.naturalWidth, src: img.currentSrc } : null;
  });
  if (!heroLoaded || heroLoaded.natural === 0) {
    console.error(`FAIL ${vp.name}: hero image not loaded`, heroLoaded);
  }

  // --- headline boxes -------------------------------------------------------
  // A line box spans the whole column, most of which holds no glyphs. Measuring
  // that would report the worst pixel in empty space. Range gives the tight
  // ink extent, so the number describes what is actually behind the letters.
  const boxes = await page.evaluate(() =>
    [...document.querySelectorAll('[data-hero-line] > span')].map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      return { text: el.textContent, x: r.x, y: r.y, w: r.width, h: r.height };
    }),
  );

  // Hide every foreground layer so only the photograph and its scrims remain.
  await page.evaluate(() => {
    document.querySelectorAll('main > section > div:not([aria-hidden])').forEach((el) => {
      el.style.visibility = 'hidden';
    });
    // The header sits outside <main> and would otherwise be sampled as background.
    const header = document.querySelector('header');
    if (header) header.style.visibility = 'hidden';
  });
  const bgShot = await page.screenshot({
    clip: { x: 0, y: 0, width: vp.width, height: vp.height },
  });
  const raw = await sharp(bgShot).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const worst = [];
  for (const box of boxes) {
    let maxLum = 0;
    const x0 = Math.max(0, Math.floor(box.x));
    const x1 = Math.min(vp.width - 1, Math.ceil(box.x + box.w));
    const y0 = Math.max(0, Math.floor(box.y));
    const y1 = Math.min(vp.height - 1, Math.ceil(box.y + box.h));
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const i = (y * raw.info.width + x) * raw.info.channels;
        const l = luminance(raw.data[i], raw.data[i + 1], raw.data[i + 2]);
        if (l > maxLum) maxLum = l;
      }
    }
    worst.push({ line: box.text, worstRatio: +ratio(FG, maxLum).toFixed(2) });
  }

  console.log(`\n### ${vp.name}`);
  console.log('doc horizontal overflow (px):', overflow.docOverflow);
  console.log('hero image:', heroLoaded?.natural, heroLoaded?.src?.split('/').pop());
  if (overflow.bad.length) console.log('elements past viewport:', overflow.bad);
  console.table(worst);

  await context.close();
}

await browser.close();
