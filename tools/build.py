# -*- coding: utf-8 -*-
"""Erzeugt alle HTML-Seiten der RuhrCargo-Website aus tools/content.py.

    python3 tools/build.py

Die erzeugten Dateien sind normales, eigenständiges HTML — für den Betrieb
wird dieses Skript nicht gebraucht.
"""
import os, sys, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import (SITE, SERVICES, SERVICE_BY_SLUG, FLEET, STEPS,
                     REASONS, TIMELINE, SECTORS)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
e = html.escape

# ── Bausteine ─────────────────────────────────────────────────────────────
def icon(name, size=17, sw="1.9", cls=""):
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c} width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true"><use href="#{name}"/></svg>')

ARROW = icon("i-arrow")

SPRITE = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <g id="i-sofa"><path d="M4 10V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 12a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5H2z"/><path d="M5 17v2M19 17v2"/></g>
    <g id="i-appliance"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 8h16M8 5.5h.01M11 5.5h.01"/><circle cx="12" cy="14" r="3.5"/></g>
    <g id="i-pallet"><path d="M3 17h18M6 17v3M18 17v3"/><rect x="5.5" y="7.5" width="5.5" height="6"/><rect x="12.5" y="4" width="5.5" height="9.5"/></g>
    <g id="i-bolt"><path d="M13 2 4 14h6.5l-1 8L20 10h-7z"/></g>
    <g id="i-tire"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.8"/><path d="M12 3v5.2M12 15.8V21M3 12h5.2M15.8 12H21"/></g>
    <g id="i-home"><path d="M3 11 12 3l9 8"/><path d="M5.5 9.8V20h13V9.8"/><path d="M10 20v-5.5h4V20"/></g>
    <g id="i-booth"><path d="M3 8h18l-2-4H5z"/><path d="M4.5 8v12h15V8"/><path d="M9.5 20v-6.5h5V20"/></g>
    <g id="i-reha"><circle cx="13.2" cy="3.6" r="1.9"/><path d="M11.6 7.5v5.6h5l2.6 5.4"/><path d="M16.4 16.2A5.6 5.6 0 1 1 10 9.6"/></g>
    <g id="i-plus"><path d="M12 5v14M5 12h14"/></g>
    <g id="i-arrow"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></g>
    <g id="i-chev"><path d="M5 8.5 12 15.5 19 8.5"/></g>
    <g id="i-phone"><path d="M6.4 3h3.1l1.5 3.9-2 1.5a12.3 12.3 0 0 0 5.6 5.6l1.5-2 3.9 1.5v3.1a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.4 5.2 2 2 0 0 1 6.4 3z"/></g>
    <g id="i-mail"><rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="M3.4 6.4 12 13l8.6-6.6"/></g>
    <g id="i-clock"><circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.4 2"/></g>
    <g id="i-check"><path d="M4.5 12.5 9.5 17.5 19.5 6.5"/></g>
    <g id="i-alert"><path d="M12 3 2.2 20.2h19.6z"/><path d="M12 9.5v4.2M12 17h.01"/></g>
    <g id="i-truck"><path d="M2.5 6h11.5v10.5H2.5z"/><path d="M14 9.5h3.7l3.3 3.3v3.7H14z"/><circle cx="7" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/></g>
  </defs>
</svg>'''

NAV = [("leistungen.html", "Leistungen", "leistungen"),
       ("fuhrpark.html",   "Fuhrpark",   "fuhrpark"),
       ("unternehmen.html","Unternehmen","unternehmen"),
       ("ablauf.html",     "Ablauf",     "ablauf")]

def header(base, active):
    subs = "".join(
        f'<li><a class="nav__sub-link" href="{base}leistungen/{s["slug"]}.html">'
        f'{icon(s["icon"], 19, "1.6", "nav__sub-icon")}'
        f'<span><span class="nav__sub-title">{e(s["title"])}</span>'
        f'<span class="nav__sub-text">{e(s["short"])}</span></span></a></li>'
        for s in SERVICES)
    items = ""
    for href, label, key in NAV:
        cur = ' aria-current="page"' if key == active else ""
        act = " is-active" if key == active else ""
        if key == "leistungen":
            items += (f'<li class="nav__item nav__item--has-sub">'
                      f'<a class="nav__link{act}" href="{base}{href}"{cur}>{e(label)}'
                      f'{icon("i-chev", 12, "2.2", "nav__chev")}</a>'
                      f'<div class="nav__sub"><div class="nav__sub-inner"><ul class="nav__sub-list">{subs}</ul>'
                      f'<a class="nav__sub-all" href="{base}leistungen.html">Alle Leistungen im Überblick {ARROW}</a>'
                      f'</div></div></li>')
        else:
            items += f'<li class="nav__item"><a class="nav__link{act}" href="{base}{href}"{cur}>{e(label)}</a></li>'
    return f'''<header class="site-header" id="siteHeader">
  <div class="site-header__inner">
    <a class="logo" href="{base}index.html" aria-label="RuhrCargo GmbH – zur Startseite">
      <img src="{base}assets/logo-wordmark-light.png" alt="RuhrCargo GmbH — Spedition &amp; Logistik" width="520" height="84">
    </a>
    <nav class="nav" aria-label="Hauptnavigation">
      <ul class="nav__list">{items}</ul>
    </nav>
    <div class="header__actions">
      <!-- TODO:KONTAKT -->
      <a class="header__phone" href="tel:{SITE["phone_href"]}">{icon("i-phone", 15, "1.7")}<span>{SITE["phone_display"]}</span></a>
      <a class="btn btn--primary header__cta" href="{base}kontakt.html">Transport anfragen</a>
      <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Menü öffnen">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
</header>'''

def mobile_nav(base):
    subs = "".join(f'<li><a href="{base}leistungen/{s["slug"]}.html">{e(s["title"])}</a></li>' for s in SERVICES)
    main = "".join(
        f'<li><a class="mobile-nav__link" href="{base}{h}"><span class="mono">{i:02d}</span>{e(l)}</a></li>'
        for i, (h, l, k) in enumerate(NAV, start=1))
    return f'''<div class="mobile-nav" id="mobileNav" hidden>
  <nav aria-label="Mobile Navigation">
    <ul class="mobile-nav__list">
      <li><a class="mobile-nav__link" href="{base}index.html"><span class="mono">00</span>Startseite</a></li>
      {main}
      <li><a class="mobile-nav__link" href="{base}kontakt.html"><span class="mono">05</span>Kontakt</a></li>
    </ul>
    <p class="mobile-nav__label">Leistungen im Detail</p>
    <ul class="mobile-nav__subs">{subs}</ul>
  </nav>
  <div class="mobile-nav__foot">
    <a class="mobile-nav__phone" href="tel:{SITE["phone_href"]}">{SITE["phone_display"]}</a>
    <a class="btn btn--primary btn--block" href="{base}kontakt.html">Transport anfragen</a>
  </div>
