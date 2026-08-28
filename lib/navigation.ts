export type NavItem = { href: string; label: string };

/** Hauptnavigation — von Nav und Footer gemeinsam genutzt. */
export const mainNav: NavItem[] = [
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/ueber-uns', label: 'Über uns' },
  { href: '/referenzen', label: 'Referenzen' },
  { href: '/kontakt', label: 'Kontakt' },
];

/** Pflichtangaben nach deutschem Recht. */
export const legalNav: NavItem[] = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
];
