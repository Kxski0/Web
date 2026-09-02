import { CONTACT, SITE } from '@/content/site';

/**
 * Structured data is built from confirmed fields only.
 *
 * LocalBusiness requires an address; emitting one we have not verified would
 * publish an invented fact to search engines, which §43 forbids outright. So
 * the address, phone and email are omitted until CONTACT.verified is true, and
 * the type degrades to Organization.
 */
export function organizationSchema() {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': CONTACT.verified ? 'LocalBusiness' : 'Organization',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    areaServed: SITE.region,
  };

  if (CONTACT.verified && CONTACT.address) {
    base.address = {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      postalCode: CONTACT.address.postalCode,
      addressLocality: CONTACT.address.city,
      addressCountry: CONTACT.address.country,
    };
  }
  if (CONTACT.verified && CONTACT.phone) base.telephone = CONTACT.phone;
  if (CONTACT.verified && CONTACT.email) base.email = CONTACT.email;

  return base;
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).toString(),
    })),
  };
}
