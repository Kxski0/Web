export type NavItem = { label: string; href: string; children?: NavItem[] };

/**
 * Die Navigation folgt der bestehenden Website, ist aber gestrafft: aus den
 * fünf Einzelseiten unter „Leistungen" wird ein Sortiment mit Unterseiten,
 * damit der Hauptpunkt nicht fünf gleichrangige Geschwister hat.
 */
export const NAV: NavItem[] = [
  {
    label: 'Sortiment',
    href: '/sortiment/',
    children: [
      { label: 'Frühchen', href: '/sortiment/fruehchen/' },
      { label: 'Baby & Kind', href: '/sortiment/baby-und-kind/' },
      { label: 'Für Mama', href: '/sortiment/fuer-mama/' },
      { label: 'Tragehilfen', href: '/sortiment/tragehilfen/' },
      { label: 'Kinderwagen', href: '/sortiment/kinderwagen/' },
      { label: 'Dies & Das', href: '/sortiment/dies-das/' },
    ],
  },
  { label: 'Über uns', href: '/ueber-uns/' },
  { label: 'Galerie', href: '/galerie/' },
  { label: 'Aktuelles', href: '/aktuelles/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

/** Die beiden Handlungen, die zählen. Sie stehen abgesetzt, nicht in der Reihe. */
export const ACTIONS = [
  { label: 'Shopping-Termin', href: '/shopping-termin/' },
  { label: 'Gutschein', href: '/gutschein/' },
] as const;

export const PRIMARY_CTA = { label: 'Shopping-Termin', href: '/shopping-termin/' };
