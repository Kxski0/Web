# -*- coding: utf-8 -*-
"""Prozess, Ueber uns, Kontakt."""
from parts import (SITE, ARROW, CHECK, img, sub_hero, cta_band, page, esc,
                   breadcrumb_schema, faq_schema, graph, org_schema)


def _steps(items, prefix="0"):
    return "".join(
        '<li class="step" data-rise><span class="step-num mono">%s%d</span>'
        '<span class="step-h">%s</span><p>%s</p></li>' % (prefix, i + 1, esc(t), esc(d))
        for i, (t, d) in enumerate(items))


def _checklist(items):
    from parts import CHECK as C
    return '<ul class="checklist" role="list">%s</ul>' % "".join(
        '<li>%s<span>%s</span></li>' % (C, esc(t)) for t in items)


# ══ PROZESS ══════════════════════════════════════════════════════════════════
def prozess():
    body = [sub_hero(
        "So läuft ein Projekt ab",
        "Fünf Schritte, feste Reihenfolge, klare Übergaben. Du weißt an jedem "
        "Punkt, was gerade passiert und was von dir gebraucht wird.",
        "abnahme",
        "Zwei Personen nehmen gemeinsam ausgedruckte Entwuerfe an einem Tisch ab.",
        [("Start", "/"), ("Prozess", "/prozess/")])]

    body.append("""
<main id="inhalt">
<section class="section">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Grundsatz</p>
      <h2 data-rise>Reihenfolge schlägt Geschwindigkeit.</h2>
    </div>
    <div data-rise>
      <p>
        Der Ablauf eines Projekts folgt bei uns immer derselben Reihenfolge.
        Das ist keine Bürokratie, sondern die Lehre aus den Projekten, die
        einmal anders liefen.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Die meisten Projekte, die aus dem Ruder laufen, laufen an derselben
        Stelle aus dem Ruder: Es wird gestaltet, bevor klar ist, was auf die
        Seite soll. Dann wird umgebaut, dann noch einmal, und am Ende ist das
        Budget weg für Runden, die niemand gebraucht hätte.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Deshalb halten wir die Reihenfolge ein, auch wenn es sich am Anfang
        langsamer anfühlt. Jeder Schritt hat ein Ergebnis, das du abnimmst,
        bevor der nächste beginnt. Das kostet dich insgesamt zwei bis drei
        Termine und spart die teuren Schleifen am Ende.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Von der ersten Anfrage bis zum Livegang vergehen typischerweise sechs
        bis zehn Wochen. Der größte Zeitfaktor sind fast immer die Inhalte,
        also Texte, Fotos und Freigaben aus deinem Haus. Die eigentliche
        Umsetzung ist der berechenbare Teil. Wenn ein Termin gehalten werden
        muss, sagen wir dir früh, welcher Schritt dafür wann fertig sein muss.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell">
    <ol class="steps" role="list">%s</ol>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div>%s</div>
    <div>
      <div class="head">
        <p class="eyebrow mono" data-rise>Deine Rolle</p>
        <h2 data-rise>Was wir von dir brauchen.</h2>
      </div>
      <p data-rise>
        Am wichtigsten ist jemand, der entscheiden darf. Projekte werden nicht
        durch schwierige Technik langsam, sondern durch Rückfragen, die drei
        Wochen auf eine Antwort warten. Ein fester Ansprechpartner mit
        Entscheidungsbefugnis ist mehr wert als jedes Werkzeug.
      </p>
      <p data-rise style="margin-block-start:var(--space-4)">
        Inhalte müssen nicht fertig sein. Die meisten Kunden haben Bruchstücke:
        alte Texte, ein paar Fotos, viel im Kopf. Daraus etwas zu machen ist
        Teil unserer Arbeit. Was du mitbringen solltest, sind ehrliche
        Antworten im Konzeptgespräch, auch auf unbequeme Fragen.
      </p>
      <div style="margin-block-start:var(--space-6)" data-rise>%s</div>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Danach</p>
      <h2 data-rise>Was nach dem Livegang passiert.</h2>
    </div>
    <div data-rise>
      <p>
        Mit dem Umzug ist die Arbeit nicht zu Ende, aber sie ändert ihren
        Charakter. In den ersten Wochen beobachten wir, ob alte Adressen
        richtig umgeleitet werden, ob die Seite sauber indexiert wird und wo
        Besucher abspringen. Das sind meist Kleinigkeiten, die schnell
        behoben sind, wenn jemand hinsieht.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Danach entscheidest du, ob du die Seite selbst weiterführst oder ob wir
        das übernehmen. Beides ist in Ordnung. Du bekommst alle Zugänge, den
        Quellcode und die Bilddateien, und bist an nichts gebunden. Eine
        laufende Betreuung ist ein Angebot, keine Voraussetzung dafür, dass
        deine Seite online bleibt.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Verzögert wird ein Projekt fast nie durch Technik. Es verzögert sich,
        wenn Texte auf Freigabe warten, wenn Fotos fehlen oder wenn eine
        Entscheidung durch drei Ebenen muss. Deshalb sagen wir am Anfang, was
        wir wann von dir brauchen, und erinnern daran, bevor es knapp wird.
        Wenn etwas nicht rechtzeitig kommt, verschieben wir lieber den Termin
        als die Qualität.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Jeder der fünf Schritte endet mit einer Abnahme. Das ist kein
        Formular, sondern eine kurze Rückmeldung von dir, dass der Stand
        passt. Erst danach beginnt der nächste Schritt. Der Sinn dahinter ist
        einfach: Ein Fehler im Konzept kostet eine Stunde, derselbe Fehler
        nach der Umsetzung kostet eine Woche. Wer früh genau hinsieht, spart
        sich später die teuren Runden.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Zwischen den Schritten arbeiten wir am Stück und nicht in kleinen
        Portionen über Wochen verteilt. Das hat einen praktischen Grund: Wer
        sich alle drei Tage neu in ein Projekt hineindenkt, verliert mehr Zeit
        mit dem Hineindenken als mit der Arbeit. Für dich heißt das kürzere
        Wartezeiten zwischen den Ständen, die du zu sehen bekommst.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Wenn du dich für die Betreuung entscheidest, umfasst sie Aktualisierungen,
        Überwachung der Erreichbarkeit, kleine Änderungen und den monatlichen
        Bericht. Was darüber hinausgeht, stimmen wir vorher ab, damit auf der
        Rechnung nichts steht, womit du nicht gerechnet hast.
      </p>
    </div>
  </div>
</section>
</main>
""" % (
        _steps([
            ("Verstehen",
             "Ein Gespräch von etwa einer Stunde. Was verkaufst du, wer kauft, "
             "was lief bisher schief, was soll die Seite bewirken. Danach "
             "wissen wir, ob wir zueinander passen. Ergebnis: ein kurzes "
             "Angebot mit Festpreis."),
            ("Konzept",
             "Seitenstruktur, Reihenfolge der Argumente, Suchanfragen, "
             "Bildbedarf. Das Ergebnis passt auf wenige Seiten und ist so "
             "geschrieben, dass du es verstehst, ohne im Fach zu sein. Du "
             "gibst es frei, bevor gestaltet wird."),
            ("Entwickeln",
             "Gestaltung und Umsetzung entstehen zusammen. Du bekommst früh "
             "eine Adresse, unter der du den echten Stand im Browser ansehen "
             "kannst, auf dem Handy wie am Rechner. Rückmeldungen sammeln wir "
             "gebündelt statt einzeln."),
            ("Optimieren",
             "Ladezeit, Bedienbarkeit mit Tastatur, Kontraste, Verhalten auf "
             "kleinen Bildschirmen und die technische Seite von SEO werden "
             "geprüft und nachgezogen. Das ist ein eigener Schritt, kein "
             "Nebenbei."),
            ("Launch",
             "Umzug auf deine Domain, Weiterleitung aller alten Adressen, "
             "Anmeldung bei den Suchmaschinen, Einrichtung der Messung. "
             "Danach gehören dir Seite, Code und Zugänge."),
        ]),
        img("skizze",
            "Hand skizziert ein Seitenraster, daneben liegen ausgedruckte Entwuerfe.",
            "(min-width:60rem) 42vw, 92vw", "4x5"),
        _checklist([
            "Eine Person, die entscheiden darf.",
            "Ehrliche Antworten im Konzeptgespräch.",
            "Zugang zu Domain und bisherigem Hoster.",
            "Vorhandene Texte und Bilder, auch unfertige.",
        ]),
    ))

    body.append(cta_band())

    schema = graph(
        breadcrumb_schema([("Start", "/"), ("Prozess", "/prozess/")]))

    return page("prozess", "Ablauf eines Projekts | %s" % SITE["brand"],
                "Fünf Schritte von der ersten Frage bis zum Livegang: Verstehen, "
                "Konzept, Entwickeln, Optimieren, Launch. Mit klaren Übergaben.",
                "".join(body), active="prozess", schema=schema,
                og_image="abnahme-1536.webp")


