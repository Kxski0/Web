import { IMAGES, type ImageSlot } from '@/lib/assets';

/**
 * Copy states how each component is planned and what it depends on. No yields,
 * no payback periods, no "innovative sustainable solutions" — a claim that
 * cannot be checked against a specific building does not belong here (§37/§43).
 */

export type Solution = {
  id: string;
  index: string;
  label: string;
  title: string;
  body: string;
  image: ImageSlot;
  /** Route for the detail page. Anchors until those pages ship. */
  href: string;
};

export const SOLUTIONS: Solution[] = [
  {
    id: 'photovoltaik',
    index: '01',
    label: 'Photovoltaik',
    title: 'Das Dach wird zur Energiequelle.',
    body: 'Zuerst das Dach: Neigung, Ausrichtung, Verschattung, Statik und Zustand der Eindeckung. Erst danach steht die Belegung fest — und damit, was die Anlage über das Jahr tatsächlich leisten kann.',
    image: IMAGES.pvInstallationRooftop,
    href: '#photovoltaik',
  },
  {
    id: 'stromspeicher',
    index: '02',
    label: 'Stromspeicher',
    title: 'Energie, wenn Sie sie brauchen.',
    body: 'Ein Speicher rechnet sich über den Eigenverbrauch, nicht über die Kapazität. Wir legen ihn nach Ihrem Lastprofil aus, nicht nach Datenblatt.',
    image: IMAGES.batteryStorageDetail,
    href: '#stromspeicher',
  },
  {
    id: 'waermepumpe',
    index: '03',
    label: 'Wärmepumpe',
    title: 'Wärme, die mit Ihrem Haus arbeitet.',
    body: 'Je niedriger die Vorlauftemperatur, desto effizienter die Wärmepumpe. Deshalb beginnt die Planung bei Heizflächen und Gebäudehülle — nicht beim Gerät.',
    image: IMAGES.heatPumpArchitecture,
    href: '#waermepumpe',
  },
  {
    id: 'energiemanagement',
    index: '04',
    label: 'Energiemanagement',
    title: 'Die Intelligenz zwischen den Komponenten.',
    body: 'Ohne Steuerung laufen Photovoltaik, Speicher und Wärmepumpe nebeneinander her. Das Energiemanagement entscheidet, wohin der eigene Strom zuerst fließt.',
    image: IMAGES.energyManagement,
    href: '#energiemanagement',
  },
];

/**
 * Offerings with no photography of their own. Shown as text rather than
 * illustrated with a picture of something else — a stand-in image would
 * misrepresent the work.
 */
export const FURTHER_SOLUTIONS = [
  {
    id: 'klima',
    label: 'Klimasysteme',
    body: 'Kühlung und Lüftung planen wir gemeinsam mit der Wärmeerzeugung. Beides greift auf dieselbe Gebäudetechnik zu.',
    href: '#klima',
  },
  {
    id: 'carports',
    label: 'Carports und Terrassenüberdachungen',
    body: 'Überdachte Flächen sind nutzbare Flächen. Carport und Terrassendach lassen sich belegen, wenn Statik und Ausrichtung es hergeben.',
    href: '#carports',
  },
] as const;
