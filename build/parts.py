# -*- coding: utf-8 -*-
"""Zentrale Bausteine aller Seiten.

Blueprint-Regel: Korrekturen gehoeren IMMER hierher, nie in eine generierte
HTML-Datei. Sonst ist der Fix beim naechsten Build weg.
"""
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Bei jeder Designaenderung hochziehen. Verhindert, dass der Kunde eine
# alte Fassung aus dem Cache sieht und einen Fehler meldet, der keiner ist.
CSS_VER = 1

# ── Stammdaten ───────────────────────────────────────────────────────────────
# TODO_ECHTDATEN markiert alles, was vor dem Livegang ersetzt werden muss.
# validate.py zaehlt diese Marker und meldet sie.
SITE = {
    "brand":      "Netzexpert",
    "tagline":    "Webdesign / SEO",
    "domain":     "netzexpert.de",                      # TODO_ECHTDATEN
    "url":        "https://netzexpert.de",              # TODO_ECHTDATEN
    "email":      "hallo@netzexpert.de",                # TODO_ECHTDATEN
    "phone_disp": "+49 000 000000",                     # TODO_ECHTDATEN
    "phone_href": "+4900000000",                        # TODO_ECHTDATEN
    "street":     "Musterstrasse 1",                    # TODO_ECHTDATEN
    "zip":        "00000",                              # TODO_ECHTDATEN
    "city":       "Musterstadt",                        # TODO_ECHTDATEN
    "region":     "NRW",                                # TODO_ECHTDATEN
    "owner":      "Vorname Nachname",                   # TODO_ECHTDATEN
    "founded":    "2019",                               # TODO_ECHTDATEN
}

NAV = [
    ("Webdesign",  "/webdesign/",  "webdesign"),
    ("SEO",        "/seo/",        "seo"),
    ("Prozess",    "/prozess/",    "prozess"),
    ("Über uns",   "/ueber-uns/",  "ueber-uns"),
]

_MANIFEST = None


def manifest():
    global _MANIFEST
    if _MANIFEST is None:
        with open(os.path.join(BASE, "assets/img/manifest.json"), encoding="utf-8") as fh:
            _MANIFEST = json.load(fh)
    return _MANIFEST


def esc(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace('"', "&quot;"))


# ── Bilder ───────────────────────────────────────────────────────────────────
def img(key, alt, sizes, ratio="3x2", classes="", reveal=True, eager=False, delay=None):
    """Ein Bild als <picture> mit beiden Formaten, echten Maßen und Platzhalter.

    alt wird immer bewusst gesetzt: leeres alt wird von Pruefwerkzeugen als
    fehlend gewertet, auch bei dekorativen Bildern.
    """
    rec = manifest()[key]
    avif = ", ".join("/assets/img/%s %dw" % (v["file"], v["w"]) for v in rec["avif"])
    webp = ", ".join("/assets/img/%s %dw" % (v["file"], v["w"]) for v in rec["webp"])
    fallback = rec["webp"][1]["file"] if len(rec["webp"]) > 1 else rec["webp"][0]["file"]

    style = "--lqip:var(--lqip-%s)" % key
    if delay:
        style += "; --reveal-delay:%dms" % delay

    attrs = ' data-reveal' if reveal else ''
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    cls = ("plate plate-%s %s" % (ratio, classes)).strip()

    return (
        '<div class="%s"%s style="%s">'
        '<picture>'
        '<source type="image/avif" sizes="%s" srcset="%s">'
        '<img src="/assets/img/%s" width="%d" height="%d" sizes="%s" srcset="%s" '
        'alt="%s" %s decoding="async">'
        '</picture></div>'
    ) % (cls, attrs, style, sizes, avif, fallback, rec["width"], rec["height"],
         sizes, webp, esc(alt), loading)


# ── Kopf ─────────────────────────────────────────────────────────────────────
MONOGRAM = ('<svg viewBox="0 0 116 128" fill="currentColor" aria-hidden="true" focusable="false">'
            '<path d="M0 24 24 0v128H0z"/><path d="M30 0h18l68 128H98z"/>'
            '<path d="M92 0h24v128H92z"/></svg>')

ARROW = ('<svg class="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" '
         'stroke="currentColor" stroke-width="1.5" aria-hidden="true">'
         '<path d="M2 7h10M8 3l4 4-4 4"/></svg>')

