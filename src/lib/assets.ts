/**
 * Asset contract.
 *
 * Components reference a SLOT, never a file path. Each slot records the focal
 * point and intrinsic size so crops stay art-directed rather than accidental.
 *
 * Sources were mapped to slots by inspecting each delivered photograph, as
 * Master Concept §24 requires — filenames were not trusted.
 */

export type ImageSlot = {
  src: string;
  width: number;
  height: number;
  /** German, descriptive, useful without sight. Never "Bild" or a keyword list. */
  alt: string;
  /** object-position for crops tighter than the intrinsic ratio. */
  focus: string;
  /** Portrait-cropped variant for narrow viewports, where one exists. */
  portrait?: { src: string; width: number; height: number };
};

const LANDSCAPE = { width: 1536, height: 1024 };

export const IMAGES = {
  heroEnergySystem: {
    src: '/images/hero-energy-system.webp',
    ...LANDSCAPE,
    alt: 'Einfamilienhaus in der Abenddämmerung mit vollflächig belegtem Photovoltaikdach; die Wohnräume sind warm beleuchtet.',
    focus: '72% 55%',
    portrait: {
      src: '/images/hero-energy-system-portrait.webp',
      width: 768,
      height: 1024,
    },
  },
  roofArchitecture: {
    src: '/images/roof-architecture.webp',
    ...LANDSCAPE,
    alt: 'Satteldach von oben mit durchgehendem Feld schwarzer Photovoltaikmodule, dahinter eine Wohnsiedlung.',
    focus: '60% 50%',
  },
  pvInstallationRooftop: {
    src: '/images/pv-installation-rooftop.webp',
    ...LANDSCAPE,
    alt: 'Monteur kniet auf einem Ziegeldach und richtet ein Photovoltaikmodul auf der Montageschiene aus.',
    focus: '58% 50%',
  },
  solarDetailModule: {
    src: '/images/solar-detail-module.webp',
    ...LANDSCAPE,
    alt: 'Nahaufnahme der Kante eines Photovoltaikmoduls im Gegenlicht, montiert auf einem Ziegeldach.',
    focus: '50% 50%',
  },
  solarMaterialDetail: {
    src: '/images/solar-material-detail.webp',
    ...LANDSCAPE,
    alt: 'Makroaufnahme einer schwarzen Modulklemme, die ein Photovoltaikmodul auf der Aluminiumschiene fixiert.',
    focus: '50% 50%',
  },
  technicianDetail: {
    src: '/images/technician-detail.webp',
    ...LANDSCAPE,
    alt: 'Behandschuhte Hände eines Technikers verbinden Steckverbinder an der Unterseite eines Anschlusskastens.',
    focus: '55% 50%',
  },
  technicianInverter: {
    src: '/images/technician-inverter.webp',
    ...LANDSCAPE,
    alt: 'Techniker verkabelt einen Wechselrichter an der Wand eines Technikraums.',
    focus: '55% 45%',
  },
  batteryStorageDetail: {
    src: '/images/battery-storage-detail.webp',
    ...LANDSCAPE,
    alt: 'Stromspeicher als stehender Schrank neben einem wandmontierten Wechselrichter in einem Technikraum aus Sichtbeton.',
    focus: '62% 50%',
  },
  energyManagement: {
    src: '/images/energy-management.webp',
    ...LANDSCAPE,
    alt: 'Technikwand mit mehreren Wechselrichtern, Unterverteilung und Stromspeicher, sauber auf eine Kabeltrasse geführt.',
    focus: '55% 45%',
  },
  heatPumpInstallation: {
    src: '/images/heat-pump-installation.webp',
    ...LANDSCAPE,
    alt: 'Techniker montiert die hydraulischen Anschlüsse einer Wärmepumpen-Außeneinheit an der Hauswand.',
    focus: '55% 50%',
  },
  heatPumpArchitecture: {
    src: '/images/heat-pump-architecture.webp',
    width: 1122,
    height: 1402,
    alt: 'Wärmepumpen-Außeneinheit auf Kiesbett vor der Holzfassade eines modernen Wohnhauses im Abendlicht.',
    focus: '50% 60%',
  },
  teamDocumentary: {
    src: '/images/team-documentary.webp',
    ...LANDSCAPE,
    alt: 'Zwei Techniker stimmen sich mit einem Tablet vor der installierten Anlagentechnik ab.',
    focus: '50% 45%',
  },
  finishedHouseEvening: {
    src: '/images/finished-house-evening.webp',
    ...LANDSCAPE,
    alt: 'Wohnhaus zur blauen Stunde mit Photovoltaikdach, beleuchteten Innenräumen und Wandladestation.',
    focus: '55% 55%',
  },
  projectWide: {
    src: '/images/project-wide.webp',
    ...LANDSCAPE,
    alt: 'Gesamtansicht eines Wohnhauses mit Photovoltaikanlage auf dem Dach und Wärmepumpe an der Giebelseite.',
    focus: '58% 55%',
  },
} as const satisfies Record<string, ImageSlot>;

export type ImageSlotName = keyof typeof IMAGES;
