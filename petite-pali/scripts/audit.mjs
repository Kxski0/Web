/**
 * Kontrastprüfung gegen die tatsächlich gerenderte Seite.
 *
 * Für jedes Element mit eigenem Text wird die Textfarbe genommen und der
 * Hintergrund durch Hochlaufen der Elternkette bestimmt — halbdurchsichtige
 * Flächen werden dabei übereinandergelegt, statt sie zu ignorieren. Gemessen
 * wird gegen die WCAG-Schwellen: 4,5:1 für Fließtext, 3:1 ab 24px bzw. ab
 * 18,66px fett.
 *
 * Text über Bild oder Video wird NICHT übersprungen und auch nicht geschätzt,
 * sondern gegen die tatsächlich dahinterliegenden Pixel gemessen: das Element
 * wird unsichtbar geschaltet, sein Rechteck fotografiert und die Luminanz der
 * Fläche ausgewertet. Verglichen wird gegen das ungünstigste Perzentil — bei
 * heller Schrift gegen die hellsten Pixel, bei dunkler gegen die dunkelsten.
 * Ein einzelner Ausreißer verfälscht das Ergebnis dadurch nicht, eine zu helle
 * Stelle im Bild fällt aber auf.
 *
 * Aufruf:  BASE=http://localhost:3200 node scripts/audit.mjs
 */
import sharp from 'sharp';
import { launchBrowser } from './browser.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3200';
const ROUTES = [
  '/',
  '/sortiment/',
  '/sortiment/fruehchen/',
  '/sortiment/baby-und-kind/',
  '/sortiment/fuer-mama/',
  '/sortiment/tragehilfen/',
  '/sortiment/kinderwagen/',
  '/sortiment/dies-das/',
  '/shopping-termin/',
  '/gutschein/',
  '/ueber-uns/',
  '/galerie/',
  '/aktuelles/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/',
];