CHECK = ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" '
         'aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8"/></svg>')


def brand(with_slot_id=False):
    slot_id = ' id="brand-slot"' if with_slot_id else ''
    return (
        '<a class="brand" href="/" aria-label="%s, zur Startseite">'
        '<span class="brand-slot"%s>%s</span>'
        '<span class="brand-rule" aria-hidden="true"></span>'
        '<span class="brand-text">'
        '<span class="brand-name"><b>Netz</b>expert</span>'
        '<span class="brand-tag">Webdesign / SEO</span>'
        '</span></a>'
    ) % (SITE["brand"], slot_id, MONOGRAM)


def header(active):
    links = []
    for label, href, key in NAV:
        cur = ' aria-current="page"' if key == active else ''
        links.append('<a href="%s"%s>%s</a>' % (href, cur, label))

    drop_cur = ' aria-current="page"' if active in ("webdesign", "seo") else ''
    nav_links = (
        '<div class="nav-drop">'
        '<a href="/webdesign/"%s>Leistungen</a>'
        '<div class="nav-drop-menu">'
        '<a href="/webdesign/">Webdesign</a>'
        '<a href="/seo/">SEO</a>'
        '</div></div>'
    ) % drop_cur + "".join(links[2:])

    menu_items = "".join(
        '<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if k == active else '', l)
        for l, h, k in NAV
    )

    return (
        '<a class="skip-link mono" href="#inhalt">Zum Inhalt springen</a>\n'
        '<header class="masthead" id="masthead">\n'
        '  %s\n'
        '  <nav class="nav" aria-label="Hauptnavigation">\n'
        '    <div class="nav-links">%s</div>\n'
        '    <a class="nav-cta" href="/kontakt/">Projekt starten %s</a>\n'
        '    <button class="nav-toggle" type="button" id="nav-toggle" '
        'aria-expanded="false" aria-controls="nav-menu">'
        '<span></span><span></span><span class="visually-hidden">Menü</span></button>\n'
        '  </nav>\n'
        '  <div class="nav-menu" id="nav-menu" data-open="false">%s'
        '<a href="/kontakt/"%s>Kontakt</a></div>\n'
        '</header>\n'
    ) % (brand(with_slot_id=True), nav_links, ARROW, menu_items,
         ' aria-current="page"' if active == "kontakt" else '')


# ── Fuß ──────────────────────────────────────────────────────────────────────
def footer():
    return (
        '<footer class="shell">\n'
        '  <div class="colophon">\n'
        '    <div>%s<p class="muted" style="margin-block-start:var(--space-4);max-width:34ch">'
        'Individuelles Webdesign und ehrliche Suchmaschinenoptimierung für '
        'Unternehmen, die sich von einer Vorlage nicht mehr vertreten fühlen.</p></div>\n'
        '    <div><span class="footer-h mono">Leistungen</span><ul role="list">'
        '<li><a href="/webdesign/">Webdesign</a></li>'
        '<li><a href="/seo/">SEO</a></li>'
        '<li><a href="/prozess/">Prozess</a></li>'
        '</ul></div>\n'
        '    <div><span class="footer-h mono">Kontakt</span><ul role="list">'
        '<li><a href="mailto:%s">%s</a></li>'
        '<li><a href="tel:%s">%s</a></li>'
        '<li><a href="/ueber-uns/">Über uns</a></li>'
        '</ul></div>\n'
        '  </div>\n'
        '  <div class="colophon-base mono">\n'
        '    <p>© <span id="jahr">2026</span> %s</p>\n'
        '    <ul role="list" style="display:flex;gap:var(--space-6)">'
        '<li><a href="/impressum/">Impressum</a></li>'
        '<li><a href="/datenschutz/">Datenschutz</a></li></ul>\n'
        '  </div>\n'
        '</footer>\n'
    ) % (brand(), SITE["email"], SITE["email"], SITE["phone_href"],
         SITE["phone_disp"], SITE["brand"])


