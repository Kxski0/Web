# -*- coding: utf-8 -*-
"""Die beiden Leistungsseiten. Hier liegt der ausfuehrliche Text, den die
Startseite bewusst nicht traegt."""
from parts import (SITE, ARROW, CHECK, img, sub_hero, cta_band, page, esc,
                   breadcrumb_schema, faq_schema, service_schema, graph)


def _steps(items):
    return "".join(
        '<li class="step" data-rise><span class="step-num mono">0%d</span>'
        '<span class="step-h">%s</span><p>%s</p></li>' % (i + 1, esc(t), esc(d))
        for i, (t, d) in enumerate(items))


def _checklist(items):
    return '<ul class="checklist" role="list">%s</ul>' % "".join(
        '<li>%s<span>%s</span></li>' % (CHECK, esc(t)) for t in items)


# ══ WEBDESIGN ════════════════════════════════════════════════════════════════
WEBDESIGN_FAQ = [
    ("Bekomme ich einen Entwurf, bevor ich mich entscheide?",
     "Du bekommst nach dem Konzeptgespraech eine Seitenstruktur und einen "
     "gestalteten Startseitenentwurf. Erst wenn der passt, geht es weiter. "
     "Diesen Schritt berechnen wir separat, damit du nicht an ein "
     "Gesamtpaket gebunden bist, das dir nicht gefaellt."),
    ("Kann ich die Inhalte danach selbst pflegen?",
     "Ja, wenn du willst. Wir klaeren vorher, wie oft du wirklich etwas "
     "aenderst. Bei zwei Aenderungen im Jahr ist ein Redaktionssystem "
     "unnoetiger Ballast, bei woechentlichen Beitraegen bekommst du eines."),
    ("Was passiert mit meiner alten Website?",
     "Die bleibt erreichbar, bis die neue steht. Zum Livegang leiten wir alle "
     "alten Adressen auf die passende neue Seite um, damit weder Besucher "
     "noch Suchmaschinen ins Leere laufen und bestehende Verweise ihren Wert "
     "behalten."),
    ("Gehoert mir die Seite danach wirklich?",
     "Ja. Du bekommst alle Zugaenge, den Quellcode und die Bilddateien. Es "
     "gibt keine Lizenz, die dich an uns bindet, und keinen Baukasten, den du "
     "monatlich weiterzahlen musst, damit die Seite online bleibt."),
]