# ══ ÜBER UNS ═════════════════════════════════════════════════════════════════
def ueber_uns():
    body = [sub_hero(
        "Klein, erreichbar, direkt",
        "Du sprichst mit der Person, die auch baut. Kein Vertrieb, der etwas "
        "verspricht, das später jemand anderes ausbaden muss.",
        "portrait",
        "Portraet am Fenster, im Hintergrund eine Wand mit aufgehaengten Entwuerfen.",
        [("Start", "/"), ("Über uns", "/ueber-uns/")])]

    body.append("""
<main id="inhalt">
<section class="section">
  <div class="shell split">
    <div>%s</div>
    <div>
      <div class="head">
        <p class="eyebrow mono" data-rise>Wer wir sind</p>
        <h2 data-rise>%s</h2>
      </div>
      <p data-rise>
        <span class="todo">TODO_ECHTDATEN</span> Hier gehört ein persönlicher
        Absatz hin: Wer du bist, wie du zu diesem Beruf gekommen bist und
        warum dich schlechte Websites ärgern. Zwei bis drei Sätze in eigener
        Sprache wirken mehr als jede Agenturformulierung, und
        Suchmaschinen bewerten erkennbare Urheberschaft inzwischen mit.
      </p>
      <p data-rise style="margin-block-start:var(--space-4)">
        Netzexpert arbeitet seit %s an Websites für kleine und mittlere
        Unternehmen, überwiegend in %s und Umgebung. Der Großteil der Projekte
        kommt über Empfehlung, und das ist Absicht: Wer weiterempfohlen werden
        will, kann sich Projekte nicht leisten, bei denen am Ende niemand
        zufrieden ist.
      </p>
      <dl class="facts mono" data-rise style="margin-block-start:var(--space-8)">
        <div><dt>Seit</dt><dd>%s</dd></div>
        <div><dt>Sitz</dt><dd>%s</dd></div>
        <div><dt>Schwerpunkt</dt><dd>Webdesign und SEO</dd></div>
        <div><dt>Sprachen</dt><dd>Deutsch, Englisch</dd></div>
      </dl>
      <p data-rise style="margin-block-start:var(--space-8)">
        Wir sind bewusst klein geblieben. Das heißt: keine Abteilung zwischen
        dir und der Umsetzung, dafür auch keine zehn Projekte gleichzeitig.
        Zwei bis drei laufen parallel, mehr nicht. Wenn wir voll sind, sagen
        wir dir einen ehrlichen Starttermin, statt anzunehmen und dich
        anschließend warten zu lassen.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Haltung</p>
      <h2 data-rise>Warum wir manchmal absagen.</h2>
    </div>
    <div data-rise>
      <p>
        Nicht jedes Projekt ist ein gutes Projekt. Wenn jemand eine Seite für
        nächste Woche braucht, wenn das Budget nur für die Hälfte reicht oder
        wenn sich abzeichnet, dass fünf Personen mitentscheiden wollen und
        keine davon zuständig ist, sagen wir ab. Das ist für beide Seiten
        billiger als ein Projekt, das nach drei Monaten stillsteht.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Dasselbe gilt für SEO. Wenn dein Markt zu klein ist oder deine Kunden
        schlicht nicht suchen, verkaufen wir dir keine Optimierung. Wir sagen
        dir, woher deine Anfragen sonst kommen könnten, und du gibst dein Geld
        dort aus. Ein ehrliches Nein kostet uns einen Auftrag. Ein unehrliches
        Ja kostet dich ein Jahr.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Was wir dagegen gern machen: Projekte, bei denen jemand etwas
        Handfestes anbietet und wissen will, wie er die Leute erreicht, die
        das brauchen. Da ist die Arbeit konkret, das Ergebnis messbar und die
        Zusammenarbeit meistens angenehm.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>Arbeitsweise</p>
      <h2 data-rise>Vier Dinge, auf die du dich verlassen kannst.</h2>
    </div>
    <ol class="steps" role="list">%s</ol>
  </div>
</section>
</main>
""" % (
        img("portrait", "Portraet am Fenster vor einer Wand mit aufgehaengten Entwuerfen.",
            "(min-width:60rem) 42vw, 92vw", "4x5"),
        esc(SITE["owner"]), SITE["founded"], SITE["region"],
        SITE["founded"], SITE["city"],
        _steps([
            ("Festpreis vor dem Start",
             "Du weißt vor der ersten Rechnung, was das Projekt kostet und was "
             "enthalten ist. Zusätzliches stimmen wir vorher ab."),
            ("Eine Ansprechperson",
             "Dieselbe Person führt das Gespräch, schreibt das Konzept und baut "
             "die Seite. Nichts geht auf dem Weg verloren."),
            ("Alles gehört dir",
             "Code, Bilder, Zugänge, Domain. Keine Lizenz, die dich bindet, "
             "kein Baukasten, den du monatlich weiterzahlen musst."),
            ("Ehrliche Einschätzung",
             "Auch wenn sie gegen den Auftrag spricht. Das ist der Grund, "
             "warum die meisten Projekte über Empfehlung kommen."),
        ]),
    ))

    body.append("""
<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Werkzeug</p>
      <h2 data-rise>Womit wir arbeiten.</h2>
    </div>
    <div data-rise>
      <p>
        Wir binden uns nicht an ein System, sondern wählen es nach dem
        Projekt. Viele Unternehmensseiten brauchen kein Redaktionssystem und
        laufen als schlanke, direkt ausgelieferte Seite schneller, sicherer
        und günstiger im Betrieb. Wo regelmäßig Inhalte entstehen, bekommst du
        eines, das zu deinem Team passt und nicht umgekehrt.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Beim Bauen halten wir uns an das, was der Browser von sich aus kann.
        Jede zusätzliche Bibliothek muss sich rechtfertigen, weil sie Ladezeit
        kostet, gepflegt werden will und irgendwann veraltet. Das Ergebnis
        sind Seiten, die auch in drei Jahren noch laufen, ohne dass jemand
        monatlich ein Aktualisierungspaket einspielen muss.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Gemessen wird am Ende trotzdem, nicht geschätzt. Ladezeit,
        Bedienbarkeit mit der Tastatur und Kontraste prüfen wir vor der
        Übergabe automatisiert, damit dabei nichts durchrutscht, was man mit
        bloßem Auge übersieht.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Zusammenarbeit</p>
      <h2 data-rise>Wie sich das anfühlt.</h2>
    </div>
    <div data-rise>
      <p>
        Du bekommst zu Beginn einen Zeitplan mit den Terminen, an denen etwas
        von dir gebraucht wird. Dazwischen meldest du dich, wann du willst,
        und bekommst am selben oder am nächsten Tag eine Antwort. Es gibt kein
        Ticketsystem und keine Projektsoftware, in der du dich anmelden musst.
        E-Mail und Telefon reichen bei dieser Größe vollkommen.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Rückmeldungen sammeln wir gebündelt statt einzeln. Das klingt nach
        einer Formalie, macht aber den Unterschied zwischen einem Projekt, das
        vorankommt, und einem, das an dreißig kleinen Zurufen zerfasert. Du
        siehst einen Stand, gehst ihn in Ruhe durch und schickst alles auf
        einmal. Wir arbeiten es ab und zeigen den nächsten.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Was wir nicht tun: unangekündigt Dinge ändern, die du schon abgenommen
        hast. Wenn uns unterwegs etwas Besseres einfällt, schlagen wir es vor
        und du entscheidest. Deine Seite ist am Ende deine Entscheidung, nicht
        unser Portfoliostück.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Und wenn das Projekt vorbei ist, ist es vorbei. Du bekommst alles
        ausgehändigt und bist an nichts gebunden. Sollte in zwei Jahren ein
        anderer Dienstleister übernehmen, findet er eine Seite vor, die er
        lesen und weiterführen kann. Auch das ist eine Form von Qualität,
        auch wenn sie niemand auf den ersten Blick sieht.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Dasselbe gilt für die Inhalte. Texte und Bilder liegen in einer Form
        vor, mit der du weiterarbeiten kannst, nicht nur eingebrannt in ein
        System, das dir nicht gehört. Wir halten es für selbstverständlich,
        dass ein Kunde sein eigenes Material behält, auch wenn das in dieser
        Branche nicht überall so gehandhabt wird.
      </p>
    </div>
  </div>
</section>
""")

    body.append(cta_band())

    schema = graph(
        breadcrumb_schema([("Start", "/"), ("Über uns", "/ueber-uns/")]),
        org_schema())

    return page("ueber-uns", "Über uns | %s" % SITE["brand"],
                "Netzexpert ist eine kleine Werkstatt für Webdesign und SEO in %s. "
                "Eine Ansprechperson, Festpreis vor dem Start, ehrliche "
                "Einschätzung." % SITE["city"],
                "".join(body), active="ueber-uns", schema=schema,
                og_image="portrait-1122.webp")


