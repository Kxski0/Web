export type NavItem = {
  label: string;
  href: string;
  /** Anchor targets are the interim state until the sub-pages exist. */
  interim?: boolean;
};

export const NAV: NavItem[] = [
  { label: 'Lösungen', href: '#loesungen', interim: true },
  { label: 'Systeme', href: '#system', interim: true },
  { label: 'Projekte', href: '#projekte', interim: true },
  { label: 'Über uns', href: '#ueber-uns', interim: true },
];

export const PRIMARY_CTA = { label: 'Projekt besprechen', href: '#kontakt' };