</div>'''

def footer(base):
    svc = "".join(f'<li><a href="{base}leistungen/{s["slug"]}.html">{e(s["title"])}</a></li>' for s in SERVICES[:5])
    return f'''<footer class="site-footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__col">
        <a class="logo logo--stacked" href="{base}index.html" aria-label="RuhrCargo GmbH – zur Startseite">
          <img src="{base}assets/logo-light.png" alt="RuhrCargo GmbH — Spedition &amp; Logistik" width="760" height="200">
        </a>
        <p class="footer__claim">Spedition und Logistik aus dem Ruhrgebiet. Ihre Ware. Unser Auftrag.</p>
      </div>
      <div class="footer__col">
        <p class="footer__title">Leistungen</p>
        <ul class="footer__list">{svc}<li><a href="{base}leistungen.html">Alle Leistungen</a></li></ul>
      </div>
      <div class="footer__col">
        <p class="footer__title">Unternehmen</p>
        <ul class="footer__list">
          <li><a href="{base}unternehmen.html">Über RuhrCargo</a></li>
          <li><a href="{base}fuhrpark.html">Fuhrpark</a></li>
          <li><a href="{base}ablauf.html">Ablauf</a></li>
          <li><a href="{base}kontakt.html">Kontakt</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <p class="footer__title">Kontakt</p>
        <!-- TODO:KONTAKT -->
        <address>
          {SITE["name"]}<br>{SITE["street"]}<br>{SITE["zip_city"]}<br><br>
          <a href="tel:{SITE["phone_href"]}">{SITE["phone_display"]}</a><br>
          <a href="mailto:{SITE["email"]}">{SITE["email"]}</a>
        </address>
      </div>
    </div>
    <div class="footer__bar">
      <span>© <span id="year">2026</span> {SITE["name"]} · Alle Rechte vorbehalten</span>
      <nav aria-label="Rechtliches">
        <a href="{base}impressum.html">Impressum</a>
        <a href="{base}datenschutz.html">Datenschutz</a>
      </nav>
    </div>
  </div>
</footer>'''

def page(path, title, desc, body, active="", jsonld="", og_img="assets/og-image.jpg"):
    base = "../" * path.count("/")
    canon = SITE["domain"] + "/" + (path if path != "index.html" else "")
    ld = f'\n<script type="application/ld+json">\n{jsonld}\n</script>' if jsonld else ""
    doc = f'''<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#111111">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="{SITE["name"]}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{SITE["domain"]}/{og_img}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{base}assets/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="{base}assets/favicon.png">
<link rel="preload" href="{base}assets/fonts/archivo-500-900-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{base}assets/fonts/inter-400-600-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{base}css/fonts.css">
<link rel="stylesheet" href="{base}css/style.css">{ld}
</head>
<body>
<a class="skip-link" href="#main">Zum Inhalt springen</a>
{SPRITE}
{header(base, active)}
{mobile_nav(base)}
<main id="main">
{body}
</main>
{footer(base)}
<script src="{base}js/main.js" defer></script>
</body>
</html>
'''
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(doc)
    return len(doc)

# ── Wiederverwendbare Abschnitte ──────────────────────────────────────────
def page_hero(eyebrow, title, lead, crumbs, base, img=None, alt=""):
    trail = " ".join(
        f'<li><a href="{base}{h}">{e(l)}</a></li>' if h else f'<li aria-current="page">{e(l)}</li>'
        for l, h in crumbs)
    media = ""
    if img:
        media = (f'<div class="page-hero__media" data-parallax="0.12">'
                 f'<img src="{base}assets/img/{img}.jpg" alt="{e(alt)}" loading="eager" decoding="async">'
                 f'<span class="page-hero__scrim" aria-hidden="true"></span></div>')
    return f'''<section class="page-hero{" page-hero--media" if img else ""}">
  {media}
  <div class="container">
    <div class="page-hero__inner">
      <nav class="crumbs" aria-label="Brotkrumen"><ol>{trail}</ol></nav>
      <p class="eyebrow" data-reveal="fade">{e(eyebrow)}</p>
      <h1 class="page-hero__title" data-reveal style="--d:60">{title}</h1>
      <p class="page-hero__lead" data-reveal style="--d:120">{e(lead)}</p>
    </div>
  </div>
</section>'''

def cta_band(base, title="Sie haben einen Transport.<br>Wir haben die Lösung.",
             text="Beschreiben Sie kurz, was wohin soll – wir melden uns mit einem konkreten Vorschlag zurück."):
    return f'''<section class="section on-dark cta-band">
  <img class="cta-band__mark" src="{base}assets/img/karte-deutschland.jpg" alt="" width="1000" height="625" loading="lazy" aria-hidden="true">
  <div class="container cta-band__inner">
    <div class="cta-band__copy">
      <p class="eyebrow" data-reveal="fade">Kontakt</p>
      <h2 class="cta-band__title" data-reveal style="--d:60">{title}</h2>
      <p class="lead" data-reveal style="--d:110">{e(text)}</p>
    </div>
    <div class="cta-band__actions" data-reveal="right" style="--d:140">
      <a class="btn btn--primary btn--lg" href="{base}kontakt.html">Transport anfragen {ARROW}</a>
      <a class="btn btn--ghost btn--lg" href="tel:{SITE["phone_href"]}">{icon("i-phone", 16, "1.7")} {SITE["phone_display"]}</a>
      <p class="cta-band__note">{SITE["hours"]} · Unverbindlich und kostenlos</p>
    </div>
  </div>
