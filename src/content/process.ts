/** The five steps of an engagement (§22). Plain description of what happens. */

export type ProcessStep = {
  index: string;
  label: string;
  body: string;
};

export const PROCESS: ProcessStep[] = [
  {
    index: '01',
    label: 'Verstehen',
    body: 'Wir sehen uns das Gebäude an: Dach, Heizung, Zählerschrank, Verbrauch. Was danach folgt, ergibt sich aus dem Bestand — nicht aus einem Standardpaket.',
  },
  {
    index: '02',
    label: 'Planen',
    body: 'Auslegung, Verschaltung und Platzierung der Technik. Sie bekommen ein Konzept, das die Komponenten aufeinander abstimmt, bevor etwas bestellt wird.',
  },
  {
    index: '03',
    label: 'Realisieren',
    body: 'Montage, Elektroinstallation, Inbetriebnahme und die Anmeldung beim Netzbetreiber — koordiniert aus einer Hand.',
  },
  {
    index: '04',
    label: 'Verbinden',
    body: 'Die Komponenten werden eingebunden und aufeinander eingestellt, bis sie als ein System arbeiten statt nebeneinander.',
  },
  {
    index: '05',
    label: 'Begleiten',
    body: 'Nach der Inbetriebnahme bleiben wir Ansprechpartner: Betrieb, Wartung und spätere Erweiterung des Systems.',
  },
];