def webdesign():
    trail = [("Start", "/"), ("Webdesign", "/webdesign/")]
    body = []

    body.append(sub_hero(
        "Webdesign, das aus deinen Inhalten entsteht",
        "Kein Theme, keine Vorlage, kein Baukasten. Wir bauen die Struktur "
        "aus dem, was du zu sagen hast, und gestalten sie danach.",
        "skizze",
        "Hand zeichnet ein Seitenraster ins Skizzenbuch, im Hintergrund ein "
        "Monitor mit Entwuerfen.",
        trail))

    body.append("""
<main id="inhalt">
<section class="section">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Das Problem</p>
      <h2 data-rise>Vorlagen lösen das falsche Problem.</h2>
    </div>
    <div data-rise>
      <p>
        Ein Theme ist dafür gemacht, für möglichst viele Unternehmen halbwegs
        zu passen. Genau deshalb passt es für keines richtig. Der Aufbau steht
        fest, bevor jemand deine Kunden gefragt hat, und du füllst am Ende Text
        in Kästen, die für ein anderes Geschäft entworfen wurden.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Das fällt selten sofort auf. Die Seite sieht ordentlich aus, sie ist
        schnell fertig, sie kostet wenig. Auffallen tut es später: Besucher
        springen ab, weil sie die Antwort auf ihre Frage nicht finden.
        Anfragen bleiben aus, weil der nächste Schritt nirgends steht. Und
        ändern lässt sich nur, was das Theme vorsieht.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Wir drehen die Reihenfolge um. Zuerst klären wir, wer auf der Seite
        landet, was diese Person wissen muss und welchen Schritt sie danach
        gehen soll. Daraus entsteht die Struktur. Erst dann wird gestaltet.
        Das dauert am Anfang länger und spart hinterher die Runde, in der
        alles noch einmal umgebaut wird.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>Ablauf</p>
      <h2 data-rise>Vier Schritte bis zur fertigen Seite.</h2>
    </div>
    <ol class="steps" role="list">%s</ol>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div>%s</div>
    <div>
      <div class="head">
        <p class="eyebrow mono" data-rise>Technik</p>
        <h2 data-rise>Schnell, bedienbar, auffindbar.</h2>
      </div>
      <p data-rise>
        Eine Seite, die drei Sekunden lädt, verliert einen Teil ihrer Besucher,
        bevor sie überhaupt etwas gelesen haben. Deshalb ist Geschwindigkeit
        bei uns kein Extra, sondern Teil der Bauweise. Wir liefern Bilder in
        modernen Formaten aus, laden nur, was gebraucht wird, und verzichten
        auf Bibliotheken, die wir nicht wirklich brauchen.
      </p>
      <p data-rise style="margin-block-start:var(--space-4)">
        Dasselbe gilt für Bedienbarkeit. Die Seite muss sich mit der Tastatur
        bedienen lassen, Kontraste müssen stimmen, Bilder brauchen
        Beschreibungen. Das hilft nicht nur Menschen mit Einschränkung, es ist
        auch die Grundlage dafür, dass Suchmaschinen die Seite verstehen.
      </p>
      <div style="margin-block-start:var(--space-6)" data-rise>%s</div>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Für wen</p>
      <h2 data-rise>Passt das zu dir?</h2>
    </div>
    <div data-rise>
      <p>
        Wir arbeiten am liebsten mit Betrieben, die etwas Konkretes anbieten
        und wissen, wofür sie stehen. Handwerk, Praxen, Kanzleien,
        Manufakturen, Dienstleister mit einem klaren Einzugsgebiet. Also
        überall dort, wo eine Anfrage echtes Geld wert ist und es sich lohnt,
        über den Weg dorthin nachzudenken.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Weniger gut passen wir, wenn es sehr schnell und sehr günstig gehen
        soll. Für eine einfache Seite mit drei Unterseiten und wenig Anspruch
        an Struktur und Sichtbarkeit gibt es günstigere Wege, und wir sagen
        dir das auch, statt dir etwas zu verkaufen, das du nicht brauchst.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Was du mitbringen solltest: jemanden, der Entscheidungen treffen darf,
        und die Bereitschaft, uns beim Konzept ehrlich zu antworten. Inhalte
        müssen nicht fertig sein. Beim Schreiben und beim Auswählen der Bilder
        helfen wir, das ist Teil der Arbeit.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Bilder sind dabei oft der wunde Punkt. Ein guter Auftritt trägt keine
        Bildagenturmotive, die auf zehn anderen Seiten derselben Branche
        stehen. Wenn eigene Aufnahmen fehlen, planen wir einen Fototermin ein
        oder suchen einen Weg, der ohne Menschenbilder auskommt. Beides ist
        besser als ein lächelndes Team, das nicht deins ist.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>Häufige Fragen</p>
      <h2 data-rise>Was Kunden vorher wissen wollen.</h2>
    </div>
    <div class="steps">%s</div>
  </div>
</section>
</main>
""" % (
        _steps([
            ("Konzept",
             "Wir klären, wer auf der Seite landen soll und was diese Person "
             "braucht. Daraus entsteht die Seitenstruktur: welche Seiten es "
             "gibt, was worauf folgt und welche Suchanfragen dazu gehören."),
            ("Gestaltung",
             "Der Entwurf beginnt am Papier, weil sich dort schneller "
             "verwerfen lässt. Typografie, Raster und Bildsprache entstehen "
             "an deinen echten Inhalten, nicht an Blindtext."),
            ("Entwicklung",
             "Gestaltung und Code entstehen zusammen. Du siehst früh eine "
             "echte Seite im Browser, auf dem Handy wie am Rechner, und "
             "kannst sie anfassen statt nur ansehen."),
            ("Übergabe",
             "Ladezeit, Bedienbarkeit und die technische Seite von SEO werden "
             "geprüft, alte Adressen werden umgeleitet, dann geht die Seite "
             "live. Zugänge und Dateien gehören danach dir."),
        ]),
        img("kontaktbogen",
            "Ausgedruckte Seitenentwuerfe liegen zum Vergleich nebeneinander auf "
            "einem dunklen Tisch.",
            "(min-width:60rem) 42vw, 92vw", "4x5"),
        _checklist([
            "Bilder als AVIF und WebP in mehreren Größen, passend zum Gerät.",
            "Kein Framework, wo einfaches HTML reicht.",
            "Bedienbar mit Tastatur, sichtbarer Fokus, geprüfte Kontraste.",
            "Sauberes semantisches HTML als Grundlage für Suchmaschinen.",
            "Messbare Ladezeit statt Versprechen.",
        ]),
        "".join(
            '<div class="step" data-rise><span class="step-num mono">F%d</span>'
            '<span class="step-h">%s</span><p>%s</p></div>' % (i + 1, esc(q), esc(a))
            for i, (q, a) in enumerate(WEBDESIGN_FAQ)),
    ))

    body.append(cta_band(
        "Reden wir über deine Seite.",
        "Schick uns die Adresse deiner jetzigen Website und zwei Sätze dazu, "
        "was dich daran stört. Du bekommst eine ehrliche Einschätzung zurück."))

    schema = graph(
        breadcrumb_schema([("Start", "/"), ("Webdesign", "/webdesign/")]),
        service_schema("Webdesign",
                       "Individuelles Webdesign und Webentwicklung ohne Vorlage, "
                       "von der Struktur über die Gestaltung bis zum Livegang.",
                       "Webdesign"),
        faq_schema(WEBDESIGN_FAQ))

    return page(
        "webdesign",
        "Webdesign ohne Vorlage | %s" % SITE["brand"],
        "Individuelles Webdesign aus %s: Struktur aus deinen Inhalten, "
        "schnelle Ladezeiten, saubere Technik. Kein Theme, kein Baukasten." % SITE["city"],
        "".join(body), active="webdesign", schema=schema, og_image="skizze-1536.webp")


