# -*- coding: utf-8 -*-
"""Inhalte der RuhrCargo-Website. Einzige Quelle für alle Seitentexte."""

SITE = {
    "name": "RuhrCargo GmbH",
    "legal_name": "RuhrCargo GmbH",
    "claim": "Ihre Ware. Unser Auftrag.",
    # EINZIGE Stelle für die ausgelieferte Domain. Sie steuert Canonicals,
    # Sitemap, robots.txt und Open Graph.
    #
    # WICHTIG: Hier muss immer die Adresse stehen, unter der die Seite
    # tatsächlich erreichbar ist. Ein Canonical auf eine noch nicht
    # verbundene Domain sagt Google, es solle die ausgelieferten Seiten
    # ignorieren — genau das hatte der SEO-Check als Fehler gemeldet.
    #
    # UMSTELLUNG AUF DIE EIGENE DOMAIN: sobald www.ruhrcargo.net auf das
    # Vercel-Projekt zeigt, die nächste Zeile durch
    #     "domain": "https://www.ruhrcargo.net",
    # ersetzen, `python3 tools/build.py` laufen lassen und deployen.
    "domain": "https://ruhrcargo10.vercel.app",
    # Kurzform für die allgemeine Nennung auf der Seite.
    "ceo": "M. Arik",
    # ACHTUNG: § 5 DDG verlangt den Vertretungsberechtigten im Impressum so,
    # dass er eindeutig identifizierbar ist. Abgekürzte Vornamen werden von
    # Gerichten regelmäßig beanstandet. Impressum und § 18 MStV nutzen deshalb
    # weiter den vollen Namen. Soll auch dort abgekürzt werden, hier ändern —
    # dann aber im Wissen um das Abmahnrisiko.
    "ceo_legal": "Melih Arik",
    "email": "info@ruhrcargo.net",
    "street": "Florianstraße 15-21",
    "zip": "44139",
    "city": "Dortmund",
    "region": "Nordrhein-Westfalen",
    "court": "Amtsgericht Dortmund",
    "hrb": "HRB 38662",
    # TODO:TELEFON — vom Kunden noch nicht geliefert. § 5 DDG verlangt eine
    # Telefonnummer. Bis dahin Platzhalter; bewusst NICHT in den strukturierten
    # Daten, damit Google keine falsche Nummer ausliefert.
    "phone_display": "+49 (0) 231 000 00 00",
    "phone_href": "+492310000000",
    "phone_is_placeholder": True,
    # TODO:ZEITEN — vom Kunden nicht bestätigt, daher nicht in den strukturierten Daten
    "hours": "Mo – Fr, 07:00 – 18:00 Uhr",
    "hours_is_placeholder": True,
}


