export type NavItem = {
  label: string;
  href: string;
};

/**
 * Anchors are written absolute ("/#system") so they resolve from a sub-page as
 * well as from the home page.
 */
export const NAV: NavItem[] = [
  { label: 'Lösungen', href: '/#loesungen' },
  { label: 'Systeme', href: '/#system' },
  { label: 'Projekte', href: '/projekte/' },
  { label: 'Über uns', href: '/ueber-uns/' },
];

export const PRIMARY_CTA = { label: 'Projekt besprechen', href: '/kontakt/' };

/** Sub-navigation between the solution pages. */
export const SOLUTION_ROUTES = [
  { label: 'Photovoltaik', href: '/photovoltaik/' },
  { label: 'Stromspeicher', href: '/stromspeicher/' },
  { label: 'Wärmepumpe', href: '/waermepumpe/' },
  { label: 'Energiemanagement', href: '/energiemanagement/' },
  { label: 'Klima', href: '/klima/' },
  { label: 'Carports und Terrassenüberdachungen', href: '/carports-terrassenueberdachungen/' },
] as const;