/** Relative Luminanz nach WCAG. */
function relLum(r, g, b) {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

const browser = await launchBrowser();
let failures = 0;
let overMedia = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const result = await page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n));
      return { r, g, b, a };
    };
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });
    const lum = ({ r, g, b }) => {
      const f = (v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
      const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
      return (hi + 0.05) / (lo + 0.05);
    };

    const problems = [];
    const media = [];

    for (const el of document.querySelectorAll('body *')) {
      // Nur Elemente mit eigenem Textinhalt.
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;

      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      // Inhalt in einem inerten Bereich wird nicht dargestellt — die
      // geschlossene Lightbox etwa. Ihn zu messen sagt nichts über das aus,
      // was jemand tatsächlich sieht.
      if (el.closest('[inert]')) continue;

      const fg = parse(cs.color);
      if (!fg) continue;

      /*
       * Hintergrund aus der Elternkette zusammensetzen — aber nur, solange die
       * Elternkette überhaupt etwas aussagt.
       *
       * Sie sagt nichts aus, sobald ein Vorfahre `fixed` oder `sticky` ist:
       * ein solches Element schwebt über fremdem Inhalt, und was darunter
       * liegt, steht in keinem Stylesheet. Die feste Kopfleiste über dem
       * Hero-Video ist genau dieser Fall. Dann wird gemessen statt gerechnet.
       */
      let bg = null;
      let onMedia = false;
      for (let p = el; p; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.backgroundImage && ps.backgroundImage !== 'none') onMedia = true;

        /*
         * Ein Abschnitt mit Bildmaterial ist die Grenze: was er als
         * Hintergrundfarbe trägt, liegt UNTER dem Video und nicht dahinter.
         * Weiter hochzulaufen würde die Seitenfarbe finden und damit das
         * Falsche messen.
         */
        if (p.dataset && p.dataset.surface === 'media') {
          if (!bg || bg.a < 0.999) onMedia = true;
          break;
        }

        const c = parse(ps.backgroundColor);
        if (c && c.a > 0) {
          bg = bg ? over(bg, c) : c;
          if (bg.a >= 0.999) break;
        }

        if (ps.position === 'fixed' || ps.position === 'sticky') {
          if (!bg || bg.a < 0.999) onMedia = true;
          break;
        }
      }

      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;

      if (onMedia && (!bg || bg.a < 0.999)) {
        // Wird unten am Bild gemessen, nicht hier geraten.
        el.setAttribute('data-audit-media', String(media.length));
        media.push({
          tag: el.tagName.toLowerCase(),
          text: el.textContent.trim().slice(0, 32),
          color: [fg.r, fg.g, fg.b],
          size,
          weight,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        });
        continue;
      }
      if (!bg) bg = { r: 255, g: 255, b: 255, a: 1 };
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      const r = ratio(fg, bg);

      if (r < need) {
        problems.push(
          `${el.tagName.toLowerCase()} „${el.textContent.trim().slice(0, 28)}“ ${r.toFixed(2)}:1 < ${need}`,
        );
      }
    }
    return { problems: problems.slice(0, 6), media };
  });

  /*
   * Zweiter Durchgang für Text auf Bildmaterial: Element unsichtbar schalten,
   * sein Rechteck fotografieren, Luminanz auswerten. `visibility: hidden` statt
   * display:none, damit das Layout — und damit das Rechteck — gleich bleibt.
   */
  const mediaFindings = [];
  for (const item of result.media) {
    const { rect } = item;
    if (rect.width < 2 || rect.height < 2) continue;

    await page.evaluate((i) => {
      const el = document.querySelector(`[data-audit-media="${i}"]`);
      if (el) el.style.visibility = 'hidden';
    }, result.media.indexOf(item));

    const restore = () =>
      page.evaluate((i) => {
        const el = document.querySelector(`[data-audit-media="${i}"]`);
        if (el) el.style.visibility = '';
      }, result.media.indexOf(item));

    /*
     * Die Rechtecke sind relativ zum Sichtfenster; ein Ausschnitt, der darüber
     * hinausragt, lässt sich nicht fotografieren. Also auf das Sichtfenster
     * zuschneiden und überspringen, was gar nicht darin liegt — was nicht
     * sichtbar ist, muss auch nicht auf Kontrast geprüft werden.
     */
    const view = page.viewportSize() ?? { width: 1280, height: 900 };
    const x = Math.max(0, Math.floor(rect.x));
    const y = Math.max(0, Math.floor(rect.y));
    const width = Math.floor(Math.min(rect.x + rect.width, view.width) - x);
    const height = Math.floor(Math.min(rect.y + rect.height, view.height) - y);
    if (width < 2 || height < 2) {
      await restore();
      continue;
    }

    const shot = await page.screenshot({ clip: { x, y, width, height } });

    await restore();

    const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const lums = [];
    for (let i = 0; i < data.length; i += info.channels) {
      lums.push(relLum(data[i], data[i + 1], data[i + 2]));
    }
    lums.sort((a, b) => a - b);

    const textLum = relLum(item.color[0], item.color[1], item.color[2]);
    // Ungünstigster Fall: die Pixel, die der Textfarbe am nächsten kommen.
    const pick = textLum > 0.5 ? lums[Math.floor(lums.length * 0.95)] : lums[Math.floor(lums.length * 0.05)];
    const [hi, lo] = textLum > pick ? [textLum, pick] : [pick, textLum];
    const contrast = (hi + 0.05) / (lo + 0.05);

    const large = item.size >= 24 || (item.size >= 18.66 && item.weight >= 700);
    const need = large ? 3 : 4.5;
    mediaFindings.push({ ...item, contrast, need, ok: contrast >= need });
  }

  const mediaFails = mediaFindings.filter((m) => !m.ok);
  if (result.problems.length || mediaFails.length) failures++;
  overMedia += mediaFindings.length;

  console.log(
    `${result.problems.length || mediaFails.length ? 'FEHL' : ' OK '}  ${route.padEnd(26)} ${result.problems.join(' | ')}`,
  );
  for (const m of mediaFindings) {
    console.log(
      `      ${m.ok ? 'auf Bild OK ' : 'auf Bild ZU WENIG'}  ${m.tag} „${m.text}" ${m.contrast.toFixed(2)}:1 (nötig ${m.need})`,
    );
  }
  await ctx.close();
}

await browser.close();
if (overMedia) console.log(`\n${overMedia} Textstelle(n) über Bildmaterial, an den echten Pixeln gemessen.`);
console.log(failures === 0 ? '\nAlle Kontrastprüfungen bestanden.' : `\n${failures} Seite(n) mit zu geringem Kontrast.`);
process.exit(failures === 0 ? 0 : 1);