# ── Leistungen ────────────────────────────────────────────────────────────
SERVICES = [
 {
  "slug": "neumoebel-lieferung", "cta": "Möbel zu liefern?",
  "seo_title": "Neumöbel-Lieferung & Möbeltransport | RuhrCargo",
  "seo_desc": "Neumöbel liefern lassen: Wir transportieren Möbel vom Lager bis zur Wunschadresse – im Möbelkoffer, gesichert, nach Terminabsprache. Jetzt anfragen.", "short": "Möbel vom Lager bis in die Wohnung", "nav": "Neumöbel", "title": "Neumöbel",
  "icon": "i-sofa", "num": "01", "img": "ruhrcargo-neumoebel-lieferung",
  "img_alt": "Zwei Mitarbeiter tragen ein verpacktes Sofa in einen Wohnraum",
  "teaser": "Empfindliche Neuware vom Lager bis zur Wunschadresse – sorgfältig verladen, sauber zugestellt.",
  "lead": "Neuware verzeiht keine Kratzer. Wir bringen Möbel vom Hersteller oder Lager bis zur Wunschadresse, zum vereinbarten Termin und ohne Umweg über ein fremdes Lager.",
  "body": [
    "Möbel sind sperrig und empfindlich, und ein Kratzer sieht man sofort. Teuer wird ein Transportschaden trotzdem weniger durch den Schaden selbst als durch alles, was danach kommt: Reklamation, Ersatzteil, zweiter Anlauf. Deshalb fahren wir Neuware so, dass sie beim ersten Mal ankommt.",
    "Wir fahren für Möbelhäuser, Hersteller und Innenausstatter genauso wie für Privatkunden, die ihre Neuanschaffung nicht selbst transportieren wollen. Vom einzelnen Sessel bis zur kompletten Einrichtung.",
  ],
  "does": [
    "Abholung beim Hersteller, Lager oder Händler",
    "Ladungssicherung für empfindliche Oberflächen",
    "Transport im Möbelkoffer mit großem Ladevolumen",
    "Zustellung nach fester Terminabsprache",
    "Einzelstücke ebenso wie komplette Einrichtungen",
    "Feste Ansprechpartner von der Anfrage bis zur Lieferung",
  ],
  "who": ["Möbelhäuser und Fachhandel", "Hersteller und Zulieferer",
          "Innenausstatter und Raumausstatter", "Privatkunden mit Neuanschaffungen"],
  "vehicles": ["Möbelkoffer", "Koffer-LKW"],
  "faq": [
    ("Transportieren Sie auch einzelne Möbelstücke?",
     "Ja. Vom einzelnen Sessel bis zur kompletten Einrichtung. Sagen Sie uns, was zu transportieren ist – wir wählen das passende Fahrzeug dazu aus."),
    ("Wie wird die Ware gegen Schäden gesichert?",
     "Empfindliche Oberflächen werden abgedeckt, die Ladung im Fahrzeug so verzurrt, dass nichts verrutscht. Verpackte Neuware bleibt in ihrer Originalverpackung."),
    ("Können Sie in obere Etagen liefern?",
     "Sprechen Sie uns bei der Anfrage darauf an. Zugang, Etage und Treppenhaus klären wir vorab, damit vor Ort nichts improvisiert werden muss."),
  ],
  "related": ["umzuege", "elektrogeraete-lieferung", "stueckguttransport"],
 },
 {
  "slug": "elektrogeraete-lieferung", "cta": "Geräte zu liefern?",
  "seo_title": "Elektrogeräte liefern lassen | RuhrCargo Spedition",
  "seo_desc": "Waschmaschine, Kühlschrank, Fernseher: Wir liefern Elektrogeräte und weiße Ware mit Ladebordwand – für Fachhandel und Privatkunden. Jetzt anfragen.", "short": "Weiße Ware und Elektronik", "nav": "Elektrogeräte", "title": "Elektrogeräte",
  "icon": "i-appliance", "num": "02", "img": "ruhrcargo-elektrogeraete-lieferung",
  "img_alt": "Mitarbeiter schiebt eine Waschmaschine über die Rampe in den Transporter",
  "teaser": "Weiße Ware und Elektronik sicher gesichert, sicher verladen und termingerecht zugestellt.",
  "lead": "Waschmaschine, Kühlschrank, Fernseher: Elektrogeräte sind schwer, empfindlich und schlecht zu greifen. Wir transportieren sie so, dass sie funktionsfähig ankommen.",
  "body": [
    "Weiße Ware verträgt weder harte Stöße noch falsche Lage. Wir sichern jedes Gerät einzeln, transportieren es aufrecht, wo das nötig ist, und stellen es am Ziel dort ab, wo es hingehört.",
    "Für den Fachhandel übernehmen wir wiederkehrende Touren zu Filialen und Endkunden. Für Privatkunden fahren wir Einzelgeräte – auch dann, wenn der Händler keine Lieferung anbietet.",
  ],
  "does": [
    "Einzelgeräte und komplette Filialbelieferungen",
    "Transportsicherung für empfindliche Technik",
    "Transport mit Ladebordwand statt Tragen über Bordkante",
    "Feste Touren für den Fachhandel auf Wunsch",
    "Zustellung nach Terminabsprache",
    "Abholung direkt beim Hersteller oder Großhandel",
  ],
  "who": ["Elektrofachhandel und Filialisten", "Küchenstudios",
          "Hersteller und Großhandel", "Privatkunden"],
  "vehicles": ["Koffer-LKW", "Kleintransporter"],
  "faq": [
    ("Übernehmen Sie auch wiederkehrende Filialbelieferungen?",
     "Ja. Feste Touren lassen sich planen und sind für beide Seiten kalkulierbar. Sprechen Sie uns auf Ihren Rhythmus an."),
    ("Wird das Gerät bis in die Wohnung gebracht?",
     "Das klären wir bei der Anfrage. Zugang, Etage und Stellplatz gehören zur Planung, damit vor Ort alles vorbereitet ist."),
    ("Was passiert bei einem Transportschaden?",
     "Wir dokumentieren die Übergabe. Melden Sie einen Schaden bitte direkt bei der Anlieferung, dann klären wir das Weitere unmittelbar mit Ihnen."),
  ],
  "related": ["neumoebel-lieferung", "stueckguttransport", "kurierdienst"],
 },
 {
  "slug": "stueckguttransport", "cta": "Stückgut zu transportieren?",
  "seo_title": "Stückguttransport | RuhrCargo Spedition Dortmund",
  "seo_desc": "Stückguttransport ohne Umladung: von der Einzelpalette bis zur Teilladung, im Direktverkehr ab Dortmund deutschlandweit. Jetzt unverbindlich anfragen.", "short": "Paletten, Kisten, Einzelsendungen", "nav": "Stückgut", "title": "Stückgut",
  "icon": "i-pallet", "num": "03", "img": "ruhrcargo-stueckguttransport",
  "img_alt": "Gabelstapler setzt eine folierte Palette im Lager ab",
  "teaser": "Paletten, Kisten und Einzelsendungen – flexibel gebündelt und deutschlandweit unterwegs.",
  "lead": "Von der Einzelpalette bis zur Teilladung: Wir bündeln Ihre Sendungen, planen die Route und liefern deutschlandweit – ohne Umweg über fremde Umschlagzentren.",
  "body": [
    "Stückgut über ein großes Netzwerk zu verschicken heißt: mehrfaches Umladen, viele Hände, wenig Kontrolle. Wir fahren stattdessen direkt. Ihre Palette wird einmal verladen und einmal abgeladen.",
    "Das ist besonders dann von Vorteil, wenn die Ware empfindlich ist, der Termin eng oder die Sendung zu groß für den Paketdienst und zu klein für eine Komplettladung.",
  ],
  "does": [
    "Einzelpaletten bis zur Teilladung",
    "Gitterboxen, Kisten und sperrige Einzelstücke",
    "Direktverkehr ohne Umladung",
    "Deutschlandweite Zustellung ab dem Ruhrgebiet",
    "Be- und Entladung per Gabelstapler oder Ladebordwand",
    "Feste Ansprechpartner in der Disposition",
  ],
  "who": ["Industrie und Produktion", "Groß- und Fachhandel",
          "Zulieferer", "Handwerksbetriebe"],
  "vehicles": ["Koffer-LKW", "Kleintransporter"],
  "faq": [
    ("Ab welcher Menge lohnt sich der Direktverkehr?",
     "Schon ab einer Palette, wenn Termin oder Empfindlichkeit der Ware im Vordergrund stehen. Wir sagen Ihnen ehrlich, wann eine andere Lösung günstiger ist."),
    ("Können Sie mehrere Empfänger auf einer Tour beliefern?",
     "Ja, das ist der Regelfall. Wir planen die Route so, dass die Reihenfolge zu Ihren Zeitfenstern passt."),
    ("Brauchen wir am Ziel einen Stapler?",
     "Nicht zwingend. Sagen Sie uns bei der Anfrage, wie am Empfangsort entladen werden kann – danach wählen wir das Fahrzeug aus."),
  ],
  "related": ["elektrogeraete-lieferung", "kurierdienst", "neumoebel-lieferung"],
 },
 {
  "slug": "kurierdienst", "cta": "Muss es heute noch ankommen?",
  "seo_title": "Kurierdienst & Direktfahrten | RuhrCargo",
  "seo_desc": "Kurierfahrt mit Direktzustellung: ein Fahrzeug, eine Ladung, ein Ziel – ohne Umladen, deutschlandweit und kurzfristig. Jetzt unverbindlich anfragen.", "short": "Direktfahrt ohne Umladung", "nav": "Kurierfahrten", "title": "Kurierfahrten",
  "icon": "i-bolt", "num": "04", "img": "ruhrcargo-kurierdienst",
  "img_alt": "Kurierfahrer bringt eine Sendung zu einem Bürogebäude, Transporter am Straßenrand",
  "teaser": "Direktfahrten, wenn es schnell gehen muss: ein Fahrzeug, eine Ladung, ein Ziel.",
  "lead": "Wenn ein Termin steht und die Sendung nicht warten kann: Ein Fahrzeug, eine Ladung, ein Ziel. Ohne Zwischenstopp, ohne Umladen.",
  "body": [
    "Die Direktfahrt ist die schnellste Form des Transports, weil sie die üblichen Zwischenschritte auslässt. Ihre Sendung wird bei Ihnen geladen und beim Empfänger abgeladen – dazwischen passiert nichts.",
    "Das ist die richtige Lösung für Ersatzteile, die eine Produktion am Laufen halten, für Unterlagen, die zu einem Termin vorliegen müssen, und für alles, wo ein verpasster Tag teurer ist als die Fahrt.",
  ],
  "does": [
    "Direktfahrt ohne Umladung und Zwischenlager",
    "Kurzfristige Beauftragung möglich",
    "Einzelsendungen bis zur Transporterladung",
    "Deutschlandweit, auch über Nacht geplant",
    "Feste Ansprechpartner während der Fahrt",
    "Auch für empfindliche und dokumentenpflichtige Ware",
  ],
  "who": ["Produktion und Instandhaltung", "Handel und Fachhandel",
          "Agenturen und Dienstleister", "Sanitätshäuser und Praxen"],
  "vehicles": ["Kleintransporter", "Koffer-LKW"],
  "faq": [
    ("Wie kurzfristig können Sie fahren?",
     "Das hängt davon ab, welches Fahrzeug frei ist. Rufen Sie an – am Telefon können wir Ihnen am schnellsten sagen, was heute noch machbar ist."),
    ("Fahren Sie auch nachts oder am Wochenende?",
     "Sprechen Sie uns auf Ihren Termin an. Was möglich ist, hängt von Strecke und Verfügbarkeit ab, und das klären wir vorab und verbindlich."),
    ("Wie groß darf eine Direktfahrt-Sendung sein?",
     "Von der Dokumentenmappe bis zur vollen Transporterladung ist alles möglich. Bei größeren Mengen setzen wir ein entsprechend größeres Fahrzeug ein."),
  ],
  "related": ["stueckguttransport", "elektrogeraete-lieferung", "umzuege"],
 },
{
  "slug": "umzuege", "cta": "Umzug steht an?",
  "seo_title": "Umzug privat & gewerblich | RuhrCargo Dortmund",
  "seo_desc": "Umzug mit Spedition: Wir planen den Ablauf, stellen das Fahrzeug und bringen Hausrat oder Büro ans neue Ziel – privat und gewerblich. Jetzt anfragen.", "short": "Privat und gewerblich", "nav": "Umzüge", "title": "Umzüge",
  "icon": "i-home", "num": "06", "img": "ruhrcargo-umzug",
  "img_alt": "Mitarbeiter tragen eine Matratze durch ein Treppenhaus",
  "teaser": "Privat oder gewerblich: geplant, verladen, angekommen. Ohne dass Sie sich kümmern müssen.",
  "lead": "Vom Apartment bis zum Firmenstandort: Wir planen den Ablauf, stellen das passende Fahrzeug und bringen Ihren Hausrat oder Ihr Büro ans neue Ziel.",
  "body": [
    "Ein Umzug scheitert selten am Fahren. Er scheitert an der Planung: am zu kleinen Fahrzeug, am fehlenden Halteverbot, am Treppenhaus, das niemand vorher angesehen hat.",
    "Deshalb klären wir vorab, was tatsächlich zu bewegen ist und wie die Zugänge an beiden Adressen aussehen. Am Umzugstag geht es dann nur noch ums Tragen und Fahren.",
  ],
  "does": [
    "Private und gewerbliche Umzüge",
    "Fahrzeug passend zum tatsächlichen Volumen",
    "Verladen und Transport durch erfahrenes Personal",
    "Termin nach Ihrem Zeitplan",
    "Einzelne Möbelstücke bis zur kompletten Wohnung",
    "Vorabklärung von Zugang, Etage und Stellplatz",
  ],
  "who": ["Privathaushalte", "Büros und Praxen",
          "Filialen bei Standortwechsel", "Studierende und Einzelumzüge"],
  "vehicles": ["Möbelkoffer", "Koffer-LKW", "Kleintransporter"],
  "faq": [
    ("Wie finde ich heraus, welches Fahrzeug ich brauche?",
     "Das übernehmen wir. Sagen Sie uns grob, was mitkommt: Zimmerzahl, große Möbelstücke, Besonderheiten. Dann schlagen wir die passende Größe vor."),
    ("Übernehmen Sie auch Firmenumzüge?",
     "Ja. Büros, Praxen und Filialen ziehen meist außerhalb der Geschäftszeiten um. Den Termin richten wir danach aus."),
    ("Was ist mit besonders schweren Einzelstücken?",
     "Sagen Sie uns vorher Bescheid, etwa bei Klavier, Tresor oder Großgeräten. Dann planen wir Personal und Hilfsmittel entsprechend ein."),
  ],
  "related": ["entruempelung", "neumoebel-lieferung", "elektrogeraete-lieferung"],
 },
{
  "slug": "entruempelung", "cta": "Etwas zu räumen?",
  "seo_title": "Entrümpelung Dortmund & Ruhrgebiet | RuhrCargo",
  # TODO:ENTSORGUNG — Ob RuhrCargo als Beförderer von Abfällen nach § 53 KrWG
  # angezeigt ist, wurde nicht bestätigt. Deshalb steht hier bewusst nichts
  # über Entsorgungsnachweise, Zertifikate oder eine eigene Deponie.
  "seo_desc": "Entrümpelung in Dortmund und im Ruhrgebiet: Wohnung, Keller, Garage oder Büro leerräumen. Wir tragen raus und fahren weg. Jetzt anfragen.", "short": "Wohnung, Keller und Büro leerräumen", "nav": "Entrümpelung", "title": "Entrümpelung",
  "icon": "i-clear", "num": "06", "img": "ruhrcargo-entruempelung",
  "img_alt": "Zwei Mitarbeiter von RuhrCargo tragen ein Sofa aus einer Haustür",
  "teaser": "Wohnung, Keller, Garage oder Büro: Wir räumen leer, tragen heraus und fahren ab.",
  "lead": "Wohnung, Keller, Dachboden oder Büro leerräumen – wir tragen heraus und nehmen mit, was weg soll. Sie müssen dabei nichts anfassen.",
  "body": [
    "Entrümpelt wird selten aus freien Stücken. Meistens drückt ein Termin: die Wohnungsübergabe, der Verkauf, das Ende des Mietvertrags, ein Nachlass, den jemand regeln muss. Dann zählt, dass genug Leute kommen und das Fahrzeug groß genug ist. Beides planen wir vorher, nicht vor Ort.",
    "Was weg soll, sehen wir uns vorher an. Bei einem Keller reicht meistens ein Telefonat, bei einer ganzen Wohnung kommen wir vorbei. Danach wissen Sie, wie viele Leute anrücken, wie lange es dauert und was es kostet. Und was stehen bleiben soll, bleibt stehen – sagen Sie uns einfach, was.",
  ],
  "does": [
    "Wohnungen, Keller, Dachböden und Garagen leerräumen",
    "Büros, Praxen und Lagerflächen räumen",
    "Heraustragen auch aus oberen Etagen ohne Aufzug",
    "Abtransport mit eigenen Fahrzeugen",
    "Besichtigung vorab, damit der Preis vorher feststeht",
    "Aussortieren, was Sie behalten möchten",
  ],
  "who": ["Privathaushalte vor Übergabe oder Umzug", "Angehörige bei einer Haushaltsauflösung",
          "Vermieter und Hausverwaltungen", "Büros und Praxen bei Umbau oder Schließung"],
  "vehicles": ["Möbelkoffer", "Koffer-LKW", "Kleintransporter"],
  "faq": [
    ("Was kostet eine Entrümpelung?",
     "Das hängt an der Menge, am Zugang und an der Etage. Eine Zahl ins Blaue hinein hilft Ihnen nicht weiter. Wir sehen uns vorher an, was weg soll, und nennen Ihnen dann einen Preis, der auch hält."),
    ("Muss ich vorher selbst aussortieren?",
     "Nein. Sagen Sie uns, was bleiben soll – das stellen wir beiseite. Den Rest räumen wir."),
    ("Räumen Sie auch einzelne Räume?",
     "Ja. Ein Keller, eine Garage oder ein einzelnes Zimmer ist für uns genauso ein Auftrag wie eine komplette Wohnung."),
    ("Wie kurzfristig geht das?",
     "Das hängt davon ab, wie die Woche aussieht. Wenn es eilt, sagen Sie das gleich bei der Anfrage – dann schauen wir zuerst, was sich einschieben lässt."),
  ],
  "related": ["umzuege", "neumoebel-lieferung", "stueckguttransport"],
 },
]