# ══ SEO ══════════════════════════════════════════════════════════════════════
SEO_FAQ = [
    ("Wie lange dauert es, bis SEO wirkt?",
     "Technische Korrekturen wirken oft innerhalb weniger Wochen. Bei "
     "Inhalten und Sichtbarkeit im Wettbewerb rechnest du mit drei bis sechs "
     "Monaten, bevor sich das stabil zeigt. Wer dir schnellere Ergebnisse "
     "garantiert, verkauft dir etwas anderes."),
    ("Garantiert ihr Platz eins bei Google?",
     "Nein, und niemand kann das seriös. Die Reihenfolge der Ergebnisse "
     "entscheidet Google, nicht wir. Wir koennen dafuer sorgen, dass deiner "
     "Seite technisch nichts im Weg steht und sie die Frage besser "
     "beantwortet als die anderen."),
    ("Kauft ihr Backlinks?",
     "Nein. Gekaufte Verweise aus Linknetzwerken sind ein Risiko fuer deine "
     "Domain und bringen selten dauerhaft etwas. Wir arbeiten mit "
     "Branchenverzeichnissen, echten Partnerschaften und Inhalten, die "
     "jemand freiwillig verlinkt."),
    ("Brauche ich SEO ueberhaupt?",
     "Nicht jeder. Wenn dein Geschaeft ueber Empfehlung laeuft und niemand "
     "nach deiner Leistung sucht, ist dein Geld woanders besser aufgehoben. "
     "Wir sehen uns das Suchvolumen vorher an und sagen dir, wenn es sich "
     "nicht rechnet."),
]