# ══ KONTAKT ══════════════════════════════════════════════════════════════════
def kontakt():
    body = [sub_hero(
        "Projekt starten",
        "Schreib uns zwei Sätze zu deinem Vorhaben. Du bekommst innerhalb "
        "eines Werktags eine Antwort von der Person, die auch baut.",
        "atelier",
        "Arbeitsplatz mit grossem Monitor und Entwuerfen vor einer Fensterfront.",
        [("Start", "/"), ("Kontakt", "/kontakt/")])]

    body.append("""
<main id="inhalt">
<section class="section">
  <div class="shell">
    <p class="lede" data-rise style="max-width:60ch;margin-block-end:var(--space-8)">
      Der schnellste Kontakt läuft über E-Mail. Wer lieber spricht, ruft an.
      Beides landet direkt bei der Person, die dein Projekt auch bauen würde.
    </p>
    <dl class="contact-cards" data-rise>
      <div class="contact-card">
        <dt class="mono">Schreiben</dt>
        <dd><a class="link" href="mailto:%s">%s</a></dd>
        <p class="muted">Am liebsten mit der Adresse deiner jetzigen Seite.</p>
      </div>
      <div class="contact-card">
        <dt class="mono">Anrufen</dt>
        <dd><a class="link" href="tel:%s">%s</a></dd>
        <p class="muted">Werktags zwischen 9 und 17 Uhr.</p>
      </div>
      <div class="contact-card">
        <dt class="mono">Vorbeikommen</dt>
        <dd>%s, %s %s</dd>
        <p class="muted">Nach Absprache, damit auch jemand da ist.</p>
      </div>
    </dl>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Erstgespräch</p>
      <h2 data-rise>Was dich erwartet.</h2>
    </div>
    <div data-rise>
      <p>
        Das erste Gespräch dauert etwa eine Stunde und kostet nichts. Es geht
        nicht darum, dir etwas zu verkaufen, sondern herauszufinden, ob es
        überhaupt etwas zu verkaufen gibt. Wir fragen, was du anbietest, wer
        heute bei dir kauft, woher diese Leute kommen und was an der jetzigen
        Seite stört.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Danach sagen wir dir, was wir für sinnvoll halten und was nicht. Wenn
        dein Problem gar keine neue Website ist, sondern ein aufgeräumter
        Eintrag im Branchenverzeichnis und drei bessere Fotos, hörst du das
        auch. In dem Fall bekommst du eine kurze Liste und kein Angebot.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Passt es, bekommst du innerhalb weniger Tage ein Angebot mit Festpreis,
        Leistungsumfang und Zeitrahmen. Keine Positionen, die sich später als
        Zusatz herausstellen, und keine Bindung über das Projekt hinaus.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Kein Formular</p>
      <h2 data-rise>Warum hier kein Kontaktformular steht.</h2>
    </div>
    <div data-rise>
      <p>
        Ein Formular sammelt vor allem Werbemüll. Was echte Anfragen angeht,
        bringt es nichts, was eine E-Mail nicht auch bringt, und es erzeugt
        zusätzliche Pflichten: Die Daten laufen über einen Server, müssen
        gespeichert und erklärt werden, und irgendwo braucht es einen Schutz
        gegen automatisierte Einträge, der wiederum Daten an Dritte gibt.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Uns ist ein direkter Weg lieber. Du schreibst aus deinem eigenen
        Programm, wir antworten dorthin zurück, und du hast den Verlauf bei
        dir. Für uns heißt das weniger Datenverarbeitung, für dich heißt es
        eine Antwort von einem Menschen statt einer automatischen Bestätigung.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Einzugsgebiet</p>
      <h2 data-rise>Für wen wir arbeiten.</h2>
    </div>
    <div data-rise>
      <p>
        Der Schwerpunkt liegt in %s und im Umkreis von etwa fünfzig Kilometern.
        Das hat einen praktischen Grund: Beim Konzeptgespräch und bei der
        Abnahme sitzen wir lieber an einem Tisch als in einer Videokonferenz.
        Für Projekte außerhalb geht beides auch aus der Ferne, das sagen wir
        dann vorher.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Typische Kunden sind Handwerksbetriebe, Praxen, Kanzleien, Manufakturen
        und Dienstleister mit einem klaren Einzugsgebiet. Also Unternehmen, bei
        denen eine einzelne Anfrage echtes Geld wert ist und es sich deshalb
        lohnt, über den Weg dorthin genauer nachzudenken.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Vorbereitung</p>
      <h2 data-rise>Was in deine erste Nachricht gehört.</h2>
    </div>
    <div data-rise>
      <p>
        Du musst nichts vorbereiten. Wenn du es trotzdem willst, helfen uns
        drei Dinge, dir sofort etwas Brauchbares zu antworten statt einer
        Rückfrage: die Adresse deiner jetzigen Seite, ein bis zwei Sätze dazu,
        was dich daran stört, und ein grober Zeitrahmen.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Ein Budget ist keine Pflichtangabe, spart aber beiden Seiten Zeit.
        Wenn wir wissen, in welcher Größenordnung du denkst, sagen wir dir
        sofort, ob das zusammenpasst, statt dir ein Angebot zu schicken, das
        an deinen Möglichkeiten vorbeigeht.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Auf jede Nachricht antwortet ein Mensch, in der Regel innerhalb eines
        Werktags. Es gibt keine automatische Eingangsbestätigung und keine
        Warteschleife. Wenn wir gerade keine Kapazität haben, schreiben wir
        dir das ebenfalls und nennen einen realistischen Starttermin.
      </p>
    </div>
  </div>
</section>

<section class="section section-flush-top">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>Kosten</p>
      <h2 data-rise>Was das Ganze kostet.</h2>
    </div>
    <div data-rise>
      <p>
        Eine klar umrissene Unternehmensseite mit fünf bis acht Unterseiten
        liegt meist im mittleren vierstelligen Bereich. Kommen viele
        Leistungsseiten, ein Redaktionssystem oder laufende Betreuung dazu,
        wird es entsprechend mehr. Nach unten gibt es eine Grenze: Unterhalb
        eines gewissen Aufwands ist das Ergebnis nicht besser als eine
        Vorlage, und dann solltest du auch nur eine Vorlage bezahlen.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Den Festpreis nennen wir nach dem Erstgespräch, nicht vorher. Wer eine
        Zahl nennt, bevor er weiß, wie viele Seiten es werden und wer die
        Texte schreibt, rät entweder oder rechnet einen Puffer ein, den du
        mitbezahlst. Im Angebot steht, was enthalten ist und was nicht, damit
        auf der Rechnung nichts auftaucht, womit du nicht gerechnet hast.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Bezahlt wird in zwei bis drei Raten, gebunden an die Abnahmen im
        Ablauf. Laufende Kosten nach dem Livegang sind Hosting und Domain,
        beides läuft auf deinen Namen und liegt üblicherweise im Bereich
        weniger Euro im Monat. Eine Betreuung durch uns ist ein Angebot und
        keine Voraussetzung dafür, dass deine Seite erreichbar bleibt.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Wenn du unsicher bist, ob sich das für dich überhaupt lohnt, ist das
        ein guter Grund für ein Gespräch und kein Grund, es zu lassen. Wir
        rechnen dir im Zweifel vor, wie viele zusätzliche Anfragen eine neue
        Seite bringen müsste, damit sie sich trägt. Wenn diese Zahl in deinem
        Markt unrealistisch ist, hörst du das von uns.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Für den Fall, dass gerade etwas dringend ist: Bei bestehenden Kunden
        gehen Störungsmeldungen vor. Ist deine Seite nicht erreichbar oder
        zeigt sie etwas Falsches, ruf an statt zu schreiben. Alles andere
        beantworten wir gesammelt, aber verlässlich.
      </p>
    </div>
  </div>
</section>
</main>
""" % (SITE["email"], SITE["email"], SITE["phone_href"], SITE["phone_disp"],
       SITE["street"], SITE["zip"], SITE["city"], SITE["city"]))

    schema = graph(
        breadcrumb_schema([("Start", "/"), ("Kontakt", "/kontakt/")]),
        {"@type": "ContactPage",
         "name": "Kontakt",
         "url": SITE["url"] + "/kontakt/",
         "mainEntity": {"@id": SITE["url"] + "/#organisation"}},
        org_schema())

    return page("kontakt", "Kontakt und Erstgespräch | %s" % SITE["brand"],
                "Projekt starten: schreib uns zwei Sätze zu deinem Vorhaben. "
                "Antwort innerhalb eines Werktags, Erstgespräch kostenlos.",
                "".join(body), active="kontakt", schema=schema)