SERVICE_BY_SLUG = {s["slug"]: s for s in SERVICES}

# ── Fuhrpark ──────────────────────────────────────────────────────────────
FLEET = [
{"slug": "kofferlkw", "img": "ruhrcargo-koffer-lkw", "wide": False,
  "label": "Klasse 02 · Mit Ladebordwand", "name": "Koffer-LKW",
  "alt": "Koffer-LKW von RuhrCargo mit ausgefahrener Ladebordwand beim Verladen eines Elektrogeräts",
  "tags": ["Elektrogeräte", "Neumöbel", "Stückgut"],
  "text": "Geschlossener Koffer mit Ladebordwand. Damit lässt sich schwere Ware ebenerdig verladen, ohne sie über die Bordkante zu heben – der Standard für Geräte und Möbel.",
  "specs": [("Einsatz", "Geräte, Möbel, empfindliche Ware"),
            ("Beladung", "Ladebordwand"),
            ("Besonderheit", "Wettergeschützter Koffer")]},
 {"slug": "moebelkoffer", "img": "ruhrcargo-moebelkoffer", "wide": False,
  "label": "Klasse 03 · Volumen", "name": "Möbelkoffer",
  "alt": "Zwei Mitarbeiter verladen ein verpacktes Möbelstück über die Ladebordwand",
  "tags": ["Neumöbel", "Umzüge", "Entrümpelung"],
  "text": "Großes Ladevolumen bei geringem Gewicht der Ladung. Das Fahrzeug für Möbel, Umzüge und Entrümpelungen, wo es weniger auf Tonnen als auf Kubikmeter ankommt.",
  "specs": [("Einsatz", "Möbel, Umzugsgut, Räumgut"),
            ("Beladung", "Ladebordwand"),
            ("Besonderheit", "Maximales Volumen")]},
 {"slug": "transporter", "img": "ruhrcargo-kleintransporter", "wide": True,
  "label": "Klasse 04 · Wendig", "name": "Kleintransporter",
  "alt": "Kleintransporter von RuhrCargo mit geöffneten Hecktüren bei einer Zustellung",
  "tags": ["Kurierfahrten", "Direktfahrt", "Stückgut"],
  "text": "Kommt dorthin, wo größere Fahrzeuge nicht mehr hinkommen: enge Innenstadt, Hinterhof, Tiefgarage. Das Fahrzeug für Direktfahrten und Einzelzustellungen.",
  "specs": [("Einsatz", "Direktfahrten und Einzelsendungen"),
            ("Beladung", "Heck- und Seitentüren, Rampe"),
            ("Besonderheit", "Innenstadttauglich")]},
]