</section>'''

def service_grid(base, limit=None, reveal=True):
    items = SERVICES[:limit] if limit else SERVICES
    out = []
    for i, s in enumerate(items):
        d = (i % 4) * 60
        out.append(f'''<a class="svc" href="{base}leistungen/{s["slug"]}.html" data-reveal="scale" style="--d:{d}">
        <img class="svc__img" src="{base}assets/img/{s["img"]}.jpg" alt="{e(s["img_alt"])}" width="720" height="900" loading="lazy" decoding="async">
        <span class="svc__scrim" aria-hidden="true"></span>
        <span class="svc__top"><span class="svc__num">{s["num"]}</span>{icon(s["icon"], 26, "1.5", "svc__icon")}</span>
        <h3 class="svc__title">{e(s["title"])}</h3>
        <p class="svc__desc">{e(s["teaser"])}</p>
        <span class="svc__go">Mehr erfahren {icon("i-arrow", 13, "2.2")}</span>
      </a>''')
    return '<div class="services">\n      ' + "\n      ".join(out) + '\n    </div>'

# ── Startseite ────────────────────────────────────────────────────────────
def build_index():
    stats = [("20", "+", "Fahrzeuge", "Eigener Fuhrpark – vom Kleintransporter bis zum LKW."),
             ("20", "+", "Jahre Erfahrung", "Gewachsene Routine in Transport und Disposition."),
             (None, None, "Deutschlandweit", "Vom Ruhrgebiet aus in alle Bundesländer unterwegs."),
             ("8", "", "Leistungsbereiche", "Spezialisiert statt Standard – für jede Ladungsart.")]
    stat_html = ""
    for i, (num, suf, label, note) in enumerate(stats):
        val = (f'<span class="stat__num" data-count="{num}" data-suffix="{suf}">0</span>'
               if num else '<span class="stat__num">DE</span>')
        stat_html += (f'<div class="stat" data-reveal style="--d:{i*70}">{val}'
                      f'<span class="stat__label">{e(label)}</span>'
                      f'<span class="stat__note">{e(note)}</span></div>')

    steps = "".join(
        f'<li class="step" data-step data-reveal style="--d:{i*120}">'
        f'<span class="step__num">{n}</span><h3 class="step__title">{e(t)}</h3>'
        f'<p class="step__text">{e(txt)}</p><span class="step__meta">{e(meta)}</span></li>'
        for i, (n, t, meta, txt, _) in enumerate(STEPS))

    reasons = "".join(
        f'<article class="reason" data-reason data-reveal style="--d:{i*110}">'
        f'<span class="reason__idx">{n}</span><h3 class="reason__title">{e(t)}</h3>'
        f'<p class="reason__text">{e(short)}</p></article>'
        for i, (n, t, short, _) in enumerate(REASONS))

    fleet_teaser = "".join(
        f'''<a class="fleet__card{" fleet__card--wide" if f["wide"] else ""}" href="fuhrpark.html#{f["slug"]}" data-fleet data-reveal="{"scale" if f["wide"] else ("left" if i%2 else "right")}">
        <div class="fleet__figure"><img src="assets/img/{f["img"]}.jpg" alt="{e(f["alt"])}" loading="lazy" decoding="async"></div>
        <span class="fleet__scrim" aria-hidden="true"></span>
        <div class="fleet__body">
          <span class="fleet__label">{e(f["label"])}</span>
          <h3 class="fleet__name">{e(f["name"])}</h3>
          <div class="fleet__tags">{"".join(f'<span class="fleet__tag">{e(t)}</span>' for t in f["tags"])}</div>
        </div></a>''' for i, f in enumerate(FLEET[:3]))

    ticker_items = "".join(f'<span class="ticker__item">{e(s["title"])}</span>' for s in SERVICES)

    body = f'''<span id="top"></span>

<section class="hero" id="hero">
  <div class="hero__media" data-parallax="0.16">
    <img src="assets/img/hero.jpg" alt="Sattelzug von RuhrCargo auf der Autobahn im Abendlicht" width="1600" height="900" fetchpriority="high" decoding="async">
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="hero__grid" aria-hidden="true"></div>
  <div class="container hero__inner">
    <div class="hero__body">
      <p class="eyebrow">Spedition &amp; Logistik · Ruhrgebiet · Deutschlandweit</p>
      <h1 class="hero__title">
        <span class="reveal-word" style="--wd:60"><span>Ihre</span></span>
        <span class="reveal-word" style="--wd:130"><span>Ware.</span></span><br>
        <span class="reveal-word" style="--wd:210"><span>Unser</span></span>
        <span class="reveal-word" style="--wd:280"><span>Auftrag<span class="accent">.</span></span></span>
      </h1>
      <p class="hero__lead" data-reveal="fade" style="--d:520">
        Von der Einzelzustellung bis zur individuellen Logistiklösung –
        RuhrCargo bringt Ihre Ware zuverlässig ans Ziel.
      </p>
      <div class="hero__actions" data-reveal="fade" style="--d:640">
        <a class="btn btn--primary btn--lg" href="kontakt.html">Transport anfragen {ARROW}</a>
        <a class="btn btn--ghost btn--lg" href="leistungen.html">Unsere Leistungen</a>
      </div>
    </div>
    <div class="route" data-reveal="fade" style="--d:760">
      <div class="route__track" aria-hidden="true"><span class="route__runner"></span></div>
      <ol class="route__list" aria-label="Ablauf eines Auftrags">
        <li class="route__node"><span class="route__dot" aria-hidden="true"></span><span class="route__label">Auftrag</span><span class="route__meta">Ihre Anfrage</span></li>
        <li class="route__node"><span class="route__dot" aria-hidden="true"></span><span class="route__label">Planung</span><span class="route__meta">Route &amp; Fahrzeug</span></li>
        <li class="route__node"><span class="route__dot" aria-hidden="true"></span><span class="route__label">Transport</span><span class="route__meta">Deutschlandweit</span></li>
        <li class="route__node"><span class="route__dot" aria-hidden="true"></span><span class="route__label">Lieferung</span><span class="route__meta">Termingerecht</span></li>
      </ol>
    </div>
  </div>
</section>

<div class="ticker" aria-hidden="true">
  <div class="ticker__row">
    <div class="ticker__group">{ticker_items}</div>
    <div class="ticker__group">{ticker_items}</div>
  </div>
</div>

<section class="section on-paper" id="leistungen">
  <div class="container">
    <header class="section-head section-head--split">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Leistungen</p>
        <h2 class="h2" data-reveal style="--d:60">Alles, was<br>transportiert werden muss.</h2>
      </div>
      <div data-reveal style="--d:120">
        <p class="lead">Acht Leistungsbereiche, ein Anspruch: Ihre Ware kommt vollständig,
          unbeschädigt und zum vereinbarten Termin an.</p>
        <p style="margin-top:1.1rem"><a class="link-arrow" href="leistungen.html">Alle Leistungen im Detail {icon("i-arrow", 16)}</a></p>
      </div>
    </header>
    {service_grid("")}
  </div>
</section>

<section class="section on-dark" id="konfigurator">
  <div class="container cfg">
    <header class="section-head section-head--split" style="margin-bottom:0">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Schnellauswahl</p>
        <h2 class="h2" data-reveal style="--d:60">Was möchten Sie<br>transportieren?</h2>
      </div>
      <p class="lead" data-reveal style="--d:120">Wählen Sie Ihre Ladung – wir zeigen Ihnen sofort
        die passende Lösung und übernehmen die Auswahl direkt in Ihre Anfrage.</p>
    </header>
    <div class="cfg__chips" id="cfgChips" role="group" aria-label="Art der Ladung wählen" data-reveal="fade">
      {"".join(f'<button class="chip" type="button" data-key="{s["slug"]}" aria-pressed="{"true" if i==0 else "false"}">{icon(s["icon"], 17, "1.6")}{e(s["nav"])}</button>' for i, s in enumerate(SERVICES))}
      <button class="chip" type="button" data-key="sonstiges" aria-pressed="false">{icon("i-plus", 17, "1.6")}Sonstiges</button>
    </div>
    <div class="cfg__panel" data-reveal="fade" style="--d:80">
      <div class="cfg__inner" id="cfgPanel" aria-live="polite"></div>
    </div>
  </div>
