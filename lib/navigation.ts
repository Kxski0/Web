import { leistungen } from '@/content/leistungen';

export type NavItem = { href: string; label: string };

/** Hauptnavigation. Bewusst vier Punkte — die Vorgabe schliesst Mega-Menues aus. */
export const mainNav: NavItem[] = [
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/unternehmen', label: 'Unternehmen' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/kontakt', label: 'Kontakt' },
];

/** Alle Leistungsseiten — fuer den Footer und die Sitemap. */
export const leistungsNav: NavItem[] = leistungen.map((l) => ({
  href: `/${l.slug}`,
  label: l.name,
}));

/** Pflichtangaben nach deutschem Recht. */
export const legalNav: NavItem[] = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
];
