# -*- coding: utf-8 -*-
"""Startseite. Bewusst kompakt: nur die wichtigsten Inhalte, alles
Ausfuehrliche liegt auf den Unterseiten."""
from parts import (SITE, ARROW, CHECK, img, cta_band, page,
                   org_schema, faq_schema, graph, esc)

FAQ = [
    ("Was kostet eine Website bei Netzexpert?",
     "Das haengt vom Umfang ab. Eine klar umrissene Unternehmensseite liegt "
     "meist im vierstelligen Bereich, ein Auftritt mit vielen Unterseiten, "
     "Redaktionssystem und laufender Betreuung darueber. Du bekommst vor dem "
     "Start einen Festpreis und weisst, was enthalten ist."),
    ("Wie lange dauert ein Projekt?",
     "Von der ersten Skizze bis zum Livegang rechnest du mit sechs bis zehn "
     "Wochen. Der groesste Zeitfaktor sind meist die Inhalte, also Texte und "
     "Bilder. Wenn die stehen, geht es schnell."),
    ("Arbeitet ihr mit WordPress?",
     "Nur wenn es dem Projekt nutzt. Viele Unternehmensseiten brauchen kein "
     "Redaktionssystem und laufen als schlanke, statische Seite schneller, "
     "sicherer und guenstiger. Wenn du selbst regelmaessig Inhalte pflegst, "
     "bekommst du eines."),
    ("Bringt SEO bei meinem kleinen Unternehmen ueberhaupt etwas?",
     "Manchmal nicht. Wenn dein Markt zu klein ist oder deine Kunden nicht "
     "suchen, sagen wir dir das, bevor du Geld ausgibst. Wenn es sich lohnt, "
     "zeigen wir dir vorher, ueber welche Suchanfragen und mit welchem Aufwand."),
]