</section>

<section class="section on-white" id="unternehmen">
  <div class="container about">
    <div class="about__top">
      <div class="about__copy">
        <p class="eyebrow" data-reveal="fade">Über RuhrCargo</p>
        <h2 class="h2" data-reveal style="--d:60">Seit über 20&nbsp;Jahren<br>auf der Straße.</h2>
        <p class="lead" data-reveal style="--d:110">Was mit einem Fahrzeug begann, ist heute ein Fuhrpark
          mit über 20&nbsp;Fahrzeugen und einem Team, das seit Jahren zusammenarbeitet. Groß genug für
          deutschlandweite Touren – klein genug, dass Sie beim Anruf denselben Ansprechpartner erreichen.</p>
        <p data-reveal style="--d:160;margin-top:.5rem">
          <a class="link-arrow" href="unternehmen.html">Mehr über das Unternehmen {icon("i-arrow", 16)}</a>
        </p>
      </div>
      <figure class="about__media clip-reveal" data-reveal="fade" style="--d:120">
        <img src="assets/img/about.jpg" alt="Das Team von RuhrCargo vor dem Betriebsgelände" width="1100" height="879" loading="lazy" decoding="async">
        <figcaption class="about__badge"><b>20+</b><span>Fahrzeuge im Einsatz</span></figcaption>
      </figure>
    </div>
    <div class="stats">{stat_html}</div>
  </div>
</section>

<section class="band" id="unterwegs" data-band data-reveal="fade" aria-labelledby="band-title">
  <img class="band__img" src="assets/img/band-unterwegs.jpg" alt="LKW von RuhrCargo auf einer Brücke im Abendlicht" width="1700" height="729" loading="lazy" decoding="async">
  <span class="band__scrim" aria-hidden="true"></span>
  <div class="container">
    <div class="band__inner">
      <p class="eyebrow">Im Einsatz</p>
      <h2 class="band__title" id="band-title">Deutschlandweit unterwegs.<br>Jeden Werktag.</h2>
      <p class="band__text">Vom Ruhrgebiet aus in alle 16 Bundesländer – mit festen Ansprechpartnern
        in der Disposition und Fahrzeugen, die zur Ladung passen.</p>
    </div>
  </div>
</section>

<section class="section on-dark process" id="prozess">
  <div class="container">
    <header class="section-head section-head--split">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Ablauf</p>
        <h2 class="h2" data-reveal style="--d:60">Von der Anfrage<br>bis zur Unterschrift.</h2>
      </div>
      <div data-reveal style="--d:120">
        <p class="lead">Vier Schritte, kein Blindflug. Sie wissen jederzeit, wo Ihre Ware steht
          und wer sich darum kümmert.</p>
        <p style="margin-top:1.1rem"><a class="link-arrow link-arrow--light" href="ablauf.html">Ablauf im Detail {icon("i-arrow", 16)}</a></p>
      </div>
    </header>
    <div class="process__track" id="processTrack" aria-hidden="true"><span class="process__fill" id="processFill"></span></div>
    <ol class="steps" id="steps">{steps}</ol>
  </div>
</section>

<section class="section on-paper" id="fuhrpark">
  <div class="container">
    <header class="section-head section-head--split">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Fuhrpark</p>
        <h2 class="h2" data-reveal style="--d:60">Über 20 Fahrzeuge.<br>Für jede Ladung das richtige.</h2>
      </div>
      <div data-reveal style="--d:120">
        <p class="lead">Vom wendigen Kleintransporter für die Direktfahrt bis zum Koffer-LKW mit
          Ladebordwand – wir wählen das Fahrzeug nach der Ware aus, nicht umgekehrt.</p>
        <p style="margin-top:1.1rem"><a class="link-arrow" href="fuhrpark.html">Ganzen Fuhrpark ansehen {icon("i-arrow", 16)}</a></p>
      </div>
    </header>
    <div class="fleet">{fleet_teaser}</div>
  </div>
</section>

<section class="section on-white" id="warum">
  <div class="container">
    <header class="section-head">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Warum RuhrCargo</p>
        <h2 class="h2" data-reveal style="--d:60">Vier Gründe.<br>Mehr braucht es nicht.</h2>
      </div>
    </header>
    <div class="reasons">{reasons}</div>
  </div>
</section>

{cta_band("")}'''

    jsonld = f'''{{
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "name": "{SITE["name"]}",
  "description": "Spedition und Logistik: Neumöbel, Elektrogeräte, Stückgut, Kurierfahrten, Reifenlogistik, Umzüge, Messe- & Ladenbau und Reha-Hilfsmittel.",
  "url": "{SITE["domain"]}/",
  "logo": "{SITE["domain"]}/assets/logo.png",
  "telephone": "{SITE["phone_display"]}",
  "email": "{SITE["email"]}",
  "address": {{"@type": "PostalAddress", "streetAddress": "{SITE["street"]}", "postalCode": "45000", "addressLocality": "Essen", "addressRegion": "NRW", "addressCountry": "DE"}},
  "areaServed": {{"@type": "Country", "name": "Deutschland"}},
  "openingHours": "Mo-Fr 07:00-18:00"
}}'''
    return page("index.html",
                "RuhrCargo GmbH — Spedition & Logistik | Ihre Ware. Unser Auftrag.",
                "RuhrCargo GmbH: Spedition und Logistik aus dem Ruhrgebiet. Neumöbel, Elektrogeräte, Stückgut, Kurierfahrten, Reifenlogistik, Umzüge, Messe- & Ladenbau und Reha-Hilfsmittel – deutschlandweit und termingerecht.",
                body, active="", jsonld=jsonld)

# ── Leistungsübersicht ────────────────────────────────────────────────────
def build_leistungen():
    rows = ""
    for i, s in enumerate(SERVICES):
        flip = " svc-row--flip" if i % 2 else ""
        bullets = "".join(f'<li>{icon("i-check", 15, "2.4")}<span>{e(b)}</span></li>' for b in s["does"][:4])
        rows += f'''<article class="svc-row{flip}" id="{s["slug"]}">
      <div class="svc-row__media clip-reveal" data-reveal="fade">
        <img src="assets/img/{s["img"]}.jpg" alt="{e(s["img_alt"])}" width="720" height="900" loading="lazy" decoding="async">
        <span class="svc-row__num">{s["num"]}</span>
      </div>
      <div class="svc-row__body">
        <p class="eyebrow" data-reveal="fade">{icon(s["icon"], 16, "1.7")} {e(s["nav"])}</p>
        <h2 class="h3 svc-row__title" data-reveal style="--d:60">{e(s["title"])}</h2>
        <p class="lead" data-reveal style="--d:100">{e(s["lead"])}</p>
        <ul class="ticks" data-reveal style="--d:140">{bullets}</ul>
        <p data-reveal style="--d:180">
          <a class="link-arrow" href="leistungen/{s["slug"]}.html">{e(s["title"])} im Detail {icon("i-arrow", 16)}</a>
        </p>
      </div>
    </article>'''
    body = f'''{page_hero("Leistungen", "Acht Bereiche.<br>Ein Anspruch.",
        "Von der Einzelzustellung bis zur wiederkehrenden Tour: Was wir transportieren, transportieren wir mit der Sorgfalt, die die Ware verlangt.",
        [("Startseite", "index.html"), ("Leistungen", None)], "")}

