export type Brand = {
  name: string;
  /** Woher der Beleg stammt. Ohne Beleg kein Eintrag. */
  quelle: string;
};

/**
 * Marken, die nachweislich im Laden geführt werden.
 *
 * Jeder Eintrag ist auf den eigenen Fotos des Geschäfts zu sehen. Was nicht
 * belegt ist, steht nicht hier — eine Markenliste ist eine Tatsachenbehauptung,
 * und eine falsche wäre gegenüber der Marke wie gegenüber der Kundschaft ein
 * Problem. Die Liste ist bewusst kurz und soll vom Laden ergänzt werden
 * (CONTENT-TODO.md).
 *
 * Ist die Liste leer, rendert der Abschnitt gar nicht.
 */
export const BRANDS: Brand[] = [
  { name: 'Jellycat', quelle: 'Spieluhren im Regal, eigener Beitrag vom 16.09.2025' },
  { name: 'Play Up', quelle: 'Markenschild an der Kleiderstange, eigener Beitrag vom 01.09.2025' },
  { name: 'Scoot & Ride', quelle: 'Roller unter dem Verkaufstisch, eigener Beitrag vom 27.08.2025' },
  { name: 'manduca', quelle: 'Tragehilfen im Schaufenster, eigener Beitrag vom 18.12.2025' },
];