def seo():
    trail = [("Start", "/"), ("SEO", "/seo/")]
    body = []

    body.append(sub_hero(
        "SEO ohne Märchen",
        "Suchmaschinenoptimierung besteht aus Technik, Inhalten und "
        "Empfehlungen. Alles drei ist Handarbeit, nichts davon ist Magie.",
        "entwurf",
        "Auswertungen und Diagramme auf ausgedruckten Boegen neben einem Laptop.",
        trail))

    body.append("""
<main id="inhalt">
<section class="section">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Grundlage</p>
      <h2 data-rise>Drei Teile, mehr ist es nicht.</h2>
    </div>
    <div data-rise>
      <p>
        Um SEO wird viel Nebel gemacht, weil Nebel sich gut verkaufen lässt.
        Tatsächlich zerfällt die Arbeit in drei nüchterne Bereiche. Erstens
        die Technik: Kann eine Suchmaschine deine Seite überhaupt laden,
        lesen und einordnen. Zweitens der Inhalt: Beantwortet deine Seite die
        Frage, die jemand eingetippt hat, besser als die anderen Treffer.
        Drittens die Empfehlungen: Halten andere Seiten dich für zitierwürdig.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Wir fangen bei der Technik an, weil sie der einzige Teil ist, den du
        vollständig kontrollierst. Sie ist außerdem der Teil, bei dem sich am
        schnellsten etwas bewegt, wenn vorher etwas im Argen lag.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>Vorgehen</p>
      <h2 data-rise>Was wir tatsächlich tun.</h2>
    </div>
    <ol class="steps" role="list">%s</ol>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div>%s</div>
    <div>
      <div class="head">
        <p class="eyebrow mono" data-rise>Ehrlichkeit</p>
        <h2 data-rise>Was wir nicht machen.</h2>
      </div>
      <p data-rise>
        Wir kaufen keine Verweise in Linknetzwerken. Wir garantieren keine
        Platzierung, weil die Reihenfolge der Ergebnisse nicht bei uns liegt.
        Wir schreiben keine Texte, die für Suchmaschinen gemacht sind und für
        Menschen unlesbar. Und wir verkaufen niemandem ein Monatspaket, bei
        dem am Ende des Jahres niemand sagen kann, was es gebracht hat.
      </p>
      <p data-rise style="margin-block-start:var(--space-4)">
        Wenn dein Markt zu klein ist oder deine Kunden schlicht nicht suchen,
        sagen wir dir das im ersten Gespräch. Ein ehrliches Nein kostet uns
        einen Auftrag und dir nichts. Ein unehrliches Ja kostet dich ein Jahr.
      </p>
      <p data-rise style="margin-block-start:var(--space-4)">
        Messbar machen wir die Arbeit über die Zahlen, die du selbst
        nachprüfen kannst: Wie viele Menschen kommen über die Suche, über
        welche Begriffe, und wie viele davon melden sich. Alles andere sind
        Zwischengrößen, die gut aussehen und nichts über dein Geschäft sagen.
      </p>
      <p data-rise style="margin-block-start:var(--space-4)">
        Die Einrichtung dieser Messung gehört zum Projekt und nicht in ein
        Zusatzpaket. Ohne sie ist jede Aussage über Wirkung eine Behauptung.
      </p>
      <div style="margin-block-start:var(--space-6)" data-rise>%s</div>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Vor Ort</p>
      <h2 data-rise>Gefunden werden, wo du arbeitest.</h2>
    </div>
    <div data-rise>
      <p>
        Für die meisten Betriebe ist die überregionale Suche uninteressant.
        Wichtig ist, wer im eigenen Ort und im Umkreis sucht. Dafür zählen
        andere Dinge: ein vollständiges und gepflegtes Unternehmensprofil,
        einheitliche Angaben zu Name, Adresse und Telefonnummer über alle
        Verzeichnisse hinweg, echte Bewertungen und Seiten, die den Ort auch
        wirklich benennen, statt ihn nur in eine Fußzeile zu schreiben.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Das ist unspektakuläre Arbeit und sie wirkt oft schneller als alles
        andere. Wir prüfen die Einträge, räumen Widersprüche auf und bauen
        die Seiten so, dass jemand aus %s sofort erkennt, dass du für ihn
        erreichbar bist.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Dazu gehört auch, dass jede wichtige Leistung ihre eigene Seite
        bekommt. Wer nach einer bestimmten Sache sucht, landet ungern auf
        einer Sammelseite, auf der seine Frage im dritten Absatz steht. Eine
        Seite je Leistung ist außerdem der ehrlichste Weg, Suchmaschinen zu
        zeigen, worum es geht, ohne Schlagworte zu stapeln.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>Berichte</p>
      <h2 data-rise>Im Klartext, einmal im Monat.</h2>
      <p class="muted" data-rise>
        Kein Diagrammfriedhof aus einem Werkzeug, das niemand liest.
      </p>
    </div>
    <dl class="facts mono" data-rise>
      <div><dt>Was drin steht</dt><dd>Was wir gemacht haben</dd></div>
      <div><dt>Und</dt><dd>Was sich bewegt hat</dd></div>
      <div><dt>Und</dt><dd>Was als Nächstes dran ist</dd></div>
      <div><dt>Länge</dt><dd>Eine Seite</dd></div>
    </dl>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>Häufige Fragen</p>
      <h2 data-rise>Was Kunden vorher wissen wollen.</h2>
    </div>
    <div class="steps">%s</div>
  </div>
</section>
</main>
""" % (
        _steps([
            ("Bestandsaufnahme",
             "Wir prüfen, was bereits indexiert ist, wo die Seite technisch "
             "klemmt und über welche Begriffe sie heute gefunden wird. Das "
             "Ergebnis ist eine Liste mit Prioritäten, keine Diagrammsammlung."),
            ("Technik in Ordnung bringen",
             "Ladezeit, Seitenstruktur, Weiterleitungen, doppelte Inhalte, "
             "fehlende Beschreibungen, Auszeichnung für Suchmaschinen. Der "
             "unsichtbare Teil, ohne den der Rest nicht wirkt."),
            ("Suchanfragen klären",
             "Wonach suchen deine Kunden tatsächlich, und mit welchen Worten. "
             "Oft sind es andere als die, die intern benutzt werden. Daraus "
             "ergibt sich, welche Seiten fehlen."),
            ("Inhalte bauen",
             "Für jede wichtige Suchanfrage eine Seite, die sie vollständig "
             "beantwortet. Geschrieben für Menschen, aufgebaut so, dass eine "
             "Maschine den Zusammenhang versteht."),
            ("Messen und nachziehen",
             "Monatlich sehen wir uns an, was sich bewegt hat, und ziehen "
             "nach. SEO ist kein Projekt mit Enddatum, sondern eine Strecke."),
        ]),
        img("abnahme",
            "Zwei Personen sehen gemeinsam Auswertungen und Entwuerfe auf einem "
            "Tisch durch.",
            "(min-width:60rem) 42vw, 92vw", "4x5"),
        _checklist([
            "Keine gekauften Verweise aus Linknetzwerken.",
            "Keine Garantie auf Platzierungen.",
            "Keine Texte, die für Maschinen und nicht für Menschen sind.",
            "Kein Monatspaket ohne nachweisbare Wirkung.",
        ]),
        SITE["city"],
        "".join(
            '<div class="step" data-rise><span class="step-num mono">F%d</span>'
            '<span class="step-h">%s</span><p>%s</p></div>' % (i + 1, esc(q), esc(a))
            for i, (q, a) in enumerate(SEO_FAQ)),
    ))

    body.append(cta_band(
        "Lohnt sich SEO für dich?",
        "Wir sehen uns dein Suchvolumen und deinen Wettbewerb an und sagen "
        "dir, was realistisch ist. Auch wenn die Antwort nein lautet."))

    schema = graph(
        breadcrumb_schema([("Start", "/"), ("SEO", "/seo/")]),
        service_schema("Suchmaschinenoptimierung",
                       "Technisches SEO, Inhalte entlang echter Suchanfragen und "
                       "lokale Sichtbarkeit für kleine und mittlere Unternehmen.",
                       "Suchmaschinenoptimierung"),
        faq_schema(SEO_FAQ))

    return page(
        "seo",
        "SEO ohne Märchen | %s" % SITE["brand"],
        "Suchmaschinenoptimierung aus %s: technisches SEO, Inhalte entlang "
        "echter Suchanfragen, lokale Sichtbarkeit. Ohne Garantieversprechen." % SITE["city"],
        "".join(body), active="seo", schema=schema, og_image="entwurf-1536.webp")