# ── Prozess ───────────────────────────────────────────────────────────────
STEPS = [
 ("01", "Anfrage", "Schnelle Rückmeldung",
  "Sie schildern uns Ladung, Strecke und Wunschtermin – telefonisch oder über das Formular.",
  ["Was transportiert wird, mit ungefähren Maßen und Gewicht",
   "Wo abgeholt und wo zugestellt werden soll",
   "Wann die Ware am Ziel sein muss",
   "Besonderheiten: Etage, Zufahrt, Zeitfenster"]),
 ("02", "Planung", "Disposition",
  "Wir wählen Fahrzeug, Route und Zeitfenster – und stimmen jedes Detail mit Ihnen ab.",
  ["Auswahl des passenden Fahrzeugs zur Ladung",
   "Routenplanung und realistische Zeitfenster",
   "Abstimmung von Zugang und Entlademöglichkeit",
   "Verbindliche Rückmeldung, bevor etwas losfährt"]),
 ("03", "Umsetzung", "Transport",
  "Verladen, gesichert, unterwegs. Ihr Ansprechpartner bleibt derselbe – von Start bis Ziel.",
  ["Fachgerechtes Verladen und Sichern der Ware",
   "Direktfahrt ohne unnötiges Umladen",
   "Erreichbarkeit während der Fahrt",
   "Rückmeldung bei Abweichungen, bevor Sie fragen müssen"]),
 ("04", "Lieferung", "Zustellung",
  "Termingerechte Zustellung am Ziel – sauber abgewickelt und vollständig dokumentiert.",
  ["Zustellung zum vereinbarten Termin",
   "Übergabe an den benannten Empfänger",
   "Dokumentation der Anlieferung",
   "Rückmeldung an Sie, dass die Ware angekommen ist"]),
]

