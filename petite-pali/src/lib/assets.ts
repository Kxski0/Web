/**
 * Bildvertrag.
 *
 * Komponenten beziehen sich auf einen SLOT, nie auf einen Dateipfad. Jeder Slot
 * hält seine Eigengröße und seinen Bildschwerpunkt fest, damit Ausschnitte
 * gestaltet sind und nicht zufällig entstehen.
 *
 * Herkunft und Zuschnitt stehen in scripts/media.mjs. Die Quellen sind der
 * eigene Ladenrundgang (720 px breit) und Bildschirmfotos des eigenen
 * Instagram-Auftritts (828 px breit). Das ist die Auflösungsgrenze: für
 * halbseitige und kleinere Flächen reicht sie, für vollflächige Bänder über
 * 1440 px wird es weich. Deshalb trägt der Hero Video statt Standbild.
 */

export type ImageSlot = {
  src: string;
  width: number;
  height: number;
  /** Deutsch, beschreibend, ohne Bild brauchbar. Nie „Bild", keine Stichwortliste. */
  alt: string;
  /** object-position für Ausschnitte, die enger sind als das Eigenformat. */
  focus: string;
};

export const IMAGES = {
  boutiqueFenster: {
    src: '/images/boutique-fenster.webp',
    width: 720,
    height: 480,
    alt: 'Blick zur Schaufensterfront: ein langer Auslagetisch mit Bilderbüchern und Kuscheltieren, dahinter große Fenster und die Bäume der Straße.',
    focus: '50% 50%',
  },
  boutiqueEingang: {
    src: '/images/boutique-eingang.webp',
    width: 643,
    height: 804,
    alt: 'Eingangsbereich der Boutique mit Tresen, Kartenständer und der Fußmatte mit dem Petite-Pali-Schriftzug.',
    focus: '50% 50%',
  },
  boutiqueRegalwand: {
    src: '/images/boutique-regalwand.webp',
    width: 626,
    height: 783,
    alt: 'Regalwand mit gefalteter Strickware in Rosé- und Beigetönen, darüber Kleiderstangen und eine Reihe Grußkarten.',
    focus: '50% 50%',
  },
  boutiqueGang: {
    src: '/images/boutique-gang.webp',
    width: 720,
    height: 480,
    alt: 'Gang zwischen zwei Kleiderstangen, rechts eine Wand aus Holzlamellen, hinten ein großes Kuscheltier auf dem Regal.',
    focus: '50% 50%',
  },
  boutiqueAuswahl: {
    src: '/images/boutique-auswahl.webp',
    width: 655,
    height: 818,
    alt: 'Dicht bestückte Regale und Kleiderstangen mit Kinderkleidung, davor Körbe mit weiteren Teilen.',
    focus: '50% 50%',
  },
  boutiqueDetail: {
    src: '/images/boutique-detail.webp',
    width: 554,
    height: 554,
    alt: 'Großes olivfarbenes Kuscheltier sitzt oben auf dem Regal über einer Kleiderstange.',
    focus: '50% 50%',
  },
  boutiqueMitte: {
    src: '/images/boutique-mitte.webp',
    width: 667,
    height: 444,
    alt: 'Mitteltisch mit gefalteter Kinderkleidung, darunter eine Reihe bunter Kinderroller.',
    focus: '50% 50%',
  },
  boutiqueBeratung: {
    src: '/images/boutique-beratung.webp',
    width: 610,
    height: 763,
    alt: 'Kleiner Tisch mit Decke zwischen den Kleiderstangen, an dem beraten wird.',
    focus: '50% 50%',
  },
  wareTisch: {
    src: '/images/ware-tisch.webp',
    width: 720,
    height: 480,
    alt: 'Verkaufstisch dicht belegt mit gefalteter Kinderkleidung, nach Farben und Größen sortiert.',
    focus: '50% 50%',
  },
  wareSpieluhren: {
    src: '/images/ware-spieluhren.webp',
    width: 753,
    height: 941,
    alt: 'Drei Spieluhren als Stern, Fuchs und Wolke hängen vor einer Reihe gestrickter Babyjacken.',
    focus: '50% 50%',
  },
  wareRegal: {
    src: '/images/ware-regal.webp',
    width: 739,
    height: 924,
    alt: 'Weißes Regal mit Kuscheltieren und Kinderrucksäcken, daneben eine Stange mit rosafarbenen Kleidern.',
    focus: '50% 50%',
  },
  outfitKind: {
    src: '/images/outfit-kind.webp',
    width: 679,
    height: 848,
    alt: 'Zusammengestelltes Kinderoutfit: dunkelblaue Strickjacke über beigem Hemd und Cordhose.',
    focus: '50% 40%',
  },
  outfitHerbst: {
    src: '/images/outfit-herbst.webp',
    width: 552,
    height: 690,
    alt: 'Herbstoutfit aus Filzweste, kariertem Hemd und Cordhose, daneben ein Wollplüschanzug.',
    focus: '50% 50%',
  },
  schaufensterWinter: {
    src: '/images/schaufenster-winter.webp',
    width: 690,
    height: 460,
    alt: 'Winterschaufenster mit großer roter Samtschleife, Kleidung auf Puppen und Holzspielzeug auf einem runden Tisch.',
    focus: '50% 50%',
  },
  tuer: {
    src: '/images/tuer.webp',
    width: 690,
    height: 690,
    alt: 'Ladeneingang mit der Fußmatte „Petite Pali — Baby & Kinder Boutique", davor ein Kinderoutfit und ein Puppenwagen.',
    focus: '50% 50%',
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

/** Die Galerie zeigt alles, was echtes Ladenmaterial ist — in fester Reihenfolge. */
export const GALLERY: ImageSlotName[] = [
  'boutiqueFenster',
  'wareSpieluhren',
  'boutiqueRegalwand',
  'boutiqueGang',
  'outfitKind',
  'boutiqueAuswahl',
  'wareTisch',
  'boutiqueDetail',
  'boutiqueBeratung',
  'outfitHerbst',
  'boutiqueMitte',
  'wareRegal',
  'tuer',
  'schaufensterWinter',
  'boutiqueEingang',
];

export const BRAND = {
  scheibe: { src: '/images/brand/petite-pali-scheibe.webp', width: 1013, height: 1013 },
  marke: { src: '/images/brand/petite-pali-marke.webp', width: 285, height: 394 },
  schriftzug: { src: '/images/brand/petite-pali-schriftzug.webp', width: 626, height: 276 },
} as const;
