/**
 * Alle Leistungen von Energie Zentrum Saar.
 *
 * Diese Datei steuert die Uebersichtsseite, die Landingpages, die
 * Navigation und die strukturierten Daten. Die Texte sind aus den Angaben
 * des Unternehmens abgeleitet — bewusst ohne erfundene Zahlen, Zeitraeume,
 * Zertifikate oder Garantien.
 */

export type Cluster = {
  id: string;
  name: string;
  unterzeile: string;
};

/** Die fuenf Bereiche aus "Was koennen wir fuer Sie optimieren?" */
export const cluster: Cluster[] = [
  { id: 'energiekosten', name: 'Energiekosten', unterzeile: 'Strom, Gas, Tarife, LED, Beratung' },
  { id: 'erzeugen', name: 'Energie erzeugen', unterzeile: 'Photovoltaik' },
  { id: 'nutzen', name: 'Energie nutzen', unterzeile: 'Infrarotheizung, Wärmepumpe, Pelletöfen' },
  { id: 'gebaeude', name: 'Gebäude verbessern', unterzeile: 'Bauservice, Bauelemente' },
  { id: 'immobilien', name: 'Immobilien verwalten', unterzeile: 'Hausverwaltung' },
];

export type Leistung = {
  slug: string;
  name: string;
  cluster: string;
  zielgruppe: 'Privat' | 'Gewerbe' | 'Privat & Gewerbe';
  seoTitle: string;
  seoDescription: string;
  /** Die Buehnen-Ueberschrift der Landingpage. */
  h1: string;
  intro: string;
  /** Was die Leistung konkret umfasst. */
  umfang: { titel: string; text: string }[];
  ctaLabel: string;
  faq?: { frage: string; antwort: string }[];
};

