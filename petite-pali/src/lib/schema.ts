import { CONTACT, SITE } from '@/content/site';

/**
 * Strukturierte Daten entstehen ausschließlich aus bestätigten Feldern.
 *
 * LocalBusiness braucht eine Adresse; eine unbestätigte auszuliefern würde eine
 * erfundene Tatsache an Suchmaschinen melden. Deshalb hängt alles an
 * CONTACT.verified, und ohne Bestätigung fällt der Typ auf Organization zurück.
 *
 * Bestätigt ist hier ClothingStore statt des allgemeinen LocalBusiness: der
 * Laden verkauft überwiegend Kleidung, und der genauere Typ ist für die lokale
 * Suche der nützlichere.
 */
export function organizationSchema() {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': CONTACT.verified ? 'ClothingStore' : 'Organization',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    areaServed: SITE.region,
    sameAs: [SITE.instagram.url],
  };

  if (!CONTACT.verified) return base;

  if (CONTACT.address) {
    base.address = {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      postalCode: CONTACT.address.postalCode,
      addressLocality: CONTACT.address.city,
      addressCountry: CONTACT.address.country,
    };
  }
  if (CONTACT.phone) base.telephone = CONTACT.phone;
  if (CONTACT.email) base.email = CONTACT.email;
  if (CONTACT.hours.length > 0) {
    base.openingHoursSpecification = CONTACT.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }));
  }

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