# ── Seitengerüst ─────────────────────────────────────────────────────────────
def page(slug, title, description, body, active="", schema=None,
         noindex=False, og_image="atelier-1536.webp", light_footer=False):
    canonical = SITE["url"] + ("/" if slug == "index" else "/%s/" % slug)
    robots = '<meta name="robots" content="noindex,nofollow">\n' if noindex else ''
    schema_block = ""
    if schema:
        schema_block = '<script type="application/ld+json">%s</script>\n' % json.dumps(
            schema, ensure_ascii=False, separators=(",", ":"))

    return """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
{robots}<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#0d0c0b">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="{brand}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{url}/assets/img/{og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{url}/assets/img/{og}">
<link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/archivo-var-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/ibm-plex-mono-400-latin.woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fonts.css?v={ver}">
<link rel="stylesheet" href="/assets/css/lqip.css?v={ver}">
<link rel="stylesheet" href="/assets/css/site.css?v={ver}">
<script>document.documentElement.classList.add('js');</script>
{schema}</head>
<body>
{header}
{body}
{footer}
<script src="/assets/js/site.js?v={ver}" type="module"></script>
</body>
</html>
""".format(title=esc(title), desc=esc(description), robots=robots, canonical=canonical,
           brand=SITE["brand"], url=SITE["url"], og=og_image, ver=CSS_VER,
           schema=schema_block, header=header(active), body=body, footer=footer())


# ── Schema ───────────────────────────────────────────────────────────────────
def org_schema():
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": SITE["url"] + "/#organisation",
        "name": SITE["brand"],
        "url": SITE["url"] + "/",
        "email": SITE["email"],
        "telephone": SITE["phone_disp"],
        "foundingDate": SITE["founded"],
        "founder": {"@type": "Person", "name": SITE["owner"]},
        "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE["street"],
            "postalCode": SITE["zip"],
            "addressLocality": SITE["city"],
            "addressCountry": "DE",
        },
        "areaServed": {"@type": "AdministrativeArea", "name": SITE["region"]},
        "knowsAbout": ["Webdesign", "Suchmaschinenoptimierung", "Webentwicklung",
                       "Barrierefreiheit", "Core Web Vitals"],
    }


def breadcrumb_schema(trail):
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name,
             "item": SITE["url"] + href}
            for i, (name, href) in enumerate(trail)
        ],
    }


def faq_schema(pairs):
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in pairs
        ],
    }


def service_schema(name, description, service_type):
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": name,
        "description": description,
        "serviceType": service_type,
        "provider": {"@id": SITE["url"] + "/#organisation"},
        "areaServed": {"@type": "AdministrativeArea", "name": SITE["region"]},
    }


def graph(*items):
    """Mehrere Schema-Objekte in einem Block."""
    return {"@context": "https://schema.org",
            "@graph": [{k: v for k, v in it.items() if k != "@context"} for it in items]}


# ── Bausteine für die Seiten ─────────────────────────────────────────────────
def breadcrumb(trail):
    items = []
    for i, (name, href) in enumerate(trail):
        last = i == len(trail) - 1
        if last:
            items.append('<li><span aria-current="page">%s</span></li>' % esc(name))
        else:
            items.append('<li><a href="%s">%s</a></li>' % (href, esc(name)))
    return ('<nav class="breadcrumb mono" aria-label="Brotkrumennavigation">'
            '<ol>%s</ol></nav>' % "".join(items))


def sub_hero(h1, lede, image_key, image_alt, trail):
    return (
        '<section class="sub-hero">\n'
        '  <div class="sub-hero-media">%s</div>\n'
        '  <div class="shell">\n'
        '    %s\n'
        '    <h1>%s</h1>\n'
        '    <p class="lede">%s</p>\n'
        '  </div>\n'
        '</section>\n'
    ) % (img(image_key, image_alt, "100vw", "16x9", reveal=False, eager=True),
         breadcrumb(trail), esc(h1), lede)


def cta_band(heading="Bereit für etwas Besseres?",
             text="Erzähl uns kurz, worum es geht. Du bekommst eine ehrliche "
                  "Einschätzung, ob und wie sich das für dich rechnet."):
    return (
        '<section class="cta-band light">\n'
        '  <div class="shell">\n'
        '    <h2>%s</h2>\n'
        '    <p>%s</p>\n'
        '    <div class="hero-actions">'
        '<a class="btn btn-primary" href="/kontakt/">Projekt starten'
        '<span class="visually-hidden"> und Erstgespräch vereinbaren</span> %s</a>'
        '<a class="btn btn-ghost" href="/prozess/">So arbeiten wir</a>'
        '</div>\n'
        '  </div>\n'
        '</section>\n'
    ) % (esc(heading), esc(text), ARROW)