<section class="section on-white">
  <div class="container">
    <div class="svc-rows">{rows}</div>
  </div>
</section>

{cta_band("", "Nicht dabei, was Sie brauchen?<br>Fragen Sie trotzdem.",
  "Ungewöhnliche Maße, besondere Anforderungen oder eine wiederkehrende Tour – wir sagen Ihnen ehrlich, ob und wie wir das fahren.")}'''
    return page("leistungen.html", "Leistungen — RuhrCargo GmbH | Spedition & Logistik",
        "Alle Leistungen der RuhrCargo GmbH im Überblick: Neumöbel, Elektrogeräte, Stückgut, Kurierfahrten, Reifenlogistik, Umzüge, Messe- & Ladenbau und Reha-Hilfsmittel.",
        body, active="leistungen")

# ── Leistungs-Detailseiten ────────────────────────────────────────────────
def build_service(s):
    base = "../"
    does = "".join(f'<li>{icon("i-check", 16, "2.4")}<span>{e(d)}</span></li>' for d in s["does"])
    who = "".join(f'<li>{e(w)}</li>' for w in s["who"])
    vehicles = ""
    for v in s["vehicles"]:
        f = next((x for x in FLEET if x["name"] == v), None)
        if not f: continue
        vehicles += f'''<a class="veh-card" href="{base}fuhrpark.html#{f["slug"]}" data-reveal="scale">
        <img src="{base}assets/img/{f["img"]}.jpg" alt="{e(f["alt"])}" loading="lazy" decoding="async">
        <span class="veh-card__scrim" aria-hidden="true"></span>
        <span class="veh-card__body"><span class="veh-card__label">{e(f["label"])}</span>
        <span class="veh-card__name">{e(f["name"])}</span></span></a>'''
    faq = "".join(f'''<details class="faq__item" data-reveal style="--d:{i*70}">
        <summary class="faq__q"><span>{e(q)}</span>{icon("i-chev", 16, "2", "faq__chev")}</summary>
        <div class="faq__a"><p>{e(a)}</p></div>
      </details>''' for i, (q, a) in enumerate(s["faq"]))
    rel = "".join(
        f'''<a class="rel-card" href="{base}leistungen/{r["slug"]}.html" data-reveal="scale" style="--d:{i*70}">
        {icon(r["icon"], 24, "1.5", "rel-card__icon")}
        <span class="rel-card__title">{e(r["title"])}</span>
        <span class="rel-card__text">{e(r["teaser"])}</span>
        <span class="rel-card__go">Ansehen {icon("i-arrow", 13, "2.2")}</span></a>'''
        for i, r in enumerate(SERVICE_BY_SLUG[x] for x in s["related"]))
    paras = "".join(f'<p data-reveal style="--d:{60+i*40}">{e(p)}</p>' for i, p in enumerate(s["body"]))

    body = f'''{page_hero(f'Leistung {s["num"]}', e(s["title"]), s["lead"],
        [("Startseite", "index.html"), ("Leistungen", "leistungen.html"), (s["title"], None)],
        base, img="kopf-" + s["slug"], alt=s["img_alt"])}

<section class="section on-white">
  <div class="container">
    <div class="prose-split">
      <div class="prose-split__main">{paras}</div>
      <aside class="prose-split__aside" data-reveal="right" style="--d:120">
        <p class="aside__title">Für wen wir fahren</p>
        <ul class="aside__list">{who}</ul>
        <a class="btn btn--dark btn--block" href="{base}kontakt.html">Jetzt anfragen {ARROW}</a>
      </aside>
    </div>
  </div>
</section>

<section class="section section--tight on-paper">
  <div class="container">
    <p class="eyebrow" data-reveal="fade">Leistungsumfang</p>
    <h2 class="h2" data-reveal style="--d:60;margin-top:1rem">Was wir übernehmen</h2>
    <ul class="ticks ticks--grid" data-reveal style="--d:100">{does}</ul>
  </div>
</section>

<section class="section on-dark">
  <div class="container">
    <p class="eyebrow" data-reveal="fade">Passende Fahrzeuge</p>
    <h2 class="h2" data-reveal style="--d:60">Womit wir das fahren</h2>
    <div class="veh-grid">{vehicles}</div>
  </div>
</section>

<section class="section on-white">
  <div class="container">
    <div class="faq-wrap">
      <div class="faq-wrap__head">
        <p class="eyebrow" data-reveal="fade">Häufige Fragen</p>
        <h2 class="h2" data-reveal style="--d:60">Gut zu wissen</h2>
        <p class="lead" data-reveal style="--d:100">Ihre Frage ist nicht dabei? Rufen Sie an –
          das geht schneller als jedes Formular.</p>
        <p data-reveal style="--d:140"><a class="link-arrow" href="tel:{SITE["phone_href"]}">{SITE["phone_display"]} {icon("i-arrow", 16)}</a></p>
      </div>
      <div class="faq">{faq}</div>
    </div>
  </div>
</section>

<section class="section section--tight on-paper">
  <div class="container">
    <p class="eyebrow" data-reveal="fade">Ebenfalls interessant</p>
    <h2 class="h2" data-reveal style="--d:60" >Weitere Leistungen</h2>
    <div class="rel-grid">{rel}</div>
  </div>
</section>

{cta_band(base, f'{e(s["title"])} zu transportieren?<br>Sprechen wir darüber.')}'''
    ld = f'''{{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "{e(s["title"])}",
  "provider": {{"@type": "MovingCompany", "name": "{SITE["name"]}"}},
  "areaServed": {{"@type": "Country", "name": "Deutschland"}},
  "description": "{e(s["lead"])}"
}}'''
    return page(f'leistungen/{s["slug"]}.html',
                f'{s["title"]} — RuhrCargo GmbH | Spedition & Logistik',
                s["lead"][:158], body, active="leistungen", jsonld=ld)

# ── Fuhrpark ──────────────────────────────────────────────────────────────
def build_fuhrpark():
    blocks = ""
    for i, f in enumerate(FLEET):
        flip = " veh-row--flip" if i % 2 else ""
        specs = "".join(f'<div class="spec"><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in f["specs"])
        tags = "".join(f'<span class="fleet__tag fleet__tag--ink">{e(t)}</span>' for t in f["tags"])
        blocks += f'''<article class="veh-row{flip}" id="{f["slug"]}">
      <div class="veh-row__media clip-reveal" data-reveal="fade">
        <img src="assets/img/{f["img"]}.jpg" alt="{e(f["alt"])}" loading="lazy" decoding="async">
      </div>
      <div class="veh-row__body">
        <p class="eyebrow" data-reveal="fade">{e(f["label"])}</p>
        <h2 class="h2 veh-row__title" data-reveal style="--d:60">{e(f["name"])}</h2>
        <p class="lead" data-reveal style="--d:100">{e(f["text"])}</p>
        <dl class="specs" data-reveal style="--d:140">{specs}</dl>
        <div class="fleet__tags" data-reveal style="--d:180">{tags}</div>
      </div>
    </article>'''
    body = f'''{page_hero("Fuhrpark", "Über 20 Fahrzeuge.<br>Für jede Ladung das richtige.",
        "Wir wählen das Fahrzeug nach der Ware aus, nicht umgekehrt. Vier Klassen decken alles ab, was bei uns auf die Straße geht.",
        [("Startseite", "index.html"), ("Fuhrpark", None)], "", img="fuhrpark-lkw",
        alt="LKW von RuhrCargo wird in der Halle mit dem Gabelstapler beladen")}