export const leistungen: Leistung[] = [
  {
    slug: 'photovoltaik',
    name: 'Photovoltaik',
    cluster: 'erzeugen',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Photovoltaik im Saarland — Planung, Installation, Betreuung',
    seoDescription:
      'Photovoltaikanlagen von der Wirtschaftlichkeitsanalyse über die Planung bis zur Installation und laufenden Betreuung. Energie Zentrum Saar, Saarwellingen.',
    h1: 'Ihre Energie. Auf Ihrem Dach.',
    intro:
      'Eine Photovoltaikanlage lohnt sich nicht überall gleich. Deshalb steht am Anfang keine Produktempfehlung, sondern die Frage, was Ihr Dach und Ihr Verbrauch tatsächlich hergeben. Erst danach planen wir die Anlage — und begleiten sie über die Installation hinaus.',
    umfang: [
      { titel: 'Beratung', text: 'Wir klären, welche Anlagengröße zu Ihrem Verbrauch passt und wo die Grenzen liegen.' },
      { titel: 'Wirtschaftlichkeitsanalyse', text: 'Ertrag, Eigenverbrauch und Amortisation werden durchgerechnet, bevor Sie sich entscheiden.' },
      { titel: 'Planung', text: 'Auslegung der Anlage, Abstimmung der Komponenten und Vorbereitung der Netzanfrage.' },
      { titel: 'Installation', text: 'Wir koordinieren die Umsetzung und die beteiligten Gewerke.' },
      { titel: 'Betreuung', text: 'Nach der Inbetriebnahme bleiben wir Ansprechpartner — für Fragen, Wartung und Erweiterungen.' },
    ],
    ctaLabel: 'PV-Potenzial prüfen',
    faq: [
      {
        frage: 'Lohnt sich Photovoltaik auf meinem Dach?',
        antwort:
          'Das hängt von Ausrichtung, Neigung, Verschattung und vor allem von Ihrem eigenen Stromverbrauch ab. Genau das prüfen wir in der Wirtschaftlichkeitsanalyse, bevor eine Anlage geplant wird.',
      },
      {
        frage: 'Übernehmen Sie auch die Anmeldung beim Netzbetreiber?',
        antwort:
          'Ja. Die Netzanfrage und die notwendigen Formalitäten gehören zur Planung dazu — Sie müssen sich nicht selbst darum kümmern.',
      },
      {
        frage: 'Was passiert nach der Installation?',
        antwort:
          'Der Kontakt endet nicht mit der Inbetriebnahme. Wir bleiben Ansprechpartner für den laufenden Betrieb, für Fragen zur Abrechnung und für spätere Erweiterungen wie einen Speicher.',
      },
    ],
  },
  {
    slug: 'energieberatung',
    name: 'Energieberatung',
    cluster: 'energiekosten',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Energieberatung Saarland — Verbrauch analysieren, Kosten senken',
    seoDescription:
      'Analyse von Energieverbrauch und Gebäudesituation, Identifikation von Einsparpotenzialen und passende Maßnahmen. Für Privat- und Gewerbekunden.',
    h1: 'Erst verstehen. Dann investieren.',
    intro:
      'Die teuerste Maßnahme ist die, die am falschen Ende ansetzt. Wir sehen uns deshalb zuerst an, wo in Ihrem Gebäude tatsächlich Energie verbraucht wird und welche Einsparungen realistisch sind — und leiten daraus ab, welche Schritte sich rechnen und welche nicht.',
    umfang: [
      { titel: 'Verbrauchsanalyse', text: 'Wo geht Energie hin, und in welcher Größenordnung?' },
      { titel: 'Gebäudesituation', text: 'Zustand, Technik und Nutzung werden gemeinsam betrachtet, nicht isoliert.' },
      { titel: 'Einsparpotenziale', text: 'Wir benennen konkret, an welchen Stellen unnötige Kosten entstehen.' },
      { titel: 'Maßnahmen', text: 'Aus der Analyse entsteht eine Reihenfolge — was zuerst, was später, was gar nicht.' },
      { titel: 'Für Gewerbe', text: 'Für Unternehmen bieten wir unter anderem Energieaudits und Energieeffizienzkonzepte an.' },
    ],
    ctaLabel: 'Beratung anfragen',
    faq: [
      {
        frage: 'Muss ich nach der Beratung etwas umsetzen?',
        antwort:
          'Nein. Die Analyse steht für sich. Sie zeigt Ihnen, welche Maßnahmen sich lohnen würden — die Entscheidung darüber treffen Sie.',
      },
      {
        frage: 'Was unterscheidet die Beratung für Unternehmen?',
        antwort:
          'Im gewerblichen Bereich kommen unter anderem Energieaudits und Energieeffizienzkonzepte hinzu, die auf Betriebsabläufe und Lastprofile eingehen.',
      },
    ],
  },
  {
    slug: 'strom-gas',
    name: 'Strom & Gas',
    cluster: 'energiekosten',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Strom- und Gastarife vergleichen — Wechsel inklusive Formalitäten',
    seoDescription:
      'Tarifanalyse, Anbietervergleich, Wechselabwicklung und laufende Tarifkontrolle für Privat- und Gewerbekunden. Energie Zentrum Saar.',
    h1: 'Der günstigste Tarif ist der, den niemand für Sie sucht.',
    intro:
      'Viele Haushalte und Betriebe zahlen seit Jahren einen Tarif, der einmal gut war. Wir sehen uns an, was Sie aktuell zahlen, vergleichen geprüfte Anbieter und übernehmen den Wechsel samt Formalitäten — und danach die regelmäßige Kontrolle, damit es nicht beim einmaligen Effekt bleibt.',
    umfang: [
      { titel: 'Tarifanalyse', text: 'Was zahlen Sie heute, und wofür genau?' },
      { titel: 'Anbietervergleich', text: 'Wir vergleichen geprüfte Anbieter statt eines einzelnen Angebots.' },
      { titel: 'Wechselabwicklung', text: 'Kündigung, Anmeldung und Formalitäten übernehmen wir.' },
      { titel: 'Laufende Tarifkontrolle', text: 'Wir prüfen regelmäßig nach, ob Ihr Tarif noch passt.' },
      { titel: 'Mobilfunk & Festnetz', text: 'Dieselbe Logik gilt für Ihre Kommunikationsverträge — auch die sehen wir uns auf Wunsch an.' },
    ],
    ctaLabel: 'Tarife prüfen lassen',
    faq: [
      {
        frage: 'Muss ich mich um die Kündigung kümmern?',
        antwort:
          'Nein. Die Wechselabwicklung einschließlich der notwendigen Formalitäten übernehmen wir für Sie.',
      },
      {
        frage: 'Was passiert nach dem Wechsel?',
        antwort:
          'Wir behalten Ihren Tarif im Blick und melden uns, wenn ein Wechsel wieder sinnvoll wird. Ein einmaliger Vergleich bringt nur einen einmaligen Effekt.',
      },
    ],
  },
  {
    slug: 'led-beratung',
    name: 'LED-Beratung',
    cluster: 'energiekosten',
    zielgruppe: 'Gewerbe',
    seoTitle: 'LED-Beratung für Unternehmen — Beleuchtung als Kostenfaktor',
    seoDescription:
      'Beratung zu LED-Beleuchtung für Gewerbe: Bestandsaufnahme, Einsparpotenzial und passende Lösungen. Energie Zentrum Saar, Saarwellingen.',
    h1: 'Licht ist ein Dauerposten.',
    intro:
      'In Werkstätten, Hallen, Ladenflächen und Büros läuft die Beleuchtung viele Stunden am Tag — und taucht in der Kostenrechnung trotzdem selten auf. Wir sehen uns Ihren Bestand an und zeigen, was eine Umstellung tatsächlich bringt.',
    umfang: [
      { titel: 'Bestandsaufnahme', text: 'Welche Leuchtmittel sind im Einsatz, wie lange laufen sie?' },
      { titel: 'Einsparpotenzial', text: 'Was eine Umstellung im Jahr bedeutet — nachvollziehbar gerechnet.' },
      { titel: 'Lösungsvorschlag', text: 'Passende Beleuchtung für die tatsächliche Nutzung der Fläche.' },
      { titel: 'Umsetzung', text: 'Wir koordinieren den Austausch.' },
    ],
    ctaLabel: 'Beleuchtung prüfen lassen',
  },
  {
    slug: 'infrarotheizung',
    name: 'Infrarotheizung',
    cluster: 'nutzen',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Infrarotheizung — von der Wirtschaftlichkeitsprüfung bis zur Abnahme',
    seoDescription:
      'Infrarotheizungen mit Heiz- und Wirtschaftlichkeitsprüfung, Konzept, Netzanfrage, Installation, Abnahme und Nachbetreuung. Energie Zentrum Saar.',
    h1: 'Wärme, die zum Gebäude passt.',
    intro:
      'Eine Infrarotheizung ist keine Universallösung — sie funktioniert dort gut, wo Gebäude und Nutzung dazu passen. Deshalb steht am Anfang die Heiz- und Wirtschaftlichkeitsprüfung, und erst danach das Konzept.',
    umfang: [
      { titel: 'Heiz- und Wirtschaftlichkeitsprüfung', text: 'Passt die Technik zu Ihrem Gebäude, und rechnet sie sich?' },
      { titel: 'Konzepterstellung', text: 'Auslegung für die einzelnen Räume und deren Nutzung.' },
      { titel: 'Netzanfrage', text: 'Abstimmung mit dem Netzbetreiber übernehmen wir.' },
      { titel: 'Installation und Abnahme', text: 'Umsetzung, Inbetriebnahme und Abnahme.' },
      { titel: 'Behördengänge und Nachbetreuung', text: 'Formalitäten und Ansprechpartner bleiben bei uns.' },
    ],
    ctaLabel: 'Wirtschaftlichkeit prüfen',
    faq: [
      {
        frage: 'Ist eine Infrarotheizung für jedes Gebäude geeignet?',
        antwort:
          'Nein. Ob sie sinnvoll ist, hängt vom Gebäudezustand und von der Nutzung ab. Genau deshalb steht die Heiz- und Wirtschaftlichkeitsprüfung am Anfang und nicht am Ende.',
      },
    ],
  },
  {
    slug: 'waermepumpe',
    name: 'Brauchwasser-Wärmepumpe',
    cluster: 'nutzen',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Brauchwasser-Wärmepumpe — Warmwasser günstiger erzeugen',
    seoDescription:
      'Beratung, Auslegung und Umsetzung von Brauchwasser-Wärmepumpen. Sinnvoll kombinierbar mit einer Photovoltaikanlage. Energie Zentrum Saar.',
    h1: 'Warmwasser ist der unterschätzte Posten.',
    intro:
      'Warmwasser läuft das ganze Jahr, unabhängig von der Heizperiode. Eine Brauchwasser-Wärmepumpe setzt genau dort an — und spielt ihre Stärke besonders dann aus, wenn sie mit selbst erzeugtem Strom betrieben wird.',
    umfang: [
      { titel: 'Bedarf klären', text: 'Wie viel Warmwasser wird tatsächlich gebraucht, und wann?' },
      { titel: 'Auslegung', text: 'Passende Dimensionierung statt Standardgröße.' },
      { titel: 'Zusammenspiel mit Photovoltaik', text: 'Wir prüfen, ob sich die Wärmepumpe mit einer PV-Anlage sinnvoll koppeln lässt.' },
      { titel: 'Umsetzung und Betreuung', text: 'Installation, Inbetriebnahme und danach ein fester Ansprechpartner.' },
    ],
    ctaLabel: 'Beratung anfragen',
  },
  {
    slug: 'pelletoefen',
    name: 'Pelletöfen',
    cluster: 'nutzen',
    zielgruppe: 'Privat',
    seoTitle: 'Pelletöfen — Beratung, Auslegung und Umsetzung',
    seoDescription:
      'Pelletöfen als Teil eines durchdachten Wärmekonzepts: Beratung, Auslegung, Umsetzung und Betreuung. Energie Zentrum Saar, Saarwellingen.',
    h1: 'Wärme aus einem nachwachsenden Brennstoff.',
    intro:
      'Ein Pelletofen ist selten die einzige Wärmequelle im Haus, aber oft die sinnvolle Ergänzung. Wir sehen ihn deshalb nicht als Einzelprodukt, sondern als Teil Ihres Wärmekonzepts.',
    umfang: [
      { titel: 'Einordnung', text: 'Welche Rolle soll der Ofen im Gesamtkonzept übernehmen?' },
      { titel: 'Auslegung', text: 'Leistung passend zum Raum und zur tatsächlichen Nutzung.' },
      { titel: 'Umsetzung', text: 'Wir koordinieren Installation und Inbetriebnahme.' },
      { titel: 'Betreuung', text: 'Ansprechpartner auch nach dem Einbau.' },
    ],
    ctaLabel: 'Beratung anfragen',
  },
  {
    slug: 'bauservice',
    name: 'Bauservice',
    cluster: 'gebaeude',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Bauservice — Koordination von Handwerkern und Material',
    seoDescription:
      'Beratung, Koordination von Handwerkern und Materialien, Baufortschritts-Updates und Nachbetreuung für Bau- und Renovierungsprojekte.',
    h1: 'Ein Ansprechpartner statt zehn Telefonnummern.',
    intro:
      'Der aufwendigste Teil eines Bauvorhabens ist selten die Arbeit selbst, sondern die Abstimmung: Wer kommt wann, was fehlt noch, wer wartet auf wen. Genau diese Koordination übernehmen wir.',
    umfang: [
      { titel: 'Beratung', text: 'Wir klären den Umfang, bevor die erste Firma anrückt.' },
      { titel: 'Koordination der Handwerker', text: 'Reihenfolge und Termine der Gewerke laufen über eine Stelle.' },
      { titel: 'Materialien', text: 'Beschaffung und Abstimmung gehören dazu.' },
      { titel: 'Baufortschritts-Updates', text: 'Sie erfahren, wo das Projekt gerade steht — ohne nachfragen zu müssen.' },
      { titel: 'Nachbetreuung', text: 'Auch nach der Fertigstellung bleiben wir erreichbar.' },
    ],
    ctaLabel: 'Projekt besprechen',
  },
  {
    slug: 'bauelemente',
    name: 'Bauelemente',
    cluster: 'gebaeude',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Bauelemente — individuelle Lösungen für Bau und Renovierung',
    seoDescription:
      'Bauelemente und individuelle Lösungen für Bau- und Renovierungsprojekte, abgestimmt auf das Gesamtvorhaben. Energie Zentrum Saar.',
    h1: 'Bauteile, die zum Vorhaben passen.',
    intro:
      'Fenster, Türen und andere Bauelemente entscheiden mit darüber, wie viel Energie ein Gebäude verliert. Wir wählen sie deshalb nicht aus dem Katalog, sondern passend zum energetischen Gesamtbild Ihres Projekts.',
    umfang: [
      { titel: 'Auswahl', text: 'Bauelemente, die zum Zustand und zum Ziel des Gebäudes passen.' },
      { titel: 'Individuelle Lösungen', text: 'Auch dort, wo Standardmaße nicht funktionieren.' },
      { titel: 'Einbindung ins Projekt', text: 'Abgestimmt mit dem übrigen Bauvorhaben statt isoliert bestellt.' },
    ],
    ctaLabel: 'Beratung anfragen',
  },
  {
    slug: 'hausverwaltung',
    name: 'Hausverwaltung',
    cluster: 'immobilien',
    zielgruppe: 'Privat & Gewerbe',
    seoTitle: 'Hausverwaltung im Saarland — Betreuung und Energieoptimierung',
    seoDescription:
      'Professionelle Immobilienbetreuung: Wartung und Instandhaltung, Koordination von Reparaturen, Berichterstattung, Eigentümerversammlungen und Energieoptimierung.',
    h1: 'Verwaltung, die den Energieverbrauch mitdenkt.',
    intro:
      'Die meisten Verwaltungen kümmern sich um das Nötige. Weil Energie unser eigentliches Thema ist, sehen wir bei jeder Immobilie zusätzlich dort hin, wo laufende Kosten entstehen — und sagen Ihnen, was sich ändern ließe.',
    umfang: [
      { titel: 'Laufende Betreuung', text: 'Professionelle Verwaltung Ihrer Immobilie.' },
      { titel: 'Energieoptimierung', text: 'Wir prüfen laufend, wo sich Verbrauch und Kosten senken lassen.' },
      { titel: 'Wartung und Instandhaltung', text: 'Planbare Maßnahmen statt Reaktion auf Schäden.' },
      { titel: 'Koordination von Reparaturen', text: 'Handwerker und Termine laufen über uns.' },
      { titel: 'Berichterstattung', text: 'Sie bekommen einen nachvollziehbaren Überblick.' },
      { titel: 'Eigentümerversammlungen', text: 'Vorbereitung, Durchführung und Nachbereitung.' },
    ],
    ctaLabel: 'Verwaltung anfragen',
    faq: [
      {
        frage: 'Was unterscheidet Sie von einer klassischen Hausverwaltung?',
        antwort:
          'Energie ist unser Ausgangsthema. Wir verwalten die Immobilie nicht nur, sondern sehen zusätzlich dort hin, wo laufende Energiekosten entstehen und was sich daran ändern ließe.',
      },
    ],
  },
];

export function leistungNachSlug(slug: string): Leistung | undefined {
  return leistungen.find((l) => l.slug === slug);
}

export function leistungenNachCluster(clusterId: string): Leistung[] {
  return leistungen.filter((l) => l.cluster === clusterId);
}
