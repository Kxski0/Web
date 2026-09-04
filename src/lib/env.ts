/**
 * Deployment-dependent values.
 *
 * Indexing defaults to OFF. The imprint is not complete, and an incomplete
 * imprint is actionable in Germany — so a deployment that nobody has explicitly
 * cleared for launch must not end up in a search index. Set SITE_INDEXABLE=true
 * only on the production deployment, and only once the legal pages are filled
 * in (see CONTENT-TODO.md).
 */
export const INDEXABLE = process.env.SITE_INDEXABLE === 'true';

/**
 * Canonical origin. Explicit value first; on Vercel the production domain is
 * injected automatically, which keeps preview deployments from claiming
 * canonicals they do not own.
 */
export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return 'https://www.solbautec.de';
}