<section class="section on-white">
  <div class="container"><div class="veh-rows">{blocks}</div></div>
</section>

<section class="section section--tight on-paper">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Nicht sicher?</p>
        <h2 class="h2" data-reveal style="--d:60">Wir wählen das<br>Fahrzeug für Sie aus.</h2>
      </div>
      <div data-reveal style="--d:120">
        <p class="lead">Sie müssen nicht wissen, welche Fahrzeugklasse Sie brauchen. Beschreiben Sie
          uns die Ladung – Maße, Gewicht, Stückzahl – und wir schlagen das passende Fahrzeug vor.</p>
        <p style="margin-top:1.1rem"><a class="link-arrow" href="kontakt.html">Ladung beschreiben {icon("i-arrow", 16)}</a></p>
      </div>
    </div>
  </div>
</section>

{cta_band("")}'''
    return page("fuhrpark.html", "Fuhrpark — RuhrCargo GmbH | Spedition & Logistik",
        "Der Fuhrpark der RuhrCargo GmbH: LKW für Komplettladungen, Koffer-LKW mit Ladebordwand, Möbelkoffer und Kleintransporter – über 20 Fahrzeuge.",
        body, active="fuhrpark")

# ── Unternehmen ───────────────────────────────────────────────────────────
def build_unternehmen():
    tl = "".join(
        f'<article class="tl" data-reveal style="--d:{i*80}"><span class="tl__step">{e(st)}</span>'
        f'<h3 class="tl__title">{e(t)}</h3><p class="tl__text">{e(x)}</p></article>'
        for i, (st, t, x) in enumerate(TIMELINE))
    reasons = "".join(
        f'''<article class="reason-long" data-reveal style="--d:{i*90}">
        <span class="reason__idx">{n}</span>
        <h3 class="reason-long__title">{e(t)}</h3>
        <p class="reason-long__lead">{e(short)}</p>
        <p class="reason-long__text">{e(long)}</p>
      </article>''' for i, (n, t, short, long) in enumerate(REASONS))
    stats = "".join(
        f'<div class="stat" data-reveal style="--d:{i*70}">'
        + (f'<span class="stat__num" data-count="{n}" data-suffix="{s}">0</span>' if n else '<span class="stat__num">DE</span>')
        + f'<span class="stat__label">{e(l)}</span><span class="stat__note">{e(x)}</span></div>'
        for i, (n, s, l, x) in enumerate([
            ("20", "+", "Fahrzeuge", "Eigener Fuhrpark – vom Kleintransporter bis zum LKW."),
            ("20", "+", "Jahre Erfahrung", "Gewachsene Routine in Transport und Disposition."),
            (None, None, "Deutschlandweit", "Vom Ruhrgebiet aus in alle Bundesländer unterwegs."),
            ("8", "", "Leistungsbereiche", "Spezialisiert statt Standard – für jede Ladungsart.")]))
    sectors = "".join(f'<span class="sector">{e(s)}</span>' for s in SECTORS)
    slots = "".join(f'<div class="logo-slot"><span class="logo-slot__mark">Kundenlogo</span>'
                    f'<span class="logo-slot__note">Slot {i:02d}</span></div>' for i in range(1, 7))
    body = f'''{page_hero("Über RuhrCargo", "Seit über 20&nbsp;Jahren<br>auf der Straße.",
        "Was mit einem Fahrzeug begann, ist heute ein Fuhrpark mit über 20 Fahrzeugen und einem Team, das seit Jahren zusammenarbeitet.",
        [("Startseite", "index.html"), ("Unternehmen", None)], "", img="about",
        alt="Das Team von RuhrCargo vor dem Betriebsgelände")}

<section class="section on-white">
  <div class="container">
    <div class="prose-split">
      <div class="prose-split__main">
        <p data-reveal>Wir sind groß genug für deutschlandweite Touren – und klein genug, dass Sie beim
          Anruf denselben Ansprechpartner erreichen. Diese Größe ist kein Zufall, sondern eine
          Entscheidung: Sie erlaubt uns, kurzfristig umzuplanen, ohne dass eine Anfrage durch drei
          Abteilungen wandert.</p>
        <p data-reveal style="--d:50">Vom einzelnen Möbelstück bis zur wiederkehrenden Tour für Industrie
          und Handel planen wir jeden Auftrag so, wie er transportiert werden muss – nicht so, wie es in
          ein Standardraster passt. Was das konkret heißt, sieht man am ehesten daran, worauf wir
          spezialisiert sind: Ladungsarten, die Erfahrung verlangen.</p>
        <p data-reveal style="--d:100">Möbel, Elektrogeräte, Reifen in Saisonmengen, Messebau und
          Hilfsmittel für Sanitätshäuser haben eines gemeinsam: Sie sind entweder empfindlich, sperrig,
          terminkritisch oder alles zusammen. Genau dafür ist unser Fuhrpark zusammengestellt und genau
          dafür ist unser Personal ausgebildet.</p>
      </div>
      <aside class="prose-split__aside" data-reveal="right" style="--d:120">
        <p class="aside__title">Auf einen Blick</p>
        <ul class="aside__list">
          <li>Über 20 eigene Fahrzeuge</li>
          <li>Über 20 Jahre Erfahrung</li>
          <li>Deutschlandweit im Einsatz</li>
          <li>Acht Leistungsbereiche</li>
          <li>Feste Ansprechpartner</li>
        </ul>
        <a class="btn btn--dark btn--block" href="kontakt.html">Sprechen Sie mit uns {ARROW}</a>
      </aside>
    </div>
    <div class="stats" style="margin-top:clamp(3rem,6vw,5rem)">{stats}</div>
  </div>
</section>

