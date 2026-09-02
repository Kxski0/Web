/**
 * Checks the behaviours that a screenshot cannot show: reduced motion collapsing
 * the pinned section into readable prose, and the mobile overlay's focus trap.
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3100';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
};

// --- Reduced motion --------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const r = await page.evaluate(() => {
    const section = document.querySelector('#system');
    const sticky = section.querySelector('[class*="sticky"]');
    const transcript = section.querySelector('[class*="transcript"]');
    const layersOn = [...section.querySelectorAll('svg g')].filter(
      (g) => g.getAttribute('data-on') === 'true',
    ).length;
    const layersTotal = section.querySelectorAll('svg g[data-on]').length;
    return {
      reduced: section.getAttribute('data-reduced'),
      stickyPosition: getComputedStyle(sticky).position,
      transcriptHidden: transcript.getAttribute('data-visual-hidden'),
      transcriptVisible: transcript.getBoundingClientRect().height > 100,
      layersOn,
      layersTotal,
      sectionHeight: section.getBoundingClientRect().height,
      viewport: window.innerHeight,
      pulseAnimation: getComputedStyle(section.querySelector('[class*="pulse"]')).animationName,
    };
  });

  check('reduced: section reports reduced mode', r.reduced === 'true');
  check('reduced: no pinning', r.stickyPosition === 'static', `position: ${r.stickyPosition}`);
  check('reduced: not scroll-length inflated', r.sectionHeight < r.viewport * 3);
  check(
    'reduced: full system shown, not one phase',
    r.layersOn === r.layersTotal,
    `${r.layersOn}/${r.layersTotal} layers on`,
  );
  check('reduced: all seven phases readable as prose', r.transcriptVisible);
  check('reduced: energy pulse stops', r.pulseAnimation === 'none', r.pulseAnimation);
  await ctx.close();
}

// --- Motion default: information is not animation-only ---------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const t = document.querySelector('#system [class*="transcript"]');
    return {
      inDom: !!t,
      phaseCount: t ? t.querySelectorAll('li').length : 0,
      ariaHidden: t?.getAttribute('aria-hidden'),
      railItems: document.querySelectorAll('#system ol[aria-label] li').length,
    };
  });
  check('default: transcript stays in the accessibility tree', r.inDom && r.ariaHidden !== 'true');
  check('default: all seven phases present as text', r.phaseCount === 7, `${r.phaseCount} items`);
  check('default: named progress rail present', r.railItems === 7, `${r.railItems} items`);
  await ctx.close();
}

// --- Mobile menu: trap, escape, focus restore ------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });

  const closedInert = await page.evaluate(
    () => document.querySelector('#mobile-menu').hasAttribute('inert'),
  );
  check('menu: inert while closed', closedInert);

  await page.click('button[aria-controls="mobile-menu"]');
  await page.waitForTimeout(400);

  const opened = await page.evaluate(() => ({
    expanded: document.querySelector('button[aria-controls="mobile-menu"]')?.getAttribute('aria-expanded'),
    focusInside: document.querySelector('#mobile-menu').contains(document.activeElement),
    bodyLocked: document.body.style.overflow === 'hidden',
    modal: document.querySelector('#mobile-menu').getAttribute('aria-modal'),
  }));
  check('menu: aria-expanded true', opened.expanded === 'true');
  check('menu: focus moves into the overlay', opened.focusInside);
  check('menu: page behind is scroll-locked', opened.bodyLocked);
  check('menu: announced as a modal dialog', opened.modal === 'true');

  // Tab past the last item and confirm focus wraps rather than escaping.
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  const trapped = await page.evaluate(
    () => document.querySelector('#mobile-menu').contains(document.activeElement),
  );
  check('menu: focus trapped after wrapping', trapped);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.evaluate(() => ({
    expanded: document.querySelector('button[aria-controls="mobile-menu"]')?.getAttribute('aria-expanded'),
    focusOnTrigger: document.activeElement === document.querySelector('button[aria-controls="mobile-menu"]'),
    bodyUnlocked: document.body.style.overflow !== 'hidden',
  }));
  check('menu: Escape closes', closed.expanded === 'false');
  check('menu: focus returns to the trigger', closed.focusOnTrigger);
  check('menu: scroll lock released', closed.bodyUnlocked);
  await ctx.close();
}

// --- Skip link -------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  // The reveal is a 220ms transition; measuring immediately reads the start value.
  await page.waitForTimeout(500);
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    return { text: el?.textContent, y: el?.getBoundingClientRect().top, target: !!document.querySelector('#hauptinhalt') };
  });
  check('skip link is the first tab stop', /Hauptinhalt/.test(skip.text ?? ''));
  check('skip link becomes visible on focus', (skip.y ?? -99) >= 0, `top: ${skip.y}`);
  check('skip link target exists', skip.target);
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
