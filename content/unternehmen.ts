/**
 * Stammdaten Energie Zentrum Saar.
 *
 * Einzige Quelle fuer Name, Anschrift und Kontakt — wird von Footer, Kontakt,
 * Impressum und den strukturierten Daten gemeinsam genutzt.
 */
export const unternehmen = {
  marke: 'Energie Zentrum Saar',
  markeKurz: 'EZS',
  traeger: 'EZS GmbH',
  claim: 'Ihr Kostenoptimierer',

  strasse: 'Lebacher Straße 1',
  plz: '66793',
  ort: 'Saarwellingen',
  region: 'Saarland',
  land: 'DE',

  telefon: '06838 208 3572',
  telefonHref: 'tel:+4968382083572',
  email: 'info@energie-zentrum-saar.de',
  emailHref: 'mailto:info@energie-zentrum-saar.de',

  /**
   * Regional verwurzelt, einzelne Leistungen aber deutschlandweit. Die
   * Website darf nicht behaupten, es wuerden ausschliesslich Kunden im
   * Saarland betreut.
   */
  einzugsgebiet:
    'Im Saarland verwurzelt, einzelne Leistungen deutschlandweit verfügbar.',
} as const;

export const positionierung = {
  /** Das zentrale Prinzip der Marke. */
  prinzip: ['Analyse', 'Beratung', 'Lösung', 'Umsetzung', 'Betreuung'],
  kern:
    'Ein Ansprechpartner, der analysiert, wo Energie und Kosten eingespart werden können, passende Lösungen entwickelt und bei der Umsetzung begleitet.',
} as const;