REASONS = [
 ("01", "Zuverlässig", "Zugesagte Termine sind zugesagt. Ihre Ware kommt an – vollständig und unbeschädigt.",
  "Ein Transport ist erst dann gut gelaufen, wenn niemand darüber sprechen musste. Wir planen so, dass Zusagen halten, und melden uns von selbst, wenn sich etwas ändert."),
 ("02", "Flexibel", "Kurzfristige Anfrage, ungewöhnliche Ladung, enges Zeitfenster: Wir finden den Weg.",
  "Weil wir unsere Fahrzeuge selbst disponieren, können wir umplanen, ohne durch drei Instanzen zu gehen. Was möglich ist, sagen wir Ihnen sofort – und was nicht, ebenso."),
 ("03", "Spezialisiert", "Wir fahren die Ladungsarten, bei denen es auf Umsicht ankommt.",
  "Ein Sofa durch ein enges Treppenhaus zu bekommen und eine Waschmaschine so zu sichern, dass sie nicht verrutscht, sind zwei verschiedene Handgriffe. Darauf ist unser Personal eingestellt und danach ist der Fuhrpark zusammengestellt."),
 ("04", "Persönlich", "Kein Callcenter, keine Warteschleife. Sie erreichen die Menschen, die planen und fahren.",
  "Bei uns spricht man mit der Person, die den Auftrag auch disponiert. Das spart Erklärungsschleifen und sorgt dafür, dass Details nicht auf dem Weg verloren gehen."),
]

SECTORS = ["Möbelhandel", "Elektrofachhandel", "Industrie & Produktion",
           "Handwerk", "Büros & Praxen", "Privatkunden"]
