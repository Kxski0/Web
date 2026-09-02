/**
 * The seven states the building passes through (§14).
 *
 * Copy is explanatory, not promotional: it states how the components relate.
 * No output figures, no payback periods, no yields — none of that can be
 * asserted without a specific building and a specific measurement (§43).
 */

export type Phase = {
  id: string;
  index: string;
  label: string;
  title: string;
  body: string;
  /** SVG layers switched on at this phase. Layers are cumulative. */
  layers: string[];
};

export const PHASES: Phase[] = [
  {
    id: 'gebaeude',
    index: '01',
    label: 'Gebäude',
    title: 'Zuerst das Haus.',
    body: 'Dachneigung, Ausrichtung, Verschattung und der tatsächliche Verbrauch bestimmen, was sinnvoll ist. Nicht der Katalog.',
    layers: ['house'],
  },
  {
    id: 'photovoltaik',
    index: '02',
    label: 'Photovoltaik',
    title: 'Das Dach wird zur Energiequelle.',
    body: 'Die Module wandeln Sonnenlicht in Gleichstrom. Wie viel davon ankommt, entscheidet die Belegung der Dachfläche — nicht die Nennleistung auf dem Datenblatt.',
    layers: ['house', 'pv'],
  },
  {
    id: 'wechselrichter',
    index: '03',
    label: 'Wechselrichter',
    title: 'Aus Gleichstrom wird nutzbarer Strom.',
    body: 'Der Wechselrichter setzt den Gleichstrom der Module in Wechselstrom um. Hier wird die Anlage zum ersten Mal messbar.',
    layers: ['house', 'pv', 'sun', 'inverter', 'flowSun', 'flowDc'],
  },
  {
    id: 'speicher',
    index: '04',
    label: 'Stromspeicher',
    title: 'Energie, wenn Sie sie brauchen.',
    body: 'Erzeugung und Verbrauch fallen selten zusammen. Der Speicher verschiebt den Ertrag des Mittags in den Abend.',
    layers: ['house', 'pv', 'sun', 'inverter', 'storage', 'flowSun', 'flowDc', 'flowStorage'],
  },
  {
    id: 'waermepumpe',
    index: '05',
    label: 'Wärmepumpe',
    title: 'Wärme, die mit dem Haus arbeitet.',
    body: 'Die Wärmepumpe erzeugt aus Strom ein Vielfaches an Wärme. Sie ist der größte Verbraucher im Haus — und damit der größte Hebel für den Eigenverbrauch.',
    layers: [
      'house',
      'pv',
      'sun',
      'inverter',
      'storage',
      'heatpump',
      'flowSun',
      'flowDc',
      'flowStorage',
      'flowHeat',
    ],
  },
  {
    id: 'energiemanagement',
    index: '06',
    label: 'Energiemanagement',
    title: 'Die Intelligenz zwischen den Komponenten.',
    body: 'Das Energiemanagement entscheidet, wohin jede Kilowattstunde geht: in den Speicher, in die Wärmepumpe, ins Fahrzeug oder ins Netz.',
    layers: [
      'house',
      'pv',
      'sun',
      'inverter',
      'storage',
      'heatpump',
      'ems',
      'load',
      'flowSun',
      'flowDc',
      'flowStorage',
      'flowHeat',
      'flowLoad',
    ],
  },
  {
    id: 'system',
    index: '07',
    label: 'System',
    title: 'Vier Komponenten, eine Planung.',
    body: 'Einzeln gekauft ergeben sie vier Rechnungen. Zusammen geplant ergeben sie den Eigenverbrauch, der eine Anlage trägt.',
    layers: [
      'house',
      'pv',
      'sun',
      'inverter',
      'storage',
      'heatpump',
      'ems',
      'load',
      'flowSun',
      'flowDc',
      'flowStorage',
      'flowHeat',
      'flowLoad',
    ],
  },
];

/** Layers visible at a given phase, or all of them for the static fallback. */
export function layersFor(phaseIndex: number | 'all'): Set<string> {
  if (phaseIndex === 'all') {
    return new Set(PHASES[PHASES.length - 1].layers);
  }
  return new Set(PHASES[Math.min(phaseIndex, PHASES.length - 1)].layers);
}