<section class="section on-paper">
  <div class="container">
    <p class="eyebrow" data-reveal="fade">Entwicklung</p>
    <h2 class="h2" data-reveal style="--d:60;margin:1rem 0 clamp(2rem,4vw,3rem)">Vom ersten Fahrzeug bis heute</h2>
    <div class="timeline">{tl}</div>
  </div>
</section>

<section class="section on-dark">
  <div class="container">
    <header class="section-head">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Warum RuhrCargo</p>
        <h2 class="h2" data-reveal style="--d:60">Vier Gründe.<br>Ausführlich.</h2>
      </div>
    </header>
    <div class="reasons-long">{reasons}</div>
  </div>
</section>

<section class="section on-white" id="referenzen">
  <div class="container">
    <header class="section-head section-head--split">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Referenzen</p>
        <h2 class="h2" data-reveal style="--d:60">Logistik, auf die<br>Unternehmen vertrauen.</h2>
        <p class="lead" data-reveal style="--d:110">Handel, Industrie, Messebau und Gesundheitswesen:
          Unsere Auftraggeber verbindet, dass ihre Ware verlässlich ankommen muss.</p>
      </div>
      <div class="kpis" data-reveal="right" style="--d:120">
        <div class="kpi"><span class="kpi__num" data-count="20" data-suffix="+">0</span><span class="kpi__label">Jahre<br>am Markt</span></div>
        <div class="kpi"><span class="kpi__num" data-count="20" data-suffix="+">0</span><span class="kpi__label">Fahrzeuge<br>im Einsatz</span></div>
        <div class="kpi"><span class="kpi__num" data-count="16">0</span><span class="kpi__label">Bundesländer<br>beliefert</span></div>
      </div>
    </header>
    <!-- KUNDENLOGOS: Text in .logo-slot__mark durch <img src="assets/img/kunde-01.svg" alt="Firmenname"> ersetzen -->
    <div class="logos" data-reveal="fade">{slots}</div>
    <p class="eyebrow" data-reveal="fade" style="margin:2.5rem 0 1rem">Branchen, für die wir fahren</p>
    <div class="sectors" data-reveal="fade" style="--d:60">{sectors}</div>
  </div>
</section>

{cta_band("")}'''
    return page("unternehmen.html", "Über RuhrCargo — Spedition & Logistik aus dem Ruhrgebiet",
        "Über 20 Jahre Erfahrung, über 20 eigene Fahrzeuge, deutschlandweit im Einsatz: Das Unternehmen RuhrCargo GmbH, seine Entwicklung und seine Arbeitsweise.",
        body, active="unternehmen")

# ── Ablauf ────────────────────────────────────────────────────────────────
def build_ablauf():
    blocks = ""
    for i, (n, t, meta, txt, bullets) in enumerate(STEPS):
        bl = "".join(f'<li>{icon("i-check", 15, "2.4")}<span>{e(b)}</span></li>' for b in bullets)
        blocks += f'''<article class="step-long" data-step data-reveal style="--d:{i*80}">
      <div class="step-long__mark"><span class="step-long__num">{n}</span></div>
      <div class="step-long__body">
        <p class="eyebrow eyebrow--plain">{e(meta)}</p>
        <h2 class="h3 step-long__title">{e(t)}</h2>
        <p class="lead">{e(txt)}</p>
        <ul class="ticks">{bl}</ul>
      </div>
    </article>'''
    body = f'''{page_hero("Ablauf", "Von der Anfrage<br>bis zur Unterschrift.",
        "Vier Schritte, kein Blindflug. Sie wissen jederzeit, wo Ihre Ware steht und wer sich darum kümmert.",
        [("Startseite", "index.html"), ("Ablauf", None)], "")}

<section class="section on-white process-long">
  <div class="container">
    <div class="process__track process__track--v" id="processTrack" aria-hidden="true"><span class="process__fill" id="processFill"></span></div>
    <div class="steps-long" id="steps">{blocks}</div>
  </div>
</section>

<section class="section on-dark" id="konfigurator">
  <div class="container cfg">
    <header class="section-head section-head--split" style="margin-bottom:0">
      <div class="section-head__title">
        <p class="eyebrow" data-reveal="fade">Schnellauswahl</p>
        <h2 class="h2" data-reveal style="--d:60">Was möchten Sie<br>transportieren?</h2>
      </div>
      <p class="lead" data-reveal style="--d:120">Wählen Sie Ihre Ladung – wir zeigen Ihnen sofort
        die passende Lösung und übernehmen die Auswahl direkt in Ihre Anfrage.</p>
    </header>
    <div class="cfg__chips" id="cfgChips" role="group" aria-label="Art der Ladung wählen" data-reveal="fade">
      {"".join(f'<button class="chip" type="button" data-key="{s["slug"]}" aria-pressed="{"true" if i==0 else "false"}">{icon(s["icon"], 17, "1.6")}{e(s["nav"])}</button>' for i, s in enumerate(SERVICES))}
      <button class="chip" type="button" data-key="sonstiges" aria-pressed="false">{icon("i-plus", 17, "1.6")}Sonstiges</button>
    </div>
    <div class="cfg__panel" data-reveal="fade" style="--d:80">
      <div class="cfg__inner" id="cfgPanel" aria-live="polite"></div>
    </div>
  </div>
</section>

{cta_band("")}'''
    return page("ablauf.html", "Ablauf — So arbeitet RuhrCargo | Spedition & Logistik",
        "Anfrage, Planung, Umsetzung, Lieferung: Wie ein Transportauftrag bei der RuhrCargo GmbH abläuft – Schritt für Schritt erklärt.",
        body, active="ablauf")

# ── Kontakt ───────────────────────────────────────────────────────────────
def build_kontakt():
    opts = "".join(f'<option value="{s["slug"]}">{e(s["title"])}</option>' for s in SERVICES)
    body = f'''{page_hero("Kontakt", "Sie haben einen Transport.<br>Wir haben die Lösung.",
        "Beschreiben Sie kurz, was wohin soll – wir melden uns mit einem konkreten Vorschlag zurück. Lieber direkt sprechen? Rufen Sie an.",
        [("Startseite", "index.html"), ("Kontakt", None)], "")}

