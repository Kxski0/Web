/**
 * "Vom Potenzial zur Loesung" — das zentrale Erzaehlstueck der Startseite.
 *
 * Fuenf Schritte, die beim Scrollen nacheinander aufgebaut werden. Die
 * Reihenfolge ist die Positionierung des Unternehmens in Kurzform.
 */
export type Schritt = {
  nummer: string;
  titel: string;
  text: string;
};

export const prozess: Schritt[] = [
  {
    nummer: '01',
    titel: 'Analysieren',
    text: 'Wir sehen uns Ihre aktuelle Situation an — Verbrauch, Verträge, Gebäude, Technik. Ohne diesen Schritt ist jede Empfehlung geraten.',
  },
  {
    nummer: '02',
    titel: 'Einsparpotenziale erkennen',
    text: 'Wo entstehen unnötige Kosten? Wir benennen die Stellen konkret, statt pauschal zur Sanierung zu raten.',
  },
  {
    nummer: '03',
    titel: 'Lösung entwickeln',
    text: 'Wir vergleichen die Möglichkeiten und stellen sie gegenüber. Auch die Option, vorerst nichts zu tun, gehört dazu.',
  },
  {
    nummer: '04',
    titel: 'Umsetzen',
    text: 'Wir koordinieren die notwendigen Schritte und die beteiligten Partner. Sie behalten einen Ansprechpartner.',
  },
  {
    nummer: '05',
    titel: 'Weiter betreuen',
    text: 'Nach der Umsetzung bleiben wir erreichbar — für Rückfragen, Wartung und die nächste Optimierung.',
  },
];
