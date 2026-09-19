/**
 * Vom Deployment abhängige Werte.
 *
 * Indexierung ist standardmäßig AUS. Das Impressum ist noch nicht vollständig
 * (Inhaber:in, Rechtsform, USt-IdNr./Steuernummer fehlen, siehe CONTENT-TODO.md),
 * und ein unvollständiges Impressum ist in Deutschland abmahnfähig — ein
 * Deployment, das niemand ausdrücklich freigegeben hat, darf deshalb nicht in
 * einem Suchindex landen. SITE_INDEXABLE=true nur auf der Produktion setzen,
 * und erst, wenn die Pflichtangaben da sind.
 */
export const INDEXABLE = process.env.SITE_INDEXABLE === 'true';

/**
 * Kanonischer Ursprung. Ausdrücklicher Wert zuerst; auf Vercel wird sonst die
 * Produktionsdomain eingesetzt, damit Preview-Deployments keine Canonicals
 * beanspruchen, die ihnen nicht gehören.
 *
 * Ohne beides wird bewusst auf die Vercel-Domain zurückgefallen und nicht auf
 * petite-pali.de: dort liegt derzeit noch die alte Seite.
 */
export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return 'https://petite-pali.vercel.app';
}
