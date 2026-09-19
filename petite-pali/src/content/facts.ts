/**
 * Belegte Angaben aus dem bestehenden Auftritt.
 *
 * REGEL: nichts hier ist erfunden. Jede Angabe stammt aus der bestehenden
 * Website petite-pali.de oder aus den eigenen Fotos des Geschäfts. Die Domain
 * ist aus der Arbeitsumgebung heraus gesperrt (403 am Gateway), die Inhalte
 * wurden deshalb über Suchmaschinen-Auszüge derselben Seiten erfasst. Was
 * daraus nicht eindeutig hervorging, steht nicht hier, sondern in
 * CONTENT-TODO.md.
 */

/** Größenspanne, wie sie der Laden selbst angibt. */
export const SIZES = {
  from: 44,
  to: 122,
  /** Die Leiter für den Signature-Abschnitt — deutsche Konfektionsgrößen. */
  ladder: [44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116, 122],
} as const;

/** Materialien, die der Laden für sein Sortiment nennt. */
export const MATERIALS = ['Wolle', 'Seide', 'Bambus', 'Merino', 'Kaschmir'] as const;

/** Herkunftsangabe des Ladens. */
export const ORIGIN = {
  share: 'über 95 %',
  where: 'Europa',
} as const;

/**
 * Das Team, wie es der bestehende Auftritt nennt. Keine erfundenen Rollen,
 * keine erfundenen Geschichten — Porträts und ausführliche Texte stehen als
 * offener Punkt in CONTENT-TODO.md.
 */
export const TEAM = {
  owner: 'Nina',
  ownerRole: 'Herz und Seele von Petite Pali',
  members: ['Janice', 'Steffi', 'Annette', 'Jutta'],
} as const;

/**
 * Kinderwagen. BEQOONI® ist eine eingetragene Marke Dritter und wird hier nur
 * genannt, weil der Laden laut eigenem Auftritt einer der Showrooms ist.
 * Keine Preise, keine Modellversprechen, keine Verfügbarkeiten.
 */
export const STROLLER = {
  brand: 'BEQOONI®',
  role: 'einer der exklusiven BEQOONI®-Showrooms',
} as const;

export type Brand = { name: string; quelle: string };

/**
 * Marken, die nachweislich geführt werden — jeder Eintrag ist auf einem
 * eigenen Foto des Geschäfts zu sehen oder auf der bestehenden Website
 * genannt. Eine Markenliste ist eine Tatsachenbehauptung; ohne Beleg kein
 * Eintrag. Ist die Liste leer, rendert der Abschnitt gar nicht.
 */
export const BRANDS: Brand[] = [
  { name: 'BEQOONI®', quelle: 'Kinderwagen-Seite des bestehenden Auftritts' },
  { name: 'Jellycat', quelle: 'Spieluhren im Regal, eigener Beitrag vom 16.09.2025' },
  { name: 'Play Up', quelle: 'Markenschild an der Kleiderstange, eigener Beitrag vom 01.09.2025' },
  { name: 'Scoot & Ride', quelle: 'Roller unter dem Verkaufstisch, eigener Beitrag vom 27.08.2025' },
  { name: 'manduca', quelle: 'Tragehilfen im Schaufenster, eigener Beitrag vom 18.12.2025' },
];