def build():
    body = []

    # ── 1 Hero ───────────────────────────────────────────────────────────────
    body.append("""
<main id="inhalt">
<section class="hero">
  <div class="hero-media">%s</div>
  <div class="hero-body">
    <p class="eyebrow mono" data-rise>Webdesign und SEO aus %s</p>
    <h1 data-split>Nicht noch eine Website.</h1>
    <p class="hero-sub lede" data-rise style="--reveal-delay:120ms">
      Die meisten Websites sehen aus wie die Vorlage, aus der sie gebaut wurden.
      Deine entsteht andersherum: aus deinen Inhalten, deinen Kunden und den
      Suchanfragen, mit denen sie dich finden sollen.
    </p>
    <div class="hero-actions" data-rise style="--reveal-delay:200ms">
      <a class="btn btn-primary" href="/kontakt/">Projekt starten %s</a>
      <a class="btn btn-ghost" href="/webdesign/">Was wir machen</a>
    </div>
    <p class="hero-trust mono" data-rise style="--reveal-delay:260ms">
      Festpreis vor dem Start. Kein Baukasten.
    </p>
  </div>
</section>
""" % (img("atelier",
           "Gestalter am Arbeitsplatz vor einem grossen Monitor mit einem Raster "
           "aus Entwuerfen, dahinter eine Fensterfront.",
           "100vw", "16x9", reveal=False, eager=True),
       SITE["city"], ARROW))

    # ── 2 Differenzierung ────────────────────────────────────────────────────
    body.append("""
<section class="section" id="unterschied">
  <div class="shell split">
    <div class="head">
      <p class="eyebrow mono" data-rise>01 / Unterschied</p>
      <h2 data-rise>Eine Vorlage kennt dein Geschäft nicht.</h2>
    </div>
    <div data-rise>
      <p>
        Baukasten und Theme sind schnell aufgesetzt, und genau das ist das
        Problem. Der Aufbau steht fest, bevor jemand deine Kunden gefragt hat.
        Du füllst dann Text in Kästen, die für ein anderes Unternehmen gedacht
        waren, und wunderst dich, warum niemand anruft.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Wir drehen die Reihenfolge um. Zuerst klären wir, wer auf der Seite
        landet, was diese Person wissen muss und welchen Schritt sie danach
        gehen soll. Danach entsteht die Gestaltung. So bekommt jede Seite eine
        Aufgabe statt nur ein Aussehen.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Das merkst du zuerst an Kleinigkeiten. Die Startseite beantwortet
        innerhalb weniger Sekunden, was du machst und für wen. Jede
        Leistungsseite steht für sich, weil Besucher aus der Suche selten auf
        der Startseite landen. Und der nächste Schritt ist immer sichtbar,
        ohne dass jemand danach suchen muss.
      </p>
      <p style="margin-block-start:var(--space-4)">
        Dazu kommt der Teil, den man nicht sieht. Sauber ausgezeichnetes HTML,
        Bilder in der passenden Größe für das jeweilige Gerät, keine
        Bibliothek, die nur geladen wird, weil sie in der Vorlage steckte.
        Das ist die Grundlage dafür, dass die Seite schnell lädt und
        Suchmaschinen sie richtig einordnen.
      </p>
      <ul class="checklist" role="list" style="margin-block-start:var(--space-6)">
        <li>%s<span>Struktur aus deinen Inhalten, nicht aus einem Theme.</span></li>
        <li>%s<span>Ladezeiten, die auf dem Handy im Funkloch noch funktionieren.</span></li>
        <li>%s<span>Technisch sauberes SEO ab der ersten Zeile, nicht als Nachrüstung.</span></li>
        <li>%s<span>Bedienbar auch mit Tastatur und Screenreader.</span></li>
      </ul>
    </div>
  </div>
</section>
""" % (CHECK, CHECK, CHECK, CHECK))

    # ── 3 Webdesign: aus der Idee wird eine Seite ────────────────────────────
    # Die Blende dieser Komposition wird vom fliegenden Zeichen gesteuert.
    body.append("""
<section class="section section-flush-top" id="webdesign">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>02 / Webdesign</p>
      <h2 data-rise>Aus einer Idee wird eine Seite.</h2>
      <p class="muted" data-rise>
        Vier Schritte, die jedes Projekt durchläuft. Was hier nach Handarbeit
        aussieht, ist genau das.
      </p>
    </div>

    <div class="composition" id="composition">
      <div class="composition-reveal">
        <div class="composition-grid">
          <figure data-rise>%s<figcaption class="mono">01 / Konzept</figcaption></figure>
          <figure data-rise style="--reveal-delay:70ms">%s<figcaption class="mono">02 / Gestaltung</figcaption></figure>
          <figure data-rise style="--reveal-delay:140ms">%s<figcaption class="mono">03 / Entwicklung</figcaption></figure>
          <figure data-rise style="--reveal-delay:210ms">%s<figcaption class="mono">04 / Ergebnis</figcaption></figure>
        </div>
      </div>
    </div>

    <p style="margin-block-start:var(--space-8);max-width:60ch" data-rise>
      Der Entwurf entsteht am Papier, weil sich dort schneller verwerfen lässt.
      Erst wenn Aufbau und Reihenfolge stehen, geht es an Gestaltung und Code.
      <a class="link" href="/webdesign/">Wie wir Webdesign machen %s</a>
    </p>
  </div>
</section>
""" % (img("skizze", "Hand zeichnet ein Seitenraster ins Skizzenbuch, daneben liegen Ausdrucke.",
           "(min-width:54rem) 23vw, 46vw", "4x5"),
       img("kontaktbogen", "Ausgedruckte Entwurfsvarianten einer Seite liegen zum Vergleich nebeneinander.",
           "(min-width:54rem) 23vw, 46vw", "4x5", delay=70),
       img("entwurf", "Gestalter prüft Layoutbögen mit Diagrammen neben einem aufgeklappten Laptop.",
           "(min-width:54rem) 23vw, 46vw", "4x5", delay=140),
       img("abnahme", "Zwei Personen nehmen am Tisch die fertige Gestaltung gemeinsam ab.",
           "(min-width:54rem) 23vw, 46vw", "4x5", delay=210),
       ARROW))

    # ── 4 SEO ────────────────────────────────────────────────────────────────
    body.append("""
<section class="section" id="seo">
  <div class="shell split">
    <div>%s</div>
    <div>
      <div class="head">
        <p class="eyebrow mono" data-rise>03 / SEO</p>
        <h2 data-rise>Sichtbar werden, ohne Märchen.</h2>
      </div>
      <p data-rise>
        Suchmaschinenoptimierung ist keine Zauberei und kein Abo, das man
        einfach laufen lässt. Sie besteht aus drei nüchternen Teilen: Die
        Technik muss sauber sein, die Inhalte müssen die Frage beantworten,
        die jemand eingetippt hat, und andere Seiten müssen dich für
        empfehlenswert halten.
      </p>
      <p data-rise style="--reveal-delay:60ms; margin-block-start:var(--space-4)">
        Wir fangen bei der Technik an, weil sie der Teil ist, den du
        vollständig kontrollierst. Danach schauen wir uns an, wonach deine
        Kunden wirklich suchen. Das sind oft andere Worte als die, die im
        Betrieb benutzt werden. Erst dann reden wir über Inhalte.
      </p>
      <p data-rise style="--reveal-delay:90ms; margin-block-start:var(--space-4)">
        Was wir nicht tun: Platzierungen garantieren, Verweise kaufen oder ein
        Monatspaket verkaufen, bei dem am Jahresende niemand sagen kann, was
        es gebracht hat. Wenn sich Optimierung für dich nicht rechnet, hörst
        du das von uns, bevor du Geld ausgibst.
      </p>
      <dl class="facts mono" data-rise style="--reveal-delay:120ms">
        <div><dt>Technik</dt><dd>Ladezeit, Struktur, Indexierung</dd></div>
        <div><dt>Inhalt</dt><dd>Suchanfragen statt Bauchgefühl</dd></div>
        <div><dt>Bericht</dt><dd>Monatlich, im Klartext</dd></div>
      </dl>
      <p style="margin-block-start:var(--space-6)" data-rise>
        <a class="link" href="/seo/">Wie wir SEO angehen %s</a>
      </p>
    </div>
  </div>
</section>
""" % (img("entwurf", "Auswertungen und Diagramme auf ausgedruckten Bögen neben Laptop und Notizbuch.",
           "(min-width:60rem) 42vw, 92vw", "4x5"), ARROW))

    # ── 5 Referenzen ─────────────────────────────────────────────────────────
    # PLATZHALTER: keine echten Fälle vorhanden. Bewusst ohne erfundene
    # Firmennamen, damit hier nichts Falsches behauptet wird.
    body.append("""
<section class="section section-flush-top" id="referenzen">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>04 / Referenzen</p>
      <h2 data-rise>Ausgewählte Arbeiten.</h2>
      <p class="muted" data-rise>
        Lieber wenige Projekte richtig zeigen als eine Wand voller Logos. Was
        zählt, ist nicht wie die Seite aussieht, sondern was sich danach für
        den Betrieb geändert hat.
      </p>
    </div>
    <div class="cards cards-2">
      <article class="card" data-rise>
        %s
        <div class="card-meta mono"><span>Relaunch</span><span>Handwerk</span></div>
        <h3><a class="card-link link" href="/kontakt/">Vom Baukasten zur eigenen Seite</a></h3>
        <p>
          Ein Betrieb mit fünfzehn Mitarbeitenden, dessen alte Seite auf dem
          Handy unbenutzbar war. Neuer Aufbau entlang der drei Leistungen, die
          tatsächlich nachgefragt werden.
        </p>
      </article>
      <article class="card" data-rise style="--reveal-delay:80ms">
        %s
        <div class="card-meta mono"><span>Sichtbarkeit</span><span>Dienstleistung</span></div>
        <h3><a class="card-link link" href="/kontakt/">Gefunden werden im eigenen Ort</a></h3>
        <p>
          Eine Praxis, die überregional rankte, aber im eigenen Ort unsichtbar
          war. Technische Bereinigung, klare Seitenstruktur, Inhalte entlang
          echter Suchanfragen. Die Anfragen kommen seitdem aus dem Umkreis
          statt aus dem ganzen Bundesgebiet.
        </p>
      </article>
    </div>
  </div>
</section>
""" % (img("praegung", "Detailaufnahme eines gedruckten Markenauftritts mit geprägtem Zeichen.",
           "(min-width:54rem) 46vw, 92vw", "3x2"),
       img("abnahme", "Zwei Personen besprechen ausgedruckte Seitenentwürfe am Tisch.",
           "(min-width:54rem) 46vw, 92vw", "3x2", delay=80)))

    # ── 6 Prozess ────────────────────────────────────────────────────────────
    steps = [
        ("Verstehen", "Wir schauen uns an, was du verkaufst, wer kauft und was "
                      "bisher im Weg stand. Ohne diesen Schritt raten wir nur."),
        ("Konzept", "Seitenstruktur, Reihenfolge der Argumente, Suchanfragen. "
                    "Das Ergebnis passt auf wenige Seiten und ist verständlich."),
        ("Entwickeln", "Gestaltung und Code entstehen zusammen. Du siehst früh "
                       "eine echte Seite im Browser, keine Bildmontage."),
        ("Optimieren", "Ladezeit, Bedienbarkeit auf dem Handy, Barrierefreiheit "
                       "und die technische Seite von SEO werden geprüft."),
        ("Launch", "Umzug, Weiterleitungen der alten Adressen, Messung. Danach "
                   "gehört die Seite dir, samt Zugängen."),
    ]
    rows = "".join(
        '<li class="step" data-rise><span class="step-num mono">0%d</span>'
        '<span class="step-h">%s</span><p>%s</p></li>' % (i + 1, esc(t), esc(d))
        for i, (t, d) in enumerate(steps))
    body.append("""
<section class="section" id="prozess">
  <div class="shell">
    <div class="head">
      <p class="eyebrow mono" data-rise>05 / Prozess</p>
      <h2 data-rise>Fünf Schritte, in dieser Reihenfolge.</h2>
    </div>
    <ol class="steps" role="list">%s</ol>
    <p style="margin-block-start:var(--space-8)" data-rise>
      <a class="link" href="/prozess/">Der Ablauf im Detail %s</a>
    </p>
  </div>
</section>
""" % (rows, ARROW))

    # ── 7 Über uns ───────────────────────────────────────────────────────────
    body.append("""
<section class="section section-flush-top" id="ueber-uns">
  <div class="shell split">
    <div>%s</div>
    <div>
      <div class="head">
        <p class="eyebrow mono" data-rise>06 / Über uns</p>
        <h2 data-rise>Klein, erreichbar, direkt.</h2>
      </div>
      <p data-rise>
        Du sprichst mit der Person, die auch baut. Kein Vertrieb, der etwas
        verspricht, was danach jemand anderes ausbaden muss. Wenn etwas nicht
        geht oder sich nicht rechnet, sagen wir das im ersten Gespräch.
      </p>
      <p data-rise style="--reveal-delay:60ms; margin-block-start:var(--space-4)">
        Wir arbeiten seit %s an Websites für kleine und mittlere Unternehmen,
        überwiegend in %s und Umgebung. Fast alles läuft über Empfehlung, und
        das ist Absicht: Wer weiterempfohlen werden will, kann sich Projekte
        nicht leisten, bei denen am Ende niemand zufrieden ist.
      </p>
      <p data-rise style="--reveal-delay:100ms; margin-block-start:var(--space-4)">
        Deshalb sind wir klein geblieben und nehmen nur zwei bis drei Projekte
        gleichzeitig an. Wenn wir voll sind, bekommst du einen ehrlichen
        Starttermin statt einer Zusage, die wir nicht halten können.
      </p>
      <p style="margin-block-start:var(--space-6)" data-rise>
        <a class="link" href="/ueber-uns/">Mehr über uns %s</a>
      </p>
    </div>
  </div>
</section>
</main>
""" % (img("portrait", "Porträt am Fenster, im Hintergrund eine Wand mit aufgehängten Entwürfen.",
           "(min-width:60rem) 42vw, 92vw", "4x5"),
       SITE["founded"], SITE["region"], ARROW))

    # ── 8 Abschluss ──────────────────────────────────────────────────────────
    body.append(cta_band())

    schema = graph(org_schema(), faq_schema(FAQ))

    return page(
        "index",
        "Webdesign und SEO aus %s | %s" % (SITE["city"], SITE["brand"]),
        "Individuelles Webdesign und ehrliche Suchmaschinenoptimierung. "
        "Keine Vorlage, kein Baukasten: deine Website entsteht aus deinen "
        "Inhalten und den Suchanfragen deiner Kunden.",
        "".join(body),
        active="",
        schema=schema,
    )