<section class="section on-dark contact" id="anfrage">
  <img class="contact__mark" src="assets/img/karte-deutschland.jpg" alt="" width="1000" height="625" loading="lazy" aria-hidden="true">
  <div class="container contact__grid">
    <div class="contact__copy">
      <p class="eyebrow" data-reveal="fade">Direkt erreichen</p>
      <h2 class="h2" data-reveal style="--d:60">Am schnellsten<br>per Telefon.</h2>
      <p class="lead" data-reveal style="--d:110">Für kurzfristige Fahrten und Rückfragen zur Ladung ist
        ein Anruf immer der schnellste Weg. Sie sprechen direkt mit der Disposition.</p>
      <!-- TODO:KONTAKT -->
      <div class="contact__direct" data-reveal style="--d:160">
        <a class="contact__row" href="tel:{SITE["phone_href"]}">{icon("i-phone", 19, "1.7")}
          <span><span class="contact__row-label">Telefon</span><span class="contact__row-value">{SITE["phone_display"]}</span></span></a>
        <a class="contact__row" href="mailto:{SITE["email"]}">{icon("i-mail", 19, "1.7")}
          <span><span class="contact__row-label">E-Mail</span><span class="contact__row-value">{SITE["email"]}</span></span></a>
        <div class="contact__row">{icon("i-clock", 19, "1.7")}
          <span><span class="contact__row-label">Erreichbarkeit</span><span class="contact__row-value">{SITE["hours"]}</span></span></div>
        <div class="contact__row">{icon("i-truck", 19, "1.7")}
          <span><span class="contact__row-label">Anschrift</span><span class="contact__row-value">{SITE["street"]}<br>{SITE["zip_city"]}</span></span></div>
      </div>
    </div>

    <div class="form-card" data-reveal="right" style="--d:140">
      <div class="form-card__head">
        <h2 class="form-card__title">Transport anfragen</h2>
        <p class="form-card__sub">Unverbindlich und in unter zwei Minuten ausgefüllt.</p>
      </div>
      <div class="form-status form-status--ok" id="formOk" role="status">{icon("i-check", 18, "2.2")}
        <span>Vielen Dank – Ihre Anfrage ist unterwegs. Wir melden uns schnellstmöglich bei Ihnen zurück.</span></div>
      <div class="form-status form-status--err" id="formErr" role="alert">{icon("i-alert", 18, "1.9")}
        <span id="formErrText">Das hat leider nicht geklappt. Bitte rufen Sie uns kurz an oder schreiben Sie an {SITE["email"]}.</span></div>

      <form class="form-grid" id="anfrageForm" novalidate>
        <div class="field">
          <label for="f-was">Was soll transportiert werden? <span class="req">*</span></label>
          <select id="f-was" name="ladung" required>{opts}<option value="sonstiges">Sonstiges</option></select>
        </div>
        <div class="form-row2">
          <div class="field"><label for="f-von">Abholung (PLZ / Ort) <span class="req">*</span></label>
            <input id="f-von" name="von" type="text" autocomplete="address-level2" placeholder="45127 Essen" required>
            <span class="field__error">Bitte Abholort angeben.</span></div>
          <div class="field"><label for="f-nach">Zustellung (PLZ / Ort) <span class="req">*</span></label>
            <input id="f-nach" name="nach" type="text" autocomplete="address-level2" placeholder="10115 Berlin" required>
            <span class="field__error">Bitte Zielort angeben.</span></div>
        </div>
        <div class="form-row2">
          <div class="field"><label for="f-name">Name <span class="req">*</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" placeholder="Vor- und Nachname" required>
            <span class="field__error">Bitte Namen angeben.</span></div>
          <div class="field"><label for="f-firma">Firma</label>
            <input id="f-firma" name="firma" type="text" autocomplete="organization" placeholder="optional"></div>
        </div>
        <div class="form-row2">
          <div class="field"><label for="f-mail">E-Mail <span class="req">*</span></label>
            <input id="f-mail" name="email" type="email" autocomplete="email" placeholder="name@firma.de" required>
            <span class="field__error">Bitte gültige E-Mail-Adresse angeben.</span></div>
          <div class="field"><label for="f-tel">Telefon</label>
            <input id="f-tel" name="telefon" type="tel" autocomplete="tel" placeholder="für Rückfragen"></div>
        </div>
        <div class="field"><label for="f-termin">Wunschtermin</label>
          <input id="f-termin" name="termin" type="date"></div>
        <div class="field"><label for="f-text">Details zur Ladung</label>
          <textarea id="f-text" name="nachricht" rows="4" placeholder="Maße, Gewicht, Stückzahl, Etage, Besonderheiten …"></textarea></div>
        <div class="field field--check">
          <input id="f-dsgvo" name="datenschutz" type="checkbox" required>
          <label for="f-dsgvo">Ich habe die <a href="datenschutz.html">Datenschutzerklärung</a> gelesen und bin mit der
            Verarbeitung meiner Daten zur Bearbeitung der Anfrage einverstanden. <span class="req">*</span></label>
          <span class="field__error">Bitte bestätigen Sie die Datenschutzerklärung.</span></div>
        <div class="visually-hidden" aria-hidden="true">
          <label for="f-website">Website nicht ausfüllen</label>
          <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <button class="btn btn--primary btn--lg btn--block" type="submit" id="formSubmit">
          <span>Transport anfragen</span>{ARROW}</button>
        <p class="form-note">Unverbindlich und kostenlos · Ihre Angaben nutzen wir nur für diese Anfrage</p>
      </form>
    </div>
  </div>
</section>'''
    return page("kontakt.html", "Kontakt — RuhrCargo GmbH | Transport anfragen",
        "Transport anfragen bei der RuhrCargo GmbH: Anfrageformular, Telefonnummer und Erreichbarkeit. Wir melden uns mit einem konkreten Vorschlag zurück.",
        body, active="kontakt")

# ── Rechtsseiten ──────────────────────────────────────────────────────────
def build_legal():
    from legal import IMPRESSUM, DATENSCHUTZ
    n = 0
    for path, title, txt in [("impressum.html", "Impressum", IMPRESSUM),
                             ("datenschutz.html", "Datenschutzerklärung", DATENSCHUTZ)]:
        body = f'''<section class="legal section">
  <div class="container">
    <nav class="crumbs" aria-label="Brotkrumen"><ol>
      <li><a href="index.html">Startseite</a></li><li aria-current="page">{e(title)}</li>
    </ol></nav>
    <p class="eyebrow" data-reveal="fade">Rechtliches</p>
    <h1 class="h2" data-reveal style="--d:60;margin:1rem 0 2.5rem">{e(title)}</h1>
    <div class="legal__body" data-reveal style="--d:100">
{txt}
    </div>
  </div>
</section>'''
        n += page(path, f"{title} — {SITE['name']}", f"{title} der {SITE['name']}.", body)
    return n

# ── Lauf ──────────────────────────────────────────────────────────────────
def main():
    total, pages = 0, 0
    for name, fn in [("Startseite", build_index), ("Leistungen", build_leistungen),
                     ("Fuhrpark", build_fuhrpark), ("Unternehmen", build_unternehmen),
                     ("Ablauf", build_ablauf), ("Kontakt", build_kontakt)]:
        n = fn(); total += n; pages += 1
        print(f"  {name:14} {n/1024:6.1f} KB")
    for s in SERVICES:
        n = build_service(s); total += n; pages += 1
        print(f"  ↳ {s['slug']:12} {n/1024:6.1f} KB")
    n = build_legal(); total += n; pages += 2
    print(f"  Rechtstexte    {n/1024:6.1f} KB")
    print(f"\n{pages} Seiten, {total/1024:.0f} KB HTML")

if __name__ == "__main__":
    main()
