/**
 * Kundenreferenzen.
 *
 * WICHTIG: Hier stehen ausschliesslich Kundennamen, die vom Unternehmen
 * genannt wurden. Es sind bewusst KEINE Zitate hinterlegt, weil der Wortlaut
 * der tatsaechlichen Kundenstimmen nicht vorliegt. Erfundene Aussagen
 * echten Unternehmen zuzuschreiben waere eine Falschdarstellung.
 *
 * Sobald die echten Aussagen vorliegen, wird das Feld `zitat` gefuellt —
 * die Testimonial-Darstellung schaltet sich dann automatisch zu.
 */
export type Referenz = {
  name: string;
  branche?: string;
  zitat?: string;
};

export const referenzen: Referenz[] = [
  { name: 'Auto-Galerie Rehlingen', branche: 'Automobilhandel' },
  { name: 'Autoteile Jakobs GmbH', branche: 'Handel' },
  { name: 'AKTIVFIT Fitnessstudio', branche: 'Sport und Freizeit' },
  { name: 'Sicherheitsagentur', branche: 'Dienstleistung' },
];

/** Erst wahr, wenn echte Zitate hinterlegt sind. */
export const hatZitate = referenzen.some((r) => Boolean(r.zitat));
