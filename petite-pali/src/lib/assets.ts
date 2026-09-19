/**
 * Bildvertrag.
 *
 * Komponenten beziehen sich auf einen SLOT, nie auf einen Dateipfad. Jeder Slot
 * hält seine Eigengröße und seinen Bildschwerpunkt fest, damit Ausschnitte
 * gestaltet sind und nicht zufällig entstehen.
 *
 * Die Zuordnung Quelle → Slot stammt aus dem Bildinhalt, nicht aus Dateinamen;
 * sie steht in scripts/process-images.mjs. Werden später Originalfotos
 * geliefert, ersetzen sie dieselben Dateien, ohne dass hier etwas geändert
 * werden muss.
 *
 * Alle Ladenfotos stammen aus dem Instagram-Auftritt des Geschäfts und liegen
 * im Hochformat 3:4 vor — das ist das Format der Quelle, nicht eine Wahl.
 */

export type ImageSlot = {
  src: string;
  width: number;
  height: number;
  /** Deutsch, beschreibend, ohne Bild brauchbar. Nie „Bild“ und keine Stichwortliste. */
  alt: string;
  /** object-position für Ausschnitte, die enger sind als das Eigenformat. */
  focus: string;
};

const HOCHFORMAT = { width: 828, height: 1104 };

export const IMAGES = {
  ladenTisch: {
    src: '/images/laden-tisch.webp',
    ...HOCHFORMAT,
    alt: 'Langer Tisch in der Boutique, dicht belegt mit gefalteter Kinderkleidung; dahinter eine Regalwand voller Pullover, davor eine Reihe Kinderroller.',
    focus: '50% 45%',
  },
  ladenRegal: {
    src: '/images/laden-regal.webp',
    ...HOCHFORMAT,
    alt: 'Weißes Regal mit Kuscheltieren und Kinderrucksäcken, daneben eine Kleiderstange mit rosafarbenen Kleidern.',
    focus: '45% 45%',
  },
  spieluhren: {
    src: '/images/spieluhren.webp',
    ...HOCHFORMAT,
    alt: 'Drei Spieluhren als Stern, Fuchs und Wolke hängen vor einer Reihe gestrickter Babyjacken.',
    focus: '50% 50%',
  },
  eingang: {
    src: '/images/eingang.webp',
    ...HOCHFORMAT,
    alt: 'Ladeneingang mit Fußmatte „Petite Pali — Baby & Kinder Boutique“, davor ein Herbstoutfit auf einem Kinderstuhl und ein Puppenwagen.',
    focus: '50% 55%',
  },
  outfitHerbst: {
    src: '/images/outfit-herbst.webp',
    width: 828,
    height: 1103,
    alt: 'Herbstoutfit aus Filzweste, kariertem Hemd und Cordhose vor dem Laden, daneben ein Wollplüschanzug und ein Puppenwagen.',
    focus: '50% 50%',
  },
  schaufenster: {
    src: '/images/schaufenster.webp',
    ...HOCHFORMAT,
    alt: 'Schaufenster mit großer roter Samtschleife, Kinderkleidung auf Puppen und Holzspielzeug auf einem runden Tisch.',
    focus: '50% 55%',
  },
  outfitMannequin: {
    src: '/images/outfit-mannequin.webp',
    ...HOCHFORMAT,
    alt: 'Zusammengestelltes Kinderoutfit aus Strickjacke, Hemd und Chino auf einer Schaufensterpuppe, davor ein zweiter Pullover und ein Roller.',
    focus: '50% 45%',
  },
  heroPoster: {
    src: '/images/hero-poster.webp',
    width: 720,
    height: 1280,
    alt: 'Blick durch die Boutique: helle Regale voller Kinderkleidung zu beiden Seiten, Holzboden, warmes Licht.',
    focus: '50% 50%',
  },
} as const satisfies Record<string, ImageSlot>;

export type ImageSlotName = keyof typeof IMAGES;

export const BRAND = {
  scheibe: { src: '/images/brand/petite-pali-scheibe.webp', width: 1013, height: 1013 },
  marke: { src: '/images/brand/petite-pali-marke.webp', width: 285, height: 394 },
  schriftzug: { src: '/images/brand/petite-pali-schriftzug.webp', width: 626, height: 276 },
} as const;
