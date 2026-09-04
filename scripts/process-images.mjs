/**
 * Converts the delivered source photography into the web assets the site consumes.
 *
 * Sources are mapped to slots by VISUAL CONTENT, not by filename (Master Concept §24).
 * Each source was inspected individually before the mapping below was written.
 *
 * Output: one high-quality WebP per slot. next/image derives the responsive
 * AVIF/WebP variants at request time (see next.config.ts).
 */
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = process.argv[2];
const OUT_DIR = path.join(process.cwd(), 'public', 'images');

/** sourceFile -> slot name. Derived from inspecting every delivered image. */
const MAP = {
  '12e907a0': 'hero-energy-system',       // Haus am Abend, PV-Dach, linker Bildrand bewusst dunkel
  '159e0509': 'roof-architecture',        // Dachaufsicht, PV-Feld, Siedlung
  'ea659e5c': 'pv-installation-rooftop',  // Monteur setzt Modul auf Ziegeldach
  'c540788b': 'solar-detail-module',      // Modulkante im Gegenlicht auf Ziegeln
  'e7bb3645': 'solar-material-detail',    // Makro Modulklemme auf Schiene
  '0d471c08': 'technician-detail',        // Handschuhe an MC4-Steckern
  '29e9bf4b': 'technician-inverter',      // Techniker am Wechselrichter im Technikraum
  '4a41fedb': 'battery-storage-detail',   // Speicherschrank + Wechselrichter, Sichtbeton
  'c58a6459': 'energy-management',        // komplette Technikwand, mehrere Komponenten
  '5e19f4a9': 'heat-pump-installation',   // Techniker an der Wärmepumpen-Außeneinheit
  '7761d8a9': 'heat-pump-architecture',   // Wärmepumpe an Holzfassade (Hochformat)
  '9a667bf9': 'team-documentary',         // zwei Techniker, Tablet, Abstimmung
  '9af1fc85': 'finished-house-evening',   // Haus zur blauen Stunde, beleuchtet
  '1ca0199d': 'project-wide',             // Gesamtansicht Haus mit PV und Wärmepumpe
};

/**
 * The hero needs its own portrait crop for mobile — a downscaled landscape frame
 * loses the building entirely (§42: mobile is not a shrunken desktop).
 * Region chosen so the house sits in the lower two thirds with sky above for the headline.
 */
const HERO_PORTRAIT_CROP = { left: 700, top: 0, width: 768, height: 1024 };

await mkdir(OUT_DIR, { recursive: true });
const files = await readdir(SRC_DIR);
const results = [];

for (const [prefix, slot] of Object.entries(MAP)) {
  const file = files.find((f) => f.startsWith(prefix) && f.endsWith('.png'));
  if (!file) {
    console.error(`MISSING SOURCE for slot "${slot}" (prefix ${prefix})`);
    continue;
  }
  const src = path.join(SRC_DIR, file);
  const out = path.join(OUT_DIR, `${slot}.webp`);
  const info = await sharp(src).webp({ quality: 88, effort: 6 }).toFile(out);
  results.push({ slot, width: info.width, height: info.height, kb: Math.round(info.size / 1024) });

  if (slot === 'hero-energy-system') {
    const portraitOut = path.join(OUT_DIR, `${slot}-portrait.webp`);
    const p = await sharp(src)
      .extract(HERO_PORTRAIT_CROP)
      .webp({ quality: 88, effort: 6 })
      .toFile(portraitOut);
    results.push({
      slot: `${slot}-portrait`,
      width: p.width,
      height: p.height,
      kb: Math.round(p.size / 1024),
    });
  }
}

console.table(results);
