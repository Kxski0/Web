#!/usr/bin/env python3
"""ClearWay Gebäudeservice – statischer Seiten-Generator.

Setzt Header, Navigation, Footer, SEO-Head und strukturierte Daten zentral in
alle Seiten ein. Aufruf:  python3 _src/build.py   (aus dem Ordner clearway/)

Die fertigen HTML-Dateien werden direkt nach clearway/ geschrieben und sind
ohne Build-Schritt nutzbar. Änderungen IMMER hier bzw. in _src/pages/ machen,
nie in den generierten Dateien.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # clearway/
SRC = os.path.join(ROOT, "_src")
PAGES = os.path.join(SRC, "pages")
PARTIALS = os.path.join(SRC, "partials")

# ---------------------------------------------------------------------------
# Zentrale Unternehmensdaten (NAP). Nichts erfinden: Felder, die noch nicht
# vom Kunden bestätigt sind, bleiben None und werden auf der Website als
# klar markierte Platzhalter gerendert bzw. weggelassen.
# ---------------------------------------------------------------------------
COMPANY = {
    "name": "ClearWay Gebäudeservice",
    "claim": "Klar. Sauber. Zuverlässig.",
    "street": "Friedrichstraße 108",
    "zip": "71638",
    "city": "Ludwigsburg",
    "region": "Ludwigsburg und Umgebung",
    "phone": None,          # z. B. "+49 7141 123456" – erst nach Bestätigung
    "phone_display": None,  # z. B. "07141 123456"
    "email": None,          # z. B. "info@..." – erst nach Bestätigung
}

# Produktions-Domain. Solange sie nicht feststeht, leer lassen: Canonical,
# og:url und sitemap.xml werden dann ohne absolute Domain erzeugt bzw. beim
# Setzen der Domain automatisch vervollständigt (danach neu bauen!).
BASE_URL = ""

CSS_VERSION = "1"

SERVICES = [
    ("fensterreinigung.html", "Fenster- & Glasreinigung"),
    ("fassadenreinigung.html", "Fassadenreinigung"),
    ("hochdruckreinigung.html", "Hochdruckreinigung"),
    ("terrassenreinigung.html", "Terrassen- & Steinflächenreinigung"),
    ("bodenreinigung.html", "Bodenreinigung"),
    ("treppenhausreinigung.html", "Treppenhausreinigung & Kehrwoche"),
    ("aussenpflege.html", "Außenpflege & Laubbeseitigung"),
    ("gewerbereinigung.html", "Gewerbe- & Unterhaltsreinigung"),
]


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def phone_block(cls=""):
    """Telefon-Markup – nur wenn eine bestätigte Nummer vorliegt."""
    if COMPANY["phone"]:
        return (f'<a class="phone-link {cls}" href="tel:{COMPANY["phone"]}">'
                f'<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">'
                f'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" '
                f'stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
                f'{COMPANY["phone_display"]}</a>')
    return ""


def nav_dropdown():
    items = "\n".join(
        f'          <li><a href="{href}">{label}</a></li>' for href, label in SERVICES
    )
    return items


def breadcrumb(meta):
    """Sichtbare Breadcrumbs + BreadcrumbList-Schema für Unterseiten."""
    trail = meta.get("breadcrumb")
    if not trail:
        return "", None
    crumbs = [("index.html", "Startseite")] + trail
    lis = []
    schema_items = []
    for i, (href, label) in enumerate(crumbs):
        last = i == len(crumbs) - 1
        if last:
            lis.append(f'<li aria-current="page">{label}</li>')
        else:
            lis.append(f'<li><a href="{href}">{label}</a></li>')
        item = {"@type": "ListItem", "position": i + 1, "name": label}
        if not last:
            item["item"] = (BASE_URL + "/" + href) if BASE_URL else href
        schema_items.append(item)
    html = ('<nav class="breadcrumb" aria-label="Pfad"><div class="shell"><ol>'
            + "".join(lis) + "</ol></div></nav>")
    schema = {"@context": "https://schema.org", "@type": "BreadcrumbList",
              "itemListElement": schema_items}
    return html, schema


def local_business_schema():
    schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": COMPANY["name"],
        "slogan": COMPANY["claim"],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": COMPANY["street"],
            "postalCode": COMPANY["zip"],
            "addressLocality": COMPANY["city"],
            "addressCountry": "DE",
        },
        "areaServed": COMPANY["region"],
    }
    if COMPANY["phone"]:
        schema["telephone"] = COMPANY["phone"]
    if COMPANY["email"]:
        schema["email"] = COMPANY["email"]
    if BASE_URL:
        schema["url"] = BASE_URL + "/"
    return schema


def service_schema(meta):
    schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": meta["service_name"],
        "serviceType": meta["service_name"],
        "description": meta["description"],
        "areaServed": COMPANY["region"],
        "provider": {"@type": "ProfessionalService", "name": COMPANY["name"]},
    }
    return schema


def faq_schema(body):
    """FAQPage-Schema nur aus tatsächlich sichtbaren FAQ-Elementen erzeugen."""
    pairs = re.findall(
        r'<summary[^>]*>\s*<span class="faq-q">(.*?)</span>.*?</summary>\s*'
        r'<div class="faq-a">(.*?)</div>',
        body, re.S)
    if not pairs:
        return None
    def strip_tags(s):
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": strip_tags(q),
             "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}}
            for q, a in pairs
        ],
    }


def build_page(fname, base, header, footer):
    raw = read(os.path.join(PAGES, fname))
    m = re.match(r"\s*<!--META\s*(\{.*?\})\s*META-->\s*", raw, re.S)
    if not m:
        sys.exit(f"{fname}: META-Block fehlt")
    meta = json.loads(m.group(1))
    body = raw[m.end():]

    schemas = []
    for kind in meta.get("schema", []):
        if kind == "localbusiness":
            schemas.append(local_business_schema())
        elif kind == "service":
            schemas.append(service_schema(meta))
        elif kind == "contactpage":
            schemas.append({
                "@context": "https://schema.org", "@type": "ContactPage",
                "name": meta["title"], "description": meta["description"],
            })
        elif kind == "faq":
            s = faq_schema(body)
            if s:
                schemas.append(s)

    crumb_html, crumb_schema = breadcrumb(meta)
    if crumb_schema:
        schemas.append(crumb_schema)

    schema_html = "\n".join(
        '<script type="application/ld+json">' + json.dumps(s, ensure_ascii=False)
        + "</script>" for s in schemas)

    canonical = ""
    og_url = ""
    if BASE_URL and not meta.get("noindex"):
        page_url = BASE_URL + "/" + ("" if fname == "index.html" else fname)
        canonical = f'<link rel="canonical" href="{page_url}">'
        og_url = f'<meta property="og:url" content="{page_url}">'

    robots = '<meta name="robots" content="noindex, nofollow">' if meta.get("noindex") else ""

    og_image = meta.get("og_image", "assets/img/fenster-glasfassade-abziehen-1600.webp")
    if BASE_URL:
        og_image_url = BASE_URL + "/" + og_image
    else:
        og_image_url = og_image

    html = base
    replacements = {
        "{{TITLE}}": meta["title"],
        "{{DESCRIPTION}}": meta["description"],
        "{{CANONICAL}}": canonical,
        "{{OG_URL}}": og_url,
        "{{ROBOTS}}": robots,
        "{{OG_IMAGE}}": og_image_url,
        "{{BODY_CLASS}}": meta.get("body_class", ""),
        "{{NAV_PAGE}}": meta.get("nav", ""),
        "{{SCHEMA}}": schema_html,
        "{{BREADCRUMB}}": crumb_html,
        "{{HEADER}}": header,
        "{{FOOTER}}": footer,
        "{{CONTENT}}": body,
        "{{CSSV}}": CSS_VERSION,
        "{{CLAIM}}": COMPANY["claim"],
    }
    for key, val in replacements.items():
        html = html.replace(key, val)

    # Aktiven Navigationspunkt markieren
    nav_page = meta.get("nav", "")
    if nav_page:
        html = html.replace(f'data-nav="{nav_page}"',
                            f'data-nav="{nav_page}" aria-current="page"')

    write(os.path.join(ROOT, fname), html)
    return meta


def build_sitemap(pages):
    urls = []
    for fname, meta in pages:
        if meta.get("noindex"):
            continue
        loc = (BASE_URL + "/" + ("" if fname == "index.html" else fname)) if BASE_URL \
            else ("/" if fname == "index.html" else "/" + fname)
        urls.append(f"  <url><loc>{loc}</loc></url>")
    comment = "" if BASE_URL else "\n<!-- Hinweis: BASE_URL in _src/build.py setzen und neu bauen, sobald die Domain feststeht. -->"
    write(os.path.join(ROOT, "sitemap.xml"),
          '<?xml version="1.0" encoding="UTF-8"?>' + comment +
          '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
          + "\n".join(urls) + "\n</urlset>\n")
    write(os.path.join(ROOT, "robots.txt"),
          "User-agent: *\nAllow: /\n"
          + (f"Sitemap: {BASE_URL}/sitemap.xml\n" if BASE_URL else "Sitemap: /sitemap.xml\n"))


def main():
    base = read(os.path.join(SRC, "base.html"))
    header = read(os.path.join(PARTIALS, "header.html"))
    footer = read(os.path.join(PARTIALS, "footer.html"))

    # Partials mit dynamischen Teilen füllen
    header = header.replace("{{NAV_DROPDOWN}}", nav_dropdown())
    header = header.replace("{{PHONE_NAV}}", phone_block("nav-phone"))
    footer_services = "\n".join(
        f'        <li><a href="{href}">{label}</a></li>' for href, label in SERVICES)
    footer = footer.replace("{{FOOTER_SERVICES}}", footer_services)
    if COMPANY["phone"]:
        footer = footer.replace("{{PHONE_FOOTER}}", phone_block())
    else:
        footer = footer.replace('<p class="footer-phone">{{PHONE_FOOTER}}</p>', "")
    footer = footer.replace(
        "{{EMAIL_FOOTER}}",
        f'<a href="mailto:{COMPANY["email"]}">{COMPANY["email"]}</a>' if COMPANY["email"]
        else '<span class="placeholder-data">E-Mail folgt in Kürze</span>')
    footer = footer.replace("{{ADDRESS}}",
                            f'{COMPANY["street"]}<br>{COMPANY["zip"]} {COMPANY["city"]}')
    footer = footer.replace("{{CLAIM}}", COMPANY["claim"])

    built = []
    for fname in sorted(os.listdir(PAGES)):
        if fname.endswith(".html"):
            meta = build_page(fname, base, header, footer)
            built.append((fname, meta))
            print("gebaut:", fname)
    build_sitemap(built)
    print("gebaut: sitemap.xml, robots.txt")


if __name__ == "__main__":
    main()
